import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '../../components/ui/button'
import { Regex, Copy, Check, Trash2 } from 'lucide-react'

export function RegexTester() {
    const [pattern, setPattern] = useState('[A-Z]\\w+')
    const [flags, setFlags] = useState('g')
    const [testString, setTestString] = useState('Build Kinetic Interfaces with Razor Design.')

    interface MatchResult {
        match: string
        index: number
        groups: { [key: string]: string } | undefined
    }

    const [matches, setMatches] = useState<MatchResult[]>([])
    const [error, setError] = useState<string | null>(null)
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        if (!pattern) {
            setMatches([])
            setError(null)
            return
        }

        try {
            const regex = new RegExp(pattern, flags)
            setError(null)

            if (!testString) {
                setMatches([])
                return
            }

            const results: MatchResult[] = []

            // If global flag is not set, matchAll will throw an error or we just do a single exec
            if (flags.includes('g')) {
                const matchIter = testString.matchAll(regex)
                for (const match of matchIter) {
                    results.push({
                        match: match[0],
                        index: match.index ?? 0,
                        groups: match.groups
                    })
                }
            } else {
                const match = regex.exec(testString)
                if (match) {
                    results.push({
                        match: match[0],
                        index: match.index,
                        groups: match.groups
                    })
                }
            }

            setMatches(results)
        } catch (e: any) {
            setError(e.message)
            setMatches([])
        }
    }, [pattern, flags, testString])

    const handleCopyMatches = async () => {
        if (matches.length === 0) return
        const text = matches.map(m => m.match).join('\\n')
        await navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const renderHighlightedText = () => {
        if (error || !pattern) return <span className="opacity-80">{testString}</span>
        if (matches.length === 0) return <span className="opacity-80">{testString}</span>

        let lastIndex = 0
        const parts: React.ReactNode[] = []

        matches.forEach((m, idx) => {
            // Text before match
            if (m.index > lastIndex) {
                parts.push(<span key={`text-${idx}`} className="opacity-80">{testString.slice(lastIndex, m.index)}</span>)
            }
            // The match itself
            parts.push(
                <span key={`match-${idx}`} className="bg-accent/30 text-accent font-bold px-0.5 rounded border-b border-accent/50">
                    {m.match}
                </span>
            )
            lastIndex = m.index + m.match.length
        })

        // Remaining text
        if (lastIndex < testString.length) {
            parts.push(<span key="text-end" className="opacity-80">{testString.slice(lastIndex)}</span>)
        }

        return parts
    }

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
                        <Regex className="w-8 h-8" />
                    </div>

                    <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-primary mb-4">
                        Regex Tester
                    </h1>
                    <p className="text-lg text-secondary max-w-xl mx-auto font-medium">
                        Test and debug regular expressions in real-time with syntax highlighting and match extraction.
                    </p>
                </motion.div>

                <div className="w-full flex flex-col lg:flex-row gap-6 items-stretch">

                    {/* Left Pane: Inputs */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex-1 flex flex-col gap-6"
                    >
                        {/* Expression Input */}
                        <div className={`p-6 rounded-3xl border bg-surface/40 backdrop-blur-sm shadow-sm transition-all relative overflow-hidden ${error ? 'border-red-500/50 shadow-red-500/10' : 'border-border/40 hover:border-accent/40'}`}>
                            <label className="block text-xs font-bold uppercase tracking-wider text-tertiary mb-3 ml-1">Regular Expression</label>

                            <div className="flex gap-2">
                                <div className="flex-grow flex items-center bg-surface border border-border/50 rounded-xl px-4 py-2 focus-within:ring-2 focus-within:ring-accent/50 focus-within:border-accent/50 transition-all shadow-inner">
                                    <span className="text-accent text-xl font-medium mr-2">/</span>
                                    <input
                                        type="text"
                                        value={pattern}
                                        onChange={e => setPattern(e.target.value)}
                                        placeholder="Enter pattern..."
                                        className="w-full bg-transparent text-primary text-lg font-mono focus:outline-none placeholder:text-tertiary/50"
                                        spellCheck="false"
                                    />
                                    <span className="text-accent text-xl font-medium ml-2">/</span>
                                </div>

                                <input
                                    type="text"
                                    value={flags}
                                    onChange={e => setFlags(e.target.value)}
                                    placeholder="gmi"
                                    title="Regex Flags (e.g., g, i, m)"
                                    className="w-20 bg-surface border border-border/50 rounded-xl px-3 text-secondary text-lg font-mono focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all shadow-inner text-center"
                                    spellCheck="false"
                                />
                            </div>

                            {error && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="text-red-500 text-sm mt-3 ml-1 flex items-center gap-2">
                                    <span className="bg-red-500/10 px-2 py-1 rounded border border-red-500/20 font-mono text-xs">{error}</span>
                                </motion.div>
                            )}
                        </div>

                        {/* Test String Input */}
                        <div className="p-6 rounded-3xl border border-border/40 bg-surface/40 backdrop-blur-sm shadow-sm transition-all hover:border-accent/40 flex flex-col flex-grow min-h-[300px]">
                            <div className="flex justify-between items-center mb-3">
                                <label className="text-xs font-bold uppercase tracking-wider text-tertiary ml-1">Test String</label>
                                <Button
                                    onClick={() => setTestString('')}
                                    disabled={!testString}
                                    className="h-7 text-xs !bg-transparent !text-tertiary hover:!text-red-500 hover:!bg-red-500/10 !shadow-none !px-2"
                                >
                                    <Trash2 className="w-3.5 h-3.5 mr-1" /> Clear
                                </Button>
                            </div>

                            <div className="relative flex-grow rounded-xl overflow-hidden border border-border/50 bg-surface shadow-inner">
                                {/* Highlight Layer */}
                                <div className="absolute inset-0 p-5 font-mono text-base leading-relaxed whitespace-pre-wrap break-words pointer-events-none z-0">
                                    {renderHighlightedText()}
                                </div>
                                {/* Actual textarea layer (transparent text to allow clicking and editing while showing highlights underneath) */}
                                <textarea
                                    value={testString}
                                    onChange={(e) => setTestString(e.target.value)}
                                    placeholder="Enter string to test..."
                                    className="absolute inset-0 w-full h-full p-5 bg-transparent text-transparent caret-primary focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all resize-none font-mono text-base leading-relaxed custom-scrollbar z-10"
                                    spellCheck="false"
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Pane: Match Details */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex-1 flex flex-col h-full min-h-[400px] rounded-3xl border border-border/50 bg-surface shadow-xl relative overflow-hidden transition-all hover:border-accent/40 hover:shadow-2xl"
                    >
                        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] pointer-events-none" />

                        <div className="relative z-10 flex flex-col h-full">
                            <div className="flex justify-between items-center px-6 py-4 border-b border-border/30 bg-surface/30">
                                <label className="text-sm font-bold uppercase tracking-wider text-accent">
                                    Match Results <span className="ml-2 bg-accent/10 text-accent px-2 py-0.5 rounded-full text-xs font-mono">{matches.length}</span>
                                </label>
                                <Button
                                    onClick={handleCopyMatches}
                                    disabled={matches.length === 0}
                                    className="h-8 px-3 shadow-md shadow-accent/20 text-xs"
                                >
                                    {copied ? <Check className="w-3.5 h-3.5 mr-1.5" /> : <Copy className="w-3.5 h-3.5 mr-1.5" />}
                                    {copied ? 'Copied' : 'Copy Matches'}
                                </Button>
                            </div>

                            <div className="flex-grow overflow-y-auto p-2 custom-scrollbar">
                                {matches.length > 0 ? (
                                    <div className="flex flex-col gap-2">
                                        {matches.map((m, i) => (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: Math.min(i * 0.05, 0.5) }}
                                                key={i}
                                                className="group p-4 rounded-xl border border-border/40 hover:border-accent/30 bg-surface/50 transition-all"
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="text-xs font-bold text-tertiary uppercase tracking-wider">Match #{i + 1}</span>
                                                    <span className="text-xs font-mono text-tertiary bg-surface px-1.5 py-0.5 rounded border border-border/30">Index: {m.index}</span>
                                                </div>
                                                <div className="font-mono text-primary text-sm bg-surface p-3 rounded-lg border border-border/50 break-all">
                                                    {m.match}
                                                </div>
                                                {m.groups && Object.keys(m.groups).length > 0 && (
                                                    <div className="mt-3 pt-3 border-t border-border/30">
                                                        <span className="text-xs font-bold text-tertiary uppercase tracking-wider block mb-2">Groups</span>
                                                        <div className="flex flex-col gap-1">
                                                            {Object.entries(m.groups).map(([key, val]) => (
                                                                <div key={key} className="flex gap-2 text-sm font-mono items-center">
                                                                    <span className="text-accent min-w-[3rem]">{key}:</span>
                                                                    <span className="text-secondary bg-surface px-2 py-0.5 rounded border border-border/30">{val}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </motion.div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-tertiary/50 pb-10">
                                        <Regex className="w-12 h-12 mb-4 opacity-50" />
                                        <span className="font-medium tracking-wide">
                                            {error ? 'Fix regex syntax error' : 'No matches found'}
                                        </span>
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
