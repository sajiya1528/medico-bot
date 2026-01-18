import sequelize from './config/db';
import User from './models/User';
import bcrypt from 'bcryptjs';

const seed = async () => {
    try {
        await sequelize.sync({ force: true }); // Reset DB

        const salt = await bcrypt.genSalt(10);
        const doctorPass = await bcrypt.hash('doctor123', salt);
        const patientPass = await bcrypt.hash('patient123', salt);
        const adminPass = await bcrypt.hash('admin123', salt);

        await User.bulkCreate([
            {
                email: 'doctor@test.com',
                password_hash: doctorPass,
                role: 'doctor',
                name: 'Dr. Sarah Johnson'
            },
            {
                email: 'doctor2@test.com',
                password_hash: doctorPass,
                role: 'doctor',
                name: 'Dr. Michael Chen'
            },
            {
                email: 'patient@test.com',
                password_hash: patientPass,
                role: 'patient',
                name: 'John Smith'
            },
            {
                email: 'patient2@test.com',
                password_hash: patientPass,
                role: 'patient',
                name: 'Emily Davis'
            },
            {
                email: 'admin@test.com',
                password_hash: adminPass,
                role: 'admin',
                name: 'Super Admin'
            }
        ]);

        console.log('Database seeded successfully!');
        process.exit();
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seed();
