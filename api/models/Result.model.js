// models/Result.js
import mongoose from 'mongoose';

const resultSchema = new mongoose.Schema({
    examName: { type: String, required: true },
    examId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true }, // Reference to Exam
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    scores: { type: Map, of: Number, required: true },
    responses: { type: Object, required: true },
    createdAt: { type: Date, default: Date.now },
});


const Result = mongoose.model('Result', resultSchema);
export default Result;