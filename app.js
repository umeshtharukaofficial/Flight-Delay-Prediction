// AI Dashboard for Airlines & Airports - JavaScript

// Global data and state
let flightData = [];
let filteredData = [];
let charts = {};

// Sample flight data (embedded for demo)
const sampleFlightData = [
    {"year": 2023, "month": 1, "airport": "ATL", "airport_name": "Hartsfield-Jackson Atlanta International", "carrier": "AA", "carrier_name": "American Airlines", "arr_flights": 1687, "arr_cancelled": 8, "arr_diverted": 0, "arr_del15": 488, "arr_delay": 14893.77, "carrier_delay": 209, "weather_delay": 80, "nas_delay": 140, "security_delay": 14, "late_aircraft_delay": 45, "delay_ratio": 0.2893},
    {"year": 2023, "month": 1, "airport": "ATL", "airport_name": "Hartsfield-Jackson Atlanta International", "carrier": "DL", "carrier_name": "Delta Air Lines", "arr_flights": 1748, "arr_cancelled": 28, "arr_diverted": 8, "arr_del15": 453, "arr_delay": 8875.55, "carrier_delay": 42, "weather_delay": 161, "nas_delay": 231, "security_delay": 2, "late_aircraft_delay": 17, "delay_ratio": 0.2592},
    {"year": 2023, "month": 6, "airport": "LAX", "airport_name": "Los Angeles International", "carrier": "UA", "carrier_name": "United Airlines", "arr_flights": 2245, "arr_cancelled": 15, "arr_diverted": 3, "arr_del15": 687, "arr_delay": 18234.56, "carrier_delay": 156, "weather_delay": 89, "nas_delay": 298, "security_delay": 8, "late_aircraft_delay": 136, "delay_ratio": 0.3061},
    {"year": 2023, "month": 12, "airport": "ORD", "airport_name": "Chicago O'Hare International", "carrier": "WN", "carrier_name": "Southwest Airlines", "arr_flights": 1892, "arr_cancelled": 22, "arr_diverted": 4, "arr_del15": 543, "arr_delay": 15789.33, "carrier_delay": 134, "weather_delay": 198, "nas_delay": 156, "security_delay": 12, "late_aircraft_delay": 43, "delay_ratio": 0.2870},
    {"year": 2024, "month": 3, "airport": "DFW", "airport_name": "Dallas/Fort Worth International", "carrier": "AA", "carrier_name": "American Airlines", "arr_flights": 1734, "arr_cancelled": 18, "arr_diverted": 2, "arr_del15": 478, "arr_delay": 13567.89, "carrier_delay": 123, "weather_delay": 67, "nas_delay": 189, "security_delay": 6, "late_aircraft_delay": 93, "delay_ratio": 0.2757},
    {"year": 2024, "month": 7, "airport": "JFK", "airport_name": "John F. Kennedy International", "carrier": "B6", "carrier_name": "JetBlue Airways", "arr_flights": 2156, "arr_cancelled": 31, "arr_diverted": 7, "arr_del15": 612, "arr_delay": 17234.12, "carrier_delay": 167, "weather_delay": 134, "nas_delay": 213, "security_delay": 11, "late_aircraft_delay": 87, "delay_ratio": 0.2840},
    // Additional synthetic data for better visualization
    {"year": 2023, "month": 2, "airport": "LAX", "airport_name": "Los Angeles International", "carrier": "DL", "carrier_name": "Delta Air Lines", "arr_flights": 1956, "arr_cancelled": 12, "arr_diverted": 2, "arr_del15": 523, "arr_delay": 12456.78, "carrier_delay": 145, "weather_delay": 76, "nas_delay": 187, "security_delay": 9, "late_aircraft_delay": 106, "delay_ratio": 0.2674},
    {"year": 2023, "month": 3, "airport": "ORD", "airport_name": "Chicago O'Hare International", "carrier": "AA", "carrier_name": "American Airlines", "arr_flights": 1823, "arr_cancelled": 19, "arr_diverted": 5, "arr_del15": 567, "arr_delay": 16789.23, "carrier_delay": 156, "weather_delay": 123, "nas_delay": 198, "security_delay": 15, "late_aircraft_delay": 75, "delay_ratio": 0.3111},
    {"year": 2023, "month": 4, "airport": "DFW", "airport_name": "Dallas/Fort Worth International", "carrier": "WN", "carrier_name": "Southwest Airlines", "arr_flights": 2034, "arr_cancelled": 16, "arr_diverted": 3, "arr_del15": 589, "arr_delay": 14567.45, "carrier_delay": 134, "weather_delay": 98, "nas_delay": 234, "security_delay": 7, "late_aircraft_delay": 116, "delay_ratio": 0.2895},
    {"year": 2023, "month": 5, "airport": "JFK", "airport_name": "John F. Kennedy International", "carrier": "AA", "carrier_name": "American Airlines", "arr_flights": 1765, "arr_cancelled": 23, "arr_diverted": 6, "arr_del15": 456, "arr_delay": 11234.67, "carrier_delay": 112, "weather_delay": 89, "nas_delay": 167, "security_delay": 12, "late_aircraft_delay": 76, "delay_ratio": 0.2584},
    {"year": 2024, "month": 8, "airport": "ATL", "airport_name": "Hartsfield-Jackson Atlanta International", "carrier": "DL", "carrier_name": "Delta Air Lines", "arr_flights": 2134, "arr_cancelled": 14, "arr_diverted": 3, "arr_del15": 623, "arr_delay": 15678.90, "carrier_delay": 178, "weather_delay": 145, "nas_delay": 189, "security_delay": 8, "late_aircraft_delay": 103, "delay_ratio": 0.2920},
    {"year": 2024, "month": 9, "airport": "LAX", "airport_name": "Los Angeles International", "carrier": "UA", "carrier_name": "United Airlines", "arr_flights": 1987, "arr_cancelled": 11, "arr_diverted": 2, "arr_del15": 534, "arr_delay": 13245.67, "carrier_delay": 134, "weather_delay": 67, "nas_delay": 201, "security_delay": 6, "late_aircraft_delay": 126, "delay_ratio": 0.2688}
];

// Month names for display
const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    loadFlightData();
    setupEventListeners();
    updateTimestamps();
});

function initializeDashboard() {
    console.log('Initializing AI Dashboard...');
    
    // Set initial filter values
    filteredData = [...sampleFlightData];
    
    // Update month range display
    updateMonthRangeDisplay();
    
    // Create initial charts and KPIs with delay
    setTimeout(() => {
        updateDashboard();
    }, 500);
}

function loadFlightData() {
    // In a real application, this would fetch from an API
    flightData = [...sampleFlightData];
    filteredData = [...flightData];
    
    console.log('Flight data loaded:', flightData.length, 'records');
}

function setupEventListeners() {
    // Filter controls
    document.getElementById('yearFilter').addEventListener('change', applyFilters);
    document.getElementById('airlineFilter').addEventListener('change', applyFilters);
    document.getElementById('airportFilter').addEventListener('change', applyFilters);
    document.getElementById('monthRangeStart').addEventListener('input', updateMonthRange);
    document.getElementById('monthRangeEnd').addEventListener('input', updateMonthRange);
    document.getElementById('resetFilters').addEventListener('click', resetFilters);
    
    // Add export functionality
    addExportFunctionality();
}

function addExportFunctionality() {
    // Add export buttons if they don't exist
    const filterPanel = document.querySelector('.filter-panel .filter-grid');
    if (filterPanel && !document.getElementById('exportBtn')) {
        const exportGroup = document.createElement('div');
        exportGroup.className = 'filter-group';
        exportGroup.innerHTML = `
            <button id="exportBtn" class="btn btn--primary">Export Data</button>
            <button id="saveInsightsBtn" class="btn btn--secondary">Save Insights</button>
        `;
        filterPanel.appendChild(exportGroup);
        
        // Add event listeners
        document.getElementById('exportBtn').addEventListener('click', exportData);
        document.getElementById('saveInsightsBtn').addEventListener('click', saveInsights);
    }
}

function exportData() {
    const csvContent = convertToCSV(filteredData);
    downloadCSV(csvContent, 'flight_data_export.csv');
}

function saveInsights() {
    const insights = generateInsights();
    downloadText(insights, 'flight_insights.txt');
}

function convertToCSV(data) {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(',')];
    
    data.forEach(row => {
        const values = headers.map(header => {
            const value = row[header];
            return typeof value === 'string' ? `"${value}"` : value;
        });
        csvRows.push(values.join(','));
    });
    
    return csvRows.join('\n');
}

function generateInsights() {
    const totalFlights = filteredData.reduce((sum, record) => sum + record.arr_flights, 0);
    const avgDelayRatio = filteredData.reduce((sum, record) => sum + record.delay_ratio, 0) / filteredData.length;
    const topDelayedAirport = getTopDelayedAirport();
    const riskScore = calculateRiskScore();
    
    return `Flight Operations Insights Report
Generated: ${new Date().toLocaleString()}

Summary:
- Total Flights Analyzed: ${totalFlights.toLocaleString()}
- Average Delay Ratio: ${(avgDelayRatio * 100).toFixed(1)}%
- Most Delayed Airport: ${topDelayedAirport}
- Risk Score: ${riskScore}%

Recommendations:
${getRecommendationText(riskScore)}
`;
}

function getTopDelayedAirport() {
    const airportDelays = {};
    filteredData.forEach(record => {
        if (!airportDelays[record.airport]) {
            airportDelays[record.airport] = { totalDelay: 0, count: 0 };
        }
        airportDelays[record.airport].totalDelay += record.delay_ratio;
        airportDelays[record.airport].count++;
    });
    
    let topAirport = '';
    let highestDelay = 0;
    
    Object.keys(airportDelays).forEach(airport => {
        const avgDelay = airportDelays[airport].totalDelay / airportDelays[airport].count;
        if (avgDelay > highestDelay) {
            highestDelay = avgDelay;
            topAirport = airport;
        }
    });
    
    return topAirport;
}

function getRecommendationText(riskScore) {
    if (riskScore < 30) {
        return '- Normal operations, focus on optimization\n- Continue current resource allocation\n- Monitor for improvement opportunities';
    } else if (riskScore < 70) {
        return '- Increase monitoring frequency\n- Prepare contingency resources\n- Review peak hour staffing';
    } else {
        return '- Implement immediate delay management protocols\n- Deploy additional resources\n- Activate emergency response procedures';
    }
}

function downloadCSV(content, filename) {
    const blob = new Blob([content], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
}

function downloadText(content, filename) {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
}

function updateMonthRange() {
    updateMonthRangeDisplay();
    applyFilters();
}

function updateMonthRangeDisplay() {
    const startMonth = parseInt(document.getElementById('monthRangeStart').value);
    const endMonth = parseInt(document.getElementById('monthRangeEnd').value);
    
    // Ensure start is not greater than end
    if (startMonth > endMonth) {
        document.getElementById('monthRangeEnd').value = startMonth;
    }
    
    const startName = monthNames[startMonth - 1];
    const endName = monthNames[Math.max(startMonth, endMonth) - 1];
    
    document.getElementById('monthRangeDisplay').textContent = 
        startMonth === endMonth ? startName : `${startName} - ${endName}`;
}

function applyFilters() {
    const yearFilter = document.getElementById('yearFilter').value;
    const airlineFilter = Array.from(document.getElementById('airlineFilter').selectedOptions).map(option => option.value);
    const airportFilter = Array.from(document.getElementById('airportFilter').selectedOptions).map(option => option.value);
    const monthStart = parseInt(document.getElementById('monthRangeStart').value);
    const monthEnd = parseInt(document.getElementById('monthRangeEnd').value);
    
    filteredData = flightData.filter(record => {
        if (yearFilter && record.year.toString() !== yearFilter) return false;
        if (airlineFilter.length && !airlineFilter.includes(record.carrier)) return false;
        if (airportFilter.length && !airportFilter.includes(record.airport)) return false;
        if (record.month < monthStart || record.month > monthEnd) return false;
        return true;
    });
    
    console.log('Filters applied. Records:', filteredData.length);
    updateFilterDisplay();
    updateDashboard();
}

function updateFilterDisplay() {
    // Update filter display indicators
    const yearFilter = document.getElementById('yearFilter');
    const airlineFilter = document.getElementById('airlineFilter');
    const airportFilter = document.getElementById('airportFilter');
    
    // Add visual indicators for active filters
    updateFilterIndicator(yearFilter, yearFilter.value);
    updateFilterIndicator(airlineFilter, airlineFilter.selectedOptions.length > 0);
    updateFilterIndicator(airportFilter, airportFilter.selectedOptions.length > 0);
}

function updateFilterIndicator(element, hasSelection) {
    if (hasSelection) {
        element.style.borderColor = '#21808d';
        element.style.backgroundColor = '#f0f9fa';
    } else {
        element.style.borderColor = '';
        element.style.backgroundColor = '';
    }
}

function resetFilters() {
    document.getElementById('yearFilter').value = '';
    
    // Clear multi-select options
    const airlineSelect = document.getElementById('airlineFilter');
    const airportSelect = document.getElementById('airportFilter');
    
    for (let option of airlineSelect.options) {
        option.selected = false;
    }
    
    for (let option of airportSelect.options) {
        option.selected = false;
    }
    
    document.getElementById('monthRangeStart').value = 1;
    document.getElementById('monthRangeEnd').value = 12;
    
    updateMonthRangeDisplay();
    applyFilters();
}

function updateDashboard() {
    updateKPIs();
    updateHeatmaps();
    updateDelayTrends();
    updatePredictiveAnalytics();
}

function updateKPIs() {
    if (filteredData.length === 0) {
        setKPIValues(0, 0, 0, 0);
        return;
    }
    
    const totalFlights = filteredData.reduce((sum, record) => sum + record.arr_flights, 0);
    const totalDelayMinutes = filteredData.reduce((sum, record) => sum + record.arr_delay, 0);
    const totalDelayedFlights = filteredData.reduce((sum, record) => sum + record.arr_del15, 0);
    const totalCancelled = filteredData.reduce((sum, record) => sum + record.arr_cancelled, 0);
    
    const avgDelay = totalFlights > 0 ? Math.round(totalDelayMinutes / totalFlights) : 0;
    const onTimePerformance = totalFlights > 0 ? Math.round(((totalFlights - totalDelayedFlights) / totalFlights) * 100) : 0;
    const cancellationRate = totalFlights > 0 ? ((totalCancelled / totalFlights) * 100).toFixed(1) : 0;
    
    setKPIValues(totalFlights, avgDelay, onTimePerformance, cancellationRate);
}

function setKPIValues(totalFlights, avgDelay, onTimePerformance, cancellationRate) {
    // Animate counter for total flights
    animateCounter('totalFlightsCard', totalFlights, 0);
    
    // Animate counter for average delay
    animateCounter('avgDelayCard', avgDelay, 0);
    
    // Animate counter for on-time performance
    animateCounter('onTimeCard', onTimePerformance, 0, '%');
    
    // Update progress bar for on-time performance
    const progressBar = document.querySelector('#onTimeCard .kpi-progress-bar');
    if (progressBar) {
        setTimeout(() => {
            progressBar.style.width = onTimePerformance + '%';
        }, 500);
    }
    
    // Animate counter for cancellation rate
    animateCounter('cancellationCard', parseFloat(cancellationRate), 1, '%');
}

function animateCounter(cardId, target, decimals = 0, suffix = '') {
    const card = document.getElementById(cardId);
    const valueElement = card.querySelector('.kpi-value');
    const duration = 2000;
    const startTime = performance.now();
    const startValue = 0;
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentValue = startValue + (target - startValue) * easeOut;
        
        valueElement.textContent = currentValue.toFixed(decimals) + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }
    
    requestAnimationFrame(updateCounter);
}

function updateHeatmaps() {
    updateBusiestAirportsHeatmap();
    updateDelayedAirportsHeatmap();
}

function updateBusiestAirportsHeatmap() {
    const ctx = document.getElementById('busiestHeatmap').getContext('2d');
    
    if (charts.busiestHeatmap) {
        charts.busiestHeatmap.destroy();
    }
    
    // Simple bar chart for airport traffic
    const airportData = aggregateByAirport(filteredData, 'arr_flights');
    
    charts.busiestHeatmap = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: airportData.labels,
            datasets: [{
                label: 'Total Flights',
                data: airportData.data,
                backgroundColor: '#1FB8CD',
                borderColor: '#1FB8CD',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Flights: ${context.parsed.y.toLocaleString()}`;
                        }
                    }
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
                        text: 'Airport'
                    }
                }
            },
            animation: {
                duration: 1000,
                easing: 'easeOutQuart'
            }
        }
    });
}

function updateDelayedAirportsHeatmap() {
    const ctx = document.getElementById('delayedHeatmap').getContext('2d');
    
    if (charts.delayedHeatmap) {
        charts.delayedHeatmap.destroy();
    }
    
    // Simple bar chart for delay ratios
    const delayData = aggregateByAirport(filteredData, 'delay_ratio');
    
    charts.delayedHeatmap = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: delayData.labels,
            datasets: [{
                label: 'Delay Ratio',
                data: delayData.data.map(d => d * 100), // Convert to percentage
                backgroundColor: '#FFC185',
                borderColor: '#FFC185',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Delay Ratio: ${context.parsed.y.toFixed(1)}%`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Delay Ratio (%)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Airport'
                    }
                }
            },
            animation: {
                duration: 1000,
                easing: 'easeOutQuart'
            }
        }
    });
}

function aggregateByAirport(data, metric) {
    const airportData = {};
    
    data.forEach(record => {
        if (!airportData[record.airport]) {
            airportData[record.airport] = { values: [], count: 0 };
        }
        airportData[record.airport].values.push(record[metric]);
        airportData[record.airport].count++;
    });
    
    const labels = Object.keys(airportData);
    const aggregatedData = labels.map(airport => {
        const values = airportData[airport].values;
        return metric === 'delay_ratio' 
            ? values.reduce((a, b) => a + b, 0) / values.length
            : values.reduce((a, b) => a + b, 0);
    });
    
    return { labels, data: aggregatedData };
}

function updateDelayTrends() {
    const ctx = document.getElementById('delayTrendsChart').getContext('2d');
    
    if (charts.delayTrends) {
        charts.delayTrends.destroy();
    }
    
    // Aggregate delay data by month and cause
    const trendData = aggregateDelayTrends(filteredData);
    
    charts.delayTrends = new Chart(ctx, {
        type: 'line',
        data: {
            labels: trendData.months,
            datasets: [
                {
                    label: 'Carrier Delays',
                    data: trendData.carrier_delay,
                    borderColor: '#1f77b4',
                    backgroundColor: 'rgba(31, 119, 180, 0.1)',
                    tension: 0.4,
                    fill: false
                },
                {
                    label: 'Weather Delays',
                    data: trendData.weather_delay,
                    borderColor: '#2ca02c',
                    backgroundColor: 'rgba(44, 160, 44, 0.1)',
                    tension: 0.4,
                    fill: false
                },
                {
                    label: 'NAS Delays',
                    data: trendData.nas_delay,
                    borderColor: '#ff7f0e',
                    backgroundColor: 'rgba(255, 127, 14, 0.1)',
                    tension: 0.4,
                    fill: false
                },
                {
                    label: 'Security Delays',
                    data: trendData.security_delay,
                    borderColor: '#d62728',
                    backgroundColor: 'rgba(214, 39, 40, 0.1)',
                    tension: 0.4,
                    fill: false
                },
                {
                    label: 'Late Aircraft Delays',
                    data: trendData.late_aircraft_delay,
                    borderColor: '#9467bd',
                    backgroundColor: 'rgba(148, 103, 189, 0.1)',
                    tension: 0.4,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Month'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Delay Minutes'
                    },
                    beginAtZero: true
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            },
            animation: {
                duration: 1500,
                easing: 'easeInOutQuart'
            }
        }
    });
}

function aggregateDelayTrends(data) {
    const monthlyData = {};
    
    data.forEach(record => {
        if (!monthlyData[record.month]) {
            monthlyData[record.month] = {
                carrier_delay: 0,
                weather_delay: 0,
                nas_delay: 0,
                security_delay: 0,
                late_aircraft_delay: 0,
                count: 0
            };
        }
        
        monthlyData[record.month].carrier_delay += record.carrier_delay || 0;
        monthlyData[record.month].weather_delay += record.weather_delay || 0;
        monthlyData[record.month].nas_delay += record.nas_delay || 0;
        monthlyData[record.month].security_delay += record.security_delay || 0;
        monthlyData[record.month].late_aircraft_delay += record.late_aircraft_delay || 0;
        monthlyData[record.month].count++;
    });
    
    const months = Object.keys(monthlyData).sort((a, b) => a - b).map(m => monthNames[m - 1]);
    const sortedData = Object.keys(monthlyData).sort((a, b) => a - b).map(month => monthlyData[month]);
    
    return {
        months,
        carrier_delay: sortedData.map(d => d.carrier_delay),
        weather_delay: sortedData.map(d => d.weather_delay),
        nas_delay: sortedData.map(d => d.nas_delay),
        security_delay: sortedData.map(d => d.security_delay),
        late_aircraft_delay: sortedData.map(d => d.late_aircraft_delay)
    };
}

function updatePredictiveAnalytics() {
    const riskScore = calculateRiskScore();
    updateRiskGauge(riskScore);
    updateRecommendations(riskScore);
}

function calculateRiskScore() {
    if (filteredData.length === 0) return 0;
    
    const avgDelayRatio = filteredData.reduce((sum, record) => sum + record.delay_ratio, 0) / filteredData.length;
    const avgCancellationRate = filteredData.reduce((sum, record) => sum + record.arr_cancelled, 0) / 
                               filteredData.reduce((sum, record) => sum + record.arr_flights, 0);
    
    // Simple risk calculation based on delay ratio and cancellation rate
    const riskScore = Math.min(((avgDelayRatio * 0.7) + (avgCancellationRate * 0.3)) * 100, 100);
    
    return Math.round(riskScore);
}

function updateRiskGauge(riskScore) {
    const canvas = document.getElementById('riskGauge');
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 80;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background arc
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, Math.PI, 2 * Math.PI);
    ctx.lineWidth = 20;
    ctx.strokeStyle = '#e0e0e0';
    ctx.stroke();
    
    // Draw risk arc
    const riskAngle = Math.PI + (Math.PI * riskScore / 100);
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, Math.PI, riskAngle);
    ctx.lineWidth = 20;
    
    // Color based on risk level
    if (riskScore < 30) {
        ctx.strokeStyle = '#4CAF50';
    } else if (riskScore < 70) {
        ctx.strokeStyle = '#FF9800';
    } else {
        ctx.strokeStyle = '#F44336';
    }
    
    ctx.stroke();
    
    // Update risk score text
    document.getElementById('riskScore').textContent = riskScore + '%';
    
    // Update risk assessment text
    let assessment = '';
    if (riskScore < 30) {
        assessment = 'Low risk of delays. Operations running smoothly.';
    } else if (riskScore < 70) {
        assessment = 'Moderate risk of delays. Monitor closely and prepare contingencies.';
    } else {
        assessment = 'High risk of delays. Immediate attention and resource allocation needed.';
    }
    
    document.getElementById('riskAssessment').textContent = assessment;
}

function updateRecommendations(riskScore) {
    const staffingElement = document.getElementById('staffingRec');
    const gateElement = document.getElementById('gateRec');
    const peakHoursElement = document.getElementById('peakHoursRec');
    
    if (riskScore < 30) {
        staffingElement.textContent = 'Normal staffing levels sufficient. Consider training opportunities.';
        gateElement.textContent = 'Standard gate allocation. Monitor for efficiency improvements.';
        peakHoursElement.textContent = 'Low delay periods. Focus on maintenance and optimization.';
    } else if (riskScore < 70) {
        staffingElement.textContent = 'Increase staffing by 15-20% during peak hours.';
        gateElement.textContent = 'Optimize gate assignments and prepare backup gates.';
        peakHoursElement.textContent = 'Monitor 7-9 AM and 5-7 PM for potential delays.';
    } else {
        staffingElement.textContent = 'Deploy additional staff immediately. Consider overtime authorization.';
        gateElement.textContent = 'Activate all available gates and implement priority boarding.';
        peakHoursElement.textContent = 'High delay risk throughout the day. Implement delay management protocols.';
    }
}

function updateTimestamps() {
    const now = new Date();
    const timestamp = now.toLocaleString();
    
    document.getElementById('lastUpdated').textContent = timestamp;
    document.getElementById('footerTimestamp').textContent = timestamp;
    
    // Update every minute
    setTimeout(updateTimestamps, 60000);
}

// Utility functions
function formatNumber(num) {
    return num.toLocaleString();
}

function formatPercentage(num) {
    return (num * 100).toFixed(1) + '%';
}

// Export functions for potential external use
window.dashboardAPI = {
    updateDashboard,
    applyFilters,
    resetFilters,
    getFilteredData: () => filteredData,
    getCharts: () => charts
};