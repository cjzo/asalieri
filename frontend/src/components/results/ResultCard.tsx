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
            transition={{ delay: index * 0.1, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        >
            <Card className="h-full flex flex-col group overflow-hidden hover:border-accent/30 bg-surface/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                    <div className="flex justify-between items-start mb-2">
                        <CardTitle className="text-2xl group-hover:text-accent transition-colors">{item.name}</CardTitle>
                        <div className="flex gap-2">
                            <Badge className="bg-surface border-border text-xs">{item.price_tier}</Badge>
                            <Badge className="bg-surface border-border text-xs">{item.difficulty_level}</Badge>
                        </div>
                    </div>
                    <CardDescription className="text-base text-secondary">{item.description}</CardDescription>
                </CardHeader>

                <CardContent className="flex-grow space-y-4">
                    <div className="flex flex-wrap gap-1.5">
                        {item.tags.map(tag => (
                            <span key={tag} className="text-xs text-tertiary px-2 py-1 rounded-md bg-white/5 border border-white/5">
                                {tag}
                            </span>
                        ))}
                    </div>

                    <div className="p-3 mt-4 rounded-xl bg-accent/5 border border-accent/10">
                        <p className="text-sm text-primary/90 flex items-start gap-2">
                            <span className="text-accent mt-0.5">✦</span>
                            {item.why_fits}
                        </p>
                    </div>
                </CardContent>

                <CardFooter className="pt-4 border-t border-border/50">
                    <Button className="w-full">
                        Explore {item.name}
                    </Button>
                </CardFooter>
            </Card>
        </motion.div>
    )
}
