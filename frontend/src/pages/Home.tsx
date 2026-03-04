import { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { KineticSearch } from '../components/search/KineticSearch'
import { ContextPills, CONTEXTS } from '../components/search/ContextPills'
import { ResultCard, ToolResult } from '../components/results/ResultCard'

export function Home() {
    const [query, setQuery] = useState('')
    const [context, setContext] = useState(CONTEXTS[1]) // Default to Founder
    const [isSearching, setIsSearching] = useState(false)
    const [results, setResults] = useState<ToolResult[]>([])
    const [loading, setLoading] = useState(false)
    const [aiExamples, setAiExamples] = useState<string[]>([])
    const prefersReducedMotion = useReducedMotion()

    const handleSearch = async () => {
        if (!query.trim()) return

        setIsSearching(true)
        setLoading(true)

        try {
            const response = await fetch('/api/search/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query, context })
            })

            if (response.ok) {
                const data = await response.json()
                setResults(data.results)
                setAiExamples(data.ai_examples ?? [])
            } else {
                console.error("Failed to fetch results")
            }
        } catch (err) {
            console.error("Error connecting to backend", err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <motion.div
                className="app-vignette-glow fixed inset-0 pointer-events-none z-[-2]"
                animate={{ opacity: isSearching ? 0.7 : 1 }}
                transition={{ duration: 1, ease: 'easeInOut' }}
            />

            <motion.div
                className="fixed inset-0 pointer-events-none z-[-3]"
                initial={{ background: 'radial-gradient(circle at 50% 50%, var(--surface) 0%, var(--bg) 100%)' }}
                animate={{
                    background: isSearching
                        ? 'radial-gradient(circle at 50% 0%, color-mix(in srgb, var(--surface) 60%, var(--accent) 5%), var(--bg) 100%)'
                        : 'radial-gradient(circle at 50% 50%, var(--surface) 0%, var(--bg) 100%)'
                }}
                transition={{ duration: 1, ease: 'easeInOut' }}
            />

            {/* Hero Section Container */}
            <motion.div
                initial={false}
                animate={{
                    y: isSearching ? -20 : "15vh",
                    scale: isSearching ? 0.95 : 1
                }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="w-full max-w-2xl flex flex-col items-center"
            >
                <AnimatePresence mode="wait">
                    {!isSearching && (
                        <motion.h1
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-4xl md:text-5xl font-medium tracking-tight text-primary mb-8 text-center"
                        >
                            What are you trying to do?
                        </motion.h1>
                    )}
                </AnimatePresence>

                <KineticSearch
                    query={query}
                    setQuery={setQuery}
                    onSubmit={handleSearch}
                />

                <AnimatePresence>
                    {!isSearching && (
                        <motion.div exit={{ opacity: 0, y: 10 }}>
                            <ContextPills selected={context} onSelect={setContext} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Results Container */}
            {isSearching && (
                <>
                    <motion.div
                        layout
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                        className="w-full mt-12 grid grid-cols-1 md:grid-cols-2 gap-6"
                    >
                        {loading ? (
                            prefersReducedMotion ? (
                                <div className="col-span-full flex justify-center py-20 text-secondary">
                                    Finding the best tools for you...
                                </div>
                            ) : (
                                <motion.div
                                    className="col-span-full flex justify-center py-20 text-secondary"
                                    animate={{ y: [0, -3, 0], opacity: [0.7, 1, 0.7] }}
                                    transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                                >
                                    Finding the best tools for you...
                                </motion.div>
                            )
                        ) : results.length > 0 ? (
                            results.map((result, index) => (
                                <ResultCard key={result.id} item={result} index={index} />
                            ))
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
                                className="col-span-full flex justify-center py-20 text-tertiary"
                            >
                                No tools found for "{query}". Try adjusting your context or keywords.
                            </motion.div>
                        )}
                    </motion.div>

                    {!loading && aiExamples.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 32 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.25, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                            className="w-full max-w-3xl mt-10 mx-auto"
                        >
                            <div className="relative overflow-hidden rounded-2xl border border-accent/20 bg-surface/80 backdrop-blur-md shadow-[0_18px_60px_rgba(0,0,0,0.35)]">
                                <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-surface/60 opacity-80 pointer-events-none" />
                                <div className="relative px-6 py-5 border-b border-accent/15 flex items-center justify-between gap-4">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[11px] font-semibold tracking-[0.18em] uppercase text-tertiary">
                                            Example AI responses
                                        </span>
                                        <p className="text-sm text-secondary">
                                            How an AI teammate might talk through this search with you.
                                        </p>
                                    </div>
                                    <div className="hidden md:flex items-center gap-2 text-[11px] text-tertiary">
                                        <span className="inline-flex h-6 items-center rounded-full border border-border/60 bg-surface/60 px-2.5">
                                            <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-accent/80" />
                                            Gemini · live
                                        </span>
                                    </div>
                                </div>
                                <div className="relative px-6 py-5 space-y-4">
                                    {aiExamples.map((example, idx) => (
                                        <div key={idx} className="flex gap-3 text-sm leading-relaxed text-foreground/95">
                                            <span className="mt-[3px] text-accent/90">↳</span>
                                            <p>{example}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </>
            )}
        </>
    )
}
