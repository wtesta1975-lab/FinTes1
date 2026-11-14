from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx

app = FastAPI(title="Fintech Argentina API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Instrument(BaseModel):
    ticker: str
    name: str
    category: str
    currency: str
    adjustment_type: str
    risk_score: int
    estimated_yield_annual: float

DATABASE_INSTRUMENTS = [
    Instrument(ticker="S31E6", name="LECAP vto Ene 2026", category="LECAP", currency="ARS", adjustment_type="FIXED", risk_score=2, estimated_yield_annual=0.45),
    Instrument(ticker="AL30", name="Bono Global / Bonaire USD", category="BONO_USD", currency="USD", adjustment_type="HARD_DOLLAR", risk_score=4, estimated_yield_annual=0.12),
    Instrument(ticker="SPY", name="CEDEAR SPDR S&P 500 ETF", category="CEDEAR", currency="ARS", adjustment_type="CCL", risk_score=4, estimated_yield_annual=0.15),
    Instrument(ticker="FCI_MM", name="FCI Money Market Pesos", category="FCI", currency="ARS", adjustment_type="FIXED", risk_score=1, estimated_yield_annual=0.38)
]

@app.get("/api/v1/instruments")
def get_instruments():
    return DATABASE_INSTRUMENTS

@app.get("/api/v1/market/dolares")
async def get_dolares():
    url = "https://api.argentinadatos.com/v1/cotizaciones/dolares"
    async with httpx.AsyncClient() as client:
        try:
            resp = await client.get(url, timeout=5.0)
            return resp.json()
        except:
            return [{"casa": "mep", "compra": 1240, "venta": 1250}]

class SimulationInput(BaseModel):
    initial_amount_ars: float
    monthly_contribution_ars: float
    months: int
    selected_ticker: str

@app.post("/api/v1/simulate")
def run_simulation(data: SimulationInput):
    instrument = next((i for i in DATABASE_INSTRUMENTS if i.ticker == data.selected_ticker), DATABASE_INSTRUMENTS[0])
    monthly_rate = (1 + instrument.estimated_yield_annual) ** (1/12) - 1
    total_capital = data.initial_amount_ars
    history = []

    for month in range(1, data.months + 1):
        total_capital = (total_capital + data.monthly_contribution_ars) * (1 + monthly_rate)
        history.append({
            "month": month,
            "projected_value_ars": round(total_capital, 2)
        })

    return {
        "ticker": instrument.ticker,
        "instrument_name": instrument.name,
        "total_months": data.months,
        "final_projected_ars": round(total_capital, 2),
        "monthly_evolution": history
    }
