import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { humeService } from '../services/humeService';
import './AnalysisModal.css';

const AnalysisModal = ({ onClose }) => {
  const [recordings, setRecordings] = useState([]);
  const [selectedRecordings, setSelectedRecordings] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState({});
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    loadRecordings();
  }, []);

  const loadRecordings = async () => {
    try {
      // This would typically fetch from a backend API
      // For now, we'll simulate with local files
      const mockRecordings = [
        {
          id: 1,
          name: 'Team Meeting - Project Planning.mp4',
          size: '125 MB',
          duration: '45:30',
          date: '2024-01-15',
          status: 'pending',
          type: 'video'
        },
        {
          id: 2,
          name: 'Client Call - Requirements.mp4',
          size: '89 MB',
          duration: '32:15',
          date: '2024-01-14',
          status: 'analyzed',
          type: 'video'
        },
        {
          id: 3,
          name: 'Daily Standup.mp4',
          size: '45 MB',
          duration: '18:45',
          date: '2024-01-13',
          status: 'analyzing',
          type: 'video'
        }
      ];
      
      setRecordings(mockRecordings);
    } catch (error) {
      console.error('Error loading recordings:', error);
    }
  };

  const handleFileUpload = (files) => {
    const newRecordings = Array.from(files).map((file, index) => ({
      id: Date.now() + index,
      name: file.name,
      size: formatFileSize(file.size),
      duration: 'Unknown',
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
      type: file.type.startsWith('video/') ? 'video' : 'audio',
      file: file
    }));
    
    setRecordings(prev => [...prev, ...newRecordings]);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const files = e.dataTransfer.files;
    handleFileUpload(files);
  };

  const handleFileInput = (e) => {
    const files = e.target.files;
    handleFileUpload(files);
  };

  const toggleRecordingSelection = (recordingId) => {
    setSelectedRecordings(prev => 
      prev.includes(recordingId)
        ? prev.filter(id => id !== recordingId)
        : [...prev, recordingId]
    );
  };

  const analyzeRecordings = async () => {
    const recordingsToAnalyze = recordings.filter(r => 
      selectedRecordings.includes(r.id) || selectedRecordings.length === 0
    );

    if (recordingsToAnalyze.length === 0) {
      alert('Please select recordings to analyze');
      return;
    }

    setIsAnalyzing(true);
    
    try {
      for (const recording of recordingsToAnalyze) {
        // Update status to analyzing
        setRecordings(prev => prev.map(r => 
          r.id === recording.id ? { ...r, status: 'analyzing' } : r
        ));

        // Simulate analysis with Hume AI
        const result = await humeService.analyzeRecording(recording);
        
        // Update status to analyzed and store results
        setRecordings(prev => prev.map(r => 
          r.id === recording.id ? { ...r, status: 'analyzed' } : r
        ));
        
        setAnalysisResults(prev => ({
          ...prev,
          [recording.id]: result
        }));
      }
    } catch (error) {
      console.error('Analysis error:', error);
      alert('Error analyzing recordings: ' + error.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'analyzed':
        return <i className="fas fa-check-circle status-completed"></i>;
      case 'analyzing':
        return <i className="fas fa-spinner fa-spin status-analyzing"></i>;
      default:
        return <i className="fas fa-clock status-pending"></i>;
    }
  };

  return (
    <AnimatePresence>
      <motion.div 
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div 
          className="modal-content analysis-modal"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-header">
            <h3>
              <i className="fas fa-video"></i>
              Meeting Recording Analysis
            </h3>
            <button className="close-btn" onClick={onClose}>
              <i className="fas fa-times"></i>
            </button>
          </div>

          <div className="modal-body">
            {/* Upload Section */}
            <div className="upload-section">
              <h4>
                <i className="fas fa-cloud-upload-alt"></i>
                Upload Recordings
              </h4>
              <div 
                className={`file-upload-area ${dragActive ? 'drag-active' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  id="fileUpload"
                  multiple
                  accept=".mp4,.webm,.wav,.mp3,.avi,.mov"
                  onChange={handleFileInput}
                  style={{ display: 'none' }}
                />
                <label htmlFor="fileUpload" className="upload-label">
                  <div className="upload-icon">
                    <i className="fas fa-cloud-upload-alt"></i>
                  </div>
                  <div className="upload-text">
                    <h5>Drop files here or click to browse</h5>
                    <p>Supported formats: MP4, WebM, WAV, MP3, AVI, MOV</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Recordings List */}
            <div className="recordings-section">
              <div className="section-header">
                <h4>
                  <i className="fas fa-list"></i>
                  Available Recordings ({recordings.length})
                </h4>
                <button className="refresh-btn" onClick={loadRecordings}>
                  <i className="fas fa-refresh"></i>
                  Refresh
                </button>
              </div>

              <div className="recordings-grid">
                {recordings.map((recording) => (
                  <motion.div
                    key={recording.id}
                    className={`recording-card ${recording.status}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="recording-header">
                      <div className="recording-icon">
                        <i className={`fas ${recording.type === 'video' ? 'fa-video' : 'fa-microphone'}`}></i>
                      </div>
                      <div className="recording-status">
                        {getStatusIcon(recording.status)}
                      </div>
                    </div>

                    <div className="recording-info">
                      <h5 className="recording-name">{recording.name}</h5>
                      <div className="recording-meta">
                        <span><i className="fas fa-file"></i> {recording.size}</span>
                        <span><i className="fas fa-clock"></i> {recording.duration}</span>
                        <span><i className="fas fa-calendar"></i> {recording.date}</span>
                      </div>
                    </div>

                    <div className="recording-actions">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={selectedRecordings.includes(recording.id)}
                          onChange={() => toggleRecordingSelection(recording.id)}
                        />
                        <span className="checkmark"></span>
                        Select
                      </label>
                      
                      {recording.status === 'analyzed' && (
                        <button 
                          className="view-results-btn"
                          onClick={() => {
                            // Show analysis results
                            console.log('Analysis results:', analysisResults[recording.id]);
                          }}
                        >
                          <i className="fas fa-chart-line"></i>
                          View Results
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Analysis Results */}
            {Object.keys(analysisResults).length > 0 && (
              <div className="results-section">
                <h4>
                  <i className="fas fa-chart-bar"></i>
                  Analysis Results
                </h4>
                <div className="results-grid">
                  {Object.entries(analysisResults).map(([recordingId, results]) => {
                    const recording = recordings.find(r => r.id === parseInt(recordingId));
                    return (
                      <div key={recordingId} className="result-card">
                        <h5>{recording?.name}</h5>
                        <div className="emotion-summary">
                          <h6>Emotional Analysis</h6>
                          <div className="emotion-bars">
                            {Object.entries(results.emotions || {}).map(([emotion, score]) => (
                              <div key={emotion} className="emotion-bar">
                                <span className="emotion-label">{emotion}</span>
                                <div className="emotion-progress">
                                  <div 
                                    className="emotion-fill" 
                                    style={{ width: `${score * 100}%` }}
                                  ></div>
                                </div>
                                <span className="emotion-score">{(score * 100).toFixed(1)}%</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="semantic-summary">
                          <h6>Key Insights</h6>
                          <p>{results.summary}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button className="btn-secondary" onClick={onClose}>
              <i className="fas fa-times"></i>
              Close
            </button>
            <button 
              className="btn-primary analyze-btn"
              onClick={analyzeRecordings}
              disabled={isAnalyzing || recordings.length === 0}
            >
              {isAnalyzing ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Analyzing...
                </>
              ) : (
                <>
                  <i className="fas fa-brain"></i>
                  Analyze Selected ({selectedRecordings.length || 'All'})
                </>
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AnalysisModal;
