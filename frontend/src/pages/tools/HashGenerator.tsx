import { useState, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '../../components/ui/button'
import { Fingerprint, Copy, Check } from 'lucide-react'
import CryptoJS from 'crypto-js'

type HashResult = {
    md5: string
    sha1: string
    sha256: string
    sha512: string
}

export function HashGenerator() {
    const [input, setInput] = useState('')
    const [hashes, setHashes] = useState<HashResult>({ md5: '', sha1: '', sha256: '', sha512: '' })
    const [copied, setCopied] = useState<keyof HashResult | null>(null)

    // Compute hashes synchronously (using crypto-js for simplicity and sync behavior)
    useEffect(() => {
        if (!input) {
            setHashes({ md5: '', sha1: '', sha256: '', sha512: '' })
            return
        }

        try {
            setHashes({
                md5: CryptoJS.MD5(input).toString(),
                sha1: CryptoJS.SHA1(input).toString(),
                sha256: CryptoJS.SHA256(input).toString(),
                sha512: CryptoJS.SHA512(input).toString(),
            })
        } catch (e) {
            console.error("Hashing failed:", e)
        }
    }, [input])

    const handleCopy = async (algorithm: keyof HashResult, value: string) => {
        if (!value) return
        await navigator.clipboard.writeText(value)
        setCopied(algorithm)
        setTimeout(() => setCopied(null), 2000)
    }

    const hashCards = useMemo(() => [
        { key: 'md5' as const, label: 'MD5 (128-bit)', color: 'rose' },
        { key: 'sha1' as const, label: 'SHA-1 (160-bit)', color: 'amber' },
        { key: 'sha256' as const, label: 'SHA-256 (256-bit)', color: 'emerald' },
        { key: 'sha512' as const, label: 'SHA-512 (512-bit)', color: 'indigo' },
    ], [])

    // Tailwind color mapping helper for dynamic classes
    const getColorClasses = (color: string) => {
        switch (color) {
            case 'rose': return 'bg-rose-500/10 border-rose-500/30 text-rose-500 group-hover:border-rose-500/60 group-hover:shadow-[0_0_30px_rgba(244,63,94,0.15)] focus-within:border-rose-500/60 focus-within:shadow-[0_0_30px_rgba(244,63,94,0.15)]'
            case 'amber': return 'bg-amber-500/10 border-amber-500/30 text-amber-500 group-hover:border-amber-500/60 group-hover:shadow-[0_0_30px_rgba(245,158,11,0.15)] focus-within:border-amber-500/60 focus-within:shadow-[0_0_30px_rgba(245,158,11,0.15)]'
            case 'emerald': return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500 group-hover:border-emerald-500/60 group-hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] focus-within:border-emerald-500/60 focus-within:shadow-[0_0_30px_rgba(16,185,129,0.15)]'
            case 'indigo': return 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400 group-hover:border-indigo-500/60 group-hover:shadow-[0_0_30px_rgba(99,102,241,0.15)] focus-within:border-indigo-500/60 focus-within:shadow-[0_0_30px_rgba(99,102,241,0.15)]'
            default: return 'bg-surface/50 border-border/50 text-primary group-hover:border-primary/50'
        }
    }

    return (
        <div className="w-full flex justify-center pb-24">
            <div className="w-full max-w-5xl flex flex-col items-center px-4">

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="text-center mb-12 flex flex-col items-center relative"
                >
                    <div className="mb-6 inline-flex p-4 rounded-2xl bg-surface/50 border border-border/50 text-accent shadow-lg shadow-accent/10">
                        <Fingerprint className="w-8 h-8" />
                    </div>

                    <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-primary mb-4">
                        Hash Generator
                    </h1>
                    <p className="text-lg text-secondary max-w-xl mx-auto font-medium">
                        Instantly compute cryptographic hashes for your inputs.
                    </p>
                </motion.div>

                <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Left Pane: Input Textarea (Controls Box) */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col h-full"
                    >
                        <div className="p-6 rounded-2xl border border-border/40 bg-surface/40 backdrop-blur-sm transition-all duration-300 h-full flex flex-col hover:border-accent/30 shadow-sm">
                            <label className="block text-sm font-medium uppercase tracking-wider mb-4 ml-1 text-tertiary">
                                Input Text
                            </label>
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                className="w-full flex-grow min-h-[300px] lg:min-h-0 bg-transparent border border-border/50 rounded-xl p-6 text-primary focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all font-mono text-sm resize-none shadow-inner placeholder:text-tertiary/50"
                                placeholder="Enter text to hash..."
                                spellCheck={false}
                            />
                        </div>
                    </motion.div>

                    {/* Right Pane: Hash Outputs (Main Display Box) */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col h-full"
                    >
                        <div className="flex flex-col p-6 rounded-2xl border border-border/50 bg-surface shadow-xl relative overflow-hidden h-full min-h-[400px] transition-all duration-300 hover:border-accent/40 hover:shadow-2xl">
                            <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] pointer-events-none" />

                            <div className="relative z-10 flex flex-col gap-4">
                                {hashCards.map((card, index) => (
                                    <motion.div
                                        key={card.key}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
                                        className={`p-5 rounded-2xl border backdrop-blur-md transition-all duration-300 group flex flex-col gap-3 relative overflow-hidden ${getColorClasses(card.color)}`}
                                    >
                                        <div className="flex justify-between items-center z-10">
                                            <label className="text-sm font-medium uppercase tracking-wider">
                                                {card.label}
                                            </label>
                                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                <Button
                                                    onClick={() => handleCopy(card.key, hashes[card.key])}
                                                    disabled={!hashes[card.key]}
                                                    className="h-8 px-3 rounded-lg bg-surface/50 border border-white/10 hover:bg-surface text-current shadow-sm"
                                                >
                                                    {copied === card.key ? <Check className="w-4 h-4" /> : <Copy className="w-3.5 h-3.5" />}
                                                </Button>
                                            </motion.div>
                                        </div>
                                        <div className="w-full bg-black/20 rounded-xl p-3 font-mono text-sm break-all z-10 min-h-[44px] flex items-center shadow-inner">
                                            <span className={hashes[card.key] ? 'opacity-100' : 'opacity-40'}>
                                                {hashes[card.key] || 'Waiting for input...'}
                                            </span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </div>
    )
}
