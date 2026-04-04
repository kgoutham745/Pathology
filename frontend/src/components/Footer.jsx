import React from 'react';
import { motion } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer
      className='bg-gray-900 text-gray-300 mt-16 py-12'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className='max-w-7xl mx-auto px-4'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-8'>
          {/* About */}
          <div>
            <h3 className='text-white font-bold mb-3'>About</h3>
            <p className='text-sm'>
              Pathology Report Generator - Professional medical report generation system for diagnostic laboratories.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className='text-white font-bold mb-3'>Quick Links</h3>
            <ul className='space-y-2 text-sm'>
              <li><a href='#' className='hover:text-white transition'>Dashboard</a></li>
              <li><a href='#' className='hover:text-white transition'>Generate Report</a></li>
              <li><a href='#' className='hover:text-white transition'>Report History</a></li>
              <li><a href='#' className='hover:text-white transition'>Lab Settings</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className='text-white font-bold mb-3'>Contact</h3>
            <p className='text-sm'>
              Email: info@pathologylab.com<br />
              Phone: +1-800-MEDLAB<br />
              Address: Medical Center, Healthcare City
            </p>
          </div>
        </div>

        <hr className='border-gray-700 my-8' />

        <div className='flex flex-col md:flex-row justify-between items-center text-sm'>
          <p>&copy; {currentYear} Pathology Report Generator. All rights reserved.</p>
          <div className='flex gap-6 mt-4 md:mt-0'>
            <a href='#' className='hover:text-white transition'>Privacy Policy</a>
            <a href='#' className='hover:text-white transition'>Terms of Service</a>
            <a href='#' className='hover:text-white transition'>Contact Us</a>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
