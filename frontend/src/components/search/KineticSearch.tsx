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
            className="relative w-full max-w-2xl mx-auto"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
            <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none z-10">
                    <Search className={`w-5 h-5 transition-colors duration-300 ${active ? 'text-accent' : 'text-tertiary group-focus-within:text-accent'}`} />
                </div>
                <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    className={`pl-12 pr-4 h-16 text-lg rounded-2xl bg-surface border-border/80 shadow-sm focus-visible:ring-1 focus-visible:ring-accent/40 focus-visible:border-accent transition-all duration-300 hover:border-border group-focus-within:shadow-md group-focus-within:shadow-accent/10 ${active ? 'pt-4 pb-0' : ''}`}
                />
                <label
                    className={`absolute left-12 whitespace-nowrap pointer-events-none transition-all duration-300 ${active
                        ? "top-1.5 text-xs text-secondary font-medium tracking-wide"
                        : "top-1/2 -translate-y-1/2 text-lg text-tertiary"
                        }`}
                >
                    I need a tool for...
                </label>
            </div>
        </motion.div>
    )
}
