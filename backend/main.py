from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from config import settings
from routers.planners import router as planner_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize knowledge bases on startup."""
    print("🚀 WellnessAI backend starting...")
    print("📚 Loading RAG knowledge bases...")
    try:
        from rag.loader import load_food_knowledge_base, load_skincare_knowledge_base, load_haircare_knowledge_base
        load_food_knowledge_base()
        load_skincare_knowledge_base()
        load_haircare_knowledge_base()
        print("✅ Knowledge bases loaded successfully")
    except Exception as e:
        print(f"⚠️  Knowledge base loading failed: {e}")
    yield
    print("👋 WellnessAI backend shutting down...")


app = FastAPI(
    title="WellnessAI API",
    description="India-first Wellness Planner — Diet, Skincare & Haircare",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(planner_router, prefix="/api/v1/planner", tags=["Planners"])


@app.get("/")
async def root():
    return {
        "service": "WellnessAI API",
        "version": "1.0.0",
        "docs": "/docs",
        "planners": ["/api/v1/planner/diet", "/api/v1/planner/skincare", "/api/v1/planner/haircare"],
    }
