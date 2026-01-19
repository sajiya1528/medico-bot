import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { User } from '../models/models';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private currentUserSubject: BehaviorSubject<User | null>;
    public currentUser: Observable<User | null>;

    // Hardcoded test credentials
    private testCredentials = [
        { email: 'doctor@test.com', password: 'doctor123', id: '1', name: 'Dr. John Doe', role: 'doctor' as const },
        { email: 'patient@test.com', password: 'patient123', id: '2', name: 'Jane Smith', role: 'patient' as const }
    ];

    constructor(private router: Router, private http: HttpClient) {
        const storedUser = localStorage.getItem('currentUser');
        this.currentUserSubject = new BehaviorSubject<User | null>(
            storedUser ? JSON.parse(storedUser) : null
        );
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User | null {
        return this.currentUserSubject.value;
    }

    login(email: string, password: string): Observable<any> {
        // Find matching credentials
        const user = this.testCredentials.find(u => u.email === email && u.password === password);
        
        if (user) {
            const loggedInUser: User = {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                token: 'demo-token-' + Date.now() // Generate a simple token
            };
            localStorage.setItem('currentUser', JSON.stringify(loggedInUser));
            this.currentUserSubject.next(loggedInUser);
            return of(loggedInUser);
        } else {
            return throwError(() => ({ error: { message: 'Invalid credentials. Please try again.' } }));
        }
    }

    register(userData: any): Observable<any> {
        return throwError(() => ({ error: { message: 'Registration not available in demo mode.' } }));
    }

    logout(): void {
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
        this.router.navigate(['/login']);
    }

    isLoggedIn(): boolean {
        return this.currentUserValue !== null;
    }

    isDoctor(): boolean {
        return this.currentUserValue?.role === 'doctor';
    }

    isPatient(): boolean {
        return this.currentUserValue?.role === 'patient';
    }

    getAllDoctors(): Observable<User[]> {
        // Return mock doctors from test credentials
        const doctors = this.testCredentials
            .filter(u => u.role === 'doctor')
            .map(u => ({
                id: u.id,
                email: u.email,
                name: u.name,
                role: u.role,
                token: ''
            }));
        return of(doctors);
    }
}
