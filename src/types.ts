export interface Product {
  id: number;
  sku: string;
  name: string;
  price: number;
  voltage: string;
  cct: string;
  ipRating: string;
  wattPerM: string;
  wattage: string;
  lumens: string;
  cri: string;
  ledType: string;
  category: string;
  beamAngle: string;
  dimensions: string;
  stock: number;
  description: string;
  url: string;
  ledWidth: string;
  moduleType: string;
  datasheet: string;
}

export type Language = 'en' | 'zh' | 'ja' | 'hi' | 'vi';

export interface Filters {
  category: string[];
  voltage: string[];
  cct: string[];
  ipRating: string[];
  ledWidth: string[];
  wpm: string[];
  moduleType: string[];
  cri: string[];
}
