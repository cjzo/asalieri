import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '../../components/ui/button'
import { MonitorPlay, Trash2, ArrowRightLeft } from 'lucide-react'

export function HtmlPreview() {
    const [html, setHtml] = useState('<div class="box">\\n  <h1>Hello Asalieri!</h1>\\n  <p>Start editing to see magic happen.</p>\\n</div>')
    const [css, setCss] = useState('.box {\\n  padding: 2rem;\\n  background: #f0f0f0;\\n  border-radius: 1rem;\\n  text-align: center;\\n  font-family: system-ui;\\n}\\nh1 {\\n  color: #D95C3C;\\n}')
    const [js, setJs] = useState('console.log("HTML Preview initialized.");')

    const [srcDoc, setSrcDoc] = useState('')
    const [activeTab, setActiveTab] = useState<'html' | 'css' | 'js'>('html')
    const [isFullscreen, setIsFullscreen] = useState(false)

    useEffect(() => {
        const timeout = setTimeout(() => {
            setSrcDoc(`
                <html>
                    <style>${css}</style>
                    <body>${html}</body>
                    <script>${js}</script>
                </html>
            `)
        }, 500)
        return () => clearTimeout(timeout)
    }, [html, css, js])

    const getActiveContent = () => {
        if (activeTab === 'html') return { value: html, setter: setHtml, placeholder: '<!-- HTML -->' }
        if (activeTab === 'css') return { value: css, setter: setCss, placeholder: '/* CSS */' }
        return { value: js, setter: setJs, placeholder: '// JavaScript' }
    }

    const { value, setter, placeholder } = getActiveContent()

    return (
        <div className="w-full flex justify-center pb-24 min-h-[80vh]">
            <div className={`w-full max-w-7xl flex flex-col items-center px-4 transition-all duration-300 ${isFullscreen ? 'fixed inset-0 z-50 bg-black/80 backdrop-blur-xl max-w-none pt-4 pb-4 px-8' : ''}`}>

                {!isFullscreen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                        className="text-center mb-12 flex flex-col items-center relative"
                    >
                        <div className="mb-6 inline-flex p-4 rounded-2xl bg-surface/50 border border-border/50 text-accent shadow-lg shadow-accent/10">
                            <MonitorPlay className="w-8 h-8" />
                        </div>

                        <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-primary mb-4">
                            HTML / JS / CSS Preview
                        </h1>
                        <p className="text-lg text-secondary max-w-xl mx-auto font-medium">
                            Live code playground. Write markup, styling, and logic in real-time.
                        </p>
                    </motion.div>
                )}

                <div className={`w-full flex flex-col lg:flex-row gap-6 relative items-stretch ${isFullscreen ? 'h-[90vh]' : ''}`}>

                    {/* Left Pane: Code Editors */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex-1 flex flex-col h-[600px] lg:h-auto rounded-3xl border border-border/40 bg-surface/40 backdrop-blur-sm shadow-sm transition-all hover:border-accent/40 overflow-hidden"
                    >
                        {/* Editor Tabs */}
                        <div className="flex border-b border-border/30 bg-surface/20">
                            {[
                                { id: 'html', label: 'HTML' },
                                { id: 'css', label: 'CSS' },
                                { id: 'js', label: 'JS' }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as 'html' | 'css' | 'js')}
                                    className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider transition-all ${activeTab === tab.id
                                            ? 'bg-accent/10 text-accent border-b-2 border-accent'
                                            : 'text-tertiary hover:bg-surface/50 hover:text-secondary'
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Editor Toolbar */}
                        <div className="px-4 py-2 border-b border-border/30 bg-surface/10 flex justify-between items-center">
                            <span className="text-xs font-mono text-secondary px-2 py-1 bg-surface border border-border/30 rounded">
                                index.{activeTab}
                            </span>
                            <Button
                                onClick={() => setter('')}
                                disabled={!value}
                                className="h-7 text-xs !bg-transparent !text-tertiary hover:!text-red-500 hover:!bg-red-500/10 !shadow-none !px-2"
                            >
                                <Trash2 className="w-3.5 h-3.5 mr-1" /> Clear File
                            </Button>
                        </div>

                        {/* Editor Textarea */}
                        <textarea
                            value={value}
                            onChange={(e) => setter(e.target.value)}
                            placeholder={placeholder}
                            className="w-full flex-grow p-5 bg-[#0d0d0d] text-[#e0e0e0] focus:outline-none transition-all resize-none shadow-inner font-mono text-[15px] leading-relaxed custom-scrollbar"
                            spellCheck="false"
                        />
                    </motion.div>

                    {/* Right Pane: Iframe Preview */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex-1 flex flex-col h-[600px] lg:h-auto rounded-3xl border border-border/50 bg-white shadow-xl relative overflow-hidden transition-all hover:border-accent/40"
                    >
                        <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200 bg-gray-50/80 backdrop-blur-sm absolute top-0 inset-x-0 z-10">
                            <label className="text-sm font-bold uppercase tracking-wider text-gray-700 ml-2 flex items-center">
                                <MonitorPlay className="w-4 h-4 mr-2" /> Live Preview
                            </label>
                            <Button
                                onClick={() => setIsFullscreen(!isFullscreen)}
                                className="h-8 px-3 shadow-sm border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 text-xs"
                            >
                                <ArrowRightLeft className="w-3.5 h-3.5 mr-1.5" />
                                {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                            </Button>
                        </div>

                        <div className="flex-grow pt-14 bg-white">
                            <iframe
                                srcDoc={srcDoc}
                                title="output"
                                sandbox="allow-scripts allow-modals"
                                frameBorder="0"
                                width="100%"
                                height="100%"
                                className="w-full h-full"
                            />
                        </div>
                    </motion.div>

                </div>
            </div>
        </div>
    )
}
