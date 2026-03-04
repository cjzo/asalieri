import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Button } from '../../components/ui/button'
import { Type, Copy, Check } from 'lucide-react'

const LOREM_WORDS = [
    "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit", "sed", "do", "eiusmod", "tempor", "incididunt",
    "ut", "labore", "et", "dolore", "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud", "exercitation", "ullamco",
    "laboris", "nisi", "aliquip", "ex", "ea", "commodo", "consequat", "duis", "aute", "irure", "reprehenderit", "voluptate",
    "velit", "esse", "cillum", "fugiat", "nulla", "pariatur", "excepteur", "sint", "occaecat", "cupidatat", "non", "proident",
    "sunt", "culpa", "qui", "officia", "deserunt", "mollit", "anim", "id", "est", "laborum"
];

export function LoremIpsumGenerator() {
    const [paras, setParas] = useState<number>(3)
    const [sentsPerPara, setSentsPerPara] = useState<number>(5)
    const [includeHtml, setIncludeHtml] = useState<boolean>(false)

    const [copied, setCopied] = useState(false)

    const generatedText = useMemo(() => {
        let result = []

        for (let p = 0; p < paras; p++) {
            let paragraph = []
            for (let s = 0; s < sentsPerPara; s++) {
                const sentenceLen = Math.floor(Math.random() * 8) + 6
                let sentenceWords = []
                for (let w = 0; w < sentenceLen; w++) {
                    sentenceWords.push(LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)])
                }

                let sentence = sentenceWords.join(' ')
                // maybe add a tag if includeHtml
                if (includeHtml && Math.random() > 0.7) {
                    const splitPoint = Math.floor(sentence.length / 2);
                    const firstSpace = sentence.indexOf(' ', splitPoint);
                    const secondSpace = sentence.indexOf(' ', firstSpace + 1);
                    if (firstSpace !== -1 && secondSpace !== -1) {
                        const tag = Math.random() > 0.5 ? 'strong' : 'em';
                        sentence =
                            sentence.substring(0, firstSpace + 1) +
                            `<${tag}>` + sentence.substring(firstSpace + 1, secondSpace) + `</${tag}>` +
                            sentence.substring(secondSpace);
                    }
                }

                sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.'
                paragraph.push(sentence)
            }

            let pText = paragraph.join(' ')
            if (includeHtml) {
                pText = `<p>${pText}</p>`
            }
            result.push(pText)
        }

        return includeHtml ? result.join('\n\n') : result.join('\n\n')
    }, [paras, sentsPerPara, includeHtml])

    const handleCopy = async () => {
        await navigator.clipboard.writeText(generatedText)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="w-full flex justify-center pb-24">
            <div className="w-full max-w-6xl flex flex-col items-center">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12 flex flex-col items-center"
                >
                    <div className="mb-6 inline-flex p-4 rounded-2xl bg-surface/50 border border-border/50 text-accent shadow-lg shadow-accent/10">
                        <Type className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-primary mb-4">
                        Lorem Ipsum
                    </h1>
                    <p className="text-lg text-secondary max-w-xl mx-auto">
                        Generate sophisticated placeholder text instantly. Ready to be copied directly into your prototypes.
                    </p>
                </motion.div>

                <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Controls */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-4 flex flex-col gap-6"
                    >
                        <div className="p-6 rounded-2xl border border-border/40 bg-surface/40 backdrop-blur-sm space-y-6">
                            <h3 className="text-xl font-medium text-primary tracking-tight">Configuration</h3>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <label className="text-sm text-secondary font-medium">Paragraphs</label>
                                        <span className="text-sm font-medium text-accent">{paras}</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="1" max="50"
                                        value={paras}
                                        onChange={(e) => setParas(parseInt(e.target.value))}
                                        className="w-full accent-accent bg-transparent hover:cursor-pointer"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <label className="text-sm text-secondary font-medium">Sentences per Paragraph</label>
                                        <span className="text-sm font-medium text-accent">{sentsPerPara}</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="1" max="15"
                                        value={sentsPerPara}
                                        onChange={(e) => setSentsPerPara(parseInt(e.target.value))}
                                        className="w-full accent-accent bg-transparent hover:cursor-pointer"
                                    />
                                </div>

                                <div className="pt-2 flex items-center gap-3">
                                    <button
                                        onClick={() => setIncludeHtml(!includeHtml)}
                                        className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${includeHtml ? 'bg-accent' : 'bg-surface border border-border/50'}`}
                                    >
                                        <motion.div
                                            className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-sm`}
                                            animate={{ x: includeHtml ? 24 : 0 }}
                                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                        />
                                    </button>
                                    <label className="text-sm text-secondary font-medium cursor-pointer select-none" onClick={() => setIncludeHtml(!includeHtml)}>
                                        Include HTML Tags
                                    </label>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Output Display */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-8 flex flex-col gap-6"
                    >
                        <div className="flex flex-col rounded-2xl border border-border/40 bg-white dark:bg-zinc-950 shadow-2xl overflow-hidden group min-h-[400px]">
                            <div className="flex justify-between items-center p-4 border-b border-border/30 bg-surface/30">
                                <span className="text-sm font-medium text-tertiary uppercase tracking-widest pl-2">Output</span>
                                <Button onClick={handleCopy} className="text-xs h-8 px-3 shadow-md shadow-accent/20">
                                    {copied ? <Check className="w-3.5 h-3.5 mr-1.5" /> : <Copy className="w-3.5 h-3.5 mr-1.5" />}
                                    Copy Text
                                </Button>
                            </div>

                            <div className="relative p-6 flex-grow overflow-y-auto" style={{ maxHeight: '600px' }}>
                                <pre className="font-sans text-secondary text-base leading-relaxed whitespace-pre-wrap">
                                    {generatedText}
                                </pre>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
