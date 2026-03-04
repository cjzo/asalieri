import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Button } from '../../components/ui/button'
import { FileCode, Copy, Check, ArrowRight, ArrowLeft } from 'lucide-react'

export function HtmlEncoderDecoder() {
    const [input, setInput] = useState('')
    const [output, setOutput] = useState('')
    const [copied, setCopied] = useState(false)

    const handleEncode = useCallback(() => {
        let temp = document.createElement('div')
        temp.textContent = input
        setOutput(temp.innerHTML)
    }, [input])

    const handleDecode = useCallback(() => {
        let temp = document.createElement('div')
        temp.innerHTML = input
        setOutput(temp.textContent || temp.innerText || '')
    }, [input])

    const handleCopy = async () => {
        if (!output) return
        await navigator.clipboard.writeText(output)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="w-full flex justify-center pb-24">
            <div className="w-full max-w-4xl flex flex-col items-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12 flex flex-col items-center"
                >
                    <div className="mb-6 inline-flex p-4 rounded-2xl bg-surface/50 border border-border/50 text-accent shadow-lg shadow-accent/10">
                        <FileCode className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-primary mb-4">
                        HTML Encoder/Decoder
                    </h1>
                    <p className="text-lg text-secondary max-w-xl mx-auto">
                        Encode text to HTML entities or decode them back.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6"
                >
                    {/* Input Editor */}
                    <div className="flex flex-col gap-6">
                        <div className="p-6 rounded-2xl border border-border/40 bg-surface/40 backdrop-blur-sm h-full flex flex-col transition-all duration-300 hover:border-accent/30">
                            <label className="block text-sm font-medium text-tertiary uppercase tracking-wider mb-3 ml-1">Input String</label>
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                className="w-full flex-grow min-h-[200px] bg-transparent border border-border/50 rounded-xl p-4 text-primary focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all font-mono text-sm resize-none shadow-inner placeholder:text-tertiary"
                                placeholder="Enter HTML or text here..."
                            />
                            <div className="flex flex-wrap items-center gap-3 mt-4">
                                <Button
                                    onClick={handleEncode}
                                    className="flex-1 bg-accent hover:bg-accent/90 text-surface shadow-lg shadow-accent/20 border-none"
                                >
                                    <ArrowRight className="w-4 h-4 mr-2" /> Encode HTML
                                </Button>
                                <Button
                                    onClick={handleDecode}
                                    className="flex-1 bg-surface border border-border/50 hover:border-accent/50 hover:text-accent text-primary transition-all shadow-sm group"
                                >
                                    <ArrowLeft className="w-4 h-4 mr-2 text-secondary group-hover:text-accent transition-colors" /> Decode HTML
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Output Viewer (Main Display Box) */}
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col p-6 rounded-2xl border border-border/50 bg-surface shadow-xl relative overflow-hidden h-full min-h-[300px] transition-all duration-300 hover:border-accent/40 hover:shadow-2xl">
                            <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] pointer-events-none" />

                            <div className="relative z-10 flex flex-col h-full">
                                <div className="flex justify-between items-center mb-3 ml-1">
                                    <label className="block text-sm font-medium text-tertiary uppercase tracking-wider">Output Result</label>
                                    <Button
                                        onClick={handleCopy}
                                        disabled={!output}
                                        className="h-8 px-3 bg-surface hover:bg-surface border border-border/50 text-secondary hover:text-accent transition-colors shadow-sm cursor-pointer relative z-20"
                                    >
                                        {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                                        {copied ? 'Copied' : 'Copy'}
                                    </Button>
                                </div>
                                <textarea
                                    readOnly
                                    value={output}
                                    className="w-full flex-grow min-h-[200px] bg-transparent resize-none font-mono text-sm text-primary leading-relaxed focus:outline-none mt-2"
                                    placeholder="Result will appear here..."
                                    spellCheck={false}
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
