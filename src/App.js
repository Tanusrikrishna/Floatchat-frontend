import React, { useState } from 'react';
import './App.css';
import LoginModal from './components/LoginModal';
import LiveMapView from './components/LiveMapView';
import DashboardView from './components/DashboardView';

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
            {/* Conditionally render the correct view based on state */}
            {currentView === 'map' ? <LiveMapView /> : <DashboardView />}
        </div>
    );
}

export default App;

