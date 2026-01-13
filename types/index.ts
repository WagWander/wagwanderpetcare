import { Timestamp } from 'firebase/firestore';

export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  createdAt: Timestamp;
}

export interface Pet {
  id: string;
  clientId: string;
  name: string;
  type: string;
  breed: string;
  age: string;
  behaviorFlags: string[];
  entryBehavior: string;
  allergies: string;
  meds: string;
  vetInfo: string;
  photoUrl: string;
}

export type ServiceType = 'walk30' | 'walk60' | 'homeVisit' | 'homeVisitMedical';
export type RequestStatus = 'pending' | 'approved' | 'completed';

export interface Request {
  id: string;
  clientId: string;
  petIds: string[];
  serviceType: ServiceType;
  date: string;
  timeWindow: string;
  notes: string;
  status: RequestStatus;
  createdAt: Timestamp;
}

export interface Visit {
  id: string;
  requestId: string;
  summaryNotes: string;
  photos: string[];
  completedAt: Timestamp;
}

export interface Settings {
  businessName: string;
  website: string;
  phone: string;
  instagramUrl: string;
  paymentLinks: {
    walk30: string;
    walk60: string;
    homeVisit: string;
  };
}

export interface IntakeFormData {
  ownerName: string;
  phone: string;
  email: string;
  address: string;
  petName: string;
  petType: string;
  breed: string;
  age: string;
  behaviorFlags: string[];
  entryBehavior: string;
  allergies: string;
  medications: string;
  vetInfo: string;
  petPhoto: File | null;
}

export interface BookingFormData {
  clientPhone: string;
  serviceType: ServiceType;
  date: string;
  timeWindow: string;
  notes: string;
}
