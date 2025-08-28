import React from 'react';

// Simple component without external dependencies to reduce errors
const SimpleApp: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-blue-600">🧠 NeuroAI</h1>
            </div>
            <nav className="flex space-x-4">
              <a href="#" className="text-gray-600 hover:text-blue-600">Home</a>
              <a href="#" className="text-gray-600 hover:text-blue-600">Analyze</a>
              <a href="#" className="text-gray-600 hover:text-blue-600">About</a>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            AI-Powered Brain Tumor Classification
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Advanced deep learning technology that analyzes brain MRI scans with medical-grade accuracy. 
            Get instant predictions with visual explanations and AI-generated insights.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-4">🧠</div>
              <h3 className="text-lg font-semibold mb-2">Advanced AI</h3>
              <p className="text-gray-600">State-of-the-art deep learning models trained on medical imaging data</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-4">👁️</div>
              <h3 className="text-lg font-semibold mb-2">Visual Explanations</h3>
              <p className="text-gray-600">Saliency maps and attention visualization to understand AI decisions</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-4">✨</div>
              <h3 className="text-lg font-semibold mb-2">AI Insights</h3>
              <p className="text-gray-600">Multi-modal explanations for comprehensive analysis</p>
            </div>
          </div>

          <div className="mt-12">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors">
              Start Analysis
            </button>
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2025 NeuroAI. For educational purposes only.</p>
        </div>
      </footer>
    </div>
  );
};

export default SimpleApp;
