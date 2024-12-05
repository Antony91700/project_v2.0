import React, { forwardRef, useEffect, useRef } from 'react';
import { Box } from '@chakra-ui/react';
import { drawImage, drawPoints } from '../utils/canvasUtils';

export const Canvas = forwardRef(({
  image,
  scale,
  position,
  points,
  isPlacingPoints,
  measurements,
  measurementMode,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  technicalDrawingColor
}, ref) => {
  const contextRef = useRef(null);

  useEffect(() => {
    if (!ref.current || !image) return;
    
    const canvas = ref.current;
    const context = canvas.getContext('2d');
    
    // Set fixed dimensions
    canvas.width = 800;
    canvas.height = 600;
    
    contextRef.current = context;
    
    draw();
  }, [image, scale, position, points, measurements, technicalDrawingColor]);

  const draw = () => {
    if (!contextRef.current || !ref.current) return;

    const ctx = contextRef.current;
    const canvas = ref.current;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw image
    if (image) {
      drawImage(ctx, image, position, scale);
    }

    // Draw points, lines, and measurements
    if (points.length > 0) {
      const visibleRatios = measurements ? {
        ratio23to12: measurements.showRatio2312,
        ratio23to31: measurements.showRatio2313
      } : {};
      
      drawPoints(ctx, points, position, scale, visibleRatios, measurementMode, measurements, technicalDrawingColor);
    }
  };

  return (
    <Box w="800px" h="600px" position="relative">
      <canvas
        ref={ref}
        style={{
          width: '800px',
          height: '600px',
          cursor: isPlacingPoints ? 'crosshair' : 'grab'
        }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      />
    </Box>
  );
});