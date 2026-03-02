import * as React from "react"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface KineticSearchProps {
    query: string
    setQuery: (q: string) => void
    onSubmit: () => void
}

export function KineticSearch({ query, setQuery, onSubmit }: KineticSearchProps) {
    const [focused, setFocused] = React.useState(false)
    const active = focused || query.length > 0

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && query.trim()) {
            onSubmit()
        }
    }

    return (
        <motion.div
            className="relative w-full max-w-2xl mx-auto group"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
        >
            <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none z-10">
                    <motion.div
                        animate={{
                            scale: active ? 0.9 : 1,
                            color: active ? 'var(--accent)' : 'var(--text-sub)'
                        }}
                        transition={{ duration: 0.3 }}
                    >
                        <Search className="w-5 h-5 flex-shrink-0" />
                    </motion.div>
                </div>
                <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    className={`pl-12 pr-4 h-16 text-lg rounded-2xl bg-surface/90 backdrop-blur-md border-border/80 shadow-[0_8px_30px_rgb(0,0,0,0.12)] focus-visible:ring-1 focus-visible:ring-accent/40 focus-visible:border-accent transition-all duration-300 hover:border-border/100 group-focus-within:shadow-[0_8px_40px_rgba(217,217,204,0.12)] ${active ? 'pt-5 pb-1' : ''}`}
                />
                <motion.label
                    initial={false}
                    animate={{
                        y: active ? -12 : 0,
                        scale: active ? 0.75 : 1,
                        opacity: active ? 0.8 : 1,
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    style={{ originX: 0, originY: 0.5 }}
                    className="absolute left-12 top-1/2 -translate-y-1/2 whitespace-nowrap pointer-events-none text-tertiary tracking-wide font-medium"
                >
                    I need a tool for...
                </motion.label>
            </div>
        </motion.div>
    )
}
