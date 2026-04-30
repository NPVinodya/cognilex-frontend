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

    // Add marker with green color to match the theme
    new tt.Marker({ color: '#16a34a' }).setLngLat([lng, lat]).addTo(newMap);

    setMap(newMap);

    return () => {
      newMap.remove();
    };
  }, [apiKey, lat, lng, zoom]);

  return (
    <div className="relative w-full h-full group">
      <div 
        ref={mapElement} 
        className="w-full h-full rounded-xl overflow-hidden map-green-tint map-container-premium"
        style={{ minHeight: '400px' }}
      />
      {/* Premium vibrant overlay */}
      <div className="map-overlay-vibrant rounded-xl" />
      
      {/* Premium Badge */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-green-700 shadow-sm border border-green-100 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        COGNILLEX VIBRANT MAP
      </div>
    </div>
  );
}
