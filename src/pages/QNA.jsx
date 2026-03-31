import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, FileDown } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const items = [
  {
    q: '통합 OTT 서비스는 어떤 서비스인가요?',
    a: '호텔·모텔 등 숙박 시설의 객실 TV에서 넷플릭스, 디즈니+, 유튜브 등 7종 OTT를 하나의 셋톱박스로 제공하는 통합 솔루션입니다. 설치비 없이 월 사용료만으로 투숙객이 바로 시청할 수 있습니다.',
  },
  {
    q: '설치 비용과 월 사용료는 어떻게 되나요?',
    a: '4K UHD 셋톱박스와 전용 리모컨은 무상 임대입니다. 월 사용료는 실당 15,000원(50실 이상 시 13,200원)이며, 기존 케이블/IPTV 대비 비용을 크게 절감할 수 있습니다.',
  },
  {
    q: '기존 TV를 그대로 사용할 수 있나요?',
    a: 'HDMI 포트가 있는 TV라면 별도 교체 없이 셋톱박스만 연결해 사용할 수 있습니다. 스마트TV가 아니어도 됩니다.',
  },
  {
    q: '투숙객 개인정보는 어떻게 보호되나요?',
    a: '체크아웃 시 시청 이력과 계정 정보가 자동으로 삭제됩니다. 개인 로그인 없이 객실에서 바로 OTT를 이용할 수 있어 보안이 유지됩니다.',
  },
  {
    q: 'A/S는 어떻게 받을 수 있나요?',
    a: '24시간 원격 A/S를 제공합니다. 전국 어디서든 문제 발생 시 원격으로 점검·조치가 가능하며, 필요 시 현장 방문도 지원합니다.',
  },
  {
    q: '계약 기간과 해지 조건은 어떻게 되나요?',
    a: '계약 조건은 상담을 통해 유연하게 조정 가능합니다. 해지 시 기기 반납 등 세부 사항은 계약서에 명시됩니다.',
  },
  {
    q: '상담 신청은 어떻게 하나요?',
    a: '홈페이지 하단의 무료 상담 신청 폼에 상호명, 객실 수, 연락처를 입력해 주시면 담당자가 빠르게 연락드립니다. 전화 1833-8285로도 문의 가능합니다.',
  },
];

export default function QNA() {
  const [openId, setOpenId] = useState(null);
  const canonical = window.location.origin + '/qna';

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 relative">
      <Helmet>
        <title>Q&A | 메타코스모스</title>
        <meta
          name="description"
          content="메타코스모스 통합 OTT Q&A. 설치 비용, 월 사용료, 자동 로그아웃, A/S 등 자주 묻는 질문을 확인하세요."
        />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content="Q&A | 메타코스모스" />
        <meta
          property="og:description"
          content="설치/비용/보안/A/S 등 자주 묻는 질문 7가지를 정리했습니다."
        />
        <meta property="og:url" content={canonical} />
        <script type="application/ld+json">
          {JSON.stringify(
            {
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: items.map((it) => ({
                '@type': 'Question',
                name: it.q,
                acceptedAnswer: { '@type': 'Answer', text: it.a },
              })),
            },
            null,
            0
          )}
        </script>
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center justify-center gap-2">
          <HelpCircle className="text-cyan-400" size={36} />
          자주 묻는 질문
        </h1>
        <p className="text-slate-400">통합 OTT 서비스에 대해 궁금한 점을 모았습니다.</p>
      </motion.div>
      <div className="space-y-3">
        {items.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="rounded-xl bg-slate-800/80 border border-cyan-500/20 overflow-hidden"
          >
            <button
              type="button"
              onClick={() => setOpenId(openId === idx ? null : idx)}
              className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left hover:bg-slate-700/50 transition-colors"
            >
              <span className="font-semibold text-slate-200">{item.q}</span>
              <motion.span
                animate={{ rotate: openId === idx ? 180 : 0 }}
                className="flex-shrink-0 text-cyan-400"
              >
                <ChevronDown size={20} />
              </motion.span>
            </button>
            <AnimatePresence>
              {openId === idx && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-4 pt-0 text-slate-400 text-sm border-t border-slate-700/80 pt-4">
                    {item.a}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
      <a
        href="/자료/meta_ott.pdf"
        download="meta_ott.pdf"
        title="서비스 설명서 다운"
        className="fixed bottom-4 md:bottom-5 right-3 md:right-4 z-50 h-10 md:h-12 px-3 md:px-4 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/40 flex items-center gap-1.5 md:gap-2 font-semibold text-xs md:text-sm hover:scale-105 hover:shadow-cyan-400/60 transition-all"
      >
        <FileDown size={18} className="md:w-5 md:h-5" />
        <span>설명서</span>
      </a>
    </div>
  );
}
