import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '../../components/ui/button'
import { Lock, Unlock, Copy, Check, ArrowRightLeft, ShieldAlert } from 'lucide-react'
import CryptoJS from 'crypto-js'

export function TextEncryption() {
    const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt')
    const [input, setInput] = useState('')
    const [secretKey, setSecretKey] = useState('')
    const [output, setOutput] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [copied, setCopied] = useState(false)

    const handleProcess = () => {
        setError(null)
        setOutput('')

        if (!input) {
            setError('Please provide input text.')
            return
        }
        if (!secretKey) {
            setError('Secret key is required.')
            return
        }

        try {
            if (mode === 'encrypt') {
                const encrypted = CryptoJS.AES.encrypt(input, secretKey).toString()
                setOutput(encrypted)
            } else {
                const decrypted = CryptoJS.AES.decrypt(input, secretKey)
                const originalText = decrypted.toString(CryptoJS.enc.Utf8)
                if (!originalText) throw new Error('Malformed UTF-8 Data (Wrong Key?)')
                setOutput(originalText)
            }
        } catch (e) {
            setError(mode === 'encrypt' ? 'Encryption failed.' : 'Decryption failed. Incorrect key or corrupted data.')
        }
    }

    const handleCopy = async () => {
        if (!output) return
        await navigator.clipboard.writeText(output)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const flipMode = () => {
        setMode(prev => prev === 'encrypt' ? 'decrypt' : 'encrypt')
        setInput(output) // move output to input for easy round-trip
        setOutput('')
        setError(null)
    }

    const isEncrypt = mode === 'encrypt'

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
                        {isEncrypt ? <Lock className="w-8 h-8" /> : <Unlock className="w-8 h-8" />}
                    </div>

                    <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-primary mb-4">
                        AES Text Encryption
                    </h1>
                    <p className="text-lg text-secondary max-w-xl mx-auto font-medium">
                        Securely encrypt and decrypt messages using advanced AES-256 standard. Client-side only.
                    </p>
                </motion.div>

                <div className="w-full max-w-4xl flex flex-col gap-6 relative">

                    {/* Mode Toggle & Key Input Area (Controls Box) */}
                    <div className="flex flex-col sm:flex-row gap-4 p-6 rounded-2xl border border-border/40 bg-surface/40 backdrop-blur-sm shadow-sm transition-all duration-300 hover:border-accent/30">
                        <Button
                            onClick={flipMode}
                            className={`flex flex-col justify-center items-center h-14 px-6 rounded-xl border border-border/50 transition-all duration-300 bg-surface text-primary shadow-sm hover:border-accent/50 hover:text-accent`}
                        >
                            <span className="flex items-center text-sm font-medium uppercase tracking-wider">
                                <ArrowRightLeft className="w-4 h-4 mr-2" />
                                {isEncrypt ? 'Encrypting Mode' : 'Decrypting Mode'}
                            </span>
                        </Button>

                        <div className="flex-1 flex relative group">
                            <input
                                type="password"
                                value={secretKey}
                                onChange={(e) => setSecretKey(e.target.value)}
                                placeholder="Enter Secret Key..."
                                className="w-full h-14 px-6 bg-transparent border border-border/50 rounded-xl text-primary focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/50 transition-all font-mono text-sm shadow-inner"
                            />
                        </div>
                    </div>

                    {/* Work Area (Main Display Box) */}
                    <motion.div
                        className="flex flex-col rounded-2xl border border-border/50 bg-surface shadow-xl relative overflow-hidden transition-all duration-300 hover:border-accent/40 hover:shadow-2xl"
                    >
                        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] pointer-events-none" />

                        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-border/50">

                            {/* Input */}
                            <div className="flex flex-col p-6 h-[300px] bg-surface/30">
                                <label className="text-xs font-medium uppercase tracking-widest text-tertiary mb-3 ml-1">
                                    {isEncrypt ? 'Plain Text Input' : 'Encrypted Text Input'}
                                </label>
                                <textarea
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    className="w-full flex-grow bg-transparent border-none text-primary focus:outline-none resize-none font-mono text-sm leading-relaxed placeholder:text-tertiary/50"
                                    placeholder={isEncrypt ? "Secret message goes here..." : "U2FsdGVkX1..."}
                                    spellCheck={false}
                                />
                            </div>

                            {/* Output */}
                            <div className={`flex flex-col p-6 h-[300px] transition-all relative ${error ? 'bg-red-500/5' : 'bg-surface/30'}`}>
                                <div className="flex justify-between items-center mb-3 ml-1">
                                    <label className="text-xs font-medium uppercase tracking-widest text-tertiary">
                                        {isEncrypt ? 'Encrypted Output' : 'Decrypted Output'}
                                    </label>
                                    <Button
                                        onClick={handleCopy}
                                        disabled={!output}
                                        className="h-8 px-3 rounded-lg bg-surface hover:bg-surface text-secondary border border-border/50 hover:text-accent hover:border-accent/50 transition-all shadow-sm relative z-20"
                                    >
                                        {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                                        {copied ? 'Copied' : 'Copy'}
                                    </Button>
                                </div>

                                <AnimatePresence mode="wait">
                                    {error ? (
                                        <motion.div
                                            key="error"
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            className="flex-grow flex flex-col items-center justify-center text-red-500 gap-3"
                                        >
                                            <ShieldAlert className="w-10 h-10 opacity-80" />
                                            <p className="font-bold text-center px-4">{error}</p>
                                        </motion.div>
                                    ) : (
                                        <motion.textarea
                                            key="output"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            readOnly
                                            value={output}
                                            className={`w-full flex-grow bg-transparent border-none focus:outline-none resize-none font-mono text-sm leading-relaxed text-primary`}
                                            placeholder="Result will appear here..."
                                            spellCheck={false}
                                        />
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Action Button inside Main Display Box at the bottom */}
                        <div className="p-6 border-t border-border/50 bg-surface/50">
                            <Button
                                onClick={handleProcess}
                                className="w-full h-12 rounded-xl text-sm font-medium uppercase tracking-wider border-none transition-all duration-300 text-surface shadow-lg bg-accent hover:bg-accent/90 shadow-accent/20 hover:shadow-accent/40 relative z-20"
                            >
                                {isEncrypt ? (
                                    <><Lock className="w-4 h-4 mr-2" /> Encrypt Text</>
                                ) : (
                                    <><Unlock className="w-4 h-4 mr-2" /> Decrypt Text</>
                                )}
                            </Button>
                        </div>
                    </motion.div>

                </div>
            </div>
        </div>
    )
}
