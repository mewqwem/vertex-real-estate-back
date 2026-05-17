// tsx code wrapped in js block as requested (React JSX component for AdminJS)
import React, { useState, useEffect } from 'react';
import { Box, Label, Input } from '@adminjs/design-system';

const AddressAutocomplete = (props) => {
  const { property, record, onChange } = props;

  const currentAddress = record.params['location.address'] || '';
  const currentLat = record.params['location.lat'] || '';
  const currentLng = record.params['location.lng'] || '';

  const [search, setSearch] = useState(currentAddress);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (search.length < 4 || search === currentAddress) {
      setSuggestions([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(search)}&limit=5&accept-language=uk,en`,
        );
        const data = await response.json();
        setSuggestions(data);
      } catch (error) {
        console.error('Error loading addresses:', error);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  const handleSelect = (item) => {
    setSearch(item.display_name);
    setSuggestions([]);

    onChange('location.address', item.display_name);
    onChange('location.lat', parseFloat(item.lat));
    onChange('location.lng', parseFloat(item.lon));
  };

  return (
    <Box marginBottom="xxl" style={{ position: 'relative' }}>
      <Label>{property.label}</Label>
      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Type address here (e.g. Kyiv, Khreshchatyk)..."
        width={1}
      />

      {suggestions.length > 0 && (
        <Box
          border="1px solid #ccc"
          borderRadius="4px"
          backgroundColor="white"
          position="absolute"
          zIndex="100"
          width="100%"
          style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.1)', top: '100%' }}
        >
          {suggestions.map((item, index) => (
            <Box
              key={index}
              padding="medium"
              style={{
                cursor: 'pointer',
                borderBottom: '1px solid #eee',
                color: '#333',
              }}
              onClick={() => handleSelect(item)}
            >
              {item.display_name}
            </Box>
          ))}
        </Box>
      )}

      {currentLat && currentLng && (
        <Box marginTop="default" style={{ fontSize: '12px', color: '#22c55e' }}>
          📍 Coordinates detected: {currentLat}, {currentLng}
        </Box>
      )}
    </Box>
  );
};

export default AddressAutocomplete;
