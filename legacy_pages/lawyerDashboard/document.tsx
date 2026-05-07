'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Search, Plus, Folder, File as FileIcon, Download, MoreVertical, UploadCloud, Clock, X, CheckCircle, Trash2 } from 'lucide-react';
import { DashboardContext } from '@/app/lawyerDashboard/layout';

const MOCK_FOLDERS = [
    { id: '1', name: 'Active Case Files', count: 24, size: '1.2 GB', color: 'bg-blue-50 text-blue-600' },
    { id: '2', name: 'Client Contracts', count: 56, size: '450 MB', color: 'bg-orange-50 text-[#FF9000]' },
    { id: '3', name: 'Court Evidence', count: 12, size: '3.4 GB', color: 'bg-purple-50 text-purple-600' },
    { id: '4', name: 'Invoices & Billing', count: 89, size: '150 MB', color: 'bg-emerald-50 text-emerald-600' },
];

// Recent documents are now fetched from the backend

import DashboardLoading from '@/components/lawyerDashboard/DashboardLoading';

export default function DocumentsPage() {
    const { setIsPageLoading, setLoadingProgress } = React.useContext(DashboardContext);
    const [documents, setDocuments] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [uploadFile, setUploadFile] = useState<File | null>(null);
    const [uploadNote, setUploadNote] = useState('');
    const [uploadFolder, setUploadFolder] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const storedUser = localStorage.getItem("user");
                if (!storedUser) return;
                const user = JSON.parse(storedUser);
                const lawyerId = user.id || user._id;

                const res = await fetch(`/api/lawyer/dashboard?lawyerId=${lawyerId}&type=documents`);
                const data = await res.json();
                if (data.success) {
                    setDocuments(data.documents || []);
                }
                setLoadingProgress(100);
                setTimeout(() => setIsPageLoading(false), 200);
            } catch (error) {
                console.error("Error fetching documents:", error);
                setIsPageLoading(false);
            }
        };

        fetchDocuments();
    }, []);

    const handleDeleteDocument = async (docId: string) => {
        if (!confirm("Are you sure you want to delete this document?")) return;
        
        try {
            // Note: Since this is purely frontend state without a specific delete API right now,
            // we will just filter it out from the local state.
            // You can add a fetch DELETE request here later.
            setDocuments(prev => prev.filter(d => d.id !== docId));
        } catch (error) {
            console.error("Error deleting document:", error);
        }
    };

    const handleFileUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!uploadFile) return;
        
        setIsUploading(true);
        try {
            const storedUser = localStorage.getItem("user");
            if (!storedUser) throw new Error("Not logged in");
            const user = JSON.parse(storedUser);
            const lawyerId = user.id || user._id;

            const formData = new FormData();
            formData.append('file', uploadFile);
            formData.append('note', uploadNote);
            formData.append('folder', uploadFolder);

            // Call the Python FastAPI Backend directly
            const res = await fetch(`http://127.0.0.1:8000/lawyer-dashboard/${lawyerId}/documents/upload`, {
                method: 'POST',
                body: formData
            });

            const data = await res.json();
            
            if (data.success && data.document) {
                setDocuments(prev => [data.document, ...prev]);
                setIsUploadModalOpen(false);
                setUploadFile(null);
                setUploadNote('');
                setUploadFolder('');
            } else {
                throw new Error(data.message || "Upload failed");
            }
        } catch (error) {
            console.error("Upload failed", error);
            alert("Upload failed. Please check your backend connection.");
        } finally {
            setIsUploading(false);
        }
    };

    const filteredDocuments = documents.filter(doc => {
        const matchesFolder = selectedFolder ? doc.folder_id === selectedFolder : true;
        const matchesSearch = searchQuery ? (doc.name?.toLowerCase().includes(searchQuery.toLowerCase()) || doc.note?.toLowerCase().includes(searchQuery.toLowerCase())) : true;
        return matchesFolder && matchesSearch;
    });

    return (
        <>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-[32px] font-bold text-[#181B25] tracking-tight leading-tight">Documents</h1>
                    <p className="text-slate-500 font-medium mt-1 text-sm">Organize safe legal files, uploads, and securely stored case evidence.</p>
                </div>
                <button 
                    onClick={() => setIsUploadModalOpen(true)}
                    className="inline-flex items-center justify-center gap-2 bg-[#FF9000] hover:bg-[#E68200] text-white px-6 py-2.5 rounded-full shadow-md shadow-orange-600/20 text-sm font-bold transition"
                >
                    <UploadCloud className="w-4 h-4" /> Upload Files
                </button>
            </div>

            <div className="relative w-full mb-8">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for documents across all folders..."
                    className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9000] shadow-sm transition font-medium text-[#181B25]"
                />
            </div>

            <div className="mb-10">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-[#181B25]">Quick Folders</h2>
                    {selectedFolder && (
                        <button 
                            onClick={() => setSelectedFolder(null)}
                            className="text-sm font-bold text-[#FF9000] hover:text-[#E68200]"
                        >
                            View All Documents
                        </button>
                    )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {MOCK_FOLDERS.map((folder) => {
                        const isSelected = selectedFolder === folder.id;
                        // Calculate real file count for this folder based on current documents state
                        const folderDocsCount = documents.filter(d => d.folder_id === folder.id).length;
                        return (
                            <div 
                                key={folder.id} 
                                onClick={() => setSelectedFolder(isSelected ? null : folder.id)}
                                className={`bg-white border rounded-2xl shadow-[0_4px_20px_-8px_rgba(0,0,0,0.05)] p-5 hover:shadow-lg transition cursor-pointer flex flex-col gap-4 ${isSelected ? 'border-[#FF9000] ring-1 ring-[#FF9000]' : 'border-slate-100'}`}
                            >
                                <div className="flex justify-between items-start">
                                    <div className={`p-3 rounded-xl ${folder.color}`}>
                                        <Folder className="w-6 h-6 fill-current" />
                                    </div>
                                    <button className="p-1 text-slate-400 hover:text-slate-800" onClick={(e) => e.stopPropagation()}><MoreVertical className="w-4 h-4" /></button>
                                </div>
                                <div>
                                    <h3 className="font-bold text-[#181B25] text-sm mb-1">{folder.name}</h3>
                                    <p className="text-xs text-slate-500 font-medium">{folderDocsCount} files</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div>
                <h2 className="text-lg font-bold text-[#181B25] mb-4">
                    {selectedFolder ? `${MOCK_FOLDERS.find(f => f.id === selectedFolder)?.name} Documents` : 'Recent Documents'}
                </h2>
                <div className="bg-white border border-slate-100 rounded-2xl shadow-[0_4px_20px_-8px_rgba(0,0,0,0.05)] overflow-hidden">
                    <div className="divide-y divide-slate-100/80">
                        {filteredDocuments.length > 0 ? filteredDocuments.map((doc) => (
                            <div key={doc.id} className="flex items-center justify-between p-4 px-6 hover:bg-slate-50/50 transition">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                                        <FileIcon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-[14px] font-bold text-[#181B25]">{doc.name}</h4>
                                        <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mt-0.5">
                                            {doc.type} • {doc.size}
                                        </p>
                                        {doc.note && (
                                            <div className="mt-2 bg-amber-50 text-amber-700 text-xs px-3 py-1.5 rounded-lg border border-amber-100 inline-block font-medium">
                                                📝 Note: {doc.note}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <p className="text-xs text-slate-500 font-medium hidden sm:flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {doc.date}</p>
                                    <div className="flex items-center gap-2">
                                        <a 
                                            href={doc.url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="p-2 bg-white border border-slate-200 text-slate-600 hover:text-[#FF9000] hover:border-[#FF9000] rounded-lg transition shadow-sm"
                                        >
                                            <Download className="w-4 h-4" />
                                        </a>
                                        <button 
                                            onClick={() => handleDeleteDocument(doc.id)}
                                            className="p-2 bg-white border border-slate-200 text-slate-600 hover:text-rose-600 hover:border-rose-300 hover:bg-rose-50 rounded-lg transition shadow-sm"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="p-12 text-center text-slate-500 font-medium">
                                No recent documents found.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Upload Modal Overlay */}
            {isUploadModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h2 className="text-xl font-bold text-[#181B25]">Upload Document</h2>
                            <button onClick={() => setIsUploadModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-800 rounded-full hover:bg-white transition"><X className="w-5 h-5" /></button>
                        </div>
                        <form onSubmit={handleFileUpload} className="p-6 space-y-6 text-left">
                            
                            {/* File Dropzone */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Select File</label>
                                <div 
                                    className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition ${uploadFile ? 'border-emerald-500 bg-emerald-50' : 'border-slate-300 hover:border-[#FF9000] hover:bg-orange-50/30'}`}
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <input 
                                        type="file" 
                                        className="hidden" 
                                        ref={fileInputRef} 
                                        onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                                    />
                                    {uploadFile ? (
                                        <>
                                            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-3"><CheckCircle className="w-6 h-6" /></div>
                                            <p className="font-bold text-emerald-700">{uploadFile.name}</p>
                                            <p className="text-xs font-medium text-emerald-600/70 mt-1">{(uploadFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                        </>
                                    ) : (
                                        <>
                                            <div className="w-12 h-12 bg-orange-100 text-[#FF9000] rounded-full flex items-center justify-center mb-3"><UploadCloud className="w-6 h-6" /></div>
                                            <p className="font-bold text-slate-700">Click to browse or tap here</p>
                                            <p className="text-xs font-medium text-slate-500 mt-1">Supports PDF, DOCX, JPG up to 50MB</p>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Note Field */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Document Note / Description</label>
                                <textarea 
                                    value={uploadNote}
                                    onChange={(e) => setUploadNote(e.target.value)}
                                    placeholder="Add a private note about this document (e.g. 'Signed copy from client')"
                                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9000] transition"
                                    rows={3}
                                />
                            </div>

                            {/* Folder Select */}
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <label className="block text-sm font-bold text-[#181B25] mb-2 flex items-center gap-2">
                                    <Folder className="w-4 h-4 text-[#FF9000]" /> 
                                    Save this document in a Category (Optional)
                                </label>
                                <p className="text-xs text-slate-500 mb-3">Selecting a category makes it easier to find this document later when you click on the folder above.</p>
                                <select 
                                    value={uploadFolder}
                                    onChange={(e) => setUploadFolder(e.target.value)}
                                    className="w-full p-3.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#FF9000] transition shadow-sm"
                                >
                                    <option value="">📁 No Category (General Documents)</option>
                                    {MOCK_FOLDERS.map(f => <option key={f.id} value={f.id}>📁 {f.name}</option>)}
                                </select>
                            </div>

                            <button 
                                type="submit" 
                                disabled={!uploadFile || isUploading}
                                className="w-full bg-[#FF9000] hover:bg-[#E68200] text-white py-3.5 rounded-xl font-bold shadow-md shadow-orange-600/20 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isUploading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Uploading to R2 Bucket...</> : 'Securely Upload Document'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
