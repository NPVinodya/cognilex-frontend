'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Upload, Trash2, Eye, RefreshCw, FileText, Database,
  CheckCircle, AlertCircle, Loader2, X, BookOpen, Scale, ChevronRight
} from 'lucide-react';

type FileType = 'acts' | 'cases';

interface DocFile {
  filename: string;
  file_type: FileType;
  size_bytes: number;
  size_mb: number;
  uploaded_at: string;
}

interface DocList {
  acts: DocFile[];
  cases: DocFile[];
  total_acts: number;
  total_cases: number;
}

type ToastType = 'success' | 'error' | 'info';
interface Toast { id: number; message: string; type: ToastType; }

const RAG_BASE = process.env.NEXT_PUBLIC_RAG_URL || 'http://localhost:8001';

export default function RAGManagementPage() {
  const [docs, setDocs] = useState<DocList>({ acts: [], cases: [], total_acts: 0, total_cases: 0 });
  const [activeTab, setActiveTab] = useState<FileType>('acts');
  const [isDragging, setIsDragging] = useState(false);
  const [fileType, setFileType] = useState<FileType>('acts');
  const [uploading, setUploading] = useState(false);
  const [reindexing, setReindexing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [deleteModal, setDeleteModal] = useState<{ file: DocFile } | null>(null);
  const [deleting, setDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toastId = useRef(0);

  const addToast = (message: string, type: ToastType) => {
    const id = ++toastId.current;
    setToasts(p => [...p, { id, message, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 4000);
  };

  const fetchDocs = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch('/api/rag');
      if (!r.ok) throw new Error();
      setDocs(await r.json());
    } catch {
      addToast('Failed to load documents. Is the RAG server running?', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDocs(); }, [fetchDocs]);

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      addToast('Only PDF files are allowed.', 'error'); return;
    }
    if (file.size > 50 * 1024 * 1024) {
      addToast('File exceeds 50 MB limit.', 'error'); return;
    }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('file_type', fileType);
      const r = await fetch('/api/rag', { method: 'POST', body: fd });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || 'Upload failed.');
      addToast(`✓ "${file.name}" uploaded to ${fileType}.`, 'success');
      await fetchDocs();
    } catch (e: any) {
      addToast(e.message || 'Upload failed.', 'error');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async () => {
    if (!deleteModal) return;
    setDeleting(true);
    try {
      const { filename, file_type } = deleteModal.file;
      const r = await fetch(`/api/rag/documents/${file_type}/${encodeURIComponent(filename)}`, { method: 'DELETE' });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || 'Delete failed.');
      addToast(`✓ "${filename}" deleted.`, 'success');
      setDeleteModal(null);
      await fetchDocs();
    } catch (e: any) {
      addToast(e.message || 'Delete failed.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const handleReindex = async () => {
    setReindexing(true);
    addToast('Rebuilding RAG index… this may take 1–2 minutes.', 'info');
    try {
      const r = await fetch('/api/rag/reindex', { method: 'POST' });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || 'Reindex failed.');
      addToast('✓ RAG index rebuilt successfully.', 'success');
    } catch (e: any) {
      addToast(e.message || 'Reindex failed.', 'error');
    } finally {
      setReindexing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    handleUpload(e.dataTransfer.files);
  };

  const formatSize = (mb: number) => mb < 1 ? `${(mb * 1024).toFixed(0)} KB` : `${mb.toFixed(1)} MB`;
  const formatDate = (iso: string) => new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  const currentDocs = activeTab === 'acts' ? docs.acts : docs.cases;

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", minHeight: '100%' }}>

      {/* Toast Notifications */}
      <div style={{ position: 'fixed', top: 24, right: 24, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {toasts.map(t => (
          <div key={t.id} style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '12px 18px',
            borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
            background: t.type === 'success' ? '#0f2' === '#0f2' ? '#18241A' : '#fff' : t.type === 'error' ? '#2A1515' : '#1A1E2E',
            border: `1px solid ${t.type === 'success' ? '#2ECC71' : t.type === 'error' ? '#E74C3C' : '#4A90E2'}`,
            color: '#fff', fontSize: 14, minWidth: 280, maxWidth: 420, animation: 'slideIn .25s ease'
          }}>
            {t.type === 'success' ? <CheckCircle size={16} color="#2ECC71" /> : t.type === 'error' ? <AlertCircle size={16} color="#E74C3C" /> : <Loader2 size={16} color="#4A90E2" />}
            <span>{t.message}</span>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 9998, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
          <div style={{ background: '#1C1F2E', borderRadius: 20, padding: 36, maxWidth: 440, width: '90%', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 32px 80px rgba(0,0,0,0.5)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
              <div style={{ background: 'rgba(231,76,60,0.15)', borderRadius: 12, padding: 10, display: 'flex' }}>
                <Trash2 size={22} color="#E74C3C" />
              </div>
              <div>
                <h3 style={{ color: '#fff', margin: 0, fontSize: 18, fontWeight: 700 }}>Delete Document</h3>
                <p style={{ color: '#8B8FA8', margin: 0, fontSize: 13 }}>This cannot be undone</p>
              </div>
            </div>
            <p style={{ color: '#C5C7D4', fontSize: 14, marginBottom: 28 }}>
              Are you sure you want to delete <strong style={{ color: '#fff' }}>"{deleteModal.file.filename}"</strong> from the <strong style={{ color: '#FF9000' }}>{deleteModal.file.file_type}</strong> folder?
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setDeleteModal(null)} style={{ flex: 1, padding: '11px 0', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#C5C7D4', cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>Cancel</button>
              <button onClick={handleDelete} disabled={deleting} style={{ flex: 1, padding: '11px 0', borderRadius: 10, border: 'none', background: '#E74C3C', color: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                {deleting ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Trash2 size={16} />}
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        @keyframes slideIn { from { opacity:0; transform:translateX(24px); } to { opacity:1; transform:translateX(0); } }
        @keyframes spin { to { transform:rotate(360deg); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        .doc-card:hover { transform:translateY(-2px); box-shadow:0 12px 32px rgba(0,0,0,0.25)!important; }
        .doc-card { transition:all .22s ease; }
        .action-btn:hover { transform:scale(1.08); }
        .action-btn { transition:all .15s ease; }
        .tab-btn { transition:all .2s ease; }
      `}</style>

      {/* Page Header */}
      <div style={{ marginBottom: 32, animation: 'fadeUp .4s ease' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <span style={{ color: '#8B8FA8', fontSize: 13 }}>Admin</span>
              <ChevronRight size={14} color="#8B8FA8" />
              <span style={{ color: '#FF9000', fontSize: 13, fontWeight: 600 }}>RAG Management</span>
            </div>
            <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: '#181B25', letterSpacing: '-0.5px' }}>RAG Document Management</h1>
            <p style={{ margin: '6px 0 0', color: '#6B7280', fontSize: 14 }}>Manage legal documents that power the CogniLex AI chatbot</p>
          </div>
          <button
            onClick={handleReindex}
            disabled={reindexing}
            style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '11px 22px',
              borderRadius: 12, border: 'none',
              background: reindexing ? '#374151' : 'linear-gradient(135deg,#FF9000,#FF6B00)',
              color: '#fff', cursor: reindexing ? 'not-allowed' : 'pointer',
              fontSize: 14, fontWeight: 700, boxShadow: reindexing ? 'none' : '0 4px 20px rgba(255,144,0,0.4)',
              transition: 'all .2s ease'
            }}
          >
            <RefreshCw size={16} style={{ animation: reindexing ? 'spin 1s linear infinite' : 'none' }} />
            {reindexing ? 'Rebuilding Index…' : 'Rebuild RAG Index'}
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16, marginBottom: 28, animation: 'fadeUp .45s ease' }}>
        {[
          { label: 'Acts Documents', value: docs.total_acts, icon: Scale, color: '#FF9000', bg: 'rgba(255,144,0,0.1)' },
          { label: 'Cases Documents', value: docs.total_cases, icon: BookOpen, color: '#4A90E2', bg: 'rgba(74,144,226,0.1)' },
          { label: 'Total Documents', value: docs.total_acts + docs.total_cases, icon: Database, color: '#2ECC71', bg: 'rgba(46,204,113,0.1)' },
        ].map(s => (
          <div key={s.label} style={{ background: '#fff', borderRadius: 16, padding: '20px 24px', border: '1px solid #F0F1F5', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ background: s.bg, borderRadius: 12, padding: 12, display: 'flex' }}>
              <s.icon size={22} color={s.color} />
            </div>
            <div>
              <p style={{ margin: 0, color: '#6B7280', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</p>
              <p style={{ margin: '2px 0 0', color: '#181B25', fontSize: 26, fontWeight: 800 }}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 24, animation: 'fadeUp .5s ease' }}>

        {/* Upload Panel */}
        <div style={{ background: '#fff', borderRadius: 20, padding: 28, border: '1px solid #F0F1F5', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', height: 'fit-content' }}>
          <h2 style={{ margin: '0 0 6px', fontSize: 18, fontWeight: 700, color: '#181B25' }}>Upload Document</h2>
          <p style={{ margin: '0 0 24px', color: '#6B7280', fontSize: 13 }}>PDF files only · Max 50 MB</p>

          {/* File Type Toggle */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Document Type</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {(['acts', 'cases'] as FileType[]).map(t => (
                <button
                  key={t}
                  onClick={() => setFileType(t)}
                  style={{
                    padding: '12px 0', borderRadius: 12, border: `2px solid ${fileType === t ? (t === 'acts' ? '#FF9000' : '#4A90E2') : '#E5E7EB'}`,
                    background: fileType === t ? (t === 'acts' ? 'rgba(255,144,0,0.08)' : 'rgba(74,144,226,0.08)') : '#FAFAFA',
                    color: fileType === t ? (t === 'acts' ? '#FF9000' : '#4A90E2') : '#6B7280',
                    cursor: 'pointer', fontSize: 14, fontWeight: 700, textTransform: 'capitalize', transition: 'all .2s'
                  }}
                >
                  {t === 'acts' ? '⚖️ Acts' : '📋 Cases'}
                </button>
              ))}
            </div>
          </div>

          {/* Drop Zone */}
          <div
            onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: `2px dashed ${isDragging ? '#FF9000' : uploading ? '#FF9000' : '#D1D5DB'}`,
              borderRadius: 16, padding: '40px 24px', textAlign: 'center', cursor: 'pointer',
              background: isDragging ? 'rgba(255,144,0,0.04)' : '#FAFAFA',
              transition: 'all .2s ease', marginBottom: 16
            }}
          >
            <input ref={fileInputRef} type="file" accept=".pdf" style={{ display: 'none' }} onChange={e => handleUpload(e.target.files)} />
            {uploading ? (
              <>
                <Loader2 size={36} color="#FF9000" style={{ animation: 'spin 1s linear infinite', marginBottom: 12 }} />
                <p style={{ color: '#FF9000', fontWeight: 700, margin: 0, fontSize: 15 }}>Uploading…</p>
              </>
            ) : (
              <>
                <div style={{ background: isDragging ? 'rgba(255,144,0,0.15)' : '#F3F4F6', borderRadius: 14, padding: 14, display: 'inline-flex', marginBottom: 14 }}>
                  <Upload size={28} color={isDragging ? '#FF9000' : '#9CA3AF'} />
                </div>
                <p style={{ color: isDragging ? '#FF9000' : '#374151', fontWeight: 700, margin: '0 0 4px', fontSize: 15 }}>
                  {isDragging ? 'Drop to upload' : 'Drop PDF here'}
                </p>
                <p style={{ color: '#9CA3AF', margin: 0, fontSize: 13 }}>or click to browse</p>
              </>
            )}
          </div>

          <div style={{ background: 'rgba(255,144,0,0.07)', borderRadius: 12, padding: '12px 16px', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <AlertCircle size={15} color="#FF9000" style={{ marginTop: 1, flexShrink: 0 }} />
            <p style={{ color: '#92400E', margin: 0, fontSize: 12, lineHeight: 1.6 }}>
              After uploading, click <strong>Rebuild RAG Index</strong> to make the new document searchable by the AI.
            </p>
          </div>
        </div>

        {/* Documents Library */}
        <div style={{ background: '#fff', borderRadius: 20, padding: 28, border: '1px solid #F0F1F5', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <h2 style={{ margin: '0 0 4px', fontSize: 18, fontWeight: 700, color: '#181B25' }}>Document Library</h2>
              <p style={{ margin: 0, color: '#6B7280', fontSize: 13 }}>{currentDocs.length} document{currentDocs.length !== 1 ? 's' : ''} in {activeTab}</p>
            </div>
            <button onClick={fetchDocs} style={{ background: '#F3F4F6', border: 'none', borderRadius: 10, padding: '8px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, color: '#6B7280', fontSize: 13, fontWeight: 600 }}>
              <RefreshCw size={14} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
              Refresh
            </button>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 4, background: '#F3F4F6', borderRadius: 12, padding: 4, marginBottom: 20 }}>
            {(['acts', 'cases'] as FileType[]).map(t => (
              <button
                key={t}
                className="tab-btn"
                onClick={() => setActiveTab(t)}
                style={{
                  flex: 1, padding: '9px 0', borderRadius: 9, border: 'none', cursor: 'pointer',
                  background: activeTab === t ? '#fff' : 'transparent',
                  color: activeTab === t ? '#181B25' : '#6B7280',
                  fontWeight: activeTab === t ? 700 : 500, fontSize: 14,
                  boxShadow: activeTab === t ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                  textTransform: 'capitalize'
                }}
              >
                {t === 'acts' ? `⚖️ Acts (${docs.total_acts})` : `📋 Cases (${docs.total_cases})`}
              </button>
            ))}
          </div>

          {/* File List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 460, overflowY: 'auto', paddingRight: 4 }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '60px 0' }}>
                <Loader2 size={32} color="#FF9000" style={{ animation: 'spin 1s linear infinite', marginBottom: 12 }} />
                <p style={{ color: '#9CA3AF', margin: 0, fontSize: 14 }}>Loading documents…</p>
              </div>
            ) : currentDocs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 0' }}>
                <div style={{ background: '#F3F4F6', borderRadius: 16, padding: 18, display: 'inline-flex', marginBottom: 14 }}>
                  <FileText size={32} color="#D1D5DB" />
                </div>
                <p style={{ color: '#9CA3AF', margin: 0, fontSize: 14, fontWeight: 600 }}>No {activeTab} documents yet</p>
                <p style={{ color: '#C9CDD6', margin: '4px 0 0', fontSize: 13 }}>Upload a PDF to get started</p>
              </div>
            ) : (
              currentDocs.map(doc => (
                <div
                  key={doc.filename}
                  className="doc-card"
                  style={{
                    background: '#F9FAFB', borderRadius: 14, padding: '14px 18px',
                    border: '1px solid #F0F1F5', display: 'flex', alignItems: 'center', gap: 14,
                    boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
                  }}
                >
                  <div style={{ background: activeTab === 'acts' ? 'rgba(255,144,0,0.1)' : 'rgba(74,144,226,0.1)', borderRadius: 10, padding: 10, display: 'flex', flexShrink: 0 }}>
                    <FileText size={18} color={activeTab === 'acts' ? '#FF9000' : '#4A90E2'} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#181B25', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.filename}</p>
                    <p style={{ margin: '3px 0 0', fontSize: 12, color: '#9CA3AF' }}>{formatSize(doc.size_mb)} · {formatDate(doc.uploaded_at)}</p>
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                    <a
                      href={`${RAG_BASE}/pdfs/${doc.file_type}/${encodeURIComponent(doc.filename)}`}
                      target="_blank"
                      rel="noreferrer"
                      title="View PDF"
                      className="action-btn"
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        width: 34, height: 34, borderRadius: 9, background: 'rgba(74,144,226,0.1)',
                        color: '#4A90E2', textDecoration: 'none', border: 'none', cursor: 'pointer'
                      }}
                    >
                      <Eye size={15} />
                    </a>
                    <button
                      onClick={() => setDeleteModal({ file: doc })}
                      title="Delete"
                      className="action-btn"
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        width: 34, height: 34, borderRadius: 9, background: 'rgba(231,76,60,0.1)',
                        color: '#E74C3C', border: 'none', cursor: 'pointer'
                      }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
