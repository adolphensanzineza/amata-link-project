import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faEnvelope, faUserCircle, faSearch, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useI18n } from '../i18n';

export default function MessagesView() {
    const { t } = useI18n();

    const mockChats = [
        { id: 1, name: 'Admin Support', lastMsg: 'Your account verification is complete.', time: '10:30 AM', unread: 1, online: true },
        { id: 2, name: 'Main Collection Point', lastMsg: 'Milk price updated to 600 RWF.', time: 'Yesterday', unread: 0, online: true },
        { id: 3, name: 'Farmer Outreach', lastMsg: 'New training session on Monday.', time: '2 days ago', unread: 0, online: false },
    ];

    return (
        <div className="h-[calc(100vh-160px)] flex flex-col lg:flex-row gap-8">
            {/* Sidebar - Contacts */}
            <div className="w-full lg:w-96 flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Messages</h2>
                    <button className="w-10 h-10 bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center hover:scale-110 transition-transform">
                        <FontAwesomeIcon icon={faPlus} />
                    </button>
                </div>

                <div className="relative">
                    <FontAwesomeIcon icon={faSearch} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search conversations..."
                        className="w-full pl-14 pr-6 py-4 bg-white border border-slate-100 rounded-2xl shadow-sm outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium text-slate-900"
                    />
                </div>

                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
                    {mockChats.map((chat) => (
                        <button key={chat.id} className="w-full p-5 bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all text-left flex items-center gap-4 group relative overflow-hidden">
                            <div className="relative">
                                <div className="w-14 h-14 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center text-slate-400">
                                    <FontAwesomeIcon icon={faUserCircle} className="text-3xl" />
                                </div>
                                {chat.online && <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-4 border-white rounded-full" />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                    <h4 className="font-black text-slate-900 tracking-tight group-hover:text-emerald-600 transition-colors">{chat.name}</h4>
                                    <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest">{chat.time}</span>
                                </div>
                                <p className="text-xs text-slate-500 font-medium truncate pr-4">{chat.lastMsg}</p>
                            </div>
                            {chat.unread > 0 && (
                                <div className="w-6 h-6 bg-emerald-500 text-white text-[10px] font-black rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                    {chat.unread}
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Chat Area - Placeholder */}
            <div className="flex-1 bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/50 flex flex-col overflow-hidden relative">
                <div className="absolute inset-0 bg-slate-50/50 -z-10" />

                <div className="p-8 border-b border-slate-100 bg-white/80 backdrop-blur-xl flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
                            <FontAwesomeIcon icon={faUserCircle} className="text-2xl" />
                        </div>
                        <div>
                            <h3 className="font-black text-slate-900 tracking-tight text-lg">Admin Support</h3>
                            <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Active Now</span>
                            </div>
                        </div>
                    </div>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">Official Channel</p>
                </div>

                <div className="flex-1 p-10 flex flex-col items-center justify-center gap-6">
                    <div className="w-24 h-24 bg-emerald-50 rounded-[2.5rem] flex items-center justify-center text-emerald-500 rotate-6 shadow-emerald-500/5 border border-emerald-100">
                        <FontAwesomeIcon icon={faEnvelope} className="text-4xl" />
                    </div>
                    <div className="text-center max-w-sm">
                        <h4 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Direct Messaging</h4>
                        <p className="text-slate-500 font-medium">Select a conversation to start chatting with other users on the platform.</p>
                    </div>
                </div>

                <div className="p-8 bg-white/80 backdrop-blur-xl border-t border-slate-100">
                    <div className="relative group">
                        <input
                            type="text"
                            placeholder="Type your message here..."
                            className="w-full pl-8 pr-24 py-5 bg-slate-50 border border-slate-100 rounded-3xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white transition-all font-medium text-slate-900"
                        />
                        <button className="absolute right-3 top-1/2 -translate-y-1/2 px-8 py-3 bg-emerald-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
                            Send <FontAwesomeIcon icon={faPaperPlane} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
