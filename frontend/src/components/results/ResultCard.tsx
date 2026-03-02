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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02, y: -4 }}
            transition={{ delay: index * 0.05, duration: 0.4, ease: [0.25, 0.1, 0.25, 1], scale: { type: "spring", stiffness: 400, damping: 25 }, y: { type: "spring", stiffness: 400, damping: 25 } }}
            className="h-full"
        >
            <Card className="h-full flex flex-col group overflow-hidden border-border/80 hover:border-accent/40 hover:shadow-2xl hover:shadow-accent/5 bg-surface/90 backdrop-blur-sm transition-all duration-300 rounded-2xl">
                <CardHeader className="pb-4">
                    <div className="flex justify-between items-start mb-2">
                        <CardTitle className="text-2xl font-medium tracking-tight group-hover:text-accent transition-colors duration-300">{item.name}</CardTitle>
                        <div className="flex gap-2">
                            <Badge className="bg-surface border-border/60 text-xs font-semibold text-secondary">{item.price_tier}</Badge>
                            <Badge className="bg-surface border-border/60 text-xs font-semibold text-secondary">{item.difficulty_level}</Badge>
                        </div>
                    </div>
                    <CardDescription className="text-[15px] font-normal text-secondary/100 leading-relaxed max-w-[95%]">{item.description}</CardDescription>
                </CardHeader>

                <CardContent className="flex-grow space-y-5">
                    <div className="flex flex-wrap gap-2">
                        {item.tags.map(tag => (
                            <span key={tag} className="text-[11px] uppercase tracking-wider font-semibold text-tertiary px-2.5 py-1 rounded-md bg-secondary/5 border border-border/50 group-hover:bg-accent/5 group-hover:text-secondary group-hover:border-accent/20 transition-all duration-300">
                                {tag}
                            </span>
                        ))}
                    </div>

                    <div className="p-4 mt-6 rounded-xl bg-accent/5 border border-accent/10 transition-all duration-500 overflow-hidden relative group-hover:bg-accent/10 group-hover:border-accent/20">
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        />
                        <p className="text-sm font-medium text-foreground/95 flex items-start gap-3 leading-relaxed relative z-10">
                            <span className="text-accent mt-[2px] opacity-90 drop-shadow-sm">✦</span>
                            {item.why_fits}
                        </p>
                    </div>
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
