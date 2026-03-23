import { motion } from 'motion/react';
import { Milk, TrendingUp, Bell, BarChart3, CheckCircle, Shield, ArrowRight, Users, Smartphone } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Navigation } from './Navigation';
import imgCowAndMilk from '../../assets/cow_and_milk.jpg';
import imgNotifications from '../../assets/Notifications.png';

const bounceSlow = {
  animation: 'bounceSlow 3s ease-in-out infinite',
};

const keyframes = `
  @keyframes bounceSlow {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-15px); }
  }
`;

interface HomePageProps {
  onNavigate: (page: string) => void;
}

const features = [
  {
    icon: Smartphone,
    title: 'Digital Milk Recording',
    description: 'Replace paper notebooks with instant digital tracking. Record milk deliveries in real-time with our easy-to-use mobile interface.',
    image: imgCowAndMilk,
  },
  {
    icon: TrendingUp,
    title: 'Automated Calculations',
    description: 'Automatically calculate daily and monthly earnings for both farmers and collectors. No more manual errors or disputes.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwYW5hbHl0aWNzJTIwZGFzaGJvYXJkfGVufDF8fHx8MTc3MDk3NDUwNnww&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    icon: Bell,
    title: 'Daily Notifications',
    description: 'Farmers receive instant notifications confirming their milk delivery and daily earnings. Stay informed every step of the way.',
    image: imgNotifications,
  },
];

const stats = [
  { value: '100+', label: 'Active Farmers' },
  { value: '5,000L', label: 'Daily Collection' },
  { value: '98%', label: 'Accuracy Rate' },
  { value: '24/7', label: 'Support Available' },
];

export function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-green-600 to-emerald-700 overflow-hidden">
        <style dangerouslySetInnerHTML={{ __html: keyframes }} />
        {/* Navigation */}
        <Navigation currentPage="home" onNavigate={onNavigate} />

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl lg:text-6xl text-white mb-6 leading-tight font-black">
                Transforming Dairy Farming with Digital Solutions
              </h1>
              <p className="text-xl text-green-100 mb-8 leading-relaxed opacity-90">
                AmataLink empowers farmers, collectors, and administrators with a comprehensive milk productivity management system. Track deliveries, calculate earnings, and manage your dairy supply chain effortlessly.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => onNavigate('signin')}
                  className="px-8 py-4 bg-white text-green-600 rounded-2xl font-bold hover:bg-green-50 transition-all shadow-[0_10px_30px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)] flex items-center gap-2 active:scale-95"
                >
                  Get Started
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => onNavigate('about')}
                  className="px-8 py-4 bg-transparent text-white font-bold rounded-2xl hover:bg-white/10 transition-all border-2 border-white/30 active:scale-95"
                >
                  Learn More
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-[40px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-4 border-white/10 group">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1763231228595-12e443569896?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxhZnJpY2FuJTIwZmFybWVyJTIwY293fGVufDF8fHx8MTc3MDk5MzE1MXww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="African farmer with dairy cattle"
                  className="w-full h-[500px] object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
              </div>

              {/* Floating Badge */}
              <div
                className="absolute -bottom-6 -left-6 bg-white p-6 rounded-3xl shadow-2xl border border-slate-100 hidden md:block"
                style={bounceSlow}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-green-600">
                    <Milk className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Total Impact</p>
                    <p className="text-xl font-black text-slate-900 leading-none">50k+ Liters</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-800/30 rounded-full blur-3xl" />
      </div>

      {/* Stats Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl lg:text-5xl text-green-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl text-gray-900 mb-4">
              Powerful Features for Every User
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From milk collection to payment tracking, AmataLink provides all the tools you need to modernize your dairy operations.
            </p>
          </motion.div>

          <div className="space-y-24">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const isEven = index % 2 === 0;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${!isEven ? 'lg:grid-flow-dense' : ''
                    }`}
                >
                  <div className={!isEven ? 'lg:col-start-2' : ''}>
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl mb-6 shadow-lg">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-3xl text-gray-900 mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-lg text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                  <div className={!isEven ? 'lg:col-start-1 lg:row-start-1' : ''}>
                    <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-100 bg-slate-50 aspect-video lg:aspect-auto lg:h-[450px] group transition-all hover:border-green-200">
                      <ImageWithFallback
                        src={feature.image}
                        alt={feature.title}
                        className={`w-full h-full transition-transform duration-700 group-hover:scale-105 ${feature.title === 'Daily Notifications' ? 'object-contain p-4' : 'object-cover'
                          }`}
                      />
                      {feature.title !== 'Daily Notifications' && (
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl text-white mb-4">
              How AmataLink Works
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              A simple, streamlined process designed for efficiency
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                icon: Users,
                title: 'Village Collection',
                description: 'Village Collectors visit farmers and record milk deliveries digitally',
              },
              {
                step: '02',
                icon: CheckCircle,
                title: 'Sector Confirmation',
                description: 'Sector Admin confirms total deliveries and validates records',
              },
              {
                step: '03',
                icon: BarChart3,
                title: 'Automated Reports',
                description: 'System generates earnings and sends notifications automatically',
              },
            ].map((step, index) => {
              const Icon = step.icon;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative"
                >
                  <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-colors">
                    <div className="text-6xl text-green-500/20 mb-4">
                      {step.step}
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl text-white mb-3">
                      {step.title}
                    </h3>
                    <p className="text-gray-400">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1523473827533-2a64d0d36748?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYWlyeSUyMGZhcm0lMjBtaWxrJTIwY29sbGVjdGlvbnxlbnwxfHx8fDE3NzA5OTMxNTF8MA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Dairy farm"
            className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-green-900/95 via-green-900/80 to-emerald-900/90" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl text-white mb-6">
              Ready to Transform Your Dairy Operations?
            </h2>
            <p className="text-xl text-green-100 mb-8">
              Join hundreds of farmers and collectors who trust AmataLink for their milk productivity management.
            </p>
            <button
              onClick={() => onNavigate('signin')}
              className="px-10 py-4 bg-white text-green-600 rounded-lg hover:bg-green-50 transition-all shadow-lg hover:shadow-xl text-lg flex items-center gap-2 mx-auto"
            >
              Get Started Today
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <Milk className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl text-white">AmataLink</span>
              </div>
              <p className="text-gray-400">
                Digitizing milk tracking and payment management for rural communities.
              </p>
            </div>
            <div>
              <h4 className="text-white mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>info@amatalink.com</li>
                <li>+250 788 000 000</li>
                <li>Kigali, Rwanda</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2026 AmataLink. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}