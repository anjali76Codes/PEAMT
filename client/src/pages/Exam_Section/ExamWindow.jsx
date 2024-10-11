import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

function ExamWindow() {
    const location = useLocation();
    const { examName } = location.state || { examName: 'defaultExam' };
    const { currentUser } = useSelector((state) => state.user); // Accessing current user from Redux
    const [questions, setQuestions] = useState([]);
    const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
    const [responses, setResponses] = useState({});
    const [markedForReview, setMarkedForReview] = useState({});
    const [error, setError] = useState('');
    const [time, setTime] = useState({ hours: 1, minutes: 0, seconds: 0 });
    const [warningShown, setWarningShown] = useState(false);
    const [showAutoSubmitPopup, setShowAutoSubmitPopup] = useState(false);
    const [sessionTimeout, setSessionTimeout] = useState(null);
    const timerRef = useRef();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/examQuestions?examName=${encodeURIComponent(examName)}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch questions');
                }
                const data = await response.json();
                if (data.questions && data.questions.length > 0) {
                    setQuestions(data.questions);
                } else {
                    setError(`No questions available for the exam: ${examName}.`);
                }
            } catch (error) {
                console.error('Error fetching questions:', error);
                setError('Could not load questions. Please try again later.');
            }
        };

        fetchData();

        timerRef.current = setInterval(() => {
            setTime((prevTime) => {
                const { hours, minutes, seconds } = prevTime;
                if (seconds > 0) {
                    return { ...prevTime, seconds: seconds - 1 };
                } else if (minutes > 0) {
                    return { hours, minutes: minutes - 1, seconds: 59 };
                } else if (hours > 0) {
                    return { hours: hours - 1, minutes: 59, seconds: 59 };
                } else {
                    clearInterval(timerRef.current);
                    handleSubmit(); // Auto-submit when time runs out
                    return prevTime;
                }
            });
        }, 1000);

        const handleActivity = () => {
            clearTimeout(sessionTimeout);
            setSessionTimeout(setTimeout(() => {
                alert("Your session has timed out due to inactivity.");
                navigate('/logout'); // Redirect to logout or login page
            }, 15 * 60 * 1000)); // 15 minutes timeout
        };

        window.addEventListener('mousemove', handleActivity);
        window.addEventListener('keypress', handleActivity);

        // Prevent copy-paste
        const preventCopyPaste = (event) => {
            event.preventDefault();
            alert("Copying and pasting are not allowed during the exam.");
        };

        window.addEventListener('copy', preventCopyPaste);
        window.addEventListener('paste', preventCopyPaste);
        window.addEventListener('cut', preventCopyPaste);

        const handleKeyLock = (event) => {
            if (
                event.key === "Escape" ||
                event.key === "F5" ||
                (event.ctrlKey && event.key === "r")
            ) {
                event.preventDefault();
                alert("Navigation is disabled during the exam. Please stay on this page.");
            }
        };

        const handleVisibilityChange = (event) => {
            if (document.visibilityState === 'hidden') {
                event.preventDefault();
                if (warningShown) {
                    setShowAutoSubmitPopup(true);
                    setTimeout(() => {
                        handleSubmit(); // Auto-submit after showing the popup
                    }, 6000); // 6 seconds
                } else {
                    const confirmation = window.confirm("Switching tabs is not allowed during the exam. Are you sure you want to leave this tab?");
                    if (!confirmation) {
                        setWarningShown(true);
                        alert("Please stay on this page during the exam.");
                    }
                }
            }
        };

        window.addEventListener("keydown", handleKeyLock);
        document.addEventListener("visibilitychange", handleVisibilityChange);

        const requestFullscreen = () => {
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            } else if (document.documentElement.mozRequestFullScreen) {
                document.documentElement.mozRequestFullScreen();
            } else if (document.documentElement.webkitRequestFullscreen) {
                document.documentElement.webkitRequestFullscreen();
            } else if (document.documentElement.msRequestFullscreen) {
                document.documentElement.msRequestFullscreen();
            }
        };

        requestFullscreen();

        return () => {
            clearInterval(timerRef.current);
            clearTimeout(sessionTimeout);
            window.removeEventListener('mousemove', handleActivity);
            window.removeEventListener('keypress', handleActivity);
            window.removeEventListener('copy', preventCopyPaste);
            window.removeEventListener('paste', preventCopyPaste);
            window.removeEventListener('cut', preventCopyPaste);
            window.removeEventListener("keydown", handleKeyLock);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [examName, warningShown, sessionTimeout]);

    const handleQuestionSelect = (index) => {
        setSelectedQuestionIndex(index);
        setError('');
    };

    const handleSaveResponse = () => {
        const currentResponse = responses[selectedQuestionIndex] || {};
        if (!currentResponse.option) {
            setError('Please select an option before proceeding.');
            return;
        }
        setResponses({
            ...responses,
            [selectedQuestionIndex]: { ...currentResponse, status: 'saved' }
        });
        setSelectedQuestionIndex((prevIndex) => Math.min(prevIndex + 1, questions.length - 1));
        setError('');
    };

    const handleOptionChange = (option) => {
        const currentResponse = responses[selectedQuestionIndex] || {};
        setResponses({
            ...responses,
            [selectedQuestionIndex]: { option, status: option ? 'selected' : 'skipped' }
        });
        setError('');
    };

    const handleMarkForReview = () => {
        const currentResponse = responses[selectedQuestionIndex] || {};
        setMarkedForReview({
            ...markedForReview,
            [selectedQuestionIndex]: true
        });
        if (!currentResponse.option) {
            setResponses({
                ...responses,
                [selectedQuestionIndex]: { ...currentResponse, status: 'skipped' }
            });
        }
        setSelectedQuestionIndex((prevIndex) => Math.min(prevIndex + 1, questions.length - 1));
        setError('');
    };

    const handlePrevious = () => {
        setSelectedQuestionIndex(Math.max(selectedQuestionIndex - 1, 0));
        setError('');
    };

    const handleNext = () => {
        const currentResponse = responses[selectedQuestionIndex] || {};
        if (currentResponse.option) {
            setResponses({
                ...responses,
                [selectedQuestionIndex]: { ...currentResponse, status: 'saved' }
            });
        } else {
            setResponses({
                ...responses,
                [selectedQuestionIndex]: { ...currentResponse, status: 'skipped' }
            });
        }
        setSelectedQuestionIndex((prevIndex) => Math.min(prevIndex + 1, questions.length - 1));
        setError('');
    };

    const handleSaveAndNext = () => {
        const currentResponse = responses[selectedQuestionIndex] || {};
        if (!currentResponse.option) {
            setError('Please select an option before proceeding.');
            return;
        }
        setResponses({
            ...responses,
            [selectedQuestionIndex]: { ...currentResponse, status: 'saved' }
        });
        setSelectedQuestionIndex((prevIndex) => Math.min(prevIndex + 1, questions.length - 1));
        setError('');
    };

    const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);

    const handleSubmit = () => {
        setShowConfirmSubmit(true);
    };

    const confirmSubmit = async () => {
        const resultData = {
            userId: currentUser._id, // Use currentUser from useSelector
            examName: examName, // Use the actual exam name
            responses: responses, // Actual responses from the user
        };

        try {
            const response = await fetch('http://localhost:3000/api/submitResult', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(resultData),
            });

            if (!response.ok) {
                throw new Error('Failed to submit results');
            }

            const data = await response.json();
            console.log('Result submitted successfully:', data);
            navigate('/submit-confirmation'); // Redirect on success, modify as needed
        } catch (error) {
            console.error('Error submitting results:', error);
        }
    };

    const formatTime = (time) => {
        const { hours, minutes, seconds } = time;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    const currentQuestion = questions[selectedQuestionIndex];
    const selectedOption = responses[selectedQuestionIndex]?.option;
    return (
        <div className="flex mt-10 p-10" style={{ height: '80vh' }}>
            {showAutoSubmitPopup && (
                <div className="fixed top-0 left-0 right-0 bg-yellow-300 text-black text-lg text-center p-4 z-50">
                    Your exam is auto-submitting due to inactivity. Please wait...
                </div>
            )}
            <div className="w-1/6 p-2 bg-gray-100" style={{ height: '100%', overflowY: 'auto' }}>
                <div className="bg-gray-200 p-4 rounded-lg shadow-md h-full">
                    <h3 className="text-xl font-semibold mb-4">Questions</h3>
                    {error && <p className="text-red-500">{error}</p>}
                    <div className="grid grid-cols-3 gap-2">
                        {questions.map((_, index) => {
                            const isMarked = markedForReview[index];
                            const isSaved = responses[index]?.status === 'saved';
                            const hasNoOption = !responses[index]?.option;
                            let buttonColor = isSaved
                                ? 'bg-green-500'
                                : isMarked
                                    ? hasNoOption ? 'bg-red-500' : 'bg-orange-500'
                                    : 'bg-blue-500';

                            return (
                                <button
                                    key={index}
                                    onClick={() => handleQuestionSelect(index)}
                                    className={`px-4 py-2 rounded-lg text-white ${buttonColor} hover:bg-opacity-75`}
                                >
                                    {index + 1}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
            <div className="w-3/4 p-2 relative" style={{ height: '100%', overflowY: 'auto' }}>
                <div className="absolute top-4 right-4 text-lg font-semibold">{formatTime(time)}</div>
                <div className="flex flex-col h-full p-0 bg-white rounded-lg shadow-md">
                    <h3 className="ml-10 text-2xl font-semibold mb-4">Question {selectedQuestionIndex + 1}</h3>
                    <p className="ml-10 text-lg mb-4">{currentQuestion?.text}</p>

                    {error && <p className="text-red-500 ml-10 mb-4">Error: {error}</p>}

                    <div className="space-y-2 ml-10 mb-4">
                        {currentQuestion?.options.map((option, index) => (
                            <div key={index} className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    id={`option${index}`}
                                    name="options"
                                    value={option}
                                    checked={selectedOption === option}
                                    onChange={() => handleOptionChange(option)}
                                    className="h-5 w-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                                />
                                <label htmlFor={`option${index}`} className="text-lg">{option}</label>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-auto space-2 mb-4 ml-10 mr-10">
                        <button
                            onClick={handlePrevious}
                            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                        >
                            Previous
                        </button>
                        <button
                            onClick={handleMarkForReview}
                            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                        >
                            Mark for Review
                        </button>
                        <button
                            onClick={handleSaveAndNext}
                            className={`px-4 py-2 ${selectedOption ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'} text-white rounded-lg`}
                        >
                            Save & Next
                        </button>
                        <button
                            onClick={handleNext}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                            Next
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                            Submit
                        </button>
                    </div>
                </div>
            </div>

            {showConfirmSubmit && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-lg font-semibold mb-4">Are you sure you want to submit your exam?</h2>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={confirmSubmit}
                                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                            >
                                Yes
                            </button>
                            <button
                                onClick={() => setShowConfirmSubmit(false)}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                            >
                                No
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ExamWindow;