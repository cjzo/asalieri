import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '../../components/ui/button'
import { Code, Copy, Check, Minimize2, AlignLeft, AlertCircle, ArrowRight } from 'lucide-react'

export function JsonFormatter() {
    const [input, setInput] = useState('')
    const [output, setOutput] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [copied, setCopied] = useState(false)

    const formatJson = () => {
        if (!input.trim()) {
            setOutput('')
            setError(null)
            return
        }
        try {
            const parsed = JSON.parse(input)
            setOutput(JSON.stringify(parsed, null, 2))
            setError(null)
        } catch (err: any) {
            setError(err.message)
        }
    }

    const minifyJson = () => {
        if (!input.trim()) {
            setOutput('')
            setError(null)
            return
        }
        try {
            const parsed = JSON.parse(input)
            setOutput(JSON.stringify(parsed))
            setError(null)
        } catch (err: any) {
            setError(err.message)
        }
    }

    const handleCopy = async () => {
        if (!output) return
        await navigator.clipboard.writeText(output)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="w-full flex justify-center pb-24 h-full min-h-[80vh]">
            <div className="w-full max-w-7xl flex flex-col items-center h-full">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-10 flex flex-col items-center"
                >
                    <div className="mb-6 inline-flex p-4 rounded-2xl bg-surface/50 border border-border/50 text-accent shadow-lg shadow-accent/10">
                        <Code className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-primary mb-4">
                        JSON Formatter
                    </h1>
                    <p className="text-lg text-secondary max-w-xl mx-auto">
                        Format, validate, and explore JSON payloads instantly in your browser.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 h-[60vh] min-h-[500px]"
                >
                    {/* Input Area */}
                    <div className="flex flex-col rounded-2xl border border-border/40 bg-surface/40 backdrop-blur-sm overflow-hidden shadow-sm">
                        <div className="flex justify-between items-center p-4 border-b border-border/40 bg-surface/80">
                            <span className="text-sm font-medium text-tertiary uppercase tracking-widest pl-2">Input JSON</span>
                            <div className="flex gap-2">
                                <Button onClick={minifyJson} className="bg-surface text-secondary hover:text-primary hover:bg-surface/80 text-xs h-8 px-3">
                                    <Minimize2 className="w-3.5 h-3.5 mr-1.5" />
                                    Minify
                                </Button>
                                <Button onClick={formatJson} className="text-xs h-8 px-3 shadow-md shadow-accent/20">
                                    <AlignLeft className="w-3.5 h-3.5 mr-1.5" />
                                    Format
                                </Button>
                            </div>
                        </div>

                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Paste raw JSON here..."
                            className="flex-grow w-full p-6 bg-transparent resize-none font-mono text-sm text-primary focus:outline-none placeholder:text-tertiary"
                            spellCheck={false}
                        />
                    </div>

                    {/* Output Area */}
                    <div className="flex flex-col rounded-2xl border border-border/40 bg-white dark:bg-zinc-950 shadow-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] pointer-events-none" />

                        <div className="relative z-10 flex justify-between items-center p-4 border-b border-border/30 bg-surface/30">
                            <span className="text-sm font-medium text-tertiary uppercase tracking-widest pl-2">Output</span>
                            <Button
                                onClick={handleCopy}
                                disabled={!output || !!error}
                                className="text-xs h-8 px-3 shadow-md shadow-accent/20"
                            >
                                {copied ? <Check className="w-3.5 h-3.5 mr-1.5" /> : <Copy className="w-3.5 h-3.5 mr-1.5" />}
                                Copy JSON
                            </Button>
                        </div>

                        <div className="relative z-10 p-6 flex-grow overflow-y-auto">
                            {error ? (
                                <div className="flex flex-col items-center justify-center h-full text-center p-6 text-red-500 gap-4">
                                    <div className="p-4 rounded-full bg-red-500/10 mb-2">
                                        <AlertCircle className="w-10 h-10" />
                                    </div>
                                    <h3 className="text-lg font-bold tracking-tight">Invalid JSON</h3>
                                    <p className="text-sm text-red-500/80 font-mono bg-red-500/5 p-4 rounded-xl border border-red-500/20 max-w-[90%] break-all">
                                        {error}
                                    </p>
                                </div>
                            ) : output ? (
                                <pre className="font-mono text-sm leading-relaxed text-[#10b981] dark:text-[#34d399] whitespace-pre-wrap">
                                    {output}
                                </pre>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-tertiary gap-3">
                                    <ArrowRight className="w-8 h-8 opacity-20" />
                                    <span className="text-sm font-medium">Results will appear here</span>
                                </div>
                            )}
                        </div>
                    </div>

                </motion.div>
            </div>
        </div>
    )
}
