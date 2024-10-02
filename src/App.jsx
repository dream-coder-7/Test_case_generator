import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import Markdown from './Markdown';

const App = () => {
  const [context, setContext] = useState('');
  const [files, setFiles] = useState([]);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleContextChange = (event) => {
    setContext(event.target.value);
  };

  const handleFileChange = (event) => {
    setFiles(event.target.files);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (files.length === 0) {
      alert('Please upload at least one screenshot.');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('context', context);
    Array.from(files).forEach((file) => formData.append('screenshots', file));

    try {
      const response = await axios.post('http://localhost:3000/api/generate', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data.instructions);
      
      setResult(response.data.instructions);
      setError('');
    } catch (error) {
      console.error('Error during fetch operation:', error);
      setError('Failed to get data from the server.');
      setResult('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="form-container">
        <div className="left-panel">
          <h1>Testing Instructions Generator</h1>
          <p>Create comprehensive testing instructions using our advanced multimodal LLM.</p>
        </div>
        <div className="right-panel">
          <form onSubmit={handleSubmit}>
            <label htmlFor="context">Optional Context</label>
            <textarea
              id="context"
              value={context}
              onChange={handleContextChange}
              placeholder="Enter any additional context here..."
            />

            <label htmlFor="screenshots">Upload Screenshots (required)</label>
            <div className="file-upload-wrapper">
              <input
                type="file"
                id="screenshots"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }} // Hide the input
              />
              <div
                className="file-upload-message"
                onClick={() => document.getElementById('screenshots').click()} // Trigger input click
                style={{
                  cursor: 'pointer',
                  border: '2px dashed #ccc',
                  padding: '20px',
                  textAlign: 'center',
                  borderRadius: '10px',
                  backgroundColor: '#f9f9f9'
                }}
              >
                <p>Click to upload or drag and drop</p>
                <p>PNG, JPG, or GIF (MAX. 800×400px)</p>
                {files.length > 0 && <p>{files.length} file(s) selected</p>} {/* Display number of files selected */}
              </div>
            </div>

            <button type="submit">Generate Testing Instructions</button>
          </form>
        </div>
      </div>
      
      <div id="result-container" style={{ minHeight: '400px' }}>
        {loading ? (
          <div className="skeleton-loader">
            <div className="skeleton-line"></div>
            <div className="skeleton-line"></div>
            <div className="skeleton-line"></div>
          </div>
        ) : error ? (
          <p>{error}</p>
        ) : result && (
          <div className="result-card" style={{ height: '100%' }}>
            <Markdown content={result} />
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
