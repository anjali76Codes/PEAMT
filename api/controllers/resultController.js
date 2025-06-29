// controllers/resultController.js
import Result from '../models/Result.model.js';
import ExamQuestions from '../models/examQuestions.model.js';

export const submitResult = async (req, res) => {
    const { email, examName, responses } = req.body;

    // Validate input
    if (!email || !examName || !responses) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        // Fetch the exam questions from the database
        const exam = await ExamQuestions.findOne({ examName });
        if (!exam) {
            return res.status(404).json({ message: 'Exam not found' });
        }

        // Initialize scores by subject
        const subjectScores = {};

        // Iterate through each question in the exam
        exam.questions.forEach((question, index) => {
            const userResponse = responses[question.subject]?.[index]; // Assuming responses are organized by subject
            const correctAnswer = question.options[question.correctAnswer];

            // Initialize score for the subject if not already done
            if (!subjectScores[question.subject]) {
                subjectScores[question.subject] = 0;
            }

            // Check if the user's response matches the correct answer
            if (userResponse && userResponse.option === correctAnswer) {
                subjectScores[question.subject] += question.marks; // Add the question's marks to the subject score if correct
            }
        });

        // Create a new result record with scores by subject
        const result = new Result({
            examName,
            email,
            scores: subjectScores, // Store subject-wise scores
            responses,
        });

        await result.save(); // Save the result to the database

        res.status(201).json(result); // Respond with the newly created result
    } catch (error) {
        console.error("Error in submitResult:", error.message);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

export const getResults = async (req, res) => {
    const { userEmail } = req.query; // Fetch userEmail from query parameters

    try {
        const results = await Result.find({ email: userEmail }); // Query by email
        res.status(200).json(results); // Return the results with a status of 200
    } catch (error) {
        console.error("Error in getResults:", error.message);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};