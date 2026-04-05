import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, AlertTriangle, CheckCircle, Info } from 'lucide-react';

export const Badge = ({ isAbnormal = false, abnormalType = 'normal' }) => {
  const palette = isAbnormal
    ? abnormalType === 'low'
      ? 'bg-amber-100 text-amber-800'
      : 'bg-rose-100 text-rose-800'
    : 'bg-emerald-100 text-emerald-800';

  return (
    <motion.span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${palette}`}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      {isAbnormal ? <AlertCircle size={14} /> : <CheckCircle size={14} />}
      {isAbnormal ? (abnormalType === 'low' ? 'LOW' : 'HIGH') : 'NORMAL'}
    </motion.span>
  );
};

export const Card = ({ children, className = '', hoverable = true, ...props }) => (
  <motion.div
    className={`rounded-[28px] border border-white/70 bg-white/85 p-6 shadow-[0_18px_45px_rgba(15,39,64,0.08)] backdrop-blur ${hoverable ? 'card-hover' : ''} ${className}`}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    {...props}
  >
    {children}
  </motion.div>
);

export const Button = ({ children, onClick, variant = 'primary', size = 'md', disabled = false, className = '', ...props }) => {
  const baseClasses = 'inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50';

  const sizeClasses = {
    sm: 'px-4 py-2.5 text-sm',
    md: 'px-5 py-3 text-sm',
    lg: 'px-6 py-3.5 text-base'
  };

  const variantClasses = {
    primary: 'bg-[linear-gradient(135deg,#6d28d9,#4338ca)] text-white shadow-[0_12px_30px_rgba(91,33,182,0.28)] hover:-translate-y-0.5',
    secondary: 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50',
    danger: 'bg-rose-600 text-white hover:bg-rose-700',
    success: 'bg-emerald-600 text-white hover:bg-emerald-700',
    warning: 'bg-amber-500 text-white hover:bg-amber-600',
    outline: 'border border-slate-300 bg-transparent text-slate-700 hover:bg-white'
  };

  return (
    <motion.button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.01 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export const Input = ({ label, placeholder, value, onChange, type = 'text', error, required = false, className = '', ...props }) => (
  <div className='space-y-2'>
    {label && (
      <label className='block text-sm font-semibold text-slate-700'>
        {label}
        {required && <span className='ml-1 text-rose-500'>*</span>}
      </label>
    )}
    <motion.input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`input-field ${error ? 'border-rose-400 focus:ring-rose-300' : ''} ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      {...props}
    />
    {error && <p className='text-sm text-rose-600'>{error}</p>}
  </div>
);

export const Select = ({ label, value, onChange, options, error, required = false, className = '', ...props }) => (
  <div className='space-y-2'>
    {label && (
      <label className='block text-sm font-semibold text-slate-700'>
        {label}
        {required && <span className='ml-1 text-rose-500'>*</span>}
      </label>
    )}
    <motion.select
      value={value}
      onChange={onChange}
      className={`input-field ${error ? 'border-rose-400 focus:ring-rose-300' : ''} ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      {...props}
    >
      <option value=''>Select {label || 'option'}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </motion.select>
    {error && <p className='text-sm text-rose-600'>{error}</p>}
  </div>
);

export const Textarea = ({ label, placeholder, value, onChange, error, required = false, rows = 4, className = '', ...props }) => (
  <div className='space-y-2'>
    {label && (
      <label className='block text-sm font-semibold text-slate-700'>
        {label}
        {required && <span className='ml-1 text-rose-500'>*</span>}
      </label>
    )}
    <motion.textarea
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      rows={rows}
      className={`input-field resize-none ${error ? 'border-rose-400 focus:ring-rose-300' : ''} ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      {...props}
    />
    {error && <p className='text-sm text-rose-600'>{error}</p>}
  </div>
);

export const Loading = () => (
  <div className='flex items-center justify-center py-12'>
    <motion.div
      className='h-12 w-12 rounded-full border-4 border-teal-100 border-t-teal-500'
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    />
  </div>
);

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
      className='fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className={`w-full rounded-[28px] border border-white/70 bg-white p-6 shadow-2xl ${sizeClasses[size]}`}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className='mb-4 flex items-center justify-between'>
          <h2 className='text-xl font-bold text-slate-900'>{title}</h2>
          <button onClick={onClose} className='rounded-xl px-2 py-1 text-slate-500 hover:bg-slate-100 hover:text-slate-700'>
            x
          </button>
        </div>
        {children}
      </motion.div>
    </motion.div>
  );
};

export const Alert = ({ type = 'info', title, message }) => {
  const styles = {
    success: {
      wrapper: 'border-emerald-200 bg-emerald-50 text-emerald-900',
      icon: <CheckCircle size={18} />
    },
    error: {
      wrapper: 'border-rose-200 bg-rose-50 text-rose-900',
      icon: <AlertCircle size={18} />
    },
    warning: {
      wrapper: 'border-amber-200 bg-amber-50 text-amber-900',
      icon: <AlertTriangle size={18} />
    },
    info: {
      wrapper: 'border-sky-200 bg-sky-50 text-sky-900',
      icon: <Info size={18} />
    }
  };

  const active = styles[type] || styles.info;

  return (
    <motion.div
      className={`rounded-3xl border p-4 shadow-sm ${active.wrapper}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <div className='flex items-start gap-3'>
        <div className='mt-0.5'>{active.icon}</div>
        <div>
          {title && <h3 className='mb-1 font-semibold'>{title}</h3>}
          <p className='text-sm leading-6'>{message}</p>
        </div>
      </div>
    </motion.div>
  );
};
