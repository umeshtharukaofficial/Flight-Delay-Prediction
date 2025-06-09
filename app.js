// Global variables
let airlineData = [];
let filteredData = [];
let charts = {};

// Chart colors for consistent styling
const chartColors = ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545', '#D2BA4C', '#964325', '#944454', '#13343B'];

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
});

async function initializeDashboard() {
    try {
        showLoading(true);
        await loadAirlineData();
        populateFilters();
        initializeTabs();
        initializeCharts();
        updateDashboard();
        showLoading(false);
    } catch (error) {
        console.error('Error initializing dashboard:', error);
        showError('Failed to load airline data. Please try again.');
        showLoading(false);
    }
}

async function loadAirlineData() {
    try {
        const response = await fetch('https://ppl-ai-code-interpreter-files.s3.amazonaws.com/web/direct-files/0aa417f4006bbb37265263ceedcf3392/823de227-2367-43c4-bb33-f3108377a6ff/40be57e5.csv');
        const csvText = await response.text();
        airlineData = parseCSV(csvText);
        filteredData = [...airlineData];
        console.log('Loaded', airlineData.length, 'records');
    } catch (error) {
        throw new Error('Failed to fetch airline data: ' + error.message);
    }
}

function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        if (values.length >= headers.length) {
            const row = {};
            headers.forEach((header, index) => {
                const value = values[index]?.trim() || '';
                // Convert numeric fields
                if (['year', 'month', 'carrier_delay', 'weather_delay', 'nas_delay', 'security_delay', 'late_aircraft_delay', 'arr_flights', 'arr_cancelled', 'arr_diverted', 'arr_del15', 'arr_delay', 'delay_ratio'].includes(header)) {
                    row[header] = parseFloat(value) || 0;
                } else {
                    row[header] = value;
                }
            });
            data.push(row);
        }
    }
    return data;
}

function populateFilters() {
    // Populate year filter
    const years = [...new Set(airlineData.map(d => d.year))].sort();
    const yearSelect = document.getElementById('yearFilter');
    years.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    });

    // Populate carrier filter
    const carriers = [...new Set(airlineData.map(d => d.carrier))].sort();
    const carrierSelect = document.getElementById('carrierFilter');
    carriers.forEach(carrier => {
        const option = document.createElement('option');
        option.value = carrier;
        option.textContent = carrier;
        carrierSelect.appendChild(option);
    });

    // Populate airport filter
    const airports = [...new Set(airlineData.map(d => d.airport))].sort();
    const airportSelect = document.getElementById('airportFilter');
    airports.forEach(airport => {
        const option = document.createElement('option');
        option.value = airport;
        option.textContent = airport;
        airportSelect.appendChild(option);
    });

    // Add event listeners
    document.getElementById('applyFilters').addEventListener('click', applyFilters);
    document.getElementById('resetFilters').addEventListener('click', resetFilters);
    document.getElementById('exportData').addEventListener('click', exportData);
}

function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const targetTab = button.getAttribute('data-tab');
            console.log('Switching to tab:', targetTab); // Debug logging
            
            // Remove active class from all tabs and panels
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanels.forEach(panel => panel.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding panel
            button.classList.add('active');
            const targetPanel = document.getElementById(targetTab);
            if (targetPanel) {
                targetPanel.classList.add('active');
            } else {
                console.error('Panel not found for tab:', targetTab);
            }
        });
    });
}

function applyFilters() {
    const yearFilter = Array.from(document.getElementById('yearFilter').selectedOptions).map(o => parseInt(o.value)).filter(v => !isNaN(v));
    const carrierFilter = Array.from(document.getElementById('carrierFilter').selectedOptions).map(o => o.value).filter(v => v !== '');
    const airportFilter = Array.from(document.getElementById('airportFilter').selectedOptions).map(o => o.value).filter(v => v !== '');

    filteredData = airlineData.filter(record => {
        return (yearFilter.length === 0 || yearFilter.includes(record.year)) &&
               (carrierFilter.length === 0 || carrierFilter.includes(record.carrier)) &&
               (airportFilter.length === 0 || airportFilter.includes(record.airport));
    });

    updateDashboard();
}

function resetFilters() {
    document.getElementById('yearFilter').selectedIndex = -1;
    document.getElementById('carrierFilter').selectedIndex = -1;
    document.getElementById('airportFilter').selectedIndex = -1;
    filteredData = [...airlineData];
    updateDashboard();
}

function updateDashboard() {
    updateMetrics();
    updateAllCharts();
    updateRecommendations();
}

function updateMetrics() {
    const totalFlights = filteredData.reduce((sum, d) => sum + d.arr_flights, 0);
    const totalDelay = filteredData.reduce((sum, d) => sum + (d.arr_delay || 0), 0);
    const totalCancelled = filteredData.reduce((sum, d) => sum + d.arr_cancelled, 0);
    const totalDelayed = filteredData.reduce((sum, d) => sum + d.arr_del15, 0);

    const avgDelay = totalFlights > 0 ? (totalDelay / totalFlights).toFixed(1) : 0;
    const cancellationRate = totalFlights > 0 ? ((totalCancelled / totalFlights) * 100).toFixed(1) : 0;
    const onTimePerf = totalFlights > 0 ? (((totalFlights - totalDelayed) / totalFlights) * 100).toFixed(1) : 0;

    document.getElementById('totalFlights').textContent = totalFlights.toLocaleString();
    document.getElementById('avgDelay').textContent = `${avgDelay} min`;
    document.getElementById('cancellationRate').textContent = `${cancellationRate}%`;
    document.getElementById('onTimePerf').textContent = `${onTimePerf}%`;
}

function initializeCharts() {
    // Initialize all charts with empty data
    createMonthlyVolumeChart();
    createBusiestAirportsChart();
    createDelayedAirportsChart();
    createDelayCausesChart();
    createDelayDistributionChart();
    createRiskMatrixChart();
    createPerformanceTrendChart();
    createCarrierComparisonChart();
}

function updateAllCharts() {
    updateMonthlyVolumeChart();
    updateBusiestAirportsChart();
    updateDelayedAirportsChart();
    updateDelayCausesChart();
    updateDelayDistributionChart();
    updateRiskMatrixChart();
    updatePerformanceTrendChart();
    updateCarrierComparisonChart();
}

function createMonthlyVolumeChart() {
    const ctx = document.getElementById('monthlyVolumeChart').getContext('2d');
    charts.monthlyVolume = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Flight Volume',
                data: [],
                borderColor: chartColors[0],
                backgroundColor: chartColors[0] + '20',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Flights'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Month'
                    }
                }
            }
        }
    });
}

function updateMonthlyVolumeChart() {
    const monthlyData = {};
    filteredData.forEach(d => {
        const key = `${d.year}-${d.month.toString().padStart(2, '0')}`;
        monthlyData[key] = (monthlyData[key] || 0) + d.arr_flights;
    });

    const sortedKeys = Object.keys(monthlyData).sort();
    const labels = sortedKeys.map(key => {
        const [year, month] = key.split('-');
        return `${year}-${month}`;
    });
    const data = sortedKeys.map(key => monthlyData[key]);

    charts.monthlyVolume.data.labels = labels;
    charts.monthlyVolume.data.datasets[0].data = data;
    charts.monthlyVolume.update();
}

function createBusiestAirportsChart() {
    const ctx = document.getElementById('busiestAirportsChart').getContext('2d');
    charts.busiestAirports = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Total Flights',
                data: [],
                backgroundColor: chartColors.slice(0, 10)
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            plugins: {
                title: {
                    display: false
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Flights'
                    }
                }
            }
        }
    });
}

function updateBusiestAirportsChart() {
    const airportData = {};
    filteredData.forEach(d => {
        airportData[d.airport] = (airportData[d.airport] || 0) + d.arr_flights;
    });

    const sortedAirports = Object.entries(airportData)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10);

    charts.busiestAirports.data.labels = sortedAirports.map(([airport]) => airport);
    charts.busiestAirports.data.datasets[0].data = sortedAirports.map(([,flights]) => flights);
    charts.busiestAirports.update();
}

function createDelayedAirportsChart() {
    const ctx = document.getElementById('delayedAirportsChart').getContext('2d');
    charts.delayedAirports = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Average Delay (minutes)',
                data: [],
                backgroundColor: chartColors[1]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            plugins: {
                title: {
                    display: false
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Average Delay (minutes)'
                    }
                }
            }
        }
    });
}

function updateDelayedAirportsChart() {
    const airportDelays = {};
    const airportFlights = {};

    filteredData.forEach(d => {
        if (!airportDelays[d.airport]) {
            airportDelays[d.airport] = 0;
            airportFlights[d.airport] = 0;
        }
        airportDelays[d.airport] += d.arr_delay || 0;
        airportFlights[d.airport] += d.arr_flights;
    });

    const avgDelays = Object.entries(airportDelays).map(([airport, totalDelay]) => [
        airport,
        airportFlights[airport] > 0 ? totalDelay / airportFlights[airport] : 0
    ]).sort(([,a], [,b]) => b - a).slice(0, 10);

    charts.delayedAirports.data.labels = avgDelays.map(([airport]) => airport);
    charts.delayedAirports.data.datasets[0].data = avgDelays.map(([,delay]) => delay.toFixed(1));
    charts.delayedAirports.update();
}

function createDelayCausesChart() {
    const ctx = document.getElementById('delayCausesChart').getContext('2d');
    charts.delayCauses = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Carrier Delay',
                    data: [],
                    borderColor: chartColors[0],
                    backgroundColor: chartColors[0] + '20',
                    tension: 0.4
                },
                {
                    label: 'Weather Delay',
                    data: [],
                    borderColor: chartColors[1],
                    backgroundColor: chartColors[1] + '20',
                    tension: 0.4
                },
                {
                    label: 'NAS Delay',
                    data: [],
                    borderColor: chartColors[2],
                    backgroundColor: chartColors[2] + '20',
                    tension: 0.4
                },
                {
                    label: 'Security Delay',
                    data: [],
                    borderColor: chartColors[3],
                    backgroundColor: chartColors[3] + '20',
                    tension: 0.4
                },
                {
                    label: 'Late Aircraft',
                    data: [],
                    borderColor: chartColors[4],
                    backgroundColor: chartColors[4] + '20',
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Total Delay Minutes'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Month'
                    }
                }
            }
        }
    });
}

function updateDelayCausesChart() {
    const monthlyDelays = {};

    filteredData.forEach(d => {
        const key = `${d.year}-${d.month.toString().padStart(2, '0')}`;
        if (!monthlyDelays[key]) {
            monthlyDelays[key] = {
                carrier: 0,
                weather: 0,
                nas: 0,
                security: 0,
                late_aircraft: 0
            };
        }
        monthlyDelays[key].carrier += d.carrier_delay || 0;
        monthlyDelays[key].weather += d.weather_delay || 0;
        monthlyDelays[key].nas += d.nas_delay || 0;
        monthlyDelays[key].security += d.security_delay || 0;
        monthlyDelays[key].late_aircraft += d.late_aircraft_delay || 0;
    });

    const sortedKeys = Object.keys(monthlyDelays).sort();
    const labels = sortedKeys.map(key => {
        const [year, month] = key.split('-');
        return `${year}-${month}`;
    });

    charts.delayCauses.data.labels = labels;
    charts.delayCauses.data.datasets[0].data = sortedKeys.map(key => monthlyDelays[key].carrier);
    charts.delayCauses.data.datasets[1].data = sortedKeys.map(key => monthlyDelays[key].weather);
    charts.delayCauses.data.datasets[2].data = sortedKeys.map(key => monthlyDelays[key].nas);
    charts.delayCauses.data.datasets[3].data = sortedKeys.map(key => monthlyDelays[key].security);
    charts.delayCauses.data.datasets[4].data = sortedKeys.map(key => monthlyDelays[key].late_aircraft);
    charts.delayCauses.update();
}

function createDelayDistributionChart() {
    const ctx = document.getElementById('delayDistributionChart').getContext('2d');
    charts.delayDistribution = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Carrier Delay', 'Weather Delay', 'NAS Delay', 'Security Delay', 'Late Aircraft'],
            datasets: [{
                data: [],
                backgroundColor: chartColors.slice(0, 5)
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: false
                }
            }
        }
    });
}

function updateDelayDistributionChart() {
    const totalDelays = {
        carrier: filteredData.reduce((sum, d) => sum + (d.carrier_delay || 0), 0),
        weather: filteredData.reduce((sum, d) => sum + (d.weather_delay || 0), 0),
        nas: filteredData.reduce((sum, d) => sum + (d.nas_delay || 0), 0),
        security: filteredData.reduce((sum, d) => sum + (d.security_delay || 0), 0),
        late_aircraft: filteredData.reduce((sum, d) => sum + (d.late_aircraft_delay || 0), 0)
    };

    charts.delayDistribution.data.datasets[0].data = [
        totalDelays.carrier,
        totalDelays.weather,
        totalDelays.nas,
        totalDelays.security,
        totalDelays.late_aircraft
    ];
    charts.delayDistribution.update();
}

function createRiskMatrixChart() {
    const ctx = document.getElementById('riskMatrixChart').getContext('2d');
    charts.riskMatrix = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Airport Risk',
                data: [],
                backgroundColor: chartColors[0] + '80',
                borderColor: chartColors[0]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Airport: ${context.raw.airport}, Risk Score: ${context.parsed.y.toFixed(2)}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Flight Volume'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Delay Risk Score'
                    }
                }
            }
        }
    });
}

function updateRiskMatrixChart() {
    const airportRisk = {};

    filteredData.forEach(d => {
        if (!airportRisk[d.airport]) {
            airportRisk[d.airport] = {
                flights: 0,
                delays: 0,
                totalDelay: 0
            };
        }
        airportRisk[d.airport].flights += d.arr_flights;
        airportRisk[d.airport].delays += d.arr_del15;
        airportRisk[d.airport].totalDelay += d.arr_delay || 0;
    });

    const riskData = Object.entries(airportRisk).map(([airport, data]) => {
        const delayRate = data.flights > 0 ? data.delays / data.flights : 0;
        const avgDelay = data.flights > 0 ? data.totalDelay / data.flights : 0;
        const riskScore = delayRate * avgDelay;
        
        return {
            x: data.flights,
            y: riskScore,
            airport: airport
        };
    });

    charts.riskMatrix.data.datasets[0].data = riskData;
    charts.riskMatrix.update();
}

function createPerformanceTrendChart() {
    const ctx = document.getElementById('performanceTrendChart').getContext('2d');
    charts.performanceTrend = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'On-Time Performance (%)',
                data: [],
                borderColor: chartColors[0],
                backgroundColor: chartColors[0] + '20',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'On-Time Performance (%)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Month'
                    }
                }
            }
        }
    });
}

function updatePerformanceTrendChart() {
    const monthlyPerf = {};

    filteredData.forEach(d => {
        const key = `${d.year}-${d.month.toString().padStart(2, '0')}`;
        if (!monthlyPerf[key]) {
            monthlyPerf[key] = {
                total: 0,
                onTime: 0
            };
        }
        monthlyPerf[key].total += d.arr_flights;
        monthlyPerf[key].onTime += (d.arr_flights - d.arr_del15);
    });

    const sortedKeys = Object.keys(monthlyPerf).sort();
    const labels = sortedKeys.map(key => {
        const [year, month] = key.split('-');
        return `${year}-${month}`;
    });
    const perfData = sortedKeys.map(key => {
        const data = monthlyPerf[key];
        return data.total > 0 ? (data.onTime / data.total) * 100 : 0;
    });

    charts.performanceTrend.data.labels = labels;
    charts.performanceTrend.data.datasets[0].data = perfData;
    charts.performanceTrend.update();
}

function createCarrierComparisonChart() {
    const ctx = document.getElementById('carrierComparisonChart').getContext('2d');
    charts.carrierComparison = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'On-Time Performance (%)',
                data: [],
                backgroundColor: chartColors.slice(0, 10)
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'On-Time Performance (%)'
                    }
                }
            }
        }
    });
}

function updateCarrierComparisonChart() {
    const carrierPerf = {};

    filteredData.forEach(d => {
        if (!carrierPerf[d.carrier]) {
            carrierPerf[d.carrier] = {
                total: 0,
                onTime: 0
            };
        }
        carrierPerf[d.carrier].total += d.arr_flights;
        carrierPerf[d.carrier].onTime += (d.arr_flights - d.arr_del15);
    });

    const sortedCarriers = Object.entries(carrierPerf)
        .filter(([,data]) => data.total >= 100) // Only include carriers with significant volume
        .map(([carrier, data]) => [
            carrier,
            data.total > 0 ? (data.onTime / data.total) * 100 : 0
        ])
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10);

    charts.carrierComparison.data.labels = sortedCarriers.map(([carrier]) => carrier);
    charts.carrierComparison.data.datasets[0].data = sortedCarriers.map(([,perf]) => perf.toFixed(1));
    charts.carrierComparison.update();
}

function updateRecommendations() {
    const recommendationsList = document.getElementById('recommendationsList');
    const recommendations = generateRecommendations();
    
    recommendationsList.innerHTML = recommendations.map(rec => `
        <div class="recommendation-item">
            <div class="recommendation-priority priority-${rec.priority}">${rec.priority.toUpperCase()}</div>
            <h5>${rec.title}</h5>
            <p>${rec.description}</p>
        </div>
    `).join('');
}

function generateRecommendations() {
    const recommendations = [];
    
    // Analyze data for recommendations
    const totalFlights = filteredData.reduce((sum, d) => sum + d.arr_flights, 0);
    const totalDelayed = filteredData.reduce((sum, d) => sum + d.arr_del15, 0);
    const delayRate = totalFlights > 0 ? (totalDelayed / totalFlights) * 100 : 0;
    
    if (delayRate > 20) {
        recommendations.push({
            priority: 'high',
            title: 'Critical Delay Management',
            description: `Current delay rate is ${delayRate.toFixed(1)}%. Immediate action required to improve operations.`
        });
    }
    
    // Weather delay analysis
    const weatherDelays = filteredData.reduce((sum, d) => sum + (d.weather_delay || 0), 0);
    const totalDelayMinutes = filteredData.reduce((sum, d) => sum + (d.arr_delay || 0), 0);
    const weatherPercent = totalDelayMinutes > 0 ? (weatherDelays / totalDelayMinutes) * 100 : 0;
    
    if (weatherPercent > 30) {
        recommendations.push({
            priority: 'medium',
            title: 'Weather Contingency Planning',
            description: `Weather accounts for ${weatherPercent.toFixed(1)}% of delays. Consider enhanced weather monitoring systems.`
        });
    }
    
    // Carrier performance
    recommendations.push({
        priority: 'low',
        title: 'Staff Optimization',
        description: 'Based on current traffic patterns, consider adjusting staffing levels during peak hours.'
    });
    
    return recommendations;
}

function exportData() {
    const csvContent = convertToCSV(filteredData);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'filtered_airline_data.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

function convertToCSV(data) {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(header => row[header]).join(','))
    ].join('\n');
    
    return csvContent;
}

function showLoading(show) {
    const loadingIndicator = document.getElementById('loadingIndicator');
    const mainContent = document.querySelector('.tab-content');
    
    if (show) {
        loadingIndicator.classList.remove('hidden');
        mainContent.style.opacity = '0.5';
    } else {
        loadingIndicator.classList.add('hidden');
        mainContent.style.opacity = '1';
    }
}

function showError(message) {
    const mainContent = document.querySelector('.main-content');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    mainContent.insertBefore(errorDiv, mainContent.firstChild);
}