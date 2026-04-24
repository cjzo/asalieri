import { BibEntry, Author, parseAuthors } from './parser'

export type CitationStyle = 'apa' | 'mla' | 'chicago' | 'harvard' | 'ieee'

export type FormattedCitation = {
    /** Plain text rendering, safe for plain-text paste. */
    text: string
    /** Inline HTML (italics, etc.) without a wrapping block. */
    html: string
    /** The source entry (for error tracing in UI). */
    entry: BibEntry
}

export type FormatResult = {
    citations: FormattedCitation[]
    /** Full plain-text document joined with newlines. */
    plain: string
    /** Rich HTML document pre-styled for Google Docs paste (Times New Roman, 12pt, hanging indent). */
    richHtml: string
}

export const STYLE_LABELS: Record<CitationStyle, string> = {
    apa: 'APA (7th ed.)',
    mla: 'MLA (9th ed.)',
    chicago: 'Chicago (Author–Date)',
    harvard: 'Harvard',
    ieee: 'IEEE',
}

const escapeHtml = (s: string): string =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const italic = (s: string): string => `<em>${escapeHtml(s)}</em>`
const plain = (s: string): string => escapeHtml(s)

const initials = (first: string): string =>
    first
        .split(/[\s-]+/)
        .filter(Boolean)
        .map(p => `${p[0].toUpperCase()}.`)
        .join(' ')

const initialsTight = (first: string): string =>
    first.split(/[\s-]+/).filter(Boolean).map(p => `${p[0].toUpperCase()}.`).join('')

const firstFull = (a: Author): string =>
    [a.first, a.von].filter(Boolean).join(' ').trim()

const year = (e: BibEntry): string => {
    const y = e.fields.year?.match(/\d{4}/)?.[0]
    if (y) return y
    const d = e.fields.date?.match(/\d{4}/)?.[0]
    return d ?? 'n.d.'
}

const pages = (e: BibEntry): string =>
    (e.fields.pages || '').replace(/--/g, '–').replace(/-(?=\d)/g, '–').trim()

const joinMeaningful = (parts: string[], sep = ', '): string =>
    parts.filter(p => p && p.trim()).join(sep)

// ---------------------------------------------------------------------------
// APA (7th ed.)
// ---------------------------------------------------------------------------

function apaAuthors(authors: Author[]): string {
    if (authors.length === 0) return ''
    const fmt = (a: Author) => {
        const last = [a.von, a.last].filter(Boolean).join(' ').trim()
        const ini = a.first ? initials(a.first) : ''
        const jr = a.jr ? `, ${a.jr}` : ''
        return ini ? `${last}, ${ini}${jr}` : `${last}${jr}`
    }
    if (authors.length === 1) return fmt(authors[0])
    if (authors.length <= 20) {
        const all = authors.map(fmt)
        return `${all.slice(0, -1).join(', ')}, & ${all[all.length - 1]}`
    }
    const firstN = authors.slice(0, 19).map(fmt).join(', ')
    const last = fmt(authors[authors.length - 1])
    return `${firstN}, ... ${last}`
}

function formatApa(e: BibEntry): FormattedCitation {
    const authors = parseAuthors(e.fields.author || e.fields.editor || '')
    const yr = year(e)
    const title = e.fields.title || ''
    const journal = e.fields.journal || e.fields.journaltitle || ''
    const book = e.fields.booktitle || ''
    const publisher = e.fields.publisher || ''
    const school = e.fields.school || e.fields.institution || ''
    const vol = e.fields.volume
    const num = e.fields.number || e.fields.issue
    const pg = pages(e)
    const doi = e.fields.doi
    const url = e.fields.url

    const authorPart = apaAuthors(authors)
    const datePart = ` (${yr}).`
    const bylineText = authorPart ? `${authorPart}${datePart}` : `${datePart.trim()}`
    const bylineHtml = plain(bylineText)

    let body: { text: string; html: string }

    switch (e.type) {
        case 'article': {
            const volStr = vol ? (num ? `${vol}(${num})` : `${vol}`) : ''
            const tail = joinMeaningful([volStr, pg])
            const text = ` ${title}. ${journal}${vol ? ', ' : ''}${tail ? tail + '.' : journal ? '.' : ''}`
            const html = ` ${plain(title)}. ${italic(journal)}${vol ? ', ' : ''}${tail ? escapeHtml(tail) + '.' : journal ? '.' : ''}`
            body = { text, html }
            break
        }
        case 'book':
        case 'booklet': {
            const text = ` ${title}. ${publisher}${publisher ? '.' : ''}`
            const html = ` ${italic(title)}. ${plain(publisher)}${publisher ? '.' : ''}`
            body = { text, html }
            break
        }
        case 'inproceedings':
        case 'conference':
        case 'incollection': {
            const where = book || journal
            const tail = pg ? ` (pp. ${pg})` : ''
            const text = ` ${title}. In ${where}${tail}. ${publisher}${publisher ? '.' : ''}`
            const html = ` ${plain(title)}. In ${italic(where)}${escapeHtml(tail)}. ${plain(publisher)}${publisher ? '.' : ''}`
            body = { text, html }
            break
        }
        case 'phdthesis':
        case 'mastersthesis': {
            const kind = e.type === 'phdthesis' ? 'Doctoral dissertation' : "Master's thesis"
            const text = ` ${title} [${kind}, ${school}].`
            const html = ` ${italic(title)} [${escapeHtml(kind)}${school ? ', ' + plain(school) : ''}].`
            body = { text, html }
            break
        }
        case 'techreport':
        case 'report': {
            const text = ` ${title}. ${school}${school ? '.' : ''}`
            const html = ` ${italic(title)}. ${plain(school)}${school ? '.' : ''}`
            body = { text, html }
            break
        }
        case 'online':
        case 'webpage':
        case 'misc':
        default: {
            const text = ` ${title}.${publisher ? ' ' + publisher + '.' : ''}`
            const html = ` ${italic(title)}.${publisher ? ' ' + plain(publisher) + '.' : ''}`
            body = { text, html }
            break
        }
    }

    const link = doi ? ` https://doi.org/${doi}` : url ? ` ${url}` : ''
    const text = `${bylineText}${body.text}${link}`.replace(/\s+/g, ' ').trim()
    const html = `${bylineHtml}${body.html}${link ? ' ' + escapeHtml(link.trim()) : ''}`
    return { text, html, entry: e }
}

// ---------------------------------------------------------------------------
// MLA (9th ed.)
// ---------------------------------------------------------------------------

function mlaAuthors(authors: Author[]): string {
    if (authors.length === 0) return ''
    const fmt0 = (a: Author) => {
        const last = [a.von, a.last].filter(Boolean).join(' ').trim()
        return a.first ? `${last}, ${firstFull(a)}` : last
    }
    const fmtN = (a: Author) => [firstFull(a), a.last].filter(Boolean).join(' ').trim()
    if (authors.length === 1) return fmt0(authors[0]) + '.'
    if (authors.length === 2) return `${fmt0(authors[0])}, and ${fmtN(authors[1])}.`
    return `${fmt0(authors[0])}, et al.`
}

function formatMla(e: BibEntry): FormattedCitation {
    const authors = parseAuthors(e.fields.author || e.fields.editor || '')
    const yr = year(e)
    const title = e.fields.title || ''
    const journal = e.fields.journal || e.fields.journaltitle || ''
    const book = e.fields.booktitle || ''
    const publisher = e.fields.publisher || ''
    const vol = e.fields.volume
    const num = e.fields.number || e.fields.issue
    const pg = pages(e)

    const authorPart = mlaAuthors(authors)
    const authorText = authorPart ? `${authorPart} ` : ''
    const authorHtml = plain(authorText)

    let body: { text: string; html: string }

    switch (e.type) {
        case 'article': {
            const volNum = joinMeaningful([vol ? `vol. ${vol}` : '', num ? `no. ${num}` : ''])
            const pagesPart = pg ? `pp. ${pg}` : ''
            const tail = joinMeaningful([volNum, yr, pagesPart])
            const text = `"${title}." ${journal}, ${tail}.`
            const html = `&ldquo;${plain(title)}.&rdquo; ${italic(journal)}, ${plain(tail)}.`
            body = { text, html }
            break
        }
        case 'book': {
            const text = `${title}. ${publisher}, ${yr}.`
            const html = `${italic(title)}. ${plain(publisher)}, ${plain(yr)}.`
            body = { text, html }
            break
        }
        case 'inproceedings':
        case 'conference':
        case 'incollection': {
            const pagesPart = pg ? `pp. ${pg}` : ''
            const tail = joinMeaningful([publisher, yr, pagesPart])
            const text = `"${title}." ${book}, ${tail}.`
            const html = `&ldquo;${plain(title)}.&rdquo; ${italic(book)}, ${plain(tail)}.`
            body = { text, html }
            break
        }
        default: {
            const text = `${title}. ${publisher ? publisher + ', ' : ''}${yr}.`
            const html = `${italic(title)}. ${publisher ? plain(publisher) + ', ' : ''}${plain(yr)}.`
            body = { text, html }
        }
    }

    return {
        text: `${authorText}${body.text}`.replace(/\s+/g, ' ').trim(),
        html: `${authorHtml}${body.html}`,
        entry: e,
    }
}

// ---------------------------------------------------------------------------
// Chicago (Author–Date, 17th ed.)
// ---------------------------------------------------------------------------

function chicagoAuthors(authors: Author[]): string {
    if (authors.length === 0) return ''
    const fmt0 = (a: Author) => {
        const last = [a.von, a.last].filter(Boolean).join(' ').trim()
        return a.first ? `${last}, ${firstFull(a)}` : last
    }
    const fmtN = (a: Author) => [firstFull(a), a.von, a.last].filter(Boolean).join(' ').trim()
    if (authors.length === 1) return `${fmt0(authors[0])}.`
    if (authors.length <= 3) {
        const rest = authors.slice(1).map(fmtN)
        return `${fmt0(authors[0])}, ${rest.slice(0, -1).concat(`and ${rest[rest.length - 1]}`).join(', ')}.`
    }
    return `${fmt0(authors[0])}, et al.`
}

function formatChicago(e: BibEntry): FormattedCitation {
    const authors = parseAuthors(e.fields.author || e.fields.editor || '')
    const yr = year(e)
    const title = e.fields.title || ''
    const journal = e.fields.journal || e.fields.journaltitle || ''
    const book = e.fields.booktitle || ''
    const publisher = e.fields.publisher || ''
    const place = e.fields.address || e.fields.location || ''
    const vol = e.fields.volume
    const num = e.fields.number || e.fields.issue
    const pg = pages(e)

    const authorPart = chicagoAuthors(authors)
    const header = `${authorPart} ${yr}.`
    const headerHtml = plain(header)

    let body: { text: string; html: string }

    switch (e.type) {
        case 'article': {
            const volNum = vol ? (num ? `${vol} (${num})` : `${vol}`) : ''
            const tail = pg ? `${volNum}: ${pg}` : volNum
            const text = ` "${title}." ${journal} ${tail}.`
            const html = ` &ldquo;${plain(title)}.&rdquo; ${italic(journal)} ${plain(tail)}.`
            body = { text, html }
            break
        }
        case 'book': {
            const where = joinMeaningful([place, publisher], ': ')
            const text = ` ${title}. ${where}.`
            const html = ` ${italic(title)}. ${plain(where)}.`
            body = { text, html }
            break
        }
        case 'inproceedings':
        case 'incollection': {
            const where = joinMeaningful([place, publisher], ': ')
            const text = ` "${title}." In ${book}, ${pg ? pg + '. ' : ''}${where}.`
            const html = ` &ldquo;${plain(title)}.&rdquo; In ${italic(book)}, ${pg ? plain(pg) + '. ' : ''}${plain(where)}.`
            body = { text, html }
            break
        }
        default: {
            const text = ` ${title}.${publisher ? ' ' + publisher + '.' : ''}`
            const html = ` ${italic(title)}.${publisher ? ' ' + plain(publisher) + '.' : ''}`
            body = { text, html }
        }
    }

    return {
        text: `${header}${body.text}`.replace(/\s+/g, ' ').trim(),
        html: `${headerHtml}${body.html}`,
        entry: e,
    }
}

// ---------------------------------------------------------------------------
// Harvard
// ---------------------------------------------------------------------------

function harvardAuthors(authors: Author[]): string {
    if (authors.length === 0) return ''
    const fmt = (a: Author) => {
        const last = [a.von, a.last].filter(Boolean).join(' ').trim()
        const ini = a.first ? initialsTight(a.first) : ''
        return ini ? `${last}, ${ini}` : last
    }
    if (authors.length === 1) return fmt(authors[0])
    if (authors.length <= 3) {
        const all = authors.map(fmt)
        return `${all.slice(0, -1).join(', ')} and ${all[all.length - 1]}`
    }
    return `${fmt(authors[0])} et al.`
}

function formatHarvard(e: BibEntry): FormattedCitation {
    const authors = parseAuthors(e.fields.author || e.fields.editor || '')
    const yr = year(e)
    const title = e.fields.title || ''
    const journal = e.fields.journal || e.fields.journaltitle || ''
    const book = e.fields.booktitle || ''
    const publisher = e.fields.publisher || ''
    const place = e.fields.address || e.fields.location || ''
    const vol = e.fields.volume
    const num = e.fields.number || e.fields.issue
    const pg = pages(e)

    const authorPart = harvardAuthors(authors)
    const header = `${authorPart} (${yr})`

    let body: { text: string; html: string }

    switch (e.type) {
        case 'article': {
            const volNum = vol ? (num ? `${vol}(${num})` : `${vol}`) : ''
            const pagesPart = pg ? `pp. ${pg}` : ''
            const tail = joinMeaningful([volNum, pagesPart])
            const text = ` '${title}', ${journal}, ${tail}.`
            const html = ` &lsquo;${plain(title)}&rsquo;, ${italic(journal)}, ${plain(tail)}.`
            body = { text, html }
            break
        }
        case 'book': {
            const where = joinMeaningful([place, publisher], ': ')
            const text = ` ${title}. ${where}.`
            const html = ` ${italic(title)}. ${plain(where)}.`
            body = { text, html }
            break
        }
        case 'inproceedings':
        case 'incollection': {
            const where = joinMeaningful([place, publisher], ': ')
            const text = ` '${title}', in ${book}. ${where}${pg ? ', pp. ' + pg : ''}.`
            const html = ` &lsquo;${plain(title)}&rsquo;, in ${italic(book)}. ${plain(where)}${pg ? ', pp. ' + plain(pg) : ''}.`
            body = { text, html }
            break
        }
        default: {
            const text = ` ${title}.${publisher ? ' ' + publisher + '.' : ''}`
            const html = ` ${italic(title)}.${publisher ? ' ' + plain(publisher) + '.' : ''}`
            body = { text, html }
        }
    }

    return {
        text: `${header}${body.text}`.replace(/\s+/g, ' ').trim(),
        html: `${plain(header)}${body.html}`,
        entry: e,
    }
}

// ---------------------------------------------------------------------------
// IEEE
// ---------------------------------------------------------------------------

function ieeeAuthors(authors: Author[]): string {
    if (authors.length === 0) return ''
    const fmt = (a: Author) => {
        const ini = a.first ? initials(a.first) : ''
        const last = [a.von, a.last].filter(Boolean).join(' ').trim()
        return ini ? `${ini} ${last}` : last
    }
    if (authors.length === 1) return fmt(authors[0])
    if (authors.length <= 6) {
        const all = authors.map(fmt)
        return `${all.slice(0, -1).join(', ')}, and ${all[all.length - 1]}`
    }
    return `${fmt(authors[0])} et al.`
}

function formatIeee(e: BibEntry, idx: number): FormattedCitation {
    const authors = parseAuthors(e.fields.author || e.fields.editor || '')
    const yr = year(e)
    const title = e.fields.title || ''
    const journal = e.fields.journal || e.fields.journaltitle || ''
    const book = e.fields.booktitle || ''
    const publisher = e.fields.publisher || ''
    const vol = e.fields.volume
    const num = e.fields.number || e.fields.issue
    const pg = pages(e)

    const prefix = `[${idx + 1}] `
    const authorPart = ieeeAuthors(authors)

    let body: { text: string; html: string }

    switch (e.type) {
        case 'article': {
            const tail = joinMeaningful([
                vol ? `vol. ${vol}` : '',
                num ? `no. ${num}` : '',
                pg ? `pp. ${pg}` : '',
                yr,
            ])
            const text = `${authorPart}, "${title}," ${journal}, ${tail}.`
            const html = `${plain(authorPart)}, &ldquo;${plain(title)},&rdquo; ${italic(journal)}, ${plain(tail)}.`
            body = { text, html }
            break
        }
        case 'inproceedings':
        case 'conference': {
            const tail = joinMeaningful([yr, pg ? `pp. ${pg}` : ''])
            const text = `${authorPart}, "${title}," in ${book}, ${tail}.`
            const html = `${plain(authorPart)}, &ldquo;${plain(title)},&rdquo; in ${italic(book)}, ${plain(tail)}.`
            body = { text, html }
            break
        }
        case 'book': {
            const text = `${authorPart}, ${title}. ${publisher}, ${yr}.`
            const html = `${plain(authorPart)}, ${italic(title)}. ${plain(publisher)}, ${plain(yr)}.`
            body = { text, html }
            break
        }
        default: {
            const text = `${authorPart}, "${title}," ${publisher ? publisher + ', ' : ''}${yr}.`
            const html = `${plain(authorPart)}, &ldquo;${plain(title)},&rdquo; ${publisher ? plain(publisher) + ', ' : ''}${plain(yr)}.`
            body = { text, html }
        }
    }

    return {
        text: `${prefix}${body.text}`.replace(/\s+/g, ' ').trim(),
        html: `${plain(prefix)}${body.html}`,
        entry: e,
    }
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

export function formatEntries(entries: BibEntry[], style: CitationStyle): FormatResult {
    const citations = entries.map((e, idx) => {
        switch (style) {
            case 'apa': return formatApa(e)
            case 'mla': return formatMla(e)
            case 'chicago': return formatChicago(e)
            case 'harvard': return formatHarvard(e)
            case 'ieee': return formatIeee(e, idx)
        }
    })

    const plainDoc = citations.map(c => c.text).join('\n\n')

    // Styled for Google Docs paste: 12pt Times New Roman, double-spaced,
    // hanging indent. IEEE is flush-left; others use hanging indents.
    const paragraphStyleBase = 'margin:0 0 12pt 0;font-family:\'Times New Roman\',Times,serif;font-size:12pt;line-height:2;color:#000000;'
    const hangingIndent = style === 'ieee' ? '' : 'padding-left:0.5in;text-indent:-0.5in;'

    const richHtml = `<div style="font-family:'Times New Roman',Times,serif;font-size:12pt;line-height:2;color:#000000;">${citations
        .map(c => `<p style="${paragraphStyleBase}${hangingIndent}">${c.html}</p>`)
        .join('')}</div>`

    return { citations, plain: plainDoc, richHtml }
}
