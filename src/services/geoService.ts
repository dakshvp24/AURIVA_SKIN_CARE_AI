import { DoctorRecord } from '../types';

export interface Coordinates {
  lat: number;
  lng: number;
}

// Verified coordinate dictionary for 25 Indian cities & major healthcare hubs
export const CITY_COORDINATES: Record<string, Coordinates> = {
  'Ahmedabad': { lat: 23.0225, lng: 72.5714 },
  'Vadodara': { lat: 22.3072, lng: 73.1812 },
  'Surat': { lat: 21.1702, lng: 72.8311 },
  'Mumbai': { lat: 19.0760, lng: 72.8777 },
  'Pune': { lat: 18.5204, lng: 73.8567 },
  'Delhi': { lat: 28.6139, lng: 77.2090 },
  'Bengaluru': { lat: 12.9716, lng: 77.5946 },
  'Chennai': { lat: 13.0827, lng: 80.2707 },
  'Hyderabad': { lat: 17.3850, lng: 78.4867 },
  'Kolkata': { lat: 22.5726, lng: 88.3639 },
  'Jaipur': { lat: 26.9124, lng: 75.7873 },
  'Lucknow': { lat: 26.8467, lng: 80.9462 },
  'Chandigarh': { lat: 30.7333, lng: 76.7794 },
  'Indore': { lat: 22.7196, lng: 75.8577 },
  'Nagpur': { lat: 21.1458, lng: 79.0882 },
  'Bhopal': { lat: 23.2599, lng: 77.4126 },
  'Patna': { lat: 25.5941, lng: 85.1376 },
  'Kochi': { lat: 9.9312, lng: 76.2673 },
  'Coimbatore': { lat: 11.0168, lng: 76.9558 },
  'Visakhapatnam': { lat: 17.6868, lng: 83.2185 },
  'Gurugram': { lat: 28.4595, lng: 77.0266 },
  'Noida': { lat: 28.5355, lng: 77.3910 },
  'Thane': { lat: 19.2183, lng: 72.9781 },
  'Rajkot': { lat: 22.3039, lng: 70.8022 },
  'Nashik': { lat: 20.0059, lng: 73.7898 }
};

// Deterministic coordinate offset generator per doctor ID so doctors in the same city have unique coordinates
export function getDoctorCoordinates(doc: { doctor_id?: string; city: string; lat?: number; lng?: number }): Coordinates {
  if (typeof doc.lat === 'number' && typeof doc.lng === 'number' && !isNaN(doc.lat) && !isNaN(doc.lng)) {
    return { lat: doc.lat, lng: doc.lng };
  }

  const base = CITY_COORDINATES[doc.city] || CITY_COORDINATES['Mumbai'];
  const docId = doc.doctor_id || 'DOC-DEFAULT';
  
  let hash = 0;
  for (let i = 0; i < docId.length; i++) {
    hash = docId.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const latOffset = ((hash % 100) / 1000) - 0.05;
  const lngOffset = (((hash >> 2) % 100) / 1000) - 0.05;

  return {
    lat: Number((base.lat + latOffset).toFixed(6)),
    lng: Number((base.lng + lngOffset).toFixed(6))
  };
}

// Calculate Haversine distance in kilometers between two coordinates
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(1));
}

// User Geolocation request helper
export function getUserLocation(): Promise<Coordinates> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        reject(error);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  });
}

// Official Dynamic Google Maps Directions URL Generator (Format: https://www.google.com/maps/dir/?api=1&destination=LAT,LNG&travelmode=driving)
export function getGoogleDirectionsUrl(
  doc: { doctor_id?: string; clinic_address: string; city: string; lat?: number; lng?: number }
): string {
  const coords = getDoctorCoordinates(doc);
  if (coords && !isNaN(coords.lat) && !isNaN(coords.lng)) {
    return `https://www.google.com/maps/dir/?api=1&destination=${coords.lat},${coords.lng}&travelmode=driving`;
  }

  const fullDestination = doc.city ? `${doc.clinic_address}, ${doc.city}` : doc.clinic_address;
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(fullDestination)}&travelmode=driving`;
}
