import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, FlaskConical, Palette, FileText, Sparkles } from 'lucide-react';
import { Card } from '../components/UIComponents';

const featureCards = [
  {
    icon: FlaskConical,
    title: 'Fast Lab Workflows',
    description: 'Generate structured pathology reports with a smoother technician workflow and cleaner data entry.'
  },
  {
    icon: Palette,
    title: 'Custom Branding',
    description: 'Adapt headers, colors, logos, disclaimers, and report presentation for each laboratory setup.'
  },
  {
    icon: FileText,
    title: 'Professional Reports',
    description: 'Create polished printable PDFs and maintain searchable report history in one workspace.'
  },
  {
    icon: ShieldCheck,
    title: 'Controlled Access',
    description: 'Separate admin and user workspaces so account management and report operations stay organized.'
  }
];

const About = () => (
  <div className='space-y-6'>
    <motion.section
      className='overflow-hidden rounded-[32px] bg-[linear-gradient(135deg,#4c1d95,#312e81_58%,#1e1b4b)] p-8 text-white shadow-[0_26px_70px_rgba(76,29,149,0.24)] md:p-10'
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className='flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between'>
        <div className='max-w-2xl'>
          <div className='inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-violet-100'>
            <Sparkles size={14} />
            About Pathora Labs
          </div>
          <h1 className='mt-6 text-4xl font-bold tracking-tight md:text-5xl'>A modern pathology workspace built for speed, clarity, and presentation.</h1>
          <p className='mt-5 max-w-xl text-base leading-7 text-violet-100/90'>
            Pathora Labs helps diagnostic teams generate cleaner reports, manage accounts, brand their output, and keep day-to-day reporting simpler on both desktop and mobile.
          </p>
        </div>
        <div className='flex items-center justify-center'>
          <div className='rounded-[28px] border border-white/15 bg-white/10 p-5 backdrop-blur'>
            <img src='/pathora-logo.svg' alt='Pathora Labs logo' className='h-28 w-28 rounded-3xl bg-white/10 p-3' />
          </div>
        </div>
      </div>
    </motion.section>

    <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
      {featureCards.map((item, index) => {
        const Icon = item.icon;
        return (
          <Card key={item.title} className='p-7'>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }}>
              <div className='mb-5 flex h-14 w-14 items-center justify-center rounded-3xl bg-[linear-gradient(135deg,#8b5cf6,#ec4899)] text-white shadow-[0_14px_34px_rgba(139,92,246,0.28)]'>
                <Icon size={24} />
              </div>
              <h2 className='text-2xl font-bold text-slate-900'>{item.title}</h2>
              <p className='mt-3 text-sm leading-7 text-slate-600'>{item.description}</p>
            </motion.div>
          </Card>
        );
      })}
    </div>

    <Card className='p-7'>
      <h2 className='text-2xl font-bold text-slate-900'>What This Application Covers</h2>
      <div className='mt-5 grid grid-cols-1 gap-4 md:grid-cols-2'>
        <div className='rounded-3xl bg-violet-50 p-5'>
          <h3 className='font-semibold text-violet-900'>For Administrators</h3>
          <p className='mt-2 text-sm leading-7 text-slate-600'>Manage lab users, review account status, and control how teams access the reporting workspace.</p>
        </div>
        <div className='rounded-3xl bg-fuchsia-50 p-5'>
          <h3 className='font-semibold text-fuchsia-900'>For Lab Users</h3>
          <p className='mt-2 text-sm leading-7 text-slate-600'>Create reports faster, keep patient details organized, and export cleaner PDFs for clinical communication.</p>
        </div>
      </div>
    </Card>
  </div>
);

export default About;
