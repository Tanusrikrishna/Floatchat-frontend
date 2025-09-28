import React, { useState } from 'react';

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

export default LoginModal;
