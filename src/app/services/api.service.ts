import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private baseUrl = 'http://localhost:8000/api';

    constructor(private http: HttpClient, private authService: AuthService) { }

    private getHeaders(): HttpHeaders {
        const user = this.authService.currentUserValue;
        const token = user ? (user as any).token : '';
        return new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        });
    }

    // AI Chat
    chat(message: string): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}/ai/chat`, { message }, { headers: this.getHeaders() });
    }

    // Symptom Checker
    checkSymptoms(symptoms: string[]): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}/ai/symptoms`, { symptoms }, { headers: this.getHeaders() });
    }

    // Admin: Get all users
    getAllUsers(): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/users`, { headers: this.getHeaders() });
    }
}
