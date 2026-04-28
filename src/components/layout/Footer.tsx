'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

export function Footer() {
    const t = useTranslations('footer');
    return (
        <footer className="bg-ink px-8 md:px-20 py-8 flex items-center justify-between border-t border-accent/10">
            <motion.span
                className="font-mono text-xs text-paper/60 tracking-meta"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1 }}
            >
                © {new Date().getFullYear()} Pilar Olivero
            </motion.span>
            <motion.div
                className="flex items-center gap-8"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
            >
                <a
                    href="https://instagram.com/pilarolivero__"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs text-paper/60 hover:text-accent transition-colors duration-300 tracking-meta uppercase"
                >
                    Instagram ↗
                </a>
                <span className="hidden sm:block font-mono text-xs text-paper/40 tracking-meta">{t('location')}</span>
            </motion.div>
        </footer>
    );
}
