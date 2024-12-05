import { DRAWING_CONFIG as DC } from '../drawingConstants';

export const drawPoint = (context, point, index, scale) => {
  if (!context || !point) return;
  
  drawPointCircle(context, point, scale);
  drawPointLabel(context, point, index, scale);
};

const drawPointCircle = (context, point, scale) => {
  context.beginPath();
  context.arc(point.x, point.y, DC.POINT_RADIUS/scale, 0, 2 * Math.PI);
  context.fillStyle = DC.COLORS.POINT;
  context.fill();
};

const drawPointLabel = (context, point, index, scale) => {
  context.fillStyle = 'white';
  context.font = `${DC.FONT_SIZE/scale}px Arial`;
  context.textAlign = 'left';
  context.textBaseline = 'middle';
  context.fillText(
    `P${index + 1}`,
    point.x + (DC.POINT_RADIUS + 5)/scale,
    point.y
  );
};