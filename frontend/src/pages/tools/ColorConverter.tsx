import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '../../components/ui/button'
import { Palette, Copy, Check } from 'lucide-react'

// Basic color conversion helpers
const hexToRgb = (hex: string) => {
    let r = 0, g = 0, b = 0
    if (hex.length === 4) {
        r = parseInt(hex[1] + hex[1], 16)
        g = parseInt(hex[2] + hex[2], 16)
        b = parseInt(hex[3] + hex[3], 16)
    } else if (hex.length === 7) {
        r = parseInt(hex.substring(1, 3), 16)
        g = parseInt(hex.substring(3, 5), 16)
        b = parseInt(hex.substring(5, 7), 16)
    }
    return { r, g, b }
}

const rgbToHex = (r: number, g: number, b: number) => {
    return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1).toUpperCase()
}

const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255; g /= 255; b /= 255
    const max = Math.max(r, g, b), min = Math.min(r, g, b)
    let h = 0, s = 0, l = (max + min) / 2
    if (max !== min) {
        const d = max - min
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break
            case g: h = (b - r) / d + 2; break
            case b: h = (r - g) / d + 4; break
        }
        h /= 6
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

export function ColorConverter() {
    const [hex, setHex] = useState('#D95C3C') // Default Terracotta accent
    const [rgb, setRgb] = useState('rgb(217, 92, 60)')
    const [hsl, setHsl] = useState('hsl(12, 69%, 54%)')

    const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({
        hex: false, rgb: false, hsl: false
    })

    const updateFromHex = (newHex: string) => {
        setHex(newHex)
        if (/^#([0-9A-Fa-f]{3}){1,2}$/i.test(newHex)) {
            const { r, g, b } = hexToRgb(newHex)
            setRgb(`rgb(${r}, ${g}, ${b})`)
            const { h, s, l } = rgbToHsl(r, g, b)
            setHsl(`hsl(${h}, ${s}%, ${l}%)`)
        }
    }

    const updateFromRgb = (newRgb: string) => {
        setRgb(newRgb)
        const match = newRgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/)
        if (match) {
            const r = Math.min(255, Math.max(0, parseInt(match[1])))
            const g = Math.min(255, Math.max(0, parseInt(match[2])))
            const b = Math.min(255, Math.max(0, parseInt(match[3])))

            const newHex = rgbToHex(r, g, b)
            setHex(newHex)
            const { h, s, l } = rgbToHsl(r, g, b)
            setHsl(`hsl(${h}, ${s}%, ${l}%)`)
        }
    }

    const handleCopy = async (type: string, value: string) => {
        if (!value) return
        await navigator.clipboard.writeText(value)
        setCopiedStates(prev => ({ ...prev, [type]: true }))
        setTimeout(() => setCopiedStates(prev => ({ ...prev, [type]: false })), 2000)
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
                        <Palette className="w-8 h-8" />
                    </div>

                    <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-primary mb-4">
                        Color Converter
                    </h1>
                    <p className="text-lg text-secondary max-w-xl mx-auto font-medium">
                        Instantly convert colors between HEX, RGB, and HSL formats.
                    </p>
                </motion.div>

                <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

                    {/* Left Pane: Color Picker & Display */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col gap-6 w-full"
                    >
                        <div className="p-2 border border-border/50 rounded-3xl bg-surface/40 backdrop-blur-sm shadow-xl relative overflow-hidden h-[400px]">
                            {/* Color preview background */}
                            <motion.div
                                className="w-full h-full rounded-2xl border border-black/10 dark:border-white/10"
                                style={{ backgroundColor: /^#([0-9A-Fa-f]{3}){1,2}$/i.test(hex) ? hex : '#000000' }}
                                animate={{ backgroundColor: /^#([0-9A-Fa-f]{3}){1,2}$/i.test(hex) ? hex : '#000000' }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none mix-blend-difference opacity-50">
                                    <Palette className="w-32 h-32 text-white" />
                                </div>
                            </motion.div>

                            {/* Hidden native color picker floating button triggered by a proxy */}
                            <div className="absolute top-6 right-6 z-20">
                                <label className="cursor-pointer flex items-center justify-center w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full shadow-lg border border-white/30 transition-all">
                                    <input
                                        type="color"
                                        value={/^#([0-9A-Fa-f]{3}){1,2}$/i.test(hex) ? hex : '#000000'}
                                        onChange={(e) => updateFromHex(e.target.value)}
                                        className="opacity-0 w-0 h-0 absolute"
                                    />
                                    <div className="w-6 h-6 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: /^#([0-9A-Fa-f]{3}){1,2}$/i.test(hex) ? hex : '#000000' }} />
                                </label>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Pane: Controls */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col gap-4 w-full"
                    >
                        {/* HEX Input */}
                        <div className="p-5 rounded-2xl border border-border/50 bg-surface shadow-md relative group hover:border-accent/40 transition-all">
                            <label className="block text-xs font-bold uppercase tracking-wider text-tertiary mb-2">HEX</label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="text"
                                    value={hex}
                                    onChange={(e) => updateFromHex(e.target.value)}
                                    className="flex-grow bg-transparent text-2xl font-mono text-primary focus:outline-none placeholder:text-tertiary"
                                    spellCheck={false}
                                />
                                <Button
                                    onClick={() => handleCopy('hex', hex)}
                                    className="h-10 w-10 p-0 border border-border/50 bg-surface text-secondary hover:text-accent hover:border-accent shadow-sm"
                                >
                                    {copiedStates.hex ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                                </Button>
                            </div>
                        </div>

                        {/* RGB Input */}
                        <div className="p-5 rounded-2xl border border-border/50 bg-surface shadow-md relative group hover:border-accent/40 transition-all">
                            <label className="block text-xs font-bold uppercase tracking-wider text-tertiary mb-2">RGB</label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="text"
                                    value={rgb}
                                    onChange={(e) => updateFromRgb(e.target.value)}
                                    className="flex-grow bg-transparent text-xl font-mono text-primary focus:outline-none placeholder:text-tertiary"
                                    spellCheck={false}
                                />
                                <Button
                                    onClick={() => handleCopy('rgb', rgb)}
                                    className="h-10 w-10 p-0 border border-border/50 bg-surface text-secondary hover:text-accent hover:border-accent shadow-sm"
                                >
                                    {copiedStates.rgb ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                                </Button>
                            </div>
                        </div>

                        {/* HSL Input */}
                        <div className="p-5 rounded-2xl border border-border/50 bg-surface shadow-md relative group hover:border-accent/40 transition-all">
                            <label className="block text-xs font-bold uppercase tracking-wider text-tertiary mb-2">HSL (Read Only)</label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="text"
                                    value={hsl}
                                    readOnly
                                    className="flex-grow bg-transparent text-xl font-mono text-primary focus:outline-none placeholder:text-tertiary opacity-80"
                                />
                                <Button
                                    onClick={() => handleCopy('hsl', hsl)}
                                    className="h-10 w-10 p-0 border border-border/50 bg-surface text-secondary hover:text-accent hover:border-accent shadow-sm"
                                >
                                    {copiedStates.hsl ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                                </Button>
                            </div>
                        </div>

                    </motion.div>

                </div>
            </div>
        </div>
    )
}
