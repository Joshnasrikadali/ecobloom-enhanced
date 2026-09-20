import React, { useEffect, useMemo, useState } from "react";
import {
  MapPin, User, Signature, Mail, Calendar, ChevronDown, ChevronUp,
  Utensils, Car, Lightbulb, ShoppingBag, Leaf
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from "recharts";
import "./Profile.css";

const API = "http://localhost:5000";

const getStatus = (total = 0) => {
  if (total < 10) return { label: "Low Carbon Impact", emoji: "🟢", message: "Your emissions are currently low. Keep making sustainable choices!" };
  if (total <= 20) return { label: "Moderate Carbon Impact", emoji: "🟡", message: "Your footprint is moderate. A few changes can help reduce it further." };
  return { label: "High Carbon Impact", emoji: "🔴", message: "Your footprint is relatively high. Check your largest category for ways to improve." };
};

const Profile = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedSections, setExpandedSections] = useState({
    personalInfo: true, todayStats: true, historyStats: true, achievements: true
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please sign in to view your EcoBloom profile.");
      setLoading(false);
      return;
    }

    fetch(`${API}/api/user/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Unable to load profile");
        return data;
      })
      .then((data) => setProfile(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const latest = profile?.latest;
  const history = profile?.history || [];
  const total = Number(latest?.total || 0);
  const status = getStatus(total);

  const weeklyData = useMemo(() => history.slice(-7).map((item) => ({
    name: new Date(item.created_at).toLocaleDateString("en-IN", { weekday: "short" }),
    carbon: Number(item.total || 0)
  })), [history]);

  const categoryData = latest ? [
    { name: "Transport", value: Number(latest.transport || 0) },
    { name: "Food", value: Number(latest.food || 0) },
    { name: "Energy", value: Number(latest.energy || 0) },
    { name: "Shopping", value: Number(latest.shopping || 0) }
  ] : [];

  const largestCategory = categoryData.reduce(
    (max, item) => item.value > max.value ? item : max,
    { name: "None", value: 0 }
  );

  const achievements = [];
  if (history.length >= 1) achievements.push({ title: "First Eco Check", description: "Completed your first carbon footprint calculation.", icon: <Leaf size={24} /> });
  if (history.length >= 5) achievements.push({ title: "Eco Explorer", description: "Completed five footprint calculations.", icon: <Leaf size={24} /> });
  if (total > 0 && total < 10) achievements.push({ title: "Low Impact", description: "Your latest footprint is below 10 kg CO₂.", icon: <Leaf size={24} /> });
  if (!achievements.length) achievements.push({ title: "Start Your Eco Journey", description: "Complete a footprint calculation to unlock achievements.", icon: <Leaf size={24} /> });

  if (loading) return <div className="profile-loading">🌱 Loading your EcoBloom profile...</div>;
  if (error) return <div className="profile-error">{error}</div>;

  const user = profile.user;
  const username = user.email.split("@")[0];
  const memberDate = new Date(user.created_at).toLocaleDateString("en-IN", { month: "long", year: "numeric" });

  return (
    <div className="profile-page">
      <div className="profile-sidebar">
        <div className="profile-section">
          <div className="avatar"><User size={40} /></div>
          <h2>{user.name}</h2>
          <div className="username-container"><Signature size={18} /><span className="username">@{username}</span></div>

          <div className="tab-navigation">
            <button className={activeTab === "overview" ? "active" : ""} onClick={() => setActiveTab("overview")}>Overview</button>
            <button className={activeTab === "stats" ? "active" : ""} onClick={() => setActiveTab("stats")}>Statistics</button>
            <button className={activeTab === "achievements" ? "active" : ""} onClick={() => setActiveTab("achievements")}>Achievements</button>
          </div>

          <div className="info">
            <div className="info-item"><Mail size={18} /><span>{user.email}</span></div>
            <div className="info-item"><MapPin size={18} /><span>Location not set</span></div>
            <div className="info-item"><Calendar size={18} /><span>Member since {memberDate}</span></div>
          </div>
        </div>
      </div>

      <div className="profile-content">
        <div className="section-header">
          <h2>EcoBloom Carbon Dashboard</h2>
          <div className="eco-score">
            <div className="score-circle">{user.points}</div>
            <div className="score-text"><h3>Eco Points</h3><p>Keep growing! 🌱</p></div>
          </div>
        </div>

        {activeTab === "overview" && (
          <>
            <div className="card">
              <div className="card-header" onClick={() => toggleSection("personalInfo")}>
                <h3>Personal Information</h3>{expandedSections.personalInfo ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
              {expandedSections.personalInfo && <div className="card-content"><div className="personal-info-grid">
                <div className="info-group"><label>Full Name</label><p>{user.name}</p></div>
                <div className="info-group"><label>Username</label><p>@{username}</p></div>
                <div className="info-group"><label>Email</label><p>{user.email}</p></div>
                <div className="info-group"><label>Location</label><p>Not set</p></div>
                <div className="info-group"><label>Member Since</label><p>{memberDate}</p></div>
                <div className="info-group"><label>Eco Points</label><p>{user.points}</p></div>
              </div></div>}
            </div>

            <div className="card">
              <div className="card-header" onClick={() => toggleSection("todayStats")}>
                <h3>Latest Carbon Footprint</h3>{expandedSections.todayStats ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
              {expandedSections.todayStats && <div className="card-content">
                {!latest ? <p>No footprint calculation yet. Go to Calculate to create your first record.</p> : <>
                  <div className="stats-grid">
                    <div className="stat-card"><Car size={24} /><h4>Transport</h4><p className="stat-value">{Number(latest.transport).toFixed(2)} kg CO₂</p></div>
                    <div className="stat-card"><Utensils size={24} /><h4>Food</h4><p className="stat-value">{Number(latest.food).toFixed(2)} kg CO₂</p></div>
                    <div className="stat-card"><Lightbulb size={24} /><h4>Energy</h4><p className="stat-value">{Number(latest.energy).toFixed(2)} kg CO₂</p></div>
                    <div className="stat-card"><ShoppingBag size={24} /><h4>Shopping</h4><p className="stat-value">{Number(latest.shopping).toFixed(2)} kg CO₂</p></div>
                  </div>
                  <div style={{ marginTop: 20, padding: 18, borderRadius: 14, background: "#f5fbf6" }}>
                    <h3>{status.emoji} {status.label}</h3>
                    <p>{total.toFixed(2)} kg CO₂ · {status.message}</p>
                    {largestCategory.value > 0 && <p><strong>Largest contributor:</strong> {largestCategory.name} ({largestCategory.value.toFixed(2)} kg CO₂)</p>}
                  </div>
                  <div className="today-chart"><h4>Category Distribution</h4><div className="chart-container"><ResponsiveContainer width="100%" height={220}><BarChart data={categoryData} layout="vertical"><CartesianGrid strokeDasharray="3 3" horizontal={false} /><XAxis type="number" /><YAxis dataKey="name" type="category" /><Tooltip /><Bar dataKey="value" name="kg CO₂" /></BarChart></ResponsiveContainer></div></div>
                </>}
              </div>}
            </div>

            <div className="card">
              <div className="card-header" onClick={() => toggleSection("historyStats")}>
                <h3>Carbon Footprint History</h3>{expandedSections.historyStats ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
              {expandedSections.historyStats && <div className="card-content">
                {weeklyData.length ? <div className="history-chart"><h4>Recent Trend</h4><div className="chart-container"><ResponsiveContainer width="100%" height={220}><AreaChart data={weeklyData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Area type="monotone" dataKey="carbon" /></AreaChart></ResponsiveContainer></div></div> : <p>Your footprint history will appear here after your first calculation.</p>}
                <div style={{ marginTop: 20 }}><h4>Recent Calculations</h4>{history.slice().reverse().slice(0, 10).map((item) => <div key={item.id} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #eee" }}><span>{new Date(item.created_at).toLocaleDateString("en-IN")}</span><strong>{Number(item.total).toFixed(2)} kg CO₂</strong></div>)}</div>
              </div>}
            </div>

            <div className="card">
              <div className="card-header" onClick={() => toggleSection("achievements")}>
                <h3>EcoBloom Achievements</h3>{expandedSections.achievements ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
              {expandedSections.achievements && <div className="card-content"><div className="achievements-list">{achievements.map((a, i) => <div className="achievement-item" key={i}><div className="achievement-icon">{a.icon}</div><div className="achievement-content"><h4>{a.title}</h4><p>{a.description}</p></div></div>)}</div></div>}
            </div>
          </>
        )}

        {activeTab === "stats" && <div className="detailed-stats"><h3>EcoBloom Statistics</h3><p>Total saved calculations: {history.length}</p><p>Latest footprint: {latest ? `${total.toFixed(2)} kg CO₂` : "Not calculated yet"}</p><p>Eco points: {user.points}</p><p>Current level: {latest ? status.label : "Waiting for your first calculation"}</p></div>}
        {activeTab === "achievements" && <div className="all-achievements"><h3>EcoBloom Achievements</h3>{achievements.map((a, i) => <div className="achievement-item" key={i}><div className="achievement-icon">{a.icon}</div><div className="achievement-content"><h4>{a.title}</h4><p>{a.description}</p></div></div>)}</div>}
      </div>
    </div>
  );
};

export default Profile;
