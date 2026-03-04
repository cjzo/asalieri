import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '../../components/ui/button'
import { SplitSquareHorizontal, Trash2 } from 'lucide-react'
import * as Diff from 'diff'

export function JsonDiff() {
    const [leftJson, setLeftJson] = useState('{\n  "version": "1.0",\n  "features": ["auth"]\n}')
    const [rightJson, setRightJson] = useState('{\n  "version": "2.0",\n  "features": ["auth", "logs"],\n  "debug": true\n}')

    interface DiffResult {
        value: string
        added?: boolean
        removed?: boolean
    }

    const [diffs, setDiffs] = useState<DiffResult[]>([])
    const [leftError, setLeftError] = useState(false)
    const [rightError, setRightError] = useState(false)

    useEffect(() => {
        let lStr = '', rStr = ''
        setLeftError(false)
        setRightError(false)

        try {
            if (leftJson.trim()) lStr = JSON.stringify(JSON.parse(leftJson), null, 2)
        } catch { setLeftError(true) }

        try {
            if (rightJson.trim()) rStr = JSON.stringify(JSON.parse(rightJson), null, 2)
        } catch { setRightError(true) }

        if (!leftError && !rightError && (leftJson.trim() || rightJson.trim())) {
            const result = Diff.diffLines(lStr, rStr)
            setDiffs(result)
        } else {
            setDiffs([])
        }

    }, [leftJson, rightJson])

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
                        <SplitSquareHorizontal className="w-8 h-8" />
                    </div>

                    <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-primary mb-4">
                        JSON Diff Checker
                    </h1>
                    <p className="text-lg text-secondary max-w-xl mx-auto font-medium">
                        Compare and contrast two JSON payloads recursively.
                    </p>
                </motion.div>

                {/* Input Windows */}
                <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 relative items-stretch mb-8">

                    {/* Left Pane */}
                    <motion.div className={`flex flex-col h-[400px] rounded-3xl border bg-surface/40 backdrop-blur-sm shadow-sm transition-all overflow-hidden relative ${leftError ? 'border-red-500/50 shadow-red-500/10' : 'border-border/40 hover:border-accent/40'}`}>
                        <div className="p-4 border-b border-border/30 bg-surface/20 flex justify-between items-center">
                            <label className="text-sm font-bold uppercase tracking-wider text-tertiary ml-2">Original JSON</label>
                            <Button onClick={() => setLeftJson('')} className="h-8 text-xs !bg-transparent !text-tertiary hover:!text-red-500 hover:!bg-red-500/10 !shadow-none !px-2">
                                <Trash2 className="w-3.5 h-3.5 mr-1" /> Clear
                            </Button>
                        </div>
                        <textarea
                            value={leftJson}
                            onChange={(e) => setLeftJson(e.target.value)}
                            placeholder="Base JSON..."
                            className="w-full flex-grow p-4 bg-transparent text-primary focus:outline-none transition-all resize-none shadow-inner font-mono text-sm leading-relaxed custom-scrollbar"
                            spellCheck="false"
                        />
                    </motion.div>

                    {/* Right Pane */}
                    <motion.div className={`flex flex-col h-[400px] rounded-3xl border bg-surface/40 backdrop-blur-sm shadow-sm transition-all overflow-hidden relative ${rightError ? 'border-red-500/50 shadow-red-500/10' : 'border-border/40 hover:border-accent/40'}`}>
                        <div className="p-4 border-b border-border/30 bg-surface/20 flex justify-between items-center">
                            <label className="text-sm font-bold uppercase tracking-wider text-tertiary ml-2">Modified JSON</label>
                            <Button onClick={() => setRightJson('')} className="h-8 text-xs !bg-transparent !text-tertiary hover:!text-red-500 hover:!bg-red-500/10 !shadow-none !px-2">
                                <Trash2 className="w-3.5 h-3.5 mr-1" /> Clear
                            </Button>
                        </div>
                        <textarea
                            value={rightJson}
                            onChange={(e) => setRightJson(e.target.value)}
                            placeholder="Target JSON..."
                            className="w-full flex-grow p-4 bg-transparent text-primary focus:outline-none transition-all resize-none shadow-inner font-mono text-sm leading-relaxed custom-scrollbar"
                            spellCheck="false"
                        />
                    </motion.div>

                </div>

                {/* Unified Diff output */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full flex flex-col rounded-3xl border border-border/50 bg-surface shadow-xl relative overflow-hidden transition-all hover:border-accent/40 hover:shadow-2xl"
                >
                    <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] pointer-events-none" />

                    <div className="relative z-10 flex flex-col">
                        <div className="px-6 py-4 border-b border-border/30 bg-surface/30">
                            <label className="text-sm font-bold uppercase tracking-wider text-accent">
                                Unified Line Diff
                            </label>
                        </div>

                        <div className="p-6 font-mono text-[14px] leading-relaxed overflow-x-auto whitespace-pre custom-scrollbar">
                            {leftError || rightError ? (
                                <div className="text-center text-red-500/80 p-6 flex flex-col items-center gap-2">
                                    <span className="bg-red-500/10 px-4 py-2 rounded-xl border border-red-500/20 text-sm">Valid JSON array/object required on both sides.</span>
                                </div>
                            ) : diffs.length > 0 ? (
                                <div>
                                    {diffs.map((part, index) => {
                                        const colorClass = part.added
                                            ? 'bg-emerald-500/10 text-emerald-500'
                                            : part.removed
                                                ? 'bg-red-500/10 text-red-500'
                                                : 'text-tertiary/70'

                                        const prefix = part.added ? '+ ' : part.removed ? '- ' : '  '

                                        // Render line by line
                                        return part.value.split('\\n').map((line, i, arr) => {
                                            if (line === '' && i === arr.length - 1) return null // Skip trailing empty line generated by split
                                            return (
                                                <div key={`${index}-${i}`} className={`px-2 rounded ${colorClass}`}>
                                                    <span className="opacity-50 select-none mr-4 font-bold">{prefix}</span>
                                                    <span>{line}</span>
                                                </div>
                                            )
                                        })
                                    })}
                                </div>
                            ) : (
                                <div className="text-center text-tertiary/50 p-6">
                                    Identical payloads or awaiting input.
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>

            </div >
        </div >
    )
}
