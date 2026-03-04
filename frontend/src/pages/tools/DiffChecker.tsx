import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Button } from '../../components/ui/button'
import { SplitSquareHorizontal, Copy, Trash2, ArrowRightLeft } from 'lucide-react'
import { diffWordsWithSpace, diffLines } from 'diff'

export function DiffChecker() {
    const [originalText, setOriginalText] = useState('This is the original text.\nIt has some lines that will change.\nAnd some that stay the same.')
    const [modifiedText, setModifiedText] = useState('This is the modified text.\nIt has some lines that changed.\nAnd some that stay the same.\nPlus a new line.')
    const [mode, setMode] = useState<'words' | 'lines'>('words')

    const diffResult = useMemo(() => {
        if (!originalText && !modifiedText) return []

        if (mode === 'words') {
            return diffWordsWithSpace(originalText, modifiedText)
        } else {
            return diffLines(originalText, modifiedText)
        }
    }, [originalText, modifiedText, mode])

    const clearAll = () => {
        setOriginalText('')
        setModifiedText('')
    }

    const swapTexts = () => {
        setOriginalText(modifiedText)
        setModifiedText(originalText)
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
                        <SplitSquareHorizontal className="w-8 h-8" />
                    </div>

                    <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-primary mb-4">
                        Diff Checker
                    </h1>
                    <p className="text-lg text-secondary max-w-xl mx-auto font-medium">
                        Compare two pieces of text and instantly see the differences between them.
                    </p>
                </motion.div>

                <div className="w-full flex flex-col gap-6">

                    {/* Controls & Inputs Mode */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full flex flex-col lg:flex-row gap-6"
                    >
                        {/* Left Input */}
                        <div className="flex-1 flex flex-col h-[400px] rounded-2xl border border-border/40 bg-surface/40 backdrop-blur-sm shadow-sm transition-all hover:border-accent/30 p-2">
                            <div className="flex justify-between items-center px-4 py-3 border-b border-border/30">
                                <label className="text-sm font-bold uppercase tracking-wider text-tertiary">
                                    Original Text
                                </label>
                                <Button
                                    onClick={() => setOriginalText('')}
                                    disabled={!originalText}
                                    className="h-8 text-xs !bg-transparent !text-tertiary hover:!text-red-500 hover:!bg-red-500/10 !shadow-none !px-2"
                                >
                                    <Trash2 className="w-4 h-4 mr-1" /> Clear
                                </Button>
                            </div>
                            <textarea
                                value={originalText}
                                onChange={(e) => setOriginalText(e.target.value)}
                                placeholder="Paste original text here..."
                                className="w-full flex-grow p-4 bg-transparent text-secondary focus:outline-none transition-all resize-none shadow-inner font-mono text-sm leading-relaxed"
                                spellCheck="false"
                            />
                        </div>

                        {/* Center Actions (Desktop) */}
                        <div className="hidden lg:flex flex-col items-center justify-center gap-4 px-2">
                            <Button
                                onClick={swapTexts}
                                className="h-12 w-12 rounded-full bg-surface border border-border/50 text-accent hover:bg-accent/10 hover:border-accent/50 shadow-sm"
                                title="Swap Texts"
                            >
                                <ArrowRightLeft className="w-5 h-5" />
                            </Button>
                        </div>

                        {/* Center Actions (Mobile) */}
                        <div className="flex lg:hidden justify-center gap-4 py-2">
                            <Button
                                onClick={swapTexts}
                                className="h-10 px-4 rounded-xl bg-surface border border-border/50 text-accent hover:bg-accent/10 hover:border-accent/50 shadow-sm"
                            >
                                <ArrowRightLeft className="w-4 h-4 mr-2" /> Swap
                            </Button>
                        </div>

                        {/* Right Input */}
                        <div className="flex-1 flex flex-col h-[400px] rounded-2xl border border-border/40 bg-surface/40 backdrop-blur-sm shadow-sm transition-all hover:border-accent/30 p-2">
                            <div className="flex justify-between items-center px-4 py-3 border-b border-border/30">
                                <label className="text-sm font-bold uppercase tracking-wider text-accent ml-2">
                                    Modified Text
                                </label>
                                <Button
                                    onClick={() => setModifiedText('')}
                                    disabled={!modifiedText}
                                    className="h-8 text-xs !bg-transparent !text-tertiary hover:!text-red-500 hover:!bg-red-500/10 !shadow-none !px-2"
                                >
                                    <Trash2 className="w-4 h-4 mr-1" /> Clear
                                </Button>
                            </div>
                            <textarea
                                value={modifiedText}
                                onChange={(e) => setModifiedText(e.target.value)}
                                placeholder="Paste modified text here..."
                                className="w-full flex-grow p-4 bg-transparent text-primary focus:outline-none transition-all resize-none shadow-inner font-mono text-sm leading-relaxed"
                                spellCheck="false"
                            />
                        </div>
                    </motion.div>

                    {/* Diff Output */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col rounded-2xl border border-border/50 bg-surface shadow-xl relative overflow-hidden transition-all duration-300 hover:border-accent/40 hover:shadow-2xl min-h-[300px]"
                    >
                        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] pointer-events-none" />

                        <div className="relative z-10 flex flex-col h-full">
                            <div className="flex justify-between items-center px-6 py-4 border-b border-border/30 bg-surface/30">
                                <label className="text-sm font-bold uppercase tracking-wider text-primary">
                                    Difference View
                                </label>
                                <div className="flex gap-2 p-1 bg-surface/50 rounded-lg border border-border/50">
                                    <button
                                        onClick={() => setMode('words')}
                                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${mode === 'words' ? 'bg-accent text-white shadow-sm' : 'text-secondary hover:text-primary hover:bg-surface'}`}
                                    >
                                        Words
                                    </button>
                                    <button
                                        onClick={() => setMode('lines')}
                                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${mode === 'lines' ? 'bg-accent text-white shadow-sm' : 'text-secondary hover:text-primary hover:bg-surface'}`}
                                    >
                                        Lines
                                    </button>
                                </div>
                            </div>

                            <div className="flex-grow p-6 overflow-x-auto custom-scrollbar font-mono text-sm leading-loose break-words whitespace-pre-wrap">
                                {diffResult.length > 0 ? (
                                    diffResult.map((part, index) => {
                                        const color = part.added
                                            ? 'bg-emerald-500/20 text-emerald-500 dark:text-emerald-400 font-bold px-1 rounded mx-0.5'
                                            : part.removed
                                                ? 'bg-red-500/20 text-red-500 dark:text-red-400 line-through px-1 rounded mx-0.5 opacity-80'
                                                : 'text-secondary';

                                        return (
                                            <span key={index} className={color}>
                                                {part.value}
                                            </span>
                                        );
                                    })
                                ) : (
                                    <span className="text-tertiary italic">Add text above to see differences...</span>
                                )}
                            </div>

                            {/* Legend */}
                            <div className="flex items-center gap-6 px-6 py-3 border-t border-border/20 bg-surface/20">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-sm bg-red-500/50" />
                                    <span className="text-xs text-secondary font-medium uppercase tracking-widest">Removed</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-sm bg-emerald-500/50" />
                                    <span className="text-xs text-secondary font-medium uppercase tracking-widest">Added</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </div>
    )
}
