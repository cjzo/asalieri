import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '../../components/ui/button'
import { Link2, Copy, Check, Trash2 } from 'lucide-react'

export function TextToSlug() {
    const [textInput, setTextInput] = useState('Build Kinetic \u0026 Fluid Interfaces Today!')
    const [slugOutput, setSlugOutput] = useState('')
    const [copied, setCopied] = useState(false)

    // Slug generation options
    const [options, setOptions] = useState({
        removeStopWords: false,
        useUnderscores: false,
    })

    const stopWords = ['a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'on', 'at', 'to', 'from', 'by', 'with', 'of']

    const generateSlug = () => {
        let str = textInput.toLowerCase().trim()

        if (options.removeStopWords) {
            const words = str.split(/\s+/)
            str = words.filter(word => !stopWords.includes(word)).join(' ')
        }

        // Replace special chars and normalize
        str = str.normalize('NFD').replace(/[\u0300-\u036f]/g, '') // remove diacritics

        if (options.useUnderscores) {
            str = str.replace(/[^a-z0-9]+/g, '_')
                .replace(/^_+|_+$/g, '')
        } else {
            str = str.replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '')
        }

        setSlugOutput(str)
    }

    useEffect(() => {
        generateSlug()
    }, [textInput, options])

    const handleCopy = async () => {
        if (!slugOutput) return
        await navigator.clipboard.writeText(slugOutput)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const toggleOption = (key: keyof typeof options) => {
        setOptions(prev => ({
            ...prev,
            [key]: !prev[key]
        }))
    }

    return (
        <div className="w-full flex justify-center pb-24 min-h-[80vh]">
            <div className="w-full max-w-5xl flex flex-col items-center px-4">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="text-center mb-12 flex flex-col items-center"
                >
                    <div className="mb-6 inline-flex p-4 rounded-2xl bg-surface/50 border border-border/50 text-accent shadow-lg shadow-accent/10">
                        <Link2 className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-primary mb-4">
                        Text to Slug Converter
                    </h1>
                    <p className="text-lg text-secondary max-w-xl mx-auto font-medium">
                        Instantly transform any text or title into an SEO-friendly URL slug.
                    </p>
                </motion.div>

                <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 relative">

                    {/* Left Pane: Config & Input */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-5 flex flex-col gap-6"
                    >
                        <div className="p-6 rounded-2xl border border-border/40 bg-surface/40 backdrop-blur-sm shadow-sm transition-all hover:border-accent/30 space-y-6">

                            <div className="flex justify-between items-center px-1">
                                <label className="text-sm font-bold uppercase tracking-wider text-tertiary">
                                    Original Text
                                </label>
                                <Button
                                    onClick={() => setTextInput('')}
                                    disabled={!textInput}
                                    className="h-8 text-xs !bg-transparent !text-tertiary hover:!text-red-500 hover:!bg-red-500/10 !shadow-none !px-2"
                                >
                                    <Trash2 className="w-4 h-4 mr-1" /> Clear
                                </Button>
                            </div>

                            <textarea
                                value={textInput}
                                onChange={(e) => setTextInput(e.target.value)}
                                placeholder="Enter your article title or text here..."
                                className="w-full h-32 bg-transparent border border-border/50 rounded-xl p-4 text-primary focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/50 transition-all resize-none shadow-inner leading-relaxed"
                                spellCheck="false"
                            />

                            <div className="space-y-3 pt-4 border-t border-border/20">
                                <div className="text-sm font-bold uppercase tracking-wider text-tertiary mb-3 px-1">Formatting Options</div>
                                {[
                                    { id: 'useUnderscores', label: 'Use Underscores Instead of Hyphens (_)' },
                                    { id: 'removeStopWords', label: 'Remove Short Stop Words (a, the, out...)' }
                                ].map((opt) => (
                                    <div
                                        key={opt.id}
                                        onClick={() => toggleOption(opt.id as keyof typeof options)}
                                        className="flex items-center gap-3 cursor-pointer group px-1"
                                    >
                                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${options[opt.id as keyof typeof options] ? 'bg-accent border-accent text-white' : 'border-border/80 group-hover:border-accent/50'}`}>
                                            {options[opt.id as keyof typeof options] && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                        </div>
                                        <span className="text-sm text-secondary select-none font-medium group-hover:text-primary transition-colors">{opt.label}</span>
                                    </div>
                                ))}
                            </div>

                        </div>
                    </motion.div>

                    {/* Right Pane: Generated Slug Output */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-7 flex flex-col gap-6"
                    >
                        <div className="flex flex-col rounded-2xl border border-border/50 bg-surface shadow-xl relative overflow-hidden group h-full min-h-[300px] transition-all duration-300 hover:border-accent/40 hover:shadow-2xl">
                            <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] pointer-events-none" />

                            <div className="relative z-10 flex justify-between items-center px-6 py-4 border-b border-border/30 bg-surface/30">
                                <label className="text-sm font-bold uppercase tracking-widest text-accent">URL Slug Output</label>
                                <Button
                                    onClick={handleCopy}
                                    disabled={!slugOutput}
                                    className="h-9 px-4 shadow-md shadow-accent/20"
                                >
                                    {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                                    {copied ? 'Copied' : 'Copy'}
                                </Button>
                            </div>

                            <div className="relative z-10 p-6 flex flex-col flex-grow items-center justify-center">
                                {slugOutput ? (
                                    <div className="w-full text-center">
                                        <div className="inline-block relative">
                                            <span className="text-tertiary/50 absolute -left-8 top-1/2 -translate-y-1/2 pointer-events-none">/</span>
                                            <p className="text-2xl md:text-3xl font-mono text-primary font-medium tracking-tight break-all">
                                                {slugOutput}
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-tertiary flex flex-col items-center opacity-50">
                                        <Link2 className="w-12 h-12 mb-4" />
                                        <p className="font-medium tracking-wide">Enter text to see URL slug</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </div>
    )
}
