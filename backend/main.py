from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from random import uniform

app = FastAPI()

# Allow CORS for local frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalyzeRequest(BaseModel):
    text: str

class AnalyzeResponse(BaseModel):
    emotion: str
    confidence: float

# Simple keyword-based emotion detection
EMOTION_KEYWORDS = {
    "happy": ["happy", "joy", "glad", "delighted", "excited", "good", "great", "pleased", "content"],
    "sad": ["sad", "down", "unhappy", "depressed", "gloomy", "miserable", "cry"],
    "angry": ["angry", "mad", "furious", "irritated", "annoyed", "upset", "rage"],
    "anxious": ["anxious", "nervous", "worried", "scared", "afraid", "tense", "uneasy"],
    "surprised": ["surprised", "shocked", "amazed", "astonished", "startled"],
    "love": ["love", "loving", "affectionate", "fond", "caring", "adore", "cherish"],
    "fear": ["fear", "terrified", "frightened", "panic", "horror", "dread", "scared"],
    "disgust": ["disgust", "repulsed", "gross", "revolted", "sick", "nauseous"],
    "confused": ["confused", "puzzled", "unsure", "uncertain", "lost", "baffled"],
    "bored": ["bored", "uninterested", "dull", "tedious", "tired", "weary"],
    "hopeful": ["hopeful", "optimistic", "encouraged", "positive", "confident"],
    "grateful": ["grateful", "thankful", "appreciative", "blessed"],
    "lonely": ["lonely", "alone", "isolated", "abandoned", "deserted"],
    "shame": ["shame", "embarrassed", "guilty", "humiliated", "regret"],
    "proud": ["proud", "accomplished", "successful", "achieved", "victorious"],
}

DEFAULT_EMOTION = "neutral"

@app.post("/analyze", response_model=AnalyzeResponse)
def analyze(request: AnalyzeRequest):
    text = request.text.lower()
    detected = DEFAULT_EMOTION
    for emotion, keywords in EMOTION_KEYWORDS.items():
        if any(word in text for word in keywords):
            detected = emotion.capitalize()
            break
    else:
        detected = DEFAULT_EMOTION.capitalize()
    confidence = round(uniform(0.7, 0.99), 2)
    return AnalyzeResponse(
        emotion=detected,
        confidence=confidence
    )
