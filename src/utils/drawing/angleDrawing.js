import { DRAWING_CONFIG as DC } from '../drawingConstants';

export const drawAngleMeasurement = (context, points, scale, measurements, technicalDrawingColor) => {
  if (!context || points.length < 3 || !measurements) return;

  const [p1, p2, p3] = points;
  
  // Draw segments first - always in red for angle mode
  drawAngleSegments(context, points, scale);
  
  // Draw angle measurement if enabled
  if (measurements.showAngle) {
    drawAngleArc(context, p1, p2, p3, scale, measurements, technicalDrawingColor);
  }
};

const drawAngleSegments = (context, points, scale) => {
  const [p1, p2, p3] = points;
  
  // Both segments should be red in angle mode
  drawSegment(context, p1, p2, DC.COLORS.ANGLE, scale);
  drawSegment(context, p2, p3, DC.COLORS.ANGLE, scale);
};

const drawSegment = (context, start, end, color, scale) => {
  context.beginPath();
  context.moveTo(start.x, start.y);
  context.lineTo(end.x, end.y);
  context.strokeStyle = color;
  context.lineWidth = DC.LINE_WIDTH.SEGMENT/scale;
  context.stroke();
};

const drawAngleArc = (context, p1, p2, p3, scale, measurements, technicalDrawingColor) => {
  const { startAngle, angleDiff } = calculateAngles(p1, p2, p3);
  const { baseRadius, extRadius } = getRadii(scale);

  // Draw technical measurement elements
  const color = technicalDrawingColor === 'white' ? DC.COLORS.DIMENSION.DARK : DC.COLORS.DIMENSION.LIGHT;
  const textColor = technicalDrawingColor === 'white' ? DC.COLORS.TEXT.DARK : DC.COLORS.TEXT.LIGHT;
  
  drawMainArc(context, p2, baseRadius, startAngle, angleDiff, scale, color);
  drawExtensionLines(context, p2, baseRadius, extRadius, startAngle, angleDiff, scale, color);
  drawAngleText(context, p2, extRadius, startAngle, angleDiff, scale, measurements.angle, textColor);
};

const calculateAngles = (p1, p2, p3) => {
  const v1 = { x: p1.x - p2.x, y: p1.y - p2.y };
  const v2 = { x: p3.x - p2.x, y: p3.y - p2.y };
  
  const startAngle = Math.atan2(v1.y, v1.x);
  const endAngle = Math.atan2(v2.y, v2.x);
  
  let angleDiff = endAngle - startAngle;
  if (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;
  if (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;

  return { startAngle, angleDiff };
};

const getRadii = (scale) => ({
  baseRadius: 30 / scale,
  extRadius: 36 / scale
});

const drawMainArc = (context, center, radius, startAngle, angleDiff, scale, color) => {
  context.beginPath();
  context.arc(center.x, center.y, radius, startAngle, startAngle + angleDiff, angleDiff < 0);
  context.strokeStyle = color;
  context.lineWidth = DC.LINE_WIDTH.DIMENSION/scale;
  context.stroke();
};

const drawExtensionLines = (context, center, baseRadius, extRadius, startAngle, angleDiff, scale, color) => {
  context.strokeStyle = color;
  context.lineWidth = DC.LINE_WIDTH.DIMENSION/scale;
  
  const angles = [startAngle, startAngle + angleDiff];
  
  angles.forEach(angle => {
    context.beginPath();
    context.moveTo(
      center.x + baseRadius * Math.cos(angle),
      center.y + baseRadius * Math.sin(angle)
    );
    context.lineTo(
      center.x + extRadius * Math.cos(angle),
      center.y + extRadius * Math.sin(angle)
    );
    context.stroke();
  });
};

const drawAngleText = (context, center, radius, startAngle, angleDiff, scale, angle, color) => {
  const textRadius = radius * 1.3;
  const textAngle = startAngle + angleDiff / 2;
  const textX = center.x + textRadius * Math.cos(textAngle);
  const textY = center.y + textRadius * Math.sin(textAngle);
  
  context.save();
  context.translate(textX, textY);
  context.rotate(textAngle + (Math.abs(angleDiff) > Math.PI/2 ? Math.PI : 0));
  context.fillStyle = color;
  context.font = `${DC.FONT_SIZE/scale}px Arial`;
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(`${Math.round(angle)}°`, 0, 0);
  context.restore();
};