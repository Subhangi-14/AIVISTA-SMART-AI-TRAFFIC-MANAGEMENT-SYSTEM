// App.js
import React, { useEffect, useState, useRef, useMemo } from "react";
import Plotly from "plotly.js-dist-min";
import { MapContainer, TileLayer, Circle, Popup, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./App.css";
import Landing from "./Landing"; // Landing page component

// 🔹 Mock Data
const METRICS = [
  { label: "Avg Wait Time", value: "4.1 min" },
  { label: "Idling Reduction", value: "15%" },
  { label: "Adaptive Signals", value: "Enabled" },
];

const MAP_CONFIG = {
  center: [22.5726, 88.3639],
  zoom: 13,
  congestion: [
    { lat: 22.565, lng: 88.370, label: "High Congestion – Esplanade" },
    { lat: 22.574, lng: 88.360, label: "Moderate Congestion – Park Street" },
  ],
};

const DEFAULT_EMERGENCY_ALERT = {
  active: true,
  type: "Ambulance Detected",
  message: "Signals reconfigured: Route cleared for rapid emergency response!",
};

// 🔹 Traffic Chart Component
function TrafficChart({ paused, predictionMode }) {
  const [chartType, setChartType] = useState("line");
  const [data, setData] = useState([60, 90, 70, 100, 85, 65]);

  const timeLabels = useMemo(
    () => ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00"],
    []
  );

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => {
      setData((prev) =>
        prev.map((val) =>
          Math.max(40, Math.min(120, val + (Math.random() * 20 - 10)))
        )
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [paused]);

  useEffect(() => {
    const predictedData = data.map((v) => v + (Math.random() * 15 - 5));
    let plotData;

    if (chartType === "line") {
      plotData = [
        {
          x: timeLabels,
          y: data,
          type: "scatter",
          mode: "lines+markers",
          name: "Current Vehicles",
          line: { color: "#4f46e5", width: 4 },
          marker: { size: 12 },
        },
      ];
      if (predictionMode) {
        plotData.push({
          x: timeLabels,
          y: predictedData,
          type: "scatter",
          mode: "lines+markers",
          name: "Forecast (15min)",
          line: { color: "#f59e0b", dash: "dashdot", width: 3 },
          marker: { size: 10 },
        });
      }
    } else if (chartType === "bar") {
      plotData = [
        {
          x: timeLabels,
          y: data,
          type: "bar",
          name: "Vehicles",
          marker: { color: "#14b8a6" },
        },
      ];
    } else if (chartType === "pie") {
      plotData = [
        {
          labels: timeLabels,
          values: data,
          type: "pie",
          marker: {
            colors: [
              "#4f46e5",
              "#14b8a6",
              "#f59e0b",
              "#ef4444",
              "#22c55e",
              "#3b82f6",
            ],
          },
        },
      ];
    }

    Plotly.newPlot("trafficChart", plotData, {
      margin: { t: 40, l: 60, r: 24, b: 60 },
      title: "Traffic Congestion (Live)",
      plot_bgcolor: "#F3F4F7",
      paper_bgcolor: "rgba(230,239,255,0.95)",
      font: { family: "Inter, Arial, sans-serif", size: 16 },
    });
  }, [chartType, data, predictionMode, timeLabels]);

  return (
    <div>
      <div
        id="trafficChart"
        style={{
          height: 340,
          width: "100%",
          borderRadius: 14,
          boxShadow: "0 2px 8px #eee",
        }}
      />
      <div className="chart-btn-group">
        <button
          className={`chart-btn ${chartType === "line" ? "active" : ""}`}
          onClick={() => setChartType("line")}
        >
          📈 Line
        </button>
        <button
          className={`chart-btn ${chartType === "bar" ? "active" : ""}`}
          onClick={() => setChartType("bar")}
        >
          📊 Bar
        </button>
        <button
          className={`chart-btn ${chartType === "pie" ? "active" : ""}`}
          onClick={() => setChartType("pie")}
        >
          🥧 Pie
        </button>
      </div>
    </div>
  );
}

// 🔹 City Map Component
function CityMap({ congestion, highlight, mode }) {
  const mapRef = useRef();
  const resetCenter = () =>
    mapRef.current?.setView(MAP_CONFIG.center, MAP_CONFIG.zoom);

  return (
    <div>
      <div style={{ display: "flex", gap: 14, marginBottom: 10 }}>
        <button className="map-btn" onClick={resetCenter}>
          🔄 Reset Map
        </button>
      </div>
      <MapContainer
        center={MAP_CONFIG.center}
        zoom={MAP_CONFIG.zoom}
        style={{ height: 360, width: "100%", borderRadius: 14 }}
        whenCreated={(map) => (mapRef.current = map)}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
        />
        {mode === "heatmap"
          ? congestion.map((loc, idx) => (
              <Circle
                key={idx}
                center={[loc.lat, loc.lng]}
                radius={highlight ? 500 : 300}
                pathOptions={{
                  color: highlight ? "orange" : "red",
                  fillColor: highlight ? "#ffd580" : "orange",
                  fillOpacity: 0.45,
                }}
              >
                <Popup>{loc.label}</Popup>
              </Circle>
            ))
          : congestion.map((loc, idx) => (
              <Marker key={idx} position={[loc.lat, loc.lng]}>
                <Popup>{loc.label}</Popup>
              </Marker>
            ))}
        <Marker position={[22.57, 88.365]} />
      </MapContainer>
    </div>
  );
}

// 🔹 Emergency Notification
function EmergencyNotification({ alert }) {
  if (!alert.active) return null;
  return (
    <div className="pulse-alert">
      🚨 <strong>{alert.type}: </strong>
      {alert.message}
    </div>
  );
}

// 🔹 Metrics Panel
function MetricsPanel({ metrics }) {
  return (
    <section className="metrics-panel">
      {metrics.map((metric) => (
        <div key={metric.label} className="metric-card">
          <strong className="metric-label">{metric.label}</strong>
          <span className="metric-value">{metric.value}</span>
        </div>
      ))}
    </section>
  );
}

// 🔹 Main App Component
function App() {
  const [showLanding, setShowLanding] = useState(true); // Landing screen toggle
  const [congestion] = useState(MAP_CONFIG.congestion);
  const [highlight, setHighlight] = useState(false);
  const [mode, setMode] = useState("heatmap");
  const [paused, setPaused] = useState(false);
  const [predictionMode, setPredictionMode] = useState(false);
  const [signals, setSignals] = useState(true);
  const [emergency, setEmergency] = useState(DEFAULT_EMERGENCY_ALERT);

  // 👉 If still on Landing → show Landing page
  if (showLanding) {
    return <Landing onEnter={() => setShowLanding(false)} />;
  }

  // 👉 Otherwise show Dashboard
  return (
    <div
      style={{
        fontFamily: "Inter, Arial, sans-serif",
        background: "#e2e2ec",
      }}
    >
      <header className="app-header">
        <div className="logo-section">
          <div className="logo">AI</div>
          <div>
            <h1>AIVISTA</h1>
            <p>Sensor-first, AI-driven traffic management</p>
          </div>
        </div>
        <nav style={{ display: "flex", gap: 12 }}>
          <button
            className="header-btn-primary"
            onClick={() => setShowLanding(true)} // 👈 Go back to Landing page
          >
            ⬅️ Front Page
          </button>
          <button className="header-btn-primary">Request Demo</button>
          <button className="header-btn-secondary">Download Spec</button>
        </nav>
      </header>

      <main style={{ maxWidth: 1400, margin: "40px auto", padding: "0 24px" }}>
        <EmergencyNotification alert={emergency} />

        <section className="button-panel">
          <button className="map-btn" onClick={() => setPaused(!paused)}>
            {paused ? "▶️ Resume Updates" : "⏸ Pause Updates"}
          </button>
          <button className="map-btn" onClick={() => setHighlight(!highlight)}>
            {highlight ? "🟢 Clear Highlights" : "⚠️ Highlight Congestion"}
          </button>
          <button
            className="map-btn"
            onClick={() =>
              setMode(mode === "heatmap" ? "markers" : "heatmap")
            }
          >
            {mode === "heatmap" ? "📍 Show Markers" : "🌡 Show Heatmap"}
          </button>
          <button
            className="map-btn"
            onClick={() => setPredictionMode(!predictionMode)}
          >
            {predictionMode ? "📊 Show Current Data" : "🔮 Show Predictions"}
          </button>
          <button className="map-btn" onClick={() => setSignals(!signals)}>
            {signals
              ? "🟢 Adaptive Signals ON"
              : "🔴 Adaptive Signals OFF"}
          </button>
          <button
            className="map-btn"
            onClick={() =>
              setEmergency({
                active: true,
                type: "Fire Truck Detected",
                message: "Signals optimized: Emergency route cleared!",
              })
            }
          >
            🚑 Trigger Emergency
          </button>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 32,
            marginTop: 32,
          }}
        >
          <div className="panel">
            <h3>Traffic Congestion Chart</h3>
            <TrafficChart paused={paused} predictionMode={predictionMode} />
          </div>
          <div className="panel">
            <h3>City Map</h3>
            <CityMap congestion={congestion} highlight={highlight} mode={mode} />
          </div>
        </section>

        <MetricsPanel metrics={METRICS} />
      </main>

      <footer className="app-footer">
        <div>© 2025 AIVISTA</div>
        <div>Built for sensor-first smart cities</div>
      </footer>
    </div>
  );
}

export default App;
