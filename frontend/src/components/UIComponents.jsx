import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle } from 'lucide-react';

export const Badge = ({ status, value, isAbnormal = false, type = 'success' }) => {
  const baseClasses = 'px-3 py-1 rounded-full text-sm font-semibold inline-flex items-center gap-1';
  
  const statusClasses = {
    abnormal: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200',
    normal: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
    warning: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200',
    info: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
  };

  return (
    <motion.span
      className={`${baseClasses} ${statusClasses[isAbnormal ? 'abnormal' : type]}`}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      {isAbnormal ? (
        <>
          <AlertCircle size={16} />
          HIGH
        </>
      ) : (
        <>
          <CheckCircle size={16} />
          NORMAL
        </>
      )}
    </motion.span>
  );
};

export const Card = ({ children, className = '', hoverable = true }) => {
  return (
    <motion.div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-soft p-6 ${hoverable ? 'card-hover' : ''} ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

export const Button = ({ children, onClick, variant = 'primary', size = 'md', disabled = false, className = '', ...props }) => {
  const baseClasses = 'font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    success: 'bg-green-600 hover:bg-green-700 text-white'
  };

  return (
    <motion.button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export const Input = ({ label, placeholder, value, onChange, type = 'text', error, required = false, ...props }) => {
  return (
    <div className='space-y-2'>
      {label && (
        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
          {label}
          {required && <span className='text-red-500 ml-1'>*</span>}
        </label>
      )}
      <motion.input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`input-field ${error ? 'border-red-500 focus:ring-red-500' : ''}`}
        {...props}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />
      {error && <p className='text-red-500 text-sm'>{error}</p>}
    </div>
  );
};

export const Select = ({ label, value, onChange, options, error, required = false, ...props }) => {
  return (
    <div className='space-y-2'>
      {label && (
        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
          {label}
          {required && <span className='text-red-500 ml-1'>*</span>}
        </label>
      )}
      <motion.select
        value={value}
        onChange={onChange}
        className={`input-field ${error ? 'border-red-500 focus:ring-red-500' : ''}`}
        {...props}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <option value=''>Select {label || 'option'}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </motion.select>
      {error && <p className='text-red-500 text-sm'>{error}</p>}
    </div>
  );
};

export const Textarea = ({ label, placeholder, value, onChange, error, required = false, rows = 4, ...props }) => {
  return (
    <div className='space-y-2'>
      {label && (
        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
          {label}
          {required && <span className='text-red-500 ml-1'>*</span>}
        </label>
      )}
      <motion.textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        rows={rows}
        className={`input-field resize-none ${error ? 'border-red-500 focus:ring-red-500' : ''}`}
        {...props}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />
      {error && <p className='text-red-500 text-sm'>{error}</p>}
    </div>
  );
};

export const Loading = () => {
  return (
    <div className='flex items-center justify-center py-12'>
      <motion.div
        className='w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full'
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
};

export const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl'
  };

  return (
    <motion.div
      className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 ${sizeClasses[size]}`}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-xl font-bold text-gray-900 dark:text-white'>{title}</h2>
          <button
            onClick={onClose}
            className='text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          >
            ✕
          </button>
        </div>
        {children}
      </motion.div>
    </motion.div>
  );
};

export const Alert = ({ type = 'info', title, message }) => {
  const bgClasses = {
    success: 'bg-green-50 dark:bg-green-900',
    error: 'bg-red-50 dark:bg-red-900',
    warning: 'bg-yellow-50 dark:bg-yellow-900',
    info: 'bg-blue-50 dark:bg-blue-900'
  };

  const borderClasses = {
    success: 'border-green-200 dark:border-green-700',
    error: 'border-red-200 dark:border-red-700',
    warning: 'border-yellow-200 dark:border-yellow-700',
    info: 'border-blue-200 dark:border-blue-700'
  };

  const textClasses = {
    success: 'text-green-800 dark:text-green-200',
    error: 'text-red-800 dark:text-red-200',
    warning: 'text-yellow-800 dark:text-yellow-200',
    info: 'text-blue-800 dark:text-blue-200'
  };

  return (
    <motion.div
      className={`${bgClasses[type]} border-l-4 ${borderClasses[type]} p-4 rounded ${textClasses[type]}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
    >
      {title && <h3 className='font-semibold mb-1'>{title}</h3>}
      <p>{message}</p>
    </motion.div>
  );
};
