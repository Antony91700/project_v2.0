import { DRAWING_CONFIG as DC } from './drawingConstants';

const drawVerticalArrowhead = (context, x, y, isStart, scale, color) => {
  if (!context) return;

  const arrowLength = DC.ARROW_LENGTH / scale;
  const angle = Math.PI / 6; // 30 degrees
  const sign = isStart ? 1 : -1;

  context.strokeStyle = color;
  
  // Draw both sides of the arrowhead
  context.beginPath();
  // First arrow line
  context.moveTo(x, y);
  context.lineTo(
    x - arrowLength * Math.sin(angle),
    y - sign * arrowLength * Math.cos(angle)
  );
  // Second arrow line
  context.moveTo(x, y);
  context.lineTo(
    x + arrowLength * Math.sin(angle),
    y - sign * arrowLength * Math.cos(angle)
  );
  context.stroke();
};

export const drawHorizontalExtensionLines = (context, point, scale, color) => {
  if (!context) return;

  const extensionLength = DC.EXTENSION_LENGTH / scale;
  
  context.beginPath();
  context.moveTo(point.x - extensionLength, point.y);
  context.lineTo(point.x + extensionLength, point.y);
  context.strokeStyle = color;
  context.lineWidth = DC.LINE_WIDTH.EXTENSION / scale;
  context.stroke();
};

export const drawParallelogramDimensionLine = (context, start, end, scale, text, offset, color) => {
  if (!context || !start || !end) return;

  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const scaledOffset = offset / scale;

  context.save();
  context.strokeStyle = color;
  context.lineWidth = DC.LINE_WIDTH.DIMENSION / scale;

  // Draw extension lines
  context.beginPath();
  context.moveTo(start.x, start.y);
  context.lineTo(start.x + scaledOffset, start.y);
  context.moveTo(end.x, end.y);
  context.lineTo(end.x + scaledOffset, end.y);
  context.stroke();

  // Draw measurement line with vertical double arrows
  context.beginPath();
  context.moveTo(start.x + scaledOffset, start.y);
  context.lineTo(end.x + scaledOffset, end.y);
  context.stroke();

  // Draw vertical double arrowheads at both ends
  drawVerticalArrowhead(context, start.x + scaledOffset, start.y, true, scale, color);
  drawVerticalArrowhead(context, end.x + scaledOffset, end.y, false, scale, color);

  // Add measurement text
  if (text) {
    const midX = (start.x + end.x + 2 * scaledOffset) / 2;
    const midY = (start.y + end.y) / 2;
    
    context.fillStyle = color;
    context.font = `${DC.FONT_SIZE / scale}px Arial`;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    
    context.save();
    context.translate(midX, midY);
    context.rotate(Math.atan2(dy, dx));
    context.fillText(text, 0, -8/scale);
    context.restore();
  }

  context.restore();
};