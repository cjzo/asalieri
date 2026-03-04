import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '../../components/ui/button'
import { Code, Copy, Check, Minimize2, Maximize2, AlertTriangle } from 'lucide-react'

// Basic XML formatting utility
function formatXml(xml: string, indent = '  ') {
    let formatted = ''
    let pad = 0

    // Clean up input
    const cleanXml = xml.replace(/(>)\s*(<)/g, '$1\n$2')

    cleanXml.split('\n').forEach((line) => {
        let indentLevel = pad
        if (line.match(/.+<\/\w[^>]*>$/)) {
            indentLevel = pad
        } else if (line.match(/^<\/\w/)) {
            if (pad !== 0) {
                pad -= 1
            }
            indentLevel = pad
        } else if (line.match(/^<\w[^>]*[^\/]>.*$/)) {
            pad += 1
        }

        formatted += indent.repeat(indentLevel) + line + '\n'
    })

    return formatted.trim()
}

export function XmlFormatter() {
    const [input, setInput] = useState('')
    const [output, setOutput] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [copied, setCopied] = useState(false)

    const handleFormat = useCallback(() => {
        try {
            setError(null)
            // Parse to validate XML first
            const parser = new DOMParser()
            const doc = parser.parseFromString(input, 'application/xml')

            const parseError = doc.getElementsByTagName("parsererror")
            if (parseError.length > 0) {
                throw new Error("Invalid XML Syntax")
            }

            setOutput(formatXml(input))
        } catch (e) {
            setError('Failed to parse: Invalid XML structure.')
            setOutput('')
        }
    }, [input])

    const handleMinify = useCallback(() => {
        try {
            setError(null)
            const minified = input
                .replace(/>\s+</g, '><')
                .replace(/<!--[\s\S]*?-->/g, '') // remove comments
                .trim()
            setOutput(minified)
        } catch (e) {
            setError('Failed to minify: Invalid XML structure.')
            setOutput('')
        }
    }, [input])

    const handleCopy = async () => {
        if (!output) return
        await navigator.clipboard.writeText(output)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="w-full flex justify-center pb-24">
            <div className="w-full max-w-5xl flex flex-col items-center px-4">

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="text-center mb-12 flex flex-col items-center"
                >
                    <motion.div
                        className="mb-6 inline-flex p-4 rounded-2xl bg-surface/50 border border-border/50 text-accent shadow-lg shadow-accent/10"
                    >
                        <Code className="w-8 h-8" />
                    </motion.div>
                    <h1 className="text-4xl md:text-6xl font-medium tracking-tight text-primary mb-4">
                        XML Formatter
                    </h1>
                    <p className="text-lg text-secondary max-w-xl mx-auto">
                        Instantly format, minify, and validate complex XML trees.
                    </p>
                </motion.div>

                <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Left Pane: Input (Controls Box) */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1, type: "spring", stiffness: 100 }}
                        className="flex flex-col gap-4"
                    >
                        <div className="p-6 rounded-2xl border border-border/40 bg-surface/40 backdrop-blur-sm h-full flex flex-col transition-all duration-300 hover:border-accent/30 shadow-sm">
                            <div className="flex justify-between items-center mb-4 ml-1">
                                <label className="block text-sm font-medium text-tertiary uppercase tracking-wider">Raw XML</label>
                            </div>
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                className="w-full flex-grow min-h-[300px] bg-surface/50 border border-border/50 rounded-xl p-4 text-primary focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all font-mono text-sm resize-none shadow-inner placeholder:text-tertiary/50"
                                placeholder="<root>\n  <node>Paste XML here</node>\n</root>"
                                spellCheck={false}
                            />

                            <div className="flex gap-3 mt-4">
                                <Button
                                    onClick={handleFormat}
                                    className="flex-1 bg-accent hover:bg-accent/90 text-surface shadow-lg shadow-accent/20 border-none"
                                >
                                    <Maximize2 className="w-4 h-4 mr-2" /> Format
                                </Button>
                                <Button
                                    onClick={handleMinify}
                                    className="flex-1 bg-surface border border-border/50 hover:border-accent/50 hover:text-accent text-primary transition-all shadow-sm group"
                                >
                                    <Minimize2 className="w-4 h-4 mr-2 text-secondary group-hover:text-accent transition-colors" /> Minify
                                </Button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Pane: Output (Main Display Box) */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
                        className="flex flex-col gap-4 h-full"
                    >
                        <div className="flex flex-col p-6 rounded-2xl border border-border/50 bg-surface shadow-xl relative overflow-hidden h-full min-h-[400px] transition-all duration-300 hover:border-accent/40 hover:shadow-2xl">
                            <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] pointer-events-none" />

                            <div className="relative z-10 flex flex-col h-full">
                                <div className="flex justify-between items-center mb-4 ml-1">
                                    <label className="block text-sm font-medium text-tertiary uppercase tracking-wider">Processed Result</label>
                                    <Button
                                        onClick={handleCopy}
                                        disabled={!output && !error}
                                        className="h-8 px-3 rounded-lg bg-surface hover:bg-surface border border-border/50 text-secondary hover:text-accent hover:border-accent/50 transition-all shadow-sm relative z-20"
                                    >
                                        {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                                        {copied ? 'Copied' : 'Copy'}
                                    </Button>
                                </div>

                                <AnimatePresence mode="wait">
                                    {error ? (
                                        <motion.div
                                            key="error"
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            className="w-full flex-grow flex flex-col items-center justify-center p-8 border border-red-500/30 bg-red-500/5 rounded-xl text-red-500"
                                        >
                                            <AlertTriangle className="w-12 h-12 mb-4 opacity-80" />
                                            <span className="font-bold text-lg text-center">{error}</span>
                                        </motion.div>
                                    ) : (
                                        <motion.textarea
                                            key="output"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            readOnly
                                            value={output}
                                            className="w-full flex-grow min-h-[300px] sm:min-h-0 bg-transparent resize-none font-mono text-sm text-primary leading-relaxed focus:outline-none"
                                            placeholder="Waiting for input..."
                                            spellCheck={false}
                                        />
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
