import React, { useState, useCallback } from 'react';

interface AnalysisResult {
  prediction: {
    class: string;
    confidence: number;
    class_index: number;
  };
  probabilities: { [key: string]: number };
  saliency_maps?: {
    gradcam?: string;
    integrated_gradients?: string;
  };
  explanation?: any;
  status: string;
}

const AnalyzeSimple: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResults(null);
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    setError(null);
    setResults(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch('/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const data = await response.json();
      setResults(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred during analysis');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResults(null);
    setError(null);
    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Brain Tumor Analysis
          </h1>
          <p className="text-xl text-gray-600">
            Upload a brain MRI scan to get AI-powered classification
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Upload MRI Scan
            </h2>

            {/* File Upload */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="text-gray-600">
                  <p className="text-lg mb-2">
                    Click to upload or drag & drop
                  </p>
                  <p className="text-sm">PNG, JPG, JPEG (max 10MB)</p>
                </div>
              </label>
            </div>

            {/* Preview */}
            {previewUrl && (
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Preview</h3>
                <img
                  src={previewUrl}
                  alt="Upload preview"
                  className="w-full h-64 object-contain bg-gray-50 rounded-lg border"
                />
                
                <div className="mt-4 flex justify-center space-x-4">
                  <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isAnalyzing ? 'Analyzing...' : 'Analyze Image'}
                  </button>
                  
                  <button
                    onClick={handleReset}
                    className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700"
                  >
                    Reset
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Analysis Results
            </h2>

            {isAnalyzing && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Analyzing your MRI scan...</p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-red-800">{error}</p>
              </div>
            )}

            {results && (
              <div className="space-y-6">
                {/* Main Prediction */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">
                    Classification Result
                  </h3>
                  <p className="text-2xl font-bold text-blue-600 mb-2">
                    {results.prediction.class}
                  </p>
                  <p className="text-blue-800">
                    Confidence: {(results.prediction.confidence * 100).toFixed(1)}%
                  </p>
                </div>

                {/* Probability Distribution */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Probability Distribution
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(results.probabilities).map(([className, probability]) => (
                      <div key={className} className="flex justify-between items-center">
                        <span className="font-medium">{className}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${(probability as number) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm">
                            {((probability as number) * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Disclaimer */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800 text-sm">
                    <strong>Disclaimer:</strong> This AI analysis is for educational purposes only. 
                    Always consult medical professionals for diagnosis.
                  </p>
                </div>
              </div>
            )}

            {!isAnalyzing && !results && !error && (
              <div className="text-center py-8 text-gray-500">
                <p>Upload an MRI scan to see AI-powered analysis</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyzeSimple;
