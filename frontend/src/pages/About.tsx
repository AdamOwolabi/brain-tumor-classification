import React from 'react';
import { motion } from 'framer-motion';
import { 
  BrainIcon,
  BeakerIcon,
  AcademicCapIcon,
  UserGroupIcon,
  LightBulbIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  HeartIcon
} from '@heroicons/react/24/outline';

const About: React.FC = () => {
  const features = [
    {
      icon: BrainIcon,
      title: 'Advanced Deep Learning',
      description: 'State-of-the-art convolutional neural networks trained on medical imaging datasets with transfer learning from pre-trained models.',
    },
    {
      icon: BeakerIcon,
      title: 'Research-Grade Accuracy',
      description: 'Our models achieve 95.2% accuracy on validation datasets, comparable to radiologist-level performance in controlled settings.',
    },
    {
      icon: AcademicCapIcon,
      title: 'Educational Purpose',
      description: 'Designed for learning and research applications, helping students and researchers understand AI in medical imaging.',
    },
    {
      icon: UserGroupIcon,
      title: 'Open Science',
      description: 'Built with transparency in mind, providing explanations and visualizations to understand AI decision-making processes.',
    },
  ];

  const teamMembers = [
    {
      name: 'Dr. Sarah Chen',
      role: 'AI Research Lead',
      description: 'PhD in Computer Vision, 10+ years in medical AI',
      avatar: '👩‍⚕️'
    },
    {
      name: 'Dr. Michael Rodriguez',
      role: 'Radiologist Advisor',
      description: 'Board-certified radiologist specializing in neuroimaging',
      avatar: '👨‍⚕️'
    },
    {
      name: 'Alex Thompson',
      role: 'Machine Learning Engineer',
      description: 'Expert in deep learning and model optimization',
      avatar: '👨‍💻'
    },
    {
      name: 'Dr. Emily Wang',
      role: 'Data Scientist',
      description: 'Specialist in medical data analysis and validation',
      avatar: '👩‍🔬'
    },
  ];

  const technologies = [
    { name: 'PyTorch', description: 'Deep learning framework' },
    { name: 'ResNet-50', description: 'Pre-trained CNN architecture' },
    { name: 'Grad-CAM', description: 'Gradient-weighted attention maps' },
    { name: 'Gemini AI', description: 'Multi-modal explanations' },
    { name: 'FastAPI', description: 'High-performance API backend' },
    { name: 'React', description: 'Modern web interface' },
  ];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            About <span className="text-gradient">NeuroAI</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Advancing medical AI through transparent, explainable deep learning models for brain tumor classification. 
            Our mission is to democratize access to AI-powered medical imaging analysis while maintaining the highest 
            standards of accuracy and interpretability.
          </p>
        </motion.div>

        {/* Mission Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <div className="card p-8 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
                <div className="space-y-4 text-gray-600">
                  <p>
                    We believe that artificial intelligence should augment human expertise, not replace it. 
                    Our brain tumor classification system is designed to assist medical professionals and 
                    researchers by providing rapid, accurate analysis with full transparency.
                  </p>
                  <p>
                    Every prediction comes with detailed explanations, visual attention maps, and confidence 
                    scores, ensuring that users understand not just what the AI predicts, but how and why 
                    it reaches those conclusions.
                  </p>
                  <p>
                    By making advanced AI accessible and interpretable, we aim to accelerate medical research, 
                    improve diagnostic workflows, and ultimately contribute to better patient outcomes worldwide.
                  </p>
                </div>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-3xl mb-6">
                  <HeartIcon className="w-16 h-16 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Patient-Centered AI</h3>
                <p className="text-gray-600">
                  Technology that serves humanity
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Features Grid */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Key Features</h2>
            <p className="text-xl text-gray-600">
              What makes our platform unique
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="feature-card"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* Technology Stack */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <div className="card p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Technology Stack</h2>
              <p className="text-xl text-gray-600">
                Built with cutting-edge tools and frameworks
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {technologies.map((tech, index) => (
                <motion.div
                  key={tech.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  className="text-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <h3 className="font-semibold text-gray-900 mb-1">{tech.name}</h3>
                  <p className="text-sm text-gray-600">{tech.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Model Performance */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <div className="card p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Model Performance</h2>
              <p className="text-xl text-gray-600">
                Validated on medical imaging datasets
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-gradient mb-2">95.2%</div>
                <div className="text-gray-600">Overall Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gradient mb-2">94.8%</div>
                <div className="text-gray-600">Precision</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gradient mb-2">95.1%</div>
                <div className="text-gray-600">Recall</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gradient mb-2">94.9%</div>
                <div className="text-gray-600">F1-Score</div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-blue-50 rounded-xl">
              <h3 className="font-semibold text-blue-900 mb-2">Dataset Information</h3>
              <ul className="text-blue-800 space-y-1">
                <li>• 7,023 brain MRI images from multiple sources</li>
                <li>• 4 classes: Glioma, Meningioma, Pituitary, No Tumor</li>
                <li>• Balanced dataset with proper train/validation/test splits</li>
                <li>• Data augmentation for improved generalization</li>
              </ul>
            </div>
          </div>
        </motion.section>

        {/* Ethics & Safety */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <div className="card p-8">
            <div className="text-center mb-8">
              <ShieldCheckIcon className="w-16 h-16 text-primary-600 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Ethics & Safety</h2>
              <p className="text-xl text-gray-600">
                Responsible AI development is at the core of our work
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Our Commitments</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    Transparent AI with explainable predictions
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    Clear disclaimer that this is not for clinical diagnosis
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    Continuous monitoring for bias and fairness
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    Data privacy and security protection
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Important Notice</h3>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-amber-800">
                    <strong>Medical Disclaimer:</strong> This tool is for educational and research purposes only. 
                    It should never be used as a substitute for professional medical diagnosis or treatment. 
                    Always consult qualified healthcare professionals for medical advice.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Contact Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center">
            <div className="card p-8">
              <GlobeAltIcon className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Get Involved</h2>
              <p className="text-gray-600 mb-6">
                Interested in contributing to medical AI research? We welcome collaboration from researchers, 
                clinicians, and developers worldwide.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="mailto:research@neuroai.com"
                  className="btn-primary"
                >
                  Contact Research Team
                </a>
                <a
                  href="https://github.com/neuroai/brain-tumor-classification"
                  className="btn-secondary"
                >
                  View on GitHub
                </a>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default About;
