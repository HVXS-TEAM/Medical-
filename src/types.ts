export interface User {
  id: string;
  fullName: string;
  email: string;
  role: 'patient' | 'doctor';
  phone?: string;
  mfaEnabled: boolean;
  avatarUrl?: string;
}

export interface PrescriptionItem {
  drug: string;
  dosage: string;
  frequency: string;
  duration: string;
}

export interface Prescription {
  id: string;
  patientName: string;
  patientId: string;
  doctorName: string;
  doctorSpecialty: string;
  date: string;
  items: PrescriptionItem[];
  signature: string;
  qrCodeUrl?: string;
  fhirCompliance: boolean;
}

export interface MedicalDocument {
  id: string;
  name: string;
  type: 'Scanner' | 'IRM' | 'Analyse' | 'Rapport' | 'Ordonnance';
  date: string;
  doctor: string;
  url: string;
}

export interface ConsultationRecord {
  id: string;
  date: string;
  time: string;
  doctorName: string;
  specialty: string;
  reason: string;
  diagnosis: string;
  treatment: string;
  documents?: MedicalDocument[];
}

export interface ChatMessage {
  id: string;
  sender: 'patient' | 'doctor' | 'system';
  text: string;
  timestamp: string;
}

export interface FileExplorerItem {
  name: string;
  path: string;
  type: 'file' | 'folder';
  children?: FileExplorerItem[];
  content?: string;
}
