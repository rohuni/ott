import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './contexts/AuthContext';
import { BlogProvider } from './contexts/BlogContext';
import { ConsultationProvider, useConsultation } from './contexts/ConsultationContext';
import Layout from './components/Layout';
import QNA from './pages/QNA';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Admin from './pages/Admin';
import { METACOSMOS_LOGO_DATA_URI } from './assets/metacosmosLogo';
import {
  ChevronDown,
  Check,
  TrendingUp,
  Phone,
  Mail,
  MapPin,
  X,
  Menu,
  DollarSign,
  Tv,
  Shield,
  Headphones,
  Package,
  Film,
  AlertCircle,
  Wrench,
  Smartphone,
  Megaphone,
  Smile,
  BarChart3,
  Wallet,
  Building2,
  Home,
  TreePine,
  Building,
  Stethoscope,
} from 'lucide-react';

// 자료/images 경로 (이미지는 public/자료/images/ 에 두면 /자료/images/ 로 서빙됨)
const IMG = '/자료/images';
const IMG_EXT = ['.jpg', '.jpeg', '.png', '.webp'];

// 이미지 로드 실패 시 fallback 표시. src 직접 지정 시 1회만 시도, name만 주면 .jpg/.png/.webp 순으로 시도
const ImgWithFallback = ({ src, name, alt, className, fallback, ...props }) => {
  const [tryIdx, setTryIdx] = useState(0);
  const [failed, setFailed] = useState(false);
  const handleError = () => {
    if (src) setFailed(true);
    else setTryIdx((i) => (i + 1 < IMG_EXT.length ? i + 1 : -1));
  };
  const fullSrc = src || (name != null && tryIdx >= 0 ? `${IMG}/${name}${IMG_EXT[tryIdx]}` : null);
  if (failed || (name != null && tryIdx < 0) || !fullSrc) return fallback || null;
  return (
    <img
      src={fullSrc}
      alt={alt || ''}
      className={className}
      onError={handleError}
      loading="lazy"
      {...props}
    />
  );
};

// 3D tilt card wrapper
const TiltCard = ({ children, className = '' }) => {
  const ref = useRef(null);
  const [transform, setTransform] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg)');

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotateX = (y - 0.5) * -12;
    const rotateY = (x - 0.5) * 12;
    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`);
  };
  const handleMouseLeave = () => {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform }}
      className={`transition-transform duration-200 ease-out ${className}`}
    >
      {children}
    </motion.div>
  );
};

const HomeContent = () => {
  const location = useLocation();
  const { addConsultation } = useConsultation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [roomCount, setRoomCount] = useState(30);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', rooms: '', phone: '' });
  const [toasts, setToasts] = useState([]);
  const [activeOTT, setActiveOTT] = useState('netflix');

  useEffect(() => {
    const hash = location.hash || window.location.hash;
    if (hash) setTimeout(() => document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' }), 100);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    const container = document.getElementById('particles');
    if (!container) return;
    for (let i = 0; i < 50; i++) {
      const el = document.createElement('div');
      el.className = 'particle';
      el.style.left = Math.random() * 100 + '%';
      el.style.top = Math.random() * 100 + '%';
      el.style.animationDelay = Math.random() * 3 + 's';
      el.style.animationDuration = (Math.random() * 4 + 8) + 's';
      container.appendChild(el);
    }
    const interval = setInterval(addRandomToast, 12000);
    return () => clearInterval(interval);
  }, []);

  const calculateCosts = () => {
    const legacyCost = roomCount * 250000;
    const solutionMonthly = roomCount > 50 ? roomCount * 13200 : roomCount * 15000;
    const savings = legacyCost - solutionMonthly;
    return {
      legacy: legacyCost,
      solutionMonthly,
      savings,
      savingsPercent: Math.round((savings / legacyCost) * 100),
    };
  };

  const costs = calculateCosts();
  const maxBar = Math.max(costs.legacy, 25000000);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (addConsultation) addConsultation({ name: formData.name, rooms: formData.rooms, phone: formData.phone });
    addToast(`${formData.name}에서 ${formData.rooms}실 상담 신청했습니다.`);
    setFormData({ name: '', rooms: '', phone: '' });
    setShowSuccessModal(true);
  };

  const addToast = (message) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 5000);
  };

  const addRandomToast = () => {
    const cities = ['부산', '대구', '인천', '대전', '광주', '울산', '수원', '강원'];
    const names = ['OO 호텔', 'OO 모텔', 'OO 리조트', 'OO 펜션'];
    const rooms = [15, 20, 25, 30, 40, 50];
    const city = cities[Math.floor(Math.random() * cities.length)];
    const name = names[Math.floor(Math.random() * names.length)];
    const r = rooms[Math.floor(Math.random() * rooms.length)];
    addToast(`방금 ${city} ${name}에서 ${r}실 도입 상담을 신청했습니다.`);
  };

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  const painPoints = [
    { title: '높은 설치 비용', desc: '스마트TV 교체 및 시스템 구축에 수백만 원', icon: DollarSign },
    { title: '복잡한 운영', desc: '각 OTT별 계약·청구·유지보수 담당자 필요', icon: Wrench },
    { title: '개인정보 노출', desc: '고객 계정 공유로 보안 문제 위험', icon: AlertCircle },
    { title: '잦은 A/S', desc: 'TV 고장 시 응급 대응 비용 과다', icon: Headphones },
  ];

  const solutions = [
    { title: '4K UHD 셋톱 무상 임대', desc: '최신 4K 기기 제공, 설치비 0원', icon: Package, highlight: true },
    { title: '7종 통합 OTT', desc: '넷플릭스·디즈니+·유튜브 등 한 번에', icon: Film, highlight: false },
    { title: '자동 개인정보 로그아웃', desc: '체크아웃 시 자동 계정 삭제', icon: Shield, highlight: true },
    { title: '24시간 원격 A/S', desc: '전국 어디서든 즉시 원격 지원', icon: Headphones, highlight: false },
  ];

  const testimonials = [
    '집보다 더 큰 화면으로 영화 보니까 너무 좋았어요.',
    '넷플릭스 되니까 배달 시켜 먹으며 놀기 좋아요.',
    '객실에서 유튜브로 음악도 듣고 영화도 봤어요.',
    '디즈니+ 때문에 가족 여행지로 선택했어요.',
    '이 호텔은 TV가 진짜 좋다고 친구들한테 추천했어요.',
  ];

  const ottOptions = [
    { id: 'netflix', name: 'Netflix', bg: 'from-red-600 to-red-700', label: 'NETFLIX', sub: '지금 인기있는 영화' },
    { id: 'disney', name: 'Disney+', bg: 'from-blue-600 to-blue-700', label: 'DISNEY+', sub: 'Marvel · Star Wars · Pixar' },
    { id: 'youtube', name: 'YouTube', bg: 'from-red-500 to-red-600', label: 'YOUTUBE', sub: '수백만 개의 영상' },
    { id: 'prime', name: 'Prime', bg: 'from-blue-400 to-blue-500', label: 'PRIME VIDEO', sub: '영화 · 드라마 · 다큐' },
    { id: 'tving', name: 'Tving', bg: 'from-purple-600 to-purple-700', label: 'TVING', sub: 'K-드라마 · K-예능' },
    { id: 'wavve', name: 'Wavve', bg: 'from-green-600 to-green-700', label: 'WAVVE', sub: '방송 · 영화 · 라이브' },
  ];

  const caseStudies = [
    { type: '호텔', count: '350+', desc: '전국 호텔 도입' },
    { type: '모텔', count: '280+', desc: '모텔 체인점 도입' },
    { type: '리조트', count: '120+', desc: '리조트·펜션 도입' },
    { type: '레지던스', count: '50+', desc: '장기숙박 시설 도입' },
  ];

  return (
    <>
      <div id="particles" className="fixed inset-0 overflow-hidden pointer-events-none z-0" />
      <main>
        <Helmet>
          <title>메타코스모스 | 호텔·모텔 통합 OTT</title>
          <meta
            name="description"
            content="(주)메타코스모스. 호텔·모텔 객실 TV에서 넷플릭스·디즈니+·유튜브 등 7종 OTT를 통합 제공. 4K 셋톱 무상임대, 자동 로그아웃, 24시간 원격 A/S, 월 1만원대."
          />
          <link rel="canonical" href={window.location.origin + '/'} />
          <meta property="og:type" content="website" />
          <meta property="og:site_name" content="메타코스모스" />
          <meta property="og:title" content="메타코스모스 | 호텔·모텔 통합 OTT" />
          <meta
            property="og:description"
            content="투숙객이 먼저 찾는 객실. 넷플릭스부터 유튜브까지 월 1만원대로. 4K 셋톱 무상임대·자동 로그아웃·24시간 원격 A/S."
          />
          <meta property="og:url" content={window.location.href} />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="메타코스모스 | 호텔·모텔 통합 OTT" />
          <meta
            name="twitter:description"
            content="넷플릭스·디즈니+·유튜브 등 7종 OTT, 월 1만원대. 무료 상담 1833-8285"
          />
          <script type="application/ld+json">
            {JSON.stringify(
              {
                '@context': 'https://schema.org',
                '@graph': [
                  {
                    '@type': 'Organization',
                    '@id': window.location.origin + '/#organization',
                    name: '(주)메타코스모스',
                    url: window.location.origin,
                    email: 'ceometacosmos@gmail.com',
                    telephone: '1833-8285',
                    address: {
                      '@type': 'PostalAddress',
                      streetAddress: '항동 96-5 구로에이스캠프 B122호',
                      addressLocality: '구로구',
                      addressRegion: '서울',
                      addressCountry: 'KR',
                    },
                  },
                  {
                    '@type': 'WebSite',
                    '@id': window.location.origin + '/#website',
                    url: window.location.origin + '/',
                    name: '메타코스모스',
                    publisher: { '@id': window.location.origin + '/#organization' },
                    inLanguage: 'ko-KR',
                  },
                  {
                    '@type': 'Service',
                    name: '호텔·모텔 통합 OTT 서비스',
                    provider: { '@id': window.location.origin + '/#organization' },
                    serviceType: 'B2B 통합 OTT 서비스',
                    areaServed: 'KR',
                    audience: {
                      '@type': 'Audience',
                      audienceType: '호텔, 모텔, 리조트, 레지던스 등 숙박업소',
                    },
                  },
                ],
              },
              null,
              0
            )}
          </script>
        </Helmet>
        <section className="relative min-h-screen pt-24 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-900" />
          <ImgWithFallback
            name="hero-bg"
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-40"
            fallback={<></>}
          />
          <div className="absolute inset-0 bg-slate-900/60" />
          <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute top-40 right-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
          <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/50 mb-6 text-cyan-300 text-sm font-semibold"
            >
              <TrendingUp size={16} />
              전국 800여 곳, 월 150개소 이상 가입 급증!
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            >
              투숙객이 먼저 찾는 객실
              <br />
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-amber-400 bg-clip-text text-transparent">
                넷플릭스부터 유튜브까지
              </span>
              <br />
              월 1만 원대로 완성하세요
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-xl text-slate-300 mb-8 max-w-2xl mx-auto"
            >
              고객 계정 공유 걱정 없고, 설치비 0원, 24시간 원격 A/S까지.
              <br className="hidden sm:block" />
              호텔·모텔 객실 경쟁력을 한 단계 높이는 통합 OTT 솔루션입니다.
            </motion.p>
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(34, 211, 238, 0.6)' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => scrollToSection('contact')}
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-600 rounded-full text-lg font-bold glow-button animate-pulse-slow relative"
            >
              무료 방문 상담 신청하기 →
            </motion.button>
            <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }} className="absolute bottom-10 left-1/2 -translate-x-1/2 text-cyan-400">
              <ChevronDown size={32} />
            </motion.div>
          </div>
        </section>

        {/* 2 서비스 소개 */}
        <section id="service-intro" className="py-20 px-4 relative z-10 bg-gradient-to-b from-transparent via-slate-800/30 to-transparent">
          <div className="max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.8 }} className="text-center mb-14">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">서비스 소개</h2>
              <p className="text-slate-400 text-lg">호텔·숙박 시설을 위한 통합 OTT 시스템</p>
            </motion.div>
            <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
              <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="order-2 lg:order-1">
                <h3 className="text-xl font-bold text-cyan-400 mb-4 flex items-center gap-2"><Tv size={22} /> 호텔 통합 OTT 시스템</h3>
                <p className="text-slate-300 mb-6">객실 TV 한 대로 넷플릭스, 디즈니+, 유튜브, 프라임비디오 등 인기 OTT를 모두 제공합니다. 별도 구독 없이 투숙객이 바로 시청할 수 있습니다.</p>
                <div className="flex flex-wrap gap-3">
                  {[
                    { name: '넷플릭스', bg: 'from-red-600 to-red-700' },
                    { name: '디즈니+', bg: 'from-blue-600 to-blue-700' },
                    { name: '유튜브', bg: 'from-red-500 to-red-600' },
                    { name: '프라임비디오', bg: 'from-blue-400 to-blue-500' },
                  ].map((ott, i) => (
                    <motion.div key={i} whileHover={{ scale: 1.05 }} className={`px-4 py-2 rounded-lg bg-gradient-to-r ${ott.bg} text-white text-sm font-semibold shadow-lg`}>
                      {ott.name}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="order-1 lg:order-2">
                <div className="aspect-video rounded-2xl bg-slate-800/80 border border-cyan-500/30 overflow-hidden flex items-center justify-center">
                  <ImgWithFallback
                    name="service-tv"
                    alt="호텔 통합 OTT 객실 TV 화면"
                    className="w-full h-full object-cover"
                    fallback={
                      <div className="text-center p-6">
                        <Tv className="mx-auto text-cyan-400/80 mb-3" size={80} />
                        <p className="text-slate-400 text-sm">객실 TV 화면 예시</p>
                        <p className="text-slate-500 text-xs mt-1">리모컨 하나로 OTT 전환</p>
                      </div>
                    }
                  />
                </div>
              </motion.div>
            </div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: Tv, title: '객실 TV OTT 서비스', desc: '객실 TV에서 넷플릭스·디즈니+ 등 7종 OTT를 하나의 리모컨으로 이용. 설치비 없이 바로 시청 가능.', color: 'cyan' },
                { icon: Smartphone, title: '스마트폰 캐스팅', desc: '투숙객이 스마트폰 화면을 객실 TV로 전송해 개인 콘텐츠도 대형 화면으로 감상.', color: 'blue' },
                { icon: Shield, title: '자동 로그아웃', desc: '체크아웃 시 시청 이력·계정 정보 자동 삭제로 개인정보 보호 및 보안 강화.', color: 'green' },
                { icon: Megaphone, title: '호텔 광고', desc: '메인 화면에 호텔 공지·프로모션·룸서비스 안내를 노출해 부가 매출에 기여.', color: 'amber' },
              ].map((item, idx) => (
                <TiltCard key={idx}>
                  <div className="h-full p-5 rounded-xl bg-slate-800/80 border border-cyan-500/30 hover:border-cyan-500/50 transition-colors">
                    <item.icon className={`text-cyan-400 mb-3`} size={28} />
                    <h4 className="font-bold text-slate-200 mb-2">{item.title}</h4>
                    <p className="text-sm text-slate-400">{item.desc}</p>
                  </div>
                </TiltCard>
              ))}
            </motion.div>
          </div>
        </section>

        {/* 3 도입 효과 */}
        <section id="effects" className="py-20 px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.8 }} className="text-center mb-14">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">도입 효과</h2>
              <p className="text-slate-400 text-lg">통합 OTT 도입으로 기대할 수 있는 비즈니스 효과입니다</p>
            </motion.div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Smile, title: '고객 만족도 증가', desc: '"넷플릭스 되는 객실"로 예약·재방문이 늘고, 투숙객 만족도와 리뷰 점수가 상승합니다.', gradient: 'from-cyan-500/20 to-blue-500/20', border: 'border-cyan-500/40', img: 'effect1.jpg' },
                { icon: BarChart3, title: '객실 경쟁력 강화', desc: '같은 가격대에서 OTT 제공 숙소는 차별화되어 예약률과 객실 단가 경쟁력이 높아집니다.', gradient: 'from-blue-500/20 to-purple-500/20', border: 'border-blue-500/40', img: 'effect2.jpg' },
                { icon: Wallet, title: '부가 매출 창출', desc: '객실 체류 시간 증가에 따라 룸서비스·미니바·조식 이용 등 부가 매출 증대가 기대됩니다.', gradient: 'from-amber-500/20 to-orange-500/20', border: 'border-amber-500/40', img: 'effect3.jpg' },
                { icon: DollarSign, title: '케이블 비용 절감', desc: '기존 케이블/IPTV 대비 월 사용료를 크게 절감하면서 더 다양한 콘텐츠를 제공할 수 있습니다.', gradient: 'from-green-500/20 to-emerald-500/20', border: 'border-green-500/40', img: 'effect4.jpg' },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  whileHover={{ y: -6 }}
                >
                  <div className={`h-full rounded-xl border ${item.border} hover:shadow-xl transition-shadow overflow-hidden`}>
                    <div className="h-32 bg-slate-800/80 relative">
                      <ImgWithFallback
                        name={item.img.replace(/\.[a-z]+$/i, '')}
                        alt={item.title}
                        className="w-full h-full object-cover opacity-80"
                        fallback={<div className={`w-full h-full bg-gradient-to-br ${item.gradient} flex items-center justify-center`}><item.icon className="text-cyan-400" size={40} /></div>}
                      />
                    </div>
                    <div className={`p-6 bg-gradient-to-br ${item.gradient}`}>
                      <item.icon className="text-cyan-400 mb-2" size={28} />
                      <h4 className="font-bold text-slate-200 mb-2">{item.title}</h4>
                      <p className="text-sm text-slate-400">{item.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 4 적용 사례 */}
        <section id="cases" className="py-20 px-4 relative z-10 bg-gradient-to-b from-transparent via-slate-800/30 to-transparent">
          <div className="max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.8 }} className="text-center mb-14">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">적용 사례</h2>
              <p className="text-slate-400 text-lg">다양한 업종에서 통합 OTT를 도입·운영 중입니다</p>
            </motion.div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {[
                { icon: Building2, name: '호텔', desc: '특급·관광·비즈니스 호텔 객실', count: '350+', img: 'case-hotel.jpg' },
                { icon: Home, name: '모텔', desc: '모텔·찜질방 등 숙박 시설', count: '280+', img: 'case-motel.jpg' },
                { icon: TreePine, name: '리조트', desc: '리조트·펜션·민박', count: '120+', img: 'case-resort.jpg' },
                { icon: Building, name: '레지던스', desc: '장기숙박·레지던스 시설', count: '50+', img: 'case-residence.jpg' },
                { icon: Stethoscope, name: '병원', desc: '입원실·요양병원 등', count: '도입 확대', img: 'case-hospital.jpg' },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.08, duration: 0.4 }}
                  whileHover={{ y: -4 }}
                  className="rounded-xl bg-slate-800/80 border border-cyan-500/30 hover:border-cyan-500/50 text-center transition-colors overflow-hidden"
                >
                  <div className="h-28 bg-slate-700/50 relative">
                    <ImgWithFallback
                      name={item.img.replace(/\.[a-z]+$/i, '')}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      fallback={<div className="w-full h-full flex items-center justify-center"><item.icon className="text-cyan-400/70" size={48} /></div>}
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold text-slate-200 mb-1">{item.name}</h4>
                    <p className="text-xs text-slate-400 mb-2">{item.desc}</p>
                    <span className="text-sm font-semibold text-cyan-400">{item.count}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="service" className="py-20 px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.8 }} className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">기존 방식의 문제점과 해결책</h2>
              <p className="text-slate-400 text-lg">고비용 구축에서 저비용 운영으로 전환하세요</p>
            </motion.div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-red-400 mb-6 flex items-center gap-2"><AlertCircle size={20} /> 기존 방식의 문제점</h3>
                {painPoints.map((point, idx) => (
                  <motion.div key={idx} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }}>
                    <TiltCard>
                      <div className="p-5 rounded-xl bg-slate-800/80 border border-red-500/30 hover:border-red-500/50 transition-colors">
                        <div className="flex gap-3 items-start">
                          <point.icon className="text-red-400 flex-shrink-0 mt-0.5" size={24} />
                          <div>
                            <h4 className="font-bold text-slate-200">{point.title}</h4>
                            <p className="text-sm text-slate-400">{point.desc}</p>
                          </div>
                        </div>
                      </div>
                    </TiltCard>
                  </motion.div>
                ))}
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-cyan-400 mb-6 flex items-center gap-2"><Check size={20} /> 메타코스모스의 해결책</h3>
                {solutions.map((sol, idx) => (
                  <motion.div key={idx} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }}>
                    <TiltCard>
                      <div className={`p-5 rounded-xl border transition-colors ${sol.highlight ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-cyan-500/60 shadow-lg shadow-cyan-500/20' : 'bg-slate-800/80 border-cyan-500/30 hover:border-cyan-500/50'}`}>
                        <div className="flex gap-3 items-start">
                          <sol.icon className="text-cyan-400 flex-shrink-0 mt-0.5" size={24} />
                          <div>
                            <h4 className="font-bold text-slate-200">{sol.title}</h4>
                            <p className="text-sm text-slate-400">{sol.desc}</p>
                          </div>
                        </div>
                      </div>
                    </TiltCard>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 px-4 relative z-10 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent">
          <div className="max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">손으로 체험하는 TV 화면</h2>
              <p className="text-slate-400 text-lg">아이콘을 클릭하면 TV 화면이 바뀝니다. 버튼 하나로 나만의 영화관이 펼쳐집니다.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="relative mx-auto w-full max-w-2xl">
              <div className="relative bg-gradient-to-b from-slate-800 to-black rounded-3xl shadow-2xl overflow-hidden border-8 border-slate-700">
                <div className="aspect-video bg-black relative overflow-hidden">
                  {ottOptions.map((ott) => activeOTT === ott.id && (
                    <motion.div
                      key={ott.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`w-full h-full bg-gradient-to-br ${ott.bg} flex items-center justify-center`}
                    >
                      <div className="text-white text-center">
                        <Tv className="mx-auto mb-4" size={64} />
                        <div className="text-3xl md:text-4xl font-bold">{ott.label}</div>
                        <div className="text-base md:text-lg mt-2 opacity-90">{ott.sub}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="bg-slate-900 px-4 py-6 flex justify-center gap-2 overflow-x-auto">
                  <div className="flex gap-3 md:gap-4 flex-wrap justify-center">
                    {ottOptions.map((ott) => (
                      <motion.button
                        key={ott.id}
                        onClick={() => setActiveOTT(ott.id)}
                        whileHover={{ scale: 1.2, y: -8 }}
                        whileTap={{ scale: 0.95 }}
                        className={`flex items-center justify-center rounded-xl transition-all ${activeOTT === ott.id ? 'w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br ' + ott.bg + ' shadow-lg ring-2 ring-white/30' : 'w-12 h-12 md:w-14 md:h-14 bg-slate-700 hover:bg-slate-600'}`}
                      >
                        <Tv size={24} className={activeOTT === ott.id ? 'text-white' : 'text-slate-300'} />
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-20 px-4 relative z-10 overflow-hidden">
          <div className="max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">4K UHD 셋톱박스 & 전용 리모컨</h2>
              <p className="text-slate-400 text-lg">설치비 0원, 무상 임대. 스크롤에 따라 살짝 떠다니는 기기처럼 체감해보세요.</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16"
            >
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="w-48 h-32 md:w-56 md:h-40 rounded-2xl border-2 border-cyan-500/40 shadow-2xl shadow-cyan-500/20 overflow-hidden bg-slate-800/80 flex items-center justify-center"
              >
                <ImgWithFallback
                  name="setop"
                  alt="4K UHD 셋톱박스"
                  className="w-full h-full object-contain p-2"
                  fallback={
                    <div className="text-center p-4">
                      <Package className="mx-auto text-cyan-400 mb-2" size={48} />
                      <span className="text-sm font-bold text-cyan-300">4K UHD 셋톱박스</span>
                    </div>
                  }
                />
              </motion.div>
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                className="w-32 h-40 md:w-36 md:h-48 rounded-2xl border-2 border-amber-500/40 shadow-2xl shadow-amber-500/10 overflow-hidden bg-slate-800/80 flex items-center justify-center"
              >
                <ImgWithFallback
                  name="remote"
                  alt="전용 리모컨"
                  className="w-full h-full object-contain p-2"
                  fallback={
                    <div className="text-center p-4">
                      <Tv className="mx-auto text-amber-400 mb-2" size={32} />
                      <span className="text-xs font-bold text-amber-300">전용 리모컨</span>
                    </div>
                  }
                />
              </motion.div>
            </motion.div>
          </div>
        </section>

        <section id="roi" className="py-20 px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">투자 대비 수익 계산기</h2>
              <p className="text-slate-400 text-lg">객실 수를 조절하면 막대 그래프가 실시간으로 변합니다. 비용 절감 효과를 확인하세요.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6 md:p-8 border border-cyan-500/30">
              <div className="mb-8">
                <div className="flex justify-between items-center mb-3">
                  <label className="text-lg font-bold">객실 수</label>
                  <span className="text-3xl font-bold text-cyan-400">{roomCount}실</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={roomCount}
                  onChange={(e) => setRoomCount(Number(e.target.value))}
                  className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>1실</span>
                  <span>50실</span>
                  <span>100실</span>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-red-400">기존 방식 직접 구축 시</h3>
                  <div className="h-56 bg-slate-800/50 rounded-xl p-4 flex flex-col justify-end">
                    <motion.div
                      layout
                      animate={{ height: `${Math.min(100, (costs.legacy / maxBar) * 100)}%` }}
                      transition={{ type: 'spring', stiffness: 80, damping: 20 }}
                      className="w-full bg-gradient-to-t from-red-600 to-red-400 rounded-t-lg min-h-[8%]"
                    />
                  </div>
                  <div className="text-2xl font-bold text-red-400">₩{(costs.legacy / 10000).toFixed(0)}만 <span className="text-sm font-normal text-slate-400">/월</span></div>
                  <p className="text-sm text-slate-400">실당 약 25만원 수준 가정</p>
                </div>
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-cyan-400">통합 OTT 도입 시</h3>
                  <div className="h-56 bg-slate-800/50 rounded-xl p-4 flex flex-col justify-end">
                    <motion.div
                      layout
                      animate={{ height: `${Math.min(100, (costs.solutionMonthly / maxBar) * 100)}%` }}
                      transition={{ type: 'spring', stiffness: 80, damping: 20 }}
                      className="w-full bg-gradient-to-t from-cyan-500 to-cyan-400 rounded-t-lg min-h-[8%]"
                    />
                  </div>
                  <div className="text-2xl font-bold text-cyan-400">₩{(costs.solutionMonthly / 10000).toFixed(0)}만 <span className="text-sm font-normal text-slate-400">/월</span></div>
                  <p className="text-sm text-slate-400">50실 이상 실당 13,200원</p>
                </div>
              </div>
              <motion.div
                layout
                className="mt-8 p-6 bg-gradient-to-r from-green-500/10 to-cyan-500/10 rounded-xl border border-green-500/50 text-center"
              >
                <div className="text-sm text-slate-400 mb-1">월간 절감액</div>
                <div className="text-4xl md:text-5xl font-bold text-green-400">₩{(costs.savings / 10000).toFixed(0)}만</div>
                <div className="text-lg text-green-300 font-semibold">기존 대비 {costs.savingsPercent}% 절감</div>
              </motion.div>
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="p-4 rounded-lg glass text-center border border-amber-500/30">
                  <div className="text-xs text-slate-400 mb-1">연간 절감</div>
                  <div className="text-xl font-bold text-amber-400">₩{(costs.savings * 12 / 10000).toFixed(0)}만</div>
                </div>
                <div className="p-4 rounded-lg glass text-center border border-purple-500/30">
                  <div className="text-xs text-slate-400 mb-1">2년 절감</div>
                  <div className="text-xl font-bold text-purple-400">₩{(costs.savings * 24 / 10000).toFixed(0)}만</div>
                </div>
                <div className="p-4 rounded-lg glass text-center border border-pink-500/30">
                  <div className="text-xs text-slate-400 mb-1">3년 절감</div>
                  <div className="text-xl font-bold text-pink-400">₩{(costs.savings * 36 / 10000).toFixed(0)}만</div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-20 px-4 relative z-10 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent">
          <div className="max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">다양한 업종에서 도입 중</h2>
              <p className="text-slate-400 text-lg">호텔·모텔·리조트·펜션 등 800여 곳에서 신뢰합니다</p>
            </motion.div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { ...caseStudies[0], img: 'case-hotel.jpg' },
                { ...caseStudies[1], img: 'case-motel.jpg' },
                { ...caseStudies[2], img: 'case-resort.jpg' },
                { ...caseStudies[3], img: 'case-residence.jpg' },
              ].map((study, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(34, 211, 238, 0.2)' }}
                  className="rounded-xl glass border border-cyan-500/30 text-center hover:border-cyan-400/60 transition-all overflow-hidden"
                >
                  <div className="h-28 bg-slate-700/50">
                    <ImgWithFallback
                      name={study.img.replace(/\.[a-z]+$/i, '')}
                      alt={study.type}
                      className="w-full h-full object-cover"
                      fallback={<div className="w-full h-full flex items-center justify-center text-3xl font-bold text-cyan-400/80">{study.count}</div>}
                    />
                  </div>
                  <div className="p-4">
                    <div className="text-2xl font-bold text-cyan-400 mb-1">{study.count}</div>
                    <h3 className="text-lg font-bold text-slate-200 mb-1">{study.type}</h3>
                    <p className="text-sm text-slate-400">{study.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="testimonials" className="py-20 px-4 relative z-10 overflow-hidden">
          <ImgWithFallback
            name="testimonial-bg"
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-20"
            fallback={<></>}
          />
          <div className="absolute inset-0 bg-slate-900/80" />
          <div className="max-w-6xl mx-auto relative z-10">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">투숙객 생생한 후기</h2>
              <p className="text-slate-400 text-lg">통합 OTT를 도입한 숙소에서의 반응입니다</p>
            </motion.div>
            <div className="relative overflow-hidden rounded-xl border border-cyan-500/20 bg-slate-800/50 py-6">
              <motion.div
                className="flex gap-6 px-4"
                animate={{ x: ['0%', '-100%'] }}
                transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                style={{ width: 'max-content' }}
              >
                {[...testimonials, ...testimonials].map((item, idx) => (
                  <div key={idx} className="flex-shrink-0 w-72 md:w-80 p-5 bg-slate-700/50 rounded-xl border border-cyan-500/30">
                    <div className="flex gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-amber-400">★</span>
                      ))}
                    </div>
                    <p className="text-slate-300 italic">"{item}"</p>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        <section id="contact" className="py-20 px-4 relative z-10 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent">
          <div className="max-w-2xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6 md:p-10 border border-cyan-500/30">
              <h2 className="text-3xl md:text-4xl font-bold mb-2 text-center">무료 상담 신청하기</h2>
              <p className="text-slate-400 text-center mb-8">상호명, 객실 수, 연락처만 남겨주시면 빠르게 연락드립니다.</p>
              <form onSubmit={handleFormSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold mb-2">상호명</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-cyan-500/30 rounded-lg focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
                    placeholder="예: 서울 OO 호텔"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">객실 수</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.rooms}
                    onChange={(e) => setFormData({ ...formData, rooms: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-cyan-500/30 rounded-lg focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
                    placeholder="예: 50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">연락처</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-cyan-500/30 rounded-lg focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
                    placeholder="010-0000-0000"
                  />
                </div>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(34, 211, 238, 0.5)' }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-600 rounded-xl font-bold text-lg glow-button"
                >
                  상담 신청하기
                </motion.button>
                <p className="text-xs text-slate-400 text-center">(주)메타코스모스에서 빠르게 연락드리겠습니다.</p>
              </form>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-900 border-t border-cyan-500/20 py-12 px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={METACOSMOS_LOGO_DATA_URI}
                  alt="METACOSMOS"
                  className="h-10 w-auto rounded-sm"
                />
                <div className="leading-tight">
                  <div className="text-sm font-bold text-slate-100">(주)메타코스모스</div>
                  <div className="text-xs text-slate-400">호텔·모텔 통합 OTT</div>
                </div>
              </div>
              <p className="text-slate-400 text-sm">호텔·모텔 통합 OTT 솔루션으로 객실 경쟁력을 강화하세요.</p>
            </div>
            <div>
              <h4 className="font-bold mb-3">연락처</h4>
              <div className="space-y-2 text-sm text-slate-400">
                <a href="tel:18338285" className="flex gap-2 items-center hover:text-cyan-400 transition-colors"><Phone size={16} /> 1833-8285</a>
                <a href="mailto:ceometacosmos@gmail.com" className="flex gap-2 items-center hover:text-cyan-400 transition-colors"><Mail size={16} /> ceometacosmos@gmail.com</a>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-3">주소</h4>
              <div className="flex gap-2 items-start text-sm text-slate-400">
                <MapPin size={16} className="flex-shrink-0 mt-0.5" />
                <span>서울시 구로구 항동 96-5 구로에이스캠프 B122호</span>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-3">사업자</h4>
              <p className="text-sm text-slate-400">(주)메타코스모스</p>
              <p className="text-sm text-slate-400">호텔·모텔 통합 OTT</p>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-sm text-slate-500">
            © 2026 (주)메타코스모스. All rights reserved.
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
            onClick={() => setShowSuccessModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 text-center border border-cyan-500/50 max-w-sm"
            >
              <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 0.5 }} className="inline-block mb-4 p-4 bg-green-500/20 rounded-full">
                <Check size={48} className="text-green-400" />
              </motion.div>
              <h3 className="text-xl font-bold mb-2">상담 신청이 완료되었습니다</h3>
              <p className="text-slate-400 mb-4 whitespace-pre-line">
                감사합니다. 상담신청이 완료되었습니다. 담당자가 배정되는데로 빠른시간 안에 연락드리겠습니다. 감사합니다.
              </p>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowSuccessModal(false)} className="px-6 py-2 bg-cyan-500 rounded-lg font-semibold hover:bg-cyan-600">
                닫기
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed bottom-4 left-4 z-50 space-y-2 max-w-sm">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: -60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{ duration: 0.3 }}
              className="glass border border-green-500/50 rounded-lg p-4 text-sm text-slate-200 flex gap-2 items-start"
            >
              <Check className="text-green-400 flex-shrink-0 mt-0.5" size={18} />
              <p>{toast.message}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
};

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <AuthProvider>
          <BlogProvider>
            <ConsultationProvider>
              <Routes>
              <Route element={<Layout />}>
                <Route index element={<HomeContent />} />
                <Route path="qna" element={<QNA />} />
                <Route path="blog" element={<Blog />} />
                <Route path="blog/:id" element={<BlogPost />} />
                <Route path="admin" element={<Admin />} />
              </Route>
            </Routes>
            </ConsultationProvider>
          </BlogProvider>
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
