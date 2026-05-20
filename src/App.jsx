import { useState } from 'react';
import axios from 'axios';
import {
  User, ChevronRight, CheckCircle2,
  Send, ClipboardList, Stethoscope, Shield,
  Activity, Zap
} from 'lucide-react';
import logoCentroMedico from './assets/logo_centro_medico.jpeg';
import imgAlex from './assets/alex.jpeg';
import imgGaby from './assets/gaby.jpeg';
import imgPoleth from './assets/poleth.jpeg';

// URL del backend
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

const AREAS_Y_SERVICIOS = {
  'Psicología': [
    'Atención Psicológica/Clínica/Infantil',
    'Ev. Psicológica',
    'Ev. Psicopedagógica',
    'Ev. Desarrollo'
  ]
};

// Por ahora solo mostraremos Psicología
const AREAS_VISIBLES = ['Psicología'];

// Decorative Network Background Component
const TechBackground = () => (
  <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
    <div className="absolute top-0 left-0 w-full h-full bg-med-dark opacity-90"></div>
    {/* Subtle gradient overlays */}
    <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-med-cyan/20 rounded-full blur-[120px]"></div>
    <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-med-cyan/10 rounded-full blur-[100px]"></div>

    {/* Minimal SVG Network pattern (simulated with CSS/SVG) */}
    <svg className="absolute w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="network" width="100" height="100" patternUnits="userSpaceOnUse">
          <circle cx="50" cy="50" r="2" fill="#00D2D3" />
          <path d="M50 50 L100 0 M50 50 L0 100 M50 50 L100 100 M50 50 L0 0" stroke="#00D2D3" strokeWidth="0.5" strokeDasharray="4 4" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#network)" />
    </svg>
  </div>
);


export default function App() {
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Paso 1: Datos Personales
  const [personalData, setPersonalData] = useState({
    nombre: '', telefono: '', email: '', fechaNacimiento: '', edad: '',
    representanteNombre: '', representanteTelefono: '', area: 'Psicología', servicio: 'Atención Psicológica/Clínica/Infantil', motivo: '',
    preferenciaDia: 'Lunes a Viernes'
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
      servicio: AREAS_Y_SERVICIOS[newArea][0]
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

  const handleEvaluar = async (e) => {
    e.preventDefault();
    setStep(3); // Loading
    setErrorMsg('');

    try {
      const response = await axios.post(`${BACKEND_URL}/api/evaluar`, {
        personalData,
        socioData
      });
      setProposal(response.data);
      setStep(4);
    } catch (error) {
      console.error("Error evaluando:", error);
      setErrorMsg("Error al conectar con el servidor. Intenta nuevamente.");
      setStep(2);
    }
  };

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
      setStep(5);
    } catch (error) {
      console.error("Error confirmando:", error);
      setErrorMsg("No se pudo confirmar tu cita. Por favor, intenta de nuevo.");
      setIsSubmitting(false);
    }
  };

  // Base input styles for reuse
  const inputStyles = "w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-med-cyan outline-none bg-med-light text-med-text shadow-sm transition-all";
  const labelStyles = "block text-sm font-semibold text-med-text mb-1.5";

  return (
    <div className="min-h-screen bg-med-dark flex flex-col font-sans text-med-text relative overflow-x-hidden">
      <TechBackground />

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative z-10 w-full">
        {/* Main Card Container */}
        <div className="w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-med-cyan/20 relative">

          {/* PASO 0: INTRO */}
          {step === 0 && (
            <div className="p-8 md:p-12 text-center">
              <div className="mx-auto mb-10 flex justify-center">
                <div className="w-48 h-48 md:w-56 md:h-56 bg-white rounded-full p-2 shadow-[0_0_40px_rgba(0,210,211,0.3)] flex items-center justify-center animate-float border-2 border-med-cyan/30 overflow-hidden">
                  <img src={logoCentroMedico} alt="Logo Centro Médico" className="w-full h-full object-cover" />
                </div>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-med-dark mb-4 tracking-tight">
                Centro de Especialidades Médicas <br /> <span className="text-med-cyan">Dr. Hernán Santacruz</span>
              </h1>
              <p className="text-med-gray mb-10 leading-relaxed text-lg max-w-lg mx-auto">
                Cuidando tu salud con excelencia desde 1988. Completa tu perfil para solicitar una consulta especializada y evaluar tu tarifa preferencial.
              </p>

              <button onClick={() => setStep(1)} className="w-full md:w-auto md:px-12 bg-med-cyan hover:bg-med-cyan-hover text-med-dark font-bold py-4 rounded-full transition-all duration-300 flex justify-center items-center gap-2 shadow-[0_4px_14px_0_rgba(0,210,211,0.39)] hover:shadow-[0_6px_20px_rgba(0,210,211,0.23)] hover:-translate-y-1 mx-auto text-lg uppercase tracking-wide">
                Solicitar Consulta <ChevronRight size={24} />
              </button>
            </div>
          )}

          {/* PASO 1: DATOS PERSONALES */}
          {step === 1 && (
            <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="p-8 md:p-10">
              <div className="mb-8 border-b border-gray-100 pb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-med-dark flex items-center gap-3">
                    <User className="text-med-cyan" size={28} />
                    Datos del Paciente
                  </h2>
                  <p className="text-sm text-med-gray mt-1">Ingresa tu información de contacto principal</p>
                </div>
                <div className="hidden sm:block w-12 h-12 rounded-full border-2 border-med-cyan/20 overflow-hidden">
                  <img src={logoCentroMedico} alt="Logo" className="w-full h-full object-cover" />
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelStyles}>Nombre Completo</label>
                    <input required type="text" name="nombre" value={personalData.nombre} onChange={handlePersonalChange} className={inputStyles} placeholder="Ej. Juan Pérez" />
                  </div>
                  <div>
                    <label className={labelStyles}>Fecha de Nacimiento</label>
                    <input required type="date" name="fechaNacimiento" value={personalData.fechaNacimiento} onChange={handlePersonalChange} className={inputStyles} />
                  </div>
                </div>

                {personalData.edad !== '' && personalData.edad < 18 && (
                  <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-med-cyan"></div>
                    <p className="text-sm font-bold text-med-dark mb-4 flex items-center gap-2">
                      <Shield size={18} className="text-med-cyan" /> Paciente Menor de Edad ({personalData.edad} años)
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-med-gray mb-1">Nombre del Representante</label>
                        <input required type="text" name="representanteNombre" value={personalData.representanteNombre} onChange={handlePersonalChange} className={inputStyles} />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-med-gray mb-1">Teléfono del Representante</label>
                        <input required type="tel" name="representanteTelefono" value={personalData.representanteTelefono} onChange={handlePersonalChange} className={inputStyles} />
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {!(personalData.edad !== '' && personalData.edad < 18) && (
                    <div>
                      <label className={labelStyles}>Teléfono de Contacto</label>
                      <input required type="tel" name="telefono" value={personalData.telefono} onChange={handlePersonalChange} className={inputStyles} placeholder="Ej. 0991234567" />
                    </div>
                  )}
                  <div className={personalData.edad !== '' && personalData.edad < 18 ? "md:col-span-2" : ""}>
                    <label className={labelStyles}>Correo Electrónico</label>
                    <input required type="email" name="email" value={personalData.email} onChange={handlePersonalChange} className={inputStyles} placeholder="correo@ejemplo.com" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelStyles}>Área de Especialidad</label>
                    <select name="area" value={personalData.area} onChange={handleAreaChange} className={inputStyles}>
                      {AREAS_VISIBLES.map(area => (
                        <option key={area} value={area}>{area}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelStyles}>Servicio Requerido</label>
                    <select name="servicio" value={personalData.servicio} onChange={handlePersonalChange} className={inputStyles}>
                      {AREAS_Y_SERVICIOS[personalData.area]?.map(srv => (
                        <option key={srv} value={srv}>{srv}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className={labelStyles}>Días de Preferencia para su Cita</label>
                  <select name="preferenciaDia" value={personalData.preferenciaDia} onChange={handlePersonalChange} className={inputStyles}>
                    <option value="Lunes a Viernes">Lunes a Viernes</option>
                    <option value="Sábado y Domingo">Sábado y Domingo</option>
                  </select>
                </div>

                <div>
                  <label className={labelStyles}>Motivo de la Consulta</label>
                  <textarea required name="motivo" value={personalData.motivo} onChange={handlePersonalChange} rows="3" className={`${inputStyles} resize-none`} placeholder="Describe brevemente tus síntomas o motivo de visita..."></textarea>
                </div>
              </div>

              <button type="submit" className="mt-10 w-full bg-med-cyan hover:bg-med-cyan-hover text-med-dark font-bold py-4 rounded-xl transition-all shadow-[0_4px_14px_0_rgba(0,210,211,0.2)] hover:shadow-[0_6px_20px_rgba(0,210,211,0.4)] text-lg flex items-center justify-center gap-2">
                Continuar a Evaluación <ChevronRight size={20} />
              </button>
            </form>
          )}

          {/* PASO 2: FORMULARIO SOCIOECONÓMICO */}
          {step === 2 && (
            <form onSubmit={handleEvaluar} className="p-8 md:p-10 h-[85vh] md:h-[75vh] overflow-y-auto custom-scrollbar">
              <div className="mb-8 border-b border-gray-100 pb-4 sticky top-0 bg-white/95 backdrop-blur-sm z-10 pt-2">
                <h2 className="text-2xl font-bold text-med-dark flex items-center gap-3">
                  <Activity size={28} className="text-med-cyan" />
                  Evaluación Socioeconómica
                </h2>
                <p className="text-sm text-med-gray mt-2">Esta información es confidencial y nos permite ajustar nuestras tarifas a tu realidad.</p>
                {errorMsg && <p className="text-sm text-red-500 mt-2 font-bold p-2 bg-red-50 rounded-lg">{errorMsg}</p>}
              </div>

              <div className="space-y-10">
                {/* Q1 */}
                <div className="bg-med-light/50 p-6 rounded-2xl border border-gray-100">
                  <label className="font-bold text-med-dark text-base block mb-4">1. ¿En qué tipo de vivienda resides actualmente?</label>
                  <div className="space-y-3">
                    {[
                      { label: 'Casa o departamento propio', val: 12 }, { label: 'Casa o departamento alquilado', val: 9 },
                      { label: 'Mediagua (prefabricada)', val: 6 }, { label: 'Vivienda compartida', val: 3 }, { label: 'Rancho, Choza, Covacha', val: 0 }
                    ].map((opt, i) => (
                      <label key={i} className="flex items-center gap-3 text-sm text-med-text p-3 bg-white rounded-xl border border-gray-200 hover:border-med-cyan cursor-pointer transition-colors shadow-sm">
                        <input required type="radio" name="q1" value={opt.val} onChange={handleSocioChange} className="w-5 h-5 text-med-cyan focus:ring-med-cyan accent-med-cyan" /> {opt.label}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Q2 */}
                <div className="bg-med-light/50 p-6 rounded-2xl border border-gray-100">
                  <label className="font-bold text-med-dark text-base block mb-4">2. ¿Qué tipo de servicio higiénico utiliza tu hogar?</label>
                  <div className="space-y-3">
                    {[
                      { label: 'Alcantarillado público', val: 7 }, { label: 'Pozo séptico', val: 5 },
                      { label: 'Pozo ciego', val: 3 }, { label: 'Letrina', val: 1 }, { label: 'No tiene', val: 0 }
                    ].map((opt, i) => (
                      <label key={i} className="flex items-center gap-3 text-sm text-med-text p-3 bg-white rounded-xl border border-gray-200 hover:border-med-cyan cursor-pointer transition-colors shadow-sm">
                        <input required type="radio" name="q2" value={opt.val} onChange={handleSocioChange} className="w-5 h-5 text-med-cyan focus:ring-med-cyan accent-med-cyan" /> {opt.label}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Q3 */}
                <div className="bg-med-light/50 p-6 rounded-2xl border border-gray-100">
                  <label className="font-bold text-med-dark text-base block mb-4">3. Servicios básicos (Marca varios)</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { label: 'Agua potable', name: 'q3_agua', val: 2 }, { label: 'Luz eléctrica', name: 'q3_luz', val: 2 },
                      { label: 'Recolección basura', name: 'q3_basura', val: 1 }, { label: 'Internet', name: 'q3_internet', val: 1 }
                    ].map((opt, i) => (
                      <label key={i} className="flex items-center gap-3 text-sm p-3 bg-white rounded-xl border border-gray-200 hover:border-med-cyan cursor-pointer transition-colors shadow-sm">
                        <input type="checkbox" name={opt.name} value={opt.val} onChange={handleSocioChange} className="w-5 h-5 text-med-cyan focus:ring-med-cyan accent-med-cyan rounded" /> {opt.label}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Q4 */}
                <div className="bg-med-light/50 p-6 rounded-2xl border border-gray-100">
                  <label className="font-bold text-med-dark text-base block mb-4">4. Dispositivos Tecnológicos (Marca varios)</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    <label className="flex items-center gap-2 text-sm p-3 bg-white rounded-xl border border-gray-200 hover:border-med-cyan cursor-pointer shadow-sm"><input type="checkbox" name="q4_pc" value="2" onChange={handleSocioChange} className="accent-med-cyan w-4 h-4" /> PC escritorio</label>
                    <label className="flex items-center gap-2 text-sm p-3 bg-white rounded-xl border border-gray-200 hover:border-med-cyan cursor-pointer shadow-sm"><input type="checkbox" name="q4_laptop" value="3" onChange={handleSocioChange} className="accent-med-cyan w-4 h-4" /> Laptop</label>
                    <label className="flex items-center gap-2 text-sm p-3 bg-white rounded-xl border border-gray-200 hover:border-med-cyan cursor-pointer shadow-sm"><input type="checkbox" name="q4_tablet" value="1" onChange={handleSocioChange} className="accent-med-cyan w-4 h-4" /> Tablet</label>
                    <label className="flex items-center gap-2 text-sm p-3 bg-white rounded-xl border border-gray-200 hover:border-med-cyan cursor-pointer shadow-sm"><input type="checkbox" name="q4_cel1" value="1" onChange={handleSocioChange} className="accent-med-cyan w-4 h-4" /> 1 Celular</label>
                    <label className="flex items-center gap-2 text-sm p-3 bg-white rounded-xl border border-gray-200 hover:border-med-cyan cursor-pointer shadow-sm"><input type="checkbox" name="q4_cel2" value="3" onChange={handleSocioChange} className="accent-med-cyan w-4 h-4" /> 2+ Celulares</label>
                  </div>
                </div>

                {/* Q5 */}
                <div className="bg-med-light/50 p-6 rounded-2xl border border-gray-100">
                  <label className="font-bold text-med-dark text-base block mb-4">5. Bienes del hogar y Vehículos (Marca varios)</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    <label className="flex items-center gap-2 text-sm p-3 bg-white rounded-xl border border-gray-200 hover:border-med-cyan cursor-pointer shadow-sm"><input type="checkbox" name="q5_refri" value="3" onChange={handleSocioChange} className="accent-med-cyan w-4 h-4" /> Refrigeradora</label>
                    <label className="flex items-center gap-2 text-sm p-3 bg-white rounded-xl border border-gray-200 hover:border-med-cyan cursor-pointer shadow-sm"><input type="checkbox" name="q5_lava" value="3" onChange={handleSocioChange} className="accent-med-cyan w-4 h-4" /> Lavadora</label>
                    <label className="flex items-center gap-2 text-sm p-3 bg-white rounded-xl border border-gray-200 hover:border-med-cyan cursor-pointer shadow-sm"><input type="checkbox" name="q5_sonido" value="1" onChange={handleSocioChange} className="accent-med-cyan w-4 h-4" /> Eq. de sonido</label>
                    <label className="flex items-center gap-2 text-sm p-3 bg-white rounded-xl border border-gray-200 hover:border-med-cyan cursor-pointer shadow-sm"><input type="checkbox" name="q5_tv1" value="1" onChange={handleSocioChange} className="accent-med-cyan w-4 h-4" /> 1 Televisor</label>
                    <label className="flex items-center gap-2 text-sm p-3 bg-white rounded-xl border border-gray-200 hover:border-med-cyan cursor-pointer shadow-sm"><input type="checkbox" name="q5_tv2" value="2" onChange={handleSocioChange} className="accent-med-cyan w-4 h-4" /> 2+ Televisores</label>
                    <label className="flex items-center gap-2 text-sm p-3 bg-white rounded-xl border border-gray-200 hover:border-med-cyan cursor-pointer shadow-sm"><input type="checkbox" name="q5_veh1" value="3" onChange={handleSocioChange} className="accent-med-cyan w-4 h-4" /> 1 Vehículo</label>
                    <label className="flex items-center gap-2 text-sm p-3 bg-white rounded-xl border border-gray-200 hover:border-med-cyan cursor-pointer shadow-sm"><input type="checkbox" name="q5_veh2" value="5" onChange={handleSocioChange} className="accent-med-cyan w-4 h-4" /> 2+ Vehículos</label>
                  </div>
                </div>

                {/* Dropdowns */}
                <div className="space-y-6">
                  <div>
                    <label className="font-bold text-med-dark text-base block mb-2">6. Nivel de instrucción más alto en el hogar</label>
                    <select name="q7_estudio" required onChange={handleSocioChange} className={inputStyles}>
                      <option value="">Selecciona una opción...</option>
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
                    <label className="font-bold text-med-dark text-base block mb-2">7. Situación laboral del sostén económico</label>
                    <select name="q8_trabajo" required onChange={handleSocioChange} className={inputStyles}>
                      <option value="">Selecciona una opción...</option>
                      <option value="15">Estable (mayor al Básico)</option>
                      <option value="10">Estable (igual al Básico)</option>
                      <option value="5">Informal / Subempleo</option>
                      <option value="0">Desempleado</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-med-dark text-base block mb-2">8. ¿Seguro de salud de los miembros del hogar?</label>
                    <select name="q9_salud" required onChange={handleSocioChange} className={inputStyles}>
                      <option value="">Selecciona una opción...</option>
                      <option value="10">Seguro privado de salud</option>
                      <option value="10">IESS / ISSFA / ISSPOL</option>
                      <option value="5">Seguro campesino</option>
                      <option value="0">Ninguno</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-med-dark text-base block mb-2">9. Dependientes del ingreso familiar</label>
                    <select name="q10_dependientes" required onChange={handleSocioChange} className={inputStyles}>
                      <option value="">Selecciona una opción...</option>
                      <option value="10">1 a 2 personas</option>
                      <option value="7">3 a 4 personas</option>
                      <option value="4">5 a 6 personas</option>
                      <option value="0">Más de 6 personas</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="mt-10 pb-4 sticky bottom-0 bg-white/95 backdrop-blur-sm border-t border-gray-100 pt-6">
                <button type="submit" className="w-full bg-med-cyan hover:bg-med-cyan-hover text-med-dark font-bold py-4 rounded-xl transition-all shadow-[0_4px_14px_0_rgba(0,210,211,0.2)] hover:shadow-[0_6px_20px_rgba(0,210,211,0.4)] text-lg flex justify-center items-center gap-2">
                  <Zap size={20} /> Generar Evaluación Médica
                </button>
              </div>
            </form>
          )}

          {/* PASO 3: LOADING */}
          {step === 3 && (
            <div className="p-16 text-center flex flex-col items-center justify-center min-h-[500px]">
              <div className="relative w-24 h-24 mb-8">
                <div className="absolute inset-0 rounded-full border-4 border-med-light"></div>
                <div className="absolute inset-0 rounded-full border-4 border-med-cyan border-t-transparent animate-spin"></div>
                <Activity size={32} className="absolute inset-0 m-auto text-med-cyan animate-pulse" />
              </div>
              <h2 className="text-2xl font-bold text-med-dark mb-2">Procesando Evaluación...</h2>
              <p className="text-med-gray">Analizando datos socioeconómicos para asignar la mejor tarifa y especialista.</p>
            </div>
          )}

          {/* PASO 4: PROPUESTA / CONFIRMACIÓN */}
          {step === 4 && proposal && (
            <div className="p-8 md:p-10">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-med-cyan/10 text-med-cyan rounded-full mb-4">
                  <ClipboardList size={32} />
                </div>
                <h2 className="text-3xl font-bold text-med-dark tracking-tight">Plan de Atención</h2>
                <p className="text-med-gray mt-2 text-sm max-w-sm mx-auto">Basado en tu evaluación, hemos asignado un especialista y ajustado tu tarifa para: <strong className="text-med-dark">{personalData.servicio}</strong>.</p>
                {errorMsg && <p className="text-sm text-red-500 mt-4 font-bold bg-red-50 p-2 rounded-lg">{errorMsg}</p>}
              </div>

              <div className="bg-med-dark rounded-3xl p-8 mb-8 relative overflow-hidden shadow-2xl text-white">
                {/* Decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-med-cyan/10 rounded-full blur-[80px] -mr-20 -mt-20"></div>
                <Stethoscope size={160} className="absolute -bottom-10 -right-10 opacity-5 text-med-cyan" />

                <div className="relative z-10">
                  <p className="text-sm font-bold text-med-cyan uppercase tracking-wider mb-6">Especialista Asignado</p>

                  <div className="flex items-center gap-5 mb-8 bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-sm">
                    <img
                      src={
                        proposal.terapeuta.name.includes('Alexander')
                          ? imgAlex
                          : proposal.terapeuta.name.includes('Poleth')
                            ? imgPoleth
                            : imgGaby
                      }
                      alt="Terapeuta"
                      className={`w-20 h-20 rounded-full object-cover border-2 border-med-cyan shadow-[0_0_15px_rgba(0,210,211,0.5)] ${proposal.terapeuta.name.includes('Poleth') ? 'object-top' : ''
                        }`}
                    />
                    <div>
                      <p className="text-xl font-bold text-white leading-tight">
                        {proposal.terapeuta.name.includes('Alexander') ? 'Dr. ' : 'Dra. '}
                        {proposal.terapeuta.name.split(' (')[0]}
                      </p>
                      <p className="text-sm text-med-cyan mt-1 font-medium">
                        {proposal.terapeuta.name.includes('(') ? proposal.terapeuta.name.split('(')[1].replace(')', '') : 'Medicina General'}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-6">
                    <p className="text-sm font-bold text-med-gray uppercase tracking-wider mb-2">
                      {personalData.servicio.includes('Ev.') || personalData.servicio.includes('Evaluación') ? 'Tarifa de Evaluación' : 'Tarifa por Consulta'}
                    </p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-6xl font-black text-white tracking-tighter">${proposal.costo}</span>
                      <span className="text-med-cyan font-semibold text-lg">USD</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <button onClick={handleConfirmar} disabled={isSubmitting} className="w-full bg-med-cyan hover:bg-med-cyan-hover text-med-dark font-bold py-4 px-6 rounded-xl transition-all flex justify-center items-center gap-2 text-lg shadow-[0_4px_14px_0_rgba(0,210,211,0.3)]">
                  {isSubmitting ? (
                    <><div className="animate-spin rounded-full h-5 w-5 border-2 border-med-dark border-t-transparent"></div> Procesando...</>
                  ) : (
                    <><Send size={22} /> Confirmar Cita Médica</>
                  )}
                </button>

                <button onClick={() => setStep(2)} disabled={isSubmitting} className="w-full text-med-gray hover:text-med-dark py-3 text-sm font-semibold transition-colors">
                  Regresar y editar evaluación
                </button>
              </div>
            </div>
          )}

          {/* PASO 5: ÉXITO */}
          {step === 5 && (
            <div className="p-10 text-center min-h-[500px] flex flex-col justify-center items-center relative">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,210,211,0.1)_0,transparent_70%)] pointer-events-none"></div>

              <div className="w-28 h-28 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner relative z-10">
                <div className="absolute inset-0 rounded-full border-4 border-green-500/20 animate-ping"></div>
                <CheckCircle2 size={64} />
              </div>

              <h2 className="text-3xl font-bold text-med-dark mb-4 tracking-tight relative z-10">¡Solicitud Confirmada!</h2>
              <p className="text-med-gray mb-10 text-lg max-w-md relative z-10">
                Hemos recibido tu información exitosamente. El equipo médico se comunicará contigo a la brevedad.
              </p>

              <button onClick={() => window.location.reload()} className="bg-med-dark hover:bg-med-text text-white font-bold py-3 px-8 rounded-full transition-colors relative z-10 shadow-lg">
                Volver al Inicio
              </button>
            </div>
          )}

        </div>
      </div>

      {/* Footer */}
      <footer className="w-full py-6 text-center text-xs text-med-gray/60 border-t border-white/5 relative z-10 bg-med-dark/80 backdrop-blur-sm mt-auto">
        <div className="max-w-2xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} Adrian, Alex, Poleth, Gabs. Todos los derechos reservados.</p>
          <p>
            Desarrollado por: <span className="text-med-cyan/80 font-medium">Adrian Quiñonez</span> | Propiedad de: <span className="text-white/80 font-medium">RunaMente</span>
          </p>
        </div>
      </footer>
    </div>
  );
}