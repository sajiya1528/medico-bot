import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Appointment, TimeSlot } from '../models/models';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class AppointmentService {
    private apiUrl = 'http://localhost:8000/api/appointments';

    private timeSlots: TimeSlot[] = [
        { value: '09:00', label: '09:00 AM', available: true },
        { value: '10:00', label: '10:00 AM', available: true },
        { value: '11:00', label: '11:00 AM', available: true },
        { value: '12:00', label: '12:00 PM', available: true },
        { value: '14:00', label: '02:00 PM', available: true },
        { value: '15:00', label: '03:00 PM', available: true },
        { value: '16:00', label: '04:00 PM', available: true },
        { value: '17:00', label: '05:00 PM', available: true }
    ];

    constructor(private http: HttpClient, private authService: AuthService) { }

    private getHeaders(): HttpHeaders {
        const user = this.authService.currentUserValue;
        const token = user ? (user as any).token : '';
        return new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        });
    }

    getTimeSlots(): TimeSlot[] {
        return [...this.timeSlots];
    }

    // Aliases to satisfy potential interface requirements
    getAppointments(): Observable<Appointment[]> {
        return this.getAllAppointments();
    }

    updateAppointment(id: string, status: Appointment['status']): Observable<Appointment> {
        return this.updateAppointmentStatus(id, status);
    }

    // Adapters
    private adaptFromApi(data: any): Appointment {
        return {
            id: data.id,
            patientId: data.patient_id,
            patientName: data.patient?.name || 'Unknown',
            doctorId: data.doctor_id,
            doctorName: data.doctor?.name || 'Unknown',
            date: data.date,
            timeSlot: data.time_slot,
            status: data.status,
            createdAt: data.created_at
        };
    }

    private adaptToApi(appointment: any): any {
        return {
            date: appointment.date,
            time_slot: appointment.timeSlot,
            doctor_id: appointment.doctorId,
            symptoms: appointment.symptoms || ''
        };
    }

    createAppointment(appointment: any): Observable<Appointment> {
        const payload = this.adaptToApi(appointment);
        return this.http.post<any>(this.apiUrl, payload, { headers: this.getHeaders() })
            .pipe(map((data: any) => this.adaptFromApi(data)));
    }

    getAllAppointments(): Observable<Appointment[]> {
        return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() })
            .pipe(map((list: any[]) => list.map((item: any) => this.adaptFromApi(item))));
    }

    updateAppointmentStatus(appointmentId: string | number, status: Appointment['status']): Observable<Appointment> {
        return this.http.put<any>(`${this.apiUrl}/${appointmentId}`, { status }, { headers: this.getHeaders() })
            .pipe(map((data: any) => this.adaptFromApi(data)));
    }

    getAppointmentsById(id: string | number): Observable<Appointment> {
        return this.http.get<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
            .pipe(map((data: any) => this.adaptFromApi(data)));
    }

    deleteAppointment(appointmentId: string | number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${appointmentId}`, { headers: this.getHeaders() });
    }

    // Helper to get patients from appointments (since backend doesn't have a direct endpoint yet)
    // In a real app, this should be an API call like /api/doctor/patients
    getPatientsWithAppointments(): Observable<Appointment[]> {
        return this.getAllAppointments();
    }
}
