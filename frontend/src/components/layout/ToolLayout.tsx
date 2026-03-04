import { Outlet, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'

function ToolBackButton() {
    const navigate = useNavigate()

    return (
        <motion.button
            onClick={() => navigate('/tools')}
            className="group flex flex-row items-center gap-4 text-secondary hover:text-accent transition-colors mb-12 md:mb-0 md:absolute md:left-0 lg:-left-6 xl:-left-12 md:top-2 z-50 origin-left"
            whileHover="hover"
            whileTap="tap"
            initial="idle"
            animate="idle"
        >
            <motion.div
                variants={{
                    idle: { scale: 1, x: 0, rotate: 0, borderRadius: "16px" },
                    hover: { scale: 1.15, x: -8, rotate: -6, borderRadius: "20px", transition: { type: "spring", stiffness: 500, damping: 15 } },
                    tap: { scale: 0.85, x: -25, rotate: -15, borderRadius: "12px", transition: { type: "spring", stiffness: 400, damping: 10 } }
                }}
                className="p-3 bg-surface/80 border border-border/50 shadow-sm backdrop-blur-xl group-hover:border-accent/40 group-hover:bg-accent/10 group-hover:shadow-accent/20 transition-colors duration-300 relative overflow-hidden flex items-center justify-center"
            >
                {/* Kinetic streak effects */}
                <motion.div
                    variants={{
                        idle: { opacity: 0, scaleX: 0, x: 20 },
                        hover: { opacity: 0.8, scaleX: 1, x: 0, transition: { duration: 0.2, delay: 0.05 } },
                        tap: { opacity: 1, scaleX: 1.5, x: -10, transition: { duration: 0.1 } }
                    }}
                    className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-transparent to-white/10 blur-[2px]"
                />

                <motion.div
                    variants={{
                        idle: { x: 0, rotate: 0 },
                        hover: { x: -3, rotate: -5, transition: { type: "spring", stiffness: 400, damping: 10 } },
                        tap: { x: -8, rotate: -15 }
                    }}
                >
                    <ArrowLeft className="w-5 h-5 relative z-10 text-current" />
                </motion.div>
            </motion.div>

            <div className="flex flex-col items-start lg:opacity-100 md:opacity-0 opacity-100 transition-opacity duration-300 group-hover:opacity-100">
                <motion.span
                    variants={{
                        idle: { opacity: 0.6, x: -5, y: 0 },
                        hover: { opacity: 1, x: 2, y: 0, transition: { type: "spring", stiffness: 400, damping: 15 } },
                        tap: { opacity: 1, x: -10, y: 0 }
                    }}
                    className="font-mono text-sm tracking-[0.2em] uppercase font-bold text-primary transition-all duration-300"
                >
                    Back
                </motion.span>
                <motion.span
                    variants={{
                        idle: { opacity: 0, y: 10, height: 0 },
                        hover: { opacity: 0.5, y: 0, height: "auto", transition: { type: "spring", stiffness: 400, damping: 15 } },
                        tap: { opacity: 0, y: 10, height: 0 }
                    }}
                    className="text-[10px] tracking-widest uppercase font-mono text-tertiary overflow-hidden"
                >
                    To Tools
                </motion.span>
            </div>
        </motion.button>
    )
}

export function ToolLayout() {
    return (
        <div className="w-full relative flex flex-col">
            <ToolBackButton />
            <div className="w-full">
                <Outlet />
            </div>
        </div>
    )
}
