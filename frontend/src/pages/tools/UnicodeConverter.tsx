import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Button } from '../../components/ui/button'
import { Type, Copy, Check, ArrowRightLeft } from 'lucide-react'

export function UnicodeConverter() {
    const [textInput, setTextInput] = useState('')
    const [unicodeInput, setUnicodeInput] = useState('')
    const [copiedText, setCopiedText] = useState(false)
    const [copiedUnicode, setCopiedUnicode] = useState(false)
    const [activeField, setActiveField] = useState<'text' | 'unicode'>('text')

    // Convert Text -> Unicode
    const handleTextChange = useCallback((text: string) => {
        setTextInput(text)
        if (text === '') {
            setUnicodeInput('')
            return
        }
        try {
            const unicode = Array.from(text).map(char => {
                const hex = char.codePointAt(0)?.toString(16).toUpperCase() || ''
                return `U+${hex.padStart(4, '0')}`
            }).join(' ')
            setUnicodeInput(unicode)
        } catch (e) {
            setUnicodeInput('Error encoding text')
        }
    }, [])

    // Convert Unicode -> Text
    const handleUnicodeChange = useCallback((unicodeStr: string) => {
        setUnicodeInput(unicodeStr)
        if (unicodeStr === '') {
            setTextInput('')
            return
        }
        try {
            const parts = unicodeStr.split(/\s+/).filter(Boolean)
            const textChars = parts.map(part => {
                // Strip 'U+', '\u', '0x' or just take raw hex
                const hexStr = part.replace(/^(U\+|\\u|0x)/i, '')
                const codePoint = parseInt(hexStr, 16)
                if (isNaN(codePoint)) throw new Error('Invalid Hex')
                return String.fromCodePoint(codePoint)
            })
            setTextInput(textChars.join(''))
        } catch (e) {
            // Don't overwrite text input with error if they are typing midway
        }
    }, [])

    const handleCopy = async (target: 'text' | 'unicode') => {
        const value = target === 'text' ? textInput : unicodeInput
        if (!value) return

        await navigator.clipboard.writeText(value)

        if (target === 'text') {
            setCopiedText(true)
            setTimeout(() => setCopiedText(false), 2000)
        } else {
            setCopiedUnicode(true)
            setTimeout(() => setCopiedUnicode(false), 2000)
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
                        <Type className="w-8 h-8" />
                    </div>

                    <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-primary mb-4">
                        Unicode Converter
                    </h1>
                    <p className="text-lg text-secondary max-w-xl mx-auto font-medium">
                        Bi-directional mapping between raw text and Unicode code points. Live updates.
                    </p>
                </motion.div>

                <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 relative">

                    {/* Visual Connector Line (Desktop Only) */}
                    <div className="hidden lg:flex absolute inset-0 items-center justify-center pointer-events-none z-10">
                        <div
                            className="w-14 h-14 bg-surface/90 backdrop-blur-md border border-border/50 rounded-full flex items-center justify-center shadow-sm"
                        >
                            <ArrowRightLeft className={`w-5 h-5 transition-colors duration-500 ${activeField === 'text' ? 'text-accent' : 'text-accent rotate-180'}`} />
                        </div>
                    </div>

                    {/* Left Pane: Text Input */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col gap-4"
                    >
                        <div className={`flex flex-col p-6 rounded-2xl border bg-surface shadow-xl relative overflow-hidden h-[400px] transition-all duration-300 hover:border-accent/40 hover:shadow-2xl ${activeField === 'text' ? 'border-accent/50 ring-1 ring-accent/20' : 'border-border/50'}`}>
                            <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] pointer-events-none" />

                            <div className="relative z-10 flex flex-col h-full">
                                <div className="flex justify-between items-center mb-4 ml-1">
                                    <label className={`block text-sm font-medium uppercase tracking-wider transition-colors ${activeField === 'text' ? 'text-accent' : 'text-tertiary'}`}>
                                        Raw Text
                                    </label>
                                    <Button
                                        onClick={() => handleCopy('text')}
                                        disabled={!textInput}
                                        className="h-8 px-3 rounded-lg bg-surface hover:bg-surface border border-border/50 text-secondary hover:text-accent hover:border-accent/50 transition-all shadow-sm relative z-20"
                                    >
                                        {copiedText ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                                        {copiedText ? 'Copied' : 'Copy'}
                                    </Button>
                                </div>

                                <textarea
                                    value={textInput}
                                    onChange={(e) => handleTextChange(e.target.value)}
                                    onFocus={() => setActiveField('text')}
                                    className="w-full flex-grow bg-transparent text-primary text-base focus:outline-none transition-all resize-none placeholder:text-tertiary/50"
                                    placeholder="Enter normal text here (e.g. Hello)"
                                    spellCheck={false}
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Pane: Unicode Array */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col gap-4"
                    >
                        <div className={`flex flex-col p-6 rounded-2xl border bg-surface shadow-xl relative overflow-hidden h-[400px] transition-all duration-300 hover:border-accent/40 hover:shadow-2xl ${activeField === 'unicode' ? 'border-accent/50 ring-1 ring-accent/20' : 'border-border/50'}`}>
                            <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] pointer-events-none" />

                            <div className="relative z-10 flex flex-col h-full">
                                <div className="flex justify-between items-center mb-4 ml-1">
                                    <label className={`block text-sm font-medium uppercase tracking-wider transition-colors ${activeField === 'unicode' ? 'text-accent' : 'text-tertiary'}`}>
                                        Unicode Hex Sequence
                                    </label>
                                    <Button
                                        onClick={() => handleCopy('unicode')}
                                        disabled={!unicodeInput}
                                        className="h-8 px-3 rounded-lg bg-surface hover:bg-surface border border-border/50 text-secondary hover:text-accent hover:border-accent/50 shadow-sm transition-all relative z-20"
                                    >
                                        {copiedUnicode ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                                        {copiedUnicode ? 'Copied' : 'Copy'}
                                    </Button>
                                </div>

                                <textarea
                                    value={unicodeInput}
                                    onChange={(e) => handleUnicodeChange(e.target.value)}
                                    onFocus={() => setActiveField('unicode')}
                                    className="w-full flex-grow bg-transparent text-primary font-mono text-sm focus:outline-none transition-all resize-none placeholder:text-tertiary/30 leading-loose"
                                    placeholder="U+1F98A U+0020 U+0048 U+0065..."
                                    spellCheck={false}
                                />
                            </div>
                        </div>
                    </motion.div>
                </div>

            </div>
        </div>
    )
}
