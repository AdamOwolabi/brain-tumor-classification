export interface MRIScan {
  id: number;
  imageUrl: string;
  patientId: string;
  scanType: 'T1-weighted MRI' | 'T2-weighted MRI' | 'FLAIR MRI';
  actualDiagnosis: 'No Tumor' | 'Glioma' | 'Meningioma' | 'Pituitary';
  confidence: number;
  probabilities: {
    'No Tumor': number;
    'Glioma': number;
    'Meningioma': number;
    'Pituitary': number;
  };
}

export const mriScans: MRIScan[] = [
  {
    id: 1,
    imageUrl: '/api/placeholder/300/300/brain-glioma-1',
    patientId: 'PT-2024-001',
    scanType: 'T1-weighted MRI',
    actualDiagnosis: 'Glioma',
    confidence: 0.94,
    probabilities: { 'Glioma': 0.94, 'No Tumor': 0.03, 'Meningioma': 0.02, 'Pituitary': 0.01 }
  },
  {
    id: 2,
    imageUrl: '/api/placeholder/300/300/brain-normal-1',
    patientId: 'PT-2024-002',
    scanType: 'T2-weighted MRI',
    actualDiagnosis: 'No Tumor',
    confidence: 0.97,
    probabilities: { 'No Tumor': 0.97, 'Glioma': 0.02, 'Meningioma': 0.01, 'Pituitary': 0.00 }
  },
  {
    id: 3,
    imageUrl: '/api/placeholder/300/300/brain-meningioma-1',
    patientId: 'PT-2024-003',
    scanType: 'FLAIR MRI',
    actualDiagnosis: 'Meningioma',
    confidence: 0.91,
    probabilities: { 'Meningioma': 0.91, 'No Tumor': 0.05, 'Glioma': 0.03, 'Pituitary': 0.01 }
  },
  {
    id: 4,
    imageUrl: '/api/placeholder/300/300/brain-pituitary-1',
    patientId: 'PT-2024-004',
    scanType: 'T1-weighted MRI',
    actualDiagnosis: 'Pituitary',
    confidence: 0.89,
    probabilities: { 'Pituitary': 0.89, 'No Tumor': 0.07, 'Meningioma': 0.03, 'Glioma': 0.01 }
  },
  {
    id: 5,
    imageUrl: '/api/placeholder/300/300/brain-glioma-2',
    patientId: 'PT-2024-005',
    scanType: 'T2-weighted MRI',
    actualDiagnosis: 'Glioma',
    confidence: 0.92,
    probabilities: { 'Glioma': 0.92, 'Meningioma': 0.04, 'No Tumor': 0.03, 'Pituitary': 0.01 }
  },
  {
    id: 6,
    imageUrl: '/api/placeholder/300/300/brain-normal-2',
    patientId: 'PT-2024-006',
    scanType: 'FLAIR MRI',
    actualDiagnosis: 'No Tumor',
    confidence: 0.95,
    probabilities: { 'No Tumor': 0.95, 'Glioma': 0.03, 'Meningioma': 0.01, 'Pituitary': 0.01 }
  },
  {
    id: 7,
    imageUrl: '/api/placeholder/300/300/brain-meningioma-2',
    patientId: 'PT-2024-007',
    scanType: 'T1-weighted MRI',
    actualDiagnosis: 'Meningioma',
    confidence: 0.88,
    probabilities: { 'Meningioma': 0.88, 'No Tumor': 0.08, 'Glioma': 0.03, 'Pituitary': 0.01 }
  },
  {
    id: 8,
    imageUrl: '/api/placeholder/300/300/brain-pituitary-2',
    patientId: 'PT-2024-008',
    scanType: 'T2-weighted MRI',
    actualDiagnosis: 'Pituitary',
    confidence: 0.93,
    probabilities: { 'Pituitary': 0.93, 'No Tumor': 0.04, 'Meningioma': 0.02, 'Glioma': 0.01 }
  },
  {
    id: 9,
    imageUrl: '/api/placeholder/300/300/brain-glioma-3',
    patientId: 'PT-2024-009',
    scanType: 'FLAIR MRI',
    actualDiagnosis: 'Glioma',
    confidence: 0.96,
    probabilities: { 'Glioma': 0.96, 'Meningioma': 0.02, 'No Tumor': 0.01, 'Pituitary': 0.01 }
  },
  {
    id: 10,
    imageUrl: '/api/placeholder/300/300/brain-normal-3',
    patientId: 'PT-2024-010',
    scanType: 'T1-weighted MRI',
    actualDiagnosis: 'No Tumor',
    confidence: 0.98,
    probabilities: { 'No Tumor': 0.98, 'Glioma': 0.01, 'Meningioma': 0.01, 'Pituitary': 0.00 }
  },
  {
    id: 11,
    imageUrl: '/api/placeholder/300/300/brain-meningioma-3',
    patientId: 'PT-2024-011',
    scanType: 'T2-weighted MRI',
    actualDiagnosis: 'Meningioma',
    confidence: 0.87,
    probabilities: { 'Meningioma': 0.87, 'No Tumor': 0.09, 'Glioma': 0.03, 'Pituitary': 0.01 }
  },
  {
    id: 12,
    imageUrl: '/api/placeholder/300/300/brain-pituitary-3',
    patientId: 'PT-2024-012',
    scanType: 'FLAIR MRI',
    actualDiagnosis: 'Pituitary',
    confidence: 0.90,
    probabilities: { 'Pituitary': 0.90, 'No Tumor': 0.06, 'Meningioma': 0.03, 'Glioma': 0.01 }
  }
];

// Utility functions
export const getRandomScan = (): MRIScan => {
  const randomIndex = Math.floor(Math.random() * mriScans.length);
  return mriScans[randomIndex];
};

export const getScanById = (id: number): MRIScan | undefined => {
  return mriScans.find(scan => scan.id === id);
};

export const getScansByDiagnosis = (diagnosis: MRIScan['actualDiagnosis']): MRIScan[] => {
  return mriScans.filter(scan => scan.actualDiagnosis === diagnosis);
};
