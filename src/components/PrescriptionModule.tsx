import React, { useState } from 'react';
import { Pill, Plus, Trash2, ShieldCheck, Printer, CheckCircle, Award, Eye, Download } from 'lucide-react';
import { Prescription, PrescriptionItem } from '../types';

export default function PrescriptionModule() {
  const [items, setItems] = useState<PrescriptionItem[]>([
    { drug: 'Ventoline 100 µg/dose', dosage: '2 bouffées', frequency: 'En cas de crise', duration: '30 jours' },
    { drug: 'Amlodipine 5 mg', dosage: '1 comprimé', frequency: 'Le matin', duration: '30 jours' }
  ]);

  const [newDrug, setNewDrug] = useState('');
  const [newDosage, setNewDosage] = useState('1 comprimé');
  const [newFrequency, setNewFrequency] = useState('Matin et Soir');
  const [newDuration, setNewDuration] = useState('7 jours');
  const [patientName, setPatientName] = useState('Jean-Pierre Nguene');
  const [isSigned, setIsSigned] = useState(false);
  const [signedBy, setSignedBy] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const addDrugItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDrug.trim()) return;

    setItems([...items, {
      drug: newDrug,
      dosage: newDosage,
      frequency: newFrequency,
      duration: newDuration
    }]);

    setNewDrug('');
    setNewDosage('1 comprimé');
    setNewFrequency('Matin et Soir');
    setNewDuration('7 jours');
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSign = () => {
    setIsSigned(true);
    setSignedBy('Dr. Jamel Kouokam');
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
    }, 3000);
  };

  return (
    <div id="prescription-module" className="liquid-glass rounded-2xl shadow-xl overflow-hidden">
      <div className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-6 py-5 border-b border-teal-500/20">
        <div className="flex items-center gap-3">
          <div className="bg-white/10 p-2 rounded-xl text-white border border-white/20">
            <Pill className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-lg tracking-wide">Générateur d'Ordonnances Sécurisées</h3>
            <p className="text-xs text-teal-100">Signature électronique, horodatage certifié de Yaoundé & QR Code Pharmacie</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
        {/* Form panel */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3">
            <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider">Identité Patient</h4>
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-slate-500">Nom complet du Patient</label>
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full bg-white px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-teal-500 focus:outline-none"
              />
            </div>
          </div>

          <form onSubmit={addDrugItem} className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3.5">
            <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider">Ajouter un Médicament</h4>
            
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-slate-500">Nom de la molécule ou médicament</label>
              <input
                type="text"
                required
                value={newDrug}
                onChange={(e) => setNewDrug(e.target.value)}
                placeholder="ex: Doliprane 1000mg, Amoxicilline..."
                className="w-full bg-white px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-500">Posologie</label>
                <input
                  type="text"
                  value={newDosage}
                  onChange={(e) => setNewDosage(e.target.value)}
                  className="w-full bg-white px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-teal-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-500">Fréquence</label>
                <input
                  type="text"
                  value={newFrequency}
                  onChange={(e) => setNewFrequency(e.target.value)}
                  className="w-full bg-white px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-teal-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-500">Durée</label>
                <input
                  type="text"
                  value={newDuration}
                  onChange={(e) => setNewDuration(e.target.value)}
                  className="w-full bg-white px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-teal-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-teal-600 text-white py-1.5 text-xs font-semibold rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Insérer à la liste</span>
            </button>
          </form>

          {!isSigned ? (
            <button
              onClick={handleSign}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-2.5 text-xs font-bold rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all flex items-center justify-center gap-1.5 shadow-md"
            >
              <ShieldCheck className="w-4.5 h-4.5" />
              <span>Signer Numériquement l'Ordonnance</span>
            </button>
          ) : (
            <div className="bg-emerald-50 border border-emerald-150 p-4 rounded-xl flex gap-3 text-emerald-800">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
              <div className="text-xs">
                <p className="font-bold">Ordonnance validée et sécurisée !</p>
                <p className="text-[10px] opacity-90 mt-0.5">Signature cryptographique liée au Dr. Jamel Kouokam (ONMC N° 23908)</p>
                <button
                  onClick={() => setIsSigned(false)}
                  className="text-[10px] text-teal-700 font-bold hover:underline mt-2 block"
                >
                  Modifier ou Ré-initialiser
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Paper rendering panel */}
        <div className="lg:col-span-7 bg-slate-50/50 p-4 rounded-xl border border-slate-200 relative flex flex-col justify-between min-h-[420px]">
          {/* Header block of paper */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4 flex-1">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <h4 className="font-display font-bold text-slate-800 text-sm">HÔPITAL VIRTUEL MEDICA+</h4>
                <p className="text-[10px] text-slate-400">Quartier Bastos, Yaoundé, Cameroun</p>
                <p className="text-[9px] text-slate-400">Tel: +237 677 88 99 00 | support@medica.cm</p>
              </div>
              <div className="text-right">
                <h5 className="text-[10px] font-bold text-teal-600">DR. JAMEL KOUOKAM</h5>
                <p className="text-[9px] text-slate-400">Médecine Interne & Télésanté</p>
                <p className="text-[9px] text-slate-400">ONMC Cameroun : N° 23908</p>
              </div>
            </div>

            {/* Date and Patient identity */}
            <div className="flex justify-between text-xs text-slate-600">
              <span>Date: {new Date().toLocaleDateString('fr-FR')}</span>
              <span className="font-semibold text-slate-700">Patient: M. {patientName}</span>
            </div>

            {/* Medications table */}
            <div className="space-y-3 py-2">
              <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1">
                Prescriptions Médicales (Ordonnance)
              </h5>

              {items.length === 0 ? (
                <p className="text-xs text-slate-400 italic text-center py-6">Aucun médicament sélectionné.</p>
              ) : (
                <div className="space-y-2">
                  {items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between gap-3 text-xs border-b border-slate-50 pb-2">
                      <div>
                        <p className="font-semibold text-slate-700">{item.drug}</p>
                        <p className="text-[10px] text-slate-500">
                          {item.dosage} • {item.frequency} • Pendant {item.duration}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(i)}
                        className="text-slate-400 hover:text-red-500 p-1"
                        title="Retirer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer with stamp, QR, signature */}
            <div className="pt-4 border-t border-slate-100 flex justify-between items-end">
              <div>
                {isSigned ? (
                  <div className="bg-emerald-50 border border-emerald-100 px-3 py-2 rounded-lg flex items-center gap-2">
                    {/* Simulated small QR Code */}
                    <div className="w-10 h-10 bg-slate-900 flex flex-wrap p-0.5 rounded border border-slate-800 shrink-0">
                      <div className="grid grid-cols-4 gap-[2px] w-full h-full">
                        {Array.from({ length: 16 }).map((_, idx) => (
                          <div
                            key={idx}
                            className={`w-full h-full ${
                              (idx * 7 + 3) % 2 === 0 ? 'bg-white' : 'bg-slate-950'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="text-[9px] text-emerald-800">
                      <p className="font-bold">ORDO-VALID-KEY</p>
                      <p className="font-mono">ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-[10px] text-slate-400 italic">Signature en attente...</p>
                )}
              </div>
              <div className="text-right">
                <p className="text-[10px] text-slate-400">Cachet & Signature Éléctronique :</p>
                {isSigned ? (
                  <div className="mt-1 flex flex-col items-end">
                    <span className="font-display italic font-bold text-teal-700 text-xs">Jamel Kouokam</span>
                    <span className="text-[8px] bg-teal-50 border border-teal-100 text-teal-700 px-1 py-0.5 rounded uppercase font-bold font-mono">
                      Certifié ONMC
                    </span>
                  </div>
                ) : (
                  <span className="text-slate-300 italic text-xs">A signer</span>
                )}
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="mt-4 flex gap-2 justify-end">
            <button
              onClick={() => window.print()}
              disabled={items.length === 0}
              className="px-3 py-1.5 text-xs font-semibold border border-slate-300 rounded-lg hover:bg-slate-100 flex items-center gap-1 text-slate-700 disabled:opacity-50"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimer</span>
            </button>
            <button
              disabled={!isSigned}
              className="px-3 py-1.5 text-xs font-semibold bg-teal-600 text-white rounded-lg hover:bg-teal-700 flex items-center gap-1 disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Télécharger</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
