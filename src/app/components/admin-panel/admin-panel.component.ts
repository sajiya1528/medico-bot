import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { AppointmentService } from '../../services/appointment.service';
import { Appointment } from '../../models/models';

@Component({
    selector: 'app-admin-panel',
    templateUrl: './admin-panel.component.html',
    styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {
    users: any[] = [];
    appointments: Appointment[] = [];

    constructor(
        private apiService: ApiService,
        private appointmentService: AppointmentService
    ) { }

    ngOnInit(): void {
        this.loadUsers();
        this.loadAppointments();
    }

    loadUsers(): void {
        this.apiService.getAllUsers().subscribe(users => {
            this.users = users;
        });
    }

    loadAppointments(): void {
        this.appointmentService.getAllAppointments().subscribe(appointments => {
            this.appointments = appointments;
        });
    }
}
