import React, { createContext, useContext, useState, useEffect } from 'react';

const STORAGE_KEY = 'metacosmos_consultations';
const STATUS = { REQUEST: '신청', IN_PROGRESS: '진행중', DONE: '완료' };

/** 관리자 화면 확인용 샘플 (저장소가 비어 있을 때만 자동 삽입) */
const consultationSamples = [
  {
    id: 'sample-c1',
    name: '서울 강남 OO 호텔',
    rooms: '42',
    phone: '010-2345-6789',
    status: STATUS.REQUEST,
    assignee: '',
    createdAt: '2026-03-16',
    createdAtTime: '2026-03-16T09:30:00.000Z',
  },
  {
    id: 'sample-c2',
    name: '부산 해운대 OO 모텔',
    rooms: '28',
    phone: '010-8765-4321',
    status: STATUS.IN_PROGRESS,
    assignee: '김영업',
    createdAt: '2026-03-15',
    createdAtTime: '2026-03-15T14:00:00.000Z',
  },
  {
    id: 'sample-c3',
    name: '제주 OO 리조트',
    rooms: '120',
    phone: '064-123-4567',
    status: STATUS.DONE,
    assignee: '이상담',
    createdAt: '2026-03-10',
    createdAtTime: '2026-03-10T11:20:00.000Z',
  },
];

const loadConsultations = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw != null && raw !== '') {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      if (Array.isArray(parsed) && parsed.length === 0) return [];
    }
  } catch (_) {}
  localStorage.setItem(STORAGE_KEY, JSON.stringify(consultationSamples));
  return consultationSamples;
};

const saveConsultations = (list) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
};

const ConsultationContext = createContext(null);

export const ConsultationProvider = ({ children }) => {
  const [consultations, setConsultations] = useState(loadConsultations);

  useEffect(() => {
    saveConsultations(consultations);
  }, [consultations]);

  const addConsultation = (data) => {
    const id = String(Date.now());
    const item = {
      id,
      name: data.name || '',
      rooms: data.rooms || '',
      phone: data.phone || '',
      status: STATUS.REQUEST,
      assignee: '',
      createdAt: new Date().toISOString().slice(0, 10),
      createdAtTime: new Date().toISOString(),
    };
    setConsultations((prev) => [item, ...prev]);
    return id;
  };

  const updateConsultation = (id, data) => {
    setConsultations((prev) =>
      prev.map((c) => (c.id === String(id) ? { ...c, ...data } : c))
    );
  };

  const deleteConsultation = (id) => {
    setConsultations((prev) => prev.filter((c) => c.id !== String(id)));
  };

  const getByStatus = (status) =>
    status ? consultations.filter((c) => c.status === status) : consultations;

  /** 이미 있는 id는 건너뛰고 샘플만 앞에 추가 (데모·확인용) */
  const addSampleConsultations = () => {
    setConsultations((prev) => {
      const ids = new Set(prev.map((c) => c.id));
      const toAdd = consultationSamples.filter((s) => !ids.has(s.id));
      if (toAdd.length === 0) return prev;
      return [...toAdd, ...prev];
    });
  };

  return (
    <ConsultationContext.Provider
      value={{
        consultations,
        addConsultation,
        updateConsultation,
        deleteConsultation,
        getByStatus,
        addSampleConsultations,
        STATUS,
      }}
    >
      {children}
    </ConsultationContext.Provider>
  );
};

export const useConsultation = () => {
  const ctx = useContext(ConsultationContext);
  if (!ctx) throw new Error('useConsultation must be used within ConsultationProvider');
  return ctx;
};
