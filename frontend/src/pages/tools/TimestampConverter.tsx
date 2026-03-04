import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '../../components/ui/button'
import { Clock, Copy, Check, RefreshCw } from 'lucide-react'

export function TimestampConverter() {
    const [currentTime, setCurrentTime] = useState(Date.now())
    const [inputTimestamp, setInputTimestamp] = useState<string>('')
    const [inputDate, setInputDate] = useState<string>('')

    const [parsedFromTimestamp, setParsedFromTimestamp] = useState<Date | null>(null)
    const [parsedFromDate, setParsedFromDate] = useState<number | null>(null)

    const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({
        currentSec: false, currentMs: false, tsResult: false, dateResult: false
    })

    // Live clock update
    useEffect(() => {
        const interval = setInterval(() => setCurrentTime(Date.now()), 1000)
        return () => clearInterval(interval)
    }, [])

    // Handle string timestamp input
    useEffect(() => {
        if (!inputTimestamp.trim()) {
            setParsedFromTimestamp(null)
            return
        }

        const num = Number(inputTimestamp.trim())
        if (isNaN(num)) {
            setParsedFromTimestamp(null)
            return
        }

        // Auto-detect seconds vs milliseconds (rough heuristic)
        // If it's 10 digits or less, likely seconds. If >10, likely ms.
        const isSeconds = num < 100000000000
        const dateObj = new Date(isSeconds ? num * 1000 : num)

        if (isNaN(dateObj.getTime())) {
            setParsedFromTimestamp(null)
        } else {
            setParsedFromTimestamp(dateObj)
        }
    }, [inputTimestamp])

    // Handle date string input
    useEffect(() => {
        if (!inputDate.trim()) {
            setParsedFromDate(null)
            return
        }

        const dateObj = new Date(inputDate)
        if (isNaN(dateObj.getTime())) {
            setParsedFromDate(null)
        } else {
            setParsedFromDate(dateObj.getTime())
        }
    }, [inputDate])

    const handleCopy = async (id: string, value: string | number) => {
        if (!value) return
        await navigator.clipboard.writeText(value.toString())
        setCopiedStates(prev => ({ ...prev, [id]: true }))
        setTimeout(() => setCopiedStates(prev => ({ ...prev, [id]: false })), 2000)
    }

    const setInputToNow = (type: 'timestamp' | 'date') => {
        const now = new Date()
        if (type === 'timestamp') {
            setInputTimestamp(Math.floor(now.getTime() / 1000).toString())
        } else {
            const pad = (n: number) => n.toString().padStart(2, '0')
            // YYYY-MM-DDTHH:mm
            const formatted = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`
            setInputDate(formatted)
        }
    }

    const formatDate = (d: Date | null) => {
        if (!d) return { utc: 'Invalid Date', local: 'Invalid Date', iso: 'Invalid Date' }
        return {
            utc: d.toUTCString(),
            local: d.toString(),
            iso: d.toISOString()
        }
    }

    const tsFormats = formatDate(parsedFromTimestamp)

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
                        <Clock className="w-8 h-8" />
                    </div>

                    <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-primary mb-4">
                        Timestamp Converter
                    </h1>
                    <p className="text-lg text-secondary max-w-xl mx-auto font-medium">
                        Convert Unix timestamps to human-readable dates and vice versa.
                    </p>
                </motion.div>

                <div className="w-full flex flex-col gap-8">

                    {/* Current Epoch Time Banner */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full p-6 rounded-2xl border border-accent/20 bg-accent/5 backdrop-blur-sm shadow-sm flex flex-col md:flex-row items-center justify-between gap-6"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center animate-pulse">
                                <Clock className="w-6 h-6 text-accent" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold uppercase tracking-wider text-accent mb-1">Current Epoch Time</h3>
                                <p className="text-secondary text-sm font-medium">{new Date(currentTime).toUTCString()}</p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex items-center gap-2 bg-surface p-2 rounded-xl border border-border/50">
                                <span className="text-sm text-tertiary font-bold uppercase tracking-widest px-2">SEC</span>
                                <span className="font-mono text-primary font-medium">{Math.floor(currentTime / 1000)}</span>
                                <Button
                                    onClick={() => handleCopy('currentSec', Math.floor(currentTime / 1000))}
                                    className="h-8 w-8 p-0 ml-2"
                                >
                                    {copiedStates.currentSec ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                                </Button>
                            </div>
                            <div className="flex items-center gap-2 bg-surface p-2 rounded-xl border border-border/50">
                                <span className="text-sm text-tertiary font-bold uppercase tracking-widest px-2">MS</span>
                                <span className="font-mono text-primary font-medium">{currentTime}</span>
                                <Button
                                    onClick={() => handleCopy('currentMs', currentTime)}
                                    className="h-8 w-8 p-0 ml-2"
                                >
                                    {copiedStates.currentMs ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                                </Button>
                            </div>
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">

                        {/* Timestamp to Date */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex flex-col h-full rounded-2xl border border-border/40 bg-surface/40 backdrop-blur-sm shadow-sm transition-all hover:border-accent/30 overflow-hidden"
                        >
                            <div className="p-6 border-b border-border/30 bg-surface/20 flex flex-col gap-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-primary">Timestamp to Date</h3>
                                    <Button
                                        onClick={() => setInputToNow('timestamp')}
                                        className="h-8 text-xs bg-surface border border-border/50 hover:bg-accent/10 hover:text-accent shadow-sm"
                                    >
                                        <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Use Now
                                    </Button>
                                </div>
                                <input
                                    type="text"
                                    value={inputTimestamp}
                                    onChange={(e) => setInputTimestamp(e.target.value)}
                                    placeholder="Enter epoch timestamp (e.g. 1714567890)"
                                    className="w-full h-14 bg-transparent border border-border/50 rounded-xl px-4 text-primary font-mono text-lg focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/50 transition-all shadow-inner placeholder:text-tertiary/50"
                                />
                            </div>

                            <div className="p-6 flex-grow flex flex-col justify-center bg-surface gap-4">
                                {parsedFromTimestamp ? (
                                    <>
                                        <div className="flex flex-col gap-1 p-4 rounded-xl border border-border/30 bg-surface/50">
                                            <span className="text-xs font-bold text-tertiary uppercase tracking-wider">GMT / UTC</span>
                                            <div className="flex justify-between items-center">
                                                <span className="text-primary font-medium">{tsFormats.utc}</span>
                                                <Button onClick={() => handleCopy('ts_utc', tsFormats.utc)} className="h-8 w-8 p-0 bg-transparent shadow-none hover:bg-surface border border-transparent hover:border-border/50"><Copy className="w-4 h-4 text-secondary" /></Button>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-1 p-4 rounded-xl border border-border/30 bg-surface/50">
                                            <span className="text-xs font-bold text-tertiary uppercase tracking-wider">Local Time</span>
                                            <div className="flex justify-between items-center">
                                                <span className="text-primary font-medium">{tsFormats.local}</span>
                                                <Button onClick={() => handleCopy('ts_local', tsFormats.local)} className="h-8 w-8 p-0 bg-transparent shadow-none hover:bg-surface border border-transparent hover:border-border/50"><Copy className="w-4 h-4 text-secondary" /></Button>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-1 p-4 rounded-xl border border-border/30 bg-surface/50">
                                            <span className="text-xs font-bold text-tertiary uppercase tracking-wider">ISO 8601</span>
                                            <div className="flex justify-between items-center">
                                                <span className="text-primary font-mono text-sm break-all">{tsFormats.iso}</span>
                                                <Button onClick={() => handleCopy('ts_iso', tsFormats.iso)} className="h-8 w-8 p-0 bg-transparent shadow-none hover:bg-surface border border-transparent hover:border-border/50"><Copy className="w-4 h-4 text-secondary" /></Button>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center justify-center text-tertiary/50 py-10">
                                        <Clock className="w-12 h-12 mb-4 opacity-50" />
                                        <span className="font-medium tracking-wide">Enter a valid timestamp above</span>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        {/* Date to Timestamp */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex flex-col h-full rounded-2xl border border-border/40 bg-surface/40 backdrop-blur-sm shadow-sm transition-all hover:border-accent/30 overflow-hidden"
                        >
                            <div className="p-6 border-b border-border/30 bg-surface/20 flex flex-col gap-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-primary">Date to Timestamp</h3>
                                    <Button
                                        onClick={() => setInputToNow('date')}
                                        className="h-8 text-xs bg-surface border border-border/50 hover:bg-accent/10 hover:text-accent shadow-sm"
                                    >
                                        <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Use Now
                                    </Button>
                                </div>
                                <input
                                    type="datetime-local"
                                    step="1"
                                    value={inputDate}
                                    onChange={(e) => setInputDate(e.target.value)}
                                    className="w-full h-14 bg-transparent border border-border/50 rounded-xl px-4 text-primary font-mono text-lg focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/50 transition-all shadow-inner [color-scheme:dark]"
                                />
                            </div>

                            <div className="p-6 flex-grow flex flex-col justify-center bg-surface gap-4">
                                {parsedFromDate ? (
                                    <>
                                        <div className="flex flex-col gap-1 p-5 rounded-xl border border-border/30 bg-surface/50">
                                            <span className="text-xs font-bold text-tertiary uppercase tracking-wider">Seconds</span>
                                            <div className="flex justify-between items-center mt-2">
                                                <span className="text-2xl font-mono text-primary font-medium">{Math.floor(parsedFromDate / 1000)}</span>
                                                <Button onClick={() => handleCopy('date_sec', Math.floor(parsedFromDate / 1000))} className="h-10 w-10 p-0 bg-surface shadow-sm border border-border/50 hover:border-accent/50 hover:text-accent">
                                                    {copiedStates.date_sec ? <Check className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5" />}
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-1 p-5 rounded-xl border border-border/30 bg-surface/50">
                                            <span className="text-xs font-bold text-tertiary uppercase tracking-wider">Milliseconds</span>
                                            <div className="flex justify-between items-center mt-2">
                                                <span className="text-2xl font-mono text-primary font-medium">{parsedFromDate}</span>
                                                <Button onClick={() => handleCopy('date_ms', parsedFromDate)} className="h-10 w-10 p-0 bg-surface shadow-sm border border-border/50 hover:border-accent/50 hover:text-accent">
                                                    {copiedStates.date_ms ? <Check className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5" />}
                                                </Button>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center justify-center text-tertiary/50 py-10">
                                        <Clock className="w-12 h-12 mb-4 opacity-50" />
                                        <span className="font-medium tracking-wide">Select a date & time above</span>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                    </div>
                </div>
            </div>
        </div>
    )
}
