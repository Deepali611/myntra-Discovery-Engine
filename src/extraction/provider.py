"""
AI Provider abstraction module.
Configured via environment variables (AI_PROVIDER=groq | gemini).
Uses groq or gemini with robust retries and fallback.
"""

import os
import json
import time
import re
from typing import Dict, Any, Optional
from dotenv import load_dotenv

# Safely load .env if present in root, without hardcoding Windows paths
try:
    load_dotenv()
except Exception:
    pass

class AIProvider:
    def __init__(self):
        self.groq_key = os.getenv("GROQ_API_KEY")
        self.gemini_key = os.getenv("GEMINI_API_KEY")
        
        explicit_provider = os.getenv("AI_PROVIDER", "").lower().strip()

        if explicit_provider == "groq" and self.groq_key:
            self.provider = "groq"
        elif explicit_provider == "gemini" and self.gemini_key:
            self.provider = "gemini"
        elif self.groq_key:
            self.provider = "groq"
        elif self.gemini_key:
            self.provider = "gemini"
        else:
            raise ValueError("Neither GROQ_API_KEY nor GEMINI_API_KEY is configured in environment variables.")

        if self.provider == "groq":
            import groq
            self.client = groq.Groq(api_key=self.groq_key)
            self.model_name = "openai/gpt-oss-20b"
        elif self.provider == "gemini":
            from google import genai
            self.client = genai.Client(api_key=self.gemini_key)
            self.model_name = "gemini-3.6-flash"

    def extract(self, prompt: str, system_instruction: Optional[str] = None) -> Dict[str, Any]:
        """
        Executes prompt against configured AI provider.
        """
        full_system = system_instruction or "You are a precise data extraction AI. Output strictly valid JSON matching requested structure. Do not include markdown code blocks or explanatory conversational text."

        last_error = None

        for attempt in range(1, 4):
            try:
                if self.provider == "groq":
                    response = self.client.chat.completions.create(
                        model=self.model_name,
                        messages=[
                            {"role": "system", "content": full_system},
                            {"role": "user", "content": prompt}
                        ],
                        response_format={"type": "json_object"},
                        temperature=0.1
                    )
                    raw_text = response.choices[0].message.content
                elif self.provider == "gemini":
                    from google.genai import types
                    full_prompt = f"{full_system}\n\n{prompt}"
                    response = self.client.models.generate_content(
                        model=self.model_name,
                        contents=full_prompt,
                        config=types.GenerateContentConfig(
                            response_mime_type="application/json",
                            temperature=0.1
                        )
                    )
                    raw_text = response.text
                
                # Parse JSON
                cleaned_text = raw_text.strip()
                if cleaned_text.startswith("```"):
                    cleaned_text = re.sub(r"^```[a-z]*\n?", "", cleaned_text)
                    cleaned_text = re.sub(r"\n?```$", "", cleaned_text)
                cleaned_text = cleaned_text.strip()
                
                return json.loads(cleaned_text)

            except Exception as e:
                last_error = str(e)
                time.sleep(1 * attempt)

        raise RuntimeError(f"Extraction failed for provider {self.provider}: {last_error}")

def get_client() -> AIProvider:
    return AIProvider()
