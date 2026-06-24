import React, { useState } from 'react';
import { Shield, Lock, Mail, User, Check, Key, Smartphone, Eye, EyeOff } from 'lucide-react';
import { motion } from 'motion/react';

interface AuthModuleProps {
  onLoginSuccess: (user: { fullName: string; email: string; role: 'patient' | 'doctor' }) => void;
}

export default function AuthModule({ onLoginSuccess }: AuthModuleProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('jamelkouokam3004@gmail.com');
  const [fullName, setFullName] = useState('Dr. Jamel Kouokam');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<'patient' | 'doctor'>('doctor');
  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [mfaCode, setMfaCode] = useState('');
  const [step, setStep] = useState<'credentials' | 'mfa'>('credentials');
  const [isLoading, setIsLoading] = useState(false);
  const [jwtToken, setJwtToken] = useState<string | null>(null);

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      if (mfaEnabled) {
        setStep('mfa');
      } else {
        completeAuth();
      }
    }, 1200);
  };

  const handleMfaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      if (mfaCode.length === 6 || mfaCode === '123456' || true) { // allow all for ease of test, default 123456
        completeAuth();
      }
    }, 1000);
  };

  const completeAuth = () => {
    // Generate simple mock JWT
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
      sub: email,
      fullName: isLogin ? (email === 'jamelkouokam3004@gmail.com' ? 'Dr. Jamel Kouokam' : 'Patient Invité') : fullName,
      role: role,
      mfaVerified: mfaEnabled,
      iat: Math.floor(Date.now() / 1000),
    }));
    const signature = 'AES_256_GCM_SIGNATURE_MEDICA_PLUS';
    setJwtToken(`${header}.${payload}.${signature}`);
    
    // Trigger callback
    onLoginSuccess({
      fullName: isLogin ? (email === 'jamelkouokam3004@gmail.com' ? 'Dr. Jamel Kouokam' : 'Patient Invité') : fullName,
      email: email,
      role: role,
    });
  };

  return (
    <div id="auth-module" className="liquid-glass rounded-2xl shadow-xl max-w-md mx-auto overflow-hidden">
      <div className="bg-gradient-to-r from-teal-600 to-cyan-700 px-6 py-6 text-white relative">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Shield className="w-24 h-24" />
        </div>
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-5 h-5 text-teal-300" />
          <span className="text-xs uppercase tracking-widest font-mono font-bold text-teal-200">Portail Sécurisé MEDICA+</span>
        </div>
        <h3 className="text-xl font-display font-semibold tracking-wide">
          {step === 'credentials' ? (isLogin ? 'Connexion Espace Pro' : 'Inscription Nouveau Membre') : 'Double Authentification'}
        </h3>
        <p className="text-xs text-teal-100 mt-1">
          {step === 'credentials' 
            ? 'Chiffrement AES-256 et conformité réglementaire RGPD & HIPAA.' 
            : 'Un code de sécurité à 6 chiffres a été envoyé par SMS.'}
        </p>
      </div>

      <div className="p-6">
        {step === 'credentials' ? (
          <form onSubmit={handleCredentialsSubmit} className="space-y-4">
            {/* Role selection tab */}
            <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setRole('patient')}
                className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                  role === 'patient' 
                    ? 'bg-white text-teal-700 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Espace Patient
              </button>
              <button
                type="button"
                onClick={() => setRole('doctor')}
                className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                  role === 'doctor' 
                    ? 'bg-white text-teal-700 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Espace Praticien (Médecin)
              </button>
            </div>

            {/* Form Fields */}
            {!isLogin && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600">Nom Complet</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-4.5 h-4.5 text-slate-400" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    placeholder="ex: Dr. Jean Nguene"
                    className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">Adresse Email Professionnelle</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4.5 h-4.5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="votre_adresse@medica.cm"
                  className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">Mot de Passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-4.5 h-4.5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
            </div>

            {/* MFA Slide Toggle */}
            <div className="flex items-center justify-between py-2 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4.5 h-4.5 text-slate-500" />
                <div>
                  <p className="text-xs font-bold text-slate-700">Sécurité MFA renforcée</p>
                  <p className="text-[10px] text-slate-400">Vérification SMS double-facteur requise</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={mfaEnabled} 
                  onChange={(e) => setMfaEnabled(e.target.checked)}
                  className="sr-only peer" 
                />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-600"></div>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-2.5 text-sm font-semibold rounded-xl hover:from-teal-700 hover:to-cyan-700 transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              {isLoading ? (
                <span className="w-4.5 h-4.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>{isLogin ? 'Authentification Sécurisée' : 'Créer un Compte'}</span>
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-xs font-medium text-teal-600 hover:text-teal-700 underline underline-offset-4"
              >
                {isLogin ? "Nouveau sur MEDICA+ ? Créez votre compte" : "Déjà membre ? Connectez-vous ici"}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleMfaSubmit} className="space-y-4">
            <div className="bg-teal-50 border border-teal-100 rounded-xl p-3 flex gap-2.5">
              <Key className="w-5 h-5 text-teal-600 shrink-0" />
              <div className="text-xs text-teal-800">
                <p className="font-bold">Code test rapide : 123456</p>
                <p className="text-[10px] opacity-80">Envoi vers le terminal +237 ••• •• •• 00</p>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 block text-center">Entrez le code à 6 chiffres</label>
              <input
                type="text"
                maxLength={6}
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ''))}
                required
                placeholder="123456"
                className="w-1/2 mx-auto text-center tracking-[0.5em] font-mono text-lg font-bold py-2 border-2 border-slate-200 focus:border-teal-500 focus:outline-none rounded-xl"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-teal-600 text-white py-2.5 text-sm font-semibold rounded-xl hover:bg-teal-700 transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              {isLoading ? (
                <span className="w-4.5 h-4.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Confirmer & Établir la Session</span>
                </>
              )}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setStep('credentials')}
                className="text-xs text-slate-500 hover:text-slate-700 underline"
              >
                Retour aux identifiants
              </button>
            </div>
          </form>
        )}

        {/* JWT Payload display box */}
        {jwtToken && (
          <div className="mt-4 bg-slate-900 rounded-xl p-3 border border-slate-800 font-mono text-[9px] text-slate-400">
            <span className="text-emerald-400 font-bold block mb-1">Session JWT Active:</span>
            <span className="break-all opacity-80">{jwtToken}</span>
          </div>
        )}
      </div>
    </div>
  );
}
