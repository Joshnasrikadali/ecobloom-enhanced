"""EcoGuide: a privacy-friendly sustainability assistant.

It uses the OpenAI Responses API only when OPENAI_API_KEY is configured.
Without a key it provides focused local advice, so the college demo runs offline.
"""

import json
import os
from urllib.error import URLError
from urllib.request import Request, urlopen


SYSTEM_PROMPT = """You are EcoGuide, a warm, practical sustainability coach for Indian college students.
Give short, realistic suggestions about carbon footprint, electricity, travel, food and shopping.
Avoid guilt and unsupported precise claims. Offer one achievable next action. Do not provide medical,
legal, or financial advice."""


def local_reply(message):
    text = (message or "").lower()
    if any(word in text for word in ("travel", "car", "bus", "bike", "commute", "transport")):
        return "For short trips, walking, cycling, or sharing a ride usually cuts the biggest transport impact. Try one car-free or shared-ride trip this week and compare it in your calculator."
    if any(word in text for word in ("electricity", "fan", "ac", "air conditioner", "bill", "energy")):
        return "Start with the appliances you use every day: set the AC a little warmer, switch off standby power, and use daylight when possible. Pick one habit for seven days and check whether your next bill changes."
    if any(word in text for word in ("food", "meat", "dairy", "meal")):
        return "You do not need a perfect diet. Replacing one meat-heavy meal each week with a balanced plant-based meal is a realistic first experiment; reducing food waste matters too."
    if any(word in text for word in ("shopping", "clothes", "phone", "buy")):
        return "Before buying, ask: can I borrow, repair, reuse, or buy second-hand? Keeping electronics and clothes in use longer is often more practical than buying a new 'eco' product."
    return "I can help you turn a big sustainability goal into one small action. Ask me about your commute, electricity bill, food, or shopping habits. A good start: choose one repeatable habit for this week."


def openai_reply(message):
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        return None
    payload = json.dumps({
        "model": os.getenv("OPENAI_MODEL", "gpt-5"),
        "instructions": SYSTEM_PROMPT,
        "input": message,
        "max_output_tokens": 220,
    }).encode("utf-8")
    request = Request(
        "https://api.openai.com/v1/responses",
        data=payload,
        headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urlopen(request, timeout=15) as response:
            result = json.loads(response.read().decode("utf-8"))
        return result.get("output_text") or None
    except (URLError, ValueError, KeyError):
        return None


def reply_to(message):
    return openai_reply(message) or local_reply(message)
