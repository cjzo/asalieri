from fastapi import APIRouter
from app.schemas.search import SearchRequest, SearchResponse
from app.core.ranking import rank_results

router = APIRouter()

@router.post("/", response_model=SearchResponse)
async def perform_search(request: SearchRequest):
    results = rank_results(request.query, request.context)
    return SearchResponse(results=results)
