'use client';

import { Github, Linkedin, Twitter } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Footer() {
  const socialLinks = [
    {
      name: 'GitHub',
      icon: Github,
      url: 'https://github.com/shivprasad08',
      color: 'hover:text-white hover:shadow-[0_0_10px_rgba(255,255,255,0.5)]',
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: 'https://www.linkedin.com/in/shivprasad-mahind08',
      color: 'hover:text-blue-400 hover:shadow-[0_0_10px_rgba(96,165,250,0.5)]',
    },
    {
      name: 'Twitter',
      icon: Twitter,
      url: 'https://x.com/Shivprasad_08',
      color: 'hover:text-sky-400 hover:shadow-[0_0_10px_rgba(56,189,248,0.5)]',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <footer className="relative z-20 bg-black/60 backdrop-blur-sm border-t border-gray-800/50 pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-16 items-start"
        >
          {/* Brand Section - Left */}
          <motion.div variants={itemVariants} className="flex flex-col gap-6 justify-start">
            <h3 className="text-4xl font-bold bg-blue-500 bg-clip-text text-transparent">
              URL Shortener
            </h3>
            <p className="text-gray-400 text-base leading-relaxed max-w-sm">
              Create short, shareable links with style. Fast, free, and beautiful.
            </p>
          </motion.div>

          {/* Quick Links - Center */}
          <motion.div variants={itemVariants} className="flex flex-col gap-6 items-center">
            <h4 className="text-white font-semibold text-lg">Quick Links</h4>
            <div className="space-y-4 text-center">
              <a href="#shorten" className="text-gray-400 hover:text-blue-400 text-base transition-colors block">
                Shorten URL
              </a>
              <a href="#analytics" className="text-gray-400 hover:text-blue-400 text-base transition-colors block">
                Analytics
              </a>
              <a href="#list" className="text-gray-400 hover:text-blue-400 text-base transition-colors block">
                My URLs
              </a>
            </div>
          </motion.div>

          {/* Social Links - Right */}
          <motion.div variants={itemVariants} className="flex flex-col gap-6 items-center">
            <h4 className="text-white font-semibold text-lg">Follow Us</h4>
            <div className="flex gap-8">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noreferrer"
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    className={`text-gray-400 transition-all duration-300 ${social.color}`}
                    aria-label={social.name}
                  >
                    <Icon size={32} strokeWidth={1.5} />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>
        </motion.div>

        {/* Divider */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent my-12"
        />

        {/* Bottom Section - Centered */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col items-center gap-6"
        >
          <motion.div variants={itemVariants} className="flex gap-10 text-base">
            <a href="#privacy" className="text-gray-400 hover:text-blue-400 transition-colors">
              Privacy Policy
            </a>
            <a href="#terms" className="text-gray-400 hover:text-blue-400 transition-colors">
              Terms of Service
            </a>
            <a href="#contact" className="text-gray-400 hover:text-blue-400 transition-colors">
              Contact
            </a>
          </motion.div>
          <motion.p variants={itemVariants} className="text-gray-400 text-base">
            © 2026 URL Shortener. All rights reserved.
          </motion.p>
        </motion.div>
      </div>

      {/* Gradient Background Effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 w-1/2 h-40 bg-blue-600/10 rounded-full blur-3xl -translate-x-1/2" />
      </div>
    </footer>
  );
}
