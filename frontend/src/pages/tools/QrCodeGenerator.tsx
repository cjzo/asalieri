import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '../../components/ui/button'
import { QrCode, Download, Image as ImageIcon } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'

export function QrCodeGenerator() {
    const [input, setInput] = useState('https://asalieri.com')
    const [fgColor, setFgColor] = useState('#ffffff')
    const [bgColor, setBgColor] = useState('#000000') // keeping background technically dark/transparent-ish based on theme, but SVG needs solid for download
    const qrRef = useRef<SVGSVGElement>(null)

    const handleDownload = () => {
        if (!qrRef.current) return

        // Serialize SVG
        const svgData = new XMLSerializer().serializeToString(qrRef.current)
        const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
        const url = URL.createObjectURL(blob)

        const link = document.createElement('a')
        link.href = url
        link.download = `qrcode-${Date.now()}.svg`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
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
                        <QrCode className="w-8 h-8" />
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-primary mb-4">
                        QR Generator
                    </h1>
                    <p className="text-lg text-secondary max-w-xl mx-auto font-medium">
                        Instantly create high-resolution QR codes from any text or URL.
                    </p>
                </motion.div>

                <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">

                    {/* Left Pane: Configuration (Controls Box) */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col gap-6 p-6 rounded-2xl border border-border/40 bg-surface/40 backdrop-blur-sm shadow-sm transition-all h-full hover:border-accent/30"
                    >
                        {/* Text Input */}
                        <div className="flex flex-col gap-3">
                            <label className="text-sm font-medium uppercase tracking-wider text-tertiary">
                                Content (URL or Text)
                            </label>
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                className="w-full h-32 bg-surface/50 border border-border/50 rounded-xl p-4 text-primary focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/50 transition-all resize-none shadow-inner"
                                placeholder="Enter text to encode..."
                            />
                        </div>

                        {/* Color Options */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-3">
                                <label className="text-sm font-medium uppercase tracking-wider text-tertiary">
                                    Foreground Color
                                </label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        value={fgColor}
                                        onChange={(e) => setFgColor(e.target.value)}
                                        className="w-12 h-12 rounded-xl cursor-pointer bg-transparent border-0 p-0"
                                    />
                                    <span className="font-mono text-sm text-secondary uppercase">{fgColor}</span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-3">
                                <label className="text-sm font-medium uppercase tracking-wider text-tertiary">
                                    Background Color
                                </label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        value={bgColor}
                                        onChange={(e) => setBgColor(e.target.value)}
                                        className="w-12 h-12 rounded-xl cursor-pointer bg-transparent border-0 p-0"
                                    />
                                    <span className="font-mono text-sm text-secondary uppercase">{bgColor}</span>
                                </div>
                            </div>
                        </div>

                    </motion.div>

                    {/* Right Pane: Live Preview & Action (Main Display Box) */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col p-8 rounded-2xl border border-border/50 bg-surface shadow-xl relative overflow-hidden min-h-[400px] h-full transition-all duration-300 hover:border-accent/40 hover:shadow-2xl"
                    >
                        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] pointer-events-none" />

                        <div className="relative z-10 flex flex-col items-center justify-center gap-6 w-full h-full">
                            <AnimatePresence mode="popLayout">
                                {input ? (
                                    <motion.div
                                        key="qr"
                                        initial={{ scale: 0.5, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.5, opacity: 0 }}
                                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                        className="p-4 bg-white rounded-2xl shadow-xl relative z-10" // Always keep a white padding for scanner readability if fg is dark
                                    >
                                        <QRCodeSVG
                                            value={input}
                                            size={256}
                                            fgColor={fgColor}
                                            bgColor="#ffffff" // the padding handles the visual bg, the code itself needs contrast
                                            level="H"
                                            includeMargin={false}
                                            ref={qrRef}
                                            className="rounded-lg"
                                            style={{ backgroundColor: bgColor }} // Apply bg color directly to SVG for download
                                        />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="empty"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="flex flex-col items-center justify-center text-tertiary gap-4 z-10"
                                    >
                                        <ImageIcon className="w-16 h-16 opacity-50" />
                                        <p className="font-medium">Enter text to generate QR code</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <motion.div className="w-full mt-auto pt-4 z-10" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <Button
                                    onClick={handleDownload}
                                    disabled={!input}
                                    className="w-full h-14 rounded-xl bg-accent hover:bg-accent/90 text-surface font-bold text-lg shadow-md hover:shadow-lg shadow-accent/20 hover:shadow-accent/40 border-none transition-all"
                                >
                                    <Download className="w-5 h-5 mr-2" />
                                    Download SVG
                                </Button>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
