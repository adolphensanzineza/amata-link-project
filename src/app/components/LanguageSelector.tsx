import { useI18n } from '../i18n';
import { Globe, ChevronDown } from 'lucide-react';

export function LanguageSelector() {
  const { language, setLanguage, t } = useI18n();

  return (
    <div className="relative group">
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 border border-slate-100 hover:border-green-200 transition-all cursor-pointer">
        <Globe className="w-4 h-4 text-green-600" />
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="appearance-none bg-transparent text-sm font-bold text-slate-700 pr-6 focus:outline-none cursor-pointer"
        >
          <option value="en">English</option>
          <option value="rw">Kinyarwanda</option>
        </select>
        <ChevronDown className="w-3 h-3 text-slate-400 absolute right-3 pointer-events-none group-hover:text-green-500 transition-colors" />
      </div>
    </div>
  );
}

