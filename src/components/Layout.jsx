import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, FileDown } from 'lucide-react';
import { METACOSMOS_LOGO_DATA_URI } from '../assets/metacosmosLogo';

export default function Layout({ children }) {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isHome = location.pathname === '/';

  const navLinks = [
    ...(isHome ? [
      { to: '/#service-intro', label: '서비스' },
      { to: '/#roi', label: '비용 절감' },
      { to: '/#testimonials', label: '후기' },
    ] : [
      { to: '/', label: '홈' },
    ]),
    { to: '/qna', label: 'Q&A' },
    { to: '/blog', label: '블로그' },
    { to: '/admin', label: '관리자' },
    ...(isHome ? [{ to: '/#contact', label: '무료 상담' }] : []),
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white overflow-x-hidden">
      <header>
        <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-cyan-500/20">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <Link to="/" className="flex items-center gap-3">
              <img
                src={METACOSMOS_LOGO_DATA_URI}
                alt="METACOSMOS"
                className="h-9 w-auto rounded-sm"
              />
              <div className="leading-tight">
                <div className="text-sm md:text-base font-bold text-slate-100">메타코스모스</div>
                <div className="text-xs text-slate-400">호텔·모텔 통합 OTT</div>
              </div>
            </Link>
            <div className="hidden md:flex gap-6 items-center">
              {navLinks.map(({ to, label }) => (
                <Link
                  key={to + label}
                  to={to}
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-sm font-medium transition-colors ${
                    location.pathname === to || (to.startsWith('/#') && isHome)
                      ? 'text-cyan-400'
                      : 'hover:text-cyan-400 text-slate-300'
                  }`}
                >
                  {label}
                </Link>
              ))}
              {!isHome && (
                <Link
                  to="/#contact"
                  className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-sm font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
                >
                  무료 상담
                </Link>
              )}
            </div>
            <button
              type="button"
              onClick={() => setIsMenuOpen((o) => !o)}
              className="md:hidden text-cyan-400"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden bg-slate-800/80 backdrop-blur border-t border-cyan-500/20"
              >
                <div className="px-4 py-4 space-y-2">
                  {navLinks.map(({ to, label }) => (
                    <Link
                      key={to + label}
                      to={to}
                      onClick={() => setIsMenuOpen(false)}
                      className="block py-2 hover:text-cyan-400"
                    >
                      {label}
                    </Link>
                  ))}
                  {!isHome && (
                    <Link to="/#contact" className="block w-full py-2 text-center bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full font-semibold">
                      무료 상담
                    </Link>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </header>
      <div className="pt-16">
        <Outlet />
      </div>
      <a
        href="/자료/meta_ott.pdf"
        download="meta_ott.pdf"
        title="서비스 설명서 다운"
        className="fixed right-3 md:right-4 top-1/2 -translate-y-1/2 z-50 h-10 md:h-12 px-3 md:px-4 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/40 flex items-center gap-1.5 md:gap-2 font-semibold text-xs md:text-sm hover:scale-105 hover:shadow-cyan-400/60 transition-all"
      >
        <FileDown size={18} className="md:w-5 md:h-5" />
        <span>설명서</span>
      </a>
    </div>
  );
}
