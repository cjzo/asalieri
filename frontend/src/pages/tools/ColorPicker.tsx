import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '../../components/ui/button'
import { Pipette, Copy, Check } from 'lucide-react'

// Convert HSV to RGB
const hsvToRgb = (h: number, s: number, v: number) => {
    let r = 0, g = 0, b = 0
    const i = Math.floor(h * 6)
    const f = h * 6 - i
    const p = v * (1 - s)
    const q = v * (1 - f * s)
    const t = v * (1 - (1 - f) * s)
    switch (i % 6) {
        case 0: r = v; g = t; b = p; break;
        case 1: r = q; g = v; b = p; break;
        case 2: r = p; g = v; b = t; break;
        case 3: r = p; g = q; b = v; break;
        case 4: r = t; g = p; b = v; break;
        case 5: r = v; g = p; b = q; break;
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)]
}

// Convert RGB to HEX
const rgbToHex = (r: number, g: number, b: number) => {
    return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1).toUpperCase()
}

export function ColorPicker() {
    const [h, setH] = useState(0.03) // ~12 degrees (Terracotta)
    const [s, setS] = useState(0.69)
    const [v, setV] = useState(0.85)

    const [rgb, setRgb] = useState([217, 92, 60])
    const [hex, setHex] = useState('#D95C3C')
    const [copied, setCopied] = useState(false)

    const pickerRef = useRef<HTMLDivElement>(null)
    const hueRef = useRef<HTMLDivElement>(null)

    // Update derived values on HSV change
    useEffect(() => {
        const newRgb = hsvToRgb(h, s, v)
        setRgb(newRgb)
        setHex(rgbToHex(newRgb[0], newRgb[1], newRgb[2]))
    }, [h, s, v])

    const handlePickerDrag = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
        if (!pickerRef.current) return
        const rect = pickerRef.current.getBoundingClientRect()
        let clientX, clientY

        if ('touches' in e) {
            clientX = e.touches[0].clientX
            clientY = e.touches[0].clientY
        } else {
            clientX = (e as MouseEvent).clientX
            clientY = (e as MouseEvent).clientY
        }

        const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
        const y = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height))

        setS(x)
        setV(1 - y)
    }

    const handleHueDrag = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
        if (!hueRef.current) return
        const rect = hueRef.current.getBoundingClientRect()
        let clientX

        if ('touches' in e) {
            clientX = e.touches[0].clientX
        } else {
            clientX = (e as MouseEvent).clientX
        }

        const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
        setH(x)
    }

    // Attach drag listeners manually for fluidity outside bounds
    useEffect(() => {
        let draggingPicker = false
        let draggingHue = false

        const onMouseMove = (e: MouseEvent) => {
            if (draggingPicker) handlePickerDrag(e)
            if (draggingHue) handleHueDrag(e)
        }

        const onMouseUp = () => {
            draggingPicker = false
            draggingHue = false
        }

        const onTouchMove = (e: TouchEvent) => {
            if (draggingPicker || draggingHue) e.preventDefault() // prevent scroll
            if (draggingPicker) handlePickerDrag(e)
            if (draggingHue) handleHueDrag(e)
        }

        const onPickerDown = () => draggingPicker = true
        const onHueDown = () => draggingHue = true

        document.addEventListener('mousemove', onMouseMove)
        document.addEventListener('mouseup', onMouseUp)
        document.addEventListener('touchmove', onTouchMove, { passive: false })
        document.addEventListener('touchend', onMouseUp)

        const pRef = pickerRef.current
        const hRef = hueRef.current

        if (pRef) {
            pRef.addEventListener('mousedown', onPickerDown)
            pRef.addEventListener('touchstart', onPickerDown, { passive: false })
        }
        if (hRef) {
            hRef.addEventListener('mousedown', onHueDown)
            hRef.addEventListener('touchstart', onHueDown, { passive: false })
        }

        return () => {
            document.removeEventListener('mousemove', onMouseMove)
            document.removeEventListener('mouseup', onMouseUp)
            document.removeEventListener('touchmove', onTouchMove)
            document.removeEventListener('touchend', onMouseUp)
            if (pRef) {
                pRef.removeEventListener('mousedown', onPickerDown)
                pRef.removeEventListener('touchstart', onPickerDown)
            }
            if (hRef) {
                hRef.removeEventListener('mousedown', onHueDown)
                hRef.removeEventListener('touchstart', onHueDown)
            }
        }
    }, [])

    const handleCopy = async () => {
        await navigator.clipboard.writeText(hex)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="w-full flex justify-center pb-24 min-h-[80vh]">
            <div className="w-full max-w-4xl flex flex-col items-center px-4">

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="text-center mb-12 flex flex-col items-center"
                >
                    <div className="mb-6 inline-flex p-4 rounded-2xl bg-surface/50 border border-border/50 text-accent shadow-lg shadow-accent/10">
                        <Pipette className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-primary mb-4">
                        Visual Color Picker
                    </h1>
                    <p className="text-lg text-secondary max-w-xl mx-auto font-medium">
                        Craft the perfect shade with raw HSV values, instantly rendered to HEX and RGB.
                    </p>
                </motion.div>

                <div className="w-full flex flex-col gap-8 items-center">

                    {/* Main Picker Window */}
                    <div className="w-full flex flex-col gap-6 p-6 lg:p-8 rounded-3xl border border-border/50 bg-surface shadow-2xl relative overflow-hidden backdrop-blur-md">
                        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] pointer-events-none" />

                        <div className="relative z-10 w-full flex flex-col gap-6">

                            {/* Saturation/Value Area */}
                            <div
                                ref={pickerRef}
                                className="w-full h-64 sm:h-80 rounded-2xl cursor-crosshair relative shadow-inner overflow-hidden border border-black/10 dark:border-white/10"
                                style={{ backgroundColor: `hsl(${h * 360}, 100%, 50%)` }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-white to-transparent" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />

                                {/* Pointer */}
                                <div
                                    className="absolute w-5 h-5 -ml-2.5 -mt-2.5 border-[3px] border-white rounded-full shadow-md pointer-events-none"
                                    style={{
                                        left: `${s * 100}%`,
                                        top: `${(1 - v) * 100}%`,
                                        backgroundColor: hex
                                    }}
                                />
                            </div>

                            {/* Hue Slider */}
                            <div
                                ref={hueRef}
                                className="w-full h-8 rounded-xl cursor-ew-resize relative shadow-inner overflow-hidden border border-black/10 dark:border-white/10"
                                style={{
                                    background: 'linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)'
                                }}
                            >
                                {/* Pointer */}
                                <div
                                    className="absolute top-0 bottom-0 w-3 -ml-1.5 bg-white border border-black/20 rounded shadow-md pointer-events-none"
                                    style={{ left: `${h * 100}%` }}
                                />
                            </div>

                        </div>
                    </div>

                    {/* Output Stats Window */}
                    <div className="w-full flex justify-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-surface/80 border border-border/50 rounded-2xl p-4 flex flex-wrap gap-4 items-center shadow-lg w-full max-w-2xl backdrop-blur-sm"
                        >
                            {/* Large Color Swatch */}
                            <div
                                className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl shadow-inner border border-black/10 dark:border-white/10 flex-shrink-0"
                                style={{ backgroundColor: hex }}
                            />

                            <div className="flex-grow flex flex-col justify-center gap-1 min-w-[200px]">
                                <span className="text-secondary text-sm font-bold uppercase tracking-widest pl-1">HEX</span>
                                <div className="flex items-center">
                                    <input
                                        type="text"
                                        value={hex}
                                        readOnly
                                        className="bg-transparent text-primary text-3xl font-mono focus:outline-none w-full tracking-tight"
                                    />
                                    <Button
                                        onClick={handleCopy}
                                        className="h-10 w-10 p-0 ml-2 shadow-sm border border-border/50 bg-surface text-accent hover:border-accent hover:bg-accent/10 transition-colors"
                                    >
                                        {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                    </Button>
                                </div>
                            </div>

                            <div className="w-full sm:w-auto h-px sm:h-16 w-full bg-border/50 hidden sm:block mx-2" />

                            <div className="flex-grow flex flex-col justify-center gap-2 pl-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-tertiary font-bold w-12 uppercase tracking-wider">RGB</span>
                                    <span className="font-mono text-primary font-medium">{rgb.join(', ')}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-tertiary font-bold w-12 uppercase tracking-wider">HSV</span>
                                    <span className="font-mono text-primary font-medium">
                                        {Math.round(h * 360)}°, {Math.round(s * 100)}%, {Math.round(v * 100)}%
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                </div>
            </div>
        </div >
    )
}
