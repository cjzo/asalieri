import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Button } from '../../components/ui/button'
import { FileText, Type, AlignLeft, Hash, X, BookOpen, Copy, Check } from 'lucide-react'

interface StatCardProps {
    label: string
    value: number | string
    icon: React.ElementType
}

function StatCard({ label, value, icon: Icon }: StatCardProps) {
    return (
        <div className="flex flex-col p-4 rounded-xl border border-border/50 bg-surface/50 shadow-sm relative overflow-hidden group hover:border-accent/40 transition-colors">
            <div className="flex justify-between items-start mb-2 relative z-10">
                <p className="text-xs font-bold uppercase tracking-wider text-tertiary group-hover:text-secondary transition-colors">
                    {label}
                </p>
                <Icon className="w-4 h-4 text-accent opacity-50 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-3xl font-black text-primary relative z-10">
                {value}
            </p>
        </div>
    )
}

export function WordCounter() {
    const [text, setText] = useState('')
    const [copied, setCopied] = useState(false)

    const stats = useMemo(() => {
        if (!text) {
            return {
                words: 0,
                charsTotal: 0,
                charsNoSpaces: 0,
                sentences: 0,
                paragraphs: 0,
                readingTime: '0 min'
            }
        }

        const words = text.match(/\b\w+\b/g)?.length || 0
        const charsTotal = text.length
        const charsNoSpaces = text.replace(/\s/g, '').length
        const sentences = text.match(/[.!?]+(?=\s+|$)/g)?.length || 0
        const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length

        // Average reading speed ~200-250 wpm
        const readTimeMinutes = Math.max(1, Math.ceil(words / 225))
        const readingTime = `${readTimeMinutes} min`

        return {
            words,
            charsTotal,
            charsNoSpaces,
            sentences,
            paragraphs,
            readingTime
        }
    }, [text])

    const handleCopy = async () => {
        if (!text) return
        await navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const clearText = () => setText('')

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
                        <FileText className="w-8 h-8" />
                    </div>

                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-primary mb-4">
                        Word Counter
                    </h1>
                    <p className="text-lg text-secondary max-w-xl mx-auto font-medium">
                        Real-time analytics for your text including words, characters, and reading time.
                    </p>
                </motion.div>

                <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

                    {/* Left Pane: Input Area (Controls Box) */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-8 flex flex-col gap-4 p-6 rounded-2xl border border-border/40 bg-surface/40 backdrop-blur-sm shadow-sm transition-all h-[500px] hover:border-accent/30"
                    >
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-sm font-medium uppercase tracking-wider text-tertiary">
                                Your Text
                            </label>
                            <div className="flex gap-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={clearText}
                                    disabled={!text}
                                    className="h-8 text-xs text-tertiary hover:text-red-500 hover:bg-red-500/10"
                                >
                                    <X className="w-4 h-4 mr-1" /> Clear
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleCopy}
                                    disabled={!text}
                                    className="h-8 text-xs text-tertiary hover:text-primary hover:bg-surface/50"
                                >
                                    {copied ? <Check className="w-4 h-4 mr-1 text-emerald-500" /> : <Copy className="w-4 h-4 mr-1" />}
                                    {copied ? 'Copied' : 'Copy'}
                                </Button>
                            </div>
                        </div>

                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Start typing or paste your document here..."
                            className="w-full flex-grow bg-surface/50 border border-border/50 rounded-xl p-5 text-primary text-lg focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/50 transition-all resize-none shadow-inner leading-relaxed"
                            spellCheck="false"
                        />
                    </motion.div>

                    {/* Right Pane: Stats Matrix (Main Display Box) */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-4 flex flex-col p-6 rounded-2xl border border-border/50 bg-surface shadow-xl relative overflow-hidden transition-all duration-300 hover:border-accent/40 hover:shadow-2xl h-[500px]"
                    >
                        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] pointer-events-none" />

                        <div className="relative z-10 flex flex-col h-full">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-primary mb-6 flex items-center gap-2">
                                <AlignLeft className="w-4 h-4 text-accent" />
                                Statistics Matrix
                            </h3>

                            <div className="grid grid-cols-2 gap-4 auto-rows-max overflow-y-auto pr-2 pb-4">
                                <StatCard label="Words" value={stats.words} icon={Type} />
                                <StatCard label="Characters" value={stats.charsTotal} icon={Hash} />

                                <div className="col-span-2">
                                    <StatCard label="Characters (No Spaces)" value={stats.charsNoSpaces} icon={Hash} />
                                </div>

                                <StatCard label="Sentences" value={stats.sentences} icon={AlignLeft} />
                                <StatCard label="Paragraphs" value={stats.paragraphs} icon={FileText} />

                                <div className="col-span-2 mt-2">
                                    <div className="flex items-center justify-between p-4 rounded-xl border border-accent/20 bg-accent/5 relative overflow-hidden">
                                        <div className="flex flex-col z-10">
                                            <p className="text-xs font-bold uppercase tracking-wider text-tertiary mb-1">
                                                Est. Reading Time
                                            </p>
                                            <p className="text-2xl font-black text-accent">{stats.readingTime}</p>
                                        </div>
                                        <BookOpen className="w-8 h-8 text-accent/30 relative z-10" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </div>
    )
}
