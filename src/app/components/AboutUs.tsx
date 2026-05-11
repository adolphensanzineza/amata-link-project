import { motion } from 'motion/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faChartLine, faBullseye, faHeart, faLightbulb, faHandshake, faInfoCircle, faEnvelope, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { Navigation } from './Navigation';
import { ImageWithFallback } from './figma/ImageWithFallback';

// Import team member images
import imgAssoumpta from '../../assets/assumpta.jpeg';
import imgPhiona from '../../assets/Phiona.jpeg';
import imgAdolphe from '../../assets/adolphe.jpeg';
import imgFlorence from '../../assets/Mutima.jpeg';


import { useI18n } from '../i18n';

interface AboutUsProps {
  onNavigate: (page: string) => void;
}

export function AboutUs({ onNavigate }: AboutUsProps) {
  const { t } = useI18n();
  const values = [
    {
      icon: faHeart,
      title: t('about.value1Title'),
      description: t('about.value1Desc'),
      color: 'from-red-500 to-pink-600',
    },
    {
      icon: faLightbulb,
      title: t('about.value2Title'),
      description: t('about.value2Desc'),
      color: 'from-yellow-500 to-orange-600',
    },
    {
      icon: faHandshake,
      title: t('about.value3Title'),
      description: t('about.value3Desc'),
      color: 'from-blue-500 to-cyan-600',
    },
  ];


  const team = [
    {
      name: 'Assoumpta UZARERWA',
      role: 'Designer UI/UX',
      image: imgAssoumpta,
    },
    {
      name: 'INGABIRE Phiona',
      role: 'System Architecture',
      image: imgPhiona,
    },
    {
      name: 'Adolphe NSANZINEZA',
      role: 'Backend & Frontend Developer',
      image: imgAdolphe,
    },
    {
      name: 'MUTIMUKEYE Florence',
      role: 'System Analysis & Design',
      image: imgFlorence,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage="about" onNavigate={onNavigate} />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-green-600 to-emerald-700 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <FontAwesomeIcon icon={faInfoCircle} className="w-16 h-16 text-white mb-6" />
            <h1 className="text-5xl text-white mb-6">{t('about.heroTitle')}</h1>
            <p className="text-xl text-green-100 max-w-3xl mx-auto">
              {t('about.heroSubtitle')}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-6">
                <FontAwesomeIcon icon={faBullseye} className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl text-gray-900 mb-4">{t('about.missionTitle')}</h2>
              <p className="text-gray-600 leading-relaxed">
                {t('about.missionDesc')}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center mb-6">
                <FontAwesomeIcon icon={faChartLine} className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl text-gray-900 mb-4">{t('about.visionTitle')}</h2>
              <p className="text-gray-600 leading-relaxed">
                {t('about.visionDesc')}
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl text-gray-900 mb-6">{t('about.storyTitle')}</h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                {t('about.storyDesc1')}
              </p>
              <p className="text-gray-600 mb-4 leading-relaxed">
                {t('about.storyDesc2')}
              </p>
              <p className="text-gray-600 leading-relaxed">
                {t('about.storyDesc3')}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative rounded-2xl overflow-hidden shadow-xl"
            >
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080"
                alt="Our story"
                className="w-full h-[500px] object-cover"
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl text-gray-900 mb-4">{t('about.valuesTitle')}</h2>
            <p className="text-xl text-gray-600">
              {t('about.valuesSubtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${value.color} rounded-xl flex items-center justify-center mb-6`}>
                  <FontAwesomeIcon icon={value.icon} className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <FontAwesomeIcon icon={faUsers} className="w-16 h-16 text-green-500 mb-6" />
            <h2 className="text-4xl text-white mb-4">{t('about.teamTitle')}</h2>
            <p className="text-xl text-gray-300">
              {t('about.teamSubtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden shadow-xl ring-4 ring-white/10 bg-gray-700">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl text-white mb-2">{member.name}</h3>
                <p className="text-green-400 text-sm">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-green-600 to-emerald-700 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl text-white mb-6">{t('about.readyToJoin')}</h2>
            <p className="text-xl text-green-100 mb-8">
              {t('about.joinDesc')}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => onNavigate('signup')}
                className="px-8 py-4 bg-white text-green-600 rounded-lg hover:bg-green-50 transition-all shadow-lg text-lg flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faUserPlus} />
                {t('common.signUp')}
              </button>
              <button
                onClick={() => onNavigate('contact')}
                className="px-8 py-4 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-all border-2 border-white/30 text-lg flex items-center gap-2 cursor-pointer"
              >
                <FontAwesomeIcon icon={faEnvelope} />
                {t('navigation.contact')}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}