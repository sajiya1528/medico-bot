import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { AppointmentService } from '../../services/appointment.service';
import { Appointment, User } from '../../models/models';

@Component({
    selector: 'app-doctor-dashboard',
    templateUrl: './doctor-dashboard.component.html',
    styleUrls: ['./doctor-dashboard.component.css']
})
export class DoctorDashboardComponent implements OnInit {
    currentUser: User | null = null;
    appointments: Appointment[] = [];
    patients: { id: string; name: string; appointmentCount: number }[] = [];

    selectedTab: 'appointments' | 'patients' = 'appointments';

    constructor(
        private authService: AuthService,
        private appointmentService: AppointmentService
    ) { }

    ngOnInit(): void {
        this.currentUser = this.authService.currentUserValue;
        this.loadData();
    }

    loadData(): void {
        if (this.currentUser) {
            this.loadAppointments();
        }
    }

    loadAppointments(): void {
        if (this.currentUser) {
            this.appointmentService.getAllAppointments()
                .subscribe(appointments => {
                    this.appointments = appointments.sort((a, b) => {
                        const dateCompare = new Date(a.date).getTime() - new Date(b.date).getTime();
                        if (dateCompare !== 0) return dateCompare;
                        return a.timeSlot.localeCompare(b.timeSlot);
                    });
                    this.calculatePatients();
                });
        }
    }

    // Extracted logic to calculate patients from loaded appointments
    calculatePatients(): void {
        const patientMap = new Map<string, { name: string; count: number }>();

        this.appointments.forEach(apt => {
            // Patient details might need to be fetched if not in appointment, 
            // but our backend includes { patient: { name, ... } }
            // The frontend model might need update if 'patientName' is not on top level but in patient object.
            // Backend sends: { patientId, doctorId, ..., patient: { name: '...' } }
            // Frontend generic Appointment model might match or we fix map here.

            const pName = (apt as any).patient?.name || apt.patientName || 'Unknown';

            const pId = String(apt.patientId); // Normalize id to string for map key

            if (patientMap.has(pId)) {
                patientMap.get(pId)!.count++;
            } else {
                patientMap.set(pId, { name: pName, count: 1 });
            }
        });

        this.patients = Array.from(patientMap.entries()).map(([id, data]) => ({
            id,
            name: data.name,
            appointmentCount: data.count
        }));
    }

    // loadPatients method removed or deprecated in favor of calculatePatients

    approveAppointment(appointmentId: string | number): void {
        this.appointmentService.updateAppointmentStatus(appointmentId, 'confirmed')
            .subscribe(() => this.loadData());
    }

    cancelAppointment(appointmentId: string | number): void {
        if (confirm('Are you sure you want to cancel this appointment?')) {
            this.appointmentService.updateAppointmentStatus(appointmentId, 'cancelled')
                .subscribe(() => this.loadData());
        }
    }

    completeAppointment(appointmentId: string | number): void {
        this.appointmentService.updateAppointmentStatus(appointmentId, 'completed')
            .subscribe(() => this.loadData());
    }

    getStatusClass(status: string): string {
        return `status-${status}`;
    }

    getPendingCount(): number {
        return this.appointments.filter(a => a.status === 'pending').length;
    }

    getConfirmedCount(): number {
        return this.appointments.filter(a => a.status === 'confirmed').length;
    }

    getCompletedCount(): number {
        return this.appointments.filter(a => a.status === 'completed').length;
    }

    getTotalPatients(): number {
        return this.patients.length;
    }

    logout(): void {
        this.authService.logout();
    }

    switchTab(tab: 'appointments' | 'patients'): void {
        this.selectedTab = tab;
    }
}
