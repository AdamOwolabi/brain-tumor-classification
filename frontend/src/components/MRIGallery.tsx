import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { mriScans, MRIScan } from '../data/mriDatabase';

interface MRIGalleryProps {
  onScanSelect: (scan: MRIScan) => void;
  selectedScan: MRIScan | null;
}

const MRIGallery: React.FC<MRIGalleryProps> = ({ onScanSelect, selectedScan }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    setImageLoading(true);
  }, [currentIndex]);

  const nextScan = () => {
    setCurrentIndex((prev) => (prev + 1) % mriScans.length);
  };

  const previousScan = () => {
    setCurrentIndex((prev) => (prev - 1 + mriScans.length) % mriScans.length);
  };

  const shuffleScan = () => {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * mriScans.length);
    } while (newIndex === currentIndex && mriScans.length > 1);
    setCurrentIndex(newIndex);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleAnalyze = () => {
    onScanSelect(mriScans[currentIndex]);
  };

  const currentScan = mriScans[currentIndex];

  return (
    <motion.div 
      className="bg-white rounded-xl shadow-lg p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-6">MRI Scan Gallery</h2>
      
      {/* MRI Display */}
      <div className="mb-6">
        <div className="relative w-80 h-80 mx-auto border-2 border-gray-200 rounded-xl overflow-hidden bg-gray-50">
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}
          <motion.img
            key={currentIndex}
            src={currentScan.imageUrl}
            alt={`MRI Scan ${currentScan.patientId}`}
            className="w-full h-full object-cover"
            onLoad={handleImageLoad}
            onError={() => setImageLoading(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: imageLoading ? 0 : 1 }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Scan Information */}
      <div className="text-center mb-6">
        <p className="text-gray-600 mb-2">
          Scan {currentIndex + 1} of {mriScans.length} | {currentScan.patientId}
        </p>
        <p className="text-sm text-gray-500">{currentScan.scanType}</p>
      </div>

      {/* Navigation Controls */}
      <div className="flex justify-center items-center gap-4 mb-6">
        <button
          onClick={previousScan}
          className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          <ChevronLeftIcon className="w-4 h-4" />
          Previous
        </button>

        <button
          onClick={shuffleScan}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          Shuffle
        </button>

        <button
          onClick={nextScan}
          className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          Next
          <ChevronRightIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Analyze Button */}
      <div className="text-center">
        <button
          onClick={handleAnalyze}
          className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg"
        >
          Analyze This Scan
        </button>
      </div>

      {/* Thumbnail Gallery */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Quick Navigation</h3>
        <div className="grid grid-cols-6 gap-2">
          {mriScans.map((scan, index) => (
            <button
              key={scan.id}
              onClick={() => setCurrentIndex(index)}
              className={`relative w-12 h-12 rounded border-2 overflow-hidden transition-all ${
                index === currentIndex 
                  ? 'border-blue-500 ring-2 ring-blue-200' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <img
                src={scan.imageUrl}
                alt={`Thumbnail ${scan.id}`}
                className="w-full h-full object-cover"
              />
              {scan.actualDiagnosis !== 'No Tumor' && (
                <div className="absolute inset-0 bg-red-500 bg-opacity-20 flex items-center justify-center">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default MRIGallery;
