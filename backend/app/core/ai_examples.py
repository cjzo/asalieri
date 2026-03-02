import os
from typing import List

from app.schemas.search import ToolResult


def _fallback_examples(query: str, context: str, tools: List[ToolResult]) -> List[str]:
    top_tools = ", ".join(tool.name for tool in tools[:3]) or "a few different tools"
    return [
        f"As a {context}, I'd start by looking at {top_tools} for \"{query}\".",
        "From there, I'd evaluate pricing, integration effort, and how well each tool fits your existing stack.",
        "Once you've narrowed it down, try a small, low-risk experiment before committing fully.",
    ]


def generate_ai_examples(query: str, context: str, tools: List[ToolResult]) -> List[str]:
    """
    Generate a small set of example AI responses tailored to the user's query and context.

    If the Gemini client or API key is not available, this gracefully falls back to
    deterministic example guidance so the rest of the experience still works.
    """
    # If there's no query yet, don't generate anything
    if not query.strip():
        return []

    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return _fallback_examples(query, context, tools)

    try:
        from google import genai  # type: ignore[import]
    except Exception:
        # Library not installed or unavailable – fall back silently
        return _fallback_examples(query, context, tools)

    client = genai.Client(api_key=api_key)

    # Nicely summarize the top tools so the model can reference them
    tool_summaries = []
    for tool in tools[:5]:
        tool_summaries.append(
            f"- {tool.name} ({tool.category}, {tool.price_tier}, difficulty: {tool.difficulty_level}): "
            f"{tool.description}"
        )

    tools_block = "\n".join(tool_summaries) or "No specific tools matched yet."

    model_name = os.getenv("GEMINI_MODEL_NAME", "gemini-2.0-flash")

    prompt = f"""
You are an expert AI product advisor helping someone choose tools.

User context: "{context}"
User query: "{query}"

Candidate tools:
{tools_block}

Write 2–3 concise example responses an AI assistant like you might give this user.
- Make them concrete, practical, and specific to the context.
- Keep each example on a single line of natural language.
- Do not number the responses.
- Do not ask follow-up questions.
"""

    try:
        response = client.models.generate_content(
            model=model_name,
            contents=prompt.strip(),
        )
    except Exception:
        # Network/API errors should not break the core flow
        return _fallback_examples(query, context, tools)

    text = getattr(response, "text", None) or ""
    if not text.strip():
        return _fallback_examples(query, context, tools)

    examples: List[str] = []
    for line in text.splitlines():
        line = line.strip()
        if not line:
            continue
        if line[0] in ("-", "•", "*"):
            line = line[1:].strip()
        examples.append(line)
        if len(examples) >= 3:
            break

    if not examples:
        return _fallback_examples(query, context, tools)

    return examples

