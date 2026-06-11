from fastapi import APIRouter, HTTPException
from schemas.planner_schemas import DietInput, SkincareInput, HaircareInput
from agents.diet_graph import run_diet_agent
from agents.skincare_graph import run_skincare_agent
from agents.haircare_graph import run_haircare_agent
from datetime import datetime

router = APIRouter()


@router.post("/diet")
async def generate_diet_plan(body: DietInput):
    """Generate a personalized Indian diet plan."""
    try:
        plan = await run_diet_agent(body)
        return {
            "planner_type": "diet",
            "plan": plan,
            "generated_at": datetime.utcnow().isoformat(),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Diet plan generation failed: {str(e)}")


@router.post("/skincare")
async def generate_skincare_routine(body: SkincareInput):
    """Generate a personalized skincare routine."""
    try:
        plan = await run_skincare_agent(body)
        return {
            "planner_type": "skincare",
            "plan": plan,
            "generated_at": datetime.utcnow().isoformat(),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Skincare routine generation failed: {str(e)}")


@router.post("/haircare")
async def generate_haircare_plan(body: HaircareInput):
    """Generate a personalized haircare plan."""
    try:
        plan = await run_haircare_agent(body)
        return {
            "planner_type": "haircare",
            "plan": plan,
            "generated_at": datetime.utcnow().isoformat(),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Haircare plan generation failed: {str(e)}")


@router.get("/health")
async def health_check():
    return {"status": "ok", "service": "WellnessAI Planners"}
