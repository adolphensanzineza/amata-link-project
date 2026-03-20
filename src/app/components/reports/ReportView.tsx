import { useState, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faFilePdf, faFileExcel, faCalendarAlt, faFilter, faSearch,
    faInfoCircle, faSpinner, faDownload, faChevronLeft, faChevronRight,
    faDroplet, faCoins, faListAlt, faCheckCircle, faClock, faTimesCircle,
    faSync
} from '@fortawesome/free-solid-svg-icons';
import { reportsApi } from '../../api';
import { format, startOfWeek, startOfMonth, subDays } from 'date-fns';

interface ReportViewProps {
    farmerId?: number;
}

interface MilkRecord {
    id: number;
    collection_date: string;
    collection_time: string;
    liters: number;
    rate_per_liter: number;
    total_amount: number;
    status: string;
    farmer_name: string;
    farmer_phone: string;
    collector_name: string;
    village?: string;
    sector?: string;
}

interface ReportSummary {
    totalRecords: number;
    totalLiters: number;
    totalAmount: number;
}

const STATUS_CONFIG: Record<string, { label: string; classes: string; icon: any }> = {
    confirmed: { label: 'Confirmed', classes: 'bg-emerald-100 text-emerald-700', icon: faCheckCircle },
    pending:   { label: 'Pending',   classes: 'bg-amber-100  text-amber-700',   icon: faClock },
    rejected:  { label: 'Rejected',  classes: 'bg-red-100    text-red-700',     icon: faTimesCircle },
};

const QUICK_FILTERS = [
    { label: 'Today',      type: 'today'  as const },
    { label: 'This Week',  type: 'week'   as const },
    { label: 'This Month', type: 'month'  as const },
    { label: 'Last 30 Days', type: 'last30' as const },
    { label: 'All Time',   type: 'all'    as const },
];

const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50, 100];

export default function ReportView({ farmerId }: ReportViewProps) {
    const today = format(new Date(), 'yyyy-MM-dd');

    const [startDate, setStartDate] = useState(format(subDays(new Date(), 30), 'yyyy-MM-dd'));
    const [endDate,   setEndDate]   = useState(today);
    const [activeFilter, setActiveFilter] = useState<string>('last30');

    const [records,   setRecords]   = useState<MilkRecord[]>([]);
    const [summary,   setSummary]   = useState<ReportSummary | null>(null);
    const [loading,   setLoading]   = useState(false);
    const [fetched,   setFetched]   = useState(false);
    const [error,     setError]     = useState<string | null>(null);

    const [search,       setSearch]       = useState('');
    const [currentPage,  setCurrentPage]  = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // ── Quick filter helpers ──────────────────────────────────────────────
    const applyQuickFilter = (type: typeof QUICK_FILTERS[number]['type']) => {
        const now = new Date();
        setActiveFilter(type);
        setEndDate(format(now, 'yyyy-MM-dd'));
        switch (type) {
            case 'today':   setStartDate(format(now, 'yyyy-MM-dd')); break;
            case 'week':    setStartDate(format(startOfWeek(now, { weekStartsOn: 1 }), 'yyyy-MM-dd')); break;
            case 'month':   setStartDate(format(startOfMonth(now), 'yyyy-MM-dd')); break;
            case 'last30':  setStartDate(format(subDays(now, 30), 'yyyy-MM-dd')); break;
            case 'all':     setStartDate(''); setEndDate(''); break;
        }
    };

    // ── Fetch data from backend ───────────────────────────────────────────
    const handleFetch = async () => {
        setLoading(true);
        setError(null);
        setCurrentPage(1);
        try {
            const params: any = {};
            if (startDate) params.startDate = startDate;
            if (endDate)   params.endDate   = endDate;
            if (farmerId)  params.farmerId  = farmerId;

            const data = await reportsApi.fetchData(params);
            setRecords(data.records || []);
            setSummary(data.summary || null);
            setFetched(true);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch report data.');
        } finally {
            setLoading(false);
        }
    };

    // ── Download handlers ─────────────────────────────────────────────────
    const handleDownload = (type: 'pdf' | 'excel') => {
        const params: any = {};
        if (startDate) params.startDate = startDate;
        if (endDate)   params.endDate   = endDate;
        if (farmerId)  params.farmerId  = farmerId;
        const url = type === 'pdf' ? reportsApi.exportPDF(params) : reportsApi.exportExcel(params);
        window.open(url, '_blank');
    };

    // ── Filtered + paginated records ──────────────────────────────────────
    const filtered = useMemo(() => {
        if (!search.trim()) return records;
        const q = search.toLowerCase();
        return records.filter(r =>
            r.farmer_name?.toLowerCase().includes(q) ||
            r.collector_name?.toLowerCase().includes(q) ||
            r.village?.toLowerCase().includes(q) ||
            r.status?.toLowerCase().includes(q) ||
            String(r.liters).includes(q)
        );
    }, [records, search]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
    const paginated  = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filtered.slice(start, start + itemsPerPage);
    }, [filtered, currentPage, itemsPerPage]);

    // ── Format helpers ────────────────────────────────────────────────────
    const fmt = (n: number) => n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });

    // ── Render ────────────────────────────────────────────────────────────
    return (
        <div className="space-y-8 pb-12">

            {/* ── Page Title ── */}
            <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Reports</h2>
                <p className="text-slate-400 font-medium mt-1">
                    <span className="text-emerald-500 font-bold">AmataLink Dairy Network</span> &bull; Filter by date, view on-screen &amp; download
                </p>
            </div>

            {/* ── Filters + Actions card ── */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-6">
                <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                    <FontAwesomeIcon icon={faFilter} />
                    <span>Report Parameters</span>
                </div>

                {/* Date inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">From Date</label>
                        <div className="relative">
                            <input
                                type="date" value={startDate}
                                onChange={e => { setStartDate(e.target.value); setActiveFilter(''); }}
                                className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-blue-500/10 focus:bg-white outline-none transition-all"
                            />
                            <FontAwesomeIcon icon={faCalendarAlt} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">To Date</label>
                        <div className="relative">
                            <input
                                type="date" value={endDate}
                                onChange={e => { setEndDate(e.target.value); setActiveFilter(''); }}
                                className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-blue-500/10 focus:bg-white outline-none transition-all"
                            />
                            <FontAwesomeIcon icon={faCalendarAlt} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        </div>
                    </div>
                </div>

                {/* Quick filters */}
                <div className="flex flex-wrap gap-2">
                    {QUICK_FILTERS.map(f => (
                        <button
                            key={f.type}
                            onClick={() => applyQuickFilter(f.type)}
                            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                                activeFilter === f.type
                                    ? 'bg-slate-900 text-white'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>

                {/* Action row */}
                <div className="flex flex-wrap gap-3 pt-2 border-t border-slate-100">
                    {/* Fetch button */}
                    <button
                        onClick={handleFetch}
                        disabled={loading}
                        className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-slate-800 active:scale-95 transition-all disabled:opacity-60 shadow-lg shadow-slate-900/10"
                    >
                        {loading
                            ? <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                            : <FontAwesomeIcon icon={faSync} />
                        }
                        {loading ? 'Fetching…' : 'Fetch Report'}
                    </button>

                    {/* Download PDF */}
                    <button
                        onClick={() => handleDownload('pdf')}
                        className="flex items-center gap-2 px-7 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-sm active:scale-95 transition-all shadow-lg shadow-blue-500/20"
                    >
                        <FontAwesomeIcon icon={faFilePdf} />
                        Download PDF
                    </button>

                    {/* Download Excel */}
                    <button
                        onClick={() => handleDownload('excel')}
                        className="flex items-center gap-2 px-7 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-sm active:scale-95 transition-all shadow-lg shadow-emerald-500/20"
                    >
                        <FontAwesomeIcon icon={faFileExcel} />
                        Download Excel
                    </button>
                </div>
            </div>

            {/* ── Error ── */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-5 text-red-700 font-medium text-sm">
                    ⚠ {error}
                </div>
            )}

            {/* ── Summary Cards (only after fetch) ── */}
            {fetched && summary && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {[
                        { label: 'Total Records', value: fmt(summary.totalRecords), icon: faListAlt,  gradient: 'from-blue-500 to-indigo-600' },
                        { label: 'Total Liters',  value: `${fmt(summary.totalLiters)} L`, icon: faDroplet, gradient: 'from-emerald-500 to-teal-600' },
                        { label: 'Total Amount',  value: `${fmt(summary.totalAmount)} RWF`, icon: faCoins,   gradient: 'from-purple-500 to-indigo-600' },
                    ].map(card => (
                        <div key={card.label} className="bg-white rounded-3xl border border-slate-100 shadow-lg p-6 flex items-center gap-5 hover:shadow-xl transition-all">
                            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-lg`}>
                                <FontAwesomeIcon icon={card.icon} className="text-white text-xl" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{card.label}</p>
                                <p className="text-2xl font-black text-slate-900 tracking-tight">{card.value}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ── Results Table (only after fetch) ── */}
            {fetched && (
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">

                    {/* Table header / search */}
                    <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <h3 className="text-xl font-black text-slate-900">
                                Report Results
                                <span className="ml-3 text-sm font-bold text-slate-400">({filtered.length} records)</span>
                            </h3>
                            <p className="text-xs text-slate-400 font-medium mt-0.5">
                                Period: {startDate || '—'} → {endDate || '—'}
                            </p>
                        </div>
                        <div className="relative w-full sm:w-80">
                            <FontAwesomeIcon icon={faSearch} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                            <input
                                type="text" placeholder="Search records…"
                                value={search}
                                onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
                                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-blue-500/10 focus:bg-white outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        {paginated.length === 0 ? (
                            <div className="py-24 text-center">
                                <FontAwesomeIcon icon={faListAlt} className="text-5xl text-slate-200 mb-4" />
                                <p className="text-slate-400 font-medium">
                                    {records.length === 0
                                        ? 'No records found for this period.'
                                        : 'No results match your search.'}
                                </p>
                            </div>
                        ) : (
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50 text-slate-400 text-[10px] uppercase tracking-widest font-black">
                                        <th className="px-6 py-4">#</th>
                                        <th className="px-6 py-4">Date</th>
                                        <th className="px-6 py-4">Farmer</th>
                                        <th className="px-6 py-4">Collector</th>
                                        <th className="px-6 py-4">Liters</th>
                                        <th className="px-6 py-4">Rate (RWF)</th>
                                        <th className="px-6 py-4">Amount (RWF)</th>
                                        <th className="px-6 py-4">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {paginated.map((rec, i) => {
                                        const statusCfg = STATUS_CONFIG[rec.status] || STATUS_CONFIG['pending'];
                                        const rowNum    = (currentPage - 1) * itemsPerPage + i + 1;
                                        return (
                                            <tr key={rec.id} className="hover:bg-slate-50/70 transition-colors">
                                                <td className="px-6 py-4 text-slate-400 font-mono text-xs">{rowNum}</td>
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <p className="font-bold text-slate-900 text-sm">
                                                            {new Date(rec.collection_date).toLocaleDateString('en-RW', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                        </p>
                                                        <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                                                            {rec.collection_time ? rec.collection_time.slice(0, 5) : '—'}
                                                        </p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="font-bold text-slate-900 text-sm">{rec.farmer_name}</p>
                                                    {rec.village && <p className="text-[10px] text-slate-400">{rec.village}</p>}
                                                </td>
                                                <td className="px-6 py-4 text-slate-600 text-sm font-medium">{rec.collector_name}</td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-xl font-black text-sm">
                                                        {fmt(Number(rec.liters))}
                                                        <span className="text-[9px] opacity-60 font-bold">L</span>
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-slate-600 font-bold text-sm">{fmt(Number(rec.rate_per_liter))}</td>
                                                <td className="px-6 py-4">
                                                    <span className="font-black text-emerald-600 text-sm">
                                                        {fmt(Number(rec.total_amount))}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${statusCfg.classes}`}>
                                                        <FontAwesomeIcon icon={statusCfg.icon} className="text-[9px]" />
                                                        {statusCfg.label}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>

                                {/* Totals footer */}
                                <tfoot>
                                    <tr className="bg-gradient-to-r from-emerald-50 to-blue-50 border-t-2 border-slate-200">
                                        <td colSpan={4} className="px-6 py-4 font-black text-slate-900 text-sm uppercase tracking-widest">
                                            TOTALS
                                        </td>
                                        <td className="px-6 py-4 font-black text-blue-700 text-base">
                                            {summary && fmt(summary.totalLiters)} L
                                        </td>
                                        <td className="px-6 py-4" />
                                        <td className="px-6 py-4 font-black text-emerald-700 text-base">
                                            {summary && fmt(summary.totalAmount)}
                                        </td>
                                        <td className="px-6 py-4" />
                                    </tr>
                                </tfoot>
                            </table>
                        )}
                    </div>

                    {/* Pagination */}
                    {filtered.length > 0 && (
                        <div className="px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-3 text-sm text-slate-500">
                                <span>Rows per page:</span>
                                <select
                                    value={itemsPerPage}
                                    onChange={e => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                                    className="px-3 py-1.5 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-400"
                                >
                                    {ITEMS_PER_PAGE_OPTIONS.map(n => <option key={n} value={n}>{n}</option>)}
                                </select>
                                <span>
                                    {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="w-9 h-9 flex items-center justify-center border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-all"
                                >
                                    <FontAwesomeIcon icon={faChevronLeft} className="text-xs" />
                                </button>
                                <span className="px-4 py-1.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-700">
                                    {currentPage} / {totalPages}
                                </span>
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="w-9 h-9 flex items-center justify-center border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-all"
                                >
                                    <FontAwesomeIcon icon={faChevronRight} className="text-xs" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Download footer strip */}
                    {records.length > 0 && (
                        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-wrap gap-3 items-center">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">
                                <FontAwesomeIcon icon={faDownload} className="mr-1" /> Export as:
                            </span>
                            <button
                                onClick={() => handleDownload('pdf')}
                                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black active:scale-95 transition-all shadow-md shadow-blue-500/20"
                            >
                                <FontAwesomeIcon icon={faFilePdf} /> PDF
                            </button>
                            <button
                                onClick={() => handleDownload('excel')}
                                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black active:scale-95 transition-all shadow-md shadow-emerald-500/20"
                            >
                                <FontAwesomeIcon icon={faFileExcel} /> Excel
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* ── Tip (before first fetch) ── */}
            {!fetched && !loading && (
                <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100 flex gap-4">
                    <div className="mt-0.5 text-blue-500">
                        <FontAwesomeIcon icon={faInfoCircle} />
                    </div>
                    <div className="space-y-1">
                        <p className="text-blue-900 font-bold text-sm">How to use</p>
                        <p className="text-blue-700/70 text-xs leading-relaxed font-medium">
                            Select a date range using the quick filters or the date pickers above,
                            then click <strong>Fetch Report</strong> to load and display the data on this page.
                            Once loaded, you can search, paginate, and download as PDF or Excel.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
