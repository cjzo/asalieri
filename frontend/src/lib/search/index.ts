import rawTools from './tools.json'

export type ToolResult = {
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

export type SearchResponse = {
    results: ToolResult[]
    ai_examples: string[]
}

type ToolRecord = {
    id: string
    name: string
    category: string
    price_tier: string
    difficulty_level: string
    description: string
    tags: string[]
    use_cases: string[]
    context_relevance: Record<string, number>
}

const TOOLS = rawTools as ToolRecord[]

const CONTEXT_WEIGHT = 0.6
const INTENT_WEIGHT = 0.4
const RELEVANCE_FLOOR = 0.1
const SCORE_THRESHOLD = 0.1

function tokenize(text: string): string[] {
    return text.toLowerCase().split(/\s+/).filter(Boolean)
}

function intentScore(query: string, tags: string[], useCases: string[]): number {
    const queryWords = new Set(tokenize(query))
    if (queryWords.size === 0) return 0

    const target = new Set<string>()
    for (const tag of tags) for (const w of tokenize(tag)) target.add(w)
    for (const uc of useCases) for (const w of tokenize(uc)) target.add(w)

    let overlap = 0
    for (const w of queryWords) if (target.has(w)) overlap++
    return overlap / queryWords.size
}

function rankTools(query: string, context: string): ToolResult[] {
    const contextKey = context.toLowerCase()
    const results: ToolResult[] = []

    for (const tool of TOOLS) {
        const contextRelevance = tool.context_relevance[contextKey] ?? RELEVANCE_FLOOR
        const intent = intentScore(query, tool.tags, tool.use_cases)
        const score = CONTEXT_WEIGHT * contextRelevance + INTENT_WEIGHT * intent

        if (score <= SCORE_THRESHOLD) continue

        const whyFits = query
            ? `Highly relevant for ${context}s looking for ${query} tools.`
            : `Good choice for ${context}s.`

        results.push({
            id: tool.id,
            name: tool.name,
            category: tool.category,
            price_tier: tool.price_tier,
            difficulty_level: tool.difficulty_level,
            description: tool.description,
            tags: tool.tags,
            use_cases: tool.use_cases,
            score,
            why_fits: whyFits,
        })
    }

    results.sort((a, b) => b.score - a.score)
    return results
}

function fallbackExamples(query: string, context: string, tools: ToolResult[]): string[] {
    if (!query.trim()) return []
    const topTools = tools.slice(0, 3).map(t => t.name).join(', ') || 'a few different tools'
    return [
        `As a ${context}, I'd start by looking at ${topTools} for "${query}".`,
        `From there, I'd evaluate pricing, integration effort, and how well each tool fits your existing stack.`,
        `Once you've narrowed it down, try a small, low-risk experiment before committing fully.`,
    ]
}

/**
 * Perform a fully client-side search — mirrors the shape of the backend
 * /api/search endpoint so the UI doesn't care which one is wired up.
 */
export function searchTools(query: string, context: string): SearchResponse {
    const results = rankTools(query, context)
    return {
        results,
        ai_examples: fallbackExamples(query, context, results),
    }
}
