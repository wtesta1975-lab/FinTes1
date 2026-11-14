"import client";
import React, { useState } from "react";

export default function App() {
  const [tab, setTab] = useState("simulator");
  const [initialCapital, setInitialCapital] = useState(500000);
  const [monthlyContribution, setMonthlyContribution] = useState(50000);
  const [years, setYears] = useState(2);
  const [annualRate, setAnnualRate] = useState(0.45);

  const totalMonths = years * 12;
  const monthlyRate = Math.pow(1 + annualRate, 1/12) - 1;
  let balance = initialCapital;
  let totalInvested = initialCapital;

  for (let m = 1; m <= totalMonths; m++) {
    balance = (balance + monthlyContribution) * (1 + monthlyRate);
    totalInvested += monthlyContribution;
  }

  return (
    <main style={{ fontFamily: "sans-serif", maxWidth: "800px", margin: "40px auto", padding: "20px", background: "#f9fafb", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
      <header style={{ textAlign: "center", marginBottom: "30px" }}>
        <h1 style={{ color: "#1e3a8a", margin: "0 0 10px 0" }}>Inversiones Argentina App (Nivel 1)</h1>
        <p style={{ color: "#4b5563", fontSize: "14px" }}>Simulador financiero y proyecciones para el mercado local</p>
        <div style={{ marginTop: "15px" }}>
          <button onClick={() => setTab("simulator")} style={{ padding: "8px 16px", background: tab === "simulator" ? "#2563eb" : "#e5e7eb", color: tab === "simulator" ? "#fff" : "#374151", border: "none", borderRadius: "6px", cursor: "pointer", marginRight: "10px", fontWeight: "bold" }}>Simulador</button>
          <button onClick={() => setTab("instruments")} style={{ padding: "8px 16px", background: tab === "instruments" ? "#2563eb" : "#e5e7eb", color: tab === "instruments" ? "#fff" : "#374151", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>Instrumentos</button>
        </div>
      </header>

      {tab === "simulator" && (
        <div style={{ background: "#fff", padding: "24px", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
          <h2>Simulador de Interés Compuesto</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", margin: "20px 0" }}>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "bold", color: "#374151", marginBottom: "5px" }}>Capital Inicial (ARS)</label>
              <input type="number" value={initialCapital} onChange={e => setInitialCapital(Number(e.target.value))} style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #d1d5db" }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "bold", color: "#374151", marginBottom: "5px" }}>Aporte Mensual (ARS)</label>
              <input type="number" value={monthlyContribution} onChange={e => setMonthlyContribution(Number(e.target.value))} style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #d1d5db" }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "bold", color: "#374151", marginBottom: "5px" }}>Plazo ({years} años)</label>
              <input type="range" min="1" max="10" value={years} onChange={e => setYears(Number(e.target.value))} style={{ width: "100%" }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "bold", color: "#374151", marginBottom: "5px" }}>Tasa Anual Estimada (TNA)</label>
              <select value={annualRate} onChange={e => setAnnualRate(Number(e.target.value))} style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #d1d5db" }}>
                <option value={0.38}>FCI Money Market (38% TNA)</option>
                <option value={0.45}>LECAP Corto Plazo (45% TNA)</option>
                <option value={0.15}>CEDEARs / Global (15% USD)</option>
              </select>
            </div>
          </div>
          <div style={{ background: "#eff6ff", padding: "20px", borderRadius: "8px", textAlign: "center", border: "1px solid #bfdbfe" }}>
            <span style={{ fontSize: "12px", fontWeight: "bold", color: "#1e40af", textTransform: "uppercase" }}>Capital Final Proyectado</span>
            <h2 style={{ color: "#1e3a8a", fontSize: "32px", margin: "5px 0" }}>${Math.round(balance).toLocaleString("es-AR")} ARS</h2>
            <p style={{ fontSize: "13px", color: "#475569", margin: "0" }}>Total aportado: ${Math.round(totalInvested).toLocaleString("es-AR")} | Ganancia: +${Math.round(balance - totalInvested).toLocaleString("es-AR")}</p>
          </div>
        </div>
      )}

      {tab === "instruments" && (
        <div style={{ background: "#fff", padding: "24px", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
          <h2>Catálogo de Instrumentos Argentinos</h2>
          <ul style={{ listStyle: "none", padding: 0, margin: "15px 0" }}>
            <li style={{ padding: "12px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between" }}>
              <span><strong>LECAPs / LECER</strong> (Corto Plazo - Tasa Fija / CER)</span>
              <span style={{ color: "#16a34a", fontWeight: "bold" }}>Moderado / Alto</span>
            </li>
            <li style={{ padding: "12px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between" }}>
              <span><strong>Obligaciones Negociables (ONs)</strong> (Renta USD)</span>
              <span style={{ color: "#2563eb", fontWeight: "bold" }}>Conservador / Renta</span>
            </li>
            <li style={{ padding: "12px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between" }}>
              <span><strong>CEDEARs (SPY, QQQ, NVDA)</strong> (Renta Variable Global)</span>
              <span style={{ color: "#dc2626", fontWeight: "bold" }}>Arriesgado / Crecimiento</span>
            </li>
            <li style={{ padding: "12px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between" }}>
              <span><strong>FCI Money Market</strong> (Liquidez Inmediata T+0)</span>
              <span style={{ color: "#059669", fontWeight: "bold" }}>Conservador</span>
            </li>
          </ul>
        </div>
      )}
    </main>
  );
}
