import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '../../components/ui/button'
import { Palette, Copy, Check, ArrowDown, CircleDashed } from 'lucide-react'

type GradientType = 'linear' | 'radial'

interface ColorStop {
    id: string
    color: string
    position: number // 0-100
}

export function GradientGenerator() {
    const [type, setType] = useState<GradientType>('linear')
    // Default angle for linear
    const [angle, setAngle] = useState(135)

    // Initial stops
    const [stops, setStops] = useState<ColorStop[]>([
        { id: '1', color: '#10b981', position: 0 },
        { id: '2', color: '#38bdf8', position: 100 }
    ])

    const [copied, setCopied] = useState(false)

    // Ensure stops are sorted by position for CSS generation
    const sortedStops = useMemo(() => [...stops].sort((a, b) => a.position - b.position), [stops])

    // Generate the CSS string
    const cssGradient = useMemo(() => {
        const stopsString = sortedStops.map(s => `${s.color} ${s.position}%`).join(', ')
        if (type === 'linear') {
            return `linear-gradient(${angle}deg, ${stopsString})`
        } else {
            return `radial-gradient(circle at center, ${stopsString})`
        }
    }, [type, angle, sortedStops])

    // Generate Tailwind arbitrary value approximation just for fun UI display
    const twClass = `bg-[${cssGradient}]`

    const handleCopy = async () => {
        await navigator.clipboard.writeText(`background: ${cssGradient};`)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const uncopy = () => setCopied(false)

    const updateStopColor = (id: string, newColor: string) => {
        uncopy()
        setStops(stops.map(s => s.id === id ? { ...s, color: newColor } : s))
    }

    const updateStopPosition = (id: string, newPos: number) => {
        uncopy()
        setStops(stops.map(s => s.id === id ? { ...s, position: newPos } : s))
    }

    const addStop = () => {
        uncopy()
        // Add a new stop in the middle of max gap, or default 50%
        const newStop: ColorStop = {
            id: Date.now().toString(),
            color: '#e05236', // Razor accent color
            position: 50
        }
        setStops([...stops, newStop])
    }

    const removeStop = (id: string) => {
        if (stops.length <= 2) return // Keep at least 2
        uncopy()
        setStops(stops.filter(s => s.id !== id))
    }

    // Dial handling for angle
    const handleDialClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (type !== 'linear') return
        uncopy()
        const rect = e.currentTarget.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2

        let mouseAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI)
        mouseAngle += 90; // Adjust so top is 0deg in CSS
        if (mouseAngle < 0) mouseAngle += 360

        setAngle(Math.round(mouseAngle))
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

                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-primary mb-4">
                        Gradient Matrix
                    </h1>
                    <p className="text-lg text-secondary max-w-xl mx-auto font-medium">
                        Sculpt beautiful CSS gradients with a kinetic UI.
                    </p>
                </motion.div>

                <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">

                    {/* Left Pane: Preview Area (Main Display Box) */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col p-8 rounded-2xl border border-border/50 bg-surface shadow-xl relative overflow-hidden min-h-[400px] h-full transition-all duration-300 hover:border-accent/40 hover:shadow-2xl"
                    >
                        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] pointer-events-none z-0" />

                        <div className="relative z-10 flex flex-col gap-6 w-full h-full">

                            {/* Huge Dynamic Preview Box */}
                            <motion.div
                                layout
                                className="w-full aspect-square lg:aspect-[4/3] rounded-xl shadow-inner overflow-hidden border border-border/50 relative group flex-grow"
                            >
                                <motion.div
                                    className="absolute inset-0 transition-all duration-300"
                                    style={{ background: cssGradient }}
                                />

                                {/* Overlay Controls that appear on hover over the preview */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-white gap-6">
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full max-w-sm">
                                        <Button
                                            onClick={handleCopy}
                                            className="w-full h-14 rounded-2xl bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white font-bold text-lg shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:border-white shadow-xl transition-all"
                                        >
                                            {copied ? <Check className="w-5 h-5 mr-3" /> : <Copy className="w-5 h-5 mr-3" />}
                                            {copied ? 'Copied CSS!' : 'Copy CSS property'}
                                        </Button>
                                    </motion.div>

                                    <div className="text-center">
                                        <p className="font-mono text-sm break-keep leading-loose">{cssGradient}</p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Export Types visually */}
                            <div className="grid grid-cols-2 gap-4 mt-auto">
                                <div className="p-4 rounded-xl bg-surface/50 border border-border/50 shadow-sm text-center">
                                    <p className="text-xs font-bold uppercase tracking-widest text-tertiary mb-2">Tailwind Utility Equivalent</p>
                                    <p className="font-mono text-sm text-secondary truncate px-2" title={twClass}>{twClass}</p>
                                </div>
                                <div className="p-4 rounded-xl bg-surface/50 border border-border/50 shadow-sm text-center flex flex-col justify-center">
                                    <p className="text-xs font-bold uppercase tracking-widest text-tertiary mb-2">CSS Ruleset</p>
                                    <p className="font-mono text-sm text-secondary truncate bg-transparent">background: ... ;</p>
                                </div>
                            </div>

                        </div>
                    </motion.div>

                    {/* Right Pane: Controls (Controls Box) */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col gap-6 p-6 rounded-2xl border border-border/40 bg-surface/40 backdrop-blur-sm shadow-sm transition-all h-full hover:border-accent/30 relative"
                    >

                        {/* Type Toggle Header */}
                        <div className="flex gap-2 p-2 bg-surface/50 border border-border/40 rounded-2xl">
                            <button
                                onClick={() => { setType('linear'); uncopy(); }}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${type === 'linear' ? 'bg-primary text-surface shadow-md' : 'text-tertiary hover:text-secondary hover:bg-surface/50'}`}
                            >
                                <ArrowDown className="w-4 h-4" /> Linear
                            </button>
                            <button
                                onClick={() => { setType('radial'); uncopy(); }}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${type === 'radial' ? 'bg-primary text-surface shadow-md' : 'text-tertiary hover:text-secondary hover:bg-surface/50'}`}
                            >
                                <CircleDashed className="w-4 h-4" /> Radial
                            </button>
                        </div>

                        {/* Angle Dial (Only if Linear) */}
                        <AnimatePresence>
                            {type === 'linear' && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="flex items-center justify-between p-6 bg-surface/30 rounded-3xl border border-border/50 group">
                                        <div>
                                            <p className="font-bold text-primary mb-1 text-sm uppercase tracking-wider">Direction Angle</p>
                                            <p className="text-4xl font-black text-accent drop-shadow-sm">
                                                {angle}°
                                            </p>
                                        </div>

                                        {/* Interactive Dial */}
                                        <div
                                            className="w-24 h-24 rounded-full border-4 border-border relative cursor-crosshair flex items-center justify-center"
                                            onMouseDown={(e) => {
                                                handleDialClick(e)
                                                // rough drag implementation 
                                                const onMove = (ev: MouseEvent) => {
                                                    const rect = e.currentTarget.getBoundingClientRect()
                                                    const centerX = rect.left + rect.width / 2
                                                    const centerY = rect.top + rect.height / 2
                                                    let a = Math.atan2(ev.clientY - centerY, ev.clientX - centerX) * (180 / Math.PI)
                                                    a += 90; if (a < 0) a += 360
                                                    setAngle(Math.round(a))
                                                    uncopy()
                                                }
                                                const onUp = () => {
                                                    document.removeEventListener('mousemove', onMove)
                                                    document.removeEventListener('mouseup', onUp)
                                                }
                                                document.addEventListener('mousemove', onMove)
                                                document.addEventListener('mouseup', onUp)
                                            }}
                                        >
                                            {/* Center dot */}
                                            <div className="w-2 h-2 rounded-full bg-border" />
                                            {/* Pointer needle based on angle */}
                                            <motion.div
                                                className="absolute inset-0"
                                                animate={{ rotate: angle - 90 }} // adjust back to SVG/Math space from CSS space
                                                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                            >
                                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent to-primary rounded-full origin-left" />
                                                {/* Arrow head */}
                                                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1.5 w-3 h-3 bg-primary rotate-45 border-t border-r border-transparent" style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }} />
                                            </motion.div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Color Stops Matrix */}
                        <div className="flex flex-col gap-4">
                            <div className="flex justify-between items-end mb-2">
                                <p className="font-bold text-primary text-sm uppercase tracking-wider">Color Nodes</p>
                                <Button onClick={addStop} className="h-8 bg-accent/10 text-accent hover:text-accent hover:bg-accent/20 shadow-none border border-accent/20 rounded-lg px-3 transition-colors text-xs font-semibold">
                                    + Add Node
                                </Button>
                            </div>

                            <AnimatePresence>
                                {stops.map((stop) => (
                                    <motion.div
                                        key={stop.id}
                                        layout
                                        initial={{ opacity: 0, x: -20, scale: 0.9 }}
                                        animate={{ opacity: 1, x: 0, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        className="flex items-center gap-4 p-4 rounded-2xl bg-surface/50 border border-border/50 group hover:border-border transition-colors"
                                    >
                                        {/* Color Picker Native Wrap */}
                                        <div className="relative w-12 h-12 rounded-xl border border-white/10 overflow-hidden shrink-0 shadow-inner">
                                            <input
                                                type="color"
                                                value={stop.color}
                                                onChange={(e) => updateStopColor(stop.id, e.target.value)}
                                                className="absolute inset-0 w-[200%] h-[200%] -translate-x-1/4 -translate-y-1/4 cursor-pointer"
                                            />
                                        </div>

                                        {/* Hex Text */}
                                        <div className="flex flex-col shrink-0 w-24">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-tertiary">HEX</p>
                                            <p className="font-mono text-sm text-primary uppercase">{stop.color}</p>
                                        </div>

                                        {/* Position Slider */}
                                        <div className="flex-grow flex flex-col gap-2 relative group/slider">
                                            <div className="flex justify-between">
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-tertiary">Position</p>
                                                <p className="text-xs font-mono text-secondary">{stop.position}%</p>
                                            </div>
                                            <input
                                                type="range"
                                                min="0" max="100"
                                                value={stop.position}
                                                onChange={(e) => updateStopPosition(stop.id, parseInt(e.target.value))}
                                                className="w-full h-2 rounded-full appearance-none bg-surface border border-border/50 cursor-ew-resize overflow-hidden"
                                                style={{
                                                    // hacky track fill
                                                    background: `linear-gradient(to right, ${stop.color} ${stop.position}%, transparent ${stop.position}%)`
                                                }}
                                            />
                                        </div>

                                        {/* Remove Button */}
                                        <div className="shrink-0 flex items-center">
                                            <button
                                                onClick={() => removeStop(stop.id)}
                                                disabled={stops.length <= 2}
                                                className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${stops.length <= 2 ? 'opacity-20 cursor-not-allowed' : 'text-red-500 hover:bg-red-500/10'}`}
                                            >
                                                ×
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </motion.div>

                </div>
            </div>
        </div>
    )
}
