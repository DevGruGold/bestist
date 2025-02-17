
export interface Place {
  id: string;
  name: string;
  category: string;
  address?: string;
  description?: string;
  votes: number;
}

export interface Location {
  lat: number;
  lng: number;
}
