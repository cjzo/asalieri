import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '../../components/ui/button'
import { TextSelect, Copy, Check, Trash2 } from 'lucide-react'

export function CaseConverter() {
    const [text, setText] = useState('')
    const [copied, setCopied] = useState(false)

    // Helper functions for various cases
    const toLowerCase = (str: string) => str.toLowerCase()
    const toUpperCase = (str: string) => str.toUpperCase()

    const toTitleCase = (str: string) => {
        return str.toLowerCase().replace(/\b\w/g, c => c.toUpperCase())
    }

    const toSentenceCase = (str: string) => {
        return str.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase())
    }

    const wordsArray = (str: string) => str.replace(/[^a-zA-Z0-9]/g, ' ').split(/\s+/).filter(Boolean)

    const toCamelCase = (str: string) => {
        const words = wordsArray(str)
        if (words.length === 0) return ''
        return words[0].toLowerCase() + words.slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('')
    }

    const toPascalCase = (str: string) => {
        return wordsArray(str).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('')
    }

    const toSnakeCase = (str: string) => wordsArray(str).join('_').toLowerCase()
    const toKebabCase = (str: string) => wordsArray(str).join('-').toLowerCase()
    const toConstantCase = (str: string) => wordsArray(str).join('_').toUpperCase()
    const toDotCase = (str: string) => wordsArray(str).join('.').toLowerCase()

    const toAlternatingCase = (str: string) => {
        return str.split('').map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join('')
    }

    const toInverseCase = (str: string) => {
        return str.split('').map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join('')
    }

    const transformations = [
        { id: 'lower', label: 'lower case', action: toLowerCase },
        { id: 'upper', label: 'UPPER CASE', action: toUpperCase },
        { id: 'title', label: 'Title Case', action: toTitleCase },
        { id: 'sentence', label: 'Sentence case', action: toSentenceCase },
        { id: 'camel', label: 'camelCase', action: toCamelCase },
        { id: 'pascal', label: 'PascalCase', action: toPascalCase },
        { id: 'snake', label: 'snake_case', action: toSnakeCase },
        { id: 'kebab', label: 'kebab-case', action: toKebabCase },
        { id: 'constant', label: 'CONSTANT_CASE', action: toConstantCase },
        { id: 'dot', label: 'dot.case', action: toDotCase },
        { id: 'alternating', label: 'aLtErNaTiNg', action: toAlternatingCase },
        { id: 'inverse', label: 'InVeRsE', action: toInverseCase }
    ]

    const handleCopy = async () => {
        if (!text) return
        await navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const applyTransformation = (action: (str: string) => string) => {
        if (!text) return
        setText(action(text))
    }

    return (
        <div className="w-full flex justify-center pb-24">
            <div className="w-full max-w-6xl flex flex-col items-center px-4">

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="text-center mb-12 flex flex-col items-center relative"
                >
                    <div className="mb-6 inline-flex p-4 rounded-2xl bg-surface/50 border border-border/50 text-accent shadow-lg shadow-accent/10">
                        <TextSelect className="w-8 h-8" />
                    </div>

                    <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-primary mb-4">
                        Case Converter
                    </h1>
                    <p className="text-lg text-secondary max-w-xl mx-auto font-medium">
                        Instantly convert text between different letter cases and programming naming conventions.
                    </p>
                </motion.div>

                <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

                    {/* Left Pane: Controls / Buttons array */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-4 flex flex-col gap-4 p-6 rounded-2xl border border-border/40 bg-surface/40 backdrop-blur-sm shadow-sm transition-all hover:border-accent/30"
                    >
                        <h3 className="text-xs font-bold uppercase tracking-wider text-tertiary mb-2 px-1">
                            Transformations
                        </h3>
                        <div className="grid grid-cols-2 lg:grid-cols-1 gap-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                            {transformations.map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => applyTransformation(t.action)}
                                    disabled={!text}
                                    className="px-4 py-3 rounded-xl border border-border/50 bg-surface/50 text-secondary hover:text-accent hover:border-accent/50 hover:bg-accent/5 transition-all outline-none text-left disabled:opacity-50 disabled:hover:border-border/50 disabled:hover:bg-surface/50 disabled:hover:text-secondary disabled:cursor-not-allowed group"
                                >
                                    <span className="text-sm font-medium tracking-wide">
                                        {t.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right Pane: Text Area */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-8 flex flex-col p-6 rounded-2xl border border-border/50 bg-surface shadow-xl relative overflow-hidden transition-all duration-300 hover:border-accent/40 hover:shadow-2xl min-h-[500px]"
                    >
                        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] pointer-events-none" />

                        <div className="relative z-10 flex flex-col h-full">
                            <div className="flex justify-between items-center mb-4 ml-1">
                                <label className="block text-sm font-medium uppercase tracking-wider text-tertiary">
                                    Your Text
                                </label>
                                <div className="flex gap-2">
                                    <Button
                                        onClick={() => setText('')}
                                        disabled={!text}
                                        className="h-8 text-xs !bg-transparent !text-tertiary hover:!text-red-500 hover:!bg-red-500/10 !shadow-none !px-2"
                                    >
                                        <Trash2 className="w-4 h-4 mr-1" /> Clear
                                    </Button>
                                    <Button
                                        onClick={handleCopy}
                                        disabled={!text}
                                        className="h-8 text-xs !bg-transparent !text-tertiary hover:!text-primary hover:!bg-surface/50 !shadow-none !px-2"
                                    >
                                        {copied ? <Check className="w-4 h-4 mr-1 text-emerald-500" /> : <Copy className="w-4 h-4 mr-1" />}
                                        {copied ? 'Copied' : 'Copy'}
                                    </Button>
                                </div>
                            </div>

                            <textarea
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="Type or paste your text here to convert..."
                                className="w-full flex-grow bg-transparent border border-border/50 rounded-xl p-5 text-primary text-base focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/50 transition-all resize-none shadow-inner leading-relaxed"
                                spellCheck="false"
                            />
                        </div>
                    </motion.div>

                </div>
            </div>
        </div>
    )
}
