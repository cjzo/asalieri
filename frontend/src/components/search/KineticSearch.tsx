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
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && query.trim()) {
            onSubmit()
        }
    }

    return (
        <motion.div
            layout
            className="relative w-full max-w-2xl mx-auto"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
            <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Search className="w-5 h-5 text-tertiary group-focus-within:text-accent transition-colors duration-300" />
                </div>
                <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="I need a tool for..."
                    className="pl-12 pr-4 h-16 text-lg rounded-2xl bg-surface border-border/50 shadow-lg shadow-black/20 focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:border-accent transition-all duration-300 group-focus-within:shadow-accent/5"
                />
            </div>
        </motion.div>
    )
}
