import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ThemeSwitcher } from '../ui/theme-switcher'
import { motion } from 'framer-motion'

const LOGO_TEXT = "asalieri".split("")

export function Header() {
    const location = useLocation()
    const navigate = useNavigate()

    return (
        <header className="w-full flex justify-between items-center mb-16 h-12">
            <motion.div
                className="cursor-pointer flex relative py-2"
                onClick={() => navigate('/')}
                initial="idle"
                whileHover="hover"
                whileTap="tap"
            >
                {LOGO_TEXT.map((letter, i) => {
                    const centerIndex = (LOGO_TEXT.length - 1) / 2
                    const distance = i - centerIndex

                    return (
                        <motion.span
                            key={i}
                            className="text-2xl font-semibold tracking-tighter inline-block text-primary origin-bottom"
                            variants={{
                                idle: {
                                    x: 0,
                                    y: 0,
                                    scale: 1,
                                    rotate: 0,
                                    color: 'var(--primary)'
                                },
                                hover: {
                                    x: distance * 4,  // Expand outwards significantly
                                    y: Math.abs(distance) * -1.2, // Slight arc shape
                                    scale: 1.1 + Math.abs(distance) * 0.05,
                                    rotate: distance * 2.5, // Fan out
                                    color: 'var(--accent)',
                                    transition: { type: "spring", stiffness: 400, damping: 12, mass: 0.8 }
                                },
                                tap: {
                                    y: -20 - Math.random() * 10,  // Blast upwards
                                    x: distance * 8, // Blast outwards
                                    scale: 1.3,
                                    rotate: distance * 10 + (Math.random() * 40 - 20), // Chaotic rotation
                                    color: 'var(--foreground)',
                                    transition: { type: "spring", stiffness: 300, damping: 10, mass: 0.5 }
                                }
                            }}
                        >
                            {letter}
                        </motion.span>
                    )
                })}
                {/* Background energetic pulse on tap */}
                <motion.div
                    className="absolute inset-0 bg-accent/20 rounded-full blur-xl -z-10"
                    variants={{
                        idle: { opacity: 0, scale: 0 },
                        hover: { opacity: 0.4, scale: 1.2, transition: { duration: 0.3 } },
                        tap: { opacity: 0.8, scale: 2.5, transition: { duration: 0.1 } }
                    }}
                />
            </motion.div>
            <div className="flex items-center gap-6">
                <Link
                    to="/tools"
                    className={`text-sm font-medium transition-colors hover:text-primary ${location.pathname.startsWith('/tools') ? 'text-primary' : 'text-secondary'}`}
                >
                    Tools
                </Link>
                <ThemeSwitcher />
            </div>
        </header>
    )
}

