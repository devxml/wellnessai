import json
from typing import TypedDict, List
from langgraph.graph import StateGraph, END
from langchain.prompts import ChatPromptTemplate
from schemas.planner_schemas import HaircareInput
from rag.loader import search_haircare
from llm_provider import get_llm


class HaircareState(TypedDict):
    user_input: dict
    ingredient_data: List[dict]
    haircare_plan: dict
    error: str


def fetch_hair_ingredients(state: HaircareState) -> HaircareState:
    """Node 1: RAG fetch relevant haircare ingredients."""
    inp = state["user_input"]
    concerns = inp.get("concerns", [])
    scalp_type = inp.get("scalp_type", "normal")
    porosity = inp.get("hair_porosity", "medium")
    
    query = f"haircare for {scalp_type} scalp {porosity} porosity hair {', '.join(concerns)}"
    ingredient_data = search_haircare(query, n_results=10)
    
    return {**state, "ingredient_data": ingredient_data}


def generate_haircare_plan(state: HaircareState) -> HaircareState:
    """Node 2: LLM generates full haircare routine."""
    inp = state["user_input"]
    ingredient_data = state["ingredient_data"]
    
    ingredient_context = json.dumps(ingredient_data, indent=2)
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", """You are an expert Indian trichologist and haircare specialist.
You MUST recommend products available in India (Nykaa, Amazon India, local pharmacies).
Return valid JSON only. No extra text, no markdown fences.

Hair Porosity Guide:
- LOW porosity: Hair resists moisture. Use light products, avoid heavy oils like coconut. Steam helps.
- MEDIUM porosity: Most products work. Balanced routine.
- HIGH porosity: Needs protein treatments, heavy moisture. Seal with oils after conditioner.

Indian DIY remedies (amla, methi, onion juice, aloe vera) should be included as alternatives.
Suggest Indian brands: Mamaearth, WOW, Soulflower, Minimalist, Pilgrim, Biotique, Khadi Natural, Parachute Advansed."""),
        ("human", """User Profile:
Hair Type: {hair_type}
Hair Porosity: {hair_porosity}
Scalp Type: {scalp_type}
Hair Texture: {hair_texture}
Concerns: {concerns}
Wash Frequency: {wash_frequency}
Budget: {budget}
Age: {age}

Relevant Haircare Ingredients Data:
{ingredient_context}

Generate a complete haircare routine. Return JSON matching this structure:
{{
  "pre_wash_routine": [
    {{
      "step": "Oil Treatment",
      "product_type": "Hair Oil",
      "key_ingredients": ["..."],
      "how_to_apply": "...",
      "frequency": "...",
      "india_product_suggestions": ["Brand Name - ₹XXX"],
      "price_range_inr": "...",
      "diy_alternative": "..."
    }}
  ],
  "wash_day_routine": [...],
  "post_wash_routine": [...],
  "weekly_treatments": [...],
  "ingredients_to_look_for": ["..."],
  "ingredients_to_avoid": ["..."],
  "diy_home_remedies": ["Remedy name: instructions"],
  "diet_tips_for_hair": ["..."],
  "general_tips": ["..."]
}}""")
    ])
    
    llm = get_llm(temperature=0.6)
    chain = prompt | llm
    
    result = chain.invoke({
        "hair_type": inp.get("hair_type"),
        "hair_porosity": inp.get("hair_porosity"),
        "scalp_type": inp.get("scalp_type"),
        "hair_texture": inp.get("hair_texture"),
        "concerns": ", ".join(inp.get("concerns", [])),
        "wash_frequency": inp.get("wash_frequency"),
        "budget": inp.get("budget"),
        "age": inp.get("age") or "Not specified",
        "ingredient_context": ingredient_context,
    })
    
    text = result.content.replace("```json", "").replace("```", "").strip()
    haircare_plan = json.loads(text)
    
    return {**state, "haircare_plan": haircare_plan}


def build_haircare_graph():
    graph = StateGraph(HaircareState)
    graph.add_node("fetch_ingredients", fetch_hair_ingredients)
    graph.add_node("generate_plan", generate_haircare_plan)
    graph.set_entry_point("fetch_ingredients")
    graph.add_edge("fetch_ingredients", "generate_plan")
    graph.add_edge("generate_plan", END)
    return graph.compile()


haircare_agent = build_haircare_graph()


async def run_haircare_agent(user_input: HaircareInput) -> dict:
    initial_state: HaircareState = {
        "user_input": user_input.model_dump(),
        "ingredient_data": [],
        "haircare_plan": {},
        "error": "",
    }
    result = haircare_agent.invoke(initial_state)
    return result["haircare_plan"]
