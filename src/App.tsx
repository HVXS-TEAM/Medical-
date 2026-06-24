import React, { useState } from 'react';
import { 
  Heart, 
  Activity, 
  Award, 
  Shield, 
  Search, 
  Video, 
  Phone, 
  ArrowRight, 
  ChevronDown, 
  User, 
  Lock, 
  Settings, 
  Users, 
  MapPin, 
  Calendar, 
  Play, 
  Check, 
  Pill, 
  DollarSign, 
  Menu, 
  X, 
  Clock, 
  Smartphone, 
  Plus, 
  ChevronRight,
  Stethoscope,
  ChevronUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Import our custom modules
import ArchitectureExplorer from './components/ArchitectureExplorer';
import AuthModule from './components/AuthModule';
import DmpModule from './components/DmpModule';
import PrescriptionModule from './components/PrescriptionModule';
import TeleconsultationModule from './components/TeleconsultationModule';
import PaymentModule from './components/PaymentModule';

export default function App() {
  const [activeModuleTab, setActiveModuleTab] = useState<'auth' | 'dmp' | 'prescription' | 'telecom' | 'payment' | 'architecture'>('dmp');
  const [userSession, setUserSession] = useState<{ fullName: string; email: string; role: 'patient' | 'doctor' } | null>({
    fullName: 'Dr. Jamel Kouokam',
    email: 'jamelkouokam3004@gmail.com',
    role: 'doctor'
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Departments definitions
  const departments = [
    { id: 'kidney', name: 'Néphrologie (Rein)', icon: '🩺', desc: 'Dialyse et soins rénaux avancés' },
    { id: 'heart', name: 'Cardiologie (Cœur)', icon: '❤️', desc: 'Rythmologie et chirurgie coronarienne' },
    { id: 'lungs', name: 'Pneumologie (Poumons)', icon: '🫁', desc: 'Asthme, allergies et bilans respiratoires' },
    { id: 'dental', name: 'Odontologie (Dentaire)', icon: '🦷', desc: 'Implantologie et esthétique dentaire' },
    { id: 'brain', name: 'Neurologie (Cerveau)', icon: '🧠', desc: 'Diagnostics cérébraux par IRM 3D' },
    { id: 'bones', name: 'Orthopédie (Muscles/Squelette)', icon: '🦴', desc: 'Traumatologie et prothèses' }
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    scrollToTerminal('telecom');
  };

  const scrollToTerminal = (tab: 'auth' | 'dmp' | 'prescription' | 'telecom' | 'payment' | 'architecture') => {
    setActiveModuleTab(tab);
    const element = document.getElementById('medica-terminal');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-teal-500 selection:text-white">
      
      {/* 1. HEADER / NAVIGATION */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo and brand */}
          <div className="flex items-center gap-3">
            <div className="bg-teal-600 p-2.5 rounded-xl text-white shadow-md shadow-teal-600/10 flex items-center justify-center">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-extrabold text-xl tracking-tight text-slate-800">MEDICA<span className="text-teal-600">+</span></span>
                <span className="bg-teal-50 text-teal-700 border border-teal-100 text-[10px] font-bold px-1.5 py-0.5 rounded font-mono uppercase">Premium</span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-wider">Hôpital Virtuel Yaoundé</p>
            </div>
          </div>

          {/* Nav links - Desktop */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#hero" className="hover:text-teal-600 transition-colors">Accueil</a>
            <a href="#departments" className="hover:text-teal-600 transition-colors">Départements</a>
            <a href="#services" className="hover:text-teal-600 transition-colors">Services</a>
            <a href="#medica-terminal" className="hover:text-teal-600 transition-colors flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full text-xs font-bold text-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Terminal Clinique
            </a>
          </nav>

          {/* Action Button & Live doctors indicator */}
          <div className="hidden md:flex items-center gap-5">
            <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50/80 px-3 py-1.5 rounded-full border border-slate-150">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
              <span className="font-bold text-slate-700">2500+</span>
              <span>Médecins connectés</span>
            </div>

            <button 
              onClick={() => scrollToTerminal('telecom')}
              className="bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm px-5 py-2.5 rounded-full transition-all hover:scale-102 hover:shadow-lg hover:shadow-teal-600/10 active:scale-98"
            >
              Prendre un rendez-vous
            </button>
          </div>

          {/* Mobile hamburger menu toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-slate-100 bg-white"
            >
              <div className="px-4 pt-2 pb-6 space-y-3 font-medium text-slate-600 text-sm">
                <a 
                  href="#hero" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 hover:text-teal-600"
                >
                  Accueil
                </a>
                <a 
                  href="#departments" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 hover:text-teal-600"
                >
                  Départements
                </a>
                <a 
                  href="#services" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 hover:text-teal-600"
                >
                  Services
                </a>
                <button 
                  onClick={() => { setMobileMenuOpen(false); scrollToTerminal('telecom'); }}
                  className="w-full text-left py-2 hover:text-teal-600"
                >
                  Téléconsultations Live
                </button>
                <button 
                  onClick={() => { setMobileMenuOpen(false); scrollToTerminal('architecture'); }}
                  className="w-full text-left py-2 hover:text-teal-600 font-mono text-xs"
                >
                  Codebase & Architecture Next/Nest
                </button>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="font-bold">2500+ Médecins en ligne</span>
                  </div>
                  <button 
                    onClick={() => { setMobileMenuOpen(false); scrollToTerminal('telecom'); }}
                    className="bg-teal-600 text-white text-xs font-bold px-4 py-2 rounded-full"
                  >
                    Rendez-vous
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* 2. HERO SECTION */}
      <section id="hero" className="relative py-12 md:py-20 lg:py-24 bg-gradient-to-b from-teal-50/30 via-white to-slate-50/20 overflow-hidden">
        
        {/* Abstract medical cross grid background shapes */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
          <div className="absolute top-1/4 left-1/12 w-32 h-32 border-4 border-teal-600 rounded-full" />
          <div className="absolute bottom-1/3 right-1/10 w-48 h-48 border-4 border-cyan-600 rounded-full" />
          <div className="absolute top-1/2 left-2/3 w-24 h-24 border border-teal-600 transform rotate-45" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6 md:space-y-8">
            <div className="inline-flex items-center gap-2 bg-teal-50 border border-teal-100 px-3.5 py-1.5 rounded-full">
              <Award className="w-4 h-4 text-teal-600" />
              <span className="text-xs font-bold text-teal-700 font-display">Hôpital Virtuel Référent d'Afrique Centrale</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold tracking-tight text-slate-800 leading-[1.1]">
              Des soins <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-600">premium</span> pour un mode de vie sain
            </h1>

            <p className="text-base sm:text-lg text-slate-500 leading-relaxed max-w-2xl">
              MEDICA+ réinvente la médecine au Cameroun. Accédez instantanément à nos praticiens hautement qualifiés, gérez votre dossier médical de manière sécurisée sous le protocole FHIR et téléchargez vos ordonnances certifiées électroniquement.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => scrollToTerminal('telecom')}
                className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-bold px-6 py-3 rounded-full hover:from-teal-700 hover:to-cyan-700 shadow-md transition-all hover:scale-102 flex items-center gap-2"
              >
                <span>Démarrer une Télémédecine</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsVideoModalOpen(true)}
                className="inline-flex items-center gap-2.5 text-slate-600 hover:text-teal-600 font-bold text-sm px-4 py-3 transition-colors"
              >
                <div className="bg-white p-2.5 rounded-full shadow-md border border-slate-100 text-teal-600 flex items-center justify-center hover:scale-105 transition-all">
                  <Play className="w-4 h-4 fill-teal-600 ml-0.5" />
                </div>
                <span>Découvrir notre hôpital</span>
              </button>
            </div>

            {/* Contextual search bar */}
            <form onSubmit={handleSearchSubmit} className="bg-white p-2 rounded-2xl border border-slate-200/80 shadow-md flex items-center gap-2 max-w-md">
              <div className="p-2.5 text-slate-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un médecin, une spécialité..."
                className="flex-1 bg-transparent border-none text-xs focus:outline-none text-slate-700"
              />
              <button
                type="submit"
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all"
              >
                Chercher
              </button>
            </form>
          </div>

          {/* Hero Right Content: Gorgeous Doctor portrait frame */}
          <div className="lg:col-span-5 relative flex justify-center">
            {/* Status indicator on the picture */}
            <div className="absolute top-6 right-6 z-10 bg-white/90 backdrop-blur-md border border-slate-100 px-3 py-1.5 rounded-full flex items-center gap-2 shadow-md">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs font-bold text-slate-700">2500+ Médecins En Ligne</span>
            </div>

            {/* Circular backdrop pattern */}
            <div className="absolute w-[320px] h-[320px] sm:w-[400px] sm:h-[400px] rounded-full bg-gradient-to-tr from-teal-50 to-cyan-50/50 -bottom-10 -right-4 -z-10" />

            {/* Portrait with a clean aesthetic border */}
            <div className="border-8 border-white shadow-xl rounded-3xl overflow-hidden aspect-[3/4] w-[280px] sm:w-[340px] bg-slate-100 relative group transition-all duration-500 hover:shadow-2xl">
              <img
                src="/src/assets/images/hero_doctor_1782309684625.jpg"
                alt="Directrice Clinique MEDICA+"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent p-5 text-white">
                <p className="text-sm font-bold font-display">Dr. Estelle Mvogo</p>
                <p className="text-[10px] text-teal-300 font-mono">Chef de Clinique - MEDICA+ Yaoundé</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. KEY STATISTICS BANNER */}
      <section className="bg-white border-y border-slate-150">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: '4500+', label: 'Patients satisfaits' },
            { value: '200+', label: "Chambres d'hôpital/Capacités" },
            { value: '500+', label: 'Prix remportés' },
            { value: '20+', label: "Ambulances/Unités d'urgence" }
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <span className="font-display font-extrabold text-3xl sm:text-4xl text-teal-600 block mb-1">
                {stat.value}
              </span>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 4. RAPID FILTER FORM */}
      <section className="bg-slate-100 py-6 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
            <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
              
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Département</label>
                <div className="relative">
                  <select
                    value={selectedDept}
                    onChange={(e) => setSelectedDept(e.target.value)}
                    className="w-full text-xs font-medium text-slate-700 py-2 pl-3 pr-8 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-500 appearance-none"
                  >
                    <option value="">Sélectionner un département</option>
                    <option value="kidney">Néphrologie</option>
                    <option value="heart">Cardiologie</option>
                    <option value="lungs">Pneumologie</option>
                    <option value="dental">Odontologie</option>
                    <option value="brain">Neurologie</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Praticien / Médecin</label>
                <div className="relative">
                  <select
                    value={selectedDoctor}
                    onChange={(e) => setSelectedDoctor(e.target.value)}
                    className="w-full text-xs font-medium text-slate-700 py-2 pl-3 pr-8 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-500 appearance-none"
                  >
                    <option value="">Sélectionner un médecin</option>
                    <option value="kouokam">Dr. Jamel Kouokam</option>
                    <option value="nguene">Dr. Jean-Pierre Nguene</option>
                    <option value="mvogo">Dr. Estelle Mvogo</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date souhaitée</label>
                <div className="relative">
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full text-xs font-medium text-slate-700 py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Localisation / Zone</label>
                <div className="relative">
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full text-xs font-medium text-slate-700 py-2 pl-3 pr-8 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-500 appearance-none"
                  >
                    <option value="">Sélectionner une localisation</option>
                    <option value="bastos">Bastos, Yaoundé</option>
                    <option value="omnisports">Omnisports, Yaoundé</option>
                    <option value="mendong">Mendong, Yaoundé</option>
                    <option value="center">Centre-Ville, Yaoundé</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <button
                type="submit"
                className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-98 cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>Rechercher</span>
              </button>

            </form>
          </div>
        </div>
      </section>

      {/* 5. DEPARTMENT CATEGORIES GRID */}
      <section id="departments" className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <span className="text-xs uppercase font-bold text-teal-600 tracking-widest font-mono">Catégories de Départements</span>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-800">
              Parcourir par département pour des services adaptés et des solutions d'experts
            </h2>
            <p className="text-sm text-slate-500">
              Chaque cellule clinique intègre des outils d'analyse de pointe et est supervisée par un professeur agrégé.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {departments.map((dept) => (
              <div 
                key={dept.id}
                className="border border-slate-200 rounded-2xl p-5 hover:border-teal-500 hover:bg-teal-50/20 hover:shadow-md transition-all text-center space-y-3 group cursor-pointer"
                onClick={() => {
                  setSelectedDept(dept.id);
                  scrollToTerminal('telecom');
                }}
              >
                <div className="text-3xl filter drop-shadow-sm group-hover:scale-110 transition-transform">
                  {dept.icon}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 tracking-tight">{dept.name}</h4>
                  <p className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">{dept.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. WORLD-CLASS MEDICAL SERVICES SECTION (Asymmetrical Layout) */}
      <section id="services" className="py-16 md:py-20 lg:py-24 bg-slate-100/60 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left panel: text layout */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-5">
            <span className="text-xs uppercase font-bold text-teal-600 tracking-widest font-mono">Services de classe mondiale</span>
            <h3 className="text-3xl font-display font-bold text-slate-800 tracking-tight leading-snug">
              Des services médicaux d'excellence pour vous et vos proches
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              MEDICA+ centralise les principales unités cliniques et diagnostiques pour optimiser votre parcours patient. Cliquez sur l'un des pôles interactifs ci-contre pour charger sa console de contrôle dans le terminal clinique.
            </p>
            <div className="pt-2">
              <button 
                onClick={() => scrollToTerminal('dmp')}
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-5 py-3 rounded-full shadow-md flex items-center gap-1.5 transition-all"
              >
                <span>Accéder au Dossier Médical Partagé</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right panel: asymmetric grid */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
            
            {/* Card 1: Urgences */}
            <div 
              onClick={() => scrollToTerminal('telecom')}
              className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer group"
            >
              <div className="bg-red-50 text-red-600 w-11 h-11 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-105 transition-all">
                <Heart className="w-5 h-5 fill-red-100" />
              </div>
              <h4 className="font-display font-bold text-slate-800 text-sm mb-2">Urgences 24h/24 & 7j/7</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Prise en charge immédiate pour les traumatismes et situations critiques via télé-diagnostic et orientation d'ambulances rapides.
              </p>
              <div className="mt-4 flex items-center gap-1 text-[11px] font-bold text-red-600">
                <span>Démarrer visio d'urgence</span>
                <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 2: Radiologie */}
            <div 
              onClick={() => scrollToTerminal('dmp')}
              className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer group mt-0 sm:mt-6"
            >
              <div className="bg-teal-50 text-teal-600 w-11 h-11 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-105 transition-all">
                <Activity className="w-5 h-5" />
              </div>
              <h4 className="font-display font-bold text-slate-800 text-sm mb-2">Radiologie & Imagerie 3D</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Reconstruction volumétrique de vos scanners et IRM directement sur votre navigateur. Diagnostics validés sous 30 minutes.
              </p>
              <div className="mt-4 flex items-center gap-1 text-[11px] font-bold text-teal-600">
                <span>Ouvrir le simulateur d'IRM</span>
                <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 3: Lab */}
            <div 
              onClick={() => scrollToTerminal('prescription')}
              className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer group"
            >
              <div className="bg-blue-50 text-blue-600 w-11 h-11 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-105 transition-all">
                <Award className="w-5 h-5" />
              </div>
              <h4 className="font-display font-bold text-slate-800 text-sm mb-2">Services de Laboratoire</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Analyses de sang, biochimie et dépistages à Yaoundé. Résultats cryptés conformes aux normes de sécurité médicale.
              </p>
              <div className="mt-4 flex items-center gap-1 text-[11px] font-bold text-blue-600">
                <span>Consulter les ordonnances</span>
                <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 4: Pharmacie */}
            <div 
              onClick={() => scrollToTerminal('prescription')}
              className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer group mt-0 sm:mt-6"
            >
              <div className="bg-emerald-50 text-emerald-600 w-11 h-11 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-105 transition-all">
                <Pill className="w-5 h-5" />
              </div>
              <h4 className="font-display font-bold text-slate-800 text-sm mb-2">Pharmacie & Ordonnances</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Génération immédiate d'ordonnances cryptées avec signature certifiée et QR Code facilitant le retrait en officines agréées.
              </p>
              <div className="mt-4 flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                <span>Générer une ordonnance</span>
                <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 7. HIGH-PRIORITY CLINICAL WORKSPACE / TERMINAL (MEDICA+ INTERACTIVE APP) */}
      <section id="medica-terminal" className="py-16 md:py-24 bg-slate-900 border-t border-slate-950 text-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <span className="text-xs uppercase font-bold text-teal-400 tracking-widest font-mono">ESPACE INTERACTIF</span>
            <h2 className="text-3xl font-display font-extrabold text-white tracking-tight">
              MEDICA+ Terminal Clinique Intégré
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Découvrez en temps réel les fonctionnalités prioritaires de l'Hôpital Virtuel. Choisissez un pôle ci-dessous pour interagir avec l'application sécurisée.
            </p>
          </div>

          {/* Module Selector Sidebar/Header */}
          <div className="flex flex-wrap justify-center gap-2 mb-8 bg-slate-950 p-2.5 rounded-2xl border border-slate-800 max-w-5xl mx-auto">
            {[
              { id: 'auth', label: '🔐 Authentification', desc: 'JWT & MFA' },
              { id: 'dmp', label: '📂 Dossier Médical', desc: 'DMP / IRM' },
              { id: 'prescription', label: '💊 Ordonnances', desc: 'QR Sign' },
              { id: 'telecom', label: '📞 Téléconsultation', desc: 'WebRTC' },
              { id: 'payment', label: '💳 Orange/MTN/Stripe', desc: 'Paiement' },
              { id: 'architecture', label: '💻 Codebase Next/Nest', desc: 'Technical' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveModuleTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl transition-all text-xs font-semibold text-center flex flex-col items-center gap-0.5 ${
                  activeModuleTab === tab.id
                    ? 'bg-teal-600 text-white shadow-md shadow-teal-600/10 scale-102 font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <span>{tab.label}</span>
                <span className="text-[9px] opacity-70 font-normal font-mono">{tab.desc}</span>
              </button>
            ))}
          </div>

          {/* Dynamic Tab Container with animation */}
          <div className="max-w-5xl mx-auto">
            <motion.div
              key={activeModuleTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-slate-800"
            >
              {activeModuleTab === 'auth' && (
                <AuthModule onLoginSuccess={(user) => setUserSession(user)} />
              )}
              {activeModuleTab === 'dmp' && (
                <DmpModule />
              )}
              {activeModuleTab === 'prescription' && (
                <PrescriptionModule />
              )}
              {activeModuleTab === 'telecom' && (
                <TeleconsultationModule />
              )}
              {activeModuleTab === 'payment' && (
                <PaymentModule />
              )}
              {activeModuleTab === 'architecture' && (
                <ArchitectureExplorer />
              )}
            </motion.div>
          </div>

          {/* Connected User session badge */}
          {userSession && (
            <div className="max-w-5xl mx-auto mt-6 bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-wrap justify-between items-center gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-xs font-mono">
                  MD
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-mono block">SESSION ACTIVE</span>
                  <span className="text-xs font-bold text-slate-200">{userSession.fullName} ({userSession.role === 'doctor' ? 'Praticien' : 'Patient'})</span>
                </div>
              </div>
              <button 
                onClick={() => setUserSession(null)}
                className="text-xs font-semibold text-rose-400 hover:text-rose-300 underline"
              >
                Déconnexion
              </button>
            </div>
          )}

        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-display font-extrabold text-lg text-white">MEDICA<span className="text-teal-500">+</span></span>
            </div>
            <p className="text-xs leading-relaxed">
              La plateforme hospitalière virtuelle de référence d'Afrique Centrale, fournissant une télémédecine d'excellence, sécurisée et interopérable.
            </p>
          </div>

          <div className="space-y-3">
            <h5 className="text-white text-xs font-bold tracking-widest uppercase font-display">Spécialités</h5>
            <ul className="space-y-1.5 text-xs">
              <li><a href="#departments" className="hover:text-white transition-colors">Néphrologie</a></li>
              <li><a href="#departments" className="hover:text-white transition-colors">Cardiologie</a></li>
              <li><a href="#departments" className="hover:text-white transition-colors">Pneumologie</a></li>
              <li><a href="#departments" className="hover:text-white transition-colors">Dentaire</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h5 className="text-white text-xs font-bold tracking-widest uppercase font-display">Juridique & Normes</h5>
            <ul className="space-y-1.5 text-xs font-mono">
              <li><span className="text-teal-400">●</span> Standard HL7 FHIR</li>
              <li><span className="text-teal-400">●</span> Chiffrement AES-256</li>
              <li><span className="text-teal-400">●</span> Conformité HDS / ONMC</li>
              <li><span className="text-teal-400">●</span> RGPD & HIPAA</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h5 className="text-white text-xs font-bold tracking-widest uppercase font-display">MEDICA+ Yaoundé</h5>
            <p className="text-xs">
              Bastos, Yaoundé, Cameroun<br />
              Urgences: +237 677 88 99 00<br />
              Email: contact@medica-plus.cm
            </p>
          </div>

        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-slate-900/80 text-center text-xs">
          <p>© {new Date().getFullYear()} Hôpital Virtuel MEDICA+. Tous droits réservés. Design premium par Lead UI/UX Designer.</p>
        </div>
      </footer>

      {/* Modal for Presentation Video */}
      <AnimatePresence>
        {isVideoModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative"
            >
              <button 
                onClick={() => setIsVideoModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="font-display font-bold text-white text-lg mb-2">Présentation MEDICA+ Virtual Hospital</h3>
              <p className="text-xs text-slate-400 mb-4">Découvrez notre écosystème de télésanté innovant en 60 secondes.</p>

              {/* Simulated high-quality video player layout */}
              <div className="aspect-video bg-black rounded-2xl overflow-hidden relative flex flex-col items-center justify-center border border-slate-800">
                <div className="absolute inset-0 bg-gradient-to-tr from-teal-950/40 to-slate-950/80 opacity-70" />
                <div className="z-10 text-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-teal-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-teal-500/20 animate-pulse">
                    <Play className="w-6 h-6 fill-white ml-1" />
                  </div>
                  <p className="text-xs font-semibold text-slate-200">Visite virtuelle guidée du centre de Bastos</p>
                  <p className="text-[10px] text-teal-400 font-mono">Stream HD 1080p • Ready</p>
                </div>
              </div>

              <div className="mt-4 flex justify-between items-center">
                <span className="text-[10px] font-mono text-slate-500">FORMAT: MP4 / WEBM (H.264)</span>
                <button
                  onClick={() => setIsVideoModalOpen(false)}
                  className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all"
                >
                  Fermer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
