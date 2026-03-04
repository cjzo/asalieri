import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '../../components/ui/button'
import { Type, Copy, Check, Trash2 } from 'lucide-react'
import JsonToTS from 'json-to-ts'

export function JsonToTypeScript() {
    const [input, setInput] = useState('{\n  "user": {\n    "id": 1,\n    "name": "Alex",\n    "isActive": true,\n    "roles": ["admin", "editor"]\n  }\n}')
    const [output, setOutput] = useState('')
    const [copied, setCopied] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [rootName, setRootName] = useState('RootObject')

    useEffect(() => {
        if (!input.trim()) {
            setOutput('')
            setError(null)
            return
        }

        try {
            const parsed = JSON.parse(input)
            setError(null)

            const interfaces = JsonToTS(parsed, { rootName })
            setOutput(interfaces.join('\\n\\n'))

        } catch (e: any) {
            setError('Invalid JSON syntax')
            setOutput('')
        }
    }, [input, rootName])

    const handleCopy = async () => {
        if (!output || error) return
        await navigator.clipboard.writeText(output)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="w-full flex justify-center pb-24 min-h-[80vh]">
            <div className="w-full max-w-7xl flex flex-col items-center px-4">

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="text-center mb-12 flex flex-col items-center relative"
                >
                    <div className="mb-6 inline-flex p-4 rounded-2xl bg-surface/50 border border-border/50 text-accent shadow-lg shadow-accent/10">
                        <Type className="w-8 h-8" />
                    </div>

                    <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-primary mb-4">
                        JSON to TypeScript
                    </h1>
                    <p className="text-lg text-secondary max-w-xl mx-auto font-medium">
                        Automatically generate strictly typed interfaces from JSON objects.
                    </p>
                </motion.div>

                <div className="w-full flex flex-col lg:flex-row gap-6 relative items-stretch">

                    {/* Left Pane: Input */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex-1 flex flex-col h-[600px] rounded-3xl border border-border/40 bg-surface/40 backdrop-blur-sm shadow-sm transition-all hover:border-accent/40 overflow-hidden relative"
                    >
                        <div className="p-4 border-b border-border/30 bg-surface/20 flex flex-col gap-4">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-bold uppercase tracking-wider text-tertiary ml-2">Valid JSON</label>
                                <Button
                                    onClick={() => setInput('')}
                                    disabled={!input}
                                    className="h-8 text-xs !bg-transparent !text-tertiary hover:!text-red-500 hover:!bg-red-500/10 !shadow-none !px-2"
                                >
                                    <Trash2 className="w-3.5 h-3.5 mr-1" /> Clear
                                </Button>
                            </div>

                            <div className="relative z-10 mx-2">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="text-tertiary text-sm font-bold uppercase tracking-widest">Root Name:</span>
                                </div>
                                <input
                                    type="text"
                                    value={rootName}
                                    onChange={(e) => setRootName(e.target.value || 'RootObject')}
                                    className="w-full pl-28 pr-4 py-2 bg-surface border border-border/50 text-primary font-mono text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/40 shadow-inner transition-all"
                                    placeholder="RootObject"
                                />
                            </div>
                        </div>
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Paste your JSON here..."
                            className="w-full flex-grow p-5 bg-transparent text-primary focus:outline-none transition-all resize-none shadow-inner font-mono text-sm leading-relaxed custom-scrollbar"
                            spellCheck="false"
                        />
                    </motion.div>

                    {/* Right Pane: Output */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`flex-1 flex flex-col h-[600px] rounded-3xl border bg-surface shadow-xl relative overflow-hidden transition-all duration-300 hover:shadow-2xl ${error ? 'border-red-500/50 ring-1 ring-red-500/20' : 'border-border/50 hover:border-accent/40'}`}
                    >
                        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] pointer-events-none" />

                        <div className="relative z-10 flex flex-col h-full">
                            <div className="flex justify-between items-center px-4 py-4 border-b border-border/30 bg-surface/30">
                                <label className="text-sm font-bold uppercase tracking-wider text-accent ml-2 flex items-center">
                                    <Type className="w-4 h-4 mr-2" /> TypeScript Interfaces
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
                                        placeholder="TypeScript definitions will appear here..."
                                        className="w-full h-full p-5 bg-transparent text-accent focus:outline-none transition-all resize-none shadow-inner font-mono text-sm leading-relaxed custom-scrollbar break-words"
                                        spellCheck="false"
                                    />
                                )}
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </div>
    )
}
