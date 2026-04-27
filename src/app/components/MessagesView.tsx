import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faEnvelope, faUserCircle, faSearch, faPlus, faClock, faCheckDouble } from '@fortawesome/free-solid-svg-icons';
import { useI18n } from '../i18n';

interface Contact {
    id: number;
    full_name: string;
    role: string;
    type: string;
}

interface Message {
    id: number;
    sender_id: number;
    receiver_id: number;
    message: string;
    is_read: number;
    created_at: string;
}

export default function MessagesView() {
    const { t } = useI18n();
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        fetchContacts();
        const interval = setInterval(fetchContacts, 15000); // Poll contacts every 15s
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (selectedContact) {
            fetchMessages(selectedContact.id);
            const interval = setInterval(() => fetchMessages(selectedContact.id), 5000); // Poll messages every 5s
            return () => clearInterval(interval);
        }
    }, [selectedContact]);

    useEffect(scrollToBottom, [messages]);

    const fetchContacts = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5001/api/messages/contacts', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setContacts(res.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching contacts:', error);
        }
    };

    const fetchMessages = async (otherUserId: number) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`http://localhost:5001/api/messages/${otherUserId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessages(res.data);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedContact || sending) return;

        setSending(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('http://localhost:5001/api/messages', {
                receiverId: selectedContact.id,
                message: newMessage
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessages([...messages, res.data]);
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setSending(false);
        }
    };

    const filteredContacts = contacts.filter(c => 
        c.full_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-14 pr-6 py-4 bg-white border border-slate-100 rounded-2xl shadow-sm outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium text-slate-900"
                    />
                </div>

                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
                    {loading ? (
                        <div className="flex justify-center p-8">
                            <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : filteredContacts.length === 0 ? (
                        <p className="text-center text-slate-400 py-8 font-medium">No contacts found</p>
                    ) : (
                        filteredContacts.map((chat) => (
                            <button 
                                key={chat.id} 
                                onClick={() => setSelectedContact(chat)}
                                className={`w-full p-5 bg-white rounded-[2rem] border ${selectedContact?.id === chat.id ? 'border-emerald-500 shadow-xl ring-4 ring-emerald-500/5' : 'border-slate-100 shadow-sm'} hover:shadow-xl hover:-translate-y-1 transition-all text-left flex items-center gap-4 group relative overflow-hidden`}
                            >
                                <div className="relative">
                                    <div className={`w-14 h-14 ${selectedContact?.id === chat.id ? 'bg-emerald-500 text-white' : 'bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400'} rounded-2xl flex items-center justify-center`}>
                                        <FontAwesomeIcon icon={faUserCircle} className="text-3xl" />
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-4 border-white rounded-full" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <h4 className="font-black text-slate-900 tracking-tight group-hover:text-emerald-600 transition-colors truncate">{chat.full_name}</h4>
                                        <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest">{chat.type}</span>
                                    </div>
                                    <p className="text-xs text-slate-500 font-medium truncate pr-4">Click to chat</p>
                                </div>
                            </button>
                        ))
                    )}
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
                            <h3 className="font-black text-slate-900 tracking-tight text-lg">
                                {selectedContact ? selectedContact.full_name : 'Direct Messaging'}
                            </h3>
                            <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                                    {selectedContact ? 'Active Session' : 'Standby'}
                                </span>
                            </div>
                        </div>
                    </div>
                    {selectedContact && (
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                            {selectedContact.type.toUpperCase()}
                        </p>
                    )}
                </div>

                <div className="flex-1 p-6 flex flex-col overflow-y-auto custom-scrollbar gap-4">
                    {!selectedContact ? (
                        <div className="h-full flex flex-col items-center justify-center gap-6">
                            <div className="w-24 h-24 bg-emerald-50 rounded-[2.5rem] flex items-center justify-center text-emerald-500 rotate-6 shadow-emerald-500/5 border border-emerald-100">
                                <FontAwesomeIcon icon={faEnvelope} className="text-4xl" />
                            </div>
                            <div className="text-center max-w-sm px-4">
                                <h4 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Private Conversations</h4>
                                <p className="text-slate-500 font-medium">Select a contact to begin a secure communication channel.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {messages.map((msg) => (
                                <div 
                                    key={msg.id} 
                                    className={`flex ${msg.sender_id === user.id ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[80%] px-6 py-4 rounded-[1.5rem] ${
                                        msg.sender_id === user.id 
                                            ? 'bg-emerald-600 text-white rounded-tr-sm shadow-xl shadow-emerald-500/20' 
                                            : 'bg-white border border-slate-100 text-slate-900 rounded-tl-sm shadow-sm'
                                    }`}>
                                        <p className="font-medium text-sm leading-relaxed">{msg.message}</p>
                                        <div className={`flex items-center gap-2 mt-2 ${msg.sender_id === user.id ? 'text-emerald-100' : 'text-slate-400'}`}>
                                            <span className="text-[8px] font-black uppercase tracking-widest">
                                                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                            {msg.sender_id === user.id && (
                                                <FontAwesomeIcon icon={faCheckDouble} className={`text-[8px] ${msg.is_read ? 'text-white' : 'text-white/40'}`} />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>

                {selectedContact && (
                    <div className="p-8 bg-white/80 backdrop-blur-xl border-t border-slate-100">
                        <form onSubmit={handleSendMessage} className="relative group">
                            <input
                                type="text"
                                placeholder={`Message ${selectedContact.full_name}...`}
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                className="w-full pl-8 pr-24 py-5 bg-slate-50 border border-slate-100 rounded-3xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white transition-all font-medium text-slate-900 shadow-inner"
                            />
                            <button 
                                type="submit"
                                disabled={!newMessage.trim() || sending}
                                className="absolute right-3 top-1/2 -translate-y-1/2 px-8 py-3 bg-emerald-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all flex items-center gap-2"
                            >
                                {sending ? '...' : 'Send'} <FontAwesomeIcon icon={faPaperPlane} />
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
