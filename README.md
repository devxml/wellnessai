<div align="center">

# 🌿 WellnessAI

### India's first AI-powered wellness platform

**Personalised Diet · Skincare · Haircare plans — built for Indian ingredients, budgets & lifestyles**

</div>

---

## 📸 Screenshots

### 🏠 Dashboard

![Dashboard](./assets/screenshots/dashboard.png)


---

### 🍛 Diet Planner

#### Workflow
![Diet Planner Workflow](assets/svgs/diet-workflow.png)

#### Generated Plan
![diet generation](./assets/screenshots/diet-planner.png)


---

### ✨ Skincare Planner

#### Workflow
![Skincare Planner Workflow](assets/svgs/skincare-workflow.png)

#### Generated Routine
![skincare generation](./assets/screenshots/skincare-planner.png)

---

### 💆 Haircare Planner

#### Workflow
![Haircare Planner Workflow](assets/svgs/haircare-workflow.png)

#### Generated Plan
![haircare generation](./assets/screenshots/haircare-planner.png)

---

## ✨ What it does

No quinoa. No retinol creams from iHerb. No western-centric advice.

WellnessAI generates personalised wellness plans built around **Indian food, Indian skincare brands, and Indian haircare traditions** — all powered by a LangGraph AI agent with RAG (Retrieval Augmented Generation).

| Planner | What you get |
|---|---|
| 🍛 **Diet** | 7-day Indian meal plan with macros, shopping list & weekly ₹ cost estimate |
| ✨ **Skincare** | AM + PM routine with ingredient conflict detection and Indian-available brands |
| 💆 **Haircare** | Porosity-aware routine + DIY amla/methi remedies + India brand suggestions |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│           Next.js 14 (Frontend)                  │
│   Landing → Select Planner → Quiz → Plan         │
└───────────────────┬─────────────────────────────┘
                    │ REST API
┌───────────────────▼─────────────────────────────┐
│           FastAPI + Uvicorn (Backend)            │
│   /diet  /skincare  /haircare                    │
└───────────────────┬─────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────┐
│         LangGraph Agent Core                     │
│  ┌─────────────┐  ┌────────────────────────┐    │
│  │  LangChain  │  │  RAG (ChromaDB local)  │    │
│  │  Chains     │  │  sentence-transformers │    │
│  └─────────────┘  └────────────────────────┘    │
│  ┌──────────────────────────────────────────┐   │
│  │   Pydantic v2 (strict I/O contracts)     │   │
│  └──────────────────────────────────────────┘   │
└───────────────────┬─────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────┐
│  MongoDB Atlas (plan history)                    │
│  ChromaDB (vector store — local, auto-created)  │
└─────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Tech |
|---|---|
| **Frontend** | Next.js 14 (App Router), Tailwind CSS, Framer Motion |
| **Backend** | FastAPI, Uvicorn, Python 3.11 |
| **AI Orchestration** | LangGraph (stateful multi-step agents) |
| **LLM Framework** | LangChain (chains, RAG, prompts) |
| **LLM** | Gemini-2.5-Flash (default) or Groq qwen/qwen3-32b |
| **Vector DB** | ChromaDB (local, persistent, auto-created on startup) |
| **Embeddings** | sentence-transformers `all-MiniLM-L6-v2` (free, local) |
| **Database** | MongoDB Atlas (plan history) |
| **Schema Validation** | Pydantic v2 |

---

## 📁 Project Structure

```
wellnessai/
├── assets/
│   ├── screenshots/          ← Add your screenshots here
│   └── svgs/
│       ├── diet-workflow.svg
│       ├── skincare-workflow.svg
│       └── haircare-workflow.svg
│
├── backend/
│   ├── main.py               ← FastAPI app + startup
│   ├── config.py             ← Pydantic settings
│   ├── llm_provider.py       ← Gemini / Groq factory
│   ├── agents/
│   │   ├── diet_graph.py     ← LangGraph diet agent
│   │   ├── skincare_graph.py ← LangGraph skincare agent
│   │   └── haircare_graph.py ← LangGraph haircare agent
│   ├── schemas/
│   │   └── planner_schemas.py
│   ├── rag/
│   │   └── loader.py         ← ChromaDB RAG loader
│   ├── routers/
│   │   └── planners.py       ← API routes
│   └── knowledge_base/
│       ├── indian_foods.json
│       ├── skincare_ingredients.json
│       └── haircare_ingredients.json
│
├── frontend/
│   ├── app/
│   │   ├── page.tsx          ← Landing page
│   │   ├── diet/             ← Diet quiz + plan display
│   │   ├── skincare/         ← Skincare quiz + routine display
│   │   └── haircare/         ← Haircare quiz + plan display
│   ├── components/
│   │   ├── QuizStepper.tsx
│   │   └── OptionSelectors.tsx
│   └── lib/
│       └── api.ts
│
├── .gitignore
├── docker-compose.yml
├── setup.sh
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites

- Python 3.11+
- Node.js 18+
- A free API key from [Google AI Studio](https://aistudio.google.com) (Gemini) **or** [Groq](https://console.groq.com)
- MongoDB Atlas free cluster ([cloud.mongodb.com](https://cloud.mongodb.com))

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/wellnessai.git
cd wellnessai
```

### 2. Backend setup

```bash
cd backend

# Create and activate virtual environment
python -m venv venv

# Windows (Command Prompt)
venv\Scripts\activate
# Mac / Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env from template
cp .env.example .env
```

Edit `backend/.env`:

```env
# Choose ONE provider
GEMINI_API_KEY=your_gemini_key_here
GROQ_API_KEY=your_groq_key_here
LLM_PROVIDER=gemini                # or "groq"

# MongoDB Atlas connection string
MONGODB_URL=mongodb+srv://user:password@cluster.mongodb.net/
MONGODB_DB=wellnessai
```

### 3. Frontend setup

```bash
cd frontend
npm install
cp .env.local.example .env.local
```

### 4. Run

**Terminal 1 — Backend:**
```bash
cd backend
venv\Scripts\activate       # Windows
# source venv/bin/activate  # Mac/Linux
uvicorn main:app --reload --port 8000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** 

> API docs at **[http://localhost:8000/docs](http://localhost:8000/docs)**

---

## 🐳 Docker 

```bash
# Fill backend/.env first, then:
docker-compose up --build
```

---

## 🔑 Free API Keys

| Provider | Model | Free Tier | Link |
|---|---|---|---|
| Google Gemini | `gemini-2.5-flash` | 15 RPM, 1M tokens/day | [aistudio.google.com](https://aistudio.google.com) |
| Groq | `qwen/qwen3-32b` | 30 RPM, 500K tokens/day | [console.groq.com](https://console.groq.com) |

---

## 🤖 How the AI Works

Each planner is a **LangGraph stateful agent**:

```
Diet:      [Quiz Input] → [Validate] → [RAG Food Search] → [LLM 7-day Plan] → [Format JSON] → END
Skincare:  [Quiz Input] → [RAG Ingredients] → [Conflict Check] → [LLM Routine] → [Format JSON] → END
Haircare:  [Quiz Input] → [RAG Ingredients] → [Porosity Filter] → [LLM Plan] → [Format JSON] → END
```

**RAG (Retrieval Augmented Generation):**
Knowledge bases are embedded locally with `sentence-transformers/all-MiniLM-L6-v2` into ChromaDB on first startup. Semantic search finds the most relevant ingredients/foods for each user profile before the LLM call — giving the LLM accurate, India-specific context.

---

## 📡 API Reference

```
POST  /api/v1/planner/diet       →  DietInput       →  7-day meal plan
POST  /api/v1/planner/skincare   →  SkincareInput   →  AM/PM routine
POST  /api/v1/planner/haircare   →  HaircareInput   →  Full haircare plan
GET   /docs                      →  Swagger UI
```

---


## 📄 License

[MIT](LICENSE) — free to use, modify and distribute.

