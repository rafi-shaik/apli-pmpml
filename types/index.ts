export interface LocationStore {
  location: {
    latitude: number;
    longitude: number;
  } | null;
  isLocationGranted: string | null;
  setLocation: (latitude: number, longitude: number) => void;
  setIsLocationGranted: (isGranted: string) => void;
  checkLocationAccess: () => Promise<void>;
}

export interface TransitRouteStore {
  details: RouteDetails | null;
  setRouteDetails: (details: RouteDetails) => void;
}

export interface RouteStop {
  lat: number;
  lon: number;
  name: string;
  stop_id: string;
}

export interface RouteDetails {
  id: string;
  long_name: string;
  polyline: string;
  route: string;
  stops: RouteStop[];
  trips_schedule: string[];
}

export interface BusData {
  ac: string;
  id: string;
  agency: string;
  lat: string;
  lon: string;
  route: string;
  route_desc: string;
  timestamp: number;
  orientation: number;
}

export interface BusStop {
  id: string;
  lat: number;
  lng: number;
  name: string;
  next_stop: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQSection {
  title: string;
  items: FAQItem[];
}
