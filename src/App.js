import React, { useState, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import './App.css';

// --- ARGO Float Data ---
const argoFloatData = [
    { id: 2902387, name: 'AD05', positions: [{ lat: 10.5, lon: 68.2 },{ lat: 10.8, lon: 68.5 }] },
    { id: 2902388, name: 'AD06', positions: [{ lat: 12.1, lon: 70.3 },{ lat: 12.3, lon: 70.6 },{ lat: 12.5, lon: 70.9 }] },
    { id: 5906285, name: 'CB01', positions: [{ lat: 11.2, lon: 90.5 },{ lat: 11.0, lon: 90.2 }] },
    { id: 2902383, name: 'BD10', positions: [{ lat: 14.8, lon: 88.0 },{ lat: 15.0, lon: 88.3 },{ lat: 15.2, lon: 88.5 }] },
];

// --- Login/Signup Modal Component ---
const LoginModal = ({ isOpen, onClose, setLoggedIn }) => {
    const [authMode, setAuthMode] = useState('login');
    if (!isOpen) return null;
    const handleSubmit = (e) => {
        e.preventDefault();
        setLoggedIn(true);
        onClose();
    };
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose}>&times;</button>
                <h2>{authMode === 'login' ? 'Login' : 'Sign Up'}</h2>
                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" required />
                    </div>
                    {authMode === 'signup' && (
                         <div className="form-group">
                            <label htmlFor="confirm-password">Confirm Password</label>
                            <input type="password" id="confirm-password" required />
                        </div>
                    )}
                    <button type="submit" className="auth-submit-btn">{authMode === 'login' ? 'Login' : 'Sign Up'}</button>
                </form>
                <div className="switch-auth-mode">
                    {authMode === 'login' ? (
                        <span>Don't have an account? <button onClick={() => setAuthMode('signup')}>Sign Up</button></span>
                    ) : (
                        <span>Already have an account? <button onClick={() => setAuthMode('login')}>Login</button></span>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- Chatbot Component ---
const Chatbot = ({ onNewChartRequest, isDashboard }) => {
    const [messages, setMessages] = useState([
        { sender: 'bot', text: isDashboard ? 'Ask me to generate a chart.' : 'Hello! Ask me about the floats.' }
    ]);
    const [inputValue, setInputValue] = useState('');

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;
        const userMessage = { sender: 'user', text: inputValue };
        setMessages(prev => [...prev, userMessage]);
        
        if (isDashboard) {
            const botMessage = { sender: 'bot', text: `Generating chart for: "${inputValue}"...` };
            setMessages(prev => [...prev, botMessage]);
            onNewChartRequest({ id: Date.now(), title: `Analysis for "${inputValue}"` });
        } else {
            const botMessage = { sender: 'bot', text: `Searching for: "${inputValue}"... (Backend not connected)` };
            setMessages(prev => [...prev, botMessage]);
        }
        setInputValue('');
    };

    return (
        <>
            <div className="chatbot-header">FloatChat AI</div>
            <div className="messages-list">
                {messages.map((msg, index) => <div key={index} className={`message ${msg.sender}`}>{msg.text}</div>)}
            </div>
            <form className="message-form" onSubmit={handleSendMessage}>
                <input type="text" placeholder={isDashboard ? "Request a chart..." : "Ask about a float..."} value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
                <button type="submit">{isDashboard ? "Generate" : "Send"}</button>
            </form>
        </>
    );
};

// --- Chart Component ---
const Chart = ({ id, title, onClick }) => (
    <div className="chart-container" onClick={() => onClick({ id, title })}>
        <h3>{title}</h3>
        <div className="chart-placeholder">Chart Data Would Be Displayed Here</div>
    </div>
);

// --- Chart Modal Component ---
const ChartModal = ({ chart, onClose }) => {
    if (!chart) return null;

    return (
        <div className="chart-modal-overlay" onClick={onClose}>
            <div className="chart-modal-content" onClick={e => e.stopPropagation()}>
                <button className="chart-modal-close-btn" onClick={onClose}>&times;</button>
                <h2>{chart.title}</h2>
                <div className="chart-modal-placeholder">
                    Enlarged Chart View
                </div>
            </div>
        </div>
    );
};

// --- Dashboard View ---
const DashboardView = () => {
    const [charts, setCharts] = useState([]);
    const [selectedChart, setSelectedChart] = useState(null);

    const addChart = (newChart) => setCharts(prev => [...prev, newChart]);
    const handleChartClick = (chartData) => setSelectedChart(chartData);
    const handleCloseModal = () => setSelectedChart(null);

    return (
        <>
            <ChartModal chart={selectedChart} onClose={handleCloseModal} />
            <div className="dashboard-view">
                <div className="dashboard-chatbot">
                    <Chatbot onNewChartRequest={addChart} isDashboard={true} />
                </div>
                <div className="charts-area">
                    {charts.map(chart => <Chart key={chart.id} id={chart.id} title={chart.title} onClick={handleChartClick} />)}
                    {charts.length === 0 && <div className="chart-placeholder" style={{gridColumn: "1 / -1", height: "100%"}}>Your generated charts will appear here.</div>}
                </div>
            </div>
        </>
    );
};

// --- Live Map View ---
const LiveMapView = () => {
    const [sidebarWidth, setSidebarWidth] = useState(350);
    const mapRef = useRef(null);
    const isResizing = useRef(false);

    const handleMouseMove = useCallback((e) => {
        if (!isResizing.current) return;
        const newWidth = e.clientX;
        if (newWidth > 300 && newWidth < window.innerWidth - 300) {
            setSidebarWidth(newWidth);
        }
    }, []);

    const handleMouseUp = useCallback(() => {
        isResizing.current = false;
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
        if (mapRef.current) {
            mapRef.current.invalidateSize();
        }
    }, [handleMouseMove]);

    const handleMouseDown = useCallback((e) => {
        e.preventDefault();
        isResizing.current = true;
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    }, [handleMouseMove, handleMouseUp]);

    return (
        <div className="main-content">
            <aside className="chatbot-sidebar" style={{ width: `${sidebarWidth}px` }}>
                <Chatbot isDashboard={false} />
            </aside>
            <div className="resizer" onMouseDown={handleMouseDown} />
            <main className="map-container">
                <MapContainer center={[10, 80]} zoom={5} ref={mapRef}>
                    <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" attribution='Tiles &copy; Esri' />
                    {argoFloatData.map((float) => {
                        const latestPosition = float.positions[float.positions.length - 1];
                        const trackPositions = float.positions.map(p => [p.lat, p.lon]);
                        const customIcon = L.divIcon({
                            className: 'custom-div-icon',
                            html: `<div style="background-color: #d9534f; color: white; padding: 5px 8px; border-radius: 50%; font-size: 12px; font-weight: bold; text-align: center; box-shadow: 2px 2px 5px rgba(0,0,0,0.5); border: 1px solid #fff;">${float.name}</div>`,
                            iconSize: [40, 40],
                            iconAnchor: [20, 20]
                        });
                        return (
                            <React.Fragment key={float.id}>
                                {trackPositions.length > 1 && <Polyline pathOptions={{ color: '#ffc107', weight: 2 }} positions={trackPositions} />}
                                <Marker position={[latestPosition.lat, latestPosition.lon]} icon={customIcon}>
                                    <Popup><b>Float: {float.name} (ID: {float.id})</b><br />Lat: {latestPosition.lat.toFixed(4)}, Lon: {latestPosition.lon.toFixed(4)}</Popup>
                                </Marker>
                            </React.Fragment>
                        );
                    })}
                </MapContainer>
            </main>
        </div>
    );
};

// --- Main App Component ---
function App() {
    const [currentView, setCurrentView] = useState('map');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    return (
        <div className="app-container">
            <LoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} setLoggedIn={setIsLoggedIn} />
            <nav className="navbar">
                <div className="logo">
                     <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                       <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Z" />
                       <path d="M12 12a10 10 0 0 0-3.45 1.8L12 22a10 10 0 0 0 3.45-8.2L12 2" />
                       <path d="m7 12 5 10 5-10-5-10-5 10z" />
                    </svg>
                    Ocean Observation Network
                </div>
                <div className="nav-links">
                    <button onClick={() => setCurrentView('map')} className={currentView === 'map' ? 'active' : ''}>Live Map</button>
                    <button onClick={() => setCurrentView('dashboard')} className={currentView === 'dashboard' ? 'active' : ''}>Dashboard</button>
                    {isLoggedIn ? (
                        <button onClick={() => setIsLoggedIn(false)} className="login-btn">Logout</button>
                    ) : (
                        <button onClick={() => setIsModalOpen(true)} className="login-btn">Login</button>
                    )}
                </div>
            </nav>
            {currentView === 'map' ? <LiveMapView /> : <DashboardView />}
        </div>
    );
}

export default App;

