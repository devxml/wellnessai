from pydantic import BaseModel, Field
from typing import List, Optional, Literal
from enum import Enum


# ─── DIET SCHEMAS ─────────────────────────────────────────────────────────────

class DietType(str, Enum):
    veg = "veg"
    non_veg = "non_veg"
    eggetarian = "eggetarian"
    vegan = "vegan"

class DietGoal(str, Enum):
    weight_loss = "weight_loss"
    muscle_gain = "muscle_gain"
    maintenance = "maintenance"
    diabetes_management = "diabetes_management"
    general_health = "general_health"

class BudgetRange(str, Enum):
    low = "under_100"        # Under ₹100/day
    medium = "100_to_200"    # ₹100–₹200/day
    high = "above_200"       # ₹200+/day

class MealsPerDay(int, Enum):
    three = 3
    four = 4
    five = 5

class DietInput(BaseModel):
    diet_type: DietType
    goal: DietGoal
    budget: BudgetRange
    meals_per_day: MealsPerDay = MealsPerDay.three
    selected_foods: List[str] = Field(min_length=1)   # e.g. ["dal", "paneer", "eggs"]
    allergies: List[str] = []
    region: Optional[str] = None                       # e.g. "Maharashtra", "Punjab"
    weight_kg: Optional[float] = None
    height_cm: Optional[float] = None
    age: Optional[int] = None

class MealItem(BaseModel):
    name: str
    quantity: str
    calories: int
    protein_g: float
    carbs_g: float
    fat_g: float
    preparation_tip: Optional[str] = None

class DailyMeal(BaseModel):
    day: str
    breakfast: List[MealItem]
    lunch: List[MealItem]
    snack: Optional[List[MealItem]] = None
    dinner: List[MealItem]
    total_calories: int
    total_protein_g: float

class DietPlan(BaseModel):
    title: str
    weekly_meals: List[DailyMeal]
    shopping_list: List[str]
    estimated_weekly_cost_inr: int
    hydration_tips: List[str]
    general_tips: List[str]
    weekly_macros_summary: dict


# ─── SKINCARE SCHEMAS ──────────────────────────────────────────────────────────

class SkinType(str, Enum):
    oily = "oily"
    dry = "dry"
    combination = "combination"
    sensitive = "sensitive"
    normal = "normal"

class SkincareBudget(str, Enum):
    low = "under_500"
    medium = "500_to_1500"
    high = "above_1500"

class SkincareInput(BaseModel):
    skin_type: SkinType
    concerns: List[str] = Field(min_length=1)
    # concerns can be: dull_skin, pigmentation, dark_spots, acne, anti_aging,
    # uneven_tone, large_pores, blackheads, redness
    budget: SkincareBudget
    current_products: List[str] = []
    city: Optional[str] = None
    age: Optional[int] = None

class RoutineStep(BaseModel):
    step_number: int
    product_type: str      # e.g. "Cleanser", "Vitamin C Serum"
    active_ingredient: str  # e.g. "Niacinamide 10%"
    how_to_use: str
    why_this_works: str
    india_product_suggestions: List[str]  # Actual Indian brand names
    price_range_inr: str

class SkincareRoutine(BaseModel):
    am_routine: List[RoutineStep]
    pm_routine: List[RoutineStep]
    weekly_treatments: List[str]
    ingredients_to_use: List[str]
    ingredients_to_avoid: List[str]
    ingredient_conflicts: List[str]   # e.g. "Don't use Retinol + AHA same night"
    diet_tips_for_skin: List[str]
    general_notes: str


# ─── HAIRCARE SCHEMAS ──────────────────────────────────────────────────────────

class HairType(str, Enum):
    straight = "straight"
    wavy = "wavy"
    curly = "curly"
    coily = "coily"

class HairPorosity(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"

class ScalpType(str, Enum):
    oily = "oily"
    dry = "dry"
    normal = "normal"
    sensitive = "sensitive"
    dandruff_prone = "dandruff_prone"

class HairTexture(str, Enum):
    fine = "fine"
    medium = "medium"
    thick = "thick"
    coarse = "coarse"

class WashFrequency(str, Enum):
    daily = "daily"
    every_2_days = "every_2_days"
    twice_a_week = "twice_a_week"
    once_a_week = "once_a_week"

class HaircareBudget(str, Enum):
    low = "under_300"
    medium = "300_to_800"
    high = "above_800"

class HaircareInput(BaseModel):
    hair_type: HairType
    hair_porosity: HairPorosity
    scalp_type: ScalpType
    hair_texture: HairTexture
    concerns: List[str] = Field(min_length=1)
    # concerns: dandruff, hair_fall, frizz, dryness, split_ends, slow_growth, oily_scalp, color_damaged, heat_damaged
    wash_frequency: WashFrequency
    budget: HaircareBudget
    age: Optional[int] = None

class HaircareStep(BaseModel):
    step: str
    product_type: str
    key_ingredients: List[str]
    how_to_apply: str
    frequency: str
    india_product_suggestions: List[str]
    price_range_inr: str
    diy_alternative: Optional[str] = None  # Kitchen ingredient alternatives

class HaircarePlan(BaseModel):
    pre_wash_routine: List[HaircareStep]
    wash_day_routine: List[HaircareStep]
    post_wash_routine: List[HaircareStep]
    weekly_treatments: List[HaircareStep]
    ingredients_to_look_for: List[str]
    ingredients_to_avoid: List[str]
    diy_home_remedies: List[str]
    diet_tips_for_hair: List[str]
    general_tips: List[str]


# ─── COMMON ────────────────────────────────────────────────────────────────────

class PlannerType(str, Enum):
    diet = "diet"
    skincare = "skincare"
    haircare = "haircare"

class PlanResponse(BaseModel):
    planner_type: PlannerType
    plan: dict
    generated_at: str
