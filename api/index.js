import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import countryRoutes from './routes/countryRoutes.js'
import cookieParser from 'cookie-parser';
import path from 'path';
import formRoutes from './routes/form.route.js';
import regformRoutes from './routes/regform.route.js';  // Updated import
import examRoutes from './routes/examRoutes.js';
import examQuestions from './routes/examQuestions.route.js'
import uploadRoutes from './routes/uploadRoutes.js';
import resultRoutes from './routes/resultRoutes.js'; // Add this line
import emailRoutes from './routes/emailRoutes.js';



dotenv.config();

// Connect to MongoDB databases
try {
  mongoose.connect(process.env.MONGO);
  console.log('Connected to MongoDB student-user');
} catch (error) {
  console.error('Error connecting to student-user:', error.message);
}

const __dirname = path.resolve();
const app = express();

app.use(express.static(path.join(__dirname, '/client/dist')));
app.use(express.json());
app.use(cookieParser());
app.use(cors()); // Add this line if you are using CORS

app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/form', formRoutes);
app.use('/api', countryRoutes);
app.use('/api/regform', regformRoutes); // Updated route

app.use('/api/exams', examRoutes);
app.use('/api/examQuestions', examQuestions);
app.use('/api/convert', uploadRoutes);
app.use('/api', resultRoutes); // Add this line
app.use('/api', emailRoutes);


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
