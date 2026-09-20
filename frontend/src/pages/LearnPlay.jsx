import React, { useEffect, useState } from "react";
import { ChefHat, Gamepad2, Leaf, Play, RotateCcw, Trophy } from "lucide-react";
import "./LearnPlay.css";

const lanes = ["left", "middle", "right"];
const foods = [
  { name: "Lentils", emoji: "🫘", points: 3 }, { name: "Rice", emoji: "🍚", points: 2 },
  { name: "Vegetables", emoji: "🥦", points: 3 }, { name: "Chicken", emoji: "🍗", points: -1 },
  { name: "Beef", emoji: "🥩", points: -3 }, { name: "Local fruit", emoji: "🍎", points: 2 },
];
const randomLane = () => lanes[Math.floor(Math.random() * lanes.length)];

function EcoRunner() {
  const [running, setRunning] = useState(false), [lane, setLane] = useState("middle");
  const [item, setItem] = useState({ lane: "middle", kind: "leaf" }), [seconds, setSeconds] = useState(30), [score, setScore] = useState(0);
  const [message, setMessage] = useState("Move between lanes and catch leaves. Avoid smoke clouds.");
  useEffect(() => {
    if (!running) return undefined;
    const timer = setInterval(() => {
      setSeconds((value) => { if (value <= 1) { setRunning(false); setMessage("Run complete! Try again to beat your score."); return 0; } return value - 1; });
      setItem((current) => {
        if (current.lane === lane && current.kind === "leaf") setScore((value) => value + 10);
        if (current.lane === lane && current.kind === "smoke") { setScore((value) => Math.max(0, value - 5)); setMessage("Smoke cloud! Move to another lane."); }
        return { lane: randomLane(), kind: Math.random() > 0.35 ? "leaf" : "smoke" };
      });
    }, 700);
    return () => clearInterval(timer);
  }, [running, lane]);
  const start = () => { setScore(0); setSeconds(30); setLane("middle"); setItem({ lane: randomLane(), kind: "leaf" }); setMessage("Go! Catch leaves and avoid smoke."); setRunning(true); };
  return <article className="arcade-card">
    <div className="game-card-head"><span className="game-badge"><Gamepad2 size={17}/> LIVE GAME</span><strong>{seconds}s</strong></div>
    <h2>Eco Runner</h2><p>Run through the city, collecting green boosts while avoiding pollution.</p>
    <div className="runner-track"><div className={"track-item " + item.lane}>{item.kind === "leaf" ? "🍃" : "☁️"}</div><div className={"runner-player " + lane}>🏃</div><i className="lane-line line-one"></i><i className="lane-line line-two"></i></div>
    <div className="runner-controls"><button disabled={!running} onClick={() => setLane("left")}>← Left</button><button disabled={!running} onClick={() => setLane("middle")}>Middle</button><button disabled={!running} onClick={() => setLane("right")}>Right →</button></div>
    <p className="game-message">{message}</p><div className="score-row"><span>Score <b>{score}</b></span><button className="play-button" onClick={start}><Play size={16}/>{running ? "Restart" : "Play now"}</button></div>
  </article>;
}

function GreenKitchen() {
  const [selected, setSelected] = useState([]), [seconds, setSeconds] = useState(25), [playing, setPlaying] = useState(false), [result, setResult] = useState("");
  useEffect(() => { if (!playing) return undefined; const timer = setInterval(() => setSeconds((value) => { if (value <= 1) { setPlaying(false); return 0; } return value - 1; }), 1000); return () => clearInterval(timer); }, [playing]);
  const toggle = (food) => { if (!playing) return; setSelected((items) => items.some((item) => item.name === food.name) ? items.filter((item) => item.name !== food.name) : items.length < 3 ? [...items, food] : items); };
  const start = () => { setSelected([]); setSeconds(25); setResult(""); setPlaying(true); };
  const finish = () => { const points = selected.reduce((sum, food) => sum + food.points, 0); setPlaying(false); setResult(selected.length < 3 ? "Choose three ingredients to finish your dish." : points >= 7 ? "Excellent green meal! You chose a plant-forward, low-impact dish." : points >= 3 ? "Nice dish. Swap a meat ingredient for a plant option to improve the score." : "Try again with more plant ingredients for a lower-carbon dish."); };
  return <article className="arcade-card">
    <div className="game-card-head"><span className="game-badge"><ChefHat size={17}/> LIVE GAME</span><strong>{seconds}s</strong></div>
    <h2>Green Kitchen Sprint</h2><p>Build a tasty three-ingredient meal before the timer ends. Plant foods earn more eco points.</p>
    <div className="food-grid">{foods.map((food) => <button key={food.name} disabled={!playing} className={selected.some((item) => item.name === food.name) ? "food selected-food" : "food"} onClick={() => toggle(food)}><span>{food.emoji}</span>{food.name}<small>{(food.points > 0 ? "+" : "") + food.points} eco</small></button>)}</div>
    <div className="recipe-bar"><Leaf size={18}/><span>{selected.length ? selected.map((food) => food.emoji).join(" + ") : "Your plate is empty"}</span></div>{result && <p className="game-message">{result}</p>}
    <div className="score-row"><span>Pick {selected.length}/3</span><div><button className="finish-button" disabled={!playing} onClick={finish}>Serve meal</button><button className="play-button" onClick={start}><RotateCcw size={16}/>{playing ? "Restart" : "Start"}</button></div></div>
  </article>;
}

export default function LearnPlay() {
  return <main className="learn-page"><section className="learn-hero"><Trophy size={33}/><div><p>PLAY • LEARN • ACT</p><h1>EcoBloom Game Zone</h1><span>Fast, fun challenges where every game teaches a sustainable everyday choice.</span></div></section><section className="game-intro"><h2>Choose a game</h2><p>These are real, playable browser mini-games—no login or download needed.</p></section><div className="arcade-grid"><EcoRunner/><GreenKitchen/></div><section className="professor-note"><h2>Why these games belong in EcoBloom</h2><p>Eco Runner makes clean travel and pollution visible. Green Kitchen links meal choices to food emissions. Both make carbon-footprint learning active and memorable, while the calculator remains the project’s main measurement tool.</p></section></main>;
}
