import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

function RegisteredUsers() {
    const [examName, setExamName] = useState('');
    const [users, setUsers] = useState([]);
    const [results, setResults] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const location = useLocation();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const examNameFromQuery = queryParams.get('examName');
        if (examNameFromQuery) {
            setExamName(examNameFromQuery);
            fetchUsers(examNameFromQuery); // Fetch users immediately if exam name is present
        }
    }, [location]);

    const fetchUsers = async (examNameToFetch) => {
        try {
            const response = await fetch(`/api/regform/usernames/exam/${examNameToFetch}`);
            if (!response.ok) {
                throw new Error('Users not found');
            }
            const data = await response.json();
            setUsers(data);
            setError('');

            // Fetch results for each user
            for (const user of data) {
                await fetchResults(user.email);
            }
        } catch (err) {
            setError(err.message);
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchResults = async (userEmail) => {
        try {
            const response = await fetch(`/api/results?userEmail=${encodeURIComponent(userEmail)}`);
            if (!response.ok) {
                throw new Error('Results not found');
            }
            const data = await response.json();
            setResults(prevResults => ({ ...prevResults, [userEmail]: data }));
        } catch (err) {
            console.error(err.message);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
                Registered Users for Exam: {examName}
            </h1>
            {error && <p className="text-red-600 text-center">{error}</p>}
            {users.length > 0 ? (
                users.map((user) => (
                    <div key={user.email} className="mb-6">
                        <h2 className="text-xl font-semibold mb-2">{user.username} - {user.email}</h2>
                        {results[user.email] && results[user.email].length > 0 ? (
                            results[user.email].map((result) => (
                                <div key={result._id} className="mb-4">
                                    <h3 className="text-lg font-bold">{result.examName}</h3>
                                    <p className="text-gray-600 mb-2">Date: {new Date(result.createdAt).toLocaleDateString()}</p>
                                    <table className="min-w-full bg-white border">
                                        <thead>
                                            <tr>
                                                <th className="border px-4 py-2">Subject</th>
                                                <th className="border px-4 py-2">Score</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Object.entries(result.scores || {}).map(([subject, score]) => (
                                                <tr key={subject}>
                                                    <td className="border px-4 py-2">{subject}</td>
                                                    <td className="border px-4 py-2">{score || 0}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-600">No results found for this user.</p>
                        )}
                    </div>
                ))
            ) : (
                <p className="text-gray-600 text-center">No users registered for this exam.</p>
            )}
        </div>
    );
}

export default RegisteredUsers;