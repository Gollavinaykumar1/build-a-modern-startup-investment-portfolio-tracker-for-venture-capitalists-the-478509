from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy import Column, String, Integer, Float
from database import Base, engine, get_db
from pydantic import BaseModel
from typing import List

# Define the SQLAlchemy model for the Startup
class Startup(Base):
    __tablename__ = "startups"
    id = Column(Integer, primary_key=True)
    company_name = Column(String)
    sector = Column(String)
    invested_amount = Column(Float)
    status = Column(String)

# Define the Pydantic model for the Startup
class StartupModel(BaseModel):
    company_name: str
    sector: str
    invested_amount: float
    status: str

# Define the Pydantic model for the Investment Summary
class InvestmentSummaryModel(BaseModel):
    total_invested: float
    active_startups: int
    estimated_roi: float

# Create the FastAPI application
app = FastAPI()

# Define the endpoint to get the investment summary
@app.get("/summary", response_model=InvestmentSummaryModel)
def get_investment_summary(db = Depends(get_db)):
    total_invested = db.query(Startup).with_entities(Startup.invested_amount).sum()
    active_startups = db.query(Startup).filter(Startup.status != "Exited").count()
    estimated_roi = db.query(Startup).with_entities(Startup.invested_amount).sum() * 0.1  # Assume 10% ROI
    return {
        "total_invested": total_invested or 0,
        "active_startups": active_startups,
        "estimated_roi": estimated_roi or 0
    }

# Define the endpoint to get all startups
@app.get("/startups", response_model=List[StartupModel])
def get_all_startups(db = Depends(get_db)):
    startups = db.query(Startup).all()
    return startups

# Define the endpoint to add a new startup
@app.post("/startups")
def add_startup(startup: StartupModel, db = Depends(get_db)):
    new_startup = Startup(
        company_name=startup.company_name,
        sector=startup.sector,
        invested_amount=startup.invested_amount,
        status=startup.status
    )
    db.add(new_startup)
    db.commit()
    db.refresh(new_startup)
    return new_startup

# Define the endpoint to get a startup by id
@app.get("/startups/{startup_id}", response_model=StartupModel)
def get_startup(startup_id: int, db = Depends(get_db)):
    startup = db.query(Startup).filter(Startup.id == startup_id).first()
    if not startup:
        raise HTTPException(status_code=404, detail="Startup not found")
    return startup

# Define the endpoint to update a startup
@app.put("/startups/{startup_id}")
def update_startup(startup_id: int, startup: StartupModel, db = Depends(get_db)):
    existing_startup = db.query(Startup).filter(Startup.id == startup_id).first()
    if not existing_startup:
        raise HTTPException(status_code=404, detail="Startup not found")
    existing_startup.company_name = startup.company_name
    existing_startup.sector = startup.sector
    existing_startup.invested_amount = startup.invested_amount
    existing_startup.status = startup.status
    db.commit()
    db.refresh(existing_startup)
    return existing_startup

# Define the endpoint to delete a startup
@app.delete("/startups/{startup_id}")
def delete_startup(startup_id: int, db = Depends(get_db)):
    startup = db.query(Startup).filter(Startup.id == startup_id).first()
    if not startup:
        raise HTTPException(status_code=404, detail="Startup not found")
    db.delete(startup)
    db.commit()
    return {"message": "Startup deleted successfully"}