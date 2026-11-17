import React, { useState, useEffect } from 'react';
import { 
  Calendar, Users, PlusCircle, LogOut, ChevronLeft, CheckCircle2,
  Lock, Eye, EyeOff, Clock, Phone, Search, CheckSquare, Square,
  ClipboardList, Pencil, Database, Download, MessageCircle, Send,
  Trash2, AlertTriangle, UserPlus, FolderTree, BarChart3, Hourglass
} from 'lucide-react';

// ============================================================================
//  IMPOSTAZIONI PRINCIPALI
// ============================================================================
const ADMIN_PIN = '1230'; 
const appId = 'euphoria-liste';

import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, query, onSnapshot, addDoc, doc, updateDoc, deleteDoc, getDocs, where } from 'firebase/firestore';

// ⚠️ INCOLLA QUI I TUOI DATI PRESI DA FIREBASE ⚠️
const firebaseConfig = {
  apiKey: "AIzaSyDWMtpGtWH5VtwiGgaQn1_rr5FBfRAIpVg",
  authDomain: "euphoria-liste.firebaseapp.com",
  projectId: "euphoria-liste",
  storageBucket: "euphoria-liste.firebasestorage.app",
  messagingSenderId: "99449448567",
  appId: "1:99449448567:web:661a6ac682421257d33e72"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Controlla se l'utente ha inserito le chiavi vere di Firebase
const isFirebaseConfigured = firebaseConfig.apiKey && !firebaseConfig.apiKey.includes("INCOLLA_QUI");

// ============================================================================
//  STILI ANIMAZIONI FLUIDE (CUSTOM CSS)
// ============================================================================
const customStyles = `
  @keyframes fadeInUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes fadeInDown { from { opacity: 0; transform: translateY(-24px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes scaleIn { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  
  .animate-fade-in-up { animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
  .animate-fade-in-down { animation: fadeInDown 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
  .animate-scale-in { animation: scaleIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
  .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; opacity: 0; }
  
  .delay-100 { animation-delay: 100ms; }
  .delay-200 { animation-delay: 200ms; }
  .delay-300 { animation-delay: 300ms; }

  .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
  .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
  .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(235, 223, 196, 0.1); border-radius: 10px; }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(207, 169, 104, 0.5); }
`;

// DIZIONARIO TRADUZIONI: IT / EN
const translations = {
  it: {
    subtitle: "Seleziona la serata e inserisciti in lista",
    noEvents: "Nessun evento in programma al momento.",
    tryLater: "Riprova più tardi!",
    joinBtn: "Mettimi in lista",
    back: "Indietro",
    name: "Nome *",
    surname: "Cognome *",
    phone: "Telefono",
    phonePlaceholder: "Inserisci un numero valido",
    email: "Email",
    prSelect: "Scegli il tuo PR *",
    prSelectDefault: "-- Seleziona PR --",
    erasmus: "Sono studente Erasmus",
    verifying: "Verifica in corso...",
    successTitle: "Iscrizione Confermata!",
    successDesc: "Sei ufficialmente in lista per la serata:",
    backToEvents: "Torna agli eventi",
    dupTitle: "Sei già in lista!",
    dupDesc: "Risulti già registrata/o per questa serata.",
    gotIt: "Ho capito",
    alertErr: "Errore durante l'iscrizione. Riprova.",
    lists: "Liste",
    admin: "Gestore",
    privacyText: "Accetto il trattamento dei dati personali *",
    privacyLink: "(Leggi l'informativa)",
    privacyTitle: "Informativa sulla Privacy",
    privacyBody: "Ai sensi del Regolamento (UE) 2016/679 (GDPR), ti informiamo che i dati personali forniti verranno utilizzati esclusivamente per la gestione delle liste d'ingresso, per finalità di sicurezza del locale e per l'invio di comunicazioni relative a futuri eventi tramite WhatsApp o Email. I dati non verranno ceduti a terzi. Puoi richiedere la cancellazione dei tuoi dati in qualsiasi momento contattando l'amministrazione.",
    close: "Chiudi",
    loadingEventsTitle: "Un attimo di pazienza...",
    loadingEventsDesc: "A breve vedrai tutti gli eventi disponibili."
  },
  en: {
    subtitle: "Select the event and join the guest list",
    noEvents: "No events scheduled at the moment.",
    tryLater: "Please try again later!",
    joinBtn: "Join the List",
    back: "Back",
    name: "First Name *",
    surname: "Last Name *",
    phone: "Phone Number",
    phonePlaceholder: "Enter a valid phone number",
    email: "Email",
    prSelect: "Choose your PR *",
    prSelectDefault: "-- Select PR --",
    erasmus: "I am an Erasmus student",
    verifying: "Verifying...",
    successTitle: "Registration Confirmed!",
    successDesc: "You are officially on the guest list for:",
    backToEvents: "Back to events",
    dupTitle: "Already on the list!",
    dupDesc: "You are already registered for this event.",
    gotIt: "Got it",
    alertErr: "Error during registration. Please try again.",
    lists: "Lists",
    admin: "Admin",
    privacyText: "I agree to the processing of personal data *",
    privacyLink: "(Read Privacy Policy)",
    privacyTitle: "Privacy Policy",
    privacyBody: "Under Regulation (EU) 2016/679 (GDPR), we inform you that the personal data provided will be used exclusively for the management of the guest lists, for venue security purposes, and for sending communications regarding future events via WhatsApp or Email. Data will not be shared with third parties. You can request the deletion of your data at any time by contacting the administration.",
    close: "Close",
    loadingEventsTitle: "Just a moment...",
    loadingEventsDesc: "Available events will appear shortly."
  }
};

const compressImage = (file, callback) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = (event) => {
    const img = new Image();
    img.src = event.target.result;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const MAX_WIDTH = 800;
      const scaleSize = MAX_WIDTH / img.width;
      canvas.width = MAX_WIDTH;
      canvas.height = img.height * scaleSize;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      callback(canvas.toDataURL('image/jpeg', 0.7));
    };
  };
};

const CustomDialog = ({ config, onClose }) => {
  const [inputValue, setInputValue] = useState('');
  if (!config) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-[#05080f]/90 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#0a101d] border border-[#cfa968]/50 rounded-md p-8 max-w-sm w-full text-center shadow-2xl animate-scale-in">
        <p className="text-[#ebdfc4] text-sm font-medium mb-8 leading-relaxed uppercase tracking-wide whitespace-pre-line">{config.message}</p>
        {config.isPrompt && (
          <input type="password" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="PIN" className="w-full bg-transparent border-b border-[#ebdfc4]/30 px-0 py-3 text-[#ebdfc4] text-center tracking-[0.5em] text-lg focus:outline-none focus:border-[#cfa968] mb-8 transition-colors" />
        )}
        <div className="flex gap-4 justify-center">
          {!config.isAlert && (<button onClick={onClose} className="flex-1 bg-transparent border border-[#ebdfc4]/20 text-[#ebdfc4]/70 hover:text-[#ebdfc4] hover:border-[#ebdfc4]/50 py-3 rounded-sm text-[10px] font-bold uppercase tracking-[0.2em] transition-colors">Annulla</button>)}
          <button onClick={() => { if(config.onConfirm) { if (config.isPrompt) config.onConfirm(inputValue); else config.onConfirm(); } onClose(); }} className="flex-1 bg-[#cfa968] hover:bg-[#cfa968]/80 text-[#05080f] py-3 rounded-sm text-[10px] font-bold uppercase tracking-[0.2em] transition-all shadow-[0_0_15px_rgba(207,169,104,0.3)]">{config.isAlert ? 'OK' : 'Conferma'}</button>
        </div>
      </div>
    </div>
  );
};

const PublicView = ({ events, isFetchingEvents, setSelectedEvent, setView, t, lang }) => {
  const now = Date.now();
  const publicEvents = events.filter(ev => ev.isVisible !== false && (!ev.expiryTimestamp || ev.expiryTimestamp > now));

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6 md:space-y-8 mb-12">
      <div className="text-center pt-8 pb-4 md:pt-10 md:pb-6 relative animate-fade-in-down">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-40 bg-[#cfa968]/10 blur-[100px] pointer-events-none"></div>
        <h1 className="text-4xl md:text-5xl font-light text-transparent bg-clip-text bg-gradient-to-r from-[#ebdfc4] via-[#cfa968] to-[#cfa968] tracking-[0.2em] uppercase drop-shadow-sm relative z-10">Guest List</h1>
        <div className="w-12 h-px bg-[#cfa968]/50 mx-auto mt-6 mb-6 relative z-10"></div>
        <p className="text-[#ebdfc4]/70 text-xs md:text-sm font-medium tracking-[0.1em] uppercase relative z-10">{t('subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
        {isFetchingEvents ? (
          <div className="col-span-full text-center py-24 border border-[#ebdfc4]/10 rounded-md bg-[#0a101d] shadow-lg animate-fade-in-up">
            <Hourglass className="w-10 h-10 text-[#cfa968] animate-[spin_3s_linear_infinite] mx-auto mb-6 drop-shadow-[0_0_15px_rgba(207,169,104,0.5)]" />
            <h3 className="text-sm font-semibold text-[#ebdfc4] tracking-[0.15em] uppercase">{t('loadingEventsTitle')}</h3>
          </div>
        ) : publicEvents.length === 0 ? (
          <div className="col-span-full text-center py-24 border border-[#ebdfc4]/10 rounded-md bg-[#0a101d] shadow-lg animate-fade-in-up">
            <p className="text-[#ebdfc4]/70 text-sm tracking-wide uppercase">{t('noEvents')}</p>
            <p className="text-[#ebdfc4]/50 text-xs mt-2">{t('tryLater')}</p>
          </div>
        ) : (
          publicEvents.map((ev, index) => (
            <div key={ev.id} className={`group flex flex-row md:flex-col bg-[#0a101d] border border-[#ebdfc4]/10 rounded-md overflow-hidden hover:border-[#cfa968]/50 transition-all duration-500 cursor-pointer shadow-xl animate-fade-in-up delay-${Math.min((index + 1) * 100, 500)} hover:-translate-y-1 hover:shadow-[#cfa968]/20`} onClick={() => { setSelectedEvent(ev); setView('register'); }}>
              <div className="w-2/5 md:w-full h-auto md:h-80 min-h-[140px] md:min-h-0 overflow-hidden relative bg-[#05080f] shrink-0 border-r border-[#ebdfc4]/10 md:border-r-0">
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a101d] via-[#0a101d]/20 to-transparent z-10"></div>
                <img src={ev.imageUrl || 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=800&auto=format&fit=crop'} alt={ev.title} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
              </div>
              <div className="w-3/5 md:w-full p-4 md:p-6 flex flex-col flex-1 justify-between bg-[#0a101d] relative z-20">
                <div>
                  <div className="flex items-center text-[#cfa968] mb-2 md:mb-3 text-[9px] md:text-[10px] font-bold tracking-[0.1em] md:tracking-[0.2em] uppercase"><Calendar className="w-3 h-3 mr-1.5 md:mr-2 shrink-0" /><span className="truncate">{new Date(ev.date).toLocaleDateString(lang === 'it' ? 'it-IT' : 'en-US', { weekday: 'short', day: 'numeric', month: 'long' })}</span></div>
                  <h3 className="text-sm md:text-xl font-medium text-[#ebdfc4] uppercase tracking-widest leading-tight">{ev.title}</h3>
                </div>
                <div className="mt-3 md:mt-8"><button className="w-full border border-[#cfa968]/50 text-[#cfa968] group-hover:bg-[#cfa968] group-hover:text-[#05080f] py-2 md:py-3 rounded-sm text-[9px] md:text-xs font-semibold uppercase tracking-[0.15em] transition-all duration-300">{t('joinBtn')}</button></div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const RegistrationForm = ({ selectedEvent, prs, prGroups, setView, t, lang, showDialog }) => {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', phone: '', email: '', isErasmus: false, selectedPR: '' });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const assignedGroupIds = selectedEvent?.prGroupIds || [];
  const eventGroups = prGroups.filter(g => assignedGroupIds.includes(g.id));
  const allPrIds = new Set();
  eventGroups.forEach(g => { (g.prIds || []).forEach(id => allPrIds.add(id)); });
  const availablePRs = prs.filter(pr => allPrIds.has(pr.id));
  const requiresPR = availablePRs.length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (requiresPR && !formData.selectedPR) { showDialog(t('prSelect')); return; }
    setIsSubmitting(true);
    const cleanInputPhone = (formData.phone || '').replace(/\D/g, '');

    try {
      const regPath = collection(db, 'artifacts', appId, 'registrations');
      const q = query(regPath, where('eventId', '==', selectedEvent.id), where('isCancelled', '==', false));
      const snapshot = await getDocs(q);
      const existingRegs = snapshot.docs.map(doc => doc.data());

      const isDuplicate = existingRegs.some(r => {
        const cleanExistingPhone = (r.phone || '').replace(/\D/g, '');
        if (cleanInputPhone && cleanExistingPhone) return cleanExistingPhone === cleanInputPhone;
        return r.firstName.toLowerCase().trim() === formData.firstName.toLowerCase().trim() && r.lastName.toLowerCase().trim() === formData.lastName.toLowerCase().trim();
      });

      if (isDuplicate) { setShowDuplicateModal(true); setIsSubmitting(false); return; }
      
      const prName = availablePRs.find(pr => pr.id === formData.selectedPR)?.name || '';
      await addDoc(regPath, { ...formData, prName, eventId: selectedEvent.id, timestamp: Date.now(), isCancelled: false, entered: false });
      setSubmitted(true);
    } catch (error) { console.error(error); showDialog(t('alertErr')); }
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-xl mx-auto p-4 relative z-10 mb-12 animate-fade-in-up">
      {submitted && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#05080f]/90 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0a101d] border border-[#cfa968]/50 rounded-md p-10 max-w-sm w-full text-center shadow-2xl animate-scale-in">
            <CheckCircle2 className="w-16 h-16 text-[#cfa968] mx-auto mb-6 drop-shadow-[0_0_15px_rgba(207,169,104,0.5)]" strokeWidth={1} />
            <h2 className="text-xl font-light text-[#ebdfc4] mb-4 uppercase tracking-[0.15em]">{t('successTitle')}</h2>
            <p className="text-[#ebdfc4]/70 text-sm font-light mb-6">{t('successDesc')}</p>
            <p className="text-[#cfa968] font-medium text-lg mb-10 tracking-widest uppercase">{selectedEvent?.title}</p>
            <button onClick={() => { setView('public'); setSubmitted(false); }} className="w-full bg-[#cfa968] hover:bg-[#cfa968]/90 text-[#05080f] py-4 rounded-sm text-xs font-bold uppercase tracking-[0.2em] transition-all active:scale-95 shadow-[0_0_15px_rgba(207,169,104,0.3)]">{t('backToEvents')}</button>
          </div>
        </div>
      )}
      {showDuplicateModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#05080f]/90 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0a101d] border border-[#cfa968]/50 rounded-md p-10 max-w-sm w-full text-center shadow-2xl animate-scale-in">
            <AlertTriangle className="w-16 h-16 text-[#cfa968] mx-auto mb-6 drop-shadow-[0_0_15px_rgba(207,169,104,0.5)]" strokeWidth={1} />
            <h2 className="text-xl font-light text-[#ebdfc4] mb-4 uppercase tracking-[0.15em]">{t('dupTitle')}</h2>
            <p className="text-[#ebdfc4]/70 text-sm font-light mb-10">{t('dupDesc')}</p>
            <button onClick={() => setShowDuplicateModal(false)} className="w-full border border-[#cfa968]/50 hover:border-[#cfa968] text-[#cfa968] hover:text-[#05080f] hover:bg-[#cfa968] py-4 rounded-sm text-xs font-bold uppercase tracking-[0.2em] transition-colors active:scale-95 shadow-[0_0_15px_rgba(207,169,104,0.2)]">{t('gotIt')}</button>
          </div>
        </div>
      )}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#05080f]/90 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0a101d] border border-[#ebdfc4]/10 rounded-md p-8 sm:p-10 max-w-lg w-full shadow-2xl animate-scale-in">
            <h2 className="text-lg font-medium text-[#ebdfc4] mb-6 uppercase tracking-[0.15em] border-b border-[#ebdfc4]/10 pb-4">{t('privacyTitle')}</h2>
            <div className="text-[#ebdfc4]/70 text-sm font-light leading-loose mb-10 max-h-[50vh] overflow-y-auto pr-4 custom-scrollbar">{t('privacyBody')}</div>
            <button onClick={() => setShowPrivacyModal(false)} className="w-full bg-[#121a2f] border border-[#ebdfc4]/20 hover:bg-[#ebdfc4]/10 text-[#ebdfc4] py-4 rounded-sm text-xs font-bold uppercase tracking-[0.2em] transition-colors active:scale-95">{t('close')}</button>
          </div>
        </div>
      )}

      <button onClick={() => setView('public')} className="flex items-center text-[#ebdfc4]/50 hover:text-[#cfa968] mb-8 transition-all hover:-translate-x-2 uppercase text-[10px] font-bold tracking-[0.2em]"><ChevronLeft className="w-4 h-4 mr-1" /> {t('back')}</button>
      
      <div className="bg-[#0a101d] border border-[#ebdfc4]/10 rounded-md p-8 md:p-10 shadow-xl">
        <div className="mb-10 text-center">
          <h2 className="text-2xl md:text-3xl font-light text-[#ebdfc4] mb-2 uppercase tracking-[0.15em] leading-tight">{selectedEvent?.title}</h2>
          <p className="text-[#cfa968] text-[10px] font-bold tracking-[0.2em] uppercase">{new Date(selectedEvent?.date).toLocaleDateString(lang === 'it' ? 'it-IT' : 'en-US', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
        </div>
        
        {selectedEvent?.notes && (
          <div className="mb-10 p-5 bg-[#cfa968]/10 border border-[#cfa968]/30 rounded-sm">
            <p className="text-[#cfa968]/90 text-xs leading-relaxed whitespace-pre-line text-center italic tracking-wide">{selectedEvent.notes}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="relative"><label className="block text-[10px] font-bold text-[#ebdfc4]/50 mb-2 uppercase tracking-[0.15em]">{t('name')}</label><input required type="text" className="w-full bg-transparent border-b border-[#ebdfc4]/30 rounded-none px-0 py-2 text-[#ebdfc4] focus:outline-none focus:border-[#cfa968] transition-colors text-sm" onChange={e => setFormData({...formData, firstName: e.target.value})} /></div>
            <div className="relative"><label className="block text-[10px] font-bold text-[#ebdfc4]/50 mb-2 uppercase tracking-[0.15em]">{t('surname')}</label><input required type="text" className="w-full bg-transparent border-b border-[#ebdfc4]/30 rounded-none px-0 py-2 text-[#ebdfc4] focus:outline-none focus:border-[#cfa968] transition-colors text-sm" onChange={e => setFormData({...formData, lastName: e.target.value})} /></div>
          </div>
          {selectedEvent?.askPhone !== false && (
            <div className="relative"><label className="block text-[10px] font-bold text-[#ebdfc4]/50 mb-2 uppercase tracking-[0.15em]">{t('phone')}</label><input type="tel" pattern="^\+?[0-9\s\-\(\)]{6,20}$" title={t('phonePlaceholder')} className="w-full bg-transparent border-b border-[#ebdfc4]/30 rounded-none px-0 py-2 text-[#ebdfc4] focus:outline-none focus:border-[#cfa968] transition-colors text-sm" onChange={e => setFormData({...formData, phone: e.target.value})} /></div>
          )}
          {selectedEvent?.askEmail !== false && (
            <div className="relative"><label className="block text-[10px] font-bold text-[#ebdfc4]/50 mb-2 uppercase tracking-[0.15em]">{t('email')}</label><input type="email" pattern="[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$" className="w-full bg-transparent border-b border-[#ebdfc4]/30 rounded-none px-0 py-2 text-[#ebdfc4] focus:outline-none focus:border-[#cfa968] transition-colors text-sm" onChange={e => setFormData({...formData, email: e.target.value})} /></div>
          )}
          {requiresPR && (
            <div className="relative"><label className="block text-[10px] font-bold text-[#cfa968] mb-2 uppercase tracking-[0.15em]">{t('prSelect')}</label><select required className="w-full bg-[#121a2f] border border-[#ebdfc4]/10 rounded-sm px-4 py-3 text-[#ebdfc4] focus:outline-none focus:border-[#cfa968] appearance-none transition-colors text-sm" onChange={e => setFormData({...formData, selectedPR: e.target.value})}><option value="" className="text-[#ebdfc4]/50">{t('prSelectDefault')}</option>{availablePRs.map(pr => <option key={pr.id} value={pr.id}>{pr.name}</option>)}</select></div>
          )}
          <div className="flex items-center gap-3 pt-2 cursor-pointer group" onClick={() => setFormData({...formData, isErasmus: !formData.isErasmus})}><div className={`w-5 h-5 rounded-sm flex items-center justify-center border transition-colors ${formData.isErasmus ? 'bg-[#cfa968] border-[#cfa968] text-[#05080f]' : 'bg-transparent border-[#ebdfc4]/30 text-transparent group-hover:border-[#cfa968]'}`}><CheckSquare className="w-3.5 h-3.5" /></div><label className="text-[11px] text-[#ebdfc4]/70 uppercase tracking-wider cursor-pointer select-none">{t('erasmus')}</label></div>
          <div className="flex items-start gap-4 pt-4 border-t border-[#ebdfc4]/10"><div className="mt-0.5 cursor-pointer shrink-0" onClick={() => setPrivacyAccepted(!privacyAccepted)}><div className={`w-5 h-5 rounded-sm flex items-center justify-center border transition-all duration-300 ${privacyAccepted ? 'bg-[#cfa968]/20 border-[#cfa968] text-[#cfa968] scale-105' : 'bg-transparent border-[#ebdfc4]/30 text-transparent hover:border-[#ebdfc4]/50'}`}>{privacyAccepted ? <CheckSquare className="w-3.5 h-3.5" /> : <Square className="w-3.5 h-3.5 text-transparent" />}</div></div><label className="text-[11px] text-[#ebdfc4]/60 leading-relaxed select-none uppercase tracking-wider">{t('privacyText')} <span className="text-[#cfa968] underline cursor-pointer hover:text-[#cfa968]/80 transition-colors ml-1" onClick={(e) => { e.stopPropagation(); setShowPrivacyModal(true); }}>{t('privacyLink')}</span></label></div>
          <button disabled={isSubmitting || !privacyAccepted} type="submit" className="w-full bg-[#cfa968] text-[#05080f] hover:bg-[#cfa968]/90 border border-[#cfa968]/50 py-4 rounded-sm text-xs font-bold uppercase tracking-[0.2em] mt-8 disabled:opacity-40 disabled:grayscale transition-all duration-300 active:scale-[0.98] shadow-lg shadow-[#cfa968]/20">{isSubmitting ? t('verifying') : t('joinBtn')}</button>
        </form>
      </div>
    </div>
  );
};

const AdminLogin = ({ setIsAdminAuth, setView, showDialog }) => {
  const [pin, setPin] = useState('');
  const handleLogin = (e) => {
    e.preventDefault();
    if (pin === ADMIN_PIN) { setIsAdminAuth(true); setView('admin-dashboard'); } 
    else { showDialog("PIN errato.", null, false); }
  };
  return (
    <div className="max-w-sm mx-auto p-4 pt-24 relative animate-fade-in-up">
      <div className="bg-[#0a101d] border border-[#ebdfc4]/10 rounded-md p-10 text-center shadow-2xl relative z-10"><Lock className="w-10 h-10 text-[#cfa968] mx-auto mb-6 drop-shadow-[0_0_15px_rgba(207,169,104,0.5)]" strokeWidth={1.5} /><h2 className="text-lg font-light text-[#ebdfc4] mb-8 uppercase tracking-[0.2em]">Area Gestore</h2><form onSubmit={handleLogin}><input type="password" placeholder="PIN" className="w-full bg-transparent border-b border-[#ebdfc4]/30 px-0 py-3 text-[#ebdfc4] text-center tracking-[0.5em] text-lg focus:outline-none focus:border-[#cfa968] mb-10 transition-colors" value={pin} onChange={e => setPin(e.target.value)} /><button type="submit" className="w-full bg-[#cfa968] hover:bg-[#cfa968]/90 text-[#05080f] py-4 rounded-sm text-xs font-bold uppercase tracking-[0.2em] transition-all shadow-[0_0_15px_rgba(207,169,104,0.3)]">Accedi</button></form><button onClick={() => setView('public')} className="mt-8 text-[10px] font-bold uppercase tracking-[0.15em] text-[#ebdfc4]/50 hover:text-[#ebdfc4] transition-colors">Torna al sito</button></div>
    </div>
  );
};

const AdminHeader = ({ view, setView, setIsAdminAuth }) => (
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[#0a101d] p-4 sm:p-6 rounded-md border border-[#ebdfc4]/10 border-t-[#cfa968]/50 gap-6 mb-10 shadow-lg shadow-[#05080f]/50">
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 w-full sm:w-auto"><h1 className="text-sm font-medium text-[#ebdfc4] flex items-center uppercase tracking-[0.2em]"><Lock className="w-4 h-4 mr-3 text-[#cfa968]"/> Gestore</h1><div className="w-full h-px sm:w-px sm:h-6 bg-[#ebdfc4]/10 hidden sm:block"></div><div className="flex gap-2 bg-[#05080f] p-1.5 rounded-sm border border-[#ebdfc4]/10 overflow-x-auto whitespace-nowrap custom-scrollbar w-full sm:w-auto"><button onClick={() => setView('admin-dashboard')} className={`px-4 py-2 rounded-sm text-[10px] font-bold uppercase tracking-[0.15em] transition-all ${view === 'admin-dashboard' || view === 'admin-event-details' || view === 'admin-event-report' ? 'bg-[#cfa968]/20 text-[#cfa968] border border-[#cfa968]/30' : 'text-[#ebdfc4]/50 hover:text-[#ebdfc4] border border-transparent'}`}>Serate</button><button onClick={() => setView('admin-pr')} className={`px-4 py-2 rounded-sm text-[10px] font-bold uppercase tracking-[0.15em] transition-all ${view === 'admin-pr' ? 'bg-[#cfa968]/20 text-[#cfa968] border border-[#cfa968]/30' : 'text-[#ebdfc4]/50 hover:text-[#ebdfc4] border border-transparent'}`}>PR & Gruppi</button><button onClick={() => setView('admin-contacts')} className={`px-4 py-2 rounded-sm text-[10px] font-bold uppercase tracking-[0.15em] transition-all ${view === 'admin-contacts' ? 'bg-[#cfa968]/20 text-[#cfa968] border border-[#cfa968]/30' : 'text-[#ebdfc4]/50 hover:text-[#ebdfc4] border border-transparent'}`}>Database</button></div></div><button onClick={() => { setIsAdminAuth(false); setView('public'); }} className="flex items-center text-[#ebdfc4]/50 hover:text-[#cfa968] text-[10px] font-bold uppercase tracking-[0.15em] transition-colors"><LogOut className="w-4 h-4 mr-2" /> Esci</button>
  </div>
);

const AdminDashboard = ({ events, registrations, prGroups, view, setView, setIsAdminAuth, setSelectedEvent, showDialog }) => {
  const [editingEventId, setEditingEventId] = useState(null);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDate, setNewEventDate] = useState('');
  const [newEventImage, setNewEventImage] = useState('');
  const [newEventListPassword, setNewEventListPassword] = useState('');
  const [newEventPrGroupIds, setNewEventPrGroupIds] = useState([]); 
  const [newEventExpiryDate, setNewEventExpiryDate] = useState('');
  const [newEventExpiryTime, setNewEventExpiryTime] = useState('');
  const [newEventAskPhone, setNewEventAskPhone] = useState(true);
  const [newEventAskEmail, setNewEventAskEmail] = useState(true);
  const [newEventNotes, setNewEventNotes] = useState('');

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) compressImage(file, setNewEventImage);
  };

  const handleEditClick = (ev) => {
    setEditingEventId(ev.id); setNewEventTitle(ev.title || ''); setNewEventDate(ev.date || ''); setNewEventImage(ev.imageUrl || ''); setNewEventListPassword(ev.listPassword || ''); setNewEventPrGroupIds(ev.prGroupIds || []); setNewEventAskPhone(ev.askPhone !== false); setNewEventAskEmail(ev.askEmail !== false); setNewEventNotes(ev.notes || '');
    if (ev.expiryTimestamp) {
      const d = new Date(ev.expiryTimestamp);
      setNewEventExpiryDate(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`);
      setNewEventExpiryTime(`${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`);
    } else { setNewEventExpiryDate(''); setNewEventExpiryTime(''); }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingEventId(null); setNewEventTitle(''); setNewEventDate(''); setNewEventImage(''); setNewEventListPassword(''); setNewEventPrGroupIds([]); setNewEventExpiryDate(''); setNewEventExpiryTime(''); setNewEventAskPhone(true); setNewEventAskEmail(true); setNewEventNotes('');
  };

  const handleSaveEvent = async (e) => {
    e.preventDefault();
    if (!newEventTitle || !newEventDate || !newEventListPassword) return;
    let expiryTimestamp = null;
    if (newEventExpiryDate && newEventExpiryTime) expiryTimestamp = new Date(`${newEventExpiryDate}T${newEventExpiryTime}`).getTime();
    
    const eventData = { title: newEventTitle, date: newEventDate, imageUrl: newEventImage, listPassword: newEventListPassword, prGroupIds: newEventPrGroupIds, isVisible: true, expiryTimestamp, askPhone: newEventAskPhone, askEmail: newEventAskEmail, notes: newEventNotes };
    
    try {
      if (editingEventId) await updateDoc(doc(db, 'artifacts', appId, 'events', editingEventId), eventData);
      else await addDoc(collection(db, 'artifacts', appId, 'events'), { ...eventData, createdAt: Date.now() });
      handleCancelEdit();
    } catch (error) { console.error(error); showDialog("Errore durante il salvataggio."); }
  };

  const handleDeleteEvent = (ev) => {
    showDialog(`Eliminare definitivamente l'evento "${ev.title}"?`, async () => {
      try { await deleteDoc(doc(db, 'artifacts', appId, 'events', ev.id)); } catch (error) { console.error(error); }
    });
  };

  const toggleVisibility = async (ev) => {
    try { await updateDoc(doc(db, 'artifacts', appId, 'events', ev.id), { isVisible: !(ev.isVisible !== false) }); } catch (error) { console.error(error); }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-12 mb-12">
      <AdminHeader view={view} setView={setView} setIsAdminAuth={setIsAdminAuth} />
      
      <div className={`bg-[#0a101d] p-8 md:p-10 rounded-md border shadow-xl transition-colors duration-500 ${editingEventId ? 'border-[#cfa968]/50' : 'border-[#ebdfc4]/10'}`}>
        <h2 className="text-sm font-medium text-[#ebdfc4] mb-8 uppercase tracking-[0.2em] flex items-center border-b border-[#ebdfc4]/10 pb-4">{editingEventId ? <Pencil className="w-4 h-4 mr-3 text-[#cfa968]"/> : <PlusCircle className="w-4 h-4 mr-3 text-[#cfa968]"/>} {editingEventId ? 'Modifica Serata' : 'Crea Serata'}</h2>
        <form onSubmit={handleSaveEvent} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div><label className="block text-[10px] font-bold text-[#ebdfc4]/50 mb-2 uppercase tracking-[0.15em]">Nome Serata *</label><input required type="text" className="w-full bg-transparent border-b border-[#ebdfc4]/30 px-0 py-2 text-[#ebdfc4] focus:outline-none focus:border-[#cfa968] text-sm transition-colors" value={newEventTitle} onChange={e => setNewEventTitle(e.target.value)} /></div>
            <div><label className="block text-[10px] font-bold text-[#ebdfc4]/50 mb-2 uppercase tracking-[0.15em]">Data Evento *</label><input required type="date" className="w-full bg-transparent border-b border-[#ebdfc4]/30 px-0 py-2 text-[#ebdfc4] focus:outline-none focus:border-[#cfa968] text-sm transition-colors [color-scheme:dark]" value={newEventDate} onChange={e => setNewEventDate(e.target.value)} /></div>
            <div><label className="block text-[10px] font-bold text-[#ebdfc4]/50 mb-2 uppercase tracking-[0.15em]">Locandina (File)</label><input type="file" accept="image/*" className="w-full bg-transparent border-b border-[#ebdfc4]/30 px-0 py-2 text-[#ebdfc4]/50 text-xs transition-colors file:mr-4 file:py-1 file:px-3 file:rounded-sm file:border-0 file:text-[10px] file:font-bold file:uppercase file:bg-[#ebdfc4]/10 file:text-[#ebdfc4]/90 hover:file:bg-[#ebdfc4]/20 cursor-pointer" onChange={handleImageUpload} /></div>
            <div><label className="block text-[10px] font-bold text-[#ebdfc4]/50 mb-2 uppercase tracking-[0.15em]">Password Sicurezza Liste *</label><input required type="text" className="w-full bg-transparent border-b border-[#ebdfc4]/30 px-0 py-2 text-[#ebdfc4] focus:outline-none focus:border-[#cfa968] text-sm transition-colors" value={newEventListPassword} onChange={e => setNewEventListPassword(e.target.value)} /></div>
            
            <div className="md:col-span-2 p-6 bg-[#121a2f] border border-[#ebdfc4]/10 rounded-sm grid grid-cols-1 md:grid-cols-2 gap-8">
              <div><label className="block text-[10px] font-bold text-[#cfa968] mb-2 uppercase tracking-[0.15em]">Data Scadenza Liste (Opzionale)</label><input type="date" className="w-full bg-transparent border-b border-[#ebdfc4]/30 px-0 py-2 text-[#ebdfc4] focus:outline-none focus:border-[#cfa968] transition-colors text-sm [color-scheme:dark]" value={newEventExpiryDate} onChange={e => setNewEventExpiryDate(e.target.value)} /></div>
              <div><label className="block text-[10px] font-bold text-[#cfa968] mb-2 uppercase tracking-[0.15em]">Ora Scadenza Liste (Opzionale)</label><input type="time" className="w-full bg-transparent border-b border-[#ebdfc4]/30 px-0 py-2 text-[#ebdfc4] focus:outline-none focus:border-[#cfa968] transition-colors text-sm [color-scheme:dark]" value={newEventExpiryTime} onChange={e => setNewEventExpiryTime(e.target.value)} /></div>
            </div>
            
            <div className="md:col-span-2 p-6 bg-[#121a2f] border border-[#ebdfc4]/10 rounded-sm"><label className="block text-[10px] font-bold text-[#ebdfc4]/50 mb-4 uppercase tracking-[0.15em]">Categorie PR Abilitate</label><div className="flex flex-wrap gap-3">{prGroups.length === 0 ? <span className="text-[#ebdfc4]/40 text-xs italic">Nessun gruppo PR.</span> : prGroups.map(g => { const isActive = newEventPrGroupIds.includes(g.id); return (<div key={g.id} onClick={() => { if (isActive) setNewEventPrGroupIds(newEventPrGroupIds.filter(id => id !== g.id)); else setNewEventPrGroupIds([...newEventPrGroupIds, g.id]); }} className={`px-4 py-2 rounded-sm text-[10px] font-bold uppercase tracking-widest cursor-pointer border transition-colors ${isActive ? 'bg-[#cfa968]/20 border-[#cfa968]/50 text-[#cfa968]' : 'bg-transparent border-[#ebdfc4]/20 text-[#ebdfc4]/50 hover:border-[#ebdfc4]/40'}`}>{g.name}</div>); })}</div></div>

            <div className="md:col-span-2 p-6 bg-[#121a2f] border border-[#ebdfc4]/10 rounded-sm"><label className="block text-[10px] font-bold text-[#ebdfc4]/50 mb-4 uppercase tracking-[0.15em]">Campi Richiesti</label><div className="flex flex-col sm:flex-row gap-6"><label className="flex items-center gap-3 text-xs text-[#ebdfc4]/70 uppercase tracking-widest cursor-pointer hover:text-[#ebdfc4] transition-colors"><div className={`w-4 h-4 rounded-sm flex items-center justify-center border transition-colors ${newEventAskPhone ? 'bg-[#cfa968]/20 border-[#cfa968]/50 text-[#cfa968]' : 'bg-transparent border-[#ebdfc4]/30 text-transparent'}`}>{newEventAskPhone ? <CheckSquare className="w-3 h-3" /> : <Square className="w-3 h-3" />}</div><input type="checkbox" className="hidden" checked={newEventAskPhone} onChange={e => setNewEventAskPhone(e.target.checked)} />Telefono</label><label className="flex items-center gap-3 text-xs text-[#ebdfc4]/70 uppercase tracking-widest cursor-pointer hover:text-[#ebdfc4] transition-colors"><div className={`w-4 h-4 rounded-sm flex items-center justify-center border transition-colors ${newEventAskEmail ? 'bg-[#cfa968]/20 border-[#cfa968]/50 text-[#cfa968]' : 'bg-transparent border-[#ebdfc4]/30 text-transparent'}`}>{newEventAskEmail ? <CheckSquare className="w-3 h-3" /> : <Square className="w-3 h-3" />}</div><input type="checkbox" className="hidden" checked={newEventAskEmail} onChange={e => setNewEventAskEmail(e.target.checked)} />Email</label></div></div>
            
            <div className="md:col-span-2"><label className="block text-[10px] font-bold text-[#ebdfc4]/50 mb-2 uppercase tracking-[0.15em]">Note (Opzionale)</label><textarea rows={2} className="w-full bg-transparent border-b border-[#ebdfc4]/30 px-0 py-2 text-[#ebdfc4] focus:outline-none focus:border-[#cfa968] transition-colors text-sm resize-none" value={newEventNotes} onChange={e => setNewEventNotes(e.target.value)}></textarea></div>
          </div>
          <div className="flex gap-4 pt-4 border-t border-[#ebdfc4]/10">{editingEventId && <button type="button" onClick={handleCancelEdit} className="w-1/3 bg-transparent border border-[#ebdfc4]/30 text-[#ebdfc4]/70 hover:text-[#ebdfc4] hover:bg-[#ebdfc4]/10 py-3 rounded-sm text-[10px] font-bold uppercase tracking-[0.2em] transition-colors">Annulla</button>}<button type="submit" className={`${editingEventId ? 'w-2/3' : 'w-full'} bg-[#cfa968] text-[#05080f] hover:bg-[#cfa968]/90 border border-[#cfa968]/50 py-3 rounded-sm text-[10px] font-bold uppercase tracking-[0.2em] transition-colors shadow-lg shadow-[#cfa968]/20`}>{editingEventId ? 'Salva Modifiche' : 'Crea Serata'}</button></div>
        </form>
      </div>

      <div>
        <h2 className="text-sm font-medium text-[#ebdfc4] mb-6 uppercase tracking-[0.2em]">Elenco Serate</h2>
        <div className="grid gap-6">
          {events.map(ev => {
            const countIscritti = registrations.filter(r => r.eventId === ev.id && !r.isCancelled).length;
            const isVisible = ev.isVisible !== false;
            const isExpired = ev.expiryTimestamp && ev.expiryTimestamp < Date.now();
            return (
              <div key={ev.id} className={`bg-[#0a101d] border ${isExpired ? 'border-[#cfa968]/30' : 'border-[#ebdfc4]/10'} rounded-md p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-lg group hover:border-[#cfa968]/50 transition-all`}>
                <div className="flex gap-6 items-center w-full md:w-auto"><div className="w-24 h-24 rounded-sm overflow-hidden bg-[#05080f] border border-[#ebdfc4]/10 relative shrink-0"><img src={ev.imageUrl || 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=200&auto=format&fit=crop'} alt="locandina" className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${isExpired ? 'opacity-40 grayscale' : 'opacity-100'}`}/>{!isVisible && <div className="absolute inset-0 bg-[#05080f]/80 flex items-center justify-center z-10"><EyeOff className="w-5 h-5 text-[#ebdfc4]/50"/></div>}</div><div><h3 className={`text-lg font-medium uppercase tracking-[0.15em] mb-1 ${isExpired ? 'text-[#ebdfc4]/40' : 'text-[#ebdfc4]'}`}>{ev.title}</h3><div className="text-[#ebdfc4]/50 text-xs tracking-widest uppercase mb-4">{new Date(ev.date).toLocaleDateString('it-IT')}</div><div className="flex flex-wrap gap-4 text-[10px] uppercase tracking-widest font-bold"><div className="text-[#ebdfc4]/50">PWD: <span className="text-[#cfa968]">{ev.listPassword}</span></div>{isExpired && <div className="text-[#cfa968]/80">Scaduto</div>}</div></div></div>
                <div className="flex items-center gap-4 flex-wrap sm:flex-nowrap border-t md:border-t-0 border-[#ebdfc4]/10 pt-4 md:pt-0 w-full md:w-auto"><div className="flex items-center gap-2"><button onClick={() => toggleVisibility(ev)} title={isVisible ? 'Nascondi' : 'Mostra'} className={`p-3 rounded-sm border transition-colors ${isVisible ? 'bg-[#cfa968]/10 text-[#cfa968] border-[#cfa968]/30 hover:bg-[#cfa968]/20' : 'bg-transparent text-[#ebdfc4]/50 border-[#ebdfc4]/20 hover:text-[#ebdfc4]/80'}`}><Eye className="w-4 h-4"/></button><button onClick={() => handleEditClick(ev)} title="Modifica" className="p-3 rounded-sm border border-[#ebdfc4]/20 text-[#ebdfc4]/50 hover:text-[#cfa968] hover:border-[#cfa968]/50 transition-colors"><Pencil className="w-4 h-4"/></button><button onClick={() => { setSelectedEvent(ev); setView('admin-event-report'); }} title="Report PR" className="p-3 rounded-sm border border-[#ebdfc4]/20 text-[#ebdfc4]/50 hover:text-[#cfa968] hover:border-[#cfa968]/50 transition-colors"><BarChart3 className="w-4 h-4"/></button><button onClick={() => handleDeleteEvent(ev)} title="Elimina" className="p-3 rounded-sm border border-transparent text-[#ebdfc4]/40 hover:text-[#cfa968] hover:bg-[#cfa968]/10 transition-colors"><Trash2 className="w-4 h-4"/></button></div><div className="w-px h-8 bg-[#ebdfc4]/10 hidden md:block"></div><div className="flex items-center justify-between w-full md:w-auto gap-4"><div className="text-[#cfa968] text-xs font-bold tracking-widest px-2"><Users className="w-4 h-4 inline mr-2 text-[#ebdfc4]/50"/>{countIscritti}</div><button onClick={() => { setSelectedEvent(ev); setView('admin-event-details'); }} className="bg-[#ebdfc4]/10 hover:bg-[#ebdfc4]/20 text-[#ebdfc4] px-6 py-3 rounded-sm text-[10px] font-bold uppercase tracking-[0.15em] transition-colors whitespace-nowrap">Liste</button></div></div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const AdminPRView = ({ prs, prGroups, view, setView, setIsAdminAuth, showDialog }) => {
  const [newPRName, setNewPRName] = useState('');
  const [newGroupName, setNewGroupName] = useState('');
  
  const handleCreatePR = async (e) => { e.preventDefault(); if (!newPRName.trim()) return; try { await addDoc(collection(db, 'artifacts', appId, 'prs'), { name: newPRName, createdAt: Date.now() }); setNewPRName(''); } catch (error) { console.error(error); } };
  const handleDeletePR = (pr, e) => { e.preventDefault(); e.stopPropagation(); showDialog(`Eliminare PR?`, async () => { try { await deleteDoc(doc(db, 'artifacts', appId, 'prs', pr.id)); } catch (error) { console.error(error); } }); };
  const handleCreateGroup = async (e) => { e.preventDefault(); if (!newGroupName.trim()) return; try { await addDoc(collection(db, 'artifacts', appId, 'pr_groups'), { name: newGroupName, prIds: [], createdAt: Date.now() }); setNewGroupName(''); } catch (error) { console.error(error); } };
  const handleDeleteGroup = (group, e) => { e.preventDefault(); e.stopPropagation(); showDialog(`Eliminare Categoria?`, async () => { try { await deleteDoc(doc(db, 'artifacts', appId, 'pr_groups', group.id)); } catch (error) { console.error(error); } }); };
  const togglePRInGroup = async (group, prId) => { try { const newPrIds = (group.prIds || []).includes(prId) ? group.prIds.filter(id => id !== prId) : [...(group.prIds || []), prId]; await updateDoc(doc(db, 'artifacts', appId, 'pr_groups', group.id), { prIds: newPrIds }); } catch (error) { console.error(error); } };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-8 mb-12">
      <AdminHeader view={view} setView={setView} setIsAdminAuth={setIsAdminAuth} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6"><div className="bg-[#0a101d] p-8 rounded-md border border-[#ebdfc4]/10 shadow-lg"><h2 className="text-sm font-medium text-[#ebdfc4] mb-6 uppercase tracking-[0.15em] flex items-center"><UserPlus className="w-4 h-4 mr-3 text-[#cfa968]"/> 1. Crea PR</h2><form onSubmit={handleCreatePR} className="flex gap-4"><input required type="text" placeholder="Nome PR" className="flex-1 bg-transparent border-b border-[#ebdfc4]/30 px-0 py-2 text-[#ebdfc4] focus:outline-none focus:border-[#cfa968] transition-all text-sm" value={newPRName} onChange={e => setNewPRName(e.target.value)} /><button type="submit" className="bg-[#cfa968] hover:bg-[#cfa968]/90 text-[#05080f] px-6 py-2 rounded-sm text-[10px] font-bold uppercase tracking-widest transition-all">Aggiungi</button></form></div><div className="bg-[#0a101d] p-8 rounded-md border border-[#ebdfc4]/10 shadow-lg"><h3 className="text-[10px] font-bold text-[#ebdfc4]/50 uppercase tracking-[0.2em] mb-6">Elenco PR Disponibili</h3><div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">{prs.map(pr => (<div key={pr.id} className="flex items-center justify-between p-4 rounded-sm bg-[#121a2f] border border-[#ebdfc4]/10 hover:border-[#ebdfc4]/30 transition-colors"><span className="font-medium text-[#ebdfc4]/90 uppercase tracking-widest text-xs">{pr.name}</span><button type="button" onClick={(e) => handleDeletePR(pr, e)} className="text-[#ebdfc4]/50 hover:text-[#cfa968] transition-colors"><Trash2 className="w-4 h-4" /></button></div>))}</div></div></div>
        <div className="space-y-6"><div className="bg-[#0a101d] p-8 rounded-md border border-[#ebdfc4]/10 shadow-lg"><h2 className="text-sm font-medium text-[#ebdfc4] mb-6 uppercase tracking-[0.15em] flex items-center"><FolderTree className="w-4 h-4 mr-3 text-[#cfa968]"/> 2. Crea Categorie</h2><form onSubmit={handleCreateGroup} className="flex gap-4"><input required type="text" placeholder="Nome Gruppo" className="flex-1 bg-transparent border-b border-[#ebdfc4]/30 px-0 py-2 text-[#ebdfc4] focus:outline-none focus:border-[#cfa968] transition-all text-sm" value={newGroupName} onChange={e => setNewGroupName(e.target.value)} /><button type="submit" className="bg-[#cfa968] hover:bg-[#cfa968]/90 text-[#05080f] px-6 py-2 rounded-sm text-[10px] font-bold uppercase tracking-widest transition-all">Crea</button></form></div><div className="space-y-6"><h3 className="text-[10px] font-bold text-[#ebdfc4]/50 uppercase tracking-[0.2em] px-2">Associazione PR - Gruppi</h3>{prGroups.map(group => (<div key={group.id} className="bg-[#0a101d] border border-[#ebdfc4]/10 rounded-md p-6 shadow-lg"><div className="flex justify-between items-center mb-6 border-b border-[#ebdfc4]/10 pb-4"><h4 className="text-sm font-medium text-[#ebdfc4]/90 uppercase tracking-[0.15em]">{group.name}</h4><button type="button" onClick={(e) => handleDeleteGroup(group, e)} className="text-[#ebdfc4]/50 hover:text-[#cfa968] transition-colors"><Trash2 className="w-4 h-4" /></button></div><div className="flex flex-wrap gap-3">{prs.map(pr => (<div key={pr.id} onClick={() => togglePRInGroup(group, pr.id)} className={`px-4 py-2 rounded-sm text-[10px] font-bold uppercase tracking-widest cursor-pointer border transition-colors ${(group.prIds||[]).includes(pr.id) ? 'bg-[#cfa968]/20 border-[#cfa968]/50 text-[#cfa968]' : 'bg-[#121a2f] border-[#ebdfc4]/10 text-[#ebdfc4]/50 hover:border-[#ebdfc4]/30'}`}>{pr.name}</div>))}</div></div>))}</div></div>
      </div>
    </div>
  );
};

const AdminEventReport = ({ registrations, selectedEvent, setView }) => {
  const [hiddenPRs, setHiddenPRs] = useState(new Set());
  const eventRegs = registrations.filter(r => r.eventId === selectedEvent?.id && !r.isCancelled);
  const statsMap = new Map();
  eventRegs.forEach(reg => { const prName = reg.prName || 'Nessun PR'; if (!statsMap.has(prName)) statsMap.set(prName, { name: prName, entered: 0, registered: 0 }); const stat = statsMap.get(prName); stat.registered += 1; if (reg.entered) stat.entered += 1; });
  const allStats = Array.from(statsMap.values());
  const filteredStats = allStats.filter(s => !hiddenPRs.has(s.name)).sort((a, b) => b.entered - a.entered);
  const totalEnteredFiltered = filteredStats.reduce((sum, stat) => sum + stat.entered, 0);

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6 mb-12">
      <button onClick={() => setView('admin-dashboard')} className="flex items-center text-[#ebdfc4]/50 hover:text-[#cfa968] mb-8 transition-colors uppercase text-[10px] font-bold tracking-[0.2em]"><ChevronLeft className="w-4 h-4 mr-1" /> Torna</button>
      <div className="bg-[#0a101d] p-8 md:p-10 rounded-md border border-[#ebdfc4]/10 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 border-b border-[#ebdfc4]/10 pb-8"><div><h1 className="text-xl font-medium text-[#ebdfc4] uppercase tracking-[0.15em] flex items-center mb-2"><BarChart3 className="w-5 h-5 mr-3 text-[#cfa968]" /> Report Ingressi</h1><p className="text-[#ebdfc4]/70 text-xs tracking-widest uppercase">{selectedEvent?.title}</p></div><div className="text-right"><div className="text-3xl font-light text-[#cfa968]">{totalEnteredFiltered}</div><div className="text-[#ebdfc4]/50 text-[10px] font-bold uppercase tracking-[0.15em] mt-1">Ingressi Totali</div></div></div>
        <div className="border border-[#ebdfc4]/10 rounded-sm overflow-hidden bg-[#05080f]">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse"><thead><tr className="border-b border-[#ebdfc4]/10 bg-[#0a101d]"><th className="p-4 text-[10px] font-bold text-[#ebdfc4]/50 uppercase tracking-[0.15em]">Nome PR</th><th className="p-4 text-[10px] font-bold text-[#ebdfc4]/50 uppercase tracking-[0.15em] text-center">Entrati</th><th className="p-4 text-[10px] font-bold text-[#ebdfc4]/50 uppercase tracking-[0.15em] text-center">In Lista</th></tr></thead><tbody>{filteredStats.map((stat) => (<tr key={stat.name} className="border-b border-[#ebdfc4]/5 hover:bg-[#121a2f] transition-colors"><td className="p-4 text-xs font-bold text-[#ebdfc4] uppercase tracking-[0.1em]">{stat.name}</td><td className="p-4 text-center"><span className="text-[#ebdfc4] font-medium text-sm">{stat.entered}</span></td><td className="p-4 text-center text-[#ebdfc4]/50 text-xs">{stat.registered}</td></tr>))}</tbody></table>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminContacts = ({ registrations, events, waLogs, view, setView, setIsAdminAuth, showDialog }) => {
  const getUniqueContacts = () => {
    const contactsMap = new Map();
    registrations.forEach(reg => {
      let key = (reg.phone || '').replace(/\D/g, ''); 
      if (key.length < 5) key = (reg.email || '').trim().toLowerCase() || `${reg.firstName || ''} ${reg.lastName || ''}`.trim().toLowerCase();
      if (!contactsMap.has(key)) contactsMap.set(key, { id: key, firstName: reg.firstName, lastName: reg.lastName, phone: reg.phone, email: reg.email, registrationCount: reg.isCancelled ? 0 : 1, lastSeen: reg.timestamp });
      else { const existing = contactsMap.get(key); if (!reg.isCancelled) existing.registrationCount += 1; if (reg.timestamp > existing.lastSeen) existing.lastSeen = reg.timestamp; }
    });
    return Array.from(contactsMap.values()).sort((a, b) => a.firstName.localeCompare(b.firstName));
  };
  const uniqueContacts = getUniqueContacts();

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-4 mb-12">
      <AdminHeader view={view} setView={setView} setIsAdminAuth={setIsAdminAuth} />
      <div className="bg-[#0a101d] border border-[#ebdfc4]/10 rounded-md shadow-lg overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse"><thead><tr className="border-b border-[#ebdfc4]/10 bg-[#05080f]"><th className="p-5 text-[10px] font-bold text-[#ebdfc4]/50 uppercase tracking-[0.2em]">Nome</th><th className="p-5 text-[10px] font-bold text-[#ebdfc4]/50 uppercase tracking-[0.2em]">Contatti</th><th className="p-5 text-[10px] font-bold text-[#ebdfc4]/50 uppercase tracking-[0.2em] text-center">Serate</th></tr></thead><tbody>{uniqueContacts.map((c) => (<tr key={c.id} className="border-b border-[#ebdfc4]/5 hover:bg-[#121a2f]"><td className="p-5"><div className="font-medium text-xs text-[#ebdfc4] uppercase tracking-widest">{c.firstName} {c.lastName}</div></td><td className="p-5"><div className="text-[#ebdfc4]/90 text-xs tracking-wider">{c.phone}</div></td><td className="p-5 text-center"><span className="text-[#cfa968] font-bold text-xs">{c.registrationCount}</span></td></tr>))}</tbody></table>
        </div>
      </div>
    </div>
  );
};

const AdminEventDetails = ({ registrations, selectedEvent, setView, showDialog }) => {
  const iscritti = registrations.filter(r => r.eventId === selectedEvent?.id && !r.isCancelled);
  const handleRemove = async (person) => { showDialog(`Rimuovere ${person.firstName}?`, async () => { try { await updateDoc(doc(db, 'artifacts', appId, 'registrations', person.id), { isCancelled: true }); } catch (error) { console.error(error); } }); };

  return (
    <div className="max-w-6xl mx-auto p-4 mb-12">
      <button onClick={() => setView('admin-dashboard')} className="flex items-center text-[#ebdfc4]/50 hover:text-[#cfa968] mb-8 transition-colors uppercase text-[10px] font-bold tracking-[0.2em]"><ChevronLeft className="w-4 h-4 mr-1" /> Torna</button>
      <div className="border border-[#ebdfc4]/10 rounded-md overflow-hidden bg-[#0a101d] shadow-lg">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse"><thead><tr className="border-b border-[#ebdfc4]/10 bg-[#05080f]"><th className="p-5 text-[10px] font-bold text-[#ebdfc4]/50 uppercase tracking-[0.2em]">Nome</th><th className="p-5 text-[10px] font-bold text-[#ebdfc4]/50 uppercase tracking-[0.2em]">PR</th><th className="p-5 text-[10px] font-bold text-[#ebdfc4]/50 uppercase tracking-[0.2em] text-center">Azioni</th></tr></thead><tbody>{iscritti.map((person) => (<tr key={person.id} className="border-b border-[#ebdfc4]/5 hover:bg-[#121a2f]"><td className="p-5 text-sm text-[#ebdfc4] uppercase tracking-wide">{person.firstName} {person.lastName}</td><td className="p-5 text-[#ebdfc4]/70 text-xs tracking-widest uppercase">{person.prName || '-'}</td><td className="p-5 text-center"><button onClick={() => handleRemove(person)} className="text-[#ebdfc4]/40 hover:text-[#cfa968] p-2 transition-colors"><Trash2 className="w-4 h-4 inline" /></button></td></tr>))}</tbody></table>
        </div>
      </div>
    </div>
  );
};

const ListeEventsView = ({ events, setSelectedEvent, setView }) => {
  const activeEvents = events.filter(ev => ev.isVisible !== false);
  return (
    <div className="max-w-4xl mx-auto p-4 space-y-12 mb-12">
      <div className="text-center py-12 md:py-16 relative"><h1 className="text-3xl md:text-4xl font-light text-[#ebdfc4] tracking-[0.2em] uppercase relative z-10">Controllo Ingressi</h1><div className="w-8 h-px bg-[#cfa968]/50 mx-auto mt-6 mb-6"></div></div>
      <div className="grid gap-6">{activeEvents.map(ev => (<div key={ev.id} className="bg-[#0a101d] border border-[#ebdfc4]/10 rounded-md p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 cursor-pointer hover:border-[#cfa968]/50 shadow-lg group" onClick={() => { setSelectedEvent(ev); setView('liste-auth'); }}><div className="flex items-center gap-6"><div className="w-20 h-20 rounded-sm overflow-hidden bg-[#05080f] border border-[#ebdfc4]/10 relative"><img src={ev.imageUrl || 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=200&auto=format&fit=crop'} alt="locandina" className="w-full h-full object-cover"/></div><div><h3 className="text-lg font-medium text-[#ebdfc4] uppercase tracking-[0.15em]">{ev.title}</h3></div></div><div className="bg-[#cfa968]/10 text-[#cfa968] border border-[#cfa968]/50 px-8 py-4 rounded-sm font-bold uppercase tracking-[0.15em] text-[10px] text-center w-full md:w-auto">Apri Porta</div></div>))}</div>
    </div>
  );
};

const ListeAuthView = ({ selectedEvent, setView, showDialog }) => {
  const [password, setPassword] = useState('');
  const handleAccess = (e) => { e.preventDefault(); if (password === selectedEvent.listPassword) setView('liste-dashboard'); else showDialog("Password errata.", null, false); };
  return (
    <div className="max-w-sm mx-auto p-4 pt-24 relative"><button onClick={() => setView('liste-events')} className="flex items-center text-[#ebdfc4]/50 hover:text-[#cfa968] mb-8 transition-colors uppercase text-[10px] font-bold tracking-[0.2em] absolute top-4 left-4"><ChevronLeft className="w-4 h-4 mr-1" /> Indietro</button><div className="bg-[#0a101d] border border-[#ebdfc4]/10 rounded-md p-10 text-center shadow-2xl mt-10"><ClipboardList className="w-10 h-10 text-[#cfa968] mx-auto mb-6" strokeWidth={1.5} /><h2 className="text-lg font-light text-[#ebdfc4] mb-2 uppercase tracking-[0.15em] leading-tight">{selectedEvent?.title}</h2><form onSubmit={handleAccess}><input type="password" placeholder="***" className="w-full bg-transparent border-b border-[#ebdfc4]/30 px-0 py-3 text-[#ebdfc4] text-center text-xl focus:outline-none focus:border-[#cfa968] mb-10 transition-colors tracking-widest" value={password} onChange={e => setPassword(e.target.value)} /><button type="submit" className="w-full bg-[#cfa968] hover:bg-[#cfa968]/90 text-[#05080f] py-4 rounded-sm text-[10px] font-bold uppercase tracking-[0.2em]">Autorizza</button></form></div></div>
  );
};

const ListeDashboardView = ({ registrations, selectedEvent, setView }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const allIscritti = registrations.filter(r => r.eventId === selectedEvent?.id && !r.isCancelled);
  const filteredIscritti = allIscritti.filter(r => `${r.firstName} ${r.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()));
  const toggleEntered = async (person) => { try { await updateDoc(doc(db, 'artifacts', appId, 'registrations', person.id), { entered: !person.entered }); } catch (error) { console.error(error); } };

  return (
    <div className="max-w-5xl mx-auto p-4 relative pb-24"><button onClick={() => setView('liste-events')} className="flex items-center text-[#ebdfc4]/50 hover:text-[#cfa968] mb-8 transition-colors uppercase text-[10px] font-bold tracking-[0.2em]"><ChevronLeft className="w-4 h-4 mr-1" /> Chiudi Porta</button><div className="relative mb-10"><Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-[#ebdfc4]/50" /><input type="text" placeholder="CERCA NOMINATIVO..." className="w-full bg-transparent border-b border-[#ebdfc4]/30 pl-8 pr-4 py-4 text-[#ebdfc4] focus:outline-none focus:border-[#cfa968] text-sm uppercase tracking-widest transition-colors" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} /></div><div className="bg-[#0a101d] border border-[#ebdfc4]/10 rounded-md overflow-hidden shadow-lg"><div className="divide-y divide-[#ebdfc4]/5">{filteredIscritti.map((person) => (<div key={person.id} onClick={() => toggleEntered(person)} className={`flex items-center justify-between p-6 cursor-pointer transition-colors ${person.entered ? 'bg-[#05080f] opacity-50' : 'hover:bg-[#121a2f]'}`}><div className="flex items-center gap-6"><div className={`w-6 h-6 rounded-sm border flex items-center justify-center transition-colors ${person.entered ? 'bg-[#ebdfc4] border-[#ebdfc4] text-[#05080f]' : 'bg-transparent border-[#ebdfc4]/30 text-transparent group-hover:border-[#cfa968]'}`}>{person.entered ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}</div><div><h3 className={`text-sm font-medium uppercase tracking-[0.1em] transition-all flex items-center gap-3 ${person.entered ? 'text-[#ebdfc4]/50 line-through' : 'text-[#ebdfc4]'}`}>{person.firstName} {person.lastName}</h3><div className="text-[#ebdfc4]/70 text-[10px] uppercase tracking-widest mt-1.5 flex items-center gap-3">PR: {person.prName || '-'}</div></div></div></div>))}</div></div></div>
  );
};

export default function App() {
  const [view, setView] = useState('public'); 
  const [lang, setLang] = useState('it'); 
  const [isAdminAuth, setIsAdminAuth] = useState(false); 
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [dialogConfig, setDialogConfig] = useState(null);
  
  const [events, setEvents] = useState([]);
  const [prs, setPrs] = useState([]);
  const [prGroups, setPrGroups] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [waLogs, setWaLogs] = useState([]);

  const t = (key) => translations[lang][key];
  const showDialog = (message, onConfirm = null, isPrompt = false) => { setDialogConfig({ message, onConfirm, isAlert: !onConfirm && !isPrompt, isPrompt }); };
  const closeDialog = () => setDialogConfig(null);

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    signInAnonymously(auth).catch((e) => console.error("Errore Auth:", e));
  }, []);

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    const unsubEvents = onSnapshot(collection(db, 'artifacts', appId, 'events'), snap => setEvents(snap.docs.map(d => ({id: d.id, ...d.data()}))));
    const unsubPRs = onSnapshot(collection(db, 'artifacts', appId, 'prs'), snap => setPrs(snap.docs.map(d => ({id: d.id, ...d.data()}))));
    const unsubGroups = onSnapshot(collection(db, 'artifacts', appId, 'pr_groups'), snap => setPrGroups(snap.docs.map(d => ({id: d.id, ...d.data()}))));
    const unsubRegs = onSnapshot(collection(db, 'artifacts', appId, 'registrations'), snap => setRegistrations(snap.docs.map(d => ({id: d.id, ...d.data()}))));
    return () => { unsubEvents(); unsubPRs(); unsubGroups(); unsubRegs(); };
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#05080f] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#121a2f]/50 via-[#05080f] to-[#05080f] font-sans selection:bg-[#cfa968]/50 selection:text-[#05080f] relative">
      <CustomDialog config={dialogConfig} onClose={closeDialog} />
      {!isFirebaseConfigured && (
        <div className="bg-[#cfa968] text-[#05080f] text-center py-2 px-4 text-[10px] font-bold uppercase tracking-widest relative z-[101]">
          ⚠️ Modalità Anteprima: Ricordati di incollare i tuoi dati firebaseConfig alla riga 21 prima di pubblicare!
        </div>
      )}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#ebdfc4] via-[#cfa968] to-[#ebdfc4] z-[100]"></div>
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />
      <header className="border-b border-[#ebdfc4]/10 bg-[#05080f]/80 backdrop-blur-xl sticky top-0 z-50 animate-fade-in-down mt-1">
        <div className="max-w-6xl mx-auto px-6 h-24 flex items-center justify-between">
          <div className="flex items-center cursor-pointer group shrink-0" onClick={() => { if(!isAdminAuth) setView('public'); else setView('admin-dashboard'); }}><span className="font-light text-[#ebdfc4] text-xl md:text-2xl tracking-[0.2em] uppercase drop-shadow-[0_0_15px_rgba(207,169,104,0.2)] group-hover:text-[#cfa968] transition-colors duration-300">VIPLIST</span></div>
          <div className="flex items-center gap-4 shrink-0">
            {(!isAdminAuth && !view.startsWith('admin') && !view.startsWith('liste')) && (<div className="flex gap-2"><button onClick={() => setLang('it')} className={`px-2 py-1 text-[9px] font-bold uppercase tracking-[0.1em] transition-all active:scale-95 ${lang === 'it' ? 'text-[#cfa968] border-b border-[#cfa968]' : 'text-[#ebdfc4]/50 hover:text-[#ebdfc4]'}`}>IT</button><button onClick={() => setLang('en')} className={`px-2 py-1 text-[9px] font-bold uppercase tracking-[0.1em] transition-all active:scale-95 ${lang === 'en' ? 'text-[#cfa968] border-b border-[#cfa968]' : 'text-[#ebdfc4]/50 hover:text-[#ebdfc4]'}`}>EN</button></div>)}
            {!isAdminAuth && view !== 'admin-login' && !view.startsWith('liste') && (<div className="flex items-center gap-4 ml-2 pl-4 border-l border-[#ebdfc4]/20"><button onClick={() => setView('liste-events')} className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#ebdfc4]/50 hover:text-[#cfa968] transition-all active:scale-95 flex items-center gap-1.5"><ClipboardList className="w-3 h-3" /> <span className="hidden sm:inline">{t('lists')}</span></button><button onClick={() => setView('admin-login')} className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#ebdfc4]/50 hover:text-[#cfa968] transition-all active:scale-95 flex items-center gap-1.5"><Lock className="w-3 h-3" /> <span className="hidden sm:inline">{t('admin')}</span></button></div>)}
          </div>
        </div>
      </header>
      <main className="py-6 px-4 md:px-6">
        {view === 'public' && <PublicView events={events} setSelectedEvent={setSelectedEvent} setView={setView} t={t} lang={lang} />}
        {view === 'register' && <RegistrationForm selectedEvent={selectedEvent} prs={prs} prGroups={prGroups} setView={setView} showDialog={showDialog} t={t} lang={lang} />}
        {view === 'admin-login' && <AdminLogin setIsAdminAuth={setIsAdminAuth} setView={setView} showDialog={showDialog} />}
        {view === 'admin-dashboard' && <AdminDashboard events={events} registrations={registrations} prGroups={prGroups} view={view} setView={setView} setIsAdminAuth={setIsAdminAuth} setSelectedEvent={setSelectedEvent} showDialog={showDialog} />}
        {view === 'admin-pr' && <AdminPRView prs={prs} prGroups={prGroups} view={view} setView={setView} setIsAdminAuth={setIsAdminAuth} showDialog={showDialog} />}
        {view === 'admin-event-details' && <AdminEventDetails registrations={registrations} selectedEvent={selectedEvent} setView={setView} showDialog={showDialog} />}
        {view === 'admin-event-report' && <AdminEventReport registrations={registrations} selectedEvent={selectedEvent} setView={setView} />}
        {view === 'admin-contacts' && <AdminContacts registrations={registrations} events={events} waLogs={waLogs} view={view} setView={setView} setIsAdminAuth={setIsAdminAuth} showDialog={showDialog} />}
        {view === 'liste-events' && <ListeEventsView events={events} setSelectedEvent={setSelectedEvent} setView={setView} />}
        {view === 'liste-auth' && <ListeAuthView selectedEvent={selectedEvent} setView={setView} showDialog={showDialog} />}
        {view === 'liste-dashboard' && <ListeDashboardView registrations={registrations} selectedEvent={selectedEvent} setView={setView} />}
      </main>
    </div>
  );
}