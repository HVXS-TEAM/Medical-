import React, { useState, useEffect, useRef } from 'react';
import { Video, Mic, MicOff, VideoOff, PhoneOff, Send, MessageSquare, Monitor, Camera, Shield, RefreshCw } from 'lucide-react';
import { ChatMessage } from '../types';

export default function TeleconsultationModule() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', sender: 'system', text: 'Connexion sécurisée établie via WebRTC (AES-256 TLS 1.3)', timestamp: '08:00' },
    { id: '2', sender: 'doctor', text: 'Bonjour M. Nguene, je vous écoute. Comment s\'est passée la prise de vos comprimés d\'Amlodipine ?', timestamp: '08:01' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [cameraState, setCameraState] = useState<'idle' | 'active' | 'denied'>('idle');
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Attempt to activate webcam
  const activateWebcam = async () => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      setCameraState('idle');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      streamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      setCameraState('active');
    } catch (err) {
      console.warn('Webcam access not allowed or available:', err);
      setCameraState('denied');
    }
  };

  useEffect(() => {
    activateWebcam();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'patient',
      text: inputText,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');

    // Trigger simulated doctor auto-response
    setTimeout(() => {
      const doctorReplies = [
        "C'est noté. Si vous ressentez des maux de tête légers en fin d'après-midi, cela peut arriver les premiers jours.",
        "Avez-vous mesuré votre tension artérielle ce matin ? Quel était le chiffre indiqué ?",
        "Parfait, continuez ainsi. Je valide le renouvellement de votre ordonnance directement sur votre DMP.",
        "Nous allons programmer un contrôle clinique dans un mois pour ré-évaluer l'efficacité."
      ];
      const randomReply = doctorReplies[Math.floor(Math.random() * doctorReplies.length)];
      
      const docMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'doctor',
        text: randomReply,
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, docMsg]);
    }, 1500);
  };

  return (
    <div id="teleconsultation-module" className="bg-white rounded-2xl border border-slate-200/80 shadow-md overflow-hidden">
      {/* Module Header */}
      <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="bg-red-500/15 p-2 rounded-xl text-red-500 border border-red-500/20 animate-pulse">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-sm tracking-wide">Visioconférence de Téléconsultation</h3>
            <p className="text-xs text-slate-400">Canal crypté de bout en bout • Yaoundé Central Gateway</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] bg-red-500/10 border border-red-500/20 text-red-400 rounded-full font-mono font-bold tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
            VISIO LIVE HÔPITAL
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[440px]">
        {/* Left Side: Video Streams */}
        <div className="lg:col-span-8 bg-slate-950 p-4 flex flex-col justify-between relative">
          
          {/* Main Video: Doctor's View */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 items-stretch">
            {/* Doctor video frame */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden relative flex flex-col items-center justify-center min-h-[220px]">
              <div className="absolute top-3 left-3 bg-slate-950/70 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-800 text-[10px] font-semibold text-teal-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <span>Dr. Jamel Kouokam (MEDICA+)</span>
              </div>

              {/* Animated avatar for doctor */}
              <div className="flex flex-col items-center text-center px-4 space-y-3">
                <div className="w-20 h-20 rounded-full border-4 border-teal-500/20 bg-gradient-to-tr from-teal-500 to-cyan-600 p-1">
                  <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center font-display text-white font-bold text-xl">
                    JK
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">Médecin en cours d'écoute...</p>
                  <p className="text-[10px] text-teal-400 font-mono">Débit: 2.4 Mbps • Ping: 12ms</p>
                </div>
              </div>

              {/* Mute and lock watermark */}
              <div className="absolute bottom-3 right-3 text-[10px] text-slate-500 font-mono">
                SIG-KEY: SECURE_RTC
              </div>
            </div>

            {/* Patient video frame (HTML5 Webcam or beautiful fallback) */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden relative flex flex-col items-center justify-center min-h-[220px]">
              <div className="absolute top-3 left-3 bg-slate-950/70 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-800 text-[10px] font-semibold text-white flex items-center gap-1.5">
                <span>Vous (M. Jean-Pierre Nguene)</span>
              </div>

              {cameraState === 'active' ? (
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover rounded-2xl"
                />
              ) : (
                <div className="flex flex-col items-center text-center px-4 space-y-3">
                  <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 border border-slate-700">
                    <Camera className="w-6 h-6" />
                  </div>
                  <div>
                    {cameraState === 'idle' ? (
                      <p className="text-xs text-slate-400">Demande d'autorisation caméra...</p>
                    ) : (
                      <>
                        <p className="text-xs text-rose-400 font-semibold">Caméra indisponible ou bloquée</p>
                        <p className="text-[9px] text-slate-500 max-w-[160px] mx-auto mt-0.5">Autorisez la caméra pour un diagnostic optimal.</p>
                      </>
                    )}
                    <button
                      onClick={activateWebcam}
                      className="mt-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[10px] font-bold text-teal-400 px-3 py-1 rounded-lg transition-colors flex items-center gap-1 mx-auto"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Réessayer</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Video Control Bar */}
          <div className="mt-4 flex justify-center items-center gap-3">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-3 rounded-full transition-all border ${
                isMuted 
                  ? 'bg-red-500 border-red-600 text-white' 
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
              title={isMuted ? "Activer Micro" : "Désactiver Micro"}
            >
              {isMuted ? <MicOff className="w-4.5 h-4.5" /> : <Mic className="w-4.5 h-4.5" />}
            </button>

            <button
              onClick={() => setIsVideoOff(!isVideoOff)}
              className={`p-3 rounded-full transition-all border ${
                isVideoOff 
                  ? 'bg-red-500 border-red-600 text-white' 
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
              title={isVideoOff ? "Activer Caméra" : "Couper Caméra"}
            >
              {isVideoOff ? <VideoOff className="w-4.5 h-4.5" /> : <Video className="w-4.5 h-4.5" />}
            </button>

            <button
              onClick={() => setIsScreenSharing(!isScreenSharing)}
              className={`p-3 rounded-full transition-all border ${
                isScreenSharing 
                  ? 'bg-teal-600 border-teal-700 text-white' 
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
              title="Partager mon Écran"
            >
              <Monitor className="w-4.5 h-4.5" />
            </button>

            <div className="w-px h-6 bg-slate-800" />

            <button
              onClick={() => {
                if (streamRef.current) {
                  streamRef.current.getTracks().forEach(track => track.stop());
                }
                setCameraState('idle');
              }}
              className="px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-700 border border-red-700 text-white text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <PhoneOff className="w-4 h-4" />
              <span>Raccrocher</span>
            </button>
          </div>

        </div>

        {/* Right Side: Interactive Chat Panel */}
        <div className="lg:col-span-4 border-l border-slate-100 flex flex-col justify-between max-h-[480px]">
          {/* Messages Container */}
          <div className="p-4 flex-1 overflow-y-auto space-y-3 bg-slate-50/50">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block border-b border-slate-200 pb-1 mb-2">
              Messages de Consultation
            </span>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col max-w-[85%] ${
                  msg.sender === 'patient' 
                    ? 'ml-auto items-end' 
                    : msg.sender === 'system'
                      ? 'mx-auto items-center w-full max-w-full'
                      : 'items-start'
                }`}
              >
                {msg.sender === 'system' ? (
                  <div className="bg-teal-50 border border-teal-100 text-teal-800 rounded-lg p-2 text-[10px] text-center font-mono flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5 text-teal-600" />
                    <span>{msg.text}</span>
                  </div>
                ) : (
                  <>
                    <span className="text-[9px] font-bold text-slate-400 mb-0.5">
                      {msg.sender === 'patient' ? 'Vous' : 'Dr. J. Kouokam'}
                    </span>
                    <div
                      className={`px-3 py-2 rounded-2xl text-xs ${
                        msg.sender === 'patient'
                          ? 'bg-teal-600 text-white rounded-tr-none'
                          : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[8px] text-slate-400 mt-0.5">{msg.timestamp}</span>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Message Input bar */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-100 bg-white flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Tapez un message..."
              className="flex-1 bg-slate-100 px-3 py-1.5 text-xs rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-500 focus:bg-white"
            />
            <button
              type="submit"
              className="bg-teal-600 hover:bg-teal-700 text-white p-2 rounded-xl transition-colors shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
