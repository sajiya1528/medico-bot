// User Model
export interface User {
    id: string | number;
    email: string;
    password?: string; // made optional as sometimes it's not present
    role: 'doctor' | 'patient' | 'admin'; // Added admin
    name: string;
    token?: string; // For auth response
}

// Appointment Model
export interface Appointment {
    id: string | number;
    patientId: string | number;
    patientName: string;
    doctorId: string | number;
    doctorName: string;
    date: string;
    timeSlot: string;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    createdAt?: string; // Optional as create payload might not have it
}

// Time Slot
export interface TimeSlot {
    value: string;
    label: string;
    available: boolean;
}
