#!/bin/bash
# WellnessAI - Local Development Setup (No Docker)
# Run: chmod +x setup.sh && ./setup.sh

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}"
echo "╔══════════════════════════════════════╗"
echo "║       WellnessAI — Local Setup       ║"
echo "╚══════════════════════════════════════╝"
echo -e "${NC}"

# ─── Backend setup ─────────────────────────────────────────────────────
echo -e "${GREEN}[1/4] Setting up Python backend...${NC}"
cd backend

if [ ! -f ".env" ]; then
  cp .env.example .env
  echo -e "${YELLOW}⚠️  Created backend/.env — fill in your GEMINI_API_KEY or GROQ_API_KEY${NC}"
fi

python3 -m venv venv 2>/dev/null || true
source venv/bin/activate

pip install -r requirements.txt -q
echo -e "${GREEN}✅ Backend dependencies installed${NC}"
cd ..

# ─── Frontend setup ────────────────────────────────────────────────────
echo -e "${GREEN}[2/4] Setting up Next.js frontend...${NC}"
cd frontend

if [ ! -f ".env.local" ]; then
  cp .env.local.example .env.local
  echo -e "${GREEN}✅ Created frontend/.env.local${NC}"
fi

npm install --silent
echo -e "${GREEN}✅ Frontend dependencies installed${NC}"
cd ..

# ─── Done ──────────────────────────────────────────────────────────────
echo ""
echo -e "${BLUE}╔══════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Setup complete! To start:                           ║${NC}"
echo -e "${BLUE}║                                                      ║${NC}"
echo -e "${BLUE}║  Terminal 1 (backend):                               ║${NC}"
echo -e "${BLUE}║    cd backend && source venv/bin/activate            ║${NC}"
echo -e "${BLUE}║    uvicorn main:app --reload --port 8000             ║${NC}"
echo -e "${BLUE}║                                                      ║${NC}"
echo -e "${BLUE}║  Terminal 2 (frontend):                              ║${NC}"
echo -e "${BLUE}║    cd frontend && npm run dev                        ║${NC}"
echo -e "${BLUE}║                                                      ║${NC}"
echo -e "${BLUE}║  Open: http://localhost:3000                         ║${NC}"
echo -e "${BLUE}║  API docs: http://localhost:8000/docs                ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}📝 Don't forget: Add your API key to backend/.env${NC}"
echo -e "   GEMINI_API_KEY=your_key  (get from aistudio.google.com)"
echo -e "   GROQ_API_KEY=your_key    (get from console.groq.com)"
echo -e "   LLM_PROVIDER=gemini      (or groq)"
