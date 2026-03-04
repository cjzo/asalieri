import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '../../components/ui/button'
import { Languages, Copy, Trash2, Check, ArrowRightLeft } from 'lucide-react'
import * as OpenCC from 'opencc-js'

export function ChineseConverter() {
    const [inputText, setInputText] = useState('这是一个中文转换工具，可以将简体和繁体互相转换。')
    const [outputText, setOutputText] = useState('')
    const [mode, setMode] = useState<'s2t' | 't2s'>('s2t')
    const [copied, setCopied] = useState(false)
    const [converter, setConverter] = useState<any>(null)

    // Initialize converter on mode change
    useEffect(() => {
        try {
            const newConverter = OpenCC.Converter({ from: mode === 's2t' ? 'cn' : 'tw', to: mode === 's2t' ? 'tw' : 'cn' })
            setConverter(() => newConverter)
        } catch (e) {
            console.error("OpenCC init failed", e)
        }
    }, [mode])

    // Convert text when input or converter changes
    useEffect(() => {
        if (!inputText) {
            setOutputText('')
            return
        }
        if (converter) {
            try {
                setOutputText(converter(inputText))
            } catch (e) {
                setOutputText('Error converting text')
            }
        }
    }, [inputText, converter])

    const handleCopy = async () => {
        if (!outputText) return
        await navigator.clipboard.writeText(outputText)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const swapMode = () => {
        setMode(mode === 's2t' ? 't2s' : 's2t')
        setInputText(outputText) // carry over output as new input
    }

    return (
        <div className="w-full flex justify-center pb-24">
            <div className="w-full max-w-6xl flex flex-col items-center px-4">

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="text-center mb-12 flex flex-col items-center relative"
                >
                    <div className="mb-6 inline-flex p-4 rounded-2xl bg-surface/50 border border-border/50 text-accent shadow-lg shadow-accent/10">
                        <Languages className="w-8 h-8" />
                    </div>

                    <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-primary mb-4">
                        Chinese Converter
                    </h1>
                    <p className="text-lg text-secondary max-w-xl mx-auto font-medium">
                        Accurately convert between Simplified (简体) and Traditional (繁體) Chinese text using OpenCC.
                    </p>
                </motion.div>

                <div className="w-full flex flex-col gap-6">

                    {/* Controls */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col md:flex-row items-center justify-center gap-4 mb-2"
                    >
                        <div className="flex bg-surface/40 p-1.5 rounded-2xl border border-border/50 backdrop-blur-sm shadow-sm hover:border-accent/30 transition-all">
                            <button
                                onClick={() => setMode('s2t')}
                                className={`px-6 py-3 rounded-xl text-sm font-medium transition-all ${mode === 's2t'
                                        ? 'bg-accent/90 text-white shadow-md shadow-accent/20'
                                        : 'text-secondary hover:text-primary hover:bg-surface'
                                    }`}
                            >
                                Simplified → Traditional
                            </button>
                            <button
                                onClick={() => setMode('t2s')}
                                className={`px-6 py-3 rounded-xl text-sm font-medium transition-all ${mode === 't2s'
                                        ? 'bg-accent/90 text-white shadow-md shadow-accent/20'
                                        : 'text-secondary hover:text-primary hover:bg-surface'
                                    }`}
                            >
                                Traditional → Simplified
                            </button>
                        </div>
                    </motion.div>

                    {/* Editors */}
                    <div className="w-full flex flex-col lg:flex-row gap-6">

                        {/* Input Area */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex-1 flex flex-col h-[450px] rounded-2xl border border-border/40 bg-surface/40 backdrop-blur-sm shadow-sm transition-all hover:border-accent/30 p-2"
                        >
                            <div className="flex justify-between items-center px-4 py-3 border-b border-border/30">
                                <label className="text-sm font-bold uppercase tracking-wider text-tertiary">
                                    {mode === 's2t' ? 'Simplified (简体)' : 'Traditional (繁體)'}
                                </label>
                                <Button
                                    onClick={() => setInputText('')}
                                    disabled={!inputText}
                                    className="h-8 text-xs !bg-transparent !text-tertiary hover:!text-red-500 hover:!bg-red-500/10 !shadow-none !px-2"
                                >
                                    <Trash2 className="w-4 h-4 mr-1" /> Clear
                                </Button>
                            </div>
                            <textarea
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder="请输入需要转换的中文内容..."
                                className="w-full flex-grow p-5 bg-transparent text-primary focus:outline-none transition-all resize-none shadow-inner text-lg leading-relaxed custom-scrollbar"
                                spellCheck="false"
                            />
                        </motion.div>

                        {/* Swap Button (Desktop) */}
                        <div className="hidden lg:flex flex-col items-center justify-center -mx-2 z-10">
                            <Button
                                onClick={swapMode}
                                className="h-14 w-14 rounded-full bg-surface border-2 border-border/50 text-accent hover:bg-surface hover:text-primary hover:border-accent shadow-lg shadow-accent/10 transition-all transform hover:scale-110 active:scale-95"
                                title="Swap conversion direction"
                            >
                                <ArrowRightLeft className="w-6 h-6" />
                            </Button>
                        </div>

                        {/* Swap Button (Mobile) */}
                        <div className="flex lg:hidden justify-center -my-9 z-10 w-full">
                            <Button
                                onClick={swapMode}
                                className="h-12 w-12 rounded-full bg-surface border-2 border-border/50 text-accent hover:bg-surface hover:text-primary hover:border-accent shadow-lg transition-all"
                            >
                                <ArrowRightLeft className="w-5 h-5" />
                            </Button>
                        </div>

                        {/* Output Area */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex-1 flex flex-col h-[450px] rounded-2xl border border-border/50 bg-surface shadow-xl relative overflow-hidden transition-all duration-300 hover:border-accent/40 hover:shadow-2xl"
                        >
                            <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] pointer-events-none" />

                            <div className="relative z-10 flex flex-col h-full">
                                <div className="flex justify-between items-center px-4 py-3 border-b border-border/30 bg-surface/30">
                                    <label className="text-sm font-bold uppercase tracking-wider text-accent ml-2">
                                        {mode === 's2t' ? 'Traditional (繁體)' : 'Simplified (简体)'}
                                    </label>
                                    <Button
                                        onClick={handleCopy}
                                        disabled={!outputText}
                                        className="h-8 text-xs !bg-transparent !text-tertiary hover:!text-primary hover:!bg-surface/50 !shadow-none !px-2"
                                    >
                                        {copied ? <Check className="w-4 h-4 mr-1 text-emerald-500" /> : <Copy className="w-4 h-4 mr-1" />}
                                        {copied ? 'Copied' : 'Copy'}
                                    </Button>
                                </div>
                                <textarea
                                    value={outputText}
                                    readOnly
                                    placeholder="轉換結果將在這裡顯示..."
                                    className="w-full flex-grow p-5 bg-transparent text-primary/90 focus:outline-none transition-all resize-none shadow-inner text-lg leading-relaxed custom-scrollbar"
                                    spellCheck="false"
                                />
                            </div>
                        </motion.div>

                    </div>

                </div>
            </div>
        </div>
    )
}
