import React from 'react';
import { motion } from 'framer-motion';
import { 
  ChartBarIcon,
  EyeIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

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

interface ResultsDisplayProps {
  results: AnalysisResult;
  originalImage: string | null;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results, originalImage }) => {
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceIcon = (confidence: number) => {
    if (confidence >= 0.8) return CheckCircleIcon;
    if (confidence >= 0.6) return ExclamationTriangleIcon;
    return ClockIcon;
  };

  const formatClassName = (className: string) => {
    const classMap: { [key: string]: string } = {
      'glioma': 'Glioma Tumor',
      'meningioma': 'Meningioma Tumor',
      'pituitary': 'Pituitary Tumor',
      'notumor': 'No Tumor'
    };
    return classMap[className] || className;
  };

  const ConfidenceIcon = getConfidenceIcon(results.prediction.confidence);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      {/* Main Prediction */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-semibold text-gray-900 flex items-center">
            <ChartBarIcon className="w-6 h-6 mr-2 text-primary-600" />
            Classification Result
          </h3>
          <div className="flex items-center">
            <ConfidenceIcon className={`w-5 h-5 mr-2 ${getConfidenceColor(results.prediction.confidence)}`} />
            <span className={`font-semibold ${getConfidenceColor(results.prediction.confidence)}`}>
              {(results.prediction.confidence * 100).toFixed(1)}% confidence
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Prediction Details */}
          <div>
            <div className="text-center p-6 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl">
              <div className="text-3xl font-bold text-primary-600 mb-2">
                {formatClassName(results.prediction.class)}
              </div>
              <div className="text-gray-600">
                Predicted Classification
              </div>
            </div>
          </div>

          {/* Confidence Meter */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Confidence Level</h4>
            <div className="progress-bar">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${results.prediction.confidence * 100}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className="progress-fill"
              />
            </div>
            <div className="mt-2 text-sm text-gray-600 text-center">
              {(results.prediction.confidence * 100).toFixed(1)}%
            </div>
          </div>
        </div>
      </div>

      {/* Probability Distribution */}
      <div className="card p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <ChartBarIcon className="w-5 h-5 mr-2 text-primary-600" />
          Probability Distribution
        </h3>
        <div className="space-y-3">
          {Object.entries(results.probabilities).map(([className, probability], index) => (
            <motion.div
              key={className}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex items-center justify-between"
            >
              <span className="font-medium text-gray-700">
                {formatClassName(className)}
              </span>
              <div className="flex items-center space-x-3 flex-1 ml-4">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${probability * 100}%` }}
                    transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                    className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"
                  />
                </div>
                <span className="text-sm font-medium text-gray-600 w-12 text-right">
                  {(probability * 100).toFixed(1)}%
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Saliency Maps */}
      {results.saliency_maps && (
        <div className="card p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <EyeIcon className="w-5 h-5 mr-2 text-primary-600" />
            Visual Explanations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Original Image */}
            {originalImage && (
              <div className="text-center">
                <h4 className="font-medium text-gray-700 mb-2">Original Image</h4>
                <img
                  src={originalImage}
                  alt="Original"
                  className="w-full h-48 object-contain bg-gray-50 rounded-lg border"
                />
              </div>
            )}

            {/* Grad-CAM */}
            {results.saliency_maps.gradcam && (
              <div className="text-center">
                <h4 className="font-medium text-gray-700 mb-2">Grad-CAM</h4>
                <div className="relative">
                  {originalImage && (
                    <img
                      src={originalImage}
                      alt="Background"
                      className="w-full h-48 object-contain bg-gray-50 rounded-lg border"
                    />
                  )}
                  <img
                    src={`data:image/png;base64,${results.saliency_maps.gradcam}`}
                    alt="Grad-CAM"
                    className="absolute inset-0 w-full h-48 object-contain rounded-lg saliency-overlay"
                  />
                </div>
              </div>
            )}

            {/* Integrated Gradients */}
            {results.saliency_maps.integrated_gradients && (
              <div className="text-center">
                <h4 className="font-medium text-gray-700 mb-2">Integrated Gradients</h4>
                <img
                  src={`data:image/png;base64,${results.saliency_maps.integrated_gradients}`}
                  alt="Integrated Gradients"
                  className="w-full h-48 object-contain bg-gray-50 rounded-lg border"
                />
              </div>
            )}
          </div>
          <p className="text-sm text-gray-600 mt-4">
            These heatmaps show which regions of the brain scan the AI model focused on when making its prediction.
            Warmer colors (red/yellow) indicate areas of higher importance.
          </p>
        </div>
      )}

      {/* AI Explanation */}
      {results.explanation && (
        <div className="card p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <DocumentTextIcon className="w-5 h-5 mr-2 text-primary-600" />
            AI-Generated Explanation
          </h3>
          
          {results.explanation.error ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800">
                Explanation service temporarily unavailable. The classification result above is still valid.
              </p>
            </div>
          ) : (
            <div className="prose max-w-none">
              {typeof results.explanation.explanation === 'string' ? (
                <div className="whitespace-pre-wrap text-gray-700">
                  {results.explanation.explanation}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">
                      Classification: {results.explanation.prediction?.class}
                    </h4>
                    <p className="text-blue-800">
                      Confidence: {(results.explanation.prediction?.confidence * 100 || 0).toFixed(1)}%
                    </p>
                  </div>
                  
                  {results.explanation.class_info && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h4 className="font-semibold text-green-900 mb-2">
                        About {results.explanation.class_info.name}
                      </h4>
                      <p className="text-green-800 mb-2">
                        {results.explanation.class_info.description}
                      </p>
                      {results.explanation.class_info.characteristics && (
                        <ul className="list-disc list-inside text-green-700 text-sm">
                          {results.explanation.class_info.characteristics.map((char: string, idx: number) => (
                            <li key={idx}>{char}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Disclaimer */}
      <div className="card p-6 bg-amber-50 border-amber-200">
        <div className="flex items-start">
          <ExclamationTriangleIcon className="w-6 h-6 text-amber-600 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-amber-900 mb-2">Medical Disclaimer</h4>
            <p className="text-amber-800 text-sm">
              This AI analysis is for educational and research purposes only. It should not be used as a substitute 
              for professional medical diagnosis or treatment. Always consult with qualified healthcare professionals 
              for medical advice and diagnosis.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ResultsDisplay;
