import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Button } from '../../components/ui/button'
import { Image as ImageIcon, UploadCloud, Copy, Check, Trash2, FileOutput } from 'lucide-react'

export function ImageToBase64() {
    const [base64, setBase64] = useState('')
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [imageInfo, setImageInfo] = useState<{ name: string, size: string, dimensions: string } | null>(null)
    const [isDragging, setIsDragging] = useState(false)
    const [copied, setCopied] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFile = (file: File) => {
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file.')
            return
        }

        const reader = new FileReader()
        reader.onload = (e) => {
            const result = e.target?.result as string
            setBase64(result)
            setImagePreview(result)

            // Get dimensions
            const img = new Image()
            img.onload = () => {
                setImageInfo({
                    name: file.name,
                    size: (file.size / 1024).toFixed(2) + ' KB',
                    dimensions: `${img.width} x ${img.height} px`
                })
            }
            img.src = result
        }
        reader.readAsDataURL(file)
    }

    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const onDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
    }

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0])
        }
    }

    const clearAll = () => {
        setBase64('')
        setImagePreview(null)
        setImageInfo(null)
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    const handleCopy = async () => {
        if (!base64) return
        await navigator.clipboard.writeText(base64)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
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
                        <ImageIcon className="w-8 h-8" />
                    </div>

                    <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-primary mb-4">
                        Image to Base64
                    </h1>
                    <p className="text-lg text-secondary max-w-xl mx-auto font-medium">
                        Convert images to Base64 data strings for inline CSS/HTML embedding. All processing is strictly done locally.
                    </p>
                </motion.div>

                <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">

                    {/* Left Pane: Upload Area & Preview */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col gap-6"
                    >
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            className="hidden"
                            onChange={(e) => e.target.files && handleFile(e.target.files[0])}
                        />

                        {/* Dropzone */}
                        {!imagePreview && (
                            <div
                                onDragOver={onDragOver}
                                onDragLeave={onDragLeave}
                                onDrop={onDrop}
                                onClick={() => fileInputRef.current?.click()}
                                className={`w-full h-80 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-300 group
                                    ${isDragging ? 'border-accent bg-accent/5 scale-[1.02] shadow-xl shadow-accent/10' : 'border-border/50 hover:border-accent/50 hover:bg-surface/50'}
                                `}
                            >
                                <div className="p-4 rounded-full bg-surface mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300 relative">
                                    <div className="absolute inset-0 bg-accent/20 rounded-full animate-ping opacity-0 group-hover:opacity-100" />
                                    <UploadCloud className={`w-8 h-8 transition-colors ${isDragging ? 'text-accent' : 'text-secondary group-hover:text-accent'}`} />
                                </div>
                                <h3 className="text-xl font-medium text-primary mb-2">Drag & Drop Image</h3>
                                <p className="text-tertiary text-sm">Or click to browse files (JPEG, PNG, WebP, SVG, GIF)</p>
                            </div>
                        )}

                        {/* Image Preview Area */}
                        {imagePreview && (
                            <div className="w-full h-80 rounded-3xl border border-border/50 p-4 bg-surface/40 backdrop-blur-sm shadow-sm relative overflow-hidden group">
                                <div className="absolute inset-0 p-4 pb-14 flex items-center justify-center bg-grid-black/[0.05] dark:bg-grid-white/[0.05]">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="max-h-full max-w-full object-contain rounded-xl shadow-md border border-border/30"
                                    />
                                </div>

                                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex justify-between items-end pb-4 pt-10">
                                    <div className="flex flex-col text-white/90">
                                        <span className="font-medium text-sm truncate max-w-[200px]" title={imageInfo?.name}>{imageInfo?.name}</span>
                                        <span className="text-xs opacity-70 font-mono mt-0.5">{imageInfo?.dimensions} • {imageInfo?.size}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click() }}
                                            className="h-8 text-xs bg-white/20 hover:bg-white/30 text-white shadow-sm border border-white/20 backdrop-blur-sm"
                                        >
                                            <UploadCloud className="w-3.5 h-3.5 mr-1.5" /> Replace
                                        </Button>
                                        <Button
                                            onClick={(e) => { e.stopPropagation(); clearAll() }}
                                            className="h-8 w-8 p-0 bg-red-500/20 hover:bg-red-500/40 text-red-200 shadow-sm border border-red-500/30 backdrop-blur-sm"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>

                    {/* Right Pane: Output */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col h-full rounded-3xl border border-border/40 bg-surface/40 backdrop-blur-sm shadow-sm transition-all hover:border-accent/30 overflow-hidden"
                    >
                        <div className="p-4 border-b border-border/30 bg-surface/20 flex justify-between items-center">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-primary ml-2 flex items-center">
                                <FileOutput className="w-4 h-4 mr-2 text-accent" /> Base64 Output
                            </h3>
                            <Button
                                onClick={handleCopy}
                                disabled={!base64}
                                className="h-9 px-4 shadow-md shadow-accent/20"
                            >
                                {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                                {copied ? 'Copied' : 'Copy Data'}
                            </Button>
                        </div>

                        <div className="relative flex-grow p-4 h-[300px]">
                            {base64 ? (
                                <textarea
                                    value={base64}
                                    readOnly
                                    className="w-full h-full bg-transparent text-secondary focus:outline-none transition-all resize-none font-mono text-sm leading-relaxed custom-scrollbar break-all"
                                    spellCheck="false"
                                />
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-tertiary opacity-50">
                                    <FileOutput className="w-12 h-12 mb-4" />
                                    <p className="font-medium">Base64 string will appear here</p>
                                </div>
                            )}
                        </div>

                        {base64 && (
                            <div className="p-3 border-t border-border/30 bg-surface/30 flex justify-between items-center px-6">
                                <span className="text-xs font-bold uppercase tracking-wider text-tertiary">String Length</span>
                                <span className="font-mono text-xs text-primary bg-surface border border-border/50 px-2 py-1 rounded-md">
                                    {(base64.length).toLocaleString()} chars
                                </span>
                            </div>
                        )}
                    </motion.div>

                </div>
            </div>
        </div>
    )
}
