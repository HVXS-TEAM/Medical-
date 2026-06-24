import React, { useState, useRef, useEffect } from 'react';
import { FileText, Calendar, Heart, ShieldAlert, Award, Database, Sliders, ChevronRight, Activity, Cpu } from 'lucide-react';

interface Consultation {
  id: string;
  date: string;
  doctor: string;
  specialty: string;
  diagnosis: string;
  notes: string;
  prescriptionId?: string;
}

export default function DmpModule() {
  const [activeTab, setActiveTab] = useState<'overview' | 'consultations' | 'scans' | 'fhir'>('scans');
  const [sliceIndex, setSliceIndex] = useState(30);
  const [contrast, setContrast] = useState(1.0);
  const [brightness, setBrightness] = useState(1.0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const consultations: Consultation[] = [
    {
      id: 'c-102',
      date: '2026-05-14',
      doctor: 'Dr. Jamel Kouokam',
      specialty: 'Cardiologie',
      diagnosis: 'Hypertension artérielle modérée (Stade 1)',
      notes: 'Patient stable, poursuivre le régime hyposodé. Ajustement thérapeutique mineur à envisager si la diastolique reste au-dessus de 90 mmHg.',
      prescriptionId: 'p-881'
    },
    {
      id: 'c-101',
      date: '2026-02-10',
      doctor: 'Dr. Jean-Pierre Nguene',
      specialty: 'Pneumologie',
      diagnosis: 'Asthme d\'effort contrôlé',
      notes: 'Symptômes mineurs lors d\'exercices physiques. Usage exclusif de Ventoline au besoin.',
      prescriptionId: 'p-712'
    }
  ];

  const patientProfile = {
    fullName: 'Jean-Pierre Nguene',
    gender: 'Masculin',
    birthDate: '1984-11-12 (41 ans)',
    id: 'MEDICA-YAOUNDE-90812',
    height: '182 cm',
    weight: '79 kg',
    bloodType: 'O+',
    allergies: ['Pénicilline', 'Pollen de mangue'],
    antecedents: ['Asthme bronchique d\'effort depuis l\'enfance', 'Tabagisme sevré en 2021', 'Hypercholestérolémie contrôlée par le régime'],
  };

  // Draw the simulated medical cross-section on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Reset canvas with scan styling
    ctx.fillStyle = '#0a0f1d';
    ctx.fillRect(0, 0, width, height);

    // Apply brightness & contrast filters
    ctx.filter = `brightness(${brightness}) contrast(${contrast})`;

    // Draw coordinate grids & crosshair
    ctx.strokeStyle = 'rgba(13, 148, 136, 0.15)';
    ctx.lineWidth = 1;
    // vertical grid
    for (let x = 0; x < width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    // horizontal grid
    for (let y = 0; y < height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Outer skull / boundary circle
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, 100 + (sliceIndex * 0.15), 0, Math.PI * 2);
    ctx.stroke();

    // Inside anatomical cross section simulator (e.g. brain ventricles / lungs depending on slice)
    ctx.fillStyle = '#1e293b';
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2;

    // Left Ventricle / Lung outline
    ctx.beginPath();
    const lRadiusX = 35 + (sliceIndex * 0.4);
    const lRadiusY = 55 - (sliceIndex * 0.2);
    ctx.ellipse(width / 2 - 40, height / 2, lRadiusX, lRadiusY, -Math.PI / 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Right Ventricle / Lung outline
    ctx.beginPath();
    const rRadiusX = 35 + (sliceIndex * 0.4);
    const rRadiusY = 55 - (sliceIndex * 0.2);
    ctx.ellipse(width / 2 + 40, height / 2, rRadiusX, rRadiusY, Math.PI / 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Inner detail (Aorta / Brain matter lines - depends on sliceIndex)
    ctx.strokeStyle = '#0d9488';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(width / 2, height / 2 - 20, 15 + (sliceIndex % 10), 0, Math.PI * 2);
    ctx.stroke();

    // Dynamic spinal canal circle
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = '#64748b';
    ctx.beginPath();
    ctx.arc(width / 2, height / 2 + 70 - (sliceIndex * 0.2), 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Diagnostic indicator circle (highlighting a specific point)
    ctx.strokeStyle = '#f43f5e'; // red indicator
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(width / 2 - 35, height / 2 + 10, 10, 0, Math.PI * 2);
    ctx.stroke();

    // Pulsing crosshair at diagnostic site
    ctx.strokeStyle = 'rgba(244, 63, 94, 0.4)';
    ctx.beginPath();
    ctx.moveTo(width / 2 - 35 - 18, height / 2 + 10);
    ctx.lineTo(width / 2 - 35 + 18, height / 2 + 10);
    ctx.moveTo(width / 2 - 35, height / 2 + 10 - 18);
    ctx.lineTo(width / 2 - 35, height / 2 + 10 + 18);
    ctx.stroke();

    // HUD overlays
    ctx.filter = 'none'; // reset filter for text overlay
    ctx.fillStyle = '#0d9488';
    ctx.font = '10px monospace';
    ctx.fillText('MEDICA+ IRM SCAN v1.3', 15, 25);
    ctx.fillText(`COUPE: ${sliceIndex}/100`, 15, 40);
    ctx.fillText(`C+: ${(contrast).toFixed(1)}x`, 15, 55);
    ctx.fillText(`LUMINANCE: ${(brightness).toFixed(1)}x`, 15, 70);

    ctx.fillStyle = '#f43f5e';
    ctx.fillText('ANOMALIE CIBLÉE (G)', width - 130, 25);
    ctx.fillText('NODULE RESIDUEL ASTHMATIQUE', width - 130, 40);

    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.beginPath();
    ctx.rect(10, 10, width - 20, height - 20);
    ctx.stroke();

  }, [sliceIndex, contrast, brightness]);

  return (
    <div id="dmp-module" className="liquid-glass rounded-2xl shadow-xl overflow-hidden">
      {/* Module header */}
      <div className="bg-slate-900/90 text-white px-6 py-5 border-b border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-teal-500/10 p-2 rounded-xl text-teal-400 border border-teal-500/20">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-semibold text-lg tracking-wide">Dossier Médical Partagé (DMP)</h3>
                <span className="bg-teal-500/10 text-teal-400 border border-teal-500/20 text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full">
                  Standard FHIR R4
                </span>
              </div>
              <p className="text-xs text-slate-400">Identifiant Unique National du Patient de Yaoundé</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono">Dernière MAJ: Aujourd'hui à 08h30</span>
          </div>
        </div>
      </div>

      {/* Patient overview header banner */}
      <div className="bg-white/45 border-b border-white/20 backdrop-blur-sm px-6 py-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">Patient</span>
          <span className="text-sm font-semibold text-slate-700 block">{patientProfile.fullName}</span>
          <span className="text-xs text-slate-500 block">{patientProfile.birthDate} • {patientProfile.gender}</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">Identifiant DMP</span>
          <span className="text-xs font-mono text-teal-700 block mt-1 bg-teal-50/80 px-2 py-0.5 rounded-md border border-teal-100/50 w-fit">
            {patientProfile.id}
          </span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">Allergies Critiques</span>
          <div className="flex flex-wrap gap-1 mt-1">
            {patientProfile.allergies.map((allergy, i) => (
              <span key={i} className="bg-red-50/80 text-red-700 border border-red-100/50 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                {allergy}
              </span>
            ))}
          </div>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">Constantes / Groupe</span>
          <span className="text-xs font-bold text-slate-700 block mt-1">
            Groupe : {patientProfile.bloodType} | {patientProfile.weight} • {patientProfile.height}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-white/20 px-6 bg-white/20 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'overview'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Antécédents & Clinique
        </button>
        <button
          onClick={() => setActiveTab('consultations')}
          className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'consultations'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Historique Consultations ({consultations.length})
        </button>
        <button
          onClick={() => setActiveTab('scans')}
          className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'scans'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Visualiseur d'Imagerie IRM / CT (Interactif)
        </button>
        <button
          onClick={() => setActiveTab('fhir')}
          className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'fhir'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Payload Standard FHIR JSON
        </button>
      </div>

      {/* Tab content */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-bold text-slate-700 mb-2.5 flex items-center gap-2">
                <Heart className="w-4 h-4 text-teal-600" />
                Antécédents Médicaux Actifs
              </h4>
              <ul className="space-y-2">
                {patientProfile.antecedents.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-slate-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <h5 className="text-xs font-bold text-slate-700 mb-1">Dernière mise à jour DMP</h5>
                <p className="text-[11px] text-slate-500">Signée cryptographiquement par le Dr. Kouokam.</p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded font-bold">
                    SIGNATURE VALIDE
                  </span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <h5 className="text-xs font-bold text-slate-700 mb-1">Stockage décentralisé & Cloud</h5>
                <p className="text-[11px] text-slate-500">Réplication cryptée sur serveurs sécurisés certifiés HDS à Yaoundé.</p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-[10px] font-mono bg-teal-50 text-teal-700 border border-teal-100 px-2 py-0.5 rounded font-bold">
                    AES-256 CHIFFRÉ
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'consultations' && (
          <div className="space-y-4">
            {consultations.map((consult) => (
              <div key={consult.id} className="border border-slate-150 rounded-xl p-4 hover:shadow-sm transition-all bg-slate-50/20">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold text-teal-700">{consult.doctor} ({consult.specialty})</span>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{consult.date}</span>
                  </div>
                </div>
                <h4 className="text-xs font-bold text-slate-800 mb-1">Diagnostic: {consult.diagnosis}</h4>
                <p className="text-xs text-slate-500 leading-relaxed mb-3">{consult.notes}</p>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2.5 py-1 rounded border border-slate-200">
                    ID Consult: {consult.id}
                  </span>
                  {consult.prescriptionId && (
                    <span className="text-[10px] font-mono bg-teal-50 text-teal-700 px-2.5 py-1 rounded border border-teal-100 font-semibold">
                      Prescription liée: {consult.prescriptionId}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'scans' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 flex flex-col items-center">
              <div className="relative border-4 border-slate-900 rounded-2xl overflow-hidden shadow-lg bg-[#0a0f1d] max-w-full">
                <canvas 
                  ref={canvasRef} 
                  width={340} 
                  height={340} 
                  className="block cursor-crosshair"
                />
                <div className="absolute top-2 right-2 flex gap-1 bg-slate-950/80 px-2 py-1 rounded border border-slate-800 font-mono text-[9px] text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse my-auto" />
                  <span>LIVE HU-RECONSTRUCTION</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 text-center mt-2.5 max-w-sm">
                Faites glisser les curseurs ci-contre pour faire défiler les coupes anatomiques en temps réel et ajuster le signal.
              </p>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80">
                <h4 className="text-xs font-bold text-slate-700 mb-3 flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-teal-600" />
                  Console de reconstruction d'image
                </h4>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-semibold text-slate-600">
                      <span>Profondeur de Coupe (Z-Axis)</span>
                      <span className="font-mono text-teal-600">{sliceIndex} %</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="100"
                      value={sliceIndex}
                      onChange={(e) => setSliceIndex(parseInt(e.target.value))}
                      className="w-full accent-teal-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-semibold text-slate-600">
                      <span>Contraste Analogique</span>
                      <span className="font-mono text-teal-600">{contrast.toFixed(1)}x</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="2.5"
                      step="0.1"
                      value={contrast}
                      onChange={(e) => setContrast(parseFloat(e.target.value))}
                      className="w-full accent-teal-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-semibold text-slate-600">
                      <span>Luminance (Luminosity)</span>
                      <span className="font-mono text-teal-600">{brightness.toFixed(1)}x</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="2.0"
                      step="0.1"
                      value={brightness}
                      onChange={(e) => setBrightness(parseFloat(e.target.value))}
                      className="w-full accent-teal-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-rose-50 border border-rose-100 rounded-xl p-3.5">
                <div className="flex gap-2 text-rose-800">
                  <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
                  <div>
                    <h5 className="text-xs font-bold">Rapport d'anomalie détectée</h5>
                    <p className="text-[11px] leading-relaxed mt-1">
                      Une opacité résiduelle localisée est signalée dans le segment pulmonaire supérieur gauche. Compatible avec l'historique asthmatique du patient. 
                    </p>
                    <span className="inline-block mt-2 text-[10px] font-bold text-rose-700 bg-rose-100 border border-rose-200 px-2 py-0.5 rounded font-mono">
                      DICOM COMPLIANT
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'fhir' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">Ressource Patient - Standard FHIR R4 JSON</span>
              <span className="text-[10px] bg-teal-50 border border-teal-100 text-teal-700 font-bold px-2 py-0.5 rounded">HL7 V3</span>
            </div>
            <div className="bg-slate-900 text-emerald-400 font-mono text-xs p-4 rounded-xl border border-slate-800 overflow-x-auto max-h-[300px]">
              <pre>{`{
  "resourceType": "Patient",
  "id": "medica-yaounde-90812",
  "active": true,
  "name": [
    {
      "use": "official",
      "family": "Nguene",
      "given": ["Jean-Pierre"]
    }
  ],
  "gender": "male",
  "birthDate": "1984-11-12",
  "address": [
    {
      "use": "home",
      "line": ["Quartier Bastos, Rue 1.024"],
      "city": "Yaoundé",
      "country": "CM"
    }
  ],
  "managingOrganization": {
    "reference": "Organization/medica-plus-yaounde",
    "display": "MEDICA+ Virtual Hospital"
  }
}`}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
