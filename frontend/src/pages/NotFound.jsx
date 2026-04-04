import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Users, Clock, TrendingUp } from 'lucide-react';
import { Card, Button } from '../components/UIComponents';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      className='space-y-8 text-center py-20'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div>
        <motion.h1
          className='text-6xl font-bold text-blue-600 mb-2'
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          404
        </motion.h1>
        <p className='text-2xl font-bold text-gray-900 dark:text-white'>Page Not Found</p>
        <p className='text-gray-600 dark:text-gray-400'>The page you're looking for doesn't exist.</p>
      </div>

      <Button
        onClick={() => navigate('/')}
        variant='primary'
        size='lg'
        className='inline-block'
      >
        Back to Dashboard
      </Button>
    </motion.div>
  );
};

export default NotFound;
