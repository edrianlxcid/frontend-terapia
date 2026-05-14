import React, { useState } from 'react';
import axios from 'axios';
import { 
  User, Phone, Mail, ChevronRight, CheckCircle2, 
  Send, ClipboardList, Stethoscope, HandHeart, AlertCircle
} from 'lucide-react';

// URL del backend (Local para desarrollo, luego se cambiará por la de Render)
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

export default function App() {
  const [step, setStep] = useState(0); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Paso 1: Datos Personales
  const [personalData, setPersonalData] = useState({
    nombre: '', telefono: '', email: '', servicio: 'Consulta', motivo: ''
  });

  // Paso 2: Datos Socioeconómicos
  const [socioData, setSocioData] = useState({
    q1: 0, q2: 0,
    q3_agua: 0, q3_luz: 0, q3_basura: 0, q3_internet: 0,
    q4_pc: 0, q4_laptop: 0,
    q5_tv: 0, q6_vehiculo: 0,
    q7_estudio: 0, q8_trabajo: 0
  });

  // Resultado del Backend
  const [proposal, setProposal] = useState(null);

  const handlePersonalChange = (e) => {
    const { name, value } = e.target;
    setPersonalData(prev => ({ ...prev, [name]: value }));
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
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
          
          {/* PASO 0: INTRO */}
          {step === 0 && (
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <HandHeart size={40} />
              </div>
              <h1 className="text-2xl font-bold text-slate-800 mb-4">Inicia tu Proceso</h1>
              <p className="text-slate-600 mb-8 leading-relaxed">
                Completa este cuestionario para asignarte el especialista ideal y ajustar nuestros costos a tu realidad.
              </p>
              <button onClick={() => setStep(1)} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors flex justify-center items-center gap-2">
                Empezar <ChevronRight size={20} />
              </button>
            </div>
          )}

          {/* PASO 1: DATOS PERSONALES */}
          {step === 1 && (
            <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="p-6">
              <div className="mb-6 border-b pb-4">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2"><User size={20}/> Datos del Paciente</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nombre Completo</label>
                  <input required type="text" name="nombre" value={personalData.nombre} onChange={handlePersonalChange} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Teléfono</label>
                    <input required type="tel" name="telefono" value={personalData.telefono} onChange={handlePersonalChange} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                    <input required type="email" name="email" value={personalData.email} onChange={handlePersonalChange} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">¿Qué servicio necesitas?</label>
                  <select name="servicio" value={personalData.servicio} onChange={handlePersonalChange} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                    <option value="Consulta">Consulta General</option>
                    <option value="Ev. Psicológica">Evaluación Psicológica</option>
                    <option value="Ev. Psicopedagógica">Evaluación Psicopedagógica</option>
                    <option value="Ev. Desarrollo">Evaluación de Desarrollo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Motivo principal</label>
                  <textarea required name="motivo" value={personalData.motivo} onChange={handlePersonalChange} rows="2" className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"></textarea>
                </div>
              </div>
              <button type="submit" className="mt-8 w-full bg-slate-800 hover:bg-slate-900 text-white font-semibold py-3 px-6 rounded-xl transition-colors">
                Siguiente
              </button>
            </form>
          )}

          {/* PASO 2: FORMULARIO SOCIOECONÓMICO */}
          {step === 2 && (
            <form onSubmit={handleEvaluar} className="p-6 h-[80vh] overflow-y-auto">
              <div className="mb-6 border-b pb-4 sticky top-0 bg-white z-10 pt-2">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2"><ClipboardList size={20}/> Evaluación Socioeconómica</h2>
                <p className="text-xs text-slate-500 mt-1">Selecciona las opciones que mejor describan tu situación.</p>
                {errorMsg && <p className="text-xs text-red-500 mt-2 font-bold">{errorMsg}</p>}
              </div>

              <div className="space-y-8">
                <div>
                  <label className="font-semibold text-slate-800 text-sm">1. ¿En qué tipo de vivienda resides actualmente?</label>
                  <div className="mt-2 space-y-2">
                    {[
                      {label: 'Casa o departamento propio', val: 12}, {label: 'Casa o departamento alquilado', val: 9},
                      {label: 'Mediagua (prefabricada)', val: 6}, {label: 'Vivienda compartida', val: 3}, {label: 'Rancho, Choza, Covacha', val: 0}
                    ].map((opt, i) => (
                      <label key={i} className="flex items-center gap-2 text-sm text-slate-700 p-2 rounded hover:bg-slate-50 cursor-pointer">
                        <input required type="radio" name="q1" value={opt.val} onChange={handleSocioChange} className="w-4 h-4 text-blue-600" /> {opt.label}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-800 text-sm">2. ¿Qué tipo de servicio higiénico utiliza tu hogar?</label>
                  <div className="mt-2 space-y-2">
                    {[
                      {label: 'Alcantarillado público', val: 7}, {label: 'Pozo séptico', val: 5},
                      {label: 'Pozo ciego', val: 3}, {label: 'Letrina', val: 1}, {label: 'No tiene', val: 0}
                    ].map((opt, i) => (
                      <label key={i} className="flex items-center gap-2 text-sm text-slate-700 p-2 rounded hover:bg-slate-50 cursor-pointer">
                        <input required type="radio" name="q2" value={opt.val} onChange={handleSocioChange} className="w-4 h-4 text-blue-600" /> {opt.label}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-800 text-sm">3. Servicios básicos (Marca varios)</label>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <label className="flex items-center gap-2 text-sm p-2 bg-slate-50 rounded border"><input type="checkbox" name="q3_agua" value="2" onChange={handleSocioChange}/> Agua potable</label>
                    <label className="flex items-center gap-2 text-sm p-2 bg-slate-50 rounded border"><input type="checkbox" name="q3_luz" value="2" onChange={handleSocioChange}/> Luz eléctrica</label>
                    <label className="flex items-center gap-2 text-sm p-2 bg-slate-50 rounded border"><input type="checkbox" name="q3_basura" value="1" onChange={handleSocioChange}/> Recolección basura</label>
                    <label className="flex items-center gap-2 text-sm p-2 bg-slate-50 rounded border"><input type="checkbox" name="q3_internet" value="1" onChange={handleSocioChange}/> Internet</label>
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-800 text-sm">4. Dispositivos (Marca varios)</label>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <label className="flex items-center gap-2 text-sm p-2 bg-slate-50 rounded border"><input type="checkbox" name="q4_pc" value="2" onChange={handleSocioChange}/> PC escritorio</label>
                    <label className="flex items-center gap-2 text-sm p-2 bg-slate-50 rounded border"><input type="checkbox" name="q4_laptop" value="3" onChange={handleSocioChange}/> Laptop</label>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold text-slate-800 text-sm mb-2 block">5. Televisores</label>
                    <select name="q5_tv" required onChange={handleSocioChange} className="w-full p-2 border border-slate-300 rounded text-sm bg-white">
                      <option value="">Selecciona...</option>
                      <option value="0">Ninguno</option>
                      <option value="1">1 Televisor</option>
                      <option value="2">2 o más</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-slate-800 text-sm mb-2 block">6. Vehículos</label>
                    <select name="q6_vehiculo" required onChange={handleSocioChange} className="w-full p-2 border border-slate-300 rounded text-sm bg-white">
                      <option value="">Selecciona...</option>
                      <option value="0">Ninguno</option>
                      <option value="3">1 Vehículo</option>
                      <option value="5">2 o más</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-800 text-sm">7. Nivel de instrucción más alto en el hogar</label>
                  <select name="q7_estudio" required onChange={handleSocioChange} className="mt-2 w-full p-2 border border-slate-300 rounded text-sm bg-white">
                    <option value="">Selecciona...</option>
                    <option value="0">Sin estudios</option>
                    <option value="2">Primaria</option>
                    <option value="5">Secundaria</option>
                    <option value="9">Tercer nivel</option>
                    <option value="10">Cuarto nivel</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-800 text-sm">8. Situación laboral del sostén económico</label>
                  <select name="q8_trabajo" required onChange={handleSocioChange} className="mt-2 w-full p-2 border border-slate-300 rounded text-sm bg-white">
                    <option value="">Selecciona...</option>
                    <option value="15">Estable ({">"} Básico)</option>
                    <option value="10">Estable (= Básico)</option>
                    <option value="5">Informal / Subempleo</option>
                    <option value="0">Desempleado</option>
                  </select>
                </div>
              </div>

              <div className="mt-8 pb-4 sticky bottom-0 bg-white border-t pt-4">
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors shadow-lg">
                  Generar Evaluación
                </button>
              </div>
            </form>
          )}

          {/* PASO 3: LOADING */}
          {step === 3 && (
            <div className="p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <h2 className="text-lg font-semibold text-slate-800">Evaluando perfil...</h2>
              <p className="text-sm text-slate-500 mt-2">Conectando con el servidor de manera segura.</p>
            </div>
          )}

          {/* PASO 4: PROPUESTA / CONFIRMACIÓN */}
          {step === 4 && proposal && (
            <div className="p-6">
              <div className="text-center mb-6 border-b pb-6 border-slate-200">
                <h2 className="text-2xl font-bold text-slate-800">Tu Plan Terapéutico</h2>
                <p className="text-slate-600 mt-2 text-sm">Hemos ajustado la tarifa según tu perfil para: {personalData.servicio}.</p>
                {errorMsg && <p className="text-xs text-red-500 mt-2 font-bold">{errorMsg}</p>}
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mb-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10"><Stethoscope size={80} /></div>
                
                <div className="relative z-10">
                  <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-1">Especialista Asignado</p>
                  <p className="text-xl font-bold text-slate-800 mb-6">{proposal.terapeuta.name}</p>

                  <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-1">
                    {personalData.servicio === 'Consulta' ? 'Costo por sesión' : 'Costo total de la evaluación'}
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-slate-800">${proposal.costo}</span>
                    <span className="text-slate-500 font-medium">.00 USD</span>
                  </div>
                </div>
              </div>

              <button onClick={handleConfirmar} disabled={isSubmitting} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-xl transition-colors flex justify-center items-center gap-2 text-lg shadow-md">
                {isSubmitting ? 'Procesando...' : <><Send size={20} /> Confirmar Cita</>}
              </button>
              
              <button onClick={() => setStep(2)} disabled={isSubmitting} className="w-full text-slate-500 hover:text-slate-700 py-3 mt-2 text-sm font-medium">
                Cancelar y regresar
              </button>
            </div>
          )}

          {/* PASO 5: ÉXITO */}
          {step === 5 && (
            <div className="p-8 text-center min-h-[400px] flex flex-col justify-center">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={40} />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">¡Cita Confirmada!</h2>
              <p className="text-slate-600 mb-6">
                El especialista <strong>{proposal?.terapeuta?.name}</strong> ha recibido tu información y se pondrá en contacto pronto.
              </p>
              <button onClick={() => window.location.reload()} className="text-blue-600 font-semibold hover:underline">
                Volver al inicio
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
