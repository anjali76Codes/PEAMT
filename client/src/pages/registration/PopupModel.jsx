import React from 'react';

function PopupModel({ isOpen, onClose, formData }) {
    if (!isOpen) return null;

    const handleDownload = () => {
        const dataStr = JSON.stringify(formData, null, 2); // Convert form data to JSON string
        const blob = new Blob([dataStr], { type: 'application/json' }); // Create a Blob from the JSON string
        const url = URL.createObjectURL(blob); // Create a URL for the Blob
        const a = document.createElement('a'); // Create a link element
        a.href = url; // Set the link's href to the Blob URL
        a.download = 'form-data.json'; // Set the default download file name
        document.body.appendChild(a); // Append the link to the body
        a.click(); // Trigger the download
        document.body.removeChild(a); // Clean up the link element
        URL.revokeObjectURL(url); // Revoke the Blob URL
    };

    return (
        <div
            className="fixed inset-0 flex items-center justify-center z-50"
            role="dialog"
            aria-labelledby="modal-title"
            aria-modal="true"
        >
            <div
                className="fixed inset-0 bg-gray-600 opacity-50"
                onClick={onClose}
                aria-label="Close modal"
            ></div>
            <div
                className="relative bg-white p-6 rounded-lg shadow-lg w-80"
                role="document"
                aria-labelledby="modal-title"
            >
                <h2 id="modal-title" className="text-lg font-bold mb-4">
                    Registration Successful
                </h2>
                <p className="mb-4">Your form has been submitted successfully!</p>
                <button
                    onClick={handleDownload}
                    className="bg-green-500 text-white px-4 py-2 rounded-3xl mr-2 hover:bg-green-600 transition"
                >
                    Download Form Data
                </button>
                <button
                    onClick={onClose}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                >
                    Close
                </button>
            </div>
        </div>
    );
}

export default PopupModel;