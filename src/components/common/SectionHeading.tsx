import { motion } from 'framer-motion';

interface Props {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'center' | 'left';
  dark?: boolean;
  compact?: boolean;
}

export default function SectionHeading({ eyebrow, title, subtitle, align = 'center', dark = false, compact = false }: Props) {
  const alignClass = align === 'center' ? 'text-center mx-auto' : 'text-left';
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`max-w-2xl ${compact ? 'mb-8' : 'mb-12'} ${alignClass}`}
    >
      {eyebrow && (
        <span className={`inline-block text-xs font-bold uppercase tracking-[0.25em] mb-3 px-3 py-1.5 rounded-full ${
          dark ? 'bg-white/10 text-white' : 'bg-brand-50 text-brand-600'
        }`}>
          {eyebrow}
        </span>
      )}
      <h2 className={`font-display text-3xl md:text-[40px] leading-tight font-bold ${dark ? 'text-white' : 'text-slate-900'}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-3 text-base md:text-lg ${dark ? 'text-slate-300' : 'text-slate-500'}`}>
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
