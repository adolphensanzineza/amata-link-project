import { useState, useEffect, useMemo } from 'react';
import { faChartLine, faCalendarAlt, faCoins, faBell, faCheckCircle, faClock, faExclamationCircle, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { safeSum, safeNumber, formatCurrency, formatLiters } from '../utils/math';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Sidebar } from './Sidebar';
import { Milk } from 'lucide-react';
import { milkApi, notificationsApi } from '../api';
import { toast } from 'sonner';
import { useI18n } from '../i18n';
import FarmerDeliveriesView from './farmer/FarmerDeliveriesView';
import FarmerAnalytics from './farmer/FarmerAnalytics';
import FarmerNotifications from './farmer/FarmerNotifications';
import MessagesView from './MessagesView';
import ReportView from './reports/ReportView';

interface FarmerDashboardProps {
  farmerName: string;
  onLogout: () => void;
}

export function FarmerDashboard({ farmerName, onLogout }: FarmerDashboardProps) {
  const { t } = useI18n();
  const [activeItem, setActiveItem] = useState('overview');
  const [milkRecords, setMilkRecords] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination state for delivery history table
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [records, notes] = await Promise.all([
          milkApi.getFarmerRecords(),
          notificationsApi.getNotifications()
        ]);
        setMilkRecords(records);
        setNotifications(notes);
      } catch (error: any) {
        toast.error(t('errors.fetchFailed') + ': ' + error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [t]);

  // Paginated delivery records
  const totalPages = Math.ceil(milkRecords.length / itemsPerPage);
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return milkRecords.slice(start, start + itemsPerPage);
  }, [milkRecords, currentPage, itemsPerPage]);

  const totalLiters = safeSum(milkRecords, 'liters');
  const totalEarnings = safeSum(milkRecords, 'total_amount');
  const todaysRecords = milkRecords.filter(r => {
    const today = new Date().toISOString().split('T')[0];
    return r.collection_date.split('T')[0] === today;
  });
  const todaysLiters = safeSum(todaysRecords, 'liters');


  const chartData = milkRecords.slice(0, 7).reverse().map(r => ({
    date: new Date(r.collection_date).toLocaleDateString('en-RW', { day: 'numeric', month: 'short' }),
    liters: safeNumber(r.liters),
    earnings: safeNumber(r.total_amount)
  }));


  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-100 to-slate-200">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (activeItem === 'my-milk') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex">
        <Sidebar role="farmer" userName={farmerName} onLogout={onLogout} activeItem={activeItem} onItemSelect={setActiveItem} />
        <main className="ml-64 flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <FarmerDeliveriesView />
          </div>
        </main>
      </div>
    );
  }

  if (activeItem === 'stats') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex">
        <Sidebar role="farmer" userName={farmerName} onLogout={onLogout} activeItem={activeItem} onItemSelect={setActiveItem} />
        <main className="ml-64 flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <FarmerAnalytics />
          </div>
        </main>
      </div>
    );
  }

  if (activeItem === 'notifications') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex">
        <Sidebar role="farmer" userName={farmerName} onLogout={onLogout} activeItem={activeItem} onItemSelect={setActiveItem} />
        <main className="lg:ml-72 flex-1 p-4 sm:p-6 lg:p-10 transition-all duration-300">
          <div className="max-w-[1700px] mx-auto">
            <FarmerNotifications />
          </div>
        </main>
      </div>
    );
  }

  if (activeItem === 'reports') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex">
        <Sidebar role="farmer" userName={farmerName} onLogout={onLogout} activeItem={activeItem} onItemSelect={setActiveItem} />
        <main className="lg:ml-72 flex-1 p-4 sm:p-6 lg:p-10 transition-all duration-300">
          <div className="max-w-[1700px] mx-auto">
            <ReportView />
          </div>
        </main>
      </div>
    );
  }

  if (activeItem === 'messages') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex">
        <Sidebar role="farmer" userName={farmerName} onLogout={onLogout} activeItem={activeItem} onItemSelect={setActiveItem} />
        <main className="lg:ml-72 flex-1 p-4 sm:p-6 lg:p-10 transition-all duration-300">
          <div className="max-w-[1700px] mx-auto">
            <MessagesView />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col lg:flex-row shadow-inner overflow-x-hidden">
      <Sidebar role="farmer" userName={farmerName} onLogout={onLogout} activeItem={activeItem} onItemSelect={setActiveItem} />

      <main className="flex-1 lg:ml-72 min-h-screen transition-all duration-300">
        <div className="max-w-[1700px] mx-auto p-4 sm:p-6 lg:p-10">
          {/* Header */}
          <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">{t('dashboard.farmerDashboard')}</h1>
              <p className="text-slate-400 font-medium mt-1">{t('dashboard.welcomeBack')}, <span className="text-slate-900 font-bold">{farmerName.split(' ')[0]}</span></p>
            </div>
            <div className="bg-white px-6 py-4 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50">
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1.5">{t('dashboard.currentDate')}</p>
              <p className="text-xs font-black text-slate-900">{new Date().toLocaleDateString('en-RW', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-10">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-lg relative overflow-hidden group hover:shadow-xl transition-all">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                <FontAwesomeIcon icon={faChartLine} className="text-6xl text-green-600" />
              </div>
              <div className="relative z-10">
                <p className="text-slate-500 font-medium text-sm">{t('dashboard.totalDeliveries')}</p>
                <h3 className="text-4xl font-bold text-slate-900 mt-2">{formatLiters(totalLiters)}</h3>

                <div className="mt-4 flex items-center gap-2 text-green-600 text-xs font-bold bg-green-50 px-2 py-1 rounded-lg w-fit">
                  <FontAwesomeIcon icon={faCheckCircle} />
                  <span>{t('dashboard.alreadyDelivered')}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-lg relative overflow-hidden group hover:shadow-xl transition-all">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                <FontAwesomeIcon icon={faCoins} className="text-6xl text-emerald-600" />
              </div>
              <div className="relative z-10">
                <p className="text-slate-500 font-medium text-sm">{t('dashboard.totalEarnings')}</p>
                <h3 className="text-4xl font-bold text-slate-900 mt-2">{formatCurrency(totalEarnings)} RWF</h3>

                <div className="mt-4 flex items-center gap-2 text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-1 rounded-lg w-fit">
                  <FontAwesomeIcon icon={faChartLine} />
                  <span>{t('dashboard.vsLastMonth')}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-lg relative overflow-hidden group hover:shadow-xl transition-all">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                <Milk className="w-16 h-16 text-blue-600" />
              </div>
              <div className="relative z-10">
                <p className="text-slate-500 font-medium text-sm">{t('dashboard.todaysEntry')}</p>
                <h3 className="text-4xl font-bold text-slate-900 mt-2">{formatLiters(todaysLiters)}</h3>

                <div className="mt-4 flex items-center gap-2 text-blue-600 text-xs font-bold bg-blue-50 px-2 py-1 rounded-lg w-fit">
                  <FontAwesomeIcon icon={faClock} />
                  <span>{t('dashboard.waitingCollection')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Charts & Notifications */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-lg">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-slate-900">{t('dashboard.productionTrend')}</h3>
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
                  <FontAwesomeIcon icon={faChartLine} className="text-slate-400" />
                </div>
              </div>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorLiters" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#16a34a" stopOpacity={0.1} />
                        <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                    <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                    <Area type="monotone" dataKey="liters" stroke="#16a34a" strokeWidth={3} fillOpacity={1} fill="url(#colorLiters)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-lg">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-slate-900">{t('dashboard.recentNotifications')}</h3>
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
                  <FontAwesomeIcon icon={faBell} className="text-slate-400" />
                </div>
              </div>
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                {notifications.length > 0 ? notifications.map((note) => (
                  <div key={note.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex gap-4 hover:bg-slate-100 transition-colors cursor-pointer">
                    <div className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center ${note.type === 'alert' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                      <FontAwesomeIcon icon={note.type === 'alert' ? faExclamationCircle : faBell} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{note.title}</h4>
                      <p className="text-xs text-slate-500 mt-1">{note.message}</p>
                      <p className="text-[10px] text-slate-400 mt-2 font-medium uppercase tracking-wider">
                        {new Date(note.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-10">
                    <FontAwesomeIcon icon={faBell} className="text-slate-200 text-4xl mb-3" />
                    <p className="text-slate-400 italic">{t('dashboard.noNotifications')}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Delivery History Table */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/60 overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-white to-slate-50/50">
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">{t('dashboard.recentDeliveries')}</h3>
                <p className="text-xs text-slate-400 font-medium mt-1">Your latest milk supply logs</p>
              </div>
              <button onClick={() => setActiveItem('my-milk')} className="px-6 py-2.5 bg-emerald-50 text-emerald-600 font-black text-xs uppercase tracking-widest rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm">
                {t('dashboard.viewFullHistory')}
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase tracking-[0.2em] font-black">
                    <th className="px-8 py-5 border-b border-slate-100/50">{t('common.date')}</th>
                    <th className="px-8 py-5 border-b border-slate-100/50">{t('milk.quantity')}</th>
                    <th className="px-8 py-5 border-b border-slate-100/50">{t('milk.rate')}</th>
                    <th className="px-8 py-5 border-b border-slate-100/50">{t('milk.totalAmount')}</th>
                    <th className="px-8 py-5 border-b border-slate-100/50">{t('common.status')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/80">
                  {paginatedRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-slate-50/80 transition-all group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors">
                            <FontAwesomeIcon icon={faCalendarAlt} className="text-sm" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 leading-tight">{new Date(record.collection_date).toLocaleDateString()}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{record.collection_time || '08:00 AM'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="inline-flex items-center px-4 py-2 bg-slate-100 rounded-xl font-black text-slate-900 shadow-inner group-hover:bg-white transition-colors">
                          {record.liters}<span className="text-[10px] ml-1 text-slate-400">L</span>
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <p className="text-slate-600 font-bold text-[13px]">{record.rate_per_liter} RWF</p>
                      </td>
                      <td className="px-8 py-5">
                        <p className="text-emerald-600 font-black text-lg -tracking-tighter">
                          <span className="text-[10px] text-slate-400 mr-1 font-bold">RWF</span>
                          {formatCurrency(record.total_amount)}

                        </p>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${record.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700 shadow-emerald-500/10' :
                          record.status === 'rejected' ? 'bg-red-100 text-red-700 shadow-red-500/10' : 'bg-orange-100 text-orange-700 shadow-orange-500/10'
                          }`}>
                          {t(`milk.status.${record.status}`)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {milkRecords.length > 0 && (
              <div className="px-8 py-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-500">Show:</span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                    className="px-2 py-1 border border-slate-200 rounded text-sm"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-slate-200 rounded disabled:opacity-50 text-sm hover:bg-slate-50"
                  >
                    <FontAwesomeIcon icon={faChevronLeft} />
                  </button>
                  <span className="text-sm">Page {currentPage} of {totalPages}</span>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-slate-200 rounded disabled:opacity-50 text-sm hover:bg-slate-50"
                  >
                    <FontAwesomeIcon icon={faChevronRight} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}