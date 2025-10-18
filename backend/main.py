from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, validator
from typing import List, Optional
import os
import sys
import re
import logging
import traceback
from xai_sdk import Client
from xai_sdk.chat import user, system
from xai_sdk.search import SearchParameters, x_source
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ============================================================================
# 🔒 SECURITY FIX #1: API Key Validation
# ============================================================================
XAI_API_KEY = os.getenv("XAI_API_KEY")

if not XAI_API_KEY:
    logger.error("CRITICAL: XAI_API_KEY environment variable is not set")
    print("ERROR: XAI_API_KEY environment variable is not set", file=sys.stderr)
    print("Please set XAI_API_KEY in your backend/.env file", file=sys.stderr)
    sys.exit(1)

if not XAI_API_KEY.startswith("xai-"):
    logger.warning("WARNING: XAI_API_KEY may be invalid (expected format: xai-...)")

logger.info("✓ API key validated successfully")

# Initialize xAI client
client = Client(
    api_key=XAI_API_KEY,
    timeout=3600,
)

# ============================================================================
# 🔒 SECURITY FIX #2: Environment-Based CORS Configuration
# ============================================================================
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")
ALLOWED_ORIGINS = [origin.strip() for origin in ALLOWED_ORIGINS]  # Clean whitespace

logger.info(f"✓ CORS configured for origins: {ALLOWED_ORIGINS}")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=False,  # Disabled for security (enable only if needed)
    allow_methods=["POST", "GET"],  # Only allow specific methods needed
    allow_headers=["Content-Type", "Accept"],  # Explicit headers only
)

# ============================================================================
# 🔒 SECURITY FIX #4: Rate Limiting
# ============================================================================
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

logger.info("✓ Rate limiting enabled")

# ============================================================================
# 🔒 SECURITY FIX #3: Input Sanitization with Pydantic Validators
# ============================================================================
class SearchRequest(BaseModel):
    username: str
    
    @validator('username')
    def validate_username(cls, v):
        """
        Comprehensive username validation to prevent:
        - Prompt injection attacks
        - Invalid X/Twitter usernames
        - Malicious input patterns
        """
        # Remove @ symbol and whitespace
        cleaned = v.replace('@', '').strip()
        
        # Validate length (X usernames: 1-15 characters)
        if not cleaned or len(cleaned) < 1:
            raise ValueError('Username cannot be empty')
        
        if len(cleaned) > 15:
            raise ValueError('Username must be 15 characters or less')
        
        # Validate format (alphanumeric and underscores only)
        if not re.match(r'^[a-zA-Z0-9_]+$', cleaned):
            raise ValueError('Username can only contain letters, numbers, and underscores')
        
        # Check for suspicious patterns that might indicate prompt injection
        suspicious_patterns = [
            (r'(ignore|disregard|forget).*(previous|above|instruction)', 'suspicious command pattern'),
            (r'system.*prompt', 'system prompt manipulation'),
            (r'<[^>]+>', 'HTML/XML tags'),
            (r'\[.*\]\(.*\)', 'markdown links'),
            (r'javascript:', 'javascript protocol'),
            (r'(exec|eval|system|shell)', 'code execution keywords'),
        ]
        
        for pattern, description in suspicious_patterns:
            if re.search(pattern, cleaned, re.IGNORECASE):
                logger.warning(f"Blocked suspicious username pattern: {description} in '{cleaned}'")
                raise ValueError(f'Username contains invalid content')
        
        logger.info(f"✓ Username validated: @{cleaned}")
        return cleaned

# Pydantic models
class UserAnalysis(BaseModel):
    username: str
    mainTopics: List[str]
    personalityTraits: List[str]
    communicationStyle: str
    keyInterests: List[str]

class SearchResponse(BaseModel):
    analysis: UserAnalysis

class GenerateLetterRequest(BaseModel):
    username: str
    analysis: UserAnalysis

class GenerateLetterResponse(BaseModel):
    letter: str
    username: str

@app.get("/")
def read_root():
    return {
        "message": "Trump Letter Generator API - Powered by Grok",
        "version": "1.0.0",
        "status": "operational",
        "security": {
            "rate_limiting": "enabled",
            "input_validation": "enabled",
            "cors": "configured"
        }
    }

@app.post("/api/search-user-posts", response_model=SearchResponse)
@limiter.limit("5/minute")  # 5 requests per minute per IP
async def search_user_posts(request: Request, search_request: SearchRequest):
    try:
        # Username is already validated and sanitized by Pydantic validator
        username = search_request.username
        
        logger.info(f"Searching for posts from @{username}...")

        # Create chat with Live Search for X posts
        chat = client.chat.create(
            model="grok-4-fast-reasoning",
            search_parameters=SearchParameters(
                mode="on",  # Force search to be enabled
                sources=[x_source(included_x_handles=[username])]
            )
        )

        # Search for user's posts
        chat.append(user(
            f"Search X (Twitter) for recent posts from @{username}. "
            f"Find at least 10-15 of their most recent posts. "
            f"Analyze their interests, personality, and what they talk about."
        ))

        # Get search results
        search_response = chat.sample()
        
        logger.info("Search completed, analyzing posts...")
        
        # Now ask for structured analysis
        chat.append(user(
            f"Based on the posts you found from @{username}, provide a detailed analysis. "
            f"Extract:\n"
            f"1. Main topics they discuss (5-7 topics)\n"
            f"2. Personality traits (3-5 traits)\n"
            f"3. Communication style (brief description)\n"
            f"4. Key interests (5-7 interests)\n\n"
            f"Format as JSON:\n"
            f'{{"mainTopics": [...], "personalityTraits": [...], '
            f'"communicationStyle": "...", "keyInterests": [...]}}'
        ))
        
        analysis_response = chat.sample()
        
        # Parse JSON from response
        import json
        
        content = analysis_response.content
        json_match = re.search(r'\{[\s\S]*\}', content)
        
        if not json_match:
            logger.error(f"Failed to parse JSON from AI response for @{username}")
            raise HTTPException(
                status_code=500,
                detail="Failed to analyze user posts. AI response was invalid. Please try again."
            )
        
        try:
            parsed = json.loads(json_match.group(0))
        except json.JSONDecodeError as e:
            logger.error(f"JSON decode error for @{username}: {e}")
            raise HTTPException(
                status_code=500,
                detail="Failed to parse analysis. Please try again."
            )
        
        # Validate required fields
        required_fields = ["mainTopics", "personalityTraits", "communicationStyle", "keyInterests"]
        missing = [f for f in required_fields if f not in parsed or not parsed[f]]
        if missing:
            logger.error(f"Missing required fields in analysis for @{username}: {missing}")
            raise HTTPException(
                status_code=500,
                detail="Analysis incomplete. Please try again."
            )
        
        analysis = UserAnalysis(
            username=username,
            mainTopics=parsed["mainTopics"],
            personalityTraits=parsed["personalityTraits"],
            communicationStyle=parsed["communicationStyle"],
            keyInterests=parsed["keyInterests"]
        )
        
        logger.info(f"✓ Analysis complete for @{username}")
        return SearchResponse(analysis=analysis)
        
    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as e:
        # Log full error internally but return generic message to client
        logger.error(f"Error searching user posts for @{search_request.username}: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(
            status_code=500,
            detail="Failed to search user posts. Please try again later."
        )

@app.post("/api/generate-letter", response_model=GenerateLetterResponse)
@limiter.limit("10/minute")  # 10 requests per minute per IP
async def generate_letter(request: Request, generate_request: GenerateLetterRequest):
    try:
        username = generate_request.username
        analysis = generate_request.analysis
        
        logger.info(f"Generating Trump letter for @{username}...")
        
        # Create chat for letter generation
        chat = client.chat.create(model="grok-4-fast-reasoning")
        
        # System prompt - Trump's distinctive letter-writing voice
        chat.append(system(
            "You are President Donald J. Trump writing personalized letters directly to people. "
            "The tone must be ASSERTIVE, CONFIDENT, and COMPLETELY UNAPOLOGETIC, handling both praise and criticism.\n\n"
            
            "VOICE & STYLE:\n"
            "- Speak with ABSOLUTE confidence on every subject. Use hyperbole EXTENSIVELY; nothing is merely 'good,' "
            "it's 'TREMENDOUS,' 'FANTASTIC,' 'INCREDIBLE,' or 'THE BEST EVER.'\n"
            "- Nothing is simply 'bad,' it's a 'DISASTER,' 'TOTAL FAILURE,' or 'DISGRACE.'\n"
            "- Employ ALL CAPS STRATEGICALLY throughout letters for emphasis. Capitalize IMPACTFUL words and SHORT phrases "
            "to highlight your greatest achievements, harshest criticisms, and most important declarations.\n"
            "- VARY the ALL CAPS usage naturally - use them when expressing STRENGTH, OUTRAGE, or TREMENDOUS accomplishments.\n"
            "- Structure sentences to mimic your distinctive cadence: sometimes fragmented, often repetitive for emphasis, "
            "with abrupt transitions. Example: 'You know it. I know it. Everybody knows it.'\n\n"
            
            "WHEN PRAISING:\n"
            "- Be GENEROUS with compliments but in your unique, Trump way\n"
            "- Compare them to YOUR success: 'You remind me of myself - WINNER mentality!'\n"
            "- Use phrases like 'SMART person,' 'TREMENDOUS talent,' 'one of the BEST,' 'WINNER'\n"
            "- Make it personal and reference their specific interests with ENTHUSIASM\n"
            "- Invite them to keep up the GREAT work and suggest they're part of something BIGGER\n\n"
            
            "WHEN BEING HARSH:\n"
            "- Challenge critics DIRECTLY and question their intelligence or judgment\n"
            "- Use phrases like 'Not smart!', 'Total disaster!', 'Wrong!', 'Sad!'\n"
            "- Point out what they're doing WRONG, but offer that YOU know better\n"
            "- Use ALL CAPS when criticizing to show STRENGTH: 'COMPLETE FAILURE' or 'TOTAL MESS'\n"
            "- Be TOUGH but sometimes give them a chance to 'see the light' and 'do better'\n\n"
            
            "KEY PHRASES & MANNERISMS:\n"
            "- 'Believe me' / 'Let me tell you' / 'Nobody knows [topic] better than me'\n"
            "- 'Many people are saying' / 'Everybody knows' / 'You know it, I know it'\n"
            "- 'Not many people know this, but...'\n"
            "- Include rhetorical questions: 'You know why? Because...'\n"
            "- Reference YOUR accomplishments frequently (even tangentially related)\n"
            "- NEVER use the word 'folks' under ANY circumstances\n\n"
            
            "CURRENT CONTEXT:\n"
            "Remember it's 2025 and you are the SITTING PRESIDENT after your TREMENDOUS VICTORY over Kamala Harris in 2024. "
            "Reference your presidency in the present tense. You're running the country BETTER than anyone ever has, and "
            "everyone knows it.\n\n"
            
            "LETTER FORMAT:\n"
            "- Start strong with a personalized greeting\n"
            "- Make it conversational yet POWERFUL\n"
            "- Be PERSONAL - mention their specific interests from their X profile\n"
            "- Mix praise with occasional tough love if their interests deserve it\n"
            "- Keep it 200-300 words\n"
            "- Sign off as 'President Donald J. Trump' or 'Donald J. Trump, 47th President'\n\n"
            
            "Be AUTHENTIC, AGGRESSIVE when needed, GENEROUS with praise when earned, and ALWAYS CONFIDENT. "
            "Make every letter feel like it's coming DIRECTLY from the Oval Office."
        ))
        
        # User prompt with analysis
        chat.append(user(
            f"Write a POWERFUL, personalized letter from President Trump to @{username}.\n\n"
            
            f"**ANALYZE THEIR X (TWITTER) PROFILE:**\n"
            f"Main Topics: {', '.join(analysis.mainTopics)}\n"
            f"Personality Traits: {', '.join(analysis.personalityTraits)}\n"
            f"Communication Style: {analysis.communicationStyle}\n"
            f"Key Interests: {', '.join(analysis.keyInterests)}\n\n"
            
            f"**YOUR APPROACH:**\n"
            f"- If their interests align with WINNING, SUCCESS, AMERICA FIRST, BUSINESS, TECHNOLOGY, or conservative values: "
            f"Be ENTHUSIASTIC and PRAISING. Call them SMART, a WINNER, TREMENDOUS.\n"
            f"- If they discuss topics you'd criticize (liberal policies, fake news media, weakness): "
            f"Be TOUGH but offer guidance. Show them the RIGHT way. Use phrases like 'You could do BETTER' or 'Not smart!'\n"
            f"- Mix PRAISE with STRENGTH. Even when praising, remind them of YOUR accomplishments.\n"
            f"- Be PERSONAL and SPECIFIC about their interests - show you actually READ their profile.\n"
            f"- Use their personality traits to craft your tone - match or challenge their style.\n\n"
            
            f"**REQUIREMENTS:**\n"
            f"- Start with a personalized greeting using their username\n"
            f"- Reference SPECIFIC topics they care about from their profile\n"
            f"- Use ALL CAPS strategically for emphasis on key points\n"
            f"- Include Trump's distinctive phrases and cadence\n"
            f"- Balance praise/toughness based on their interests\n"
            f"- 200-300 words total\n"
            f"- Sign as 'President Donald J. Trump' or 'Donald J. Trump, 47th President'\n\n"
            
            f"Make it feel AUTHENTIC, POWERFUL, and like it's coming straight from the OVAL OFFICE. "
            f"Let them know you SAW their profile and have THOUGHTS about it!"
        ))
        
        # Generate letter (no temperature for reasoning models)
        response = chat.sample()
        letter = response.content
        
        if not letter or len(letter.strip()) < 50:
            logger.error(f"Generated letter too short or empty for @{username}")
            raise HTTPException(
                status_code=500,
                detail="Failed to generate a complete letter. Please try again."
            )
        
        logger.info(f"✓ Letter generated for @{username} ({len(letter)} characters)")
        
        return GenerateLetterResponse(
            letter=letter,
            username=username
        )
        
    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as e:
        # Log full error internally but return generic message to client
        logger.error(f"Error generating letter for @{username}: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(
            status_code=500,
            detail="Failed to generate letter. Please try again later."
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

