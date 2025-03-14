//  JASNY:
// import React from 'react';

// const Wave = () => {
//   const waveConfig = [
//     { id: 'pink', duration: 6, direction: 'left' },
//     { id: 'blue', duration: 7, direction: 'right' },
//     { id: 'cyan', duration: 8, direction: 'left' }
//   ];

//   return (
//     <div className="w-full h-[10vh] bg-white flex items-center justify-center overflow-hidden">
//       <div className="relative w-full h-full">
//         <svg className="w-full h-full" viewBox="0 0 800 50" preserveAspectRatio="none">
//           <defs>
//             <linearGradient id="pinkGradient" x1="0%" y1="0%" x2="100%" y2="0%">
//               <stop offset="0%" stopColor="#ff3399" />
//               <stop offset="100%" stopColor="#ff66cc" />
//             </linearGradient>
//             <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="0%">
//               <stop offset="0%" stopColor="#3366ff" />
//               <stop offset="100%" stopColor="#33ccff" />
//             </linearGradient>
//             <linearGradient id="cyanGradient" x1="0%" y1="0%" x2="100%" y2="0%">
//               <stop offset="0%" stopColor="#00cccc" />
//               <stop offset="100%" stopColor="#33ffff" />
//             </linearGradient>
//             <filter id="glow">
//               <feGaussianBlur stdDeviation="1" result="blur" />
//               <feComposite in="SourceGraphic" in2="blur" operator="over" />
//             </filter>
//           </defs>

//           {waveConfig.map(({ id, duration, direction }) => (
//             <g key={id} className="opacity-90">
//               <g transform="translate(0,25)">
//                 <path
//                   d={`M0,25 ${getWavePath(id)}`}
//                   fill="none"
//                   stroke={`url(#${id}Gradient)`}
//                   strokeWidth="2"
//                   strokeLinecap="round"
//                   filter="url(#glow)"
//                 />
//                 <path
//                   d={`M0,25 ${getWavePath(id)}`}
//                   fill="none"
//                   stroke={`url(#${id}Gradient)`}
//                   strokeWidth="2"
//                   strokeLinecap="round"
//                   filter="url(#glow)"
//                   transform={`translate(${direction === 'left' ? '800' : '-800'},0)`}
//                 />
//                 <animateTransform
//                   attributeName="transform"
//                   type="translate"
//                   from="0,0"
//                   to={`${direction === 'left' ? '-800' : '800'},0`}
//                   dur={`${duration}s`}
//                   repeatCount="indefinite"
//                   calcMode="linear"
//                 />
//               </g>
//             </g>
//           ))}
//         </svg>
//       </div>
//     </div>
//   );
// };

// const getWavePath = (id) => {
//   switch(id) {
//     case 'pink': return 'C100,12 200,38 300,25 S500,4 600,25 S700,42 800,25';
//     case 'blue': return 'C120,28 240,20 360,25 S500,28 640,25 S750,20 800,25';
//     case 'cyan': return 'C150,20 250,38 400,25 S600,16 700,25 S750,28 800,25';
//     default: return '';
//   }
// };

// export default Wave;

//CIEMNY:
// import React from 'react';

// const WaveDark = () => {
//   const waveConfig = [
//     { id: 'pink', duration: 6, direction: 'left' },
//     { id: 'blue', duration: 7, direction: 'right' },
//     { id: 'cyan', duration: 8, direction: 'left' }
//   ];

//   return (
//     <div className="w-full h-[10vh] bg-[#101828] flex items-center justify-center overflow-hidden">
//       <div className="relative w-full h-full">
//         <svg className="w-full h-full" viewBox="0 0 800 50" preserveAspectRatio="none">
//           <defs>
//             <linearGradient id="pinkGradient" x1="0%" y1="0%" x2="100%" y2="0%">
//               <stop offset="0%" stopColor="#ff3399" />
//               <stop offset="100%" stopColor="#ff66cc" />
//             </linearGradient>
//             <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="0%">
//               <stop offset="0%" stopColor="#3366ff" />
//               <stop offset="100%" stopColor="#33ccff" />
//             </linearGradient>
//             <linearGradient id="cyanGradient" x1="0%" y1="0%" x2="100%" y2="0%">
//               <stop offset="0%" stopColor="#00cccc" />
//               <stop offset="100%" stopColor="#33ffff" />
//             </linearGradient>
//             <filter id="glow">
//               <feGaussianBlur stdDeviation="1.2" result="blur" />
//               <feComposite in="SourceGraphic" in2="blur" operator="over" />
//             </filter>
//           </defs>

//           {waveConfig.map(({ id, duration, direction }) => (
//             <g key={id} className="opacity-90">
//               <g transform="translate(0,25)">
//                 <path
//                   d={`M0,25 ${getWavePath(id)}`}
//                   fill="none"
//                   stroke={`url(#${id}Gradient)`}
//                   strokeWidth="2.2"
//                   strokeLinecap="round"
//                   filter="url(#glow)"
//                 />
//                 <path
//                   d={`M0,25 ${getWavePath(id)}`}
//                   fill="none"
//                   stroke={`url(#${id}Gradient)`}
//                   strokeWidth="2.2"
//                   strokeLinecap="round"
//                   filter="url(#glow)"
//                   transform={`translate(${direction === 'left' ? '800' : '-800'},0)`}
//                 />
//                 <animateTransform
//                   attributeName="transform"
//                   type="translate"
//                   from="0,0"
//                   to={`${direction === 'left' ? '-800' : '800'},0`}
//                   dur={`${duration}s`}
//                   repeatCount="indefinite"
//                   calcMode="linear"
//                 />
//               </g>
//             </g>
//           ))}
//         </svg>
//       </div>
//     </div>
//   );
// };

// const getWavePath = (id) => {
//   switch(id) {
//     case 'pink': return 'C100,12 200,38 300,25 S500,4 600,25 S700,42 800,25';
//     case 'blue': return 'C120,28 240,20 360,25 S500,28 640,25 S750,20 800,25';
//     case 'cyan': return 'C150,20 250,38 400,25 S600,16 700,25 S750,28 800,25';
//     default: return '';
//   }
// };

// export default WaveDark;



//OSTATNI
import React, { useEffect, useRef } from 'react';

const Wave = () => {
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
    let animationIntensity = 0;
    let increasing = true;
    
    // Funkcja do animacji
    const animate = () => {
      // Czyszczenie canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Środek canvas
      const centerY = canvas.height / 2;
      
      // Zmiana intensywności animacji
      if (increasing) {
        animationIntensity += 0.01;
        if (animationIntensity >= 1) {
          increasing = false;
        }
      } else {
        animationIntensity -= 0.01;
        if (animationIntensity <= 0.2) {
          increasing = true;
        }
      }
      
      // Rysowanie każdej fali
      for (let w = 0; w < waves; w++) {
        // Przesunięcie fazy dla każdej fali
        const phaseShift = w * 0.5;
        // Amplituda różna dla każdej fali
        const baseAmplitude = canvas.height / 6 * (1 - w * 0.15);
        // Dynamiczna amplituda
        const amplitude = baseAmplitude * (0.5 + animationIntensity * 0.5);
        
        // Gradient dla każdej fali z różnymi kolorami
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        
        // Różne kolory dla różnych fal
        if (w === 0) {
          gradient.addColorStop(0, 'rgba(90, 50, 255, 0.6)');
          gradient.addColorStop(0.5, 'rgba(120, 100, 255, 0.7)');
          gradient.addColorStop(1, 'rgba(150, 100, 255, 0.6)');
        } else if (w === 1) {
          gradient.addColorStop(0, 'rgba(70, 80, 255, 0.6)');
          gradient.addColorStop(0.5, 'rgba(100, 120, 255, 0.7)');
          gradient.addColorStop(1, 'rgba(130, 140, 255, 0.6)');
        } else if (w === 2) {
          gradient.addColorStop(0, 'rgba(50, 100, 255, 0.5)');
          gradient.addColorStop(0.5, 'rgba(80, 140, 255, 0.6)');
          gradient.addColorStop(1, 'rgba(110, 160, 255, 0.5)');
        } else {
          gradient.addColorStop(0, 'rgba(30, 120, 255, 0.4)');
          gradient.addColorStop(0.5, 'rgba(60, 160, 255, 0.5)');
          gradient.addColorStop(1, 'rgba(90, 180, 255, 0.4)');
        }
        
        ctx.beginPath();
        
        // Rysowanie sinusoidy
        for (let x = 0; x <= canvas.width; x++) {
          if (x === 0) {
            ctx.moveTo(0, centerY);
          } else {
            // Wyliczanie współrzędnej Y na podstawie sinusa z różnymi częstotliwościami
            const frequency = 0.005 + (w * 0.001);
            const dynamicPhase = phase * (1 + w * 0.2);
            
            // Dynamiczne dostosowanie amplitudy dla każdego punktu
            const pointAmplitude = amplitude * 
              (0.8 + Math.sin(dynamicPhase / 2) * 0.2) * 
              (0.9 + Math.sin(x * 0.01) * 0.1);
            
            // Bardziej złożona funkcja dla uzyskania bardziej naturalnego ruchu
            const y = centerY + 
              Math.sin(x * frequency + dynamicPhase + phaseShift) * pointAmplitude +
              Math.sin(x * frequency * 2 + dynamicPhase * 1.5) * (pointAmplitude * 0.3);
            
            ctx.lineTo(x, y);
          }
        }
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      
      // Aktualizacja fazy
      phase += 0.07;
      
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

export default Wave;



{/* <div style={{backgroundColor:"#101828"}}>
        <div class="siri">
          <Wave />
        </div>
      </div> */}