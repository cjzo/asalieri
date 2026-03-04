import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, AlertCircle } from 'lucide-react'

function decodeBase64Url(str: string) {
    try {
        let base64 = str.replace(/-/g, '+').replace(/_/g, '/')
        while (base64.length % 4 !== 0) base64 += '='
        // Decode base64 to Unicode string
        const binString = atob(base64)
        return new TextDecoder().decode(Uint8Array.from(binString, (m) => m.codePointAt(0)!))
    } catch {
        return null
    }
}

export function JwtDecoder() {
    const [token, setToken] = useState('')

    const decoded = useMemo(() => {
        if (!token.trim()) return null

        const parts = token.split('.')
        if (parts.length !== 3) return { error: 'Invalid JWT Format (Expected 3 parts)' }

        const headerStr = decodeBase64Url(parts[0])
        const payloadStr = decodeBase64Url(parts[1])

        if (!headerStr || !payloadStr) {
            return { error: 'Failed to decode Base64Url payload' }
        }

        try {
            return {
                header: JSON.parse(headerStr),
                payload: JSON.parse(payloadStr),
                signature: parts[2]
            }
        } catch {
            return { error: 'Invalid JSON in Header or Payload' }
        }

    }, [token])

    return (
        <div className="w-full flex justify-center pb-24">
            <div className="w-full max-w-4xl flex flex-col items-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12 flex flex-col items-center"
                >
                    <div className="mb-6 inline-flex p-4 rounded-2xl bg-surface/50 border border-border/50 text-accent shadow-lg shadow-accent/10">
                        <Shield className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-primary mb-4">
                        JWT Decoder
                    </h1>
                    <p className="text-lg text-secondary max-w-xl mx-auto">
                        Decode and inspect JSON Web Tokens instantly.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="w-full flex flex-col gap-6"
                >
                    {/* Input Editor (Controls Box) */}
                    <div className="p-8 rounded-2xl border border-border/40 bg-surface/40 backdrop-blur-sm shadow-sm transition-all duration-300 hover:border-accent/40 hover:shadow-lg flex flex-col gap-4">
                        <label className="block text-sm font-medium text-tertiary uppercase tracking-wider ml-1">Encoded JWT</label>
                        <textarea
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            className="w-full h-40 bg-surface/50 border border-border/50 rounded-xl p-4 text-primary focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all font-mono text-sm resize-none shadow-inner placeholder:text-tertiary"
                            placeholder="ey..."
                            spellCheck={false}
                        />
                    </div>

                    {/* Output Viewer */}
                    <AnimatePresence mode="wait">
                        {decoded?.error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 flex items-center gap-3"
                            >
                                <AlertCircle className="w-5 h-5" />
                                <span className="font-medium">{decoded.error}</span>
                            </motion.div>
                        )}

                        {decoded && !decoded.error && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="w-full"
                            >
                                <div className="p-8 rounded-2xl border border-border/50 bg-surface shadow-xl relative overflow-hidden transition-all duration-300 hover:border-accent/40 hover:shadow-2xl">
                                    <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] pointer-events-none" />

                                    <div className="relative z-10 flex flex-col gap-8">
                                        {/* HEADER */}
                                        <div className="flex flex-col gap-3">
                                            <label className="block text-sm font-medium text-accent uppercase tracking-wider ml-1">Header (Algorithm & Token Type)</label>
                                            <textarea
                                                readOnly
                                                value={JSON.stringify(decoded.header, null, 4)}
                                                className="w-full h-32 bg-surface/50 border border-border/50 rounded-xl p-4 text-accent font-mono text-sm resize-none shadow-inner opacity-90 focus:outline-none"
                                            />
                                        </div>

                                        {/* PAYLOAD */}
                                        <div className="flex flex-col gap-3">
                                            <label className="block text-sm font-medium text-accent uppercase tracking-wider ml-1">Payload (Data)</label>
                                            <textarea
                                                readOnly
                                                value={JSON.stringify(decoded.payload, null, 4)}
                                                className="w-full h-64 bg-surface/50 border border-border/50 rounded-xl p-4 text-primary font-mono text-sm resize-none shadow-inner opacity-90 focus:outline-none"
                                            />
                                        </div>

                                        {/* SIGNATURE */}
                                        <div className="flex flex-col gap-3">
                                            <label className="block text-sm font-medium text-accent uppercase tracking-wider ml-1">Signature</label>
                                            <div className="w-full bg-surface/50 border border-border/50 rounded-xl p-4 break-words text-tertiary font-mono text-sm shadow-inner opacity-90">
                                                {decoded.signature}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    )
}
