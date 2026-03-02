import React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export const CONTEXTS = ["Student", "Founder", "Enterprise", "Creator", "Researcher"]

interface ContextPillsProps {
    selected: string
    onSelect: (ctx: string) => void
}

const wordVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.02,
        },
    },
}

const letterVariants = {
    hidden: { y: 4, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { duration: 0.18, ease: "easeOut" },
    },
}

export const ContextPills = React.memo(
    function ContextPills({ selected, onSelect }: ContextPillsProps) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="flex flex-wrap justify-center gap-2 mt-6"
            >
                {CONTEXTS.map((ctx) => {
                    const isSelected = selected === ctx
                    return (
                        <button
                            key={ctx}
                            onClick={() => onSelect(ctx)}
                            className={cn(
                                "relative px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 border",
                                isSelected
                                    ? "border-transparent text-primary"
                                    : "bg-surface/50 border-border text-secondary hover:text-primary hover:border-secondary/50"
                            )}
                        >
                            {isSelected && (
                                <div
                                    className="absolute inset-0 bg-accent/15 border border-accent/30 rounded-full"
                                />
                            )}
                            {isSelected ? (
                                <motion.span
                                    key={`${ctx}-selected`}
                                    className="relative z-10 inline-flex"
                                    variants={wordVariants}
                                    initial="hidden"
                                    animate="visible"
                                >
                                    {ctx.split("").map((char, index) => (
                                        <motion.span
                                            key={index}
                                            className="inline-block"
                                            variants={letterVariants}
                                        >
                                            {char}
                                        </motion.span>
                                    ))}
                                </motion.span>
                            ) : (
                                <span className="relative z-10">{ctx}</span>
                            )}
                        </button>
                    )
                })}
            </motion.div>
        )
    },
    (prev, next) => prev.selected === next.selected
)

