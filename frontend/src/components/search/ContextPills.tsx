import React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export const CONTEXTS = ["Student", "Founder", "Enterprise", "Creator", "Researcher"]

interface ContextPillsProps {
    selected: string
    onSelect: (ctx: string) => void
}

export const ContextPills = React.memo(function ContextPills({ selected, onSelect }: ContextPillsProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5, type: 'spring', stiffness: 200, damping: 20 }}
            className="flex flex-wrap justify-center gap-2 mt-6"
        >
            {CONTEXTS.map((ctx) => (
                <motion.button
                    key={ctx}
                    onClick={() => onSelect(ctx)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className={cn(
                        "relative px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 border",
                        selected === ctx
                            ? "border-transparent text-primary"
                            : "bg-surface/50 border-border text-secondary hover:text-primary hover:border-secondary/50 hover:bg-surface/80"
                    )}
                >
                    {selected === ctx && (
                        <motion.div
                            layoutId="active-pill"
                            className="absolute inset-0 bg-accent/15 border border-accent/40 rounded-full shadow-[0_0_15px_rgba(217,217,204,0.15)]"
                            transition={{ type: "spring", stiffness: 350, damping: 25 }}
                        />
                    )}
                    <span className="relative z-10">{ctx}</span>
                </motion.button>
            ))}
        </motion.div>
    )
})
