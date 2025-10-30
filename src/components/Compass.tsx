import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface CompassProps {
  busLocation: { lat: number; lng: number } | null;
  previousLocation: { lat: number; lng: number } | null;
}

const Compass: React.FC<CompassProps> = ({ busLocation, previousLocation }) => {
  const [direction, setDirection] = useState<string>('N');
  const [degrees, setDegrees] = useState<number>(0);

  // Calculate bearing between two points
  const calculateBearing = (start: { lat: number; lng: number }, end: { lat: number; lng: number }): number => {
    // Handle case where locations are the same or invalid
    if (!start || !end || (start.lat === end.lat && start.lng === end.lng)) {
      return 0;
    }
    
    const startLat = (start.lat * Math.PI) / 180;
    const startLng = (start.lng * Math.PI) / 180;
    const endLat = (end.lat * Math.PI) / 180;
    const endLng = (end.lng * Math.PI) / 180;
    
    const dLng = endLng - startLng;
    
    const y = Math.sin(dLng) * Math.cos(endLat);
    const x = Math.cos(startLat) * Math.sin(endLat) - 
              Math.sin(startLat) * Math.cos(endLat) * Math.cos(dLng);
    
    let bearing = Math.atan2(y, x) * (180 / Math.PI);
    bearing = (bearing + 360) % 360;
    
    return bearing;
  };

  // Convert bearing to compass direction
  const bearingToDirection = (bearing: number): string => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(bearing / 45) % 8;
    return directions[index];
  };

  // Update compass when locations change
  useEffect(() => {
    if (busLocation && previousLocation) {
      const bearing = calculateBearing(previousLocation, busLocation);
      setDegrees(bearing);
      setDirection(bearingToDirection(bearing));
    }
  }, [busLocation, previousLocation]);

  return (
    <Card className="bg-card/95 backdrop-blur-md border-border/50">
      <CardContent className="p-4">
        <div className="flex flex-col items-center">
          <h3 className="text-sm font-medium mb-3">Bus Direction</h3>
          
          {/* Compass visualization */}
          <div className="relative w-32 h-32 mb-3">
            {/* Outer circle */}
            <div className="absolute inset-0 rounded-full border-2 border-primary/30"></div>
            
            {/* Direction markers */}
            <div className="absolute top-1 left-1/2 transform -translate-x-1/2 text-xs font-bold">N</div>
            <div className="absolute right-1 top-1/2 transform -translate-y-1/2 text-xs font-bold">E</div>
            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 text-xs font-bold">S</div>
            <div className="absolute left-1 top-1/2 transform -translate-y-1/2 text-xs font-bold">W</div>
            
            {/* Moving needle */}
            <div 
              className="absolute top-1/2 left-1/2 w-0.5 h-1/2 origin-bottom transform -translate-x-1/2 transition-transform duration-300"
              style={{ transform: `translateX(-50%) rotate(${degrees}deg)` }}
            >
              <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-red-500 mx-auto"></div>
            </div>
            
            {/* Center point */}
            <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-primary rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
          </div>
          
          {/* Direction indicator */}
          <div className="text-center">
            <div className="text-2xl font-bold">{direction}</div>
            <div className="text-xs text-muted-foreground">{Math.round(degrees)}°</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Compass;