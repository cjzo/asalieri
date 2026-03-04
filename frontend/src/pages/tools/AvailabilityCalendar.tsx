import * as React from 'react'
import { useState, useRef, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar as CalendarIcon, Download, RotateCcw, MousePointer2 } from 'lucide-react'
import { Button } from '../../components/ui/button'
import html2canvas from 'html2canvas'

// Month data utilities
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

type StatusDef = {
    id: string
    label: string
    color: string // Tailwind or custom hex for CSS variables
}

const DEFAULT_STATUSES: StatusDef[] = [
    { id: 'confirmed', label: 'Confirmed', color: '#10b981' }, // Emerald
    { id: 'maybe', label: 'Maybe', color: '#f59e0b' }, // Amber
    { id: 'unavailable', label: 'Unavailable', color: '#ef4444' } // Red
]

export function AvailabilityCalendar() {
    const [year, setYear] = useState<number>(new Date().getFullYear())
    const [month, setMonth] = useState<number>(new Date().getMonth()) // 0-indexed

    const [statuses, setStatuses] = useState<StatusDef[]>(DEFAULT_STATUSES)
    const [activeStatusId, setActiveStatusId] = useState<string>(DEFAULT_STATUSES[0].id)

    const [highlights, setHighlights] = useState<Record<string, string>>({}) // { '2023-10-15': 'confirmed' }
    const [isDragging, setIsDragging] = useState(false)
    const [dragAction, setDragAction] = useState<'paint' | 'erase' | null>(null)

    const calendarRef = useRef<HTMLDivElement>(null)

    // Calendar Engine
    const daysInMonth = useMemo(() => new Date(year, month + 1, 0).getDate(), [year, month])
    const firstDayOfMonth = useMemo(() => new Date(year, month, 1).getDay(), [year, month]) // 0-6 (Sun-Sat)

    const calendarCells = useMemo(() => {
        const cells = []

        // Empty prefix cells
        for (let i = 0; i < firstDayOfMonth; i++) {
            cells.push({ type: 'empty', id: `empty-${i}` })
        }

        // Actual days
        for (let d = 1; d <= daysInMonth; d++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
            cells.push({ type: 'day', date: d, dateStr })
        }

        // Empty suffix cells (to complete rows of 7)
        const trailingCells = (7 - (cells.length % 7)) % 7
        for (let i = 0; i < trailingCells; i++) {
            cells.push({ type: 'empty', id: `trailing-${i}` })
        }

        return cells
    }, [year, month, daysInMonth, firstDayOfMonth])

    // Handlers
    const handlePrevMonth = () => {
        if (month === 0) {
            setMonth(11)
            setYear(y => y - 1)
        } else {
            setMonth(m => m - 1)
        }
        setHighlights({}) // Clear highlights on month change? Optional, let's keep them for simplicity or clear them if user wants explicit month export
    }

    const handleNextMonth = () => {
        if (month === 11) {
            setMonth(0)
            setYear(y => y + 1)
        } else {
            setMonth(m => m + 1)
        }
    }

    const handleClear = () => {
        setHighlights({})
    }

    // Paint handlers
    const paintDate = (dateStr: string, forceAction?: 'paint' | 'erase'): 'paint' | 'erase' => {
        let actionTaken: 'paint' | 'erase' = 'paint'

        setHighlights(prev => {
            const isCurrentlyActive = prev[dateStr] === activeStatusId
            const shouldErase = forceAction === 'erase' || (!forceAction && isCurrentlyActive)

            if (shouldErase) {
                actionTaken = 'erase'
                const next = { ...prev }
                delete next[dateStr]
                return next
            }

            actionTaken = 'paint'
            return { ...prev, [dateStr]: activeStatusId }
        })

        return actionTaken
    }

    const handlePointerDown = (dateStr?: string) => {
        if (!dateStr) return
        setIsDragging(true)
        const action = paintDate(dateStr)
        setDragAction(action)
    }

    const handlePointerEnter = (dateStr?: string) => {
        if (!isDragging || !dateStr || !dragAction) return
        paintDate(dateStr, dragAction)
    }

    useEffect(() => {
        const handleGlobalPointerUp = () => {
            setIsDragging(false)
            setDragAction(null)
        }
        window.addEventListener('pointerup', handleGlobalPointerUp)
        return () => window.removeEventListener('pointerup', handleGlobalPointerUp)
    }, [])

    // Export functionality
    const handleExport = async () => {
        if (!calendarRef.current) return
        try {
            const canvas = await html2canvas(calendarRef.current, {
                scale: 2, // High resolution
                backgroundColor: null, // Transparent background if rounded
                logging: false
            })

            const image = canvas.toDataURL("image/png")
            const link = document.createElement('a')
            link.href = image
            link.download = `availability-${year}-${String(month + 1).padStart(2, '0')}.png`
            link.click()
        } catch (err) {
            console.error("Export failed:", err)
        }
    }

    const handleStatusColorChange = (id: string, color: string) => {
        setStatuses(prev => prev.map(s => s.id === id ? { ...s, color } : s))
    }

    const handleStatusLabelChange = (id: string, label: string) => {
        setStatuses(prev => prev.map(s => s.id === id ? { ...s, label } : s))
    }

    // CSS variables for current statuses
    const cssVars = React.useMemo(() => {
        const vars: Record<string, string> = {}
        statuses.forEach(s => {
            vars[`--cal-${s.id}`] = s.color
        })
        return vars as React.CSSProperties
    }, [statuses])

    return (
        <div className="w-full flex justify-center pb-24 h-full min-h-[80vh]">
            <div className="w-full max-w-6xl flex flex-col items-center">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-10 flex flex-col items-center"
                >
                    <div className="mb-6 inline-flex p-4 rounded-2xl bg-surface/50 border border-border/50 text-accent shadow-lg shadow-accent/10">
                        <CalendarIcon className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-primary mb-4">
                        Availability Calendar
                    </h1>
                    <p className="text-lg text-secondary max-w-xl mx-auto">
                        Design a fluid single-month availability snapshot. Drag over dates to highlight, customize the legend, and export as PNG.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8"
                    style={cssVars}
                >
                    {/* Controls Sidebar */}
                    <div className="lg:col-span-4 flex flex-col gap-6">

                        {/* Status Palette */}
                        <div className="p-6 rounded-2xl border border-border/40 bg-surface/40 backdrop-blur-sm space-y-6">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-medium text-primary tracking-tight">Status Legend</h3>
                                <MousePointer2 className="w-5 h-5 text-tertiary" />
                            </div>

                            <div className="space-y-3">
                                {statuses.map(status => (
                                    <div
                                        key={status.id}
                                        className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${activeStatusId === status.id ? 'border-accent/40 bg-accent/5 shadow-md shadow-accent/5' : 'border-border/40 bg-surface/30 opacity-70 hover:opacity-100'}`}
                                        onClick={(e) => {
                                            if ((e.target as HTMLElement).tagName !== 'INPUT') {
                                                setActiveStatusId(status.id)
                                            }
                                        }}
                                    >
                                        <div className="relative w-6 h-6 rounded-full overflow-hidden shadow-sm shrink-0" style={{ backgroundColor: status.color }}>
                                            <input
                                                type="color"
                                                value={status.color}
                                                onChange={(e) => handleStatusColorChange(status.id, e.target.value)}
                                                className="absolute inset-[-10px] w-12 h-12 cursor-pointer border-0 p-0 opacity-0"
                                            />
                                        </div>
                                        <input
                                            type="text"
                                            value={status.label}
                                            onChange={(e) => handleStatusLabelChange(status.id, e.target.value)}
                                            className="text-sm font-medium text-primary bg-transparent focus:outline-none w-full border-b border-transparent focus:border-accent/30 pointer-events-auto"
                                            placeholder="Status name"
                                        />
                                        <div className="w-4 h-4 rounded-full border border-border/80 flex items-center justify-center shrink-0">
                                            {activeStatusId === status.id && <div className="w-2 h-2 rounded-full bg-accent" />}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-2 text-xs text-secondary mt-4 flex gap-1 items-start">
                                <span className="text-accent text-base leading-none">•</span>
                                <span>Select a status above, then click or click-and-drag across the calendar to paint. Click the color circle to customize.</span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <Button onClick={handleClear} className="flex-1 bg-surface text-secondary hover:text-primary border border-border/50 h-12 rounded-xl">
                                <RotateCcw className="w-4 h-4 mr-2" />
                                Clear Dates
                            </Button>
                            <Button onClick={handleExport} className="flex-1 h-12 rounded-xl shadow-lg shadow-accent/20">
                                <Download className="w-4 h-4 mr-2" />
                                Export PNG
                            </Button>
                        </div>

                    </div>

                    {/* Calendar View */}
                    <div className="lg:col-span-8 flex flex-col justify-center items-center select-none pt-4 lg:pt-0">

                        {/* Downloadable Wrapper */}
                        <div
                            ref={calendarRef}
                            className="w-full max-w-[550px] bg-surface p-8 rounded-3xl shadow-xl border border-border/50 relative overflow-hidden transition-all duration-300 hover:border-accent/40 hover:shadow-2xl"
                            style={{ paddingBottom: '2.5rem' }}
                        >
                            <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] pointer-events-none" />

                            {/* Header */}
                            <div className="relative z-10 flex justify-between items-center mb-8">
                                <button
                                    onClick={handlePrevMonth}
                                    className="w-8 h-8 rounded-full flex items-center justify-center text-secondary hover:bg-surface transition-colors"
                                    data-html2canvas-ignore
                                >
                                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.84182 3.13514C9.04327 3.32401 9.05348 3.64042 8.86462 3.84188L5.43521 7.49991L8.86462 11.1579C9.05348 11.3594 9.04327 11.6758 8.84182 11.8647C8.64036 12.0535 8.32394 12.0433 8.13508 11.8419L4.38508 7.84188C4.20477 7.64955 4.20477 7.35027 4.38508 7.15794L8.13508 3.15794C8.32394 2.95648 8.64036 2.94628 8.84182 3.13514Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                                </button>
                                <div className="text-2xl font-semibold tracking-tight text-primary tabular-nums">
                                    {MONTHS[month]} {year}
                                </div>
                                <button
                                    onClick={handleNextMonth}
                                    className="w-8 h-8 rounded-full flex items-center justify-center text-secondary hover:bg-surface transition-colors"
                                    data-html2canvas-ignore
                                >
                                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.1584 3.13508C6.35985 2.94621 6.67627 2.95642 6.86514 3.15788L10.6151 7.15788C10.7954 7.3502 10.7954 7.64949 10.6151 7.84182L6.86514 11.8418C6.67627 12.0433 6.35985 12.0535 6.1584 11.8646C5.95694 11.6757 5.94673 11.3593 6.1356 11.1579L9.565 7.49985L6.1356 3.84182C5.94673 3.64036 5.95694 3.32394 6.1584 3.13508Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                                </button>
                            </div>

                            {/* Grid */}
                            <div className="relative z-10 grid grid-cols-7 gap-y-4 gap-x-2">
                                {/* Days Label Header */}
                                {DAYS_OF_WEEK.map(day => (
                                    <div key={day} className="text-center text-xs font-semibold uppercase tracking-wider text-tertiary mb-2">
                                        {day}
                                    </div>
                                ))}

                                {/* Cells */}
                                {calendarCells.map((cell) => {
                                    if (cell.type === 'empty') {
                                        return <div key={cell.id} className="aspect-square opacity-0 relative" />
                                    }

                                    const statusId = highlights[cell.dateStr!]
                                    const status = statusId ? statuses.find(s => s.id === statusId) : null
                                    const bgColor = status ? `var(--cal-${status.id})` : 'transparent'
                                    const textColor = status ? '#ffffff' : 'var(--foreground)'

                                    return (
                                        <div
                                            key={cell.dateStr}
                                            className="aspect-square relative flex items-center justify-center group cursor-pointer"
                                            style={{ touchAction: 'none' }}
                                            onPointerDown={() => handlePointerDown(cell.dateStr)}
                                            onPointerEnter={() => handlePointerEnter(cell.dateStr)}
                                        >
                                            {/* Background Highlight Bubble */}
                                            <motion.div
                                                initial={false}
                                                animate={{
                                                    scale: status ? 1 : 0.9,
                                                    opacity: status ? 1 : 0,
                                                    backgroundColor: bgColor
                                                }}
                                                transition={{ duration: 0.2 }}
                                                className="absolute inset-1 rounded-xl shadow-sm"
                                                style={{ originX: 0.5, originY: 0.5 }}
                                            />

                                            {/* Hover Overlay */}
                                            {!status && (
                                                <div className="absolute inset-1 rounded-xl opacity-0 group-hover:opacity-100 bg-accent/20 transition-all duration-300" />
                                            )}

                                            <span className="relative z-10 text-[15px] font-medium transition-colors" style={{ color: textColor }}>
                                                {cell.date}
                                            </span>
                                        </div>
                                    )
                                })}
                            </div>

                            {/* Printed Legend for Export */}
                            <div className="relative z-10 mt-10 pt-6 border-t border-border/20 flex flex-wrap justify-center gap-6">
                                {statuses.map(s => (
                                    <div key={s.id} className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-md shadow-sm" style={{ backgroundColor: s.color }} />
                                        <span className="text-sm font-medium text-secondary">{s.label}</span>
                                    </div>
                                ))}
                            </div>

                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
