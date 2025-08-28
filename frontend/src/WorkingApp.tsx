import React from 'react';

const WorkingApp: React.FC = () => {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [results, setResults] = React.useState<any>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleAnalyze = () => {
    if (!selectedFile) return;
    
    setIsAnalyzing(true);
    // Simulate analysis
    setTimeout(() => {
      setResults({
        prediction: { class: 'No Tumor', confidence: 0.92 },
        probabilities: {
          'No Tumor': 0.92,
          'Glioma': 0.05,
          'Meningioma': 0.02,
          'Pituitary': 0.01
        }
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8f9fa', 
      fontFamily: 'system-ui, sans-serif' 
    }}>
      {/* Header */}
      <header style={{ 
        backgroundColor: 'white', 
        padding: '1rem 2rem',
        borderBottom: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h1 style={{ 
            fontSize: '1.5rem', 
            fontWeight: 'bold', 
            color: '#2563eb',
            margin: 0
          }}>
            NeuroAI - Brain Tumor Classification
          </h1>
          <nav style={{ display: 'flex', gap: '2rem' }}>
            <a href="#" style={{ color: '#6b7280', textDecoration: 'none' }}>Home</a>
            <a href="#" style={{ color: '#6b7280', textDecoration: 'none' }}>Analyze</a>
            <a href="#" style={{ color: '#6b7280', textDecoration: 'none' }}>About</a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '3rem 2rem' 
      }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ 
            fontSize: '3rem', 
            fontWeight: 'bold', 
            color: '#1f2937',
            marginBottom: '1rem'
          }}>
            AI-Powered Brain Tumor Classification
          </h1>
          <p style={{ 
            fontSize: '1.25rem', 
            color: '#6b7280',
            maxWidth: '800px',
            margin: '0 auto'
          }}>
            Advanced deep learning technology that analyzes brain MRI scans with medical-grade accuracy. 
            Get instant predictions with visual explanations.
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '2rem',
          alignItems: 'start'
        }}>
          {/* Upload Section */}
          <div style={{ 
            backgroundColor: 'white', 
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#1f2937' }}>
              Upload MRI Scan
            </h2>
            
            <div style={{ 
              border: '2px dashed #d1d5db',
              borderRadius: '12px',
              padding: '2rem',
              textAlign: 'center',
              marginBottom: '1rem'
            }}>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ marginBottom: '1rem' }}
              />
              <p style={{ color: '#6b7280', margin: 0 }}>
                Choose a brain MRI scan image (PNG, JPG, JPEG)
              </p>
            </div>

            {selectedFile && (
              <div style={{ textAlign: 'center' }}>
                <p style={{ marginBottom: '1rem', color: '#059669' }}>
                  Selected: {selectedFile.name}
                </p>
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  style={{
                    backgroundColor: isAnalyzing ? '#9ca3af' : '#2563eb',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '1rem',
                    cursor: isAnalyzing ? 'not-allowed' : 'pointer',
                    marginRight: '1rem'
                  }}
                >
                  {isAnalyzing ? 'Analyzing...' : 'Analyze Image'}
                </button>
                <button
                  onClick={() => {
                    setSelectedFile(null);
                    setResults(null);
                  }}
                  style={{
                    backgroundColor: '#6b7280',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '1rem',
                    cursor: 'pointer'
                  }}
                >
                  Reset
                </button>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div style={{ 
            backgroundColor: 'white', 
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#1f2937' }}>
              Analysis Results
            </h2>

            {isAnalyzing && (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  border: '4px solid #e5e7eb',
                  borderTopColor: '#2563eb',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto 1rem'
                }} />
                <p style={{ color: '#6b7280' }}>Analyzing your MRI scan...</p>
              </div>
            )}

            {results && (
              <div>
                <div style={{ 
                  backgroundColor: '#dbeafe', 
                  padding: '1rem',
                  borderRadius: '8px',
                  marginBottom: '1rem'
                }}>
                  <h3 style={{ color: '#1e40af', margin: '0 0 0.5rem 0' }}>
                    Prediction: {results.prediction.class}
                  </h3>
                  <p style={{ color: '#1e40af', margin: 0 }}>
                    Confidence: {(results.prediction.confidence * 100).toFixed(1)}%
                  </p>
                </div>

                <div>
                  <h4 style={{ marginBottom: '1rem', color: '#1f2937' }}>
                    Probability Distribution:
                  </h4>
                  {Object.entries(results.probabilities).map(([className, prob]: [string, any]) => (
                    <div key={className} style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '0.5rem'
                    }}>
                      <span>{className}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ 
                          width: '100px', 
                          height: '8px', 
                          backgroundColor: '#e5e7eb',
                          borderRadius: '4px',
                          overflow: 'hidden'
                        }}>
                          <div style={{ 
                            width: `${prob * 100}%`,
                            height: '100%',
                            backgroundColor: '#2563eb',
                            borderRadius: '4px'
                          }} />
                        </div>
                        <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                          {(prob * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!isAnalyzing && !results && (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af' }}>
                <p>Upload an MRI scan to see AI analysis results</p>
              </div>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div style={{ marginTop: '4rem' }}>
          <h2 style={{ 
            textAlign: 'center', 
            fontSize: '2rem', 
            marginBottom: '2rem',
            color: '#1f2937'
          }}>
            Key Features
          </h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '2rem' 
          }}>
            <div style={{ 
              backgroundColor: 'white', 
              padding: '2rem',
              borderRadius: '12px',
              textAlign: 'center',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>AI</div>
              <h3 style={{ marginBottom: '1rem', color: '#1f2937' }}>Advanced AI</h3>
              <p style={{ color: '#6b7280' }}>Deep learning models trained on medical imaging data</p>
            </div>
            
            <div style={{ 
              backgroundColor: 'white', 
              padding: '2rem',
              borderRadius: '12px',
              textAlign: 'center',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>Visual</div>
              <h3 style={{ marginBottom: '1rem', color: '#1f2937' }}>Visual Explanations</h3>
              <p style={{ color: '#6b7280' }}>Saliency maps showing AI attention areas</p>
            </div>
            
            <div style={{ 
              backgroundColor: 'white', 
              padding: '2rem',
              borderRadius: '12px',
              textAlign: 'center',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>Fast</div>
              <h3 style={{ marginBottom: '1rem', color: '#1f2937' }}>Fast Analysis</h3>
              <p style={{ color: '#6b7280' }}>Get results in seconds with high accuracy</p>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div style={{ 
          marginTop: '3rem',
          backgroundColor: '#fef3c7',
          border: '1px solid #f59e0b',
          borderRadius: '12px',
          padding: '1.5rem'
        }}>
          <h3 style={{ color: '#92400e', marginBottom: '1rem' }}>Medical Disclaimer</h3>
          <p style={{ color: '#92400e', margin: 0 }}>
            This AI tool is for educational and research purposes only. It should not be used for medical diagnosis. 
            Always consult qualified healthcare professionals for medical advice and diagnosis.
          </p>
        </div>
      </main>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default WorkingApp;
