import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useBlog } from '../contexts/BlogContext';
import { useConsultation } from '../contexts/ConsultationContext';
import { motion } from 'framer-motion';
import { LogIn, LogOut, Plus, Pencil, Trash2, FileText, Phone, User } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const emptyPost = { title: '', excerpt: '', image: '', body: '' };

export default function Admin() {
  const { isAdmin, login, logout } = useAuth();
  const { posts, addPost, updatePost, deletePost } = useBlog();
  const { consultations, updateConsultation, deleteConsultation, getByStatus, addSampleConsultations, STATUS } =
    useConsultation();
  const [id, setId] = useState('');
  const [consultationFilter, setConsultationFilter] = useState(''); // '' = 전체
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyPost);
  const imageFileRef = useRef(null);
  const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

  const handleImageFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      window.alert('이미지 파일만 선택할 수 있습니다.');
      e.target.value = '';
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      window.alert('이미지는 2MB 이하로 선택해 주세요. (용량이 크면 localStorage 한도에 걸릴 수 있습니다.)');
      e.target.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setForm((f) => ({ ...f, image: typeof reader.result === 'string' ? reader.result : '' }));
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setForm((f) => ({ ...f, image: '' }));
    if (imageFileRef.current) imageFileRef.current.value = '';
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError(false);
    if (login(id, password)) return;
    setLoginError(true);
  };

  const handleLogout = () => {
    logout();
    setEditingId(null);
    setForm(emptyPost);
  };

  const startAdd = () => {
    setEditingId('new');
    setForm(emptyPost);
    if (imageFileRef.current) imageFileRef.current.value = '';
  };

  const startEdit = (post) => {
    setEditingId(post.id);
    setForm({ title: post.title, excerpt: post.excerpt || '', image: post.image || '', body: post.body || '' });
    if (imageFileRef.current) imageFileRef.current.value = '';
  };

  const savePost = (e) => {
    e.preventDefault();
    if (editingId === 'new') {
      addPost(form);
      setForm(emptyPost);
      setEditingId(null);
    } else {
      updatePost(editingId, form);
      setEditingId(null);
      setForm(emptyPost);
    }
  };

  const removePost = (postId) => {
    if (window.confirm('이 글을 삭제할까요?')) deletePost(postId);
    setEditingId(null);
  };

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-20">
        <Helmet>
          <title>관리자 | 메타코스모스</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-slate-800/80 border border-cyan-500/30 p-8"
        >
          <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <LogIn className="text-cyan-400" size={28} />
            관리자 로그인
          </h1>
          <p className="text-slate-400 text-sm mb-6">최고관리자만 블로그를 관리할 수 있습니다.</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">아이디</label>
              <input
                type="text"
                value={id}
                onChange={(e) => setId(e.target.value)}
                className="w-full px-4 py-3 bg-slate-700/50 border border-cyan-500/30 rounded-lg focus:outline-none focus:border-cyan-400"
                placeholder="admin"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">비밀번호</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-700/50 border border-cyan-500/30 rounded-lg focus:outline-none focus:border-cyan-400"
                placeholder="••••••"
              />
            </div>
            {loginError && <p className="text-red-400 text-sm">아이디 또는 비밀번호가 올바르지 않습니다.</p>}
            <button type="submit" className="w-full py-3 bg-cyan-500 hover:bg-cyan-600 rounded-lg font-semibold transition-colors">
              로그인
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <Helmet>
        <title>블로그 관리 | 메타코스모스</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FileText className="text-cyan-400" size={28} />
          블로그 관리
        </h1>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={startAdd}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-lg font-medium transition-colors"
          >
            <Plus size={18} /> 새 글
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium transition-colors"
          >
            <LogOut size={18} /> 로그아웃
          </button>
        </div>
      </div>

      {editingId ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-slate-800/80 border border-cyan-500/30 p-6 mb-8"
        >
          <h2 className="text-lg font-bold mb-4">{editingId === 'new' ? '새 글 작성' : '글 수정'}</h2>
          <form onSubmit={savePost} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">제목</label>
              <input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                className="w-full px-4 py-2 bg-slate-700/50 border border-cyan-500/30 rounded-lg focus:outline-none focus:border-cyan-400"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">요약</label>
              <input
                value={form.excerpt}
                onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
                className="w-full px-4 py-2 bg-slate-700/50 border border-cyan-500/30 rounded-lg focus:outline-none focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">대표 이미지 (파일 첨부)</label>
              <input
                ref={imageFileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleImageFile}
                className="block w-full text-sm text-slate-300 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-cyan-600 file:text-white file:font-medium hover:file:bg-cyan-500"
              />
              <p className="text-xs text-slate-500 mt-1">JPG·PNG·WebP·GIF, 2MB 이하 권장. 첨부 시 글에 그대로 저장됩니다.</p>
              {form.image ? (
                <div className="mt-3 flex flex-wrap items-start gap-3">
                  <div className="rounded-lg border border-cyan-500/30 overflow-hidden bg-slate-900 max-w-xs">
                    <img src={form.image} alt="미리보기" className="max-h-40 w-auto object-contain" />
                  </div>
                  <button
                    type="button"
                    onClick={clearImage}
                    className="px-3 py-1.5 text-sm bg-slate-600 hover:bg-slate-500 rounded-lg text-slate-200"
                  >
                    이미지 제거
                  </button>
                </div>
              ) : null}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">본문</label>
              <textarea
                value={form.body}
                onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
                rows={6}
                className="w-full px-4 py-2 bg-slate-700/50 border border-cyan-500/30 rounded-lg focus:outline-none focus:border-cyan-400 resize-y"
              />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-lg font-medium">
                저장
              </button>
              <button type="button" onClick={() => { setEditingId(null); setForm(emptyPost); }} className="px-4 py-2 bg-slate-600 hover:bg-slate-500 rounded-lg font-medium">
                취소
              </button>
            </div>
          </form>
        </motion.div>
      ) : null}

      <ul className="space-y-3">
        {posts.map((post) => (
          <li key={post.id} className="flex items-center justify-between gap-4 p-4 rounded-xl bg-slate-800/80 border border-cyan-500/20">
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-slate-200 truncate">{post.title}</h3>
              <p className="text-sm text-slate-400">{post.createdAt}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Link to={`/blog/${post.id}`} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline text-sm">
                보기
              </Link>
              <button type="button" onClick={() => startEdit(post)} className="p-2 text-slate-400 hover:text-cyan-400">
                <Pencil size={18} />
              </button>
              <button type="button" onClick={() => removePost(post.id)} className="p-2 text-slate-400 hover:text-red-400">
                <Trash2 size={18} />
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* 상담 신청 관리 */}
      <section className="mt-16 pt-12 border-t border-slate-700">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Phone className="text-cyan-400" size={24} />
            상담 신청 관리
          </h2>
          <button
            type="button"
            onClick={() => addSampleConsultations()}
            className="px-3 py-1.5 text-sm rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 border border-cyan-500/30"
          >
            샘플 3건 추가
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            type="button"
            onClick={() => setConsultationFilter('')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${consultationFilter === '' ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-500/50' : 'bg-slate-700/50 text-slate-400 hover:bg-slate-600'}`}
          >
            전체 ({consultations.length})
          </button>
          {[STATUS.REQUEST, STATUS.IN_PROGRESS, STATUS.DONE].map((s) => {
            const list = getByStatus(s);
            return (
              <button
                key={s}
                type="button"
                onClick={() => setConsultationFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${consultationFilter === s ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-500/50' : 'bg-slate-700/50 text-slate-400 hover:bg-slate-600'}`}
              >
                {s} ({list.length})
              </button>
            );
          })}
        </div>
        <div className="space-y-3">
          {(consultationFilter ? getByStatus(consultationFilter) : consultations).map((c) => (
            <div
              key={c.id}
              className="p-4 rounded-xl bg-slate-800/80 border border-cyan-500/20 flex flex-wrap items-center gap-4"
            >
              <div className="min-w-0 flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-sm">
                <div>
                  <span className="text-slate-500">상호명</span>
                  <p className="font-medium text-slate-200 truncate">{c.name}</p>
                </div>
                <div>
                  <span className="text-slate-500">객실 수</span>
                  <p className="text-slate-200">{c.rooms}실</p>
                </div>
                <div>
                  <span className="text-slate-500">연락처</span>
                  <p className="text-slate-200">{c.phone}</p>
                </div>
                <div>
                  <span className="text-slate-500">신청일</span>
                  <p className="text-slate-400 text-xs">{c.createdAt}</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
                <select
                  value={c.status}
                  onChange={(e) => updateConsultation(c.id, { status: e.target.value })}
                  className="px-3 py-1.5 bg-slate-700 border border-cyan-500/30 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-cyan-400"
                >
                  <option value={STATUS.REQUEST}>{STATUS.REQUEST}</option>
                  <option value={STATUS.IN_PROGRESS}>{STATUS.IN_PROGRESS}</option>
                  <option value={STATUS.DONE}>{STATUS.DONE}</option>
                </select>
                <div className="flex items-center gap-1">
                  <User size={16} className="text-slate-500 flex-shrink-0" />
                  <input
                    type="text"
                    value={c.assignee || ''}
                    onChange={(e) => updateConsultation(c.id, { assignee: e.target.value })}
                    placeholder="담당자"
                    className="w-24 px-2 py-1.5 bg-slate-700/50 border border-cyan-500/30 rounded-lg text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => window.confirm('이 상담 신청을 삭제할까요?') && deleteConsultation(c.id)}
                  className="p-2 text-slate-400 hover:text-red-400 rounded-lg"
                  title="삭제"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
        {consultations.length === 0 && (
          <p className="text-slate-500 text-sm py-8 text-center">아직 상담 신청이 없습니다.</p>
        )}
      </section>
    </div>
  );
}
