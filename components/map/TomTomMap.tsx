'use client';

import { useEffect, useRef, useState } from 'react';
import tt from '@tomtom-international/web-sdk-maps';
import '@tomtom-international/web-sdk-maps/dist/maps.css';

interface TomTomMapProps {
  apiKey: string;
  lat: number;
  lng: number;
  zoom?: number;
  language?: string;
}

export default function TomTomMap({ apiKey, lat, lng, zoom = 15, language = 'en-US' }: TomTomMapProps) {
  const mapElement = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);

  useEffect(() => {
    if (!mapElement.current) return;

    const newMap = tt.map({
      key: apiKey,
      container: mapElement.current,
      center: [lng, lat],
      zoom: zoom,
      language: language
    });

    // Add navigation controls
    newMap.addControl(new tt.NavigationControl());

    // Add marker
    new tt.Marker().setLngLat([lng, lat]).addTo(newMap);

    setMap(newMap);

    return () => {
      newMap.remove();
    };
  }, [apiKey, lat, lng, zoom]);

  return (
    <div 
      ref={mapElement} 
      className="w-full h-full rounded-xl overflow-hidden shadow-inner"
      style={{ minHeight: '400px' }}
    />
  );
}
