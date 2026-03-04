import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '../../components/ui/button'
import { Scale, Copy, Check, ArrowRightLeft } from 'lucide-react'

// Define the conversion data structure
type UnitCategory = 'Length' | 'Mass' | 'Volume' | 'Temperature'

interface Unit {
    id: string;
    label: string;
    multiplier: number; // relative to a base unit (e.g. meters for Length, grams for Mass)
}

const unitData: Record<UnitCategory, Unit[]> = {
    Length: [
        { id: 'm', label: 'Meters (m)', multiplier: 1 },
        { id: 'km', label: 'Kilometers (km)', multiplier: 1000 },
        { id: 'cm', label: 'Centimeters (cm)', multiplier: 0.01 },
        { id: 'mm', label: 'Millimeters (mm)', multiplier: 0.001 },
        { id: 'in', label: 'Inches (in)', multiplier: 0.0254 },
        { id: 'ft', label: 'Feet (ft)', multiplier: 0.3048 },
        { id: 'yd', label: 'Yards (yd)', multiplier: 0.9144 },
        { id: 'mi', label: 'Miles (mi)', multiplier: 1609.344 },
    ],
    Mass: [
        { id: 'g', label: 'Grams (g)', multiplier: 1 },
        { id: 'kg', label: 'Kilograms (kg)', multiplier: 1000 },
        { id: 'mg', label: 'Milligrams (mg)', multiplier: 0.001 },
        { id: 'oz', label: 'Ounces (oz)', multiplier: 28.34952 },
        { id: 'lb', label: 'Pounds (lb)', multiplier: 453.59237 },
        { id: 't', label: 'Metric Tonnes (t)', multiplier: 1000000 },
    ],
    Volume: [
        { id: 'l', label: 'Liters (L)', multiplier: 1 },
        { id: 'ml', label: 'Milliliters (mL)', multiplier: 0.001 },
        { id: 'gal_us', label: 'US Gallons (gal)', multiplier: 3.785411784 },
        { id: 'qt_us', label: 'US Quarts (qt)', multiplier: 0.946352946 },
        { id: 'pt_us', label: 'US Pints (pt)', multiplier: 0.473176473 },
        { id: 'cup_us', label: 'US Cups', multiplier: 0.24 },
        { id: 'oz_us', label: 'US Fluid Ounces (fl oz)', multiplier: 0.0295735295625 },
    ],
    Temperature: [
        { id: 'c', label: 'Celsius (°C)', multiplier: 1 }, // Temperature requires special logic
        { id: 'f', label: 'Fahrenheit (°F)', multiplier: 1 },
        { id: 'k', label: 'Kelvin (K)', multiplier: 1 },
    ]
}

export function UnitConverter() {
    const categories: UnitCategory[] = ['Length', 'Mass', 'Volume', 'Temperature']

    const [category, setCategory] = useState<UnitCategory>('Length')
    const [fromUnit, setFromUnit] = useState<string>('m')
    const [toUnit, setToUnit] = useState<string>('ft')
    const [inputValue, setInputValue] = useState<string>('1')
    const [outputValue, setOutputValue] = useState<string>('')
    const [copied, setCopied] = useState(false)

    // Reset units when category changes
    useEffect(() => {
        const units = unitData[category]
        setFromUnit(units[0].id)
        setToUnit(units[1 < units.length ? 1 : 0].id)
    }, [category])

    // Convert values
    useEffect(() => {
        if (inputValue === '' || isNaN(Number(inputValue))) {
            setOutputValue('')
            return
        }

        const val = parseFloat(inputValue)

        if (category === 'Temperature') {
            let celsius = 0
            // Convert to Celsius first
            if (fromUnit === 'c') celsius = val
            else if (fromUnit === 'f') celsius = (val - 32) * 5 / 9
            else if (fromUnit === 'k') celsius = val - 273.15

            // Convert Celsius to Target
            let result = 0
            if (toUnit === 'c') result = celsius
            else if (toUnit === 'f') result = (celsius * 9 / 5) + 32
            else if (toUnit === 'k') result = celsius + 273.15

            // Format to reasonable decimal places
            setOutputValue(Number(result.toFixed(6)).toString())
        } else {
            const units = unitData[category]
            const from = units.find(u => u.id === fromUnit)
            const to = units.find(u => u.id === toUnit)

            if (from && to) {
                // value -> base -> target
                const baseValue = val * from.multiplier
                const targetValue = baseValue / to.multiplier
                // Strip floating point errors
                setOutputValue(Number(targetValue.toFixed(8)).toString())
            }
        }
    }, [inputValue, fromUnit, toUnit, category])

    const handleCopy = async () => {
        if (!outputValue) return
        await navigator.clipboard.writeText(outputValue)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const swapUnits = () => {
        setFromUnit(toUnit)
        setToUnit(fromUnit)
        setInputValue(outputValue)
    }

    return (
        <div className="w-full flex justify-center pb-24 min-h-[80vh]">
            <div className="w-full max-w-5xl flex flex-col items-center px-4">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="text-center mb-12 flex flex-col items-center"
                >
                    <div className="mb-6 inline-flex p-4 rounded-2xl bg-surface/50 border border-border/50 text-accent shadow-lg shadow-accent/10">
                        <Scale className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-primary mb-4">
                        Unit Converter
                    </h1>
                    <p className="text-lg text-secondary max-w-xl mx-auto font-medium">
                        Quickly convert between different units of length, mass, volume, and temperature.
                    </p>
                </motion.div>

                {/* Categories Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full flex flex-wrap justify-center gap-3 mb-8 focus:outline-none"
                >
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setCategory(cat)}
                            className={`px-6 py-3 rounded-full text-sm font-bold tracking-wider uppercase transition-all shadow-sm ${category === cat
                                    ? 'bg-accent/90 text-white shadow-accent/20 border border-transparent'
                                    : 'bg-surface/50 text-secondary hover:text-primary hover:bg-surface border border-border/50'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </motion.div>

                <div className="w-full flex flex-col lg:flex-row gap-6 relative items-stretch">

                    {/* From Input Area */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex-1 flex flex-col p-6 lg:p-8 rounded-3xl border border-border/40 bg-surface/40 backdrop-blur-sm shadow-xl transition-all hover:border-accent/40 hover:shadow-2xl"
                    >
                        <div className="flex flex-col gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-tertiary ml-1">From Value</label>
                                <input
                                    type="number"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Enter amount"
                                    className="w-full h-16 bg-transparent border border-border/50 rounded-2xl px-5 text-primary text-2xl font-mono focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/50 transition-all shadow-inner"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-tertiary ml-1">From Unit</label>
                                <select
                                    value={fromUnit}
                                    onChange={(e) => setFromUnit(e.target.value)}
                                    className="w-full h-14 bg-surface border border-border/50 rounded-xl px-4 text-primary font-medium focus:outline-none focus:border-accent/50 transition-all shadow-sm cursor-pointer"
                                >
                                    {unitData[category].map(u => (
                                        <option key={u.id} value={u.id}>{u.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </motion.div>

                    {/* Swap Button (Desktop) */}
                    <div className="hidden lg:flex flex-col items-center justify-center -mx-4 z-10 w-12">
                        <Button
                            onClick={swapUnits}
                            className="h-14 w-14 rounded-full bg-surface border-2 border-border/50 text-accent hover:bg-surface hover:text-primary hover:border-accent shadow-lg shadow-accent/10 transition-all transform hover:scale-110 active:scale-95 absolute"
                            style={{ left: '50%', transform: 'translateX(-50%)' }}
                            title="Swap Units"
                        >
                            <ArrowRightLeft className="w-6 h-6" />
                        </Button>
                    </div>

                    {/* Swap Button (Mobile) */}
                    <div className="flex lg:hidden justify-center -my-9 z-10 w-full">
                        <Button
                            onClick={swapUnits}
                            className="h-12 w-12 rounded-full bg-surface border-2 border-border/50 text-accent hover:bg-surface hover:text-primary hover:border-accent shadow-lg transition-all"
                        >
                            <ArrowRightLeft className="w-5 h-5" />
                        </Button>
                    </div>

                    {/* To Output Area */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex-1 flex flex-col p-6 lg:p-8 rounded-3xl border border-border/50 bg-surface shadow-xl relative overflow-hidden transition-all hover:border-accent/40 hover:shadow-2xl"
                    >
                        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] pointer-events-none" />

                        <div className="relative z-10 flex flex-col gap-6">
                            <div className="space-y-2 relative">
                                <div className="flex justify-between items-center mb-1">
                                    <label className="text-xs font-bold uppercase tracking-wider text-accent ml-1">Converted Value</label>
                                    <Button
                                        onClick={handleCopy}
                                        disabled={!outputValue}
                                        className="h-8 px-3 shadow-md shadow-accent/20 absolute -top-1 right-0 text-xs"
                                    >
                                        {copied ? <Check className="w-3.5 h-3.5 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                                        {copied ? 'Copied' : 'Copy'}
                                    </Button>
                                </div>
                                <input
                                    type="text"
                                    value={outputValue}
                                    readOnly
                                    placeholder="Result"
                                    className="w-full h-16 bg-transparent border border-border/50 rounded-2xl px-5 text-accent text-2xl font-mono focus:outline-none transition-all shadow-inner"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-tertiary ml-1">To Unit</label>
                                <select
                                    value={toUnit}
                                    onChange={(e) => setToUnit(e.target.value)}
                                    className="w-full h-14 bg-surface border border-border/50 rounded-xl px-4 text-primary font-medium focus:outline-none focus:border-accent/50 transition-all shadow-sm cursor-pointer"
                                >
                                    {unitData[category].map(u => (
                                        <option key={u.id} value={u.id}>{u.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </div>
    )
}
