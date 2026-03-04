import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
import { PenTool, Check, Copy } from 'lucide-react'

export function EmailSignatureGenerator() {
    const [data, setData] = useState({
        name: 'Charlie Settings',
        title: 'Software Engineer',
        company: 'Asalieri Inc.',
        phone: '+1 (555) 123-4567',
        email: 'charlie@example.com',
        website: 'www.example.com',
        linkedin: 'linkedin.com/in/charlie',
        twitter: '@charlie',
        github: 'github.com/charlie',
        color: '#0ea5e9', // Default Cyan
    })

    const [copiedHtml, setCopiedHtml] = useState(false)
    const [copiedText, setCopiedText] = useState(false)

    const previewRef = useRef<HTMLDivElement>(null)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const copyHtml = async () => {
        if (!previewRef.current) return
        try {
            const html = previewRef.current.innerHTML
            const blobHtml = new Blob([html], { type: 'text/html' })
            const blobText = new Blob([previewRef.current.innerText], { type: 'text/plain' })

            const item = new ClipboardItem({
                'text/html': blobHtml,
                'text/plain': blobText
            })

            await navigator.clipboard.write([item])
            setCopiedHtml(true)
            setTimeout(() => setCopiedHtml(false), 2000)
        } catch (err) {
            console.error('Failed to copy', err)
        }
    }

    const copyPlainText = async () => {
        if (!previewRef.current) return
        try {
            await navigator.clipboard.writeText(previewRef.current.innerText)
            setCopiedText(true)
            setTimeout(() => setCopiedText(false), 2000)
        } catch (err) {
            console.error('Failed to copy', err)
        }
    }

    return (
        <div className="w-full flex justify-center pb-24">
            <div className="w-full max-w-6xl flex flex-col items-center">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12 flex flex-col items-center"
                >
                    <div className="mb-6 inline-flex p-4 rounded-2xl bg-surface/50 border border-border/50 text-accent shadow-lg shadow-accent/10">
                        <PenTool className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-primary mb-4">
                        Email Signature
                    </h1>
                    <p className="text-lg text-secondary max-w-xl mx-auto">
                        Design a professional, robust email signature. Copy the rich HTML directly into your mail client.
                    </p>
                </motion.div>

                <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-5 flex flex-col gap-6"
                    >
                        <div className="p-6 rounded-2xl border border-border/40 bg-surface/40 backdrop-blur-sm space-y-6">
                            <h3 className="text-xl font-medium text-primary tracking-tight">Personal Info</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm text-secondary font-medium">Name</label>
                                    <Input name="name" value={data.name} onChange={handleChange} className="h-10 text-base" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-secondary font-medium">Title</label>
                                    <Input name="title" value={data.title} onChange={handleChange} className="h-10 text-base" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-secondary font-medium">Company</label>
                                <Input name="company" value={data.company} onChange={handleChange} className="h-10 text-base" />
                            </div>
                        </div>

                        <div className="p-6 rounded-2xl border border-border/40 bg-surface/40 backdrop-blur-sm space-y-6">
                            <h3 className="text-xl font-medium text-primary tracking-tight">Contact Link</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm text-secondary font-medium">Phone</label>
                                    <Input name="phone" value={data.phone} onChange={handleChange} className="h-10 text-base" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-secondary font-medium">Email</label>
                                    <Input name="email" value={data.email} onChange={handleChange} type="email" className="h-10 text-base" />
                                </div>
                                <div className="space-y-2 col-span-2">
                                    <label className="text-sm text-secondary font-medium">Website</label>
                                    <Input name="website" value={data.website} onChange={handleChange} className="h-10 text-base" />
                                </div>
                            </div>
                        </div>

                        <div className="p-6 rounded-2xl border border-border/40 bg-surface/40 backdrop-blur-sm space-y-6">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-medium text-primary tracking-tight">Socials & Style</h3>
                                <div className="flex items-center gap-3">
                                    <label className="text-sm text-secondary font-medium">Color</label>
                                    <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-border/50 shadow-sm cursor-pointer">
                                        <input
                                            type="color"
                                            name="color"
                                            value={data.color}
                                            onChange={handleChange}
                                            className="absolute inset-[-10px] w-12 h-12 cursor-pointer border-0 p-0"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm text-secondary font-medium">LinkedIn</label>
                                    <Input name="linkedin" value={data.linkedin} onChange={handleChange} className="h-10 text-base" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-secondary font-medium">Twitter</label>
                                    <Input name="twitter" value={data.twitter} onChange={handleChange} className="h-10 text-base" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-secondary font-medium">GitHub</label>
                                    <Input name="github" value={data.github} onChange={handleChange} className="h-10 text-base" />
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Preview */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-7 flex flex-col gap-6"
                    >
                        <div className="sticky top-12 p-8 rounded-2xl border border-border/50 bg-surface shadow-xl overflow-hidden group transition-all duration-300 hover:border-accent/40 hover:shadow-2xl">
                            <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] pointer-events-none" />

                            <div className="relative z-10 flex flex-col gap-8">
                                <div className="flex justify-between items-center pb-4 border-b border-border/30">
                                    <span className="text-sm font-medium text-tertiary uppercase tracking-widest">Live Preview</span>
                                    <div className="flex gap-2">
                                        <Button onClick={copyPlainText} className="bg-surface text-secondary hover:text-primary hover:bg-surface/80 text-xs h-8 px-3">
                                            {copiedText ? <Check className="w-3.5 h-3.5 mr-1.5 text-green-500" /> : <Copy className="w-3.5 h-3.5 mr-1.5" />}
                                            Copy Text
                                        </Button>
                                        <Button onClick={copyHtml} className="text-xs h-8 px-3 shadow-md shadow-accent/20">
                                            {copiedHtml ? <Check className="w-3.5 h-3.5 mr-1.5" /> : <Copy className="w-3.5 h-3.5 mr-1.5" />}
                                            Copy HTML
                                        </Button>
                                    </div>
                                </div>

                                {/* The Signature HTML Block */}
                                <div
                                    ref={previewRef}
                                    className="bg-transparent p-4 min-h-[200px]"
                                    style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                                >
                                    <table cellPadding="0" cellSpacing="0" style={{ borderCollapse: 'collapse', borderSpacing: 0, width: '100%', maxWidth: '500px' }}>
                                        <tbody>
                                            <tr>
                                                <td style={{ paddingRight: '20px', verticalAlign: 'top', borderRight: `2px solid ${data.color}` }}>
                                                    <h2 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: 'bold', color: '#1a1a1a', letterSpacing: '-0.2px' }}>
                                                        {data.name || 'Your Name'}
                                                    </h2>
                                                    <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#666666' }}>
                                                        {data.title || 'Your Title'}
                                                    </p>
                                                    <p style={{ margin: '0', fontSize: '14px', fontWeight: '600', color: data.color }}>
                                                        {data.company || 'Your Company'}
                                                    </p>
                                                </td>
                                                <td style={{ paddingLeft: '20px', verticalAlign: 'top' }}>
                                                    <table cellPadding="0" cellSpacing="0" style={{ borderCollapse: 'collapse', borderSpacing: 0, fontSize: '13px', color: '#666666' }}>
                                                        <tbody>
                                                            {data.phone && (
                                                                <tr>
                                                                    <td style={{ paddingBottom: '6px', whiteSpace: 'nowrap' }}>
                                                                        <span style={{ color: data.color, fontWeight: 'bold', marginRight: '6px' }}>P:</span>
                                                                        {data.phone}
                                                                    </td>
                                                                </tr>
                                                            )}
                                                            {data.email && (
                                                                <tr>
                                                                    <td style={{ paddingBottom: '6px', whiteSpace: 'nowrap' }}>
                                                                        <span style={{ color: data.color, fontWeight: 'bold', marginRight: '6px' }}>E:</span>
                                                                        <a href={`mailto:${data.email}`} style={{ color: '#666666', textDecoration: 'none' }}>{data.email}</a>
                                                                    </td>
                                                                </tr>
                                                            )}
                                                            {data.website && (
                                                                <tr>
                                                                    <td style={{ paddingBottom: '6px', whiteSpace: 'nowrap' }}>
                                                                        <span style={{ color: data.color, fontWeight: 'bold', marginRight: '6px' }}>W:</span>
                                                                        <a href={`https://${data.website.replace(/^https?:\/\//, '')}`} style={{ color: '#666666', textDecoration: 'none' }}>{data.website}</a>
                                                                    </td>
                                                                </tr>
                                                            )}
                                                        </tbody>
                                                    </table>

                                                    {/* Socials Row */}
                                                    <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #eeeeee' }}>
                                                        <table cellPadding="0" cellSpacing="0" style={{ borderCollapse: 'collapse', borderSpacing: 0, fontSize: '13px' }}>
                                                            <tbody>
                                                                <tr>
                                                                    {data.linkedin && (
                                                                        <td style={{ paddingRight: '12px' }}>
                                                                            <a href={`https://${data.linkedin.replace(/^https?:\/\//, '')}`} style={{ color: data.color, textDecoration: 'none', fontWeight: '500' }}>LinkedIn</a>
                                                                        </td>
                                                                    )}
                                                                    {data.twitter && (
                                                                        <td style={{ paddingRight: '12px' }}>
                                                                            <a href={`https://twitter.com/${data.twitter.replace(/^@/, '')}`} style={{ color: data.color, textDecoration: 'none', fontWeight: '500' }}>Twitter</a>
                                                                        </td>
                                                                    )}
                                                                    {data.github && (
                                                                        <td>
                                                                            <a href={`https://${data.github.replace(/^https?:\/\//, '')}`} style={{ color: data.color, textDecoration: 'none', fontWeight: '500' }}>GitHub</a>
                                                                        </td>
                                                                    )}
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
