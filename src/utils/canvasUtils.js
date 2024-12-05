import { DRAWING_CONFIG as DC } from './drawingConstants';
import { drawAngleMeasurement } from './drawing/angleDrawing';
import { drawLengthMeasurement } from './drawing/lengthDrawing';
import { drawPoint } from './drawing/pointDrawing';

export const drawImage = (context, image, position, scale) => {
  if (!context || !image) return;
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  context.save();
  context.translate(position.x, position.y);
  context.scale(scale, scale);
  context.drawImage(image, 0, 0);
  context.restore();
};

const drawInitialSegment = (context, points, measurementMode, scale) => {
  if (points.length !== 2) return;
  
  // Use red color for angle mode, blue for length mode
  const color = measurementMode === 'angle' ? DC.COLORS.ANGLE : DC.COLORS.SEGMENT_1;
  context.beginPath();
  context.moveTo(points[0].x, points[0].y);
  context.lineTo(points[1].x, points[1].y);
  context.strokeStyle = color;
  context.lineWidth = DC.LINE_WIDTH.SEGMENT/scale;
  context.stroke();
};

export const drawPoints = (context, points, position, scale, visibleRatios, measurementMode, measurements, technicalDrawingColor) => {
  if (!context || !points || points.length === 0) return;

  try {
    context.save();
    context.translate(position.x, position.y);
    context.scale(scale, scale);

    // Draw segments and measurements based on mode
    if (points.length === 3) {
      if (measurementMode === 'angle') {
        drawAngleMeasurement(context, points, scale, measurements, technicalDrawingColor);
      } else {
        drawLengthMeasurement(context, points, scale, visibleRatios, technicalDrawingColor);
      }
    } else if (points.length === 2) {
      drawInitialSegment(context, points, measurementMode, scale);
    }

    // Draw points last so they're always on top
    points.forEach((point, index) => drawPoint(context, point, index, scale));

    context.restore();
  } catch (error) {
    console.error('Error in drawPoints:', error);
  }
};