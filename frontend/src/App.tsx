import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { KineticSearch } from './components/search/KineticSearch'
import { ContextPills, CONTEXTS } from './components/search/ContextPills'
import { ResultCard, ToolResult } from './components/results/ResultCard'
import { ThemeSwitcher } from './components/ui/theme-switcher'

function App() {
  const [query, setQuery] = useState('')
  const [context, setContext] = useState(CONTEXTS[1]) // Default to Founder
  const [isSearching, setIsSearching] = useState(false)
  const [results, setResults] = useState<ToolResult[]>([])
  const [loading, setLoading] = useState(false)

  const handleSearch = async () => {
    if (!query.trim()) return

    setIsSearching(true)
    setLoading(true)

    try {
      const response = await fetch('/api/search/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, context })
      })

      if (response.ok) {
        const data = await response.json()
        setResults(data.results)
      } else {
        console.error("Failed to fetch results")
      }
    } catch (err) {
      console.error("Error connecting to backend", err)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setIsSearching(false)
    setQuery('')
    setResults([])
  }

  return (
    <div className="min-h-screen relative overflow-hidden text-foreground selection:bg-accent/30 selection:text-white flex flex-col items-center">
      {/* Background subtly shifts depth */}
      <motion.div
        className="fixed inset-0 pointer-events-none z-[-1]"
        initial={{ background: 'radial-gradient(circle at 50% 50%, #14161A 0%, #0E0F11 100%)' }}
        animate={{
          background: isSearching
            ? 'radial-gradient(circle at 50% 0%, #1a1e27 0%, #0E0F11 100%)'
            : 'radial-gradient(circle at 50% 50%, #14161A 0%, #0E0F11 100%)'
        }}
        transition={{ duration: 1, ease: 'easeInOut' }}
      />

      <main className="w-full max-w-5xl mx-auto px-6 py-12 flex flex-col items-center flex-grow transition-all duration-500">

        {/* Header / Brand */}
        <header className="w-full flex justify-between items-center mb-16 h-12">
          <motion.div layoutId="brandLogo" className="text-xl font-semibold tracking-tighter text-primary cursor-pointer hover:text-accent transition-colors" onClick={handleReset}>
            asalieri
          </motion.div>
          <ThemeSwitcher />
        </header>

        {/* Hero Section Container */}
        <motion.div
          layout
          initial={false}
          animate={{
            y: isSearching ? -20 : "15vh",
            scale: isSearching ? 0.95 : 1
          }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="w-full max-w-2xl flex flex-col items-center"
        >
          <AnimatePresence mode="wait">
            {!isSearching && (
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-4xl md:text-5xl font-medium tracking-tight text-primary mb-8 text-center"
              >
                What are you trying to do?
              </motion.h1>
            )}
          </AnimatePresence>

          <KineticSearch
            query={query}
            setQuery={setQuery}
            onSubmit={handleSearch}
          />

          <AnimatePresence>
            {!isSearching && (
              <motion.div exit={{ opacity: 0, y: 10 }}>
                <ContextPills selected={context} onSelect={setContext} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Results Container */}
        {isSearching && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            className="w-full mt-12 grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {loading ? (
              <div className="col-span-full flex justify-center py-20 text-secondary animate-pulse">
                Finding the best tools for you...
              </div>
            ) : results.length > 0 ? (
              results.map((result, index) => (
                <ResultCard key={result.id} item={result} index={index} />
              ))
            ) : (
              <div className="col-span-full flex justify-center py-20 text-tertiary">
                No tools found for "{query}". Try adjusting your context or keywords.
              </div>
            )}
          </motion.div>
        )}
      </main>
    </div>
  )
}

export default App
