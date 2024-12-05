import { createExportCanvas, downloadCanvas } from './export/canvasExport';
import { createVersionConfigs } from './export/versionConfig';

export const getFormattedTimestamp = () => {
  const now = new Date();
  return now.toISOString()
    .replace(/[:.]/g, '-')
    .replace('T', '_')
    .slice(0, -5);
};

export const exportAll = (canvas, points, scale, position, measurements, measurementMode, image, t) => {
  if (!measurements) return;

  const timestamp = getFormattedTimestamp();
  const versions = createVersionConfigs(measurements, t);

  try {
    versions.forEach(version => {
      // Export technical drawing
      const technicalCanvas = createExportCanvas(
        canvas,
        points,
        scale,
        position,
        measurements,
        measurementMode,
        version.ratios,
        version.legend
      );

      downloadCanvas(
        technicalCanvas,
        `technical_drawing_${measurementMode}_${version.suffix}_${timestamp}.png`
      );

      // Export measurement overlay
      const overlayCanvas = createExportCanvas(
        canvas,
        points,
        scale,
        position,
        measurements,
        measurementMode,
        version.ratios,
        version.legend,
        image
      );

      downloadCanvas(
        overlayCanvas,
        `measurement_overlay_${measurementMode}_${version.suffix}_${timestamp}.png`
      );
    });
  } catch (err) {
    console.error('Error exporting files:', err);
    alert('Error exporting files. Please try again.');
  }
};

export const exportTechnicalDrawing = (canvas, points, scale, position, measurements, measurementMode, technicalDrawingColor, t) => {
  if (!measurements) return;

  const timestamp = getFormattedTimestamp();
  const versions = createVersionConfigs(measurements, t);

  try {
    versions.forEach(version => {
      const exportCanvas = createExportCanvas(
        canvas, 
        points,
        scale,
        position,
        measurements, 
        measurementMode,
        version.ratios,
        version.legend
      );
      
      downloadCanvas(
        exportCanvas,
        `technical_drawing_${measurementMode}_${version.suffix}_${timestamp}.png`
      );
    });
  } catch (err) {
    console.error('Error exporting files:', err);
    alert('Error exporting files. Please try again.');
  }
};