import React from 'react';

// This component is for the small chart previews in the dashboard
export const Chart = ({ id, title, onClick }) => (
    <div className="chart-container" onClick={() => onClick({ id, title })}>
        <h3>{title}</h3>
        <div className="chart-placeholder">Chart Data Would Be Displayed Here</div>
    </div>
);

// This component is for the enlarged chart modal
export const ChartModal = ({ chart, onClose }) => {
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
