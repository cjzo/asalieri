export type BibEntry = {
    type: string
    key: string
    fields: Record<string, string>
}

export type ParseResult = {
    entries: BibEntry[]
    errors: string[]
}

const WHITESPACE = /\s/
const FIELD_NAME = /[A-Za-z0-9_-]/
const TYPE_NAME = /[A-Za-z]/

const DIACRITIC_ACUTE: Record<string, string> = { a: 'á', e: 'é', i: 'í', o: 'ó', u: 'ú', y: 'ý', n: 'ń', c: 'ć', s: 'ś', z: 'ź', A: 'Á', E: 'É', I: 'Í', O: 'Ó', U: 'Ú' }
const DIACRITIC_GRAVE: Record<string, string> = { a: 'à', e: 'è', i: 'ì', o: 'ò', u: 'ù', A: 'À', E: 'È', I: 'Ì', O: 'Ò', U: 'Ù' }
const DIACRITIC_UMLAUT: Record<string, string> = { a: 'ä', e: 'ë', i: 'ï', o: 'ö', u: 'ü', y: 'ÿ', A: 'Ä', E: 'Ë', I: 'Ï', O: 'Ö', U: 'Ü' }
const DIACRITIC_CIRCUM: Record<string, string> = { a: 'â', e: 'ê', i: 'î', o: 'ô', u: 'û', A: 'Â', E: 'Ê', I: 'Î', O: 'Ô', U: 'Û' }
const DIACRITIC_TILDE: Record<string, string> = { a: 'ã', n: 'ñ', o: 'õ', A: 'Ã', N: 'Ñ', O: 'Õ' }
const DIACRITIC_CEDILLA: Record<string, string> = { c: 'ç', C: 'Ç', s: 'ş', S: 'Ş' }

function decodeLatex(raw: string): string {
    let s = raw

    // Spacing / dashes / quotes
    s = s.replace(/\\&/g, '&')
        .replace(/\\%/g, '%')
        .replace(/\\_/g, '_')
        .replace(/\\\$/g, '$')
        .replace(/\\#/g, '#')
        .replace(/---/g, '—')
        .replace(/--/g, '–')
        .replace(/``/g, '“')
        .replace(/''/g, '”')

    // Diacritics: \'{a}, \'a, \"{o}, \"o, etc.
    const diacritic = (map: Record<string, string>, cmd: string) => {
        const pattern = new RegExp(`\\\\${cmd}\\{?\\\\?([A-Za-z])\\}?`, 'g')
        s = s.replace(pattern, (_, c: string) => map[c] ?? c)
    }
    diacritic(DIACRITIC_ACUTE, "'")
    diacritic(DIACRITIC_GRAVE, '`')
    diacritic(DIACRITIC_UMLAUT, '"')
    diacritic(DIACRITIC_CIRCUM, '\\^')
    diacritic(DIACRITIC_TILDE, '~')
    diacritic(DIACRITIC_CEDILLA, 'c')

    // Special letters
    s = s.replace(/\\ss\{?\}?/g, 'ß')
        .replace(/\\o\{?\}?/g, 'ø').replace(/\\O\{?\}?/g, 'Ø')
        .replace(/\\ae\{?\}?/g, 'æ').replace(/\\AE\{?\}?/g, 'Æ')
        .replace(/\\aa\{?\}?/g, 'å').replace(/\\AA\{?\}?/g, 'Å')

    // Strip remaining simple commands like \emph{...} or \textit{...} keeping contents
    s = s.replace(/\\(emph|textit|textbf|textsc|mathrm|text)\{([^{}]*)\}/g, '$2')

    // Unwrap leftover single braces that aren't nested
    let prev
    do {
        prev = s
        s = s.replace(/\{([^{}]*)\}/g, '$1')
    } while (s !== prev)

    return s.replace(/\s+/g, ' ').trim()
}

export function parseBibtex(src: string): ParseResult {
    const entries: BibEntry[] = []
    const errors: string[] = []
    let i = 0
    const n = src.length

    const skipWS = () => { while (i < n && WHITESPACE.test(src[i])) i++ }

    while (i < n) {
        while (i < n && src[i] !== '@') i++
        if (i >= n) break
        i++ // skip '@'

        const typeStart = i
        while (i < n && TYPE_NAME.test(src[i])) i++
        const type = src.slice(typeStart, i).toLowerCase()
        if (!type) continue

        skipWS()
        if (src[i] !== '{' && src[i] !== '(') {
            errors.push(`Expected '{' after @${type}`)
            continue
        }
        const close = src[i] === '{' ? '}' : ')'
        i++

        // skip @string/@preamble/@comment wholesale
        if (type === 'string' || type === 'preamble' || type === 'comment') {
            let depth = 1
            while (i < n && depth > 0) {
                if (src[i] === '{') depth++
                else if (src[i] === '}') depth--
                i++
            }
            continue
        }

        skipWS()
        const keyStart = i
        while (i < n && src[i] !== ',' && src[i] !== close) i++
        const key = src.slice(keyStart, i).trim()
        if (src[i] === ',') i++

        const fields: Record<string, string> = {}

        while (i < n) {
            skipWS()
            if (src[i] === close) { i++; break }

            const fStart = i
            while (i < n && FIELD_NAME.test(src[i])) i++
            const fname = src.slice(fStart, i).toLowerCase()
            skipWS()

            if (src[i] !== '=') {
                errors.push(`Expected '=' after field '${fname}' in @${type}{${key}}`)
                // skip to next entry
                while (i < n && src[i] !== '@') i++
                break
            }
            i++
            skipWS()

            let raw = ''
            if (src[i] === '{') {
                let depth = 1
                i++
                const vStart = i
                while (i < n && depth > 0) {
                    if (src[i] === '{') depth++
                    else if (src[i] === '}') { depth--; if (depth === 0) break }
                    i++
                }
                raw = src.slice(vStart, i)
                if (src[i] === '}') i++
            } else if (src[i] === '"') {
                i++
                const vStart = i
                let depth = 0
                while (i < n) {
                    if (src[i] === '{') depth++
                    else if (src[i] === '}') depth--
                    else if (src[i] === '"' && depth === 0) break
                    i++
                }
                raw = src.slice(vStart, i)
                if (src[i] === '"') i++
            } else {
                const vStart = i
                while (i < n && src[i] !== ',' && src[i] !== close && !WHITESPACE.test(src[i])) i++
                raw = src.slice(vStart, i)
            }

            if (fname) fields[fname] = decodeLatex(raw)
            skipWS()
            if (src[i] === ',') { i++; continue }
        }

        if (key) entries.push({ type, key, fields })
    }

    return { entries, errors }
}

export type Author = {
    last: string
    first: string
    von: string
    jr: string
}

/**
 * Parse a BibTeX author field. Splits on " and " and handles
 * "von Last, Jr, First" and "First von Last" name forms.
 */
export function parseAuthors(raw: string): Author[] {
    if (!raw) return []
    const parts = raw.split(/\s+and\s+/i).map(p => p.trim()).filter(Boolean)
    return parts.map(parseOneAuthor)
}

function parseOneAuthor(name: string): Author {
    const segments = name.split(',').map(s => s.trim())
    if (segments.length === 1) {
        // "First von Last"
        const tokens = segments[0].split(/\s+/)
        if (tokens.length === 1) return { last: tokens[0], first: '', von: '', jr: '' }
        const lastIdx = tokens.length - 1
        // "von" tokens are lowercase between first and last
        let vonStart = -1
        let vonEnd = -1
        for (let k = 1; k < lastIdx; k++) {
            if (/^[a-z]/.test(tokens[k])) {
                if (vonStart === -1) vonStart = k
                vonEnd = k
            }
        }
        const first = tokens.slice(0, vonStart === -1 ? lastIdx : vonStart).join(' ')
        const von = vonStart === -1 ? '' : tokens.slice(vonStart, vonEnd + 1).join(' ')
        const last = tokens[lastIdx]
        return { last, first, von, jr: '' }
    }
    if (segments.length === 2) {
        // "Last, First"
        const [lastPart, first] = segments
        const tokens = lastPart.split(/\s+/)
        const vonTokens: string[] = []
        while (tokens.length > 1 && /^[a-z]/.test(tokens[0])) vonTokens.push(tokens.shift()!)
        return { last: tokens.join(' '), first, von: vonTokens.join(' '), jr: '' }
    }
    // "von Last, Jr, First"
    const [lastPart, jr, first] = segments
    const tokens = lastPart.split(/\s+/)
    const vonTokens: string[] = []
    while (tokens.length > 1 && /^[a-z]/.test(tokens[0])) vonTokens.push(tokens.shift()!)
    return { last: tokens.join(' '), first, von: vonTokens.join(' '), jr }
}
