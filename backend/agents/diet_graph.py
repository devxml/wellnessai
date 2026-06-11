import json
from typing import TypedDict, List, Any
from langgraph.graph import StateGraph, END
from langchain.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from schemas.planner_schemas import DietInput, DietPlan
from rag.loader import search_foods
from llm_provider import get_llm


class DietState(TypedDict):
    user_input: dict
    food_data: List[dict]
    meal_plan: dict
    error: str


def validate_and_fetch_foods(state: DietState) -> DietState:
    """Node 1: Validate input & RAG fetch relevant foods."""
    inp = state["user_input"]
    
    # Build search query from user selections
    selected = inp.get("selected_foods", [])
    goal = inp.get("goal", "general_health")
    diet_type = inp.get("diet_type", "veg")
    budget = inp.get("budget", "low")
    
    query = f"{diet_type} foods for {goal} with {', '.join(selected)} budget {budget} indian foods"
    food_data = search_foods(query, diet_type=diet_type, n_results=15)
    
    return {**state, "food_data": food_data}


def generate_meal_plan(state: DietState) -> DietState:
    """Node 2: LLM generates 7-day meal plan."""
    inp = state["user_input"]
    food_data = state["food_data"]
    
    food_context = json.dumps(food_data, indent=2)
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", """You are an expert Indian nutritionist creating personalized meal plans.
You MUST use only easily available Indian foods. Suggest real Indian dishes, not generic foods.
Always return valid JSON only. No extra text, no markdown fences.

Rules:
- Use foods the user selected
- Respect diet type (veg/non-veg/vegan/eggetarian)
- Respect budget constraints
- Suggest real Indian meal names (like "Moong Dal Khichdi", "Paneer Bhurji", etc.)
- Include preparation tips in Hindi/English mix
- For weight loss: keep calories 1400-1600
- For muscle gain: keep calories 2000-2500, protein >120g/day
- For maintenance: keep calories 1800-2000
- For diabetes: low GI foods, small frequent meals"""),
        ("human", """User Profile:
Diet Type: {diet_type}
Goal: {goal}
Budget: {budget}
Meals Per Day: {meals_per_day}
Selected Foods: {selected_foods}
Allergies: {allergies}
Region: {region}
Weight: {weight}, Height: {height}, Age: {age}

Available Indian Foods Data:
{food_context}

Generate a complete 7-day meal plan. Return JSON matching this structure exactly:
{{
  "title": "...",
  "weekly_meals": [
    {{
      "day": "Monday",
      "breakfast": [{{"name": "...", "quantity": "...", "calories": 0, "protein_g": 0.0, "carbs_g": 0.0, "fat_g": 0.0, "preparation_tip": "..."}}],
      "lunch": [...],
      "snack": [...],
      "dinner": [...],
      "total_calories": 0,
      "total_protein_g": 0.0
    }}
  ],
  "shopping_list": ["..."],
  "estimated_weekly_cost_inr": 0,
  "hydration_tips": ["..."],
  "general_tips": ["..."],
  "weekly_macros_summary": {{"avg_calories": 0, "avg_protein_g": 0.0, "avg_carbs_g": 0.0, "avg_fat_g": 0.0}}
}}""")
    ])
    
    llm = get_llm(temperature=0.6)
    chain = prompt | llm
    
    result = chain.invoke({
        "diet_type": inp.get("diet_type"),
        "goal": inp.get("goal"),
        "budget": inp.get("budget"),
        "meals_per_day": inp.get("meals_per_day", 3),
        "selected_foods": ", ".join(inp.get("selected_foods", [])),
        "allergies": ", ".join(inp.get("allergies", [])) or "None",
        "region": inp.get("region") or "General India",
        "weight": f"{inp.get('weight_kg')}kg" if inp.get("weight_kg") else "Not provided",
        "height": f"{inp.get('height_cm')}cm" if inp.get("height_cm") else "Not provided",
        "age": inp.get("age") or "Not provided",
        "food_context": food_context,
    })
    
    text = result.content
    # Strip markdown fences if present
    text = text.replace("```json", "").replace("```", "").strip()
    meal_plan = json.loads(text)
    
    return {**state, "meal_plan": meal_plan}


def build_diet_graph():
    graph = StateGraph(DietState)
    graph.add_node("fetch_foods", validate_and_fetch_foods)
    graph.add_node("generate_plan", generate_meal_plan)
    graph.set_entry_point("fetch_foods")
    graph.add_edge("fetch_foods", "generate_plan")
    graph.add_edge("generate_plan", END)
    return graph.compile()


diet_agent = build_diet_graph()


async def run_diet_agent(user_input: DietInput) -> dict:
    initial_state: DietState = {
        "user_input": user_input.model_dump(),
        "food_data": [],
        "meal_plan": {},
        "error": "",
    }
    result = diet_agent.invoke(initial_state)
    return result["meal_plan"]
