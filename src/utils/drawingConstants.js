export const DRAWING_CONFIG = {
  EXTENSION_LENGTH: 20,
  ARROW_LENGTH: 10,
  DIMENSION_OFFSET: 40,
  FONT_SIZE: 12,
  POINT_RADIUS: 5,
  VERTICAL_THRESHOLD: 1,
  LINE_WIDTH: {
    SEGMENT: 2,
    DIMENSION: 1,
    EXTENSION: 1,
  },
  COLORS: {
    SEGMENT_1: '#2563eb', // Blue for length mode first segment
    SEGMENT_2: '#dc2626', // Red for length mode second segment
    DIMENSION: {
      LIGHT: '#000000', // Black for light backgrounds
      DARK: '#FFFFFF',  // White for dark backgrounds
    },
    POINT: '#dc2626',    // Red for points
    TEXT: {
      LIGHT: '#000000', // Black for light backgrounds
      DARK: '#FFFFFF',  // White for dark backgrounds
    },
    ANGLE: '#dc2626',    // Red for angle mode segments
  },
};