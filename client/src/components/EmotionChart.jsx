import { useState, useEffect } from 'react';

function ChartPoint({ p, showNames, hoveredId, setHoveredId }) {
  const [isNew, setIsNew] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsNew(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const offset = 16; 
  const leftPos = `calc(${offset}px + ${(p.x / 10)} * (100% - ${offset * 2}px))`;
  const topPos = `calc(${offset}px + ${(1 - p.y / 10)} * (100% - ${offset * 2}px))`;

  const isHovered = hoveredId === (p.id || p.timestamp);
  const showTooltip = showNames && p.nombre && (isHovered || isNew);

  return (
    <div 
      className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 hover:z-50"
      style={{ left: leftPos, top: topPos }}
      onMouseEnter={() => setHoveredId(p.id || p.timestamp)}
      onMouseLeave={() => setHoveredId(null)}
      title={showNames ? p.nombre : undefined}
    >
      <div className="p-4 bg-transparent cursor-pointer flex items-center justify-center">
        <div className={`w-3 h-3 md:w-4 md:h-4 bg-white rounded-full shadow-[0_0_12px_rgba(255,255,255,1)] border-2 border-slate-900 transition-all duration-200 ${(isHovered || isNew) ? 'scale-[1.8] bg-green-300' : ''}`}></div>
      </div>
      
      {showTooltip && (
        <div className={`absolute bottom-[80%] left-1/2 -translate-x-1/2 mb-1 pointer-events-none z-[9999] transition-opacity duration-500 ${isNew && !isHovered ? 'animate-in fade-in zoom-in duration-300' : ''}`}>
          <div className="bg-slate-900 text-white text-xs md:text-sm font-bold py-1.5 px-3 rounded-lg whitespace-nowrap shadow-2xl border border-white/40 relative">
            {p.nombre}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function EmotionChart({ points = [], showNames = false }) {
  const [hoveredId, setHoveredId] = useState(null);
  
  // Puntos tienen x (0 a 10) e y (0 a 10)
  // X = Placer, Y = Energía
  
  return (
    <div className="w-full max-w-5xl mx-auto flex flex-row items-stretch p-2 md:p-6 select-none aspect-[4/5] md:aspect-[16/9]">
      
      {/* Y-Axis: Energía */}
      <div className="w-12 md:w-20 flex flex-col justify-between items-center py-8 relative mr-2 md:mr-4">
        <span className="text-white/90 font-bold text-[10px] md:text-sm tracking-widest text-center">ALTA</span>
        
        <div className="flex-1 flex items-center justify-center relative w-full my-4">
          {/* Línea del eje Y */}
          <div className="absolute h-full w-[2px] bg-white/20 left-1/2 -translate-x-1/2 rounded-full"></div>
          {/* Texto central rotado */}
          <span className="text-white font-black tracking-[0.3em] text-sm md:text-xl transform -rotate-90 origin-center whitespace-nowrap drop-shadow-lg z-10 bg-[#0f172a] px-4 py-1 rounded-full border border-white/10">
            ENERGÍA
          </span>
        </div>

        <span className="text-white/90 font-bold text-[10px] md:text-sm tracking-widest text-center">BAJA</span>
      </div>

      {/* Área Principal del Gráfico */}
      <div className="flex-1 flex flex-col relative min-w-0">
        
        {/* Contenedor exacto del gráfico (relative flex-1, sin overflow-hidden) */}
        <div className="relative flex-1">
          
          {/* Capa de Fondo y Colores (Con bordes y overflow-hidden) */}
          <div className="absolute inset-0 rounded-2xl md:rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)] border-4 border-slate-700 bg-slate-900/50 pointer-events-none">
            {/* Ejes Centrales en forma de cruz blanca */}
            <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
              <div className="bg-[var(--color-cuadrante-alta-displacer)] opacity-90 transition-all border-r border-b border-white/50"></div>
              <div className="bg-[var(--color-cuadrante-alta-placer)] opacity-90 transition-all border-b border-l border-white/50"></div>
              <div className="bg-[var(--color-cuadrante-baja-displacer)] opacity-90 transition-all border-r border-t border-white/50"></div>
              <div className="bg-[var(--color-cuadrante-baja-placer)] opacity-90 transition-all border-t border-l border-white/50"></div>
            </div>
            
            {/* Reflejo Glassmorphism */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent"></div>
          </div>

          {/* Capa de Puntos (Coincide exactamente con el contenedor, sin overflow-hidden) */}
          <div className="absolute inset-0">
            {points.map((p) => (
              <ChartPoint 
                key={p.id || p.timestamp} 
                p={p} 
                showNames={showNames} 
                hoveredId={hoveredId} 
                setHoveredId={setHoveredId} 
              />
            ))}
          </div>
        </div>

        {/* X-Axis: Placer */}
        <div className="h-[60px] md:h-[80px] w-full flex justify-between items-center mt-2 relative">
          <span className="text-white/90 font-bold text-[10px] md:text-sm tracking-widest px-2">DISPLACER</span>
          
          <div className="flex-1 flex items-center justify-center relative h-full px-4">
            {/* Línea del eje X */}
            <div className="absolute w-full h-[2px] bg-white/20 top-1/2 -translate-y-1/2 rounded-full"></div>
            {/* Texto central */}
            <span className="text-white font-black tracking-[0.3em] text-sm md:text-xl z-10 bg-[#0f172a] px-6 py-1 rounded-full border border-white/10 drop-shadow-lg hidden sm:block">
              GRADOS
            </span>
          </div>
          
          <span className="text-white/90 font-bold text-[10px] md:text-sm tracking-widest px-2">PLACER</span>
        </div>

      </div>

    </div>
  );
}
