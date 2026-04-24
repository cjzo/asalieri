import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '../../components/ui/button'
import { BookText, Copy, Check, AlertCircle, ArrowRight, ClipboardCopy } from 'lucide-react'
import { parseBibtex } from '../../lib/bibtex/parser'
import { formatEntries, CitationStyle, STYLE_LABELS } from '../../lib/bibtex/formatters'

type CopyMode = 'rich' | 'plain'

const SAMPLE_BIB = `@article{knuth1984literate,
  author  = {Donald E. Knuth},
  title   = {Literate Programming},
  journal = {The Computer Journal},
  volume  = {27},
  number  = {2},
  pages   = {97--111},
  year    = {1984},
  doi     = {10.1093/comjnl/27.2.97}
}

@book{turing1950computing,
  author    = {Turing, Alan M.},
  title     = {Computing Machinery and Intelligence},
  publisher = {Oxford University Press},
  year      = {1950},
  address   = {Oxford}
}`

async function writeRichClipboard(html: string, text: string): Promise<void> {
    // Prefer the async ClipboardItem API so Google Docs keeps Times New Roman + italics.
    if (typeof ClipboardItem !== 'undefined' && navigator.clipboard?.write) {
        try {
            const item = new ClipboardItem({
                'text/html': new Blob([html], { type: 'text/html' }),
                'text/plain': new Blob([text], { type: 'text/plain' }),
            })
            await navigator.clipboard.write([item])
            return
        } catch {
            /* fall through to plain-text fallback */
        }
    }
    await navigator.clipboard.writeText(text)
}

export function BibtexCitationFormatter() {
    const [input, setInput] = useState('')
    const [style, setStyle] = useState<CitationStyle>('apa')
    const [copied, setCopied] = useState<CopyMode | null>(null)

    const { formatted, parseErrors } = useMemo(() => {
        if (!input.trim()) return { formatted: null, parseErrors: [] as string[] }
        const { entries, errors } = parseBibtex(input)
        if (entries.length === 0) return { formatted: null, parseErrors: errors }
        return { formatted: formatEntries(entries, style), parseErrors: errors }
    }, [input, style])

    const handleCopy = async (mode: CopyMode) => {
        if (!formatted) return
        if (mode === 'rich') {
            await writeRichClipboard(formatted.richHtml, formatted.plain)
        } else {
            await navigator.clipboard.writeText(formatted.plain)
        }
        setCopied(mode)
        setTimeout(() => setCopied(null), 2000)
    }

    const loadSample = () => setInput(SAMPLE_BIB)

    const hasInput = input.trim().length > 0

    return (
        <div className="w-full flex justify-center pb-24 h-full min-h-[80vh]">
            <div className="w-full max-w-7xl flex flex-col items-center h-full">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-10 flex flex-col items-center"
                >
                    <div className="mb-6 inline-flex p-4 rounded-2xl bg-surface/50 border border-border/50 text-accent">
                        <BookText className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-primary mb-4">
                        Citation Formatter
                    </h1>
                    <p className="text-lg text-secondary max-w-xl mx-auto">
                        Paste BibTeX. Pick a style. Copy a reference list that drops cleanly into Google Docs — Times New Roman, double-spaced, hanging indent.
                    </p>
                </motion.div>

                <div className="w-full flex flex-wrap items-center justify-center gap-2 mb-6">
                    {(Object.keys(STYLE_LABELS) as CitationStyle[]).map(s => (
                        <button
                            key={s}
                            onClick={() => setStyle(s)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${style === s
                                ? 'bg-accent text-white'
                                : 'bg-surface/50 text-secondary border border-border/50 hover:text-primary hover:bg-surface'
                                }`}
                        >
                            {STYLE_LABELS[s]}
                        </button>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 h-[60vh] min-h-[520px]"
                >
                    {/* Input */}
                    <div className="flex flex-col rounded-2xl border border-border/40 bg-surface/40 backdrop-blur-sm overflow-hidden shadow-sm">
                        <div className="flex justify-between items-center p-4 border-b border-border/40 bg-surface/80">
                            <span className="text-sm font-medium text-tertiary uppercase tracking-widest pl-2">
                                BibTeX Input
                            </span>
                            <Button
                                onClick={loadSample}
                                className="bg-surface text-secondary hover:text-primary hover:bg-surface/80 text-xs h-8 px-3"
                            >
                                Load sample
                            </Button>
                        </div>
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Paste one or more @article{...}, @book{...}, @inproceedings{...} entries here."
                            className="flex-grow w-full p-6 bg-transparent resize-none font-mono text-sm text-primary focus:outline-none placeholder:text-tertiary"
                            spellCheck={false}
                        />
                    </div>

                    {/* Output */}
                    <div className="flex flex-col rounded-2xl border border-border/50 bg-surface shadow-xl relative overflow-hidden">
                        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] pointer-events-none" />

                        <div className="relative z-10 flex justify-between items-center p-4 border-b border-border/30 bg-surface/30 gap-2">
                            <span className="text-sm font-medium text-tertiary uppercase tracking-widest pl-2">
                                {STYLE_LABELS[style]}
                            </span>
                            <div className="flex gap-2">
                                <Button
                                    onClick={() => handleCopy('plain')}
                                    disabled={!formatted}
                                    className="text-xs h-8 px-3 !bg-transparent !text-tertiary hover:!text-primary hover:!bg-surface/50 !shadow-none border border-border/50"
                                >
                                    {copied === 'plain' ? <Check className="w-3.5 h-3.5 mr-1.5" /> : <Copy className="w-3.5 h-3.5 mr-1.5" />}
                                    {copied === 'plain' ? 'Copied' : 'Plain'}
                                </Button>
                                <Button
                                    onClick={() => handleCopy('rich')}
                                    disabled={!formatted}
                                    className="text-xs h-8 px-3"
                                >
                                    {copied === 'rich' ? <Check className="w-3.5 h-3.5 mr-1.5" /> : <ClipboardCopy className="w-3.5 h-3.5 mr-1.5" />}
                                    {copied === 'rich' ? 'Copied' : 'Copy for Docs'}
                                </Button>
                            </div>
                        </div>

                        <div className="relative z-10 p-8 flex-grow overflow-y-auto">
                            {!hasInput ? (
                                <EmptyState />
                            ) : !formatted ? (
                                <ParseError errors={parseErrors} />
                            ) : (
                                <CitationList html={formatted.richHtml} />
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

function CitationList({ html }: { html: string }) {
    // Render the same HTML that will be pasted, so the preview matches
    // exactly what lands in Google Docs (modulo theme color override).
    return (
        <div
            className="[&_p]:mb-4 [&_p]:text-primary [&_em]:italic text-base"
            style={{ fontFamily: "'Times New Roman', Times, serif", lineHeight: 1.8 }}
            dangerouslySetInnerHTML={{
                __html: html.replace(/color:#000000;?/g, '').replace(/<div[^>]*>/, '<div>'),
            }}
        />
    )
}

function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center h-full text-tertiary gap-3">
            <ArrowRight className="w-8 h-8 opacity-20" />
            <span className="text-sm font-medium">Formatted citations will appear here</span>
        </div>
    )
}

function ParseError({ errors }: { errors: string[] }) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-6 text-red-500 gap-4">
            <div className="p-4 rounded-full bg-red-500/10 mb-2">
                <AlertCircle className="w-10 h-10" />
            </div>
            <h3 className="text-lg font-bold tracking-tight">No valid entries</h3>
            <p className="text-sm text-red-500/80 max-w-[90%]">
                Couldn't parse any BibTeX entries. Check that each begins with an <code className="font-mono">@type</code> and closes with a matching brace.
            </p>
            {errors.length > 0 && (
                <ul className="text-xs text-red-500/70 font-mono bg-red-500/5 p-3 rounded-xl border border-red-500/20 max-w-[90%] text-left list-disc list-inside">
                    {errors.slice(0, 5).map((err, i) => <li key={i}>{err}</li>)}
                </ul>
            )}
        </div>
    )
}
