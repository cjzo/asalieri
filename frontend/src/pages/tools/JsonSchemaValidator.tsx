import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '../../components/ui/button'
import { FileSearch, CheckCircle2, XCircle, Trash2 } from 'lucide-react'
import Ajv from 'ajv'

export function JsonSchemaValidator() {
    const [schema, setSchema] = useState('{\n  "type": "object",\n  "properties": {\n    "name": { "type": "string" },\n    "age": { "type": "number" }\n  },\n  "required": ["name", "age"]\n}')
    const [data, setData] = useState('{\n  "name": "Alex",\n  "age": 28\n}')

    interface ErrorObj {
        path: string
        message: string
    }

    const [errors, setErrors] = useState<ErrorObj[]>([])
    const [isValid, setIsValid] = useState<boolean | null>(null)
    const [syntaxError, setSyntaxError] = useState<string | null>(null)

    useEffect(() => {
        if (!schema.trim() || !data.trim()) {
            setIsValid(null)
            setErrors([])
            setSyntaxError(null)
            return
        }

        try {
            const parsedSchema = JSON.parse(schema)
            const parsedData = JSON.parse(data)
            setSyntaxError(null)

            const ajv = new Ajv({ allErrors: true })
            const validate = ajv.compile(parsedSchema)
            const valid = validate(parsedData)

            if (valid) {
                setIsValid(true)
                setErrors([])
            } else {
                setIsValid(false)
                setErrors((validate.errors || []).map(err => ({
                    path: err.instancePath || 'root',
                    message: err.message || 'Unknown error'
                })))
            }
        } catch (e: any) {
            setSyntaxError(e.message || 'Syntax Error in JSON')
            setIsValid(null)
            setErrors([])
        }
    }, [schema, data])

    return (
        <div className="w-full flex justify-center pb-24 min-h-[80vh]">
            <div className="w-full max-w-7xl flex flex-col items-center px-4">

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="text-center mb-12 flex flex-col items-center"
                >
                    <div className="mb-6 inline-flex p-4 rounded-2xl bg-surface/50 border border-border/50 text-accent shadow-lg shadow-accent/10">
                        <FileSearch className="w-8 h-8" />
                    </div>

                    <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-primary mb-4">
                        JSON Schema Validator
                    </h1>
                    <p className="text-lg text-secondary max-w-xl mx-auto font-medium">
                        Validate JSON payloads against rigorous structures dynamically.
                    </p>
                </motion.div>

                <div className="w-full flex flex-col lg:flex-row gap-6 relative items-stretch mb-8">

                    {/* Left Schema Pane */}
                    <motion.div className="flex-1 flex flex-col h-[500px] rounded-3xl border border-border/40 bg-surface/40 backdrop-blur-sm shadow-sm transition-all hover:border-accent/40 overflow-hidden">
                        <div className="p-4 border-b border-border/30 bg-surface/20 flex justify-between items-center">
                            <label className="text-sm font-bold uppercase tracking-wider text-tertiary ml-2">JSON Schema</label>
                            <Button onClick={() => setSchema('')} className="h-8 text-xs !bg-transparent !text-tertiary hover:!text-red-500 hover:!bg-red-500/10 !shadow-none !px-2">
                                <Trash2 className="w-3.5 h-3.5 mr-1" /> Clear
                            </Button>
                        </div>
                        <textarea
                            value={schema}
                            onChange={(e) => setSchema(e.target.value)}
                            placeholder="Define schema rules here..."
                            className="w-full flex-grow p-5 bg-transparent text-primary focus:outline-none transition-all resize-none shadow-inner font-mono text-sm leading-relaxed custom-scrollbar"
                            spellCheck="false"
                        />
                    </motion.div>

                    {/* Right Data Pane */}
                    <motion.div className="flex-1 flex flex-col h-[500px] rounded-3xl border border-border/40 bg-surface/40 backdrop-blur-sm shadow-sm transition-all hover:border-accent/40 overflow-hidden">
                        <div className="p-4 border-b border-border/30 bg-surface/20 flex justify-between items-center">
                            <label className="text-sm font-bold uppercase tracking-wider text-tertiary ml-2">JSON Data</label>
                            <Button onClick={() => setData('')} className="h-8 text-xs !bg-transparent !text-tertiary hover:!text-red-500 hover:!bg-red-500/10 !shadow-none !px-2">
                                <Trash2 className="w-3.5 h-3.5 mr-1" /> Clear
                            </Button>
                        </div>
                        <textarea
                            value={data}
                            onChange={(e) => setData(e.target.value)}
                            placeholder="Data payload to validate..."
                            className="w-full flex-grow p-5 bg-transparent text-primary focus:outline-none transition-all resize-none shadow-inner font-mono text-sm leading-relaxed custom-scrollbar"
                            spellCheck="false"
                        />
                    </motion.div>

                </div>

                {/* Validation Results Footer */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`w-full max-w-3xl rounded-3xl p-6 border shadow-xl relative overflow-hidden flex flex-col items-center ${isValid === true ? 'bg-emerald-500/10 border-emerald-500/20 shadow-emerald-500/5' :
                            isValid === false ? 'bg-red-500/10 border-red-500/20 shadow-red-500/5' :
                                syntaxError ? 'bg-amber-500/10 border-amber-500/20 shadow-amber-500/5' :
                                    'bg-surface border-border/50'
                        }`}
                >
                    {syntaxError ? (
                        <div className="text-amber-500 flex flex-col items-center gap-3">
                            <span className="font-bold uppercase tracking-widest bg-amber-500/20 px-3 py-1 rounded text-sm">JSON Parsing Error</span>
                            <span className="font-mono">{syntaxError}</span>
                        </div>
                    ) : isValid === true ? (
                        <div className="text-emerald-500 flex flex-col items-center gap-3">
                            <CheckCircle2 className="w-12 h-12" />
                            <span className="font-bold uppercase tracking-widest text-lg">Valid JSON Payload</span>
                        </div>
                    ) : isValid === false ? (
                        <div className="text-red-500 w-full flex flex-col items-center gap-4">
                            <div className="flex items-center gap-3 mb-2">
                                <XCircle className="w-8 h-8" />
                                <span className="font-bold uppercase tracking-widest text-lg">Validation Failed</span>
                            </div>
                            <div className="w-full grid gap-2">
                                {errors.map((err, i) => (
                                    <div key={i} className="flex gap-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl font-mono text-sm">
                                        <span className="font-bold min-w-[100px] break-words">{err.path}</span>
                                        <span>{err.message}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="text-tertiary flex flex-col items-center gap-3 p-4">
                            <FileSearch className="w-8 h-8 opacity-50" />
                            <span className="uppercase tracking-widest text-sm font-bold">Awaiting Input</span>
                        </div>
                    )}
                </motion.div>

            </div>
        </div>
    )
}
