import { drawPoints } from '../canvasUtils';

const addLegend = (ctx, text, canvasHeight) => {
  ctx.save();
  ctx.fillStyle = '#000000';
  ctx.font = '14px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'bottom';
  ctx.fillText(text, ctx.canvas.width / 2, canvasHeight - 20);
  ctx.restore();
};

export const createExportCanvas = (originalCanvas, points, scale, position, measurements, measurementMode, visibleRatios, legendText, image = null) => {
  const exportCanvas = document.createElement('canvas');
  exportCanvas.width = originalCanvas.width;
  exportCanvas.height = originalCanvas.height + 40;
  const ctx = exportCanvas.getContext('2d');

  // Set white background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);

  // If this is an overlay, draw the image first
  if (image) {
    ctx.save();
    ctx.translate(position.x, position.y);
    ctx.scale(scale, scale);
    ctx.drawImage(image, 0, 0);
    ctx.restore();
  }

  // Draw technical elements on top of the image
  if (points.length > 0) {
    drawPoints(ctx, points, position, scale, visibleRatios, measurementMode, measurements, 'black');
  }

  // Add legend
  addLegend(ctx, legendText, exportCanvas.height);

  return exportCanvas;
};

export const downloadCanvas = (canvas, filename) => {
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};