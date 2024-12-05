import { DRAWING_CONFIG as DC } from '../drawingConstants';
import { calculateDistance } from '../geometryUtils';
import { drawParallelogramDimensionLine, drawHorizontalExtensionLines } from '../dimensioningUtils';

export const drawLengthMeasurement = (context, points, scale, visibleRatios, technicalDrawingColor) => {
  if (!context || points.length < 3) return;

  drawLengthSegments(context, points, scale);
  drawMeasurementLines(context, points, scale, visibleRatios, technicalDrawingColor);
};

const drawLengthSegments = (context, points, scale) => {
  const [p1, p2, p3] = points;
  drawSegment(context, p1, p2, DC.COLORS.SEGMENT_1, scale);
  drawSegment(context, p2, p3, DC.COLORS.SEGMENT_2, scale);
};

const drawSegment = (context, start, end, color, scale) => {
  context.beginPath();
  context.moveTo(start.x, start.y);
  context.lineTo(end.x, end.y);
  context.strokeStyle = color;
  context.lineWidth = DC.LINE_WIDTH.SEGMENT/scale;
  context.stroke();
};

const drawMeasurementLines = (context, points, scale, visibleRatios, technicalDrawingColor) => {
  const [p1, p2, p3] = points;
  const color = technicalDrawingColor === 'white' ? DC.COLORS.DIMENSION.DARK : DC.COLORS.DIMENSION.LIGHT;
  
  context.strokeStyle = color;
  points.forEach(point => drawHorizontalExtensionLines(context, point, scale, color));

  const distances = {
    d12: calculateDistance(p1, p2),
    d23: calculateDistance(p2, p3),
    d31: calculateDistance(p3, p1)
  };

  if (visibleRatios.ratio23to12) {
    drawRatio2312(context, p1, p2, p3, distances, scale, color);
  }

  if (visibleRatios.ratio23to31) {
    drawRatio2331(context, p1, p2, p3, distances, scale, color);
  }
};

const drawRatio2312 = (context, p1, p2, p3, distances, scale, color) => {
  drawParallelogramDimensionLine(
    context,
    p1,
    p2,
    scale,
    'Length',
    -DC.DIMENSION_OFFSET,
    color
  );

  drawParallelogramDimensionLine(
    context,
    p2,
    p3,
    scale,
    `${Math.round((distances.d23 / distances.d12) * 100)}% of Length`,
    -DC.DIMENSION_OFFSET * 2,
    color
  );
};

const drawRatio2331 = (context, p1, p2, p3, distances, scale, color) => {
  drawParallelogramDimensionLine(
    context,
    p1,
    p3,
    scale,
    'Total length',
    DC.DIMENSION_OFFSET,
    color
  );

  drawParallelogramDimensionLine(
    context,
    p2,
    p3,
    scale,
    `${Math.round((distances.d23 / distances.d31) * 100)}% of Total length`,
    DC.DIMENSION_OFFSET * 2,
    color
  );
};