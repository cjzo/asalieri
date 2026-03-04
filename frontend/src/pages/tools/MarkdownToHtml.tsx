import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '../../components/ui/button'
import { FileCode, Copy, Trash2, Check, Download } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { renderToStaticMarkup } from 'react-dom/server'

const DEFAULT_MARKDOWN = `# Markdown to HTML Converter
Convert your Markdown syntax directly into clean, raw HTML code.

## How it works
Type your markdown in the left panel. The right panel will automatically generate the corresponding HTML string.

1. **Bold** and *Italic*
2. [Links](https://example.com)
3. \`Inline code\`
`

export function MarkdownToHtml() {
    const [markdown, setMarkdown] = useState(DEFAULT_MARKDOWN)
    const [copied, setCopied] = useState(false)

    // Convert markdown to React elements, then to static HTML string
    const htmlOutput = renderToStaticMarkup(
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {markdown}
        </ReactMarkdown>
    )

    // Formatted/Indented HTML isn't natively provided by renderToStaticMarkup,
    // but we can do a very basic replacement to add newlines to block elements for readability.
    const formattedHtml = htmlOutput
        .replace(/><(h[1-6]|p|ul|ol|li|blockquote|pre|table|thead|tbody|tr|td|th|div|hr)/g, '>\n<$1')
        .replace(/(<\/(h[1-6]|p|ul|ol|li|blockquote|pre|table|thead|tbody|tr|td|th|div)>)></g, '$1\n<')

    const handleCopyHtml = async () => {
        if (!formattedHtml) return
        await navigator.clipboard.writeText(formattedHtml)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const downloadHtml = () => {
        if (!formattedHtml) return
        const blob = new Blob([formattedHtml], { type: 'text/html' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'converted.html'
        a.click()
        URL.revokeObjectURL(url)
    }

    return (
        <div className="w-full flex justify-center pb-24">
            <div className="w-full max-w-7xl flex flex-col items-center px-4">

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="text-center mb-12 flex flex-col items-center relative"
                >
                    <div className="mb-6 inline-flex p-4 rounded-2xl bg-surface/50 border border-border/50 text-accent shadow-lg shadow-accent/10">
                        <FileCode className="w-8 h-8" />
                    </div>

                    <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-primary mb-4">
                        Markdown to HTML
                    </h1>
                    <p className="text-lg text-secondary max-w-xl mx-auto font-medium">
                        Convert Markdown into clean HTML.
                    </p>
                </motion.div>

                <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 h-[700px]">

                    {/* Left Pane: Editor */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col h-full rounded-2xl border border-border/40 bg-surface/40 backdrop-blur-sm shadow-sm transition-all hover:border-accent/30 p-2"
                    >
                        <div className="flex justify-between items-center px-4 py-3 border-b border-border/30">
                            <label className="text-sm font-bold uppercase tracking-wider text-tertiary">
                                Markdown Source
                            </label>
                            <div className="flex gap-2">
                                <Button
                                    onClick={() => setMarkdown('')}
                                    disabled={!markdown}
                                    className="h-8 text-xs !bg-transparent !text-tertiary hover:!text-red-500 hover:!bg-red-500/10 !shadow-none !px-2"
                                >
                                    <Trash2 className="w-4 h-4 mr-1" /> Clear
                                </Button>
                            </div>
                        </div>

                        <textarea
                            value={markdown}
                            onChange={(e) => setMarkdown(e.target.value)}
                            placeholder="Type markdown here..."
                            className="w-full flex-grow p-4 bg-transparent text-primary focus:outline-none transition-all resize-none shadow-inner font-mono text-sm leading-relaxed"
                            spellCheck="false"
                        />
                    </motion.div>

                    {/* Right Pane: Generated HTML */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col h-full rounded-2xl border border-border/50 bg-surface shadow-xl relative overflow-hidden transition-all duration-300 hover:border-accent/40 hover:shadow-2xl"
                    >
                        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] pointer-events-none" />

                        <div className="relative z-10 flex flex-col h-full">
                            <div className="flex justify-between items-center px-4 py-3 border-b border-border/30 bg-surface/30">
                                <label className="text-sm font-bold uppercase tracking-wider text-accent ml-2">
                                    Raw HTML Output
                                </label>
                                <div className="flex gap-2">
                                    <Button
                                        onClick={handleCopyHtml}
                                        disabled={!formattedHtml}
                                        className="h-8 text-xs !bg-transparent !text-tertiary hover:!text-primary hover:!bg-surface/50 !shadow-none !px-2"
                                        title="Copy HTML Source"
                                    >
                                        {copied ? <Check className="w-4 h-4 mr-1 text-emerald-500" /> : <Copy className="w-4 h-4 mr-1" />}
                                        {copied ? 'Copied' : 'Copy'}
                                    </Button>
                                    <Button
                                        onClick={downloadHtml}
                                        disabled={!formattedHtml}
                                        className="h-8 text-xs !bg-transparent !text-tertiary hover:!text-accent hover:!bg-accent/10 !shadow-none !px-2"
                                    >
                                        <Download className="w-4 h-4 mr-1" /> Download .html
                                    </Button>
                                </div>
                            </div>

                            <textarea
                                value={formattedHtml}
                                readOnly
                                placeholder="HTML will appear here..."
                                className="w-full flex-grow p-6 bg-transparent text-secondary focus:outline-none transition-all resize-none shadow-inner font-mono text-sm leading-loose custom-scrollbar"
                                spellCheck="false"
                            />
                        </div>
                    </motion.div>

                </div>
            </div>
        </div>
    )
}
