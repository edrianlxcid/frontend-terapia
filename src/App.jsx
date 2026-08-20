import React, { useState } from 'react';
import axios from 'axios';
import {
  User, Phone, Mail, ChevronRight, CheckCircle2,
  Send, ClipboardList, Stethoscope, HandHeart, AlertCircle
} from 'lucide-react';
import logoRuna from './assets/logo_runamente_color-removebg-preview.png';
import tortugaIcon from './assets/tortuga_sin_bg.png';
import imgAlex from './assets/alex.jpeg';
import imgGaby from './assets/gaby.jpeg';
import logoRunaSolo from './assets/runa_solo_logo.png';
import condorIcon from './assets/condor_sin_bg.png';


// URL del backend (Local para desarrollo, luego se cambiará por la de Render)
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

const AREAS_Y_SERVICIOS = {
  'Psicología': [
    'Atención Psicológica/Clínica/Infantil',
    'Ev. Psicológica',
    'Ev. Psicopedagógica',
    'Ev. Desarrollo'
  ],
  'Terapia de Lenguaje': [
    'Evaluación de Lenguaje',
    'Terapia de Lenguaje'
  ],
  'Terapia Ocupacional': [
    'Evaluación Ocupacional',
    'Terapia Ocupacional'
  ]
};

// Por ahora solo mostraremos Psicología, cuando hayan más especialistas agregamos las otras al array.
const AREAS_VISIBLES = ['Psicología'];

export default function App() {
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Paso 1: Datos Personales
  const [personalData, setPersonalData] = useState({
    nombre: '', telefono: '', email: '', fechaNacimiento: '', edad: '',
    representanteNombre: '', representanteTelefono: '', area: 'Psicología', servicio: 'Atención Psicológica/Clínica/Infantil', motivo: ''
  });

  // Paso 2: Datos Socioeconómicos
  const [socioData, setSocioData] = useState({
    q1: 0, q2: 0,
    q3_agua: 0, q3_luz: 0, q3_basura: 0, q3_internet: 0,
    q4_pc: 0, q4_laptop: 0, q4_tablet: 0, q4_cel1: 0, q4_cel2: 0,
    q5_refri: 0, q5_lava: 0, q5_sonido: 0, q5_tv1: 0, q5_tv2: 0, q5_veh1: 0, q5_veh2: 0,
    q7_estudio: 0, q8_trabajo: 0,
    q9_salud: 0, q10_dependientes: 0
  });

  // Resultado del Backend
  const [proposal, setProposal] = useState(null);

  const handlePersonalChange = (e) => {
    const { name, value } = e.target;

    if (name === 'fechaNacimiento') {
      const today = new Date();
      const birthDate = new Date(value);
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      setPersonalData(prev => ({ ...prev, [name]: value, edad: age }));
    } else {
      setPersonalData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAreaChange = (e) => {
    const newArea = e.target.value;
    setPersonalData(prev => ({
      ...prev,
      area: newArea,
      servicio: AREAS_Y_SERVICIOS[newArea][0] // Seleccionar automáticamente el primer servicio de la nueva área
    }));
  };

  const handleSocioChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setSocioData(prev => ({ ...prev, [name]: checked ? parseInt(value) : 0 }));
    } else {
      setSocioData(prev => ({ ...prev, [name]: parseInt(value) }));
    }
  };

  // Enviar respuestas al backend para calcular la propuesta
  const handleEvaluar = async (e) => {
    e.preventDefault();
    setStep(3); // Pantalla de carga
    setErrorMsg('');

    try {
      // Petición POST al Backend
      const response = await axios.post(`${BACKEND_URL}/api/evaluar`, {
        personalData,
        socioData
      });

      // El backend nos devuelve el costo y el terapeuta
      setProposal(response.data);
      setStep(4); // Mostrar Propuesta
    } catch (error) {
      console.error("Error evaluando:", error);
      setErrorMsg("Error al conectar con el servidor. Intenta nuevamente.");
      setStep(2); // Devolver al formulario si hay error
    }
  };

  // Confirmar la propuesta, guardar en BD y enviar a Telegram (vía Backend)
  const handleConfirmar = async () => {
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      await axios.post(`${BACKEND_URL}/api/confirmar`, {
        personalData,
        socioData,
        proposal
      });

      setIsSubmitting(false);
      setStep(5); // Pantalla de Éxito Final
    } catch (error) {
      console.error("Error confirmando:", error);
      setErrorMsg("No se pudo confirmar tu cita. Por favor, intenta de nuevo.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-runa-beige flex flex-col font-sans text-runa-brown relative overflow-hidden">
      
      {/* Fondo difuminado de tortugas en el inicio */}
      {step === 0 && (
        <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.25] blur-[1px]">
          {/* Lado Izquierdo */}
          <img src={tortugaIcon} className="absolute top-[5%] left-[5%] w-24 h-24 -rotate-12" alt="" />
          <img src={tortugaIcon} className="absolute top-[25%] left-[12%] w-20 h-20 rotate-45" alt="" />
          <img src={tortugaIcon} className="absolute top-[45%] left-[2%] w-16 h-16 rotate-90" alt="" />
          <img src={tortugaIcon} className="absolute bottom-[35%] left-[8%] w-28 h-28 -rotate-12" alt="" />
          <img src={tortugaIcon} className="absolute bottom-[15%] left-[5%] w-32 h-32 rotate-45" alt="" />
          <img src={tortugaIcon} className="absolute bottom-[5%] left-[25%] w-16 h-16 rotate-180" alt="" />
          
          {/* Lado Derecho */}
          <img src={tortugaIcon} className="absolute top-[10%] right-[8%] w-32 h-32 rotate-12" alt="" />
          <img src={tortugaIcon} className="absolute top-[30%] right-[15%] w-16 h-16 -rotate-45" alt="" />
          <img src={tortugaIcon} className="absolute top-[50%] right-[4%] w-24 h-24 -rotate-90" alt="" />
          <img src={tortugaIcon} className="absolute bottom-[40%] right-[5%] w-20 h-20 rotate-12" alt="" />
          <img src={tortugaIcon} className="absolute bottom-[20%] right-[12%] w-28 h-28 -rotate-45" alt="" />
          <img src={tortugaIcon} className="absolute bottom-[10%] right-[25%] w-20 h-20 rotate-90" alt="" />
          
          {/* Centro/Arriba/Abajo */}
          <img src={tortugaIcon} className="absolute top-[2%] right-[40%] w-16 h-16 -rotate-12" alt="" />
          <img src={tortugaIcon} className="absolute bottom-[2%] left-[45%] w-24 h-24 rotate-180" alt="" />
        </div>
      )}

      {/* Fondo difuminado de Runa en Datos del Paciente */}
      {step === 1 && (
        <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.20] blur-[1px]">
          {/* Lado Izquierdo */}
          <img src={logoRunaSolo} className="absolute top-[5%] left-[5%] w-24 h-24 -rotate-12" alt="" />
          <img src={logoRunaSolo} className="absolute top-[25%] left-[12%] w-20 h-20 rotate-45" alt="" />
          <img src={logoRunaSolo} className="absolute top-[45%] left-[2%] w-16 h-16 rotate-90" alt="" />
          <img src={logoRunaSolo} className="absolute bottom-[35%] left-[8%] w-28 h-28 -rotate-12" alt="" />
          <img src={logoRunaSolo} className="absolute bottom-[15%] left-[5%] w-32 h-32 rotate-45" alt="" />
          <img src={logoRunaSolo} className="absolute bottom-[5%] left-[25%] w-16 h-16 rotate-180" alt="" />
          
          {/* Lado Derecho */}
          <img src={logoRunaSolo} className="absolute top-[10%] right-[8%] w-32 h-32 rotate-12" alt="" />
          <img src={logoRunaSolo} className="absolute top-[30%] right-[15%] w-16 h-16 -rotate-45" alt="" />
          <img src={logoRunaSolo} className="absolute top-[50%] right-[4%] w-24 h-24 -rotate-90" alt="" />
          <img src={logoRunaSolo} className="absolute bottom-[40%] right-[5%] w-20 h-20 rotate-12" alt="" />
          <img src={logoRunaSolo} className="absolute bottom-[20%] right-[12%] w-28 h-28 -rotate-45" alt="" />
          <img src={logoRunaSolo} className="absolute bottom-[10%] right-[25%] w-20 h-20 rotate-90" alt="" />
          
          {/* Centro/Arriba/Abajo */}
          <img src={logoRunaSolo} className="absolute top-[2%] right-[40%] w-16 h-16 -rotate-12" alt="" />
          <img src={logoRunaSolo} className="absolute bottom-[2%] left-[45%] w-24 h-24 rotate-180" alt="" />
        </div>
      )}

      {/* Fondo mixto en Evaluación Socioeconómica */}
      {step === 2 && (
        <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.20] blur-[1px]">
          {/* Lado Izquierdo */}
          <img src={logoRunaSolo} className="absolute top-[5%] left-[5%] w-24 h-24 -rotate-12" alt="" />
          <img src={tortugaIcon} className="absolute top-[25%] left-[12%] w-20 h-20 rotate-45" alt="" />
          <img src={logoRunaSolo} className="absolute top-[45%] left-[2%] w-16 h-16 rotate-90" alt="" />
          <img src={tortugaIcon} className="absolute bottom-[35%] left-[8%] w-28 h-28 -rotate-12" alt="" />
          <img src={logoRunaSolo} className="absolute bottom-[15%] left-[5%] w-32 h-32 rotate-45" alt="" />
          <img src={tortugaIcon} className="absolute bottom-[5%] left-[25%] w-16 h-16 rotate-180" alt="" />
          
          {/* Lado Derecho */}
          <img src={tortugaIcon} className="absolute top-[10%] right-[8%] w-32 h-32 rotate-12" alt="" />
          <img src={logoRunaSolo} className="absolute top-[30%] right-[15%] w-16 h-16 -rotate-45" alt="" />
          <img src={tortugaIcon} className="absolute top-[50%] right-[4%] w-24 h-24 -rotate-90" alt="" />
          <img src={logoRunaSolo} className="absolute bottom-[40%] right-[5%] w-20 h-20 rotate-12" alt="" />
          <img src={tortugaIcon} className="absolute bottom-[20%] right-[12%] w-28 h-28 -rotate-45" alt="" />
          <img src={logoRunaSolo} className="absolute bottom-[10%] right-[25%] w-20 h-20 rotate-90" alt="" />
          
          {/* Centro/Arriba/Abajo */}
          <img src={logoRunaSolo} className="absolute top-[2%] right-[40%] w-16 h-16 -rotate-12" alt="" />
          <img src={tortugaIcon} className="absolute bottom-[2%] left-[45%] w-24 h-24 rotate-180" alt="" />
        </div>
      )}

      <div className="flex-1 flex items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-lg bg-runa-light rounded-2xl shadow-2xl overflow-hidden border border-runa-brown/10 relative">

          {/* PASO 0: INTRO */}
          {step === 0 && (
            <div className="p-8 text-center">
              <div className="mx-auto mb-8 flex justify-center">
                <div className="w-72 h-72 flex items-center justify-center relative scale-110 md:scale-125 transition-transform animate-float">
                  <img src={logoRuna} alt="Logo Runa Mente" className="w-full h-full object-contain drop-shadow-xl" />
                </div>
              </div>

              <p className="text-runa-brown/80 mb-8 leading-relaxed">
                Completa este cuestionario para asignarte el especialista ideal y ajustar nuestros costos a tu realidad.
              </p>
              <button onClick={() => setStep(1)} className="w-full bg-runa-blue hover:bg-runa-blue/90 text-runa-beige font-semibold py-3 px-6 rounded-xl transition-colors flex justify-center items-center gap-2 shadow-md">
                Empezar <ChevronRight size={20} />
              </button>
            </div>
          )}

          {/* PASO 1: DATOS PERSONALES */}
          {step === 1 && (
            <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="p-6">
              <div className="mb-6 border-b border-runa-brown/10 pb-4">
                <h2 className="text-2xl font-serif font-bold text-runa-blue flex items-center gap-2">
                  <img src={tortugaIcon} alt="Tortuga" className="w-15 h-15 object-contain" />
                  Datos del Paciente
                </h2>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-runa-brown mb-1">Nombre Completo</label>
                    <input required type="text" name="nombre" value={personalData.nombre} onChange={handlePersonalChange} className="w-full p-2 border border-runa-brown/30 rounded-lg focus:ring-2 focus:ring-runa-gold outline-none bg-white text-runa-blue" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-runa-brown mb-1">Fecha de Nacimiento</label>
                    <input required type="date" name="fechaNacimiento" value={personalData.fechaNacimiento} onChange={handlePersonalChange} className="w-full p-2 border border-runa-brown/30 rounded-lg focus:ring-2 focus:ring-runa-gold outline-none bg-white text-runa-blue" />
                  </div>
                </div>

                {personalData.edad !== '' && personalData.edad < 18 && (
                  <div className="bg-runa-gold/10 p-4 rounded-xl border border-runa-gold/30">
                    <p className="text-sm font-semibold text-runa-gold mb-3 flex items-center gap-2">
                      <AlertCircle size={16} /> Paciente menor de edad (Edad: {personalData.edad} años)
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-runa-brown mb-1">Nombre del Representante Legal</label>
                        <input required type="text" name="representanteNombre" value={personalData.representanteNombre} onChange={handlePersonalChange} className="w-full p-2 border border-runa-brown/30 rounded-lg focus:ring-2 focus:ring-runa-gold outline-none bg-white text-runa-blue text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-runa-brown mb-1">Teléfono del Representante</label>
                        <input required type="tel" name="representanteTelefono" value={personalData.representanteTelefono} onChange={handlePersonalChange} className="w-full p-2 border border-runa-brown/30 rounded-lg focus:ring-2 focus:ring-runa-gold outline-none bg-white text-runa-blue text-sm" />
                      </div>
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {!(personalData.edad !== '' && personalData.edad < 18) && (
                    <div>
                      <label className="block text-sm font-medium text-runa-brown mb-1">Tu Teléfono</label>
                      <input required type="tel" name="telefono" value={personalData.telefono} onChange={handlePersonalChange} className="w-full p-2 border border-runa-brown/30 rounded-lg focus:ring-2 focus:ring-runa-gold outline-none bg-white text-runa-blue" />
                    </div>
                  )}
                  <div className={personalData.edad !== '' && personalData.edad < 18 ? "md:col-span-2" : ""}>
                    <label className="block text-sm font-medium text-runa-brown mb-1">Email de contacto</label>
                    <input required type="email" name="email" value={personalData.email} onChange={handlePersonalChange} className="w-full p-2 border border-runa-brown/30 rounded-lg focus:ring-2 focus:ring-runa-gold outline-none bg-white text-runa-blue" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-runa-brown mb-1">Área de servicio</label>
                    <select name="area" value={personalData.area} onChange={handleAreaChange} className="w-full p-2 border border-runa-brown/30 rounded-lg focus:ring-2 focus:ring-runa-gold outline-none bg-white text-runa-blue">
                      {AREAS_VISIBLES.map(area => (
                        <option key={area} value={area}>{area}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-runa-brown mb-1">Servicio específico</label>
                    <select name="servicio" value={personalData.servicio} onChange={handlePersonalChange} className="w-full p-2 border border-runa-brown/30 rounded-lg focus:ring-2 focus:ring-runa-gold outline-none bg-white text-runa-blue">
                      {AREAS_Y_SERVICIOS[personalData.area]?.map(srv => (
                        <option key={srv} value={srv}>{srv}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-runa-brown mb-1">Motivo principal</label>
                  <textarea required name="motivo" value={personalData.motivo} onChange={handlePersonalChange} rows="2" className="w-full p-2 border border-runa-brown/30 rounded-lg focus:ring-2 focus:ring-runa-gold outline-none bg-white text-runa-blue resize-none"></textarea>
                </div>
              </div>
              <button type="submit" className="mt-8 w-full bg-runa-blue hover:bg-runa-blue/90 text-runa-beige font-semibold py-3 px-6 rounded-xl transition-colors shadow-md">
                Siguiente
              </button>
            </form>
          )}

          {/* PASO 2: FORMULARIO SOCIOECONÓMICO */}
          {step === 2 && (
            <form onSubmit={handleEvaluar} className="p-6 h-[80vh] overflow-y-auto">
              <div className="mb-6 border-b border-runa-brown/10 pb-4 sticky top-0 bg-runa-light z-10 pt-2">
                <h2 className="text-2xl font-serif font-bold text-runa-blue flex items-center gap-2"><ClipboardList size={24} className="text-runa-gold" /> Evaluación Socioeconómica</h2>
                <p className="text-xs text-runa-brown/70 mt-1">Selecciona las opciones que mejor describan tu situación.</p>
                {errorMsg && <p className="text-xs text-runa-red mt-2 font-bold">{errorMsg}</p>}
              </div>

              <div className="space-y-8">
                <div>
                  <label className="font-semibold text-runa-blue text-sm">1. ¿En qué tipo de vivienda resides actualmente?</label>
                  <div className="mt-2 space-y-2">
                    {[
                      { label: 'Casa o departamento propio', val: 12 }, { label: 'Casa o departamento alquilado', val: 9 },
                      { label: 'Mediagua (prefabricada)', val: 6 }, { label: 'Vivienda compartida', val: 3 }, { label: 'Rancho, Choza, Covacha', val: 0 }
                    ].map((opt, i) => (
                      <label key={i} className="flex items-center gap-2 text-sm text-runa-brown p-2 rounded hover:bg-runa-beige cursor-pointer">
                        <input required type="radio" name="q1" value={opt.val} onChange={handleSocioChange} className="w-4 h-4 text-runa-gold focus:ring-runa-gold" /> {opt.label}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-runa-blue text-sm">2. ¿Qué tipo de servicio higiénico utiliza tu hogar?</label>
                  <div className="mt-2 space-y-2">
                    {[
                      { label: 'Alcantarillado público', val: 7 }, { label: 'Pozo séptico', val: 5 },
                      { label: 'Pozo ciego', val: 3 }, { label: 'Letrina', val: 1 }, { label: 'No tiene', val: 0 }
                    ].map((opt, i) => (
                      <label key={i} className="flex items-center gap-2 text-sm text-runa-brown p-2 rounded hover:bg-runa-beige cursor-pointer">
                        <input required type="radio" name="q2" value={opt.val} onChange={handleSocioChange} className="w-4 h-4 text-runa-gold focus:ring-runa-gold" /> {opt.label}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-runa-blue text-sm">3. Servicios básicos (Marca varios)</label>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <label className="flex items-center gap-2 text-sm p-2 bg-runa-beige/50 rounded border border-runa-brown/10"><input type="checkbox" name="q3_agua" value="2" onChange={handleSocioChange} className="text-runa-gold focus:ring-runa-gold rounded-sm" /> Agua potable</label>
                    <label className="flex items-center gap-2 text-sm p-2 bg-runa-beige/50 rounded border border-runa-brown/10"><input type="checkbox" name="q3_luz" value="2" onChange={handleSocioChange} className="text-runa-gold focus:ring-runa-gold rounded-sm" /> Luz eléctrica</label>
                    <label className="flex items-center gap-2 text-sm p-2 bg-runa-beige/50 rounded border border-runa-brown/10"><input type="checkbox" name="q3_basura" value="1" onChange={handleSocioChange} className="text-runa-gold focus:ring-runa-gold rounded-sm" /> Recolección basura</label>
                    <label className="flex items-center gap-2 text-sm p-2 bg-runa-beige/50 rounded border border-runa-brown/10"><input type="checkbox" name="q3_internet" value="1" onChange={handleSocioChange} className="text-runa-gold focus:ring-runa-gold rounded-sm" /> Internet</label>
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-runa-blue text-sm">4. Dispositivos (Marca varios)</label>
                  <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2">
                    <label className="flex items-center gap-2 text-sm p-2 bg-runa-beige/50 rounded border border-runa-brown/10"><input type="checkbox" name="q4_pc" value="2" onChange={handleSocioChange} className="text-runa-gold focus:ring-runa-gold rounded-sm" /> PC escritorio</label>
                    <label className="flex items-center gap-2 text-sm p-2 bg-runa-beige/50 rounded border border-runa-brown/10"><input type="checkbox" name="q4_laptop" value="3" onChange={handleSocioChange} className="text-runa-gold focus:ring-runa-gold rounded-sm" /> Laptop</label>
                    <label className="flex items-center gap-2 text-sm p-2 bg-runa-beige/50 rounded border border-runa-brown/10"><input type="checkbox" name="q4_tablet" value="1" onChange={handleSocioChange} className="text-runa-gold focus:ring-runa-gold rounded-sm" /> Tablet</label>
                    <label className="flex items-center gap-2 text-sm p-2 bg-runa-beige/50 rounded border border-runa-brown/10"><input type="checkbox" name="q4_cel1" value="1" onChange={handleSocioChange} className="text-runa-gold focus:ring-runa-gold rounded-sm" /> 1 teléfono celular</label>
                    <label className="flex items-center gap-2 text-sm p-2 bg-runa-beige/50 rounded border border-runa-brown/10"><input type="checkbox" name="q4_cel2" value="3" onChange={handleSocioChange} className="text-runa-gold focus:ring-runa-gold rounded-sm" /> 2 o más celulares</label>
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-runa-blue text-sm">5. Bienes del hogar, Televisores y Vehículos (Marca varios)</label>
                  <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2">
                    <label className="flex items-center gap-2 text-sm p-2 bg-runa-beige/50 rounded border border-runa-brown/10"><input type="checkbox" name="q5_refri" value="3" onChange={handleSocioChange} className="text-runa-gold focus:ring-runa-gold rounded-sm" /> Refrigeradora</label>
                    <label className="flex items-center gap-2 text-sm p-2 bg-runa-beige/50 rounded border border-runa-brown/10"><input type="checkbox" name="q5_lava" value="3" onChange={handleSocioChange} className="text-runa-gold focus:ring-runa-gold rounded-sm" /> Lavadora</label>
                    <label className="flex items-center gap-2 text-sm p-2 bg-runa-beige/50 rounded border border-runa-brown/10"><input type="checkbox" name="q5_sonido" value="1" onChange={handleSocioChange} className="text-runa-gold focus:ring-runa-gold rounded-sm" /> Equipo de sonido</label>
                    <label className="flex items-center gap-2 text-sm p-2 bg-runa-beige/50 rounded border border-runa-brown/10"><input type="checkbox" name="q5_tv1" value="1" onChange={handleSocioChange} className="text-runa-gold focus:ring-runa-gold rounded-sm" /> 1 Televisor</label>
                    <label className="flex items-center gap-2 text-sm p-2 bg-runa-beige/50 rounded border border-runa-brown/10"><input type="checkbox" name="q5_tv2" value="2" onChange={handleSocioChange} className="text-runa-gold focus:ring-runa-gold rounded-sm" /> 2 o más Televisores</label>
                    <label className="flex items-center gap-2 text-sm p-2 bg-runa-beige/50 rounded border border-runa-brown/10"><input type="checkbox" name="q5_veh1" value="3" onChange={handleSocioChange} className="text-runa-gold focus:ring-runa-gold rounded-sm" /> 1 Vehículo</label>
                    <label className="flex items-center gap-2 text-sm p-2 bg-runa-beige/50 rounded border border-runa-brown/10"><input type="checkbox" name="q5_veh2" value="5" onChange={handleSocioChange} className="text-runa-gold focus:ring-runa-gold rounded-sm" /> 2 o más Vehículos</label>
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-runa-blue text-sm">6. Nivel de instrucción más alto en el hogar</label>
                  <select name="q7_estudio" required onChange={handleSocioChange} className="mt-2 w-full p-2 border border-runa-brown/30 rounded text-sm bg-white text-runa-brown focus:ring-2 focus:ring-runa-gold outline-none">
                    <option value="">Selecciona...</option>
                    <option value="0">Sin estudios</option>
                    <option value="1">Primaria incompleta</option>
                    <option value="2">Primaria completa</option>
                    <option value="3">Secundaria incompleta</option>
                    <option value="5">Secundaria completa</option>
                    <option value="7">Tercer nivel incompleto</option>
                    <option value="9">Tercer nivel completo</option>
                    <option value="10">Cuarto nivel</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-runa-blue text-sm">7. Situación laboral del sostén económico</label>
                  <select name="q8_trabajo" required onChange={handleSocioChange} className="mt-2 w-full p-2 border border-runa-brown/30 rounded text-sm bg-white text-runa-brown focus:ring-2 focus:ring-runa-gold outline-none">
                    <option value="">Selecciona...</option>
                    <option value="15">Estable ({">"} Básico)</option>
                    <option value="10">Estable (= Básico)</option>
                    <option value="5">Informal / Subempleo</option>
                    <option value="0">Desempleado</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-runa-blue text-sm">8. ¿Qué tipo de seguro de salud cuenta los miembros del hogar?</label>
                  <select name="q9_salud" required onChange={handleSocioChange} className="mt-2 w-full p-2 border border-runa-brown/30 rounded text-sm bg-white text-runa-brown focus:ring-2 focus:ring-runa-gold outline-none">
                    <option value="">Selecciona...</option>
                    <option value="10">Seguro privado de salud</option>
                    <option value="10">IESS / ISSFA / ISSPOL</option>
                    <option value="5">Seguro campesino</option>
                    <option value="0">Ninguno</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-runa-blue text-sm">9. ¿Cuántas personas dependen económicamente del ingreso familiar?</label>
                  <select name="q10_dependientes" required onChange={handleSocioChange} className="mt-2 w-full p-2 border border-runa-brown/30 rounded text-sm bg-white text-runa-brown focus:ring-2 focus:ring-runa-gold outline-none">
                    <option value="">Selecciona...</option>
                    <option value="10">1 a 2 personas</option>
                    <option value="7">3 a 4 personas</option>
                    <option value="4">5 a 6 personas</option>
                    <option value="0">Más de 6 personas</option>
                  </select>
                </div>
              </div>

              <div className="mt-8 pb-4 sticky bottom-0 bg-runa-light border-t border-runa-brown/10 pt-4">
                <button type="submit" className="w-full bg-runa-blue hover:bg-runa-blue/90 text-runa-beige font-semibold py-3 px-6 rounded-xl transition-colors shadow-md">
                  Generar Evaluación
                </button>
              </div>
            </form>
          )}

          {/* PASO 3: LOADING */}
          {step === 3 && (
            <div className="p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
              {/* Spinner animado estilizado */}
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-runa-gold border-r-4 border-runa-blue border-b-4 border-transparent border-l-4 border-transparent mb-6"></div>
              <h2 className="text-xl font-serif font-semibold text-runa-blue">Evaluando perfil...</h2>
              <p className="text-sm text-runa-brown/70 mt-2">Conectando con el servidor de manera segura.</p>
            </div>
          )}

          {/* PASO 4: PROPUESTA / CONFIRMACIÓN */}
          {step === 4 && proposal && (
            <div className="p-6">
              <div className="text-center mb-6 border-b border-runa-brown/10 pb-6">
                <h2 className="text-3xl font-serif font-bold text-runa-blue">Tu Plan Terapéutico</h2>
                <p className="text-runa-brown/80 mt-2 text-sm">Hemos ajustado la tarifa según tu perfil para: {personalData.servicio}.</p>
                {errorMsg && <p className="text-xs text-runa-red mt-2 font-bold">{errorMsg}</p>}
              </div>

              <div className="bg-runa-beige border border-runa-gold/30 rounded-2xl p-6 mb-8 relative overflow-hidden shadow-sm">
                <div className="absolute -top-4 -right-4 p-4 opacity-5 text-runa-brown"><Stethoscope size={120} /></div>

                <div className="relative z-10">
                  <p className="text-sm font-semibold text-runa-gold uppercase tracking-wide mb-3">Especialista Asignado</p>
                  
                  <div className="flex items-center gap-4 mb-6 bg-white/60 p-3 rounded-2xl border border-runa-brown/10 shadow-sm">
                    <img 
                      src={proposal.terapeuta.name.includes('Alexander') ? imgAlex : imgGaby} 
                      alt="Foto del especialista" 
                      className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-2 border-runa-gold shadow-md flex-shrink-0"
                    />
                    <div className="flex-1">
                      <p className="text-lg font-serif font-bold text-runa-blue leading-tight">
                        {proposal.terapeuta.name.split(' (')[0]}
                      </p>
                      <p className="text-xs text-runa-brown/80 font-medium mt-1">
                        {proposal.terapeuta.name.includes('(') ? proposal.terapeuta.name.split('(')[1].replace(')', '') : 'Especialista Runa Mente'}
                      </p>
                    </div>
                    <div className="flex-shrink-0 pr-1 md:pr-2">
                      <img src={condorIcon} alt="Logo Cóndor" className="w-16 md:w-20 h-auto object-contain opacity-80" />
                    </div>
                  </div>

                  <p className="text-sm font-semibold text-runa-gold uppercase tracking-wide mb-1">
                    {personalData.servicio.includes('Ev.') || personalData.servicio.includes('Evaluación') ? 'Costo total de la evaluación' : 'Costo por sesión'}
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-black text-runa-blue">${proposal.costo}</span>
                    <span className="text-runa-brown/60 font-medium">.00 USD</span>
                  </div>
                </div>
              </div>

              <button onClick={handleConfirmar} disabled={isSubmitting} className="w-full bg-runa-red hover:bg-runa-red/90 text-white font-bold py-4 px-6 rounded-xl transition-colors flex justify-center items-center gap-2 text-lg shadow-lg">
                {isSubmitting ? 'Procesando...' : <><Send size={20} /> Confirmar Cita</>}
              </button>

              <button onClick={() => setStep(2)} disabled={isSubmitting} className="w-full text-runa-brown/60 hover:text-runa-brown py-3 mt-2 text-sm font-medium transition-colors">
                Cancelar y regresar
              </button>
            </div>
          )}

          {/* PASO 5: ÉXITO */}
          {step === 5 && (
            <div className="p-8 text-center min-h-[400px] flex flex-col justify-center">
              <div className="w-24 h-24 bg-runa-gold/20 text-runa-gold rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <CheckCircle2 size={50} />
              </div>
              <h2 className="text-3xl font-serif font-bold text-runa-blue mb-3">¡Cita Confirmada!</h2>
              <p className="text-runa-brown/80 mb-8 text-lg">
                El especialista <strong className="text-runa-blue">{proposal?.terapeuta?.name}</strong> ha recibido tu información y se pondrá en contacto pronto.
              </p>
              <button onClick={() => window.location.reload()} className="text-runa-gold font-semibold hover:text-runa-gold/80 transition-colors underline underline-offset-4">
                Volver al inicio
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
