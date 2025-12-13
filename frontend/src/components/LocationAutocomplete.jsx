import React, { useEffect, useRef, useState } from 'react';

/**
 * Google Places Autocomplete Input Component
 * Provides location suggestions as user types
 */
function LocationAutocomplete({
    value = '',
    onChange,
    placeholder = "Start typing an address...",
    required = false,
    className = ''
}) {
    const inputRef = useRef(null);
    const autocompleteRef = useRef(null);
    const [inputValue, setInputValue] = useState(value);
    const [isLoaded, setIsLoaded] = useState(false);

    // Check if Google Maps is loaded
    useEffect(() => {
        const checkGoogleMaps = () => {
            if (window.google && window.google.maps && window.google.maps.places) {
                setIsLoaded(true);
                return true;
            }
            return false;
        };

        if (checkGoogleMaps()) return;

        // Poll for Google Maps to load
        const interval = setInterval(() => {
            if (checkGoogleMaps()) {
                clearInterval(interval);
            }
        }, 100);

        const timeout = setTimeout(() => {
            clearInterval(interval);
            console.warn('Google Maps API did not load.');
        }, 10000);

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, []);

    // Initialize autocomplete
    useEffect(() => {
        if (!isLoaded || !inputRef.current || autocompleteRef.current) return;

        try {
            autocompleteRef.current = new window.google.maps.places.Autocomplete(
                inputRef.current,
                {
                    types: ['geocode', 'establishment'],
                    fields: ['formatted_address', 'geometry', 'name', 'place_id']
                }
            );

            autocompleteRef.current.addListener('place_changed', () => {
                const place = autocompleteRef.current.getPlace();

                if (place && place.geometry) {
                    const locationData = {
                        location: place.formatted_address || place.name,
                        coordinates: {
                            latitude: place.geometry.location.lat(),
                            longitude: place.geometry.location.lng()
                        },
                        placeId: place.place_id
                    };

                    setInputValue(locationData.location);

                    if (onChange) {
                        onChange(locationData);
                    }
                }
            });
        } catch (error) {
            console.error('Error initializing autocomplete:', error);
        }
    }, [isLoaded, onChange]);

    const handleInputChange = (e) => {
        const newValue = e.target.value;
        setInputValue(newValue);

        if (!newValue && onChange) {
            onChange({ location: '', coordinates: null });
        }
    };

    const handleBlur = () => {
        if (inputValue && onChange) {
            onChange({ location: inputValue, coordinates: null });
        }
    };

    return (
        <div className={`location-autocomplete ${className}`} style={{ position: 'relative' }}>
            <div style={{ position: 'relative' }}>
                <span style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: '16px',
                    color: '#666',
                    pointerEvents: 'none'
                }}>
                    📍
                </span>
                <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder={placeholder}
                    required={required}
                    style={{
                        width: '100%',
                        padding: '12px 16px 12px 38px',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        fontSize: '14px',
                        boxSizing: 'border-box'
                    }}
                    autoComplete="off"
                />
            </div>
            {isLoaded && (
                <small style={{ color: '#28a745', fontSize: '11px', marginTop: '4px', display: 'block' }}>
                    ✓ Location suggestions enabled
                </small>
            )}
        </div>
    );
}

export default LocationAutocomplete;
