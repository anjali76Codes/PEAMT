import React, { useState } from 'react';
import FileUploader from './FileUploader'; // Adjust the path as needed
import ExamBuilder from './ExamBuilder'; // Adjust the path as needed

function ExamManager() {
  const [jsonContent, setJsonContent] = useState(null);

  const handleJsonContentChange = (newJsonContent) => {
    setJsonContent(newJsonContent);
  };

  return (
    <div>
      <FileUploader onJsonContentChange={handleJsonContentChange} />
      <ExamBuilder jsonContent={jsonContent} />
    </div>
  );
}

export default ExamManager;
