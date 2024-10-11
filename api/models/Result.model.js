// models/Result.js
import mongoose from 'mongoose';

const resultSchema = new mongoose.Schema({
    examName: { type: String, required: true },
    email: { type: String, required: true }, // Change from userId to userEmail
    scores: { type: Map, of: Number, required: true },
    responses: { type: Object, required: true },
    createdAt: { type: Date, default: Date.now },
});


const Result = mongoose.model('Result', resultSchema);
export default Result;
