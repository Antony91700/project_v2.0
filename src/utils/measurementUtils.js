export const calculateDistance = (point1, point2) => {
  if (!point1 || !point2) return 0;
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  return Math.sqrt(dx * dx + dy * dy);
};

export const calculateAngle = (p1, p2, p3) => {
  if (!p1 || !p2 || !p3) return 0;
  
  // Calculate vectors
  const v1 = {
    x: p1.x - p2.x,
    y: p1.y - p2.y
  };
  
  const v2 = {
    x: p3.x - p2.x,
    y: p3.y - p2.y
  };
  
  // Calculate dot product
  const dotProduct = v1.x * v2.x + v1.y * v2.y;
  
  // Calculate magnitudes
  const mag1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
  const mag2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y);
  
  // Calculate angle in radians
  const angleRad = Math.acos(dotProduct / (mag1 * mag2));
  
  // Convert to degrees and ensure we return the acute angle
  let angleDeg = (angleRad * 180) / Math.PI;
  if (angleDeg > 180) angleDeg = 360 - angleDeg;
  
  return angleDeg;
};