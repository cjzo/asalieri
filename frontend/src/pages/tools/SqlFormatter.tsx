import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '../../components/ui/button'
import { Database, Copy, Check, Trash2, FileOutput } from 'lucide-react'
import { format } from 'sql-formatter'

export function SqlFormatter() {
    const [input, setInput] = useState("SELECT id, name, created_at FROM users WHERE status = 'active' ORDER BY created_at DESC LIMIT 10;")
    const [output, setOutput] = useState('')
    const [dialect, setDialect] = useState<string>('sql')
    const [copied, setCopied] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleFormat = () => {
        if (!input.trim()) {
            setOutput('')
            setError(null)
            return
        }

        try {
            const formatted = format(input, {
                language: dialect as any,
                keywordCase: 'upper',
                linesBetweenQueries: 2,
            })
            setOutput(formatted)
            setError(null)
        } catch (e: any) {
            setError(e.message || 'Syntax Error in SQL')
            setOutput('')
        }
    }

    const handleCopy = async () => {
        if (!output || error) return
        await navigator.clipboard.writeText(output)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const dialects = [
        { id: 'sql', label: 'Standard SQL' },
        { id: 'postgresql', label: 'PostgreSQL' },
        { id: 'mysql', label: 'MySQL' },
        { id: 'mariadb', label: 'MariaDB' },
        { id: 'sqlite', label: 'SQLite' }
    ]

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
                        <Database className="w-8 h-8" />
                    </div>

                    <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-primary mb-4">
                        SQL Formatter
                    </h1>
                    <p className="text-lg text-secondary max-w-xl mx-auto font-medium">
                        Instantly format and beautify SQL queries across multiple dialects.
                    </p>
                </motion.div>

                {/* Dialect Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full flex flex-wrap justify-center gap-3 mb-8"
                >
                    {dialects.map((mode) => (
                        <button
                            key={mode.id}
                            onClick={() => { setDialect(mode.id); setOutput(''); setError(null); }}
                            className={`px-5 py-2.5 rounded-full text-sm font-bold tracking-wider uppercase transition-all shadow-sm ${dialect === mode.id
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
                        className="flex flex-col h-[600px] rounded-3xl border border-border/40 bg-surface/40 backdrop-blur-sm shadow-sm transition-all hover:border-accent/40"
                    >
                        <div className="p-4 border-b border-border/30 bg-surface/20 flex justify-between items-center">
                            <label className="text-sm font-bold uppercase tracking-wider text-tertiary ml-2">Raw Query</label>
                            <div className="flex gap-2">
                                <Button
                                    onClick={() => setInput('')}
                                    disabled={!input}
                                    className="h-8 text-xs !bg-transparent !text-tertiary hover:!text-red-500 hover:!bg-red-500/10 !shadow-none !px-2"
                                >
                                    <Trash2 className="w-3.5 h-3.5 mr-1" /> Clear
                                </Button>
                                <Button
                                    onClick={handleFormat}
                                    disabled={!input}
                                    className="h-8 px-4 bg-accent/10 text-accent hover:bg-accent hover:text-white shadow-sm transition-all border border-accent/20 text-xs font-bold uppercase tracking-wider"
                                >
                                    Format SQL
                                </Button>
                            </div>
                        </div>
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Paste your unformatted SQL here..."
                            className="w-full flex-grow p-5 bg-transparent text-primary focus:outline-none transition-all resize-none shadow-inner font-mono text-sm leading-relaxed custom-scrollbar"
                            spellCheck="false"
                        />
                    </motion.div>

                    {/* Right Pane: Output */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`flex flex-col h-[600px] rounded-3xl border bg-surface shadow-xl relative overflow-hidden transition-all duration-300 hover:shadow-2xl ${error ? 'border-red-500/50 ring-1 ring-red-500/20' : 'border-border/50 hover:border-accent/40'}`}
                    >
                        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] pointer-events-none" />

                        <div className="relative z-10 flex flex-col h-full">
                            <div className="flex justify-between items-center px-4 py-4 border-b border-border/30 bg-surface/30">
                                <label className="text-sm font-bold uppercase tracking-wider text-accent ml-2 flex items-center">
                                    <FileOutput className="w-4 h-4 mr-2" /> Formatted Output
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
                                        placeholder="Formatted SQL will appear here..."
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
