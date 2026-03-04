import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
import { Hash, Copy, Check, RefreshCw } from 'lucide-react'

export function UuidGenerator() {
    const [count, setCount] = useState<number>(5)
    const [options, setOptions] = useState({
        uppercase: false,
        hyphens: true,
        braces: false,
    })

    const [output, setOutput] = useState('')
    const [copied, setCopied] = useState(false)

    const generateUuids = () => {
        let result = []
        const limit = Math.min(Math.max(count, 1), 5000) // max 5000 to prevent crashing

        for (let i = 0; i < limit; i++) {
            let uuid = ''
            if (typeof crypto !== 'undefined' && crypto.randomUUID) {
                uuid = crypto.randomUUID()
            } else {
                // fallback
                uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                });
            }

            if (!options.hyphens) uuid = uuid.replace(/-/g, '')
            if (options.uppercase) uuid = uuid.toUpperCase()
            if (options.braces) uuid = `{${uuid}}`

            result.push(uuid)
        }

        setOutput(result.join('\n'))
    }

    useEffect(() => {
        generateUuids()
    }, [count, options])

    const toggleOption = (key: keyof typeof options) => {
        setOptions(prev => ({
            ...prev,
            [key]: !prev[key]
        }))
    }

    const handleCopy = async () => {
        if (!output) return
        await navigator.clipboard.writeText(output)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="w-full flex justify-center pb-24 min-h-[80vh]">
            <div className="w-full max-w-5xl flex flex-col items-center">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-10 flex flex-col items-center"
                >
                    <div className="mb-6 inline-flex p-4 rounded-2xl bg-surface/50 border border-border/50 text-accent shadow-lg shadow-accent/10">
                        <Hash className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-primary mb-4">
                        UUID / GUID Generator
                    </h1>
                    <p className="text-lg text-secondary max-w-xl mx-auto">
                        Bulk generation of standard unique identifiers (v4) straight from the browser crypto API.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6"
                >
                    {/* Controls */}
                    <div className="lg:col-span-5 flex flex-col gap-6">
                        <div className="p-6 rounded-2xl border border-border/40 bg-surface/40 backdrop-blur-sm space-y-6">
                            <h3 className="text-xl font-medium text-primary tracking-tight">Configuration</h3>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm text-secondary font-medium flex justify-between">
                                        <span>Quantity</span>
                                        <span className="text-accent">{count}</span>
                                    </label>
                                    <input
                                        type="range"
                                        min="1" max="100"
                                        value={count > 100 ? 100 : count}
                                        onChange={(e) => setCount(parseInt(e.target.value))}
                                        className="w-full accent-accent bg-transparent hover:cursor-pointer mb-2"
                                    />
                                    <div className="flex gap-2">
                                        <Input
                                            type="number"
                                            min="1"
                                            max="5000"
                                            value={count}
                                            onChange={(e) => setCount(parseInt(e.target.value) || 1)}
                                            className="h-10 text-base flex-grow"
                                        />
                                        <Button onClick={generateUuids} className="h-10 px-4 bg-surface text-secondary hover:text-primary hover:bg-surface border border-border/50">
                                            <RefreshCw className="w-4 h-4 mr-2" />
                                            Regen
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-3 pt-4 border-t border-border/20">
                                    <div className="text-sm font-medium text-secondary mb-3">Format Settings</div>
                                    {[
                                        { id: 'uppercase', label: 'UPPERCASE' },
                                        { id: 'hyphens', label: 'Include Hyphens' },
                                        { id: 'braces', label: 'Wrap in {Braces}' },
                                    ].map((opt) => (
                                        <div
                                            key={opt.id}
                                            onClick={() => toggleOption(opt.id as keyof typeof options)}
                                            className="flex items-center gap-3 cursor-pointer group"
                                        >
                                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${options[opt.id as keyof typeof options] ? 'bg-accent border-accent text-white' : 'border-border/80 group-hover:border-accent/50'}`}>
                                                {options[opt.id as keyof typeof options] && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                            </div>
                                            <span className="text-sm text-primary select-none">{opt.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Output Display */}
                    <div className="lg:col-span-7 flex flex-col gap-6">
                        <div className="flex flex-col rounded-2xl border border-border/40 bg-white dark:bg-zinc-950 shadow-2xl relative overflow-hidden group h-full min-h-[400px]">
                            <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] pointer-events-none" />

                            <div className="relative z-10 flex justify-between items-center p-4 border-b border-border/30 bg-surface/30">
                                <span className="text-sm font-medium text-tertiary uppercase tracking-widest pl-2">Output ({count})</span>
                                <Button
                                    onClick={handleCopy}
                                    disabled={!output}
                                    className="text-xs h-8 px-3 shadow-md shadow-accent/20"
                                >
                                    {copied ? <Check className="w-3.5 h-3.5 mr-1.5" /> : <Copy className="w-3.5 h-3.5 mr-1.5" />}
                                    Copy All
                                </Button>
                            </div>

                            <div className="relative z-10 p-6 flex-grow">
                                <textarea
                                    readOnly
                                    value={output}
                                    className="w-full h-full min-h-[300px] bg-transparent resize-none font-mono text-sm text-primary leading-relaxed focus:outline-none scrollbar-thin scrollbar-thumb-surface scrollbar-track-transparent"
                                    spellCheck={false}
                                />
                            </div>
                        </div>
                    </div>

                </motion.div>
            </div>
        </div>
    )
}
