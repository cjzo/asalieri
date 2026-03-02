import { motion } from "framer-motion"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export interface ToolResult {
    id: string
    name: string
    category: string
    price_tier: string
    difficulty_level: string
    description: string
    tags: string[]
    use_cases: string[]
    score: number
    why_fits: string
}

interface ResultCardProps {
    item: ToolResult
    index: number
}

export function ResultCard({ item, index }: ResultCardProps) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02, y: -4 }}
            transition={{ delay: index * 0.05, duration: 0.4, ease: [0.25, 0.1, 0.25, 1], scale: { type: "spring", stiffness: 400, damping: 25 }, y: { type: "spring", stiffness: 400, damping: 25 } }}
            className="h-full"
        >
            <Card className="h-full flex flex-col group overflow-hidden border-border/70 hover:border-accent/40 hover:shadow-2xl hover:shadow-accent/10 bg-surface/95 backdrop-blur-sm transition-all duration-300 rounded-2xl">
                <CardHeader className="pb-4 space-y-3">
                    <div className="flex items-center justify-between text-[11px] tracking-[0.16em] uppercase text-tertiary">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary/5 border border-border/50">
                            <span className="h-1.5 w-1.5 rounded-full bg-accent/70" />
                            {item.category}
                        </span>
                        <span className="inline-flex items-center gap-2 font-semibold text-foreground/80">
                            <span className="relative flex h-1.5 w-6 overflow-hidden rounded-full bg-border/80">
                                <span
                                    className="absolute inset-y-0 left-0 bg-accent/70"
                                    style={{ width: `${Math.min(100, Math.round(item.score * 100))}%` }}
                                />
                            </span>
                            <span className="tabular-nums">{Math.round(item.score * 100)}% match</span>
                        </span>
                    </div>
                    <div className="flex justify-between items-start gap-3">
                        <CardTitle className="text-2xl font-medium tracking-tight text-foreground group-hover:text-accent transition-colors duration-300">
                            {item.name}
                        </CardTitle>
                        <div className="flex gap-2">
                            <Badge className="bg-surface border-border/60 text-xs font-semibold text-secondary">{item.price_tier}</Badge>
                            <Badge className="bg-surface border-border/60 text-xs font-semibold text-secondary">{item.difficulty_level}</Badge>
                        </div>
                    </div>
                    <CardDescription className="text-[15px] font-normal text-foreground/90 leading-relaxed max-w-[95%]">
                        {item.description}
                    </CardDescription>
                </CardHeader>

                <CardContent className="flex-grow space-y-5">
                    <div className="flex flex-wrap gap-2">
                        {item.tags.map(tag => (
                            <span key={tag} className="text-[11px] uppercase tracking-wider font-semibold text-tertiary px-2.5 py-1 rounded-md bg-secondary/5 border border-border/50 group-hover:bg-accent/5 group-hover:text-secondary group-hover:border-accent/20 transition-all duration-300">
                                {tag}
                            </span>
                        ))}
                    </div>

                    <div className="p-4 mt-4 rounded-xl bg-accent/5 border border-accent/10 transition-all duration-500 overflow-hidden relative group-hover:bg-accent/10 group-hover:border-accent/20">
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        />
                        <p className="text-sm font-medium text-foreground/95 flex items-start gap-3 leading-relaxed relative z-10">
                            <span className="text-accent mt-[2px] opacity-90 drop-shadow-sm">✦</span>
                            {item.why_fits}
                        </p>
                    </div>

                    {item.use_cases?.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-1">
                            {item.use_cases.map(useCase => (
                                <span
                                    key={useCase}
                                    className="text-xs font-medium text-secondary bg-surface/80 border border-border/60 rounded-full px-3 py-1 group-hover:border-accent/40 group-hover:text-foreground transition-colors duration-300"
                                >
                                    {useCase}
                                </span>
                            ))}
                        </div>
                    )}
                </CardContent>

                <CardFooter className="pt-4 border-t border-border/40">
                    <Button className="w-full bg-surface hover:bg-surface border border-border/80 text-foreground hover:border-accent/50 hover:text-accent transition-all duration-300 shadow-sm">
                        Explore {item.name}
                    </Button>
                </CardFooter>
            </Card>
        </motion.div>
    )
}
