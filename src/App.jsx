import React, { useState, useRef, useEffect } from 'react';
import { Box, HStack, useColorModeValue } from '@chakra-ui/react';
import { Canvas } from './components/Canvas';
import { Controls } from './components/Controls';
import { calculateDistance, calculateAngle } from './utils/measurementUtils';
import { generateCurrentMeasurementCSV, generateSessionMeasurementsCSV, downloadCSV } from './utils/csvExport';
import { exportTechnicalDrawing, exportAll, getFormattedTimestamp } from './utils/exportUtils';
import { useTranslation } from './hooks/useTranslation';

function App() {
  const [image, setImage] = useState(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [points, setPoints] = useState([]);
  const [measurements, setMeasurements] = useState(null);
  const [sessionMeasurements, setSessionMeasurements] = useState([]);
  const [measurementMode, setMeasurementMode] = useState('');
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isPlacingPoint, setIsPlacingPoint] = useState(false);
  const [technicalDrawingColor, setTechnicalDrawingColor] = useState('black');
  const canvasRef = useRef(null);
  const bg = useColorModeValue('white', 'gray.800');
  const { t } = useTranslation();

  useEffect(() => {
    if (points.length === 3) {
      let newMeasurements;
      if (measurementMode === 'angle') {
        const angle = calculateAngle(points[0], points[1], points[2]);
        newMeasurements = {
          angle,
          showAngle: true,
          timestamp: new Date().toISOString(),
          mode: measurementMode
        };
      } else {
        const distance12 = calculateDistance(points[0], points[1]);
        const distance23 = calculateDistance(points[1], points[2]);
        const distance13 = calculateDistance(points[0], points[2]);
        
        newMeasurements = {
          distance12,
          distance23,
          distance13,
          ratio2312: (distance23 / distance12) * 100,
          ratio2313: (distance23 / distance13) * 100,
          showRatio2312: true,
          showRatio2313: true,
          timestamp: new Date().toISOString(),
          mode: measurementMode
        };
      }
      setMeasurements(newMeasurements);
      setSessionMeasurements(prev => [...prev, newMeasurements]);
    } else {
      setMeasurements(null);
    }
  }, [points, measurementMode]);

  const handleImageLoad = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPoints([]);
      setMeasurements(null);
      setScale(1);
      setPosition({ x: 0, y: 0 });
      setMeasurementMode('');
      setIsPlacingPoint(false);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => setImage(img);
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleZoom = (direction) => {
    const newScale = Math.max(0.1, scale + (direction === 'in' ? 0.1 : -0.1));
    setScale(newScale);
  };

  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    setIsMouseDown(true);

    if (points.length < 3 && isPlacingPoint) {
      const x = (mouseX - position.x) / scale;
      const y = (mouseY - position.y) / scale;
      const newPoints = [...points, { x, y }];
      setPoints(newPoints);
    } else {
      setIsDragging(true);
      setDragStart({
        x: mouseX - position.x,
        y: mouseY - position.y
      });
    }
  };

  const handleMouseMove = (e) => {
    if (!isMouseDown || !isDragging) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    setPosition({
      x: mouseX - dragStart.x,
      y: mouseY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
    setIsDragging(false);
  };

  const handleMeasurementModeChange = (mode) => {
    setMeasurementMode(mode);
    setPoints([]);
    setMeasurements(null);
    setIsPlacingPoint(true);
  };

  const handleExport = () => {
    if (!canvasRef.current) return;
    
    const timestamp = getFormattedTimestamp();
    const link = document.createElement('a');
    link.download = `measurement_${measurementMode}_${timestamp}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportTechnicalDrawing = () => {
    if (!canvasRef.current) return;
    exportTechnicalDrawing(
      canvasRef.current,
      points,
      scale,
      position,
      measurements,
      measurementMode,
      technicalDrawingColor,
      t
    );
  };

  const handleExportAll = () => {
    if (!canvasRef.current || !image) return;
    exportAll(
      canvasRef.current,
      points,
      scale,
      position,
      measurements,
      measurementMode,
      image,
      t
    );
  };

  const handleExportCurrentCSV = () => {
    if (!measurements) return;
    const timestamp = getFormattedTimestamp();
    const csvContent = generateCurrentMeasurementCSV(measurements, measurementMode);
    downloadCSV(csvContent, `measurement_${measurementMode}_${timestamp}.csv`);
  };

  const handleExportSessionCSV = () => {
    if (sessionMeasurements.length === 0) return;
    const timestamp = getFormattedTimestamp();
    const csvContent = generateSessionMeasurementsCSV(sessionMeasurements);
    downloadCSV(csvContent, `session_measurements_${timestamp}.csv`);
  };

  const handleToggleRatio = (ratioType) => {
    setMeasurements(prev => ({
      ...prev,
      [`showRatio${ratioType}`]: !prev[`showRatio${ratioType}`]
    }));
  };

  const handleToggleAngle = () => {
    setMeasurements(prev => ({
      ...prev,
      showAngle: !prev.showAngle
    }));
  };

  const handleToggleTechnicalDrawingColor = () => {
    setTechnicalDrawingColor(prev => prev === 'black' ? 'white' : 'black');
  };

  const handleReset = () => {
    setImage(null);
    setPoints([]);
    setMeasurements(null);
    setSessionMeasurements([]);
    setScale(1);
    setPosition({ x: 0, y: 0 });
    setMeasurementMode('');
    setIsPlacingPoint(false);
    setTechnicalDrawingColor('black');
  };

  return (
    <HStack spacing={4} p={4} h="100vh" alignItems="stretch" bg={bg}>
      <Box flex={1} borderWidth={1} borderRadius="lg" overflow="hidden" position="relative">
        <Canvas
          ref={canvasRef}
          image={image}
          scale={scale}
          position={position}
          points={points}
          isPlacingPoints={points.length < 3 && isPlacingPoint}
          measurements={measurements}
          measurementMode={measurementMode}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          technicalDrawingColor={technicalDrawingColor}
        />
      </Box>
      <Controls
        onImageLoad={handleImageLoad}
        onZoomIn={() => handleZoom('in')}
        onZoomOut={() => handleZoom('out')}
        onExport={handleExport}
        onExportTechnicalDrawing={handleExportTechnicalDrawing}
        onExportAll={handleExportAll}
        onExportCurrentCSV={handleExportCurrentCSV}
        onExportSessionCSV={handleExportSessionCSV}
        onReset={handleReset}
        isPlacingPoints={points.length < 3 && isPlacingPoint}
        measurements={measurements}
        onToggleRatio={handleToggleRatio}
        onToggleAngle={handleToggleAngle}
        sessionMeasurements={sessionMeasurements}
        measurementMode={measurementMode}
        setMeasurementMode={handleMeasurementModeChange}
        technicalDrawingColor={technicalDrawingColor}
        onToggleTechnicalDrawingColor={handleToggleTechnicalDrawingColor}
      />
    </HStack>
  );
}

export default App;