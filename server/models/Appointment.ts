import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db';
import User from './User';

class Appointment extends Model {
    public id!: number;
    public patientId!: number;
    public doctorId!: number;
    public date!: string;
    public time!: string;
    public status!: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    public symptoms!: string;
}

Appointment.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    patientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    doctorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    date: {
        type: DataTypes.STRING, // Using string for simplicity as per existing frontend format, or DATEONLY
        allowNull: false
    },
    time: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'confirmed', 'completed', 'cancelled'),
        defaultValue: 'pending'
    },
    symptoms: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    sequelize,
    modelName: 'Appointment'
});

// Associations
User.hasMany(Appointment, { as: 'appointmentsAsPatient', foreignKey: 'patientId' });
User.hasMany(Appointment, { as: 'appointmentsAsDoctor', foreignKey: 'doctorId' });
Appointment.belongsTo(User, { as: 'patient', foreignKey: 'patientId' });
Appointment.belongsTo(User, { as: 'doctor', foreignKey: 'doctorId' });

export default Appointment;
