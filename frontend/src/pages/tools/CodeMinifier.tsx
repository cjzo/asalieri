import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '../../components/ui/button'
import { FileCode, Copy, Check, Trash2, FileOutput } from 'lucide-react'

type CodeType = 'json' | 'js' | 'css' | 'html'

export function CodeMinifier() {
    const [input, setInput] = useState('{\n  "status": "success",\n  "message": "Hello World"\n}')
    const [output, setOutput] = useState('')
    const [codeType, setCodeType] = useState<CodeType>('json')
    const [copied, setCopied] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const minifyCode = () => {
        if (!input.trim()) {
            setOutput('')
            setError(null)
            return
        }

        try {
            let result = input
            setError(null)

            if (codeType === 'json') {
                result = JSON.stringify(JSON.parse(input))
            } else if (codeType === 'js') {
                // Extremely basic JS regex minification (strips comments, trims, removes newlines)
                result = result.replace(/\/\/.*$/gm, '') // single-line comments
                result = result.replace(/\/\*[\s\S]*?\*\//g, '') // multi-line comments
                result = result.replace(/\s+/g, ' ') // collapse whitespace
                result = result.replace(/\s*([=+\-*/%<>&|^!~?:;,{}()[\]])\s*/g, '$1') // remove spacing around operators
            } else if (codeType === 'css') {
                result = result.replace(/\/\*[\s\S]*?\*\//g, '') // strip comments
                result = result.replace(/\s+/g, ' ') // collapse whitespace
                result = result.replace(/\s*([{},:>])\s*/g, '$1') // remove spacing around operators/braces
                result = result.replace(/;\}/g, '}') // strip trailing semicolons
            } else if (codeType === 'html') {
                result = result.replace(/<!--[\s\S]*?-->/g, '') // strip HTML comments
                result = result.replace(/>\s+</g, '><') // collapse whitespace between tags
                result = result.replace(/\s+/g, ' ') // collapse inner whitespace
            }

            setOutput(result.trim())
        } catch (e: any) {
            setError(e.message || 'Syntax Error')
            setOutput('')
        }
    }

    const handleCopy = async () => {
        if (!output || error) return
        await navigator.clipboard.writeText(output)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const savings = (input.length > 0 && output.length > 0) ? (((input.length - output.length) / input.length) * 100).toFixed(1) : 0

    return (
        <div className="w-full flex justify-center pb-24 min-h-[80vh]">
            <div className="w-full max-w-6xl flex flex-col items-center px-4">

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
                        Code Minifier
                    </h1>
                    <p className="text-lg text-secondary max-w-xl mx-auto font-medium">
                        Instantly compress JSON, JS, CSS, and HTML payloads by structurally collapsing whitespace.
                    </p>
                </motion.div>

                {/* Categories Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full flex flex-wrap justify-center gap-3 mb-8"
                >
                    {[
                        { id: 'json', label: 'JSON' },
                        { id: 'js', label: 'JavaScript' },
                        { id: 'css', label: 'CSS' },
                        { id: 'html', label: 'HTML' }
                    ].map((mode) => (
                        <button
                            key={mode.id}
                            onClick={() => { setCodeType(mode.id as CodeType); setOutput(''); setError(null); }}
                            className={`px-6 py-3 rounded-full text-sm font-bold tracking-wider uppercase transition-all shadow-sm ${codeType === mode.id
                                ? 'bg-accent/90 text-white shadow-accent/20 border border-transparent'
                                : 'bg-surface/50 text-secondary hover:text-primary hover:bg-surface border border-border/50'
                                }`}
                        >
                            {mode.label}
                        </button>
                    ))}
                </motion.div>

                <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 relative items-stretch">

                    {/* Left Pane: Input */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col h-[500px] rounded-3xl border border-border/40 bg-surface/40 backdrop-blur-sm shadow-sm transition-all hover:border-accent/40"
                    >
                        <div className="p-4 border-b border-border/30 bg-surface/20 flex justify-between items-center">
                            <label className="text-sm font-bold uppercase tracking-wider text-tertiary ml-2">Original {codeType.toUpperCase()}</label>
                            <div className="flex gap-2">
                                <Button
                                    onClick={() => setInput('')}
                                    disabled={!input}
                                    className="h-8 text-xs !bg-transparent !text-tertiary hover:!text-red-500 hover:!bg-red-500/10 !shadow-none !px-2"
                                >
                                    <Trash2 className="w-3.5 h-3.5 mr-1" /> Clear
                                </Button>
                                <Button
                                    onClick={minifyCode}
                                    disabled={!input}
                                    className="h-8 px-4 bg-accent/10 text-accent hover:bg-accent hover:text-white shadow-sm transition-all border border-accent/20 text-xs font-bold uppercase tracking-wider"
                                >
                                    Minify
                                </Button>
                            </div>
                        </div>
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={`Paste your ${codeType.toUpperCase()} code here...`}
                            className="w-full flex-grow p-5 bg-transparent text-primary focus:outline-none transition-all resize-none shadow-inner font-mono text-sm leading-relaxed custom-scrollbar"
                            spellCheck="false"
                        />
                        <div className="p-3 border-t border-border/30 bg-surface/30 flex justify-between items-center px-6">
                            <span className="text-xs font-bold uppercase tracking-wider text-tertiary">Input Size</span>
                            <span className="font-mono text-xs text-primary bg-surface border border-border/50 px-2 py-1 rounded-md">
                                {input.length.toLocaleString()} bytes
                            </span>
                        </div>
                    </motion.div>

                    {/* Right Pane: Output */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`flex flex-col h-[500px] rounded-3xl border bg-surface shadow-xl relative overflow-hidden transition-all duration-300 hover:shadow-2xl ${error ? 'border-red-500/50 ring-1 ring-red-500/20' : 'border-border/50 hover:border-accent/40'}`}
                    >
                        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] pointer-events-none" />

                        <div className="relative z-10 flex flex-col h-full">
                            <div className="flex justify-between items-center px-4 py-4 border-b border-border/30 bg-surface/30">
                                <label className="text-sm font-bold uppercase tracking-wider text-accent ml-2 flex items-center">
                                    <FileOutput className="w-4 h-4 mr-2" /> Minified Output
                                </label>
                                <Button
                                    onClick={handleCopy}
                                    disabled={!output || !!error}
                                    className="h-8 px-3 shadow-md shadow-accent/20 text-xs"
                                >
                                    {copied ? <Check className="w-3.5 h-3.5 mr-1.5" /> : <Copy className="w-3.5 h-3.5 mr-1.5" />}
                                    {copied ? 'Copied' : 'Copy Result'}
                                </Button>
                            </div>

                            <div className="flex-grow p-1">
                                {error ? (
                                    <div className="h-full flex flex-col items-center justify-center text-red-500/80 p-6 text-center">
                                        <span className="font-mono text-sm bg-red-500/10 p-4 rounded-xl border border-red-500/20 break-all">
                                            {error}
                                        </span>
                                    </div>
                                ) : (
                                    <textarea
                                        value={output}
                                        readOnly
                                        placeholder="Minified result will appear here..."
                                        className="w-full h-full p-4 bg-transparent text-secondary focus:outline-none transition-all resize-none shadow-inner font-mono text-sm leading-relaxed custom-scrollbar break-all"
                                        spellCheck="false"
                                    />
                                )}
                            </div>

                            {/* Savings Footer */}
                            {!error && output && (
                                <div className="p-3 border-t border-accent/20 bg-accent/5 flex justify-between items-center px-6">
                                    <span className="text-xs font-bold uppercase tracking-wider text-accent">Compression Stats</span>
                                    <div className="flex gap-4">
                                        <span className="font-mono text-xs text-primary flex items-center">
                                            Size: <span className="ml-2 bg-surface/80 border border-border/50 px-2 py-0.5 rounded text-accent font-bold">{output.length.toLocaleString()} b</span>
                                        </span>
                                        <span className="font-mono text-xs text-emerald-500 flex items-center">
                                            Saved: <span className="ml-2 font-bold">{savings}%</span>
                                        </span>
                                    </div>
                                </div>
                            )}

                        </div>
                    </motion.div>

                </div>
            </div>
        </div>
    )
}
