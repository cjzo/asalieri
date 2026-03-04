import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '../../components/ui/button'
import { FileCode2, Copy, Trash2, Check, Download } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const DEFAULT_MARKDOWN = `# Markdown Previewer
Welcome to the live Markdown preview tool. You can use standard Markdown syntax to format your text.

## Features
- **Bold text**, *italic text*, and \`inline code\`
- Support for [links](https://example.com)
- Automatic **live preview** as you type
- GitHub Flavored Markdown (tables, strikethrough)

### Lists
1. Ordered item 1
2. Ordered item 2
   - Unordered sub-item A
   - Unordered sub-item B

### Code Block
\`\`\`javascript
function greet(name) {
  console.log(\`Hello, \${name}!\`);
}
greet("World");
\`\`\`

### Blockquote
> "Programs must be written for people to read, and only incidentally for machines to execute."
> \n> — Harold Abelson

### Table
| Syntax | Description |
| ----------- | ----------- |
| Header | Title |
| Paragraph | Text |

---
Enjoy writing!
`

export function MarkdownPreview() {
    const [markdown, setMarkdown] = useState(DEFAULT_MARKDOWN)
    const [copied, setCopied] = useState(false)

    const handleCopyHtml = async () => {
        // Technically this just copies the raw markdown, 
        // to copy HTML we would need to run it through a parser or read the DOM.
        // For this Markdown preview tool, we will just copy the raw markdown text.
        if (!markdown) return
        await navigator.clipboard.writeText(markdown)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const downloadMarkdown = () => {
        if (!markdown) return
        const blob = new Blob([markdown], { type: 'text/markdown' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'document.md'
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
                        <FileCode2 className="w-8 h-8" />
                    </div>

                    <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-primary mb-4">
                        Markdown Preview
                    </h1>
                    <p className="text-lg text-secondary max-w-xl mx-auto font-medium">
                        Write standard Markdown and see the rendered output live. Supports GitHub Flavored Markdown.
                    </p>
                </motion.div>

                <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 h-[800px]">

                    {/* Left Pane: Editor */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col h-full rounded-2xl border border-border/40 bg-surface/40 backdrop-blur-sm shadow-sm transition-all hover:border-accent/30 p-2"
                    >
                        <div className="flex justify-between items-center px-4 py-3 border-b border-border/30">
                            <label className="text-sm font-bold uppercase tracking-wider text-tertiary">
                                Editor
                            </label>
                            <div className="flex gap-2">
                                <Button
                                    onClick={() => setMarkdown('')}
                                    disabled={!markdown}
                                    className="h-8 text-xs !bg-transparent !text-tertiary hover:!text-red-500 hover:!bg-red-500/10 !shadow-none !px-2"
                                >
                                    <Trash2 className="w-4 h-4 mr-1" /> Clear
                                </Button>
                                <Button
                                    onClick={handleCopyHtml}
                                    disabled={!markdown}
                                    className="h-8 text-xs !bg-transparent !text-tertiary hover:!text-primary hover:!bg-surface/50 !shadow-none !px-2"
                                    title="Copy Markdown Source"
                                >
                                    {copied ? <Check className="w-4 h-4 mr-1 text-emerald-500" /> : <Copy className="w-4 h-4 mr-1" />}
                                    {copied ? 'Copied' : 'Copy'}
                                </Button>
                                <Button
                                    onClick={downloadMarkdown}
                                    disabled={!markdown}
                                    className="h-8 text-xs !bg-transparent !text-tertiary hover:!text-accent hover:!bg-accent/10 !shadow-none !px-2"
                                >
                                    <Download className="w-4 h-4 mr-1" /> Download .md
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

                    {/* Right Pane: Preview */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col h-full rounded-2xl border border-border/50 bg-surface shadow-xl relative overflow-hidden transition-all duration-300 hover:border-accent/40 hover:shadow-2xl"
                    >
                        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] pointer-events-none" />

                        <div className="relative z-10 flex flex-col h-full">
                            <div className="flex justify-between items-center px-6 py-4 border-b border-border/30 bg-surface/30">
                                <label className="text-sm font-bold uppercase tracking-wider text-accent">
                                    Live Preview
                                </label>
                            </div>

                            <div className="flex-grow p-6 overflow-y-auto custom-scrollbar bg-transparent">
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    className="prose-custom max-w-none text-primary break-words leading-relaxed"
                                    components={{
                                        h1: ({ node, ...props }) => <h1 className="text-3xl font-bold mt-8 mb-4 border-b border-border/50 pb-2 text-primary" {...props} />,
                                        h2: ({ node, ...props }) => <h2 className="text-2xl font-semibold mt-6 mb-4 text-primary" {...props} />,
                                        h3: ({ node, ...props }) => <h3 className="text-xl font-medium mt-6 mb-3 text-primary" {...props} />,
                                        h4: ({ node, ...props }) => <h4 className="text-lg font-medium mt-4 mb-2 text-primary" {...props} />,
                                        p: ({ node, ...props }) => <p className="mb-4 text-secondary leading-7" {...props} />,
                                        a: ({ node, ...props }) => <a className="text-accent hover:text-accent-hover underline underline-offset-2 transition-colors" target="_blank" rel="noopener noreferrer" {...props} />,
                                        ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-4 pl-4 space-y-1 text-secondary" {...props} />,
                                        ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-4 pl-4 space-y-1 text-secondary" {...props} />,
                                        li: ({ node, ...props }) => <li className="marker:text-tertiary" {...props} />,
                                        blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-accent/50 pl-4 py-1 mb-4 italic text-tertiary bg-accent/5 rounded-r-lg" {...props} />,
                                        code: ({ node, inline, ...props }: any) =>
                                            inline
                                                ? <code className="bg-surface/80 border border-border/50 text-accent font-mono text-[0.85em] px-1.5 py-0.5 rounded-md" {...props} />
                                                : <code className="block bg-[#0d1117] text-[#c9d1d9] font-mono text-sm p-4 overflow-x-auto rounded-xl border border-border/30 shadow-inner mb-4 custom-scrollbar" {...props} />,
                                        pre: ({ node, ...props }) => <pre className="my-0" {...props} />,
                                        table: ({ node, ...props }) => <div className="overflow-x-auto mb-4 border border-border/50 rounded-xl"><table className="w-full text-left border-collapse" {...props} /></div>,
                                        th: ({ node, ...props }) => <th className="bg-surface/50 border-b border-border/50 px-4 py-3 font-semibold text-primary" {...props} />,
                                        td: ({ node, ...props }) => <td className="border-b border-border/20 px-4 py-3 text-secondary" {...props} />,
                                        hr: ({ node, ...props }) => <hr className="my-8 border-t border-border/50" {...props} />,
                                        img: ({ node, ...props }) => <img className="max-w-full h-auto rounded-xl border border-border/50 shadow-sm mb-4" {...props} />
                                    }}
                                >
                                    {markdown}
                                </ReactMarkdown>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </div>
    )
}
