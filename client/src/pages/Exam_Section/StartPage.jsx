import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

function StartPage() {
    const location = useLocation();
    const { examName, duration } = location.state || { examName: 'defaultExam', duration: '01:00:00' }; // Get exam name and duration from state
    const [code, setCode] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleStart = async () => {
        if (code.length !== 6) {
            alert('Please enter a valid 6-digit code.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:3000/api/exams/verify-code', {
                examName,
                enteredCode: code,
            });
            if (response.data.valid) {
                navigate('/exam-window', { state: { examName, duration } }); // Pass examName and duration to ExamWindow
            } else {
                setError('Invalid secure code. Please try again.');
            }
        } catch (error) {
            console.error('Error validating secure code:', error);
            setError('Failed to validate secure code. Please try again later.');
        }
    };

    return (
        <div className="relative flex flex-col items-center justify-center h-screen bg-gray-50 p-4">
            <div className="p-6 bg-white shadow-lg rounded-lg w-full max-w-md border border-gray-200">
                <h1 className="text-4xl font-bold text-blue-700 mb-4">Welcome to the Exam: {examName}</h1>
                <p className="text-lg text-gray-700 mb-2">Duration: {duration}</p> {/* Display the exam duration */}
                <p className="text-lg text-gray-700 mb-6">Please review the rules below before starting.</p>

                {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

                <div className="mb-4">
                    <label htmlFor="code-input" className="block text-lg font-semibold text-gray-800 mb-2">
                        Enter 6-digit code:
                    </label>
                    <input
                        id="code-input"
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="Enter 6-digit code"
                        className="px-4 py-2 border border-gray-300 rounded-lg w-full bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <button
                    onClick={handleStart}
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                    Start Exam
                </button>
            </div>
        </div>
    );
}

export default StartPage;
