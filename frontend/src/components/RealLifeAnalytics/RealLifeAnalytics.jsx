import React, { useState } from "react";
import { Car, Lightbulb, Leaf, ArrowRight } from "lucide-react";
import "./RealLifeAnalytics.css";

export default function RealLifeAnalytics() {
  const [tripKm, setTripKm] = useState(8);
  const [days, setDays] = useState(5);
  const carKg = (tripKm * days * 4 * 0.18).toFixed(1);
  const busKg = (tripKm * days * 4 * 0.05).toFixed(1);
  const saved = (carKg - busKg).toFixed(1);
  return <section className="real-life-analytics" id="real-life-analytics">
    <div className="real-life-heading"><span>EVERYDAY IMPACT</span><h2>See your choices in real life</h2><p>Simple estimates make carbon numbers easier to explain. Change the commute below to see one practical comparison.</p></div>
    <div className="life-grid">
      <article className="commute-card"><div className="life-icon"><Car size={23}/></div><h3>Your weekly commute</h3><label>One-way distance <strong>{tripKm} km</strong><input type="range" min="1" max="30" value={tripKm} onChange={(e)=>setTripKm(Number(e.target.value))}/></label><label>Days per week <strong>{days}</strong><input type="range" min="1" max="7" value={days} onChange={(e)=>setDays(Number(e.target.value))}/></label><div className="comparison"><div><small>Driving alone</small><b>{carKg} kg CO₂ / month</b></div><ArrowRight size={18}/><div><small>Public transport</small><b>{busKg} kg CO₂ / month</b></div></div><p className="saving">Potential difference: <strong>about {saved} kg CO₂ each month</strong></p></article>
      <article className="life-tip-card"><div className="life-icon sun"><Lightbulb size={23}/></div><h3>Home energy, made simple</h3><p>Standby devices still use power. A power strip makes it easier to switch off a whole study setup at once.</p><span className="action-tag">Try tonight: switch off at the wall</span></article>
      <article className="life-tip-card"><div className="life-icon leaf"><Leaf size={23}/></div><h3>Food without perfection</h3><p>One plant-forward meal and finishing the food you buy are realistic places to start—no all-or-nothing diet required.</p><span className="action-tag">Try this week: plan one meal</span></article>
    </div><p className="estimate-note">Estimates use the same transport factors as the EcoBloom calculator. Actual emissions vary by vehicle, route and occupancy.</p>
  </section>;
}
