import { faXmark, faCow, faDroplet, faCoins, faCheckCircle, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState, useEffect } from 'react';
import { adminApi } from '../api';
import { safeMultiply, formatCurrency } from '../utils/math';


interface MilkEntryFormProps {
  farmer: {
    id: number;
    full_name: string;
    phone: string;
  };
  onClose: () => void;
  onSubmit: (liters: number, pricePerLiter: number) => void;
}

export function MilkEntryForm({ farmer, onClose, onSubmit }: MilkEntryFormProps) {
  const [liters, setLiters] = useState('');
  const [pricePerLiter, setPricePerLiter] = useState(500);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPrice();
  }, []);

  const loadPrice = async () => {
    try {
      const settings = await adminApi.getSettings();
      if (settings && settings.milkPricePerLiter) {
        setPricePerLiter(settings.milkPricePerLiter);
      }
    } catch (e) {
      console.log('Using default price');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const literValue = parseFloat(liters);
    
    // Validation
    if (isNaN(literValue) || literValue <= 0) {
      return;
    }
    
    if (literValue > 100) {
      alert('Maximum 100 liters per entry');
      return;
    }

    onSubmit(literValue, pricePerLiter);
  };

  const calculatedAmount = safeMultiply(liters, pricePerLiter);


  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-[32px] shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                <FontAwesomeIcon icon={faCow} />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Record Milk Delivery</h3>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center hover:bg-slate-100 rounded-xl transition-colors text-slate-400 hover:text-slate-600"
            >
              <FontAwesomeIcon icon={faXmark} className="text-lg" />
            </button>
          </div>

          <div className="mb-8 p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-300 border border-slate-100 shadow-sm">
              <span className="text-lg font-bold">{farmer.full_name.charAt(0)}</span>
            </div>
            <div>
              <p className="font-bold text-slate-900 leading-none">{farmer.full_name}</p>
              <p className="text-xs text-slate-400 mt-1 font-medium">{farmer.phone}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-6 relative">
              <label htmlFor="liters" className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Quantity (Liters)
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <FontAwesomeIcon icon={faDroplet} />
                </div>
                <input
                  type="number"
                  id="liters"
                  step="0.1"
                  min="0.1"
                  max="100"
                  value={liters}
                  onChange={(e) => setLiters(e.target.value)}
                  className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none font-bold text-lg text-slate-900"
                  placeholder="0.0"
                  required
                  autoFocus
                />
              </div>
              <p className="text-xs text-slate-400 mt-1">Max: 100 liters per entry</p>
            </div>

            {liters && parseFloat(liters) > 0 && !loading && (
              <div className="mb-8 p-6 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl text-white shadow-lg shadow-blue-500/20 animate-in slide-in-from-bottom-2 duration-500">
                <div className="flex justify-between items-start mb-4">
                  <p className="text-sm font-medium opacity-80 uppercase tracking-wider">Estimated Earnings</p>
                  <FontAwesomeIcon icon={faCoins} className="opacity-50 text-xl" />
                </div>
                <p className="text-4xl font-bold">
                  {formatCurrency(calculatedAmount)} <span className="text-lg font-normal opacity-80 uppercase tracking-widest">RWF</span>

                </p>
                <p className="text-[10px] items-center gap-1 mt-3 flex opacity-70 font-bold uppercase tracking-widest">
                  <FontAwesomeIcon icon={faCheckCircle} />
                  Calculated at {pricePerLiter} RWF / L
                </p>
              </div>
            )}

            {liters && parseFloat(liters) > 100 && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
                <FontAwesomeIcon icon={faExclamationTriangle} />
                Maximum 100 liters allowed per entry
              </div>
            )}

            <div className="flex gap-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-4 border border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 transition-all active:scale-95"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/10 active:scale-95 translate-y-0 hover:-translate-y-1"
              >
                Confirm Entry
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
