import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'
import { TOOLS, CATEGORIES, ToolCategory } from '../config/tools'
import { KineticSearch } from '../components/search/KineticSearch'

export function Tools() {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState<ToolCategory>('All')

    const filteredTools = useMemo(() => {
        return TOOLS.filter(tool => {
            const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                tool.description.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory
            return matchesSearch && matchesCategory
        })
    }, [searchQuery, selectedCategory])

    return (
        <div className="w-full flex justify-center pb-24 min-h-screen">
            <div className="w-full max-w-6xl flex flex-col items-center px-4">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-primary mb-4">
                        Developer Tools
                    </h1>
                    <p className="text-lg text-secondary max-w-2xl mx-auto leading-relaxed">
                        A fast, client-side suite of robust utilities. No network delays, no data logging—just instant results. Everything happens right here in your browser.
                    </p>
                </motion.div>

                {/* Search & Filter Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="w-full max-w-4xl mb-12 flex flex-col gap-6"
                >
                    <KineticSearch
                        query={searchQuery}
                        setQuery={setSearchQuery}
                        placeholder="Search tools by name, utility, or keyword..."
                        label="I need a tool for..."
                    />

                    {/* Categories Snapshot */}
                    <div className="flex flex-wrap items-center justify-center gap-2">
                        {CATEGORIES.map(category => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${selectedCategory === category ? 'bg-accent text-white shadow-md shadow-accent/20 scale-105' : 'bg-surface/50 text-secondary border border-border/50 hover:border-accent/30 hover:text-primary hover:bg-surface'}`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Grid */}
                {filteredTools.length > 0 ? (
                    <motion.div
                        layout
                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full"
                    >
                        <AnimatePresence mode="popLayout">
                            {filteredTools.map((tool) => (
                                <motion.div
                                    key={tool.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.2 }}
                                    className="h-full"
                                >
                                    <Link to={tool.path} className="block h-full group outline-none">
                                        <div className="relative h-full flex flex-col p-6 rounded-2xl border border-border/40 bg-surface/40 backdrop-blur-sm overflow-hidden transition-all duration-500 hover:-translate-y-1.5 group-hover:border-accent/50 hover:shadow-[0_8px_30px_var(--tool-glow)]">
                                            <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-accent/5 opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
                                            <div className="relative z-10 flex flex-col h-full">
                                                <div className="mb-4 inline-flex p-2.5 rounded-xl bg-surface/80 border border-border/50 text-tertiary group-hover:text-primary transition-colors duration-300 shadow-sm self-start">
                                                    <tool.icon className="w-5 h-5 stroke-[1.5]" />
                                                </div>
                                                <h3 className="text-lg font-medium text-primary mb-2 group-hover:text-accent transition-colors duration-300 tracking-tight">
                                                    {tool.name}
                                                </h3>
                                                <p className="text-sm text-secondary leading-relaxed line-clamp-2">
                                                    {tool.description}
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="w-full py-24 flex flex-col items-center justify-center text-center"
                    >
                        <div className="w-16 h-16 mb-4 rounded-full bg-surface/50 border border-border flex items-center justify-center text-tertiary">
                            <Compass className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-medium text-primary mb-2">No tools found</h3>
                        <p className="text-secondary max-w-sm">We couldn't find any tools matching your search criteria. Try a different term or category.</p>
                        <button
                            onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                            className="mt-6 px-6 py-2 rounded-full bg-surface border border-border/50 text-primary hover:text-accent hover:border-accent/40 transition-colors"
                        >
                            Clear Filters
                        </button>
                    </motion.div>
                )}
            </div>
        </div>
    )
}
