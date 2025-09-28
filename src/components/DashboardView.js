import React, { useState } from 'react';
import Chatbot from './Chatbot';
import { Chart, ChartModal } from './Chart';

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

export default DashboardView;
