import { useState, useMemo, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
import { Key, Copy, Check, RefreshCw } from 'lucide-react'

const LOWER = 'abcdefghijklmnopqrstuvwxyz'
const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const NUMBERS = '0123456789'
const SYMBOLS = '!@#$%^&*()_+~`|}{[]:;?><,./-='

export function PasswordGenerator() {
    const [length, setLength] = useState<number>(16)
    const [options, setOptions] = useState({
        lower: true,
        upper: true,
        numbers: true,
        symbols: true
    })

    const [password, setPassword] = useState('')
    const [copied, setCopied] = useState(false)

    const generatePassword = useCallback(() => {
        let pool = ''
        if (options.lower) pool += LOWER
        if (options.upper) pool += UPPER
        if (options.numbers) pool += NUMBERS
        if (options.symbols) pool += SYMBOLS

        if (!pool) {
            setPassword('')
            return
        }

        let result = ''
        const array = new Uint32Array(length)
        window.crypto.getRandomValues(array)

        for (let i = 0; i < length; i++) {
            result += pool[array[i] % pool.length]
        }
        setPassword(result)
    }, [length, options, setPassword])

    // Generate on mount and when options change
    useEffect(() => {
        generatePassword()
    }, [generatePassword])

    const toggleOption = (key: keyof typeof options) => {
        setOptions(prev => ({
            ...prev,
            [key]: !prev[key]
        }))
    }

    const handleCopy = async () => {
        if (!password) return
        await navigator.clipboard.writeText(password)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const entropy = useMemo(() => {
        let poolSize = 0
        if (options.lower) poolSize += 26
        if (options.upper) poolSize += 26
        if (options.numbers) poolSize += 10
        if (options.symbols) poolSize += SYMBOLS.length

        if (poolSize === 0) return 0
        return length * Math.log2(poolSize)
    }, [length, options])

    const strength = useMemo(() => {
        if (entropy < 40) return { label: 'Weak', color: 'text-red-500', bar: 'bg-red-500', width: '25%' }
        if (entropy < 60) return { label: 'Fair', color: 'text-amber-500', bar: 'bg-amber-500', width: '50%' }
        if (entropy < 80) return { label: 'Good', color: 'text-emerald-400', bar: 'bg-emerald-400', width: '75%' }
        return { label: 'Strong', color: 'text-emerald-500', bar: 'bg-emerald-500', width: '100%' }
    }, [entropy])

    return (
        <div className="w-full flex justify-center pb-24">
            <div className="w-full max-w-4xl flex flex-col items-center">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12 flex flex-col items-center"
                >
                    <div className="mb-6 inline-flex p-4 rounded-2xl bg-surface/50 border border-border/50 text-accent shadow-lg shadow-accent/10">
                        <Key className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-primary mb-4">
                        Password Generator
                    </h1>
                    <p className="text-lg text-secondary max-w-xl mx-auto">
                        Generate high-entropy, secure credentials using cryptographic randomness.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full flex flex-col gap-6"
                >
                    {/* Main Display Box */}
                    <div className="p-8 rounded-2xl border border-border/50 bg-surface shadow-xl relative overflow-hidden transition-all duration-300 hover:border-accent/40 hover:shadow-2xl">
                        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] pointer-events-none" />

                        <div className="relative z-10 flex flex-col gap-6">

                            <div className="flex flex-col md:flex-row gap-4 items-center relative">
                                <Input
                                    value={password}
                                    readOnly
                                    className="font-mono text-2xl tracking-wider text-center md:text-left h-16 bg-surface/50 pr-24 border-accent/20 focus-visible:ring-accent/50"
                                    placeholder="Select options to generate"
                                />
                                <div className="absolute right-2 top-2 bottom-2 flex items-center gap-1">
                                    <Button
                                        onClick={generatePassword}
                                        className="h-12 w-12 p-0 bg-surface/50 text-secondary hover:text-primary hover:bg-surface border border-border/50"
                                        title="Regenerate"
                                    >
                                        <RefreshCw className="w-5 h-5" />
                                    </Button>
                                    <Button
                                        onClick={handleCopy}
                                        className="h-12 w-12 p-0 shadow-md shadow-accent/20"
                                        disabled={!password}
                                        title="Copy"
                                    >
                                        {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                    </Button>
                                </div>
                            </div>

                            {/* Strength Indicator */}
                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between items-center px-1">
                                    <span className="text-sm font-medium text-tertiary uppercase tracking-wider">Strength</span>
                                    <AnimatePresence mode="wait">
                                        <motion.span
                                            key={strength.label}
                                            initial={{ opacity: 0, y: -5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 5 }}
                                            className={`text-sm font-bold uppercase tracking-wider ${strength.color}`}
                                        >
                                            {strength.label} ({Math.round(entropy)} bits)
                                        </motion.span>
                                    </AnimatePresence>
                                </div>
                                <div className="h-2 w-full bg-surface/80 rounded-full overflow-hidden border border-border/50">
                                    <motion.div
                                        className={`h-full ${strength.bar}`}
                                        initial={{ width: 0 }}
                                        animate={{ width: strength.width }}
                                        transition={{ type: "spring", stiffness: 100, damping: 20 }}
                                    />
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Controls */}
                    <div className="p-8 rounded-2xl border border-border/40 bg-surface/40 backdrop-blur-sm space-y-8">
                        <h3 className="text-xl font-medium text-primary tracking-tight">Configuration</h3>

                        <div className="space-y-4 max-w-2xl mx-auto md:mx-0">
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm text-secondary font-medium">Password Length</label>
                                    <span className="text-lg font-bold text-accent">{length}</span>
                                </div>
                                <input
                                    type="range"
                                    min="4" max="64"
                                    value={length}
                                    onChange={(e) => setLength(parseInt(e.target.value))}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { id: 'lower', label: 'Lowercase (a-z)' },
                                { id: 'upper', label: 'Uppercase (A-Z)' },
                                { id: 'numbers', label: 'Numbers (0-9)' },
                                { id: 'symbols', label: 'Symbols (!@#)' },
                            ].map((opt) => (
                                <div
                                    key={opt.id}
                                    onClick={() => toggleOption(opt.id as keyof typeof options)}
                                    className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all duration-300 ${options[opt.id as keyof typeof options] ? 'border-accent/50 bg-accent/5 shadow-sm' : 'border-border/50 bg-surface/30 opacity-70 hover:opacity-100'}`}
                                >
                                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${options[opt.id as keyof typeof options] ? 'bg-accent border-accent text-white' : 'border-border/80'}`}>
                                        {options[opt.id as keyof typeof options] && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                    </div>
                                    <span className="text-sm font-medium text-primary">{opt.label}</span>
                                </div>
                            ))}
                        </div>

                    </div>
                </motion.div>
            </div>
        </div>
    )
}
