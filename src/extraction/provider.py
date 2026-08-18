"""
AI Provider abstraction module.
Configured via .env (AI_PROVIDER=gemini | groq).
Uses gemini-3.6-flash or groq with robust retries.
"""

import os
import json
import time
import re
from typing import Dict, Any, Optional
from dotenv import load_dotenv

load_dotenv(dotenv_path=r"c:\Users\patil\myntra-Discovery-Engine\.env")

class AIProvider:
    def __init__(self):
        self.provider = os.getenv("AI_PROVIDER", "gemini").lower()
        self.gemini_key = os.getenv("GEMINI_API_KEY")
        self.groq_key = os.getenv("GROQ_API_KEY")
        
        if self.provider == "gemini":
            from google import genai
            if not self.gemini_key:
                raise ValueError("GEMINI_API_KEY is missing in .env")
            self.client = genai.Client(api_key=self.gemini_key)
            self.model_name = "gemini-2.5-flash"
        elif self.provider == "groq":
            import groq
            if not self.groq_key:
                raise ValueError("GROQ_API_KEY is missing in .env")
            self.client = groq.Groq(api_key=self.groq_key)
            self.model_name = "openai/gpt-oss-20b"
        else:
            raise ValueError(f"Unsupported AI_PROVIDER: {self.provider}")

    def extract(self, prompt: str, system_instruction: Optional[str] = None) -> Dict[str, Any]:
        """
        Executes prompt against configured AI provider.
        """
        full_system = system_instruction or "You are a precise data extraction AI. Output strictly valid JSON matching requested structure. Do not include markdown code blocks or explanatory conversational text."

        last_error = None

        for attempt in range(1, 4):
            try:
                if self.provider == "gemini":
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
                elif self.provider == "groq":
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
