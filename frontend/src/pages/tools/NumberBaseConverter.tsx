import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '../../components/ui/button'
import { Binary, Copy, Check } from 'lucide-react'

type Base = 'bin' | 'oct' | 'dec' | 'hex'

export function NumberBaseConverter() {
    const [values, setValues] = useState({
        bin: '0',
        oct: '0',
        dec: '0',
        hex: '0'
    })

    const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({
        bin: false, oct: false, dec: false, hex: false
    })

    const [error, setError] = useState<string | null>(null)

    const updateFrom = (base: Base, value: string) => {
        const val = value.trim()

        // Allow empty string to clear all
        if (val === '') {
            setValues({ bin: '', oct: '', dec: '', hex: '' })
            setError(null)
            return
        }

        try {
            let decimalBigInt: bigint

            switch (base) {
                case 'bin':
                    if (!/^[01]+$/.test(val)) throw new Error('Invalid binary format')
                    decimalBigInt = BigInt('0b' + val)
                    break
                case 'oct':
                    if (!/^[0-7]+$/.test(val)) throw new Error('Invalid octal format')
                    decimalBigInt = BigInt('0o' + val)
                    break
                case 'dec':
                    if (!/^-?\d+$/.test(val)) throw new Error('Invalid decimal format')
                    decimalBigInt = BigInt(val)
                    break
                case 'hex':
                    if (!/^[0-9A-Fa-f]+$/.test(val)) throw new Error('Invalid hexadecimal format')
                    decimalBigInt = BigInt('0x' + val)
                    break
            }

            // Only allow positive numbers or zero for bases other than decimal logic
            if (decimalBigInt < 0n) throw new Error('Negative numbers only supported in decimal (but base formats lack standard negative representations)')

            setValues({
                bin: decimalBigInt.toString(2),
                oct: decimalBigInt.toString(8),
                dec: decimalBigInt.toString(10),
                hex: decimalBigInt.toString(16).toUpperCase()
            })
            setError(null)

        } catch (err: any) {
            // Revert valid values to an empty string but keep the invalid input the user typed
            setValues(prev => ({
                ...prev,
                bin: base === 'bin' ? val : '',
                oct: base === 'oct' ? val : '',
                dec: base === 'dec' ? val : '',
                hex: base === 'hex' ? val : ''
            }))
            setError(err.message || 'Invalid input')
        }
    }

    const handleCopy = async (id: string, value: string) => {
        if (!value || error) return
        await navigator.clipboard.writeText(value)
        setCopiedStates(prev => ({ ...prev, [id]: true }))
        setTimeout(() => setCopiedStates(prev => ({ ...prev, [id]: false })), 2000)
    }

    const inputs = [
        { id: 'dec' as Base, label: 'Decimal (Base 10)', placeholder: 'e.g. 42' },
        { id: 'bin' as Base, label: 'Binary (Base 2)', placeholder: 'e.g. 101010' },
        { id: 'hex' as Base, label: 'Hexadecimal (Base 16)', placeholder: 'e.g. 2A' },
        { id: 'oct' as Base, label: 'Octal (Base 8)', placeholder: 'e.g. 52' }
    ]

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
                        <Binary className="w-8 h-8" />
                    </div>

                    <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-primary mb-4">
                        Number Base Converter
                    </h1>
                    <p className="text-lg text-secondary max-w-xl mx-auto font-medium">
                        Convert numbers across Decimal, Binary, Hexadecimal, and Octal bases in real-time. Supports large integers.
                    </p>
                </motion.div>

                <div className="w-full max-w-3xl flex flex-col gap-6">

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-full p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-500 text-center text-sm font-medium"
                        >
                            {error}
                        </motion.div>
                    )}

                    <div className="grid grid-cols-1 gap-6">
                        {inputs.map((input, index) => (
                            <motion.div
                                key={input.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={`flex flex-col p-6 rounded-2xl border bg-surface shadow-xl relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-accent/40 ${error && values[input.id] ? 'border-red-500/50' : 'border-border/50'}`}
                            >
                                <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] pointer-events-none" />

                                <div className="relative z-10 flex flex-col gap-3">
                                    <div className="flex justify-between items-center">
                                        <label className="block text-sm font-bold uppercase tracking-wider text-accent ml-1">
                                            {input.label}
                                        </label>
                                        <Button
                                            onClick={() => handleCopy(input.id, values[input.id])}
                                            disabled={!values[input.id] || !!error}
                                            className="h-9 px-4 shadow-sm border border-border/50 bg-surface/80 hover:bg-surface hover:text-accent hover:border-accent/50 transition-colors"
                                        >
                                            {copiedStates[input.id] ? <Check className="w-4 h-4 text-emerald-500 mr-2" /> : <Copy className="w-4 h-4 mr-2 text-secondary" />}
                                            {copiedStates[input.id] ? 'Copied' : 'Copy'}
                                        </Button>
                                    </div>
                                    <input
                                        type="text"
                                        value={values[input.id]}
                                        onChange={(e) => updateFrom(input.id, e.target.value)}
                                        placeholder={input.placeholder}
                                        className={`w-full h-16 bg-transparent border border-border/50 rounded-xl px-5 font-mono text-2xl focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all shadow-inner placeholder:text-tertiary/50 ${error && values[input.id] ? 'text-red-500' : 'text-primary'}`}
                                        spellCheck="false"
                                    />
                                </div>
                            </motion.div>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    )
}
