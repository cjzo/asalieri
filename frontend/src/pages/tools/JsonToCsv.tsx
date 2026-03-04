import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '../../components/ui/button'
import { FileJson, Copy, Check, Trash2, ArrowRightLeft, Download } from 'lucide-react'
import Papa from 'papaparse'

export function JsonToCsv() {
    const [input, setInput] = useState('[\n  {\n    "name": "Alex",\n    "age": 28,\n    "role": "Engineer"\n  },\n  {\n    "name": "Jordan",\n    "age": 34,\n    "role": "Designer"\n  }\n]')
    const [output, setOutput] = useState('')
    const [mode, setMode] = useState<'json2csv' | 'csv2json'>('json2csv')
    const [copied, setCopied] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        setError(null)
        if (!input.trim()) {
            setOutput('')
            return
        }

        try {
            if (mode === 'json2csv') {
                const parsedJson = JSON.parse(input)
                // Ensure array
                const dataArray = Array.isArray(parsedJson) ? parsedJson : [parsedJson]
                const csv = Papa.unparse(dataArray)
                setOutput(csv)
            } else {
                Papa.parse(input, {
                    header: true,
                    skipEmptyLines: true,
                    complete: (results) => {
                        if (results.errors.length > 0) {
                            setError(results.errors[0].message)
                            setOutput('')
                        } else {
                            setOutput(JSON.stringify(results.data, null, 2))
                        }
                    }
                })
            }
        } catch (err: any) {
            setError(err.message || 'Invalid format')
            setOutput('')
        }
    }, [input, mode])

    const handleCopy = async () => {
        if (!output) return
        await navigator.clipboard.writeText(output)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const downloadFile = () => {
        if (!output) return
        const isCsv = mode === 'json2csv'
        const blob = new Blob([output], { type: isCsv ? 'text/csv;charset=utf-8;' : 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = isCsv ? 'data.csv' : 'data.json'
        a.click()
        URL.revokeObjectURL(url)
    }

    const swapMode = () => {
        setMode(mode === 'json2csv' ? 'csv2json' : 'json2csv')
        setInput(output || '') // Carry over successful output
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
                        <FileJson className="w-8 h-8" />
                    </div>

                    <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-primary mb-4">
                        JSON ↔ CSV Converter
                    </h1>
                    <p className="text-lg text-secondary max-w-xl mx-auto font-medium">
                        Seamlessly convert data arrays between JSON and CSV formats.
                    </p>
                </motion.div>

                <div className="w-full flex flex-col gap-6">

                    {/* Mode Toggle Banner */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col md:flex-row items-center justify-center gap-4 mb-2"
                    >
                        <div className="flex bg-surface/40 p-1.5 rounded-2xl border border-border/50 backdrop-blur-sm shadow-sm hover:border-accent/30 transition-all">
                            <button
                                onClick={() => setMode('json2csv')}
                                className={`px-6 py-3 rounded-xl text-sm font-medium transition-all ${mode === 'json2csv'
                                        ? 'bg-accent/90 text-white shadow-md shadow-accent/20'
                                        : 'text-secondary hover:text-primary hover:bg-surface'
                                    }`}
                            >
                                JSON to CSV
                            </button>
                            <button
                                onClick={() => setMode('csv2json')}
                                className={`px-6 py-3 rounded-xl text-sm font-medium transition-all ${mode === 'csv2json'
                                        ? 'bg-accent/90 text-white shadow-md shadow-accent/20'
                                        : 'text-secondary hover:text-primary hover:bg-surface'
                                    }`}
                            >
                                CSV to JSON
                            </button>
                        </div>
                    </motion.div>

                    <div className="w-full flex flex-col lg:flex-row gap-6 relative">

                        {/* Input Area */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex-1 flex flex-col h-[600px] rounded-2xl border border-border/40 bg-surface/40 backdrop-blur-sm shadow-sm transition-all hover:border-accent/30 p-2"
                        >
                            <div className="flex justify-between items-center px-4 py-3 border-b border-border/30">
                                <label className="text-sm font-bold uppercase tracking-wider text-tertiary">
                                    {mode === 'json2csv' ? 'JSON Input' : 'CSV Input'}
                                </label>
                                <Button
                                    onClick={() => setInput('')}
                                    disabled={!input}
                                    className="h-8 text-xs !bg-transparent !text-tertiary hover:!text-red-500 hover:!bg-red-500/10 !shadow-none !px-2"
                                >
                                    <Trash2 className="w-4 h-4 mr-1" /> Clear
                                </Button>
                            </div>
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder={`Paste your ${mode === 'json2csv' ? 'JSON' : 'CSV'} here...`}
                                className="w-full flex-grow p-5 bg-transparent text-primary focus:outline-none transition-all resize-none shadow-inner font-mono text-sm leading-relaxed custom-scrollbar"
                                spellCheck="false"
                            />
                        </motion.div>

                        {/* Swap Button (Desktop) */}
                        <div className="hidden lg:flex flex-col items-center justify-center -mx-3 z-10 w-12">
                            <Button
                                onClick={swapMode}
                                className="h-14 w-14 rounded-full bg-surface border-2 border-border/50 text-accent hover:bg-surface hover:text-primary hover:border-accent shadow-lg shadow-accent/10 transition-all transform hover:scale-110 active:scale-95 absolute"
                                style={{ left: '50%', transform: 'translateX(-50%)' }}
                                title="Swap conversion direction"
                            >
                                <ArrowRightLeft className="w-6 h-6" />
                            </Button>
                        </div>

                        {/* Swap Button (Mobile) */}
                        <div className="flex lg:hidden justify-center -my-9 z-10 w-full">
                            <Button
                                onClick={swapMode}
                                className="h-12 w-12 rounded-full bg-surface border-2 border-border/50 text-accent hover:bg-surface hover:text-primary hover:border-accent shadow-lg transition-all"
                            >
                                <ArrowRightLeft className="w-5 h-5" />
                            </Button>
                        </div>

                        {/* Output Area */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`flex-1 flex flex-col h-[600px] rounded-2xl border bg-surface shadow-xl relative overflow-hidden transition-all duration-300 hover:shadow-2xl ${error ? 'border-red-500/50 hover:border-red-500/80 ring-1 ring-red-500/20' : 'border-border/50 hover:border-accent/40'}`}
                        >
                            <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] pointer-events-none" />

                            <div className="relative z-10 flex flex-col h-full">
                                <div className="flex justify-between items-center px-4 py-3 border-b border-border/30 bg-surface/30">
                                    <label className="text-sm font-bold uppercase tracking-wider text-accent ml-2">
                                        {mode === 'json2csv' ? 'CSV Output' : 'JSON Output'}
                                    </label>
                                    <div className="flex gap-2">
                                        <Button
                                            onClick={handleCopy}
                                            disabled={!output || !!error}
                                            className="h-8 text-xs !bg-transparent !text-tertiary hover:!text-primary hover:!bg-surface/50 !shadow-none !px-2"
                                        >
                                            {copied ? <Check className="w-4 h-4 mr-1 text-emerald-500" /> : <Copy className="w-4 h-4 mr-1" />}
                                            {copied ? 'Copied' : 'Copy'}
                                        </Button>
                                        <Button
                                            onClick={downloadFile}
                                            disabled={!output || !!error}
                                            className="h-8 text-xs !bg-transparent !text-tertiary hover:!text-accent hover:!bg-accent/10 !shadow-none !px-2"
                                        >
                                            <Download className="w-4 h-4 mr-1" /> Download
                                        </Button>
                                    </div>
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
                                            placeholder="Conversion result will appear here..."
                                            className="w-full h-full p-4 bg-transparent text-secondary focus:outline-none transition-all resize-none shadow-inner font-mono text-sm leading-relaxed custom-scrollbar"
                                            spellCheck="false"
                                        />
                                    )}
                                </div>
                            </div>
                        </motion.div>

                    </div>
                </div>
            </div>
        </div>
    )
}
