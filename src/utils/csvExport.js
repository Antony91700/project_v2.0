export const generateCurrentMeasurementCSV = (measurements, measurementMode) => {
  if (!measurements) return '';
  
  const timestamp = new Date().toISOString();
  let csvContent = 'Timestamp,Mode,';
  
  if (measurementMode === 'angle') {
    csvContent += 'Angle (degrees)\n';
    csvContent += `${timestamp},${measurementMode},${Math.round(measurements.angle)}`;
  } else {
    csvContent += 'Distance P1-P2 (px),Distance P2-P3 (px),Distance P1-P3 (px),Ratio P2-P3/P1-P2 (%),Ratio P2-P3/P1-P3 (%)\n';
    csvContent += `${timestamp},${measurementMode},${Math.round(measurements.distance12)},${Math.round(measurements.distance23)},${Math.round(measurements.distance13)},${Math.round(measurements.ratio2312)},${Math.round(measurements.ratio2313)}`;
  }
  
  return csvContent;
};

export const generateSessionMeasurementsCSV = (sessionMeasurements) => {
  if (!sessionMeasurements || sessionMeasurements.length === 0) return '';
  
  let csvContent = 'Timestamp,Mode,';
  const firstMeasurement = sessionMeasurements[0];
  
  // Determine headers based on measurement type
  if (firstMeasurement.mode === 'angle') {
    csvContent += 'Angle (degrees)\n';
  } else {
    csvContent += 'Distance P1-P2 (px),Distance P2-P3 (px),Distance P1-P3 (px),Ratio P2-P3/P1-P2 (%),Ratio P2-P3/P1-P3 (%)\n';
  }
  
  // Add data rows
  sessionMeasurements.forEach(measurement => {
    let row = `${measurement.timestamp},${measurement.mode},`;
    if (measurement.mode === 'angle') {
      row += `${Math.round(measurement.angle)}`;
    } else {
      row += `${Math.round(measurement.distance12)},${Math.round(measurement.distance23)},${Math.round(measurement.distance13)},${Math.round(measurement.ratio2312)},${Math.round(measurement.ratio2313)}`;
    }
    csvContent += row + '\n';
  });
  
  return csvContent;
};

export const downloadCSV = (content, filename) => {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};