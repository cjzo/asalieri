import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '../../components/ui/button'
import { Link2, Copy, Check, ArrowRightLeft } from 'lucide-react'

export function Base64Encoder() {
    const [text, setText] = useState('')
    const [base64, setBase64] = useState('')

    const [copiedText, setCopiedText] = useState(false)
    const [copiedBase64, setCopiedBase64] = useState(false)

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target.value
        setText(val)
        try {
            setBase64(btoa(unescape(encodeURIComponent(val))))
        } catch (err) {
            setBase64('Error encoding text')
        }
    }

    const handleBase64Change = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target.value
        setBase64(val)
        try {
            setText(decodeURIComponent(escape(atob(val))))
        } catch (err) {
            setText('Invalid Base64 string')
        }
    }

    const copyText = async () => {
        if (!text || text === 'Invalid Base64 string') return
        await navigator.clipboard.writeText(text)
        setCopiedText(true)
        setTimeout(() => setCopiedText(false), 2000)
    }

    const copyBase64 = async () => {
        if (!base64 || base64 === 'Error encoding text') return
        await navigator.clipboard.writeText(base64)
        setCopiedBase64(true)
        setTimeout(() => setCopiedBase64(false), 2000)
    }

    return (
        <div className="w-full flex justify-center pb-24 h-full min-h-[80vh]">
            <div className="w-full max-w-7xl flex flex-col items-center h-full">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-10 flex flex-col items-center"
                >
                    <div className="mb-6 inline-flex p-4 rounded-2xl bg-surface/50 border border-border/50 text-accent shadow-lg shadow-accent/10">
                        <Link2 className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-primary mb-4">
                        Base64 Converter
                    </h1>
                    <p className="text-lg text-secondary max-w-xl mx-auto">
                        Instantly encode and decode strings. Type in either box to see the Live Conversion.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 h-[50vh] min-h-[400px] relative"
                >
                    {/* Middle Icon absolute center only for large screens */}
                    <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 items-center justify-center pointer-events-none">
                        <div className="p-3 bg-surface/80 backdrop-blur-md rounded-full border border-border/50 text-tertiary shadow-xl">
                            <ArrowRightLeft className="w-6 h-6" />
                        </div>
                    </div>

                    {/* Text Area */}
                    <div className="flex flex-col rounded-2xl border border-border/40 bg-surface/40 backdrop-blur-sm overflow-hidden shadow-sm transition-all focus-within:ring-1 focus-within:ring-accent/50 focus-within:border-accent/30 hover:border-border/80 group">
                        <div className="flex justify-between items-center p-4 border-b border-border/40 bg-surface/80">
                            <span className="text-sm font-medium text-tertiary uppercase tracking-widest pl-2">Plain Text</span>
                            <Button
                                onClick={copyText}
                                disabled={!text || text === 'Invalid Base64 string'}
                                className="bg-surface text-secondary hover:text-primary hover:bg-surface/80 text-xs h-8 px-3"
                            >
                                {copiedText ? <Check className="w-3.5 h-3.5 mr-1.5" /> : <Copy className="w-3.5 h-3.5 mr-1.5" />}
                                Copy text
                            </Button>
                        </div>

                        <textarea
                            value={text}
                            onChange={handleTextChange}
                            placeholder="Type plain text here to encode..."
                            className={`flex-grow w-full p-6 bg-transparent resize-none font-mono text-sm text-primary focus:outline-none placeholder:text-tertiary ${text === 'Invalid Base64 string' ? 'text-red-500' : ''}`}
                            spellCheck={false}
                        />
                    </div>

                    {/* Base64 Area */}
                    <div className="flex flex-col rounded-2xl border border-border/40 bg-white dark:bg-zinc-950 shadow-sm relative overflow-hidden transition-all focus-within:ring-1 focus-within:ring-accent/50 focus-within:border-accent/30 hover:border-border/80 group">
                        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] pointer-events-none" />

                        <div className="relative z-10 flex justify-between items-center p-4 border-b border-border/30 bg-surface/30">
                            <span className="text-sm font-medium text-tertiary uppercase tracking-widest pl-2">Base64 Encoded</span>
                            <Button
                                onClick={copyBase64}
                                disabled={!base64 || base64 === 'Error encoding text'}
                                className="text-xs h-8 px-3 shadow-md shadow-accent/20"
                            >
                                {copiedBase64 ? <Check className="w-3.5 h-3.5 mr-1.5" /> : <Copy className="w-3.5 h-3.5 mr-1.5" />}
                                Copy Base64
                            </Button>
                        </div>

                        <textarea
                            value={base64}
                            onChange={handleBase64Change}
                            placeholder="Paste Base64 here to decode..."
                            className={`relative z-10 flex-grow w-full p-6 bg-transparent resize-none font-mono text-sm text-[#10b981] dark:text-[#34d399] focus:outline-none placeholder:text-tertiary/50 ${base64 === 'Error encoding text' ? 'text-red-500' : ''}`}
                            spellCheck={false}
                        />
                    </div>

                </motion.div>
            </div>
        </div>
    )
}
