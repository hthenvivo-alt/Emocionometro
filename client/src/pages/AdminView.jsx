import { useState, useEffect } from 'react';
import { socket } from '../socket';
import EmotionChart from '../components/EmotionChart';

export default function AdminView() {
  const [points, setPoints] = useState([]);

  useEffect(() => {
    socket.on('points-updated', (newPoints) => {
      setPoints(newPoints);
    });

    return () => {
      socket.off('points-updated');
    };
  }, []);

  const handleClear = () => {
    if (confirm('¿Seguro que quieres limpiar todos los puntos?')) {
      socket.emit('clear-points');
    }
  };

  const handleExportCSV = () => {
    if (points.length === 0) {
      alert("No hay datos para exportar.");
      return;
    }

    const headers = ["ID", "Nombre", "Energia", "Placer", "Fecha"];
    const csvRows = [headers.join(",")];

    points.forEach(p => {
      const date = new Date(p.timestamp).toISOString();
      csvRows.push(`${p.id},"${p.nombre}",${p.y},${p.x},${date}`);
    });

    const csvData = csvRows.join("\n");
    const blob = new Blob([csvData], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", `emociones_${new Date().getTime()}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-8 relative">
      
      {/* Header Admin */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Emocionómetro <span className="text-blue-400">Admin</span></h1>
          <p className="text-slate-400">Total participantes: {points.length}</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleExportCSV}
            className="glass px-4 py-2 rounded-lg font-semibold hover:bg-white/10 transition-colors"
          >
            Exportar CSV
          </button>
          <button 
            onClick={handleClear}
            className="bg-red-500/80 hover:bg-red-500 text-white px-4 py-2 rounded-lg font-semibold shadow-lg transition-colors border border-red-400/50"
          >
            Limpiar Gráfico
          </button>
        </div>
      </div>

      {/* Contenedor del Gráfico Centrado */}
      <div className="flex-1 flex items-center justify-center">
        <EmotionChart points={points} showNames={true} />
      </div>

    </div>
  );
}
