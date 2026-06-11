from config import settings

def get_llm(temperature: float = 0.7):
    """Returns LLM instance based on configured provider."""
    if settings.LLM_PROVIDER == "gemini":
        from langchain_google_genai import ChatGoogleGenerativeAI
        return ChatGoogleGenerativeAI(
            model="gemini-2.5-flash",
            google_api_key=settings.GEMINI_API_KEY,
            temperature=temperature,
        )
    else:  # groq
        from langchain_groq import ChatGroq
        return ChatGroq(
            model="qwen/qwen3-32b",
            groq_api_key=settings.GROQ_API_KEY,
            temperature=temperature,
        )
