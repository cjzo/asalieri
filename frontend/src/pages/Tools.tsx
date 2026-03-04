import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { PenTool, Type, Key, Code, Hash, Link2, Calendar } from 'lucide-react'

const TOOLS = [
    {
        id: 'email-signature',
        name: 'Email Signature Generator',
        description: 'Create professional, robust HTML email signatures.',
        icon: PenTool,
        path: '/tools/email-signature',
        color: 'from-blue-500/20 to-cyan-500/20',
        border: 'group-hover:border-cyan-500/50',
        shadow: 'hover:shadow-[0_8px_30px_rgba(6,182,212,0.15)]'
    },
    {
        id: 'lorem-ipsum',
        name: 'Lorem Ipsum Generator',
        description: 'Synthesize versatile placeholder text for prototypes.',
        icon: Type,
        path: '/tools/lorem-ipsum',
        color: 'from-amber-500/20 to-orange-500/20',
        border: 'group-hover:border-orange-500/50',
        shadow: 'hover:shadow-[0_8px_30px_rgba(249,115,22,0.15)]'
    },
    {
        id: 'password-generator',
        name: 'Password Generator',
        description: 'Generate high-entropy, secure credentials.',
        icon: Key,
        path: '/tools/password',
        color: 'from-green-500/20 to-emerald-500/20',
        border: 'group-hover:border-emerald-500/50',
        shadow: 'hover:shadow-[0_8px_30px_rgba(16,185,129,0.15)]'
    },
    {
        id: 'json-formatter',
        name: 'JSON Formatter',
        description: 'Format, validate, and explore JSON payloads.',
        icon: Code,
        path: '/tools/json',
        color: 'from-purple-500/20 to-fuchsia-500/20',
        border: 'group-hover:border-fuchsia-500/50',
        shadow: 'hover:shadow-[0_8px_30px_rgba(217,70,239,0.15)]'
    },
    {
        id: 'base64-encoder',
        name: 'Base64 Encoder',
        description: 'Instantly encode or decode strings and files.',
        icon: Link2,
        path: '/tools/base64',
        color: 'from-pink-500/20 to-rose-500/20',
        border: 'group-hover:border-rose-500/50',
        shadow: 'hover:shadow-[0_8px_30px_rgba(244,63,94,0.15)]'
    },
    {
        id: 'uuid-generator',
        name: 'UUID/GUID Generator',
        description: 'Bulk generation of standard unique identifiers.',
        icon: Hash,
        path: '/tools/uuid',
        color: 'from-indigo-500/20 to-blue-500/20',
        border: 'group-hover:border-indigo-500/50',
        shadow: 'hover:shadow-[0_8px_30px_rgba(99,102,241,0.15)]'
    },
    {
        id: 'availability-calendar',
        name: 'Availability Calendar',
        description: 'Design and export a single-month interactive calendar snapshot.',
        icon: Calendar,
        path: '/tools/calendar',
        color: 'from-violet-500/20 to-purple-500/20',
        border: 'group-hover:border-purple-500/50',
        shadow: 'hover:shadow-[0_8px_30px_rgba(168,85,247,0.15)]'
    }
]

export function Tools() {
    return (
        <div className="w-full flex justify-center pb-24">
            <div className="w-full max-w-4xl flex flex-col items-center">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-primary mb-4">
                        Developer Tools
                    </h1>
                    <p className="text-lg text-secondary max-w-xl mx-auto leading-relaxed">
                        A fast, client-side suite of robust utilities. No network delays, no data logging—just instant results.
                    </p>
                </motion.div>

                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full"
                    initial="hidden"
                    animate="show"
                    variants={{
                        hidden: { opacity: 0 },
                        show: {
                            opacity: 1,
                            transition: { staggerChildren: 0.08 }
                        }
                    }}
                >
                    {TOOLS.map((tool) => (
                        <motion.div
                            key={tool.id}
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
                            }}
                        >
                            <Link to={tool.path} className="block h-full group outline-none">
                                <div className={`relative h-full flex flex-col p-6 rounded-2xl border border-border/40 bg-surface/40 backdrop-blur-sm overflow-hidden transition-all duration-500 hover:-translate-y-1.5 ${tool.border} ${tool.shadow}`}>
                                    {/* Hover Gradient Background */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

                                    {/* Content */}
                                    <div className="relative z-10 flex flex-col h-full">
                                        <div className="mb-5 inline-flex p-3 rounded-xl bg-surface/80 border border-border/50 text-tertiary group-hover:text-primary transition-colors duration-300 shadow-sm">
                                            <tool.icon className="w-6 h-6 stroke-[1.5]" />
                                        </div>
                                        <h3 className="text-xl font-medium text-primary mb-2 group-hover:text-accent transition-colors duration-300 tracking-tight">
                                            {tool.name}
                                        </h3>
                                        <p className="text-sm text-secondary leading-relaxed">
                                            {tool.description}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    )
}
