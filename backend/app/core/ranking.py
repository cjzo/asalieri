import json
import os
from typing import List, Dict, Any
from app.schemas.search import ToolResult

MOCK_DATA_PATH = os.path.join(os.path.dirname(__file__), "..", "db", "mock_data.json")

def load_mock_data() -> List[Dict[str, Any]]:
    if not os.path.exists(MOCK_DATA_PATH):
        return []
    with open(MOCK_DATA_PATH, "r") as f:
        return json.load(f)

def calculate_intent_score(query: str, tags: List[str], use_cases: List[str]) -> float:
    # A simple scoring based on keyword overlap
    query_words = set(query.lower().split())
    if not query_words:
        return 0.0

    target_words = set()
    for tag in tags:
        target_words.update(tag.lower().split())
    for uc in use_cases:
        target_words.update(uc.lower().split())

    intersection = query_words.intersection(target_words)
    # Give it a small base score if there are words in common
    return len(intersection) / len(query_words) if query_words else 0.0

def rank_results(query: str, context: str) -> List[ToolResult]:
    data = load_mock_data()
    results = []

    for item in data:
        # Context Match Weight = 0.6, Intent Match Weight = 0.4
        context_relevance = item.get("context_relevance", {}).get(context.lower(), 0.1)  # Default low relevance
        intent_score = calculate_intent_score(query, item.get("tags", []), item.get("use_cases", []))

        total_score = (0.6 * context_relevance) + (0.4 * intent_score)

        if total_score > 0.1:  # Threshold to filter out irrelevant items
            # Generate a dynamic why_fits based on context
            why_fits = f"Highly relevant for {context}s looking for {query} tools." if query else f"Good choice for {context}s."

            results.append(ToolResult(
                id=item["id"],
                name=item["name"],
                category=item["category"],
                price_tier=item["price_tier"],
                difficulty_level=item["difficulty_level"],
                description=item["description"],
                tags=item["tags"],
                use_cases=item["use_cases"],
                score=total_score,
                why_fits=why_fits
            ))

    # Sort by score descending
    results.sort(key=lambda x: x.score, reverse=True)
    return results
