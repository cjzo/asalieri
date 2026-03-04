import { motion } from 'framer-motion'

export function DiffChecker() {
    return (
        <div className="w-full flex justify-center pb-24">
            <div className="w-full max-w-4xl flex flex-col items-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12 flex flex-col items-center"
                >
                    <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-primary mb-4">
                        DiffChecker
                    </h1>
                    <p className="text-lg text-secondary max-w-xl mx-auto">
                        This tool is under construction. Check back soon.
                    </p>
                </motion.div>
            </div>
        </div>
    )
}
