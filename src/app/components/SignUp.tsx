import { useState } from 'react';
import { motion } from 'framer-motion'; // Fixed: motion/react → framer-motion
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faUser, faEnvelope, faLock, faPhone, faMapMarkerAlt, faEye, faEyeSlash, faSignInAlt, faCheck, faSpinner, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Navigation } from './Navigation';
import { Milk } from 'lucide-react';
import { toast } from 'sonner';
import { authApi } from '../api';


interface SignUpProps {
  onNavigate: (page: string) => void;
  onSignupSuccess?: (result: any) => void;
}

import { useI18n } from '../i18n';

interface SignUpProps {
  onNavigate: (page: string) => void;
  onSignupSuccess?: (result: any) => void;
}

export function SignUp({ onNavigate, onSignupSuccess }: SignUpProps) {
  const { t } = useI18n();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'farmer' as 'farmer' | 'collector' | 'admin',
    village: '',
    sector: '',
    agreeToTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // DISABLED VERIFICATION - COMMENTED OUT FOR TESTING
  // const [showVerifyModal, setShowVerifyModal] = useState(false);
  // const [userEmail, setUserEmail] = useState('');
  // const [verificationCode, setVerificationCode] = useState('');
  // const [verifying, setVerifying] = useState(false);
  // const [resending, setResending] = useState(false);
  const showVerifyModal = false;
  const userEmail = '';
  const verificationCode = '';
  const verifying = false;
  const resending = false;

// DISABLED handleVerify - COMMENTED OUT FOR TESTING
  // const handleVerify = async () => {
  //   if (!verificationCode || verificationCode.length !== 6) {
  //     toast.error('Please enter a 6-digit verification code');
  //     return;
  //   }
  //   setVerifying(true);
  //   try {
  //     const result = await authApi.verifyEmail({ email: userEmail, code: verificationCode });
  //     toast.success('Your account has been verified successfully.');
  //     localStorage.setItem('amatalink_token', result.token);
  //     localStorage.setItem('amatalink_user', JSON.stringify(result.user));
  //     onSignupSuccess?.(result);
  //     setTimeout(() => onNavigate('dashboard'), 1500);
  //   } catch (error: any) {
  //     toast.error(error.message || 'Verification failed');
  //   } finally {
  //     setVerifying(false);
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error(t('auth.passwordMismatch'));
      return;
    }
    if (!formData.agreeToTerms) {
      toast.error(t('auth.agreeToTerms'));
      return;
    }
    try {
      const { confirmPassword, agreeToTerms, ...registrationData } = formData;
      
      // Register with the backend
      await authApi.register(registrationData);
      
      toast.success(t('auth.registrationSuccess'));
      
      // Navigate to pending page
      setTimeout(() => onNavigate('registration-pending'), 1500);
    } catch (error: any) {
      toast.error(error.message || t('auth.registrationFailed'));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage="signup" onNavigate={onNavigate} />
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl w-full space-y-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Milk className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-4xl text-gray-900 mb-2">{t('auth.registerTitle')}</h2>
            <p className="text-gray-600">{t('auth.registerSubtitle')}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-700 mb-2"><FontAwesomeIcon icon={faUser} className="mr-2" />{t('common.role')} *</label>
                  <select name="role" value={formData.role} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white">
                    <option value="farmer">{t('roles.farmer')}</option>
                    <option value="collector">{t('roles.collector')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2"><FontAwesomeIcon icon={faUser} className="mr-2" />{t('common.fullName')} *</label>
                  <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" placeholder={t('common.fullName')} />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2"><FontAwesomeIcon icon={faEnvelope} className="mr-2" />{t('common.email')} *</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required autoComplete="off" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" placeholder={t('auth.emailPlaceholder')} />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2"><FontAwesomeIcon icon={faPhone} className="mr-2" />{t('common.phone')} *</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" placeholder={t('common.phone')} />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2"><FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />{t('common.village')} *</label>
                  <input type="text" name="village" value={formData.village} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" placeholder={t('common.village')} />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2"><FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />{t('common.sector')} *</label>
                  <input type="text" name="sector" value={formData.sector} onChange={handleChange} required autoComplete="off" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" placeholder={t('common.sector')} />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2"><FontAwesomeIcon icon={faLock} className="mr-2" />{t('common.password')} *</label>
                  <div className="relative">
                    <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} required autoComplete="new-password" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent pr-12" placeholder={t('auth.passwordPlaceholder')} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"><FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} /></button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2"><FontAwesomeIcon icon={faLock} className="mr-2" />{t('common.confirmPassword')} *</label>
                  <div className="relative">
                    <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required minLength={6} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent pr-12" placeholder={t('common.confirmPassword')} />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"><FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} /></button>
                  </div>
                </div>
              </div>
              <div className="flex items-start">
                <input type="checkbox" name="agreeToTerms" checked={formData.agreeToTerms} onChange={handleChange} className="w-4 h-4 mt-1 text-green-600 border-gray-300 rounded focus:ring-green-500" />
                <label className="ml-3 text-sm text-gray-600">{t('auth.agreeTo')} <button type="button" className="text-green-600 hover:text-green-700 cursor-pointer">{t('auth.terms')}</button> {t('common.and')} <button type="button" className="text-green-600 hover:text-green-700 cursor-pointer">{t('auth.privacy')}</button></label>
              </div>
              <button type="submit" className="w-full px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 cursor-pointer"><FontAwesomeIcon icon={faUserPlus} />{t('common.signUp')}</button>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500 uppercase tracking-wider text-xs font-bold">{t('common.or')}</span>
                </div>
              </div>

              <button
                type="button"
                className="w-full px-6 py-4 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all shadow-sm flex items-center justify-center gap-3 cursor-pointer font-bold"
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                {t('auth.signUpWithGoogle')}
              </button>

            </form>
            <div className="mt-6 text-center">
              <p className="text-gray-600">{t('auth.alreadyHaveAccount')} <button onClick={() => onNavigate('signin')} className="text-green-600 hover:text-green-700 flex items-center justify-center gap-2 mx-auto mt-2 cursor-pointer"><FontAwesomeIcon icon={faSignInAlt} />{t('common.signIn')}</button></p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl text-white mb-4">{t('auth.whyJoin')}</h3>
            <ul className="space-y-3 text-green-100">
              <li className="flex items-start gap-3"><span className="text-white">✓</span><span>{t('home.feature1Desc')}</span></li>
              <li className="flex items-start gap-3"><span className="text-white">✓</span><span>{t('home.feature2Desc')}</span></li>
              <li className="flex items-start gap-3"><span className="text-white">✓</span><span>{t('home.feature3Desc')}</span></li>
              <li className="flex items-start gap-3"><span className="text-white">✓</span><span>{t('home.ctaSubtitle')}</span></li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
