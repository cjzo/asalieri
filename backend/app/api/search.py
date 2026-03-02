from fastapi import APIRouter

from app.schemas.search import SearchRequest, SearchResponse
from app.core.ranking import rank_results
from app.core.ai_examples import generate_ai_examples

router = APIRouter()

@router.post("/", response_model=SearchResponse)
async def perform_search(request: SearchRequest) -> SearchResponse:
    results = rank_results(request.query, request.context)
    ai_examples = generate_ai_examples(request.query, request.context, results)
    return SearchResponse(results=results, ai_examples=ai_examples)
