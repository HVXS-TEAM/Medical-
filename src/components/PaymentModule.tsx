import React, { useState } from 'react';
import { CreditCard, Smartphone, CheckCircle, RefreshCw, Landmark, AlertCircle, DollarSign } from 'lucide-react';

export default function PaymentModule() {
  const [method, setMethod] = useState<'momo' | 'om' | 'stripe'>('momo');
  const [phoneNumber, setPhoneNumber] = useState('677889900');
  const [amountXaf, setAmountXaf] = useState('15000'); // ~23 EUR / USD
  const [cardName, setCardName] = useState('Jean-Pierre Nguene');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [paymentState, setPaymentState] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
  const [countdown, setCountdown] = useState(25);
  const [receipt, setReceipt] = useState<any>(null);

  const startPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentState('processing');

    if (method === 'momo' || method === 'om') {
      // Simulate Mobile Money push notification approval countdown
      setCountdown(20);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            completePayment();
            return 0;
          }
          return prev - 1;
        });
      }, 500); // speed up slightly for UX test
    } else {
      // Stripe processing speed
      setTimeout(() => {
        completePayment();
      }, 1500);
    }
  };

  const completePayment = () => {
    const txnId = 'TXN-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    setReceipt({
      id: txnId,
      date: new Date().toLocaleDateString('fr-FR') + ' à ' + new Date().toLocaleTimeString('fr-FR'),
      patient: 'Jean-Pierre Nguene',
      amount: method === 'stripe' ? '$ 25.00' : `${parseInt(amountXaf).toLocaleString('fr-FR')} XAF`,
      gateway: method === 'momo' ? 'MTN Mobile Money' : method === 'om' ? 'Orange Money' : 'Stripe Security',
      status: 'Approuvé'
    });
    setPaymentState('success');
  };

  const resetPayment = () => {
    setPaymentState('idle');
    setReceipt(null);
  };

  return (
    <div id="payment-module" className="liquid-glass rounded-2xl shadow-xl overflow-hidden">
      <div className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-6 py-5 border-b border-teal-500/20">
        <div className="flex items-center gap-3">
          <div className="bg-white/10 p-2 rounded-xl text-white border border-white/20">
            <Landmark className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-lg tracking-wide">Passerelle de Paiement Médicale</h3>
            <p className="text-xs text-teal-100">Règlement consultations virtuelles, pharmacie et imageries à Yaoundé</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
        {/* Method Picker & Form */}
        <div className="lg:col-span-7 space-y-5">
          {paymentState === 'idle' && (
            <form onSubmit={startPayment} className="space-y-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">
                Sélectionnez le Moyen de Règlement
              </span>

              {/* Grid selectors */}
              <div className="grid grid-cols-3 gap-3">
                {/* MTN MoMo */}
                <button
                  type="button"
                  onClick={() => { setMethod('momo'); }}
                  className={`border p-3.5 rounded-xl transition-all text-center flex flex-col items-center gap-2 ${
                    method === 'momo'
                      ? 'border-yellow-500 bg-yellow-50/40 shadow-sm'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Smartphone className="w-6 h-6 text-yellow-600" />
                  <div className="text-[10px] font-bold text-yellow-700">MTN MoMo</div>
                  <span className="text-[8px] text-slate-400">Local (XAF)</span>
                </button>

                {/* Orange Money */}
                <button
                  type="button"
                  onClick={() => { setMethod('om'); }}
                  className={`border p-3.5 rounded-xl transition-all text-center flex flex-col items-center gap-2 ${
                    method === 'om'
                      ? 'border-orange-500 bg-orange-50/40 shadow-sm'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Smartphone className="w-6 h-6 text-orange-600" />
                  <div className="text-[10px] font-bold text-orange-700">Orange Money</div>
                  <span className="text-[8px] text-slate-400">Local (XAF)</span>
                </button>

                {/* Stripe */}
                <button
                  type="button"
                  onClick={() => { setMethod('stripe'); }}
                  className={`border p-3.5 rounded-xl transition-all text-center flex flex-col items-center gap-2 ${
                    method === 'stripe'
                      ? 'border-indigo-500 bg-indigo-50/40 shadow-sm'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <CreditCard className="w-6 h-6 text-indigo-600" />
                  <div className="text-[10px] font-bold text-indigo-700">Stripe</div>
                  <span className="text-[8px] text-slate-400">International (USD/EUR)</span>
                </button>
              </div>

              {/* Form Input fields */}
              {method !== 'stripe' ? (
                <div className="space-y-3 pt-2">
                  <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-xl text-[11px] text-slate-600 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-teal-600 shrink-0" />
                    <span>Un message Push USSD vous sera envoyé sur votre téléphone pour confirmer par code PIN secret.</span>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600">Numéro de téléphone Mobile Money (Cameroun)</label>
                    <div className="flex">
                      <span className="bg-slate-100 border border-r-0 border-slate-200 px-3 py-1.5 text-xs text-slate-500 rounded-l-lg flex items-center font-mono">
                        +237
                      </span>
                      <input
                        type="text"
                        required
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                        className="flex-1 border border-slate-200 rounded-r-lg px-3 py-1.5 text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none font-mono"
                        placeholder="677889900"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600">Montant de la Consultation (XAF)</label>
                    <input
                      type="text"
                      required
                      value={amountXaf}
                      onChange={(e) => setAmountXaf(e.target.value.replace(/\D/g, ''))}
                      className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none font-mono"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3 pt-2">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600">Titulaire de la carte</label>
                    <input
                      type="text"
                      required
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600">Numéro de carte de crédit</label>
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-600">Expiration</label>
                      <input
                        type="text"
                        required
                        placeholder="MM / YY"
                        className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-600">CVC</label>
                      <input
                        type="password"
                        required
                        placeholder="•••"
                        maxLength={4}
                        className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-2.5 text-xs font-bold rounded-xl hover:from-teal-700 hover:to-cyan-700 transition-all shadow-md flex items-center justify-center gap-1.5"
              >
                <span>Procéder au Règlement Sécurisé</span>
              </button>
            </form>
          )}

          {/* Processing Screen */}
          {paymentState === 'processing' && (
            <div className="flex flex-col items-center justify-center text-center py-12 space-y-4">
              <RefreshCw className="w-10 h-10 text-teal-600 animate-spin" />
              <div>
                <h4 className="text-sm font-bold text-slate-800">Transaction en cours de traitement...</h4>
                {method !== 'stripe' ? (
                  <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                    Consultez votre mobile. Saisissez votre code PIN secret pour autoriser la transaction. Expire dans <span className="text-rose-600 font-bold">{countdown}s</span>
                  </p>
                ) : (
                  <p className="text-xs text-slate-500 mt-1">Échange sécurisé de clés bancaires via Stripe TLS 1.3</p>
                )}
              </div>
            </div>
          )}

          {/* Success Screen */}
          {paymentState === 'success' && receipt && (
            <div className="flex flex-col items-center justify-center text-center py-8 space-y-4">
              <CheckCircle className="w-12 h-12 text-emerald-500" />
              <div>
                <h4 className="text-sm font-bold text-slate-800">Paiement Réussi !</h4>
                <p className="text-xs text-slate-500 mt-1">La consultation virtuelle MEDICA+ a été validée.</p>
              </div>

              {/* Receipt card */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 w-full text-left text-xs font-mono space-y-2">
                <p className="border-b border-slate-200 pb-1.5 font-bold text-slate-700">REÇU DE TRANSACTION</p>
                <div className="flex justify-between">
                  <span className="text-slate-400">ID TRANSACTION:</span>
                  <span className="text-slate-700 font-bold">{receipt.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">DATE & HEURE:</span>
                  <span className="text-slate-700">{receipt.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">PASSERELLE:</span>
                  <span className="text-slate-700">{receipt.gateway}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-1.5 font-bold">
                  <span className="text-slate-700">MONTANT PAYÉ:</span>
                  <span className="text-teal-700">{receipt.amount}</span>
                </div>
              </div>

              <button
                onClick={resetPayment}
                className="text-xs font-semibold text-teal-600 hover:text-teal-700 underline"
              >
                Effectuer un autre paiement
              </button>
            </div>
          )}
        </div>

        {/* Right Side: Security Badge & Pricing Details */}
        <div className="lg:col-span-5 bg-slate-50 border border-slate-100 rounded-xl p-5 flex flex-col justify-between">
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200/60 pb-1">
              Détails de la prestation
            </h4>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Téléconsultation Médicale (Générale)</span>
                <span className="text-slate-800 font-mono">10 000 XAF</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Mise à jour DMP & Signature Cryptographique</span>
                <span className="text-slate-800 font-mono">2 000 XAF</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Archivage sécurisé Ordonnance QR Code</span>
                <span className="text-slate-800 font-mono">3 000 XAF</span>
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between text-xs font-bold">
                <span className="text-slate-700">TOTAL APPLICABLE</span>
                <span className="text-teal-700 font-mono">15 000 XAF</span>
              </div>
            </div>
          </div>

          <div className="bg-teal-50 border border-teal-100 rounded-xl p-3.5 mt-6">
            <div className="flex gap-2 text-teal-800 text-xs">
              <AlertCircle className="w-4.5 h-4.5 text-teal-600 shrink-0" />
              <div>
                <p className="font-bold">Cryptage Bancaire PCI-DSS</p>
                <p className="text-[10px] leading-relaxed opacity-90 mt-0.5">
                  Aucune coordonnée bancaire n'est enregistrée. Les flux Orange, MTN et cartes de crédit internationales transitent de manière chiffrée selon les normes de l'union monétaire CEMAC.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
