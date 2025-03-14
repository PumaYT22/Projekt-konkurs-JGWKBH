import React, { useEffect, useRef } from 'react';

const Wave_gen = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Ustawienie pełnej szerokości canvas
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    // Funkcja do obsługi zmiany rozmiaru
    const handleResize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    
    window.addEventListener('resize', handleResize);
    
    // Parametry animacji
    const waves = 4;
    let phase = 0;
    let colorPhase = 0;
    
    // Funkcja do generowania kolorów
    const generateColor = (offset) => {
      // Płynne przejście między fioletem a zielonym
      const hueValue = ((Math.sin(colorPhase + offset) + 1) / 2) * 160 + 240; // 240-400 (czyli 240-40, bo hue to 0-360)
      return `hsla(${hueValue % 360}, 80%, 60%, 0.7)`;
    };
    
    // Funkcja do animacji
    const animate = () => {
      // Czyszczenie canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Środek canvas
      const centerY = canvas.height / 2;
      
      // Rysowanie każdej fali
      for (let w = 0; w < waves; w++) {
        // Przesunięcie fazy dla każdej fali
        const phaseShift = w * 0.8;
        // Wysoka amplituda dla dynamicznej animacji
        const baseAmplitude = canvas.height / 3.5 * (1 - w * 0.1);
        
        // Gradient dla każdej fali z dynamicznymi kolorami
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        
        // Dynamiczne kolory z płynnym przejściem
        const colorOffset = w * 0.5;
        gradient.addColorStop(0, generateColor(colorOffset));
        gradient.addColorStop(0.5, generateColor(colorOffset + 0.5));
        gradient.addColorStop(1, generateColor(colorOffset + 1));
        
        ctx.beginPath();
        
        // Rysowanie dynamicznej sinusoidy
        for (let x = 0; x <= canvas.width; x++) {
          if (x === 0) {
            ctx.moveTo(0, centerY);
          } else {
            // Wysokie częstotliwości dla dynamicznego ruchu
            const frequency = 0.01 + (w * 0.002); 
            const dynamicPhase = phase * (1.5 + w * 0.2);
            
            // Dynamiczna amplituda oparta na wielu funkcjach dla bardziej złożonego ruchu
            const waveAmplitude = baseAmplitude * 
              (0.8 + Math.sin(dynamicPhase * 0.7) * 0.4) * 
              (0.9 + Math.cos(x * 0.02 + phase) * 0.3);
            
            // Złożona funkcja fali dla bardziej chaotycznego ruchu
            const y = centerY + 
              Math.sin(x * frequency + dynamicPhase + phaseShift) * waveAmplitude +
              Math.sin(x * frequency * 2.5 + dynamicPhase * 1.8) * (waveAmplitude * 0.4) +
              Math.sin(x * frequency * 0.5 + dynamicPhase * 0.9) * (waveAmplitude * 0.2);
            
            ctx.lineTo(x, y);
          }
        }
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2.5;
        ctx.stroke();
      }
      
      // Szybsza aktualizacja fazy dla bardziej dynamicznego ruchu
      phase += 0.12;
      // Wolniejsza zmiana kolorów
      colorPhase += 0.01;
      
      // Kontynuacja animacji
      requestAnimationFrame(animate);
    };
    
    // Uruchomienie animacji
    animate();
    
    // Czyszczenie przy odmontowaniu
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return (
    <div className="w-full h-24 flex items-center justify-center">
      <canvas 
        ref={canvasRef} 
        className="w-full h-8"
      />
    </div>
  );
};

export default Wave_gen;