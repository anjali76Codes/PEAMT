// import ExamQuestions from "../models/examQuestions.model.js";

// // Create or update exam questions
// export const createExamQuestions = async (req, res) => {
//     try {
//         const { examName, questions, adminEmail } = req.body;

//         // Find existing exam questions for the adminEmail
//         const existingExam = await ExamQuestions.findOne({ examName, adminEmail });

//         if (existingExam) {
//             // Append new questions to the existing ones
//             existingExam.questions = [...existingExam.questions, ...questions];
//             existingExam.examName = examName; // Update exam name if needed
//             await existingExam.save();
//             res.status(200).json({ message: 'Exam questions updated successfully' });
//         } else {
//             // Create a new entry if no existing exam found
//             const newExamQuestions = new ExamQuestions({ examName, questions, adminEmail });
//             await newExamQuestions.save();
//             res.status(201).json({ message: 'Exam questions created successfully' });
//         }
//     } catch (error) {
//         res.status(500).json({ message: 'Failed to create or update exam questions', error });
//     }
// };

// // Fetch exam questions for a specific exam
// export const getExamQuestions = async (req, res) => {
//     try {
//         const { examName } = req.query;
//         if (!examName) {
//             return res.status(400).json({ message: 'Exam name is required' });
//         }

//         const exam = await ExamQuestions.findOne({ examName });
//         if (exam) {
//             res.status(200).json(exam); // Return the full exam object
//         } else {
//             res.status(404).json({ message: 'Exam not found' });
//         }
//     } catch (error) {
//         res.status(500).json({ message: 'Failed to fetch exam questions', error });
//     }
// };






import ExamQuestions from "../models/examQuestions.model.js";

// Create or update exam questions
export const createExamQuestions = async (req, res) => {
    try {
        const { examName, questions, adminEmail } = req.body;

        // Validate request body
        if (!examName || !Array.isArray(questions) || questions.length === 0 || !adminEmail) {
            return res.status(400).json({ message: 'Exam name, questions, and admin email are required' });
        }

        // Check that each question has a subject
        for (const question of questions) {
            if (!question.subject) {
                return res.status(400).json({ message: 'Each question must have a subject' });
            }
        }
    


        // Find existing exam questions for the adminEmail
        const existingExam = await ExamQuestions.findOne({ examName, adminEmail });

        if (existingExam) {
            // Append new questions to the existing ones
            existingExam.questions.push(...questions);
            await existingExam.save();
            res.status(200).json({ message: 'Exam questions updated successfully' });
        } else {
            // Create a new entry if no existing exam found
            const newExamQuestions = new ExamQuestions({ examName, questions, adminEmail });
            await newExamQuestions.save();
            res.status(201).json({ message: 'Exam questions created successfully' });
        }
    } catch (error) {
        console.error('Error creating/updating exam questions:', error);
        res.status(500).json({ message: 'Failed to create or update exam questions', error });
    }
};

// Fetch exam questions for a specific exam
export const getExamQuestions = async (req, res) => {
    try {
        const { examName } = req.query;

        if (!examName) {
            return res.status(400).json({ message: 'Exam name is required' });
        }

        const exam = await ExamQuestions.findOne({ examName });
        if (exam) {
            // Map through questions to include subjects explicitly if needed
            const questionsWithSubjects = exam.questions.map(question => ({
                text: question.text,
                type: question.type,
                options: question.options,
                correctAnswer: question.correctAnswer,
                marks: question.marks,
                difficulty: question.difficulty,
                subject: question.subject, // Including the subject explicitly
            }));

            res.status(200).json({
                examName: exam.examName,
                adminEmail: exam.adminEmail,
                questions: questionsWithSubjects
            }); // Return the exam details along with questions and their subjects
        } else {
            res.status(404).json({ message: 'Exam not found' });
        }
    } catch (error) {
        console.error('Error fetching exam questions:', error);
        res.status(500).json({ message: 'Failed to fetch exam questions', error });
    }
};





