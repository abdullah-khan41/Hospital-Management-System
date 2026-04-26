const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized:false
    } 
});

app.get('/', (req, res) => {
    res.send('Hospital Management System API is working 🚀');
});

app.get('/patients', async(req,res)=>{
    try {
        const result = await pool.query('select * from patients');
        res.json(result.rows);
    } catch (err) {
        console.log(err);
        res.status(500).json({error:err.message});
    }
});

app.post('/patients', async (req, res) => {
    const { full_name, gender, phone, address } = req.body;
    const result = await pool.query(
        `INSERT INTO patients (full_name, gender, phone, address)
         VALUES ($1,$2,$3,$4) RETURNING *`,
        [full_name, gender, phone, address]
    );
    res.json(result.rows[0]);
});

app.put('/patients/:id', async (req, res) => {
    const { id } = req.params;
    const { full_name, phone } = req.body;
    const result = await pool.query(
        `UPDATE patients 
         SET full_name=$1, phone=$2
         WHERE patient_id=$3
         RETURNING *`,
        [full_name, phone, id]
    );
    res.json(result.rows[0]);
});

app.delete('/patients/:id', async (req, res) => {
    await pool.query(
        'DELETE FROM patients WHERE patient_id=$1',
        [req.params.id]
    );
    res.json({ message: "Patient deleted" });
});

app.get('/doctors', async(req,res)=>{
    try {
        const result = await pool.query('select * from doctors');
        res.json(result.rows);
    } catch (err) {
        console.log(err);
        res.status(500).json({error:err.message});
    }
});

app.post('/doctors', async (req, res) => {
    const { full_name, specialization, phone, email } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO doctors (full_name, specialization, phone, email)
             VALUES ($1,$2,$3,$4)
             RETURNING *`,
            [full_name, specialization, phone, email]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/doctors/:id', async (req, res) => {
    const { id } = req.params;
    const { full_name, specialization, phone, email } = req.body;
    try {
        const result = await pool.query(
            `UPDATE doctors
             SET full_name=$1,
                 specialization=$2,
                 phone=$3,
                 email=$4
             WHERE doctor_id=$5
             RETURNING *`,
            [full_name, specialization, phone, email, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/doctors/:id', async (req, res) => {
    try {
        await pool.query(
            'DELETE FROM doctors WHERE doctor_id=$1',
            [req.params.id]
        );
        res.json({ message: "Doctor deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/departments', async(req,res)=>{
    try {
        const result = await pool.query('select * from departments');
        res.json(result.rows);
    } catch (err) {
        console.log(err);
        res.status(500).json({error:err.message});
    }
});

app.post('/departments', async (req, res) => {
    const { department_name } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO departments (department_name)
             VALUES ($1)
             RETURNING *`,
            [department_name]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/departments/:id', async (req, res) => {
    const { id } = req.params;
    const { department_name } = req.body;
    try {
        const result = await pool.query(
            `UPDATE departments
             SET department_name=$1
             WHERE department_id=$2
             RETURNING *`,
            [department_name, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/departments/:id', async (req, res) => {
    try {
        await pool.query(
            'DELETE FROM departments WHERE department_id=$1',
            [req.params.id]
        );
        res.json({ message: "Department deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/doctor_departments', async (req, res) => {
    const result = await pool.query(`
        SELECT dd.id, d.full_name, dept.department_name
        FROM doctor_departments dd
        JOIN doctors d ON d.doctor_id = dd.doctor_id
        JOIN departments dept ON dept.department_id = dd.department_id
    `);
    res.json(result.rows);
});

app.post('/doctor_departments', async (req, res) => {
    const { doctor_id, department_id } = req.body;
    const result = await pool.query(
        `INSERT INTO doctor_departments (doctor_id, department_id)
         VALUES ($1,$2)
         RETURNING *`,
        [doctor_id, department_id]
    );
    res.json(result.rows[0]);
});

app.put('/doctor_departments/:id', async (req, res) => {
    const { id } = req.params;
    const { doctor_id, department_id } = req.body;
    const result = await pool.query(
        `UPDATE doctor_departments
         SET doctor_id=$1,
             department_id=$2
         WHERE id=$3
         RETURNING *`,
        [doctor_id, department_id, id]
    );
    res.json(result.rows[0]);
});

app.delete('/doctor_departments/:id', async (req, res) => {
    await pool.query(
        'DELETE FROM doctor_departments WHERE id=$1',
        [req.params.id]
    );
    res.json({ message: "Mapping deleted" });
});

app.get('/appointments', async (req, res) => {
    const result = await pool.query(`
        SELECT a.appointment_id, p.full_name AS patient_name, d.full_name AS doctor_name,
        a.appointment_date, a.status, a.reason
        FROM appointments a
        JOIN patients p ON p.patient_id = a.patient_id
        JOIN doctors d ON d.doctor_id = a.doctor_id
        ORDER BY a.appointment_id
    `);
    res.json(result.rows);
});

app.post('/appointments', async (req, res) => {
    const { patient_id, doctor_id, appointment_date, status, reason } = req.body;
    const result = await pool.query(
    `INSERT INTO appointments (patient_id, doctor_id, appointment_date, status, reason)
         VALUES ($1,$2,$3,$4,$5) RETURNING *`,
        [patient_id, doctor_id, appointment_date, status, reason]
    );
    res.json(result.rows[0]);
});

app.put('/appointments/:id', async (req, res) => {
    const { id } = req.params;
    const { appointment_date, status, reason } = req.body;
    const result = await pool.query(
        `UPDATE appointments
         SET appointment_date=$1, status=$2, reason=$3
         WHERE appointment_id=$4
         RETURNING *`,
        [appointment_date, status, reason, id]
        );
    res.json(result.rows[0]);
});

app.delete('/appointments/:id', async (req, res) => {
    await pool.query('DELETE FROM appointments WHERE appointment_id=$1', [req.params.id]);
    res.json({ message: "Deleted" });
});

app.get('/medical_records', async (req, res) => {
    const result = await pool.query(`
        SELECT mr.record_id, p.full_name AS patient_name, d.full_name AS doctor_name,
        mr.diagnosis, mr.treatment, mr.record_date
        FROM medical_records mr
        JOIN patients p ON p.patient_id = mr.patient_id
        JOIN doctors d ON d.doctor_id = mr.doctor_id
        ORDER BY mr.record_id
    `);
    res.json(result.rows);
});

app.post('/medical_records', async (req, res) => {
    const { patient_id, doctor_id, diagnosis, treatment } = req.body;
    const result = await pool.query(
        `INSERT INTO medical_records (patient_id, doctor_id, diagnosis, treatment)
         VALUES ($1,$2,$3,$4) RETURNING *`,
        [patient_id, doctor_id, diagnosis, treatment]
    );
    res.json(result.rows[0]);
});

app.put('/medical_records/:id', async (req, res) => {
    const { id } = req.params;
    const { diagnosis, treatment } = req.body;
    const result = await pool.query(
        `UPDATE medical_records
         SET diagnosis=$1, treatment=$2
         WHERE record_id=$3
         RETURNING *`,
        [diagnosis, treatment, id]
    );
    res.json(result.rows[0]);
});

app.delete('/medical_records/:id', async (req, res) => {
    await pool.query('DELETE FROM medical_records WHERE record_id=$1', [req.params.id]);
    res.json({ message: "Deleted" });
});

app.get('/prescriptions', async (req, res) => {
    const result = await pool.query(`
        SELECT pr.prescription_id, mr.record_id, pr.medicine_name, pr.dosage, pr.instructions
        FROM prescriptions pr
        JOIN medical_records mr ON mr.record_id = pr.record_id
        ORDER BY pr.prescription_id
    `);
    res.json(result.rows);
});

app.post('/prescriptions', async (req, res) => {
    const { record_id, medicine_name, dosage, instructions } = req.body;
    const result = await pool.query(
        `INSERT INTO prescriptions (record_id, medicine_name, dosage, instructions)
         VALUES ($1,$2,$3,$4) RETURNING *`,
        [record_id, medicine_name, dosage, instructions]
    );
    res.json(result.rows[0]);
});

app.put('/prescriptions/:id', async (req, res) => {
    const { id } = req.params;
    const { medicine_name, dosage, instructions } = req.body;
    const result = await pool.query(
        `UPDATE prescriptions
         SET medicine_name=$1, dosage=$2, instructions=$3
         WHERE prescription_id=$4
         RETURNING *`,
        [medicine_name, dosage, instructions, id]
    );
    res.json(result.rows[0]);
});

app.delete('/prescriptions/:id', async (req, res) => {
    await pool.query('DELETE FROM prescriptions WHERE prescription_id=$1', [req.params.id]);
    res.json({ message: "Deleted" });
});

app.get('/billing', async (req, res) => {
    const result = await pool.query(`
        SELECT b.bill_id, p.full_name AS patient_name, a.appointment_id,
        b.total_amount, b.payment_status, b.bill_date
        FROM billing b
        JOIN patients p ON p.patient_id = b.patient_id
        JOIN appointments a ON a.appointment_id = b.appointment_id
        ORDER BY b.bill_id
    `);
    res.json(result.rows);
});

app.post('/billing', async (req, res) => {
    const { patient_id, appointment_id, total_amount, payment_status } = req.body;
    const result = await pool.query(
        `INSERT INTO billing (patient_id, appointment_id, total_amount, payment_status)
         VALUES ($1,$2,$3,$4) RETURNING *`,
        [patient_id, appointment_id, total_amount, payment_status]
    );
    res.json(result.rows[0]);
});

app.put('/billing/:id', async (req, res) => {
    const { id } = req.params;
    const { total_amount, payment_status } = req.body;
    const result = await pool.query(
        `UPDATE billing
         SET total_amount=$1, payment_status=$2
         WHERE bill_id=$3
         RETURNING *`,
        [total_amount, payment_status, id]
    );
    res.json(result.rows[0]);
});

app.delete('/billing/:id', async (req, res) => {
    await pool.query('DELETE FROM billing WHERE bill_id=$1', [req.params.id]);
    res.json({ message: "Deleted" });
});

app.listen(PORT, () => {
    console.log(`Server is running on PORT : ${PORT}`);
});
