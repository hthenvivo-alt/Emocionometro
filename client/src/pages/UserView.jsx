import { useState, useMemo } from 'react';
import { socket } from '../socket';
import EmotionChart from '../components/EmotionChart';

const QUADRANTS = {
  altaDisplacer: { color: 'var(--color-cuadrante-alta-displacer)', name: 'Ansiedad / Tensión', msg: 'Momento de soltar. Estás con mucha energía pero algo te incomoda.' },
  altaPlacer: { color: 'var(--color-cuadrante-alta-placer)', name: 'Plenitud / Entusiasmo', msg: '¡Estás a tope! Esa energía mueve montañas, aprovéchala.' },
  bajaDisplacer: { color: 'var(--color-cuadrante-baja-displacer)', name: 'Desgaste / Tristeza', msg: 'Momento de introspección. Respira y date un respiro, es válido.' },
  bajaPlacer: { color: 'var(--color-cuadrante-baja-placer)', name: 'Calma / Relajación', msg: 'Estás en paz. Disfruta de esta tranquilidad y recarga baterías.' }
};

export default function UserView() {
  const [step, setStep] = useState(1); // 1: Name, 2: Sliders, 3: Result
  const [nombre, setNombre] = useState('');
  const [x, setX] = useState(5); // Placer (0-10)
  const [y, setY] = useState(5); // Energía (0-10)

  // Determinar cuadrante predominante
  const currentQuadrant = useMemo(() => {
    if (y >= 5 && x < 5) return QUADRANTS.altaDisplacer;
    if (y >= 5 && x >= 5) return QUADRANTS.altaPlacer;
    if (y < 5 && x < 5) return QUADRANTS.bajaDisplacer;
    if (y < 5 && x >= 5) return QUADRANTS.bajaPlacer;
    return QUADRANTS.altaPlacer;
  }, [x, y]);

  const handleSubmitName = (e) => {
    e.preventDefault();
    if (nombre.trim()) setStep(2);
  };

  const handleSubmitEmotions = () => {
    // Emitir socket
    socket.emit('submit-point', { nombre, x, y });
    setStep(3);
  };

  return (
    <div 
      className="min-h-screen w-full flex flex-col items-center justify-center p-6 relative transition-colors duration-1000 ease-in-out"
      style={{ backgroundColor: step === 2 || step === 3 ? currentQuadrant.color : '#0f172a' }}
    >
      {/* Capa de oscurecimiento para legibilidad (Glassmorphism) */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"></div>

      <div className="relative z-10 w-full max-w-sm flex flex-col gap-8">
        
        {step === 1 && (
          <form onSubmit={handleSubmitName} className="glass-dark p-8 rounded-3xl shadow-2xl flex flex-col gap-6 animate-in fade-in zoom-in duration-500">
            <div className="text-center">
              <h1 className="text-3xl font-extrabold mb-2 tracking-tight">Límbico</h1>
              <p className="text-slate-300">Descubre tu estado emocional</p>
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Tu Nombre</label>
              <input 
                type="text" 
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej. Martín"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-white/50 transition-all placeholder:text-white/30 text-white"
                required
                autoFocus
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-white text-slate-900 font-bold text-lg py-4 rounded-xl hover:bg-slate-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.3)] mt-2"
            >
              Comenzar
            </button>
          </form>
        )}

        {step === 2 && (
          <div className="glass-dark p-6 md:p-8 rounded-3xl shadow-2xl flex flex-col gap-8 animate-in slide-in-from-right duration-500">
            <h2 className="text-2xl font-bold text-center leading-tight">¿Cómo te sientes en este momento?</h2>
            
            <div className="flex flex-col gap-6">
              {/* Slider Energía (Y) */}
              <div className="flex flex-col gap-3">
                <div className="flex justify-between text-sm font-bold tracking-widest text-white/80">
                  <span>ENERGÍA BAJA</span>
                  <span>ALTA</span>
                </div>
                <input 
                  type="range" 
                  min="0" max="10" step="0.1"
                  value={y}
                  onChange={(e) => setY(parseFloat(e.target.value))}
                />
              </div>

              {/* Slider Placer (X) */}
              <div className="flex flex-col gap-3 mt-4">
                <div className="flex justify-between text-sm font-bold tracking-widest text-white/80">
                  <span>DISPLACER</span>
                  <span>PLACER</span>
                </div>
                <input 
                  type="range" 
                  min="0" max="10" step="0.1"
                  value={x}
                  onChange={(e) => setX(parseFloat(e.target.value))}
                />
              </div>
            </div>

            <button 
              onClick={handleSubmitEmotions}
              className="w-full bg-white text-slate-900 font-bold text-lg py-4 rounded-xl hover:bg-slate-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.3)] mt-4"
            >
              Ver mi resultado
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-6 animate-in slide-in-from-bottom duration-700">
            
            <div className="glass-dark p-6 rounded-3xl text-center shadow-2xl">
              <h2 className="text-xl font-bold mb-2">¡Gracias, {nombre}!</h2>
              <p className="text-lg font-medium text-white/90">{currentQuadrant.msg}</p>
            </div>

            <div className="w-full aspect-square pointer-events-none">
              {/* Le pasamos un solo punto con las coords del usuario */}
              <EmotionChart points={[{ id: 'me', x, y }]} showNames={false} />
            </div>

            <button 
              onClick={() => { setStep(2); }}
              className="glass border border-white/20 text-white font-bold text-lg py-3 rounded-xl hover:bg-white/10 transition-colors mt-2"
            >
              Volver a intentar
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
