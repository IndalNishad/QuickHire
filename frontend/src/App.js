import React, { useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

function App() {
  const [files, setFiles] = useState([]);
  const [jobDescription, setJobDescription] = useState('');
  const [results, setResults] = useState([]);

  const handleUpload = async () => {
    if (files.length === 0 || !jobDescription.trim()) {
      alert('Please upload at least one resume and enter a job description.');
      return;
    }

    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    formData.append('job_description', jobDescription);

    try {
      const res = await axios.post('http://127.0.0.1:8000/upload/', formData);
      setResults(res.data.results);
    } catch (error) {
      console.error(error);
      alert('Upload failed: ' + (error.response?.data?.detail || error.message));
    }
  };

  const exportToExcel = () => {
    if (results.length === 0) {
      alert('No data to export.');
      return;
    }

    const worksheetData = results.map((res) => ({
      Filename: res.filename,
      MatchScore: res.match_score,
      Skills: res.parsed_data.skills.join(', '),
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Shortlisted');

    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    const fileData = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(fileData, 'quickhire_results.xlsx');
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>🚀 QuickHire Resume Shortlister</h1>

        <label style={styles.label}>Job Description</label>
        <textarea
          rows="5"
          placeholder="Paste the job description here..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          style={styles.textarea}
        />
        <p>Upload Multiple Resumes To Shortlist The Applicant.</p>
        <label style={styles.label}>Upload Resumes (PDF/DOCX)</label>
        
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          multiple
          onChange={(e) => setFiles(Array.from(e.target.files))}
          style={styles.input}
        />

        <div style={styles.buttonContainer}>
          <button style={styles.button} onClick={handleUpload}>Upload & Match</button>
          <button style={{ ...styles.button, backgroundColor: '#28a745' }} onClick={exportToExcel}>
            Export to Excel
          </button>
        </div>
      </div>

      {results.length > 0 && (
        <div style={styles.resultSection}>
          <h2 style={styles.resultTitle}>📋 Matched Resumes</h2>
          <ul style={styles.resultList}>
            {results.map((res, index) => (
              <li key={index} style={styles.resultItem}>
                <strong>{res.filename}</strong> - {res.match_score}% Match<br />
                <span>Skills: {res.parsed_data.skills.join(', ')}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    background: '#95cb88',
    minHeight: '100vh',
    padding: '30px',
  },
  card: {
    background: '#956888',
    padding: '25px',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    maxWidth: '800px',
    margin: 'auto',
  },
  title: {
    textAlign: 'center',
    color: '#951538',
    marginBottom: '25px',
  },
  label: {
    fontWeight: 'bold',
    display: 'block',
    marginBottom: '8px',
    marginTop: '15px',
    color: '#555',
  },
  textarea: {
    width: '100%',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ced4da',
    marginBottom: '10px',
    fontSize: '14px',
  },
  input: {
    marginBottom: '20px',
  },
  buttonContainer: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'flex-start',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  resultSection: {
    background: '#fff',
    marginTop: '40px',
    padding: '20px',
    borderRadius: '8px',
    maxWidth: '800px',
    marginLeft: 'auto',
    marginRight: 'auto',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
  },
  resultTitle: {
    marginBottom: '15px',
    color: '#333',
  },
  resultList: {
    listStyle: 'none',
    padding: 0,
  },
  resultItem: {
    marginBottom: '15px',
    padding: '10px',
    background: '#f1f3f5',
    borderRadius: '5px',
  },
};

export default App;
