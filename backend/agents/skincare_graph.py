import json
from typing import TypedDict, List
from langgraph.graph import StateGraph, END
from langchain.prompts import ChatPromptTemplate
from schemas.planner_schemas import SkincareInput
from rag.loader import search_skincare
from llm_provider import get_llm


class SkincareState(TypedDict):
    user_input: dict
    ingredient_data: List[dict]
    routine: dict
    error: str


def fetch_ingredients(state: SkincareState) -> SkincareState:
    """Node 1: RAG fetch relevant skincare ingredients."""
    inp = state["user_input"]
    concerns = inp.get("concerns", [])
    skin_type = inp.get("skin_type", "normal")
    
    query = f"skincare ingredients for {skin_type} skin with {', '.join(concerns)}"
    ingredient_data = search_skincare(query, n_results=10)
    
    return {**state, "ingredient_data": ingredient_data}


def check_conflicts(state: SkincareState) -> SkincareState:
    """Node 2: Identify ingredient conflicts before building routine."""
    # Pass through — conflict checking is handled in the LLM generation step
    return state


def generate_skincare_routine(state: SkincareState) -> SkincareState:
    """Node 3: LLM generates full AM/PM skincare routine."""
    inp = state["user_input"]
    ingredient_data = state["ingredient_data"]
    
    ingredient_context = json.dumps(ingredient_data, indent=2)
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", """You are an expert Indian dermatologist and skincare specialist.
You MUST recommend only products/brands available in India (available on Nykaa, Flipkart, Amazon India).
Return valid JSON only. No extra text, no markdown fences.

Important rules:
- Always include SPF in AM routine as final step
- Never combine Retinol + AHA on same night
- Never combine strong Vitamin C + Niacinamide (use one in AM, one in PM if needed)
- For sensitive skin: avoid high % acids, start slow
- For dry skin: avoid salicylic acid cleansers, use gentle hydrating cleansers
- Suggest Indian brands like Minimalist, Dot & Key, Plum, Mamaearth, Re'equil, Derma Co, Pilgrim
- Include exact product names and prices in INR"""),
        ("human", """User Profile:
Skin Type: {skin_type}
Concerns: {concerns}
Budget: {budget}
Current Products: {current_products}
City: {city}
Age: {age}

Relevant Skincare Ingredients Data:
{ingredient_context}

Generate a complete skincare routine. Return JSON matching this structure:
{{
  "am_routine": [
    {{
      "step_number": 1,
      "product_type": "Cleanser",
      "active_ingredient": "...",
      "how_to_use": "...",
      "why_this_works": "...",
      "india_product_suggestions": ["Brand Name Product - ₹XXX"],
      "price_range_inr": "XXX-XXX"
    }}
  ],
  "pm_routine": [...],
  "weekly_treatments": ["..."],
  "ingredients_to_use": ["..."],
  "ingredients_to_avoid": ["..."],
  "ingredient_conflicts": ["Don't use X with Y because..."],
  "diet_tips_for_skin": ["..."],
  "general_notes": "..."
}}""")
    ])
    
    llm = get_llm(temperature=0.5)
    chain = prompt | llm
    
    result = chain.invoke({
        "skin_type": inp.get("skin_type"),
        "concerns": ", ".join(inp.get("concerns", [])),
        "budget": inp.get("budget"),
        "current_products": ", ".join(inp.get("current_products", [])) or "None",
        "city": inp.get("city") or "India",
        "age": inp.get("age") or "Not specified",
        "ingredient_context": ingredient_context,
    })
    
    text = result.content.replace("```json", "").replace("```", "").strip()
    routine = json.loads(text)
    
    return {**state, "routine": routine}


def build_skincare_graph():
    graph = StateGraph(SkincareState)
    graph.add_node("fetch_ingredients", fetch_ingredients)
    graph.add_node("check_conflicts", check_conflicts)
    graph.add_node("generate_routine", generate_skincare_routine)
    graph.set_entry_point("fetch_ingredients")
    graph.add_edge("fetch_ingredients", "check_conflicts")
    graph.add_edge("check_conflicts", "generate_routine")
    graph.add_edge("generate_routine", END)
    return graph.compile()


skincare_agent = build_skincare_graph()


async def run_skincare_agent(user_input: SkincareInput) -> dict:
    initial_state: SkincareState = {
        "user_input": user_input.model_dump(),
        "ingredient_data": [],
        "routine": {},
        "error": "",
    }
    result = skincare_agent.invoke(initial_state)
    return result["routine"]
