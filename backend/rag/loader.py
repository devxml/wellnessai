import json
import os
import chromadb
from chromadb.utils import embedding_functions
from pathlib import Path

KNOWLEDGE_BASE_DIR = Path(__file__).parent.parent / "knowledge_base"
CHROMA_DB_PATH = Path(__file__).parent.parent / "chroma_db"

# Use sentence transformers for local embeddings (no API cost)
embedding_fn = embedding_functions.SentenceTransformerEmbeddingFunction(
    model_name="all-MiniLM-L6-v2"
)

def get_chroma_client():
    return chromadb.PersistentClient(path=str(CHROMA_DB_PATH))

def load_food_knowledge_base():
    """Load Indian foods into ChromaDB."""
    client = get_chroma_client()
    
    try:
        collection = client.get_collection("indian_foods", embedding_function=embedding_fn)
        if collection.count() > 0:
            return collection
    except Exception:
        pass
    
    collection = client.get_or_create_collection(
        "indian_foods", 
        embedding_function=embedding_fn
    )
    
    with open(KNOWLEDGE_BASE_DIR / "indian_foods.json") as f:
        foods = json.load(f)
    
    documents, metadatas, ids = [], [], []
    for i, food in enumerate(foods):
        text = (
            f"{food['name']} is a {food['category']} food. "
            f"It has {food['protein_g']}g protein, {food['calories_per_100g']} calories per 100g. "
            f"Budget: {food['budget']}. Available: {food['availability']}. "
            f"Tags: {', '.join(food['tags'])}. "
            f"Benefits: {', '.join(food.get('benefits', []))}."
        )
        documents.append(text)
        metadatas.append({
            "name": food["name"],
            "category": food["category"],
            "calories": food["calories_per_100g"],
            "protein": food["protein_g"],
            "carbs": food["carbs_g"],
            "fat": food["fat_g"],
            "budget": food["budget"],
            "diet_types": ",".join(food["diet_types"]),
            "tags": ",".join(food["tags"]),
        })
        ids.append(f"food_{i}")
    
    collection.add(documents=documents, metadatas=metadatas, ids=ids)
    return collection


def load_skincare_knowledge_base():
    """Load skincare ingredients into ChromaDB."""
    client = get_chroma_client()
    
    try:
        collection = client.get_collection("skincare_ingredients", embedding_function=embedding_fn)
        if collection.count() > 0:
            return collection
    except Exception:
        pass

    collection = client.get_or_create_collection(
        "skincare_ingredients",
        embedding_function=embedding_fn
    )
    
    with open(KNOWLEDGE_BASE_DIR / "skincare_ingredients.json") as f:
        ingredients = json.load(f)
    
    documents, metadatas, ids = [], [], []
    for i, ing in enumerate(ingredients):
        text = (
            f"{ing['ingredient']} at {ing['percentage']}. "
            f"Benefits: {', '.join(ing['benefits'])}. "
            f"Best for skin types: {', '.join(ing['suitable_for'])}. "
            f"Addresses: {', '.join(ing['concerns_addressed'])}. "
            f"Used as: {ing['product_type']}. When: {ing['when_to_use']}."
        )
        documents.append(text)
        metadatas.append({
            "ingredient": ing["ingredient"],
            "product_type": ing["product_type"],
            "when_to_use": ing["when_to_use"],
            "suitable_for": ",".join(ing["suitable_for"]),
            "concerns": ",".join(ing["concerns_addressed"]),
            "brands": ",".join(ing["india_brands"]),
            "price_range": ing["price_range_inr"],
            "avoid_combining": ",".join(ing.get("avoid_combining_with", [])),
        })
        ids.append(f"skin_{i}")
    
    collection.add(documents=documents, metadatas=metadatas, ids=ids)
    return collection


def load_haircare_knowledge_base():
    """Load haircare ingredients into ChromaDB."""
    client = get_chroma_client()
    
    try:
        collection = client.get_collection("haircare_ingredients", embedding_function=embedding_fn)
        if collection.count() > 0:
            return collection
    except Exception:
        pass

    collection = client.get_or_create_collection(
        "haircare_ingredients",
        embedding_function=embedding_fn
    )
    
    with open(KNOWLEDGE_BASE_DIR / "haircare_ingredients.json") as f:
        ingredients = json.load(f)
    
    documents, metadatas, ids = [], [], []
    for i, ing in enumerate(ingredients):
        text = (
            f"{ing['ingredient']}. "
            f"Benefits: {', '.join(ing['benefits'])}. "
            f"Suitable scalp: {', '.join(ing['suitable_for_scalp'])}. "
            f"Addresses: {', '.join(ing['concerns_addressed'])}. "
            f"Product type: {ing['product_type']}."
        )
        documents.append(text)
        metadatas.append({
            "ingredient": ing["ingredient"],
            "product_type": ing["product_type"],
            "concerns": ",".join(ing["concerns_addressed"]),
            "scalp_types": ",".join(ing["suitable_for_scalp"]),
            "brands": ",".join(ing["india_brands"]),
            "price_range": ing["price_range_inr"],
            "diy": ing.get("diy", ""),
        })
        ids.append(f"hair_{i}")
    
    collection.add(documents=documents, metadatas=metadatas, ids=ids)
    return collection


def search_foods(query: str, diet_type: str = None, n_results: int = 10):
    collection = load_food_knowledge_base()
    where = None
    results = collection.query(query_texts=[query], n_results=n_results, where=where)
    return results["metadatas"][0] if results["metadatas"] else []


def search_skincare(query: str, n_results: int = 8):
    collection = load_skincare_knowledge_base()
    results = collection.query(query_texts=[query], n_results=n_results)
    return results["metadatas"][0] if results["metadatas"] else []


def search_haircare(query: str, n_results: int = 8):
    collection = load_haircare_knowledge_base()
    results = collection.query(query_texts=[query], n_results=n_results)
    return results["metadatas"][0] if results["metadatas"] else []
