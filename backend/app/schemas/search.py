from pydantic import BaseModel
from typing import List, Optional, Dict

class SearchRequest(BaseModel):
    query: str
    context: str

class ToolResult(BaseModel):
    id: str
    name: str
    category: str
    price_tier: str
    difficulty_level: str
    description: str
    tags: List[str]
    use_cases: List[str]
    score: float
    why_fits: str

class SearchResponse(BaseModel):
    results: List[ToolResult]
