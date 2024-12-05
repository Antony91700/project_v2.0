import React from 'react';
import { HStack, IconButton, Tooltip } from '@chakra-ui/react';
import { GB, FR } from 'country-flag-icons/react/3x2';

export function LanguageSelector({ currentLanguage, onLanguageChange }) {
  return (
    <HStack spacing={2}>
      <Tooltip label="English">
        <IconButton
          icon={<GB style={{ width: '24px', height: '24px' }} />}
          aria-label="English"
          variant={currentLanguage === 'en' ? 'solid' : 'outline'}
          colorScheme={currentLanguage === 'en' ? 'blue' : 'gray'}
          onClick={() => onLanguageChange('en')}
        />
      </Tooltip>
      <Tooltip label="Français">
        <IconButton
          icon={<FR style={{ width: '24px', height: '24px' }} />}
          aria-label="Français"
          variant={currentLanguage === 'fr' ? 'solid' : 'outline'}
          colorScheme={currentLanguage === 'fr' ? 'blue' : 'gray'}
          onClick={() => onLanguageChange('fr')}
        />
      </Tooltip>
    </HStack>
  );
}