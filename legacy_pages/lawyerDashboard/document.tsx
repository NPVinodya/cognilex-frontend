'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Search, Plus, Folder, File as FileIcon, Download, MoreVertical, UploadCloud, Clock } from 'lucide-react';

const MOCK_FOLDERS = [
    { id: '1', name: 'Active Case Files', count: 24, size: '1.2 GB', color: 'bg-blue-50 text-blue-600' },
    { id: '2', name: 'Client Contracts', count: 56, size: '450 MB', color: 'bg-orange-50 text-[#FF9000]' },
    { id: '3', name: 'Court Evidence', count: 12, size: '3.4 GB', color: 'bg-purple-50 text-purple-600' },
    { id: '4', name: 'Invoices & Billing', count: 89, size: '150 MB', color: 'bg-emerald-50 text-emerald-600' },
];

// Recent documents are now fetched from the backend

export default function DocumentsPage() {
    const [documents, setDocuments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

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
            } catch (error) {
                console.error("Error fetching documents:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDocuments();
    }, []);
    return (
        <>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-[32px] font-bold text-[#181B25] tracking-tight leading-tight">Documents</h1>
                    <p className="text-slate-500 font-medium mt-1 text-sm">Organize safe legal files, uploads, and securely stored case evidence.</p>
                </div>
                <button className="inline-flex items-center justify-center gap-2 bg-[#FF9000] hover:bg-[#E68200] text-white px-6 py-2.5 rounded-full shadow-md shadow-orange-600/20 text-sm font-bold transition">
                    <UploadCloud className="w-4 h-4" /> Upload Files
                </button>
            </div>

            <div className="relative w-full mb-8">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search for documents across all folders..."
                    className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9000] shadow-sm transition font-medium text-[#181B25]"
                />
            </div>

            <div className="mb-10">
                <h2 className="text-lg font-bold text-[#181B25] mb-4">Quick Folders</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {MOCK_FOLDERS.map((folder) => (
                        <div key={folder.id} className="bg-white border border-slate-100 rounded-2xl shadow-[0_4px_20px_-8px_rgba(0,0,0,0.05)] p-5 hover:shadow-lg transition cursor-pointer flex flex-col gap-4">
                            <div className="flex justify-between items-start">
                                <div className={`p-3 rounded-xl ${folder.color}`}>
                                    <Folder className="w-6 h-6 fill-current" />
                                </div>
                                <button className="p-1 text-slate-400 hover:text-slate-800"><MoreVertical className="w-4 h-4" /></button>
                            </div>
                            <div>
                                <h3 className="font-bold text-[#181B25] text-sm mb-1">{folder.name}</h3>
                                <p className="text-xs text-slate-500 font-medium">{folder.count} files • {folder.size}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <h2 className="text-lg font-bold text-[#181B25] mb-4">Recent Documents</h2>
                <div className="bg-white border border-slate-100 rounded-2xl shadow-[0_4px_20px_-8px_rgba(0,0,0,0.05)] overflow-hidden">
                    <div className="divide-y divide-slate-100/80">
                        {documents.length > 0 ? documents.map((doc) => (
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
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <p className="text-xs text-slate-500 font-medium hidden sm:flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {doc.date}</p>
                                    <a 
                                        href={doc.url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="p-2 bg-white border border-slate-200 text-slate-600 hover:text-[#FF9000] hover:border-[#FF9000] rounded-lg transition shadow-sm"
                                    >
                                        <Download className="w-4 h-4" />
                                    </a>
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
        </>
    );
}
