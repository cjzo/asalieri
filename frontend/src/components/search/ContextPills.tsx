import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export const CONTEXTS = ["Student", "Founder", "Enterprise", "Creator", "Researcher"]

interface ContextPillsProps {
    selected: string
    onSelect: (ctx: string) => void
}

export function ContextPills({ selected, onSelect }: ContextPillsProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="flex flex-wrap justify-center gap-2 mt-6"
        >
            {CONTEXTS.map((ctx) => (
                <button
                    key={ctx}
                    onClick={() => onSelect(ctx)}
                    className={cn(
                        "relative px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 border",
                        selected === ctx
                            ? "border-transparent text-primary"
                            : "bg-surface/50 border-border text-secondary hover:text-primary hover:border-secondary/50"
                    )}
                >
                    {selected === ctx && (
                        <motion.div
                            layoutId="active-pill"
                            className="absolute inset-0 bg-accent/15 border border-accent/30 rounded-full"
                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />
                    )}
                    <span className="relative z-10">{ctx}</span>
                </button>
            ))}
        </motion.div>
    )
}
