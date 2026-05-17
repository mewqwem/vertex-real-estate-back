// tsx code wrapped in js block as requested (using react jsx for admin interface)
import React, { useState, useEffect } from 'react';
import { Box, Label, Input, Button } from '@adminjs/design-system';

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
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(search)}&addressdetails=1&limit=5`,
        );
        const data = await response.json();
        setSuggestions(data);
      } catch (error) {
        console.error('Error fetching addresses:', error);
      }
    }, 600);

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
    <Box marginBottom="xxl">
      <Label>{property.label}</Label>
      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Почніть вводити адресу (наприклад: Київ, Хрещатик)..."
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
          style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
        >
          {suggestions.map((item, index) => (
            <Box
              key={index}
              padding="medium"
              style={{ cursor: 'pointer', borderBottom: '1px solid #eee' }}
              onClick={() => handleSelect(item)}
              hoverBg="grey20"
            >
              {item.display_name}
            </Box>
          ))}
        </Box>
      )}

      {currentLat && currentLng && (
        <Box marginTop="default" style={{ fontSize: '12px', color: '#666' }}>
          Coordinates: {currentLat}, {currentLng}
        </Box>
      )}
    </Box>
  );
};

export default AddressAutocomplete;
