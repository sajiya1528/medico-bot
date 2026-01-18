import { Request, Response } from 'express';
import Appointment from '../models/Appointment';
import User from '../models/User';
import { AuthRequest } from '../middleware/authMiddleware';

export const createAppointment = async (req: AuthRequest, res: Response) => {
    try {
        const { doctorId, date, time, symptoms } = req.body;
        const patientId = req.user.id;

        // Basic validation
        if (!doctorId || !date || !time) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const appointment = await Appointment.create({
            patientId,
            doctorId,
            date,
            time,
            symptoms,
            status: 'pending'
        });

        res.status(201).json(appointment);
    } catch (error) {
        res.status(500).json({ message: 'Error creating appointment', error });
    }
};

export const getAppointments = async (req: AuthRequest, res: Response) => {
    try {
        const { role, id } = req.user;
        let whereClause = {};

        if (role === 'patient') {
            whereClause = { patientId: id };
        } else if (role === 'doctor') {
            whereClause = { doctorId: id };
        }
        // Admin sees all

        const appointments = await Appointment.findAll({
            where: whereClause,
            include: [
                { model: User, as: 'patient', attributes: ['id', 'name', 'email'] },
                { model: User, as: 'doctor', attributes: ['id', 'name', 'email'] }
            ]
        });

        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching appointments', error });
    }
};

export const updateAppointment = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const appointment = await Appointment.findByPk(id);
        if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

        // Authorization check could go here (e.g. only doctor can confirm)

        appointment.status = status;
        await appointment.save();

        res.json(appointment);
    } catch (error) {
        res.status(500).json({ message: 'Error updating appointment', error });
    }
};
