from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class Keystroke(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    key: str
    code: str
    key_code: int
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    modifiers: dict = Field(default_factory=dict)
    session_id: str

class KeystrokeCreate(BaseModel):
    key: str
    code: str
    key_code: int
    modifiers: dict = Field(default_factory=dict)
    session_id: str

class ExfiltrationData(BaseModel):
    method: str  # "email", "web", "ftp"
    data: str
    session_id: str

class StatsResponse(BaseModel):
    total_keys: int
    total_sessions: int
    recent_activity: int

class SessionResponse(BaseModel):
    session_id: str
    started_at: datetime
    key_count: int


@api_router.get("/")
async def root():
    return {"message": "Keylogger Simulator API"}

@api_router.post("/keystrokes", response_model=Keystroke)
async def create_keystroke(input: KeystrokeCreate):
    keystroke_obj = Keystroke(**input.model_dump())
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = keystroke_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    await db.keystrokes.insert_one(doc)
    return keystroke_obj

@api_router.get("/keystrokes", response_model=List[Keystroke])
async def get_keystrokes(session_id: Optional[str] = None, limit: int = 1000):
    query = {"session_id": session_id} if session_id else {}
    keystrokes = await db.keystrokes.find(query, {"_id": 0}).sort("timestamp", -1).limit(limit).to_list(limit)
    
    # Convert ISO string timestamps back to datetime objects
    for keystroke in keystrokes:
        if isinstance(keystroke['timestamp'], str):
            keystroke['timestamp'] = datetime.fromisoformat(keystroke['timestamp'])
    
    return keystrokes

@api_router.delete("/keystrokes")
async def clear_keystrokes(session_id: Optional[str] = None):
    query = {"session_id": session_id} if session_id else {}
    result = await db.keystrokes.delete_many(query)
    return {"deleted": result.deleted_count}

@api_router.get("/stats", response_model=StatsResponse)
async def get_stats():
    total_keys = await db.keystrokes.count_documents({})
    
    # Get unique sessions
    sessions = await db.keystrokes.distinct("session_id")
    total_sessions = len(sessions)
    
    # Recent activity (last 5 minutes)
    five_min_ago = datetime.now(timezone.utc).timestamp() - 300
    recent_docs = await db.keystrokes.find({}, {"_id": 0, "timestamp": 1}).to_list(10000)
    recent_activity = sum(1 for doc in recent_docs if datetime.fromisoformat(doc['timestamp']).timestamp() > five_min_ago)
    
    return StatsResponse(
        total_keys=total_keys,
        total_sessions=total_sessions,
        recent_activity=recent_activity
    )

@api_router.get("/sessions", response_model=List[SessionResponse])
async def get_sessions():
    pipeline = [
        {"$sort": {"timestamp": 1}},
        {"$group": {
            "_id": "$session_id",
            "started_at": {"$first": "$timestamp"},
            "key_count": {"$sum": 1}
        }},
        {"$sort": {"started_at": -1}},
        {"$limit": 50}
    ]
    
    sessions = await db.keystrokes.aggregate(pipeline).to_list(50)
    
    result = []
    for session in sessions:
        started_at = session['started_at']
        if isinstance(started_at, str):
            started_at = datetime.fromisoformat(started_at)
        
        result.append(SessionResponse(
            session_id=session['_id'],
            started_at=started_at,
            key_count=session['key_count']
        ))
    
    return result

@api_router.post("/exfiltrate")
async def simulate_exfiltration(data: ExfiltrationData):
    # Simulate exfiltration - in real scenario, this would send data to remote server
    exfiltration_record = {
        "id": str(uuid.uuid4()),
        "method": data.method,
        "data_length": len(data.data),
        "session_id": data.session_id,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "status": "simulated"
    }
    
    await db.exfiltrations.insert_one(exfiltration_record)
    
    return {
        "success": True,
        "message": f"Simulated {data.method} exfiltration of {len(data.data)} characters",
        "method": data.method
    }

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()