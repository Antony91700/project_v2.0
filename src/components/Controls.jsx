import React from 'react';
import { VStack, Button, Input, HStack, Checkbox, Text, Box, Divider, useColorMode, ButtonGroup } from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { LanguageSelector } from './LanguageSelector';
import { useTranslation } from '../hooks/useTranslation';
import { useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';

export function Controls({
  onImageLoad,
  onZoomIn,
  onZoomOut,
  onExport,
  onExportCurrentCSV,
  onExportSessionCSV,
  onExportTechnicalDrawing,
  onExportAll,
  onReset,
  measurements,
  onToggleRatio,
  onToggleAngle,
  sessionMeasurements,
  measurementMode,
  setMeasurementMode,
  isPlacingPoints,
  technicalDrawingColor,
  onToggleTechnicalDrawingColor
}) {
  const { colorMode, toggleColorMode } = useColorMode();
  const { t } = useTranslation();
  const { language, setLanguage } = useContext(LanguageContext);

  return (
    <VStack spacing={4} w="250px" p={4} borderWidth={1} borderRadius="lg">
      <LanguageSelector 
        currentLanguage={language}
        onLanguageChange={setLanguage}
      />

      <Button onClick={toggleColorMode} w="full">
        {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
        {' '}{t(colorMode === 'light' ? 'buttons.darkMode' : 'buttons.lightMode')}
      </Button>

      <Input
        type="file"
        accept="image/*"
        onChange={onImageLoad}
        display="none"
        id="image-input"
      />
      <Button as="label" htmlFor="image-input" w="full" colorScheme="blue">
        {t('buttons.loadImage')}
      </Button>
      
      <HStack w="full">
        <Button onClick={onZoomIn} flex={1}>{t('buttons.zoomIn')}</Button>
        <Button onClick={onZoomOut} flex={1}>{t('buttons.zoomOut')}</Button>
      </HStack>

      <ButtonGroup w="full" isAttached>
        <Button 
          flex={1}
          colorScheme={measurementMode === 'length' ? (isPlacingPoints ? 'red' : 'blue') : 'gray'}
          onClick={() => setMeasurementMode('length')}
        >
          {t('buttons.length')}
        </Button>
        <Button 
          flex={1}
          colorScheme={measurementMode === 'angle' ? (isPlacingPoints ? 'red' : 'blue') : 'gray'}
          onClick={() => setMeasurementMode('angle')}
        >
          {t('buttons.angle')}
        </Button>
      </ButtonGroup>

      <Checkbox 
        isChecked={technicalDrawingColor === 'white'}
        onChange={onToggleTechnicalDrawingColor}
      >
        {t('buttons.whiteTechnicalDrawing')}
      </Checkbox>

      {measurements && (
        <Box w="full" borderWidth={1} p={2} borderRadius="md">
          {measurementMode === 'angle' ? (
            <>
              <Text fontSize="sm" fontWeight="bold">{t('measurements.angleAt')}:</Text>
              <Checkbox 
                isChecked={measurements.showAngle}
                onChange={onToggleAngle}
                defaultChecked={true}
              >
                {Math.round(measurements.angle)}{t('measurements.degrees')}
              </Checkbox>
            </>
          ) : (
            <>
              <Text fontSize="sm" fontWeight="bold" mt={2}>{t('measurements.ratios')}:</Text>
              <Checkbox 
                isChecked={measurements.showRatio2312}
                onChange={() => onToggleRatio('2312')}
              >
                {t('measurements.ratioP2P3toP1P2')}: {Math.round(measurements.ratio2312)}%
              </Checkbox>
              <Checkbox 
                isChecked={measurements.showRatio2313}
                onChange={() => onToggleRatio('2313')}
              >
                {t('measurements.ratioP2P3toP1P3')}: {Math.round(measurements.ratio2313)}%
              </Checkbox>
            </>
          )}
        </Box>
      )}

      <Button onClick={onExport} w="full" colorScheme="green">
        {t('buttons.exportImage')}
      </Button>

      <Button onClick={onExportTechnicalDrawing} w="full" colorScheme="purple">
        {t('buttons.exportTechnicalDrawing')}
      </Button>

      <Button onClick={onExportAll} w="full" colorScheme="orange">
        {t('buttons.exportAll')}
      </Button>

      <Button onClick={onExportCurrentCSV} w="full" colorScheme="teal">
        {t('buttons.exportCurrentCSV')}
      </Button>

      <Button onClick={onExportSessionCSV} w="full" colorScheme="cyan">
        {t('buttons.exportSessionCSV')}
      </Button>

      <Divider />

      <Button onClick={onReset} w="full" colorScheme="red">
        {t('buttons.resetAll')}
      </Button>
    </VStack>
  );
}