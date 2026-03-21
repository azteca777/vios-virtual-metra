'use client';

import { useState, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Base de datos de ciudades (por ahora enfocada en Quintana Roo)
const ciudadesEstado = [
  { id: 'cancun', name: 'CANCÚN', image: '/cancun.jpeg', disponible: false },
  { id: 'isla-mujeres', name: 'ISLA MUJERES', image: '/isla_mujeres.jpeg', disponible: false },
  { id: 'cozumel', name: 'ISLA DE COZUMEL', image: '/cozumel.jpeg', disponible: false },
  { id: 'tulum', name: 'TULUM', image: '/tulum.jpeg', disponible: true },
  { id: 'bacalar', name: 'BACALAR', image: '/bacalar.jpeg', disponible: false },
  { id: 'chetumal', name: 'CHETUMAL', image: '/chetumal.jpeg', disponible: false },
];

type Props = {
  params: Promise<{
    estado: string;
  }>;
};

export default function EstadoMetraPage({ params }: Props) {
  // En Next.js 15, desenvolvemos los params en un Client Component usando el hook 'use' de React
  const resolvedParams = use(params);
  const estadoActual = decodeURIComponent(resolvedParams.estado);
  const nombreEstadoLimpio = estadoActual.replace(/-/g, ' ');

  const [idioma, setIdioma] = useState('es');
  const [introTerminada, setIntroTerminada] = useState(true);

  const BotonIdioma = () => (
    <button 
      onClick={() => setIdioma(idioma === 'es' ? 'en' : 'es')} 
      className="flex items-center gap-2 px-6 py-2 border border-[#d4af37] rounded-full text-sm tracking-widest hover:bg-[#d4af37] hover:text-black transition-all bg-white shadow-[0_0_15px_rgba(212,175,55,0.2)] cursor-pointer text-black font-semibold z-10"
    >
      <span className="text-lg leading-none">{idioma === 'es' ? '🇬🇧' : '🇲🇽'}</span>
      <span className="font-bold">{idioma === 'es' ? 'ENG' : 'ESP'}</span>
    </button>
  );

  return (
    <div className={`min-h-screen ${!introTerminada ? 'bg-black' : 'bg-white'} font-inter selection:bg-cyan-500 selection:text-white pb-20 antialiased transition-colors duration-1000`}>
      
      {/* 🌌 BARRA DE NAVEGACIÓN */}
      <nav className={`fixed top-0 w-full ${!introTerminada ? 'bg-black/90 border-gray-800' : 'bg-white/95 border-gray-200'} backdrop-blur-md border-b z-50 px-6 py-4 flex justify-between items-center shadow-sm transition-all duration-1000`}>
        <div className="flex items-center gap-3 relative z-10">
          <Link href="https://vioscode.io" target="_blank" rel="noopener noreferrer" className="block transition-transform hover:scale-105">
            <img src="/logo_vios.jpeg" alt="ViOs Code Logo" className={`h-12 w-auto object-contain transition-all duration-1000 ${!introTerminada ? 'invert brightness-0' : ''}`} />
          </Link>
        </div>
        <BotonIdioma />
      </nav>

      {/* 👤 SECCIÓN 1: INTRO */}
      <section className="pt-36 px-6 max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[40vh] md:min-h-[50vh] mb-24 relative">
        <div className="flex flex-col md:flex-row items-center md:items-center gap-12 lg:gap-20 w-full animate-[fadeIn_1s_ease-in-out]">
          
         {/* 🏖️ LA PLAYA 3D INTERACTIVA */}
          <div className="w-72 h-72 md:w-[450px] md:h-[450px] shrink-0 relative mx-auto md:mx-0 flex justify-center items-center drop-shadow-[0_10px_40px_rgba(34,211,238,0.25)]">
            <iframe 
              title="Beach 3D Model" 
              className="w-full h-full border-none"
              // 🔥 NUEVO ENLACE DE LA PLAYA INYECTADO AQUÍ 🔥
              src="https://sketchfab.com/models/14217a65ebb846d0b26aa8852ea1f26f/embed?autostart=1&transparent=1&ui_infos=0&ui_watermark=0&ui_controls=0&autospin=0.2" 
              allow="autoplay; fullscreen; xr-spatial-tracking" 
            ></iframe>
          </div>
          
          {/* 📝 TEXTOS */}
          <div className="flex flex-col gap-6 text-left text-black w-full">
            
            {/* 🔥 BOTÓN DE NAVEGACIÓN (VOLVER AL INICIO) 🔥 */}
            <div>
              <Link 
                href="/"
                className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-gray-200 bg-white/50 text-gray-500 hover:text-cyan-600 hover:border-cyan-300 hover:bg-cyan-50 hover:shadow-[0_0_15px_rgba(34,211,238,0.15)] transition-all duration-300 font-inter text-sm backdrop-blur-sm group shadow-sm"
              >
                <span className="text-lg group-hover:-translate-x-1 transition-transform duration-300">←</span> 
                <span className="tracking-wide">
                  {idioma === 'es' ? 'Elija otro estado de ' : 'Choose another state from '}
                  <span className="font-semibold text-gray-700 group-hover:text-cyan-600">México</span>
                </span>
              </Link>
            </div>

            <h2 className="font-montserrat text-4xl md:text-5xl lg:text-7xl font-black tracking-tight leading-tight uppercase">
              {idioma === 'es' ? 'Dimensión:' : 'Dimension:'} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-cyan-400">
                {nombreEstadoLimpio}
              </span>
            </h2>
            
            <p className="text-gray-700 text-lg lg:text-xl leading-relaxed max-w-2xl font-normal text-left">
              {idioma === 'es' 
                ? `Estás explorando el contenedor dinámico de ${nombreEstadoLimpio}. Selecciona una ciudad para descubrir sus desarrollos inmersivos, proyectos hiperlocales y conectar con su comunidad digital.`
                : `You are exploring the dynamic container of ${nombreEstadoLimpio}. Select a city to discover its immersive developments, hyperlocal projects, and connect with its digital community.`}
            </p>
          </div>
        </div>
      </section>

      {/* 🏙️ SECCIÓN 2: LAS CIUDADES */}
      <section className="px-6 max-w-7xl mx-auto mb-32 flex flex-col items-center">
        <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between mb-16 gap-4">
          <div>
            <p className="font-inter text-cyan-600 font-bold tracking-[0.2em] text-sm uppercase mb-2">
              {idioma === 'es' ? `Explorando: ${nombreEstadoLimpio}` : `Exploring: ${nombreEstadoLimpio}`}
            </p>
            <h2 className={`font-montserrat text-3xl md:text-5xl font-black ${!introTerminada ? 'text-white' : 'text-black'} transition-colors duration-1000`}>
              {idioma === 'es' ? 'Ciudades Interactivas' : 'Interactive Cities'}
            </h2>
          </div>
          <div className={`h-px ${!introTerminada ? 'bg-gradient-to-r from-gray-800 to-transparent' : 'bg-gradient-to-r from-gray-300 to-transparent'} flex-grow ml-0 md:ml-8 transition-colors duration-1000 w-full md:w-auto`}></div>
        </div>

        {/* --- MAPA INTERACTIVO DE CIUDADES --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
          {ciudadesEstado.map((ciudad) => (
            <div key={ciudad.id} className="relative group rounded-3xl overflow-hidden aspect-[4/5] border border-neutral-800 shadow-sm">
              {ciudad.disponible ? (
                <Link 
                  href={`/${estadoActual}/${ciudad.id}`} 
                  className="w-full h-full block relative cursor-pointer group-hover:border-cyan-400 transition-all duration-300"
                >
                  <Image src={ciudad.image} alt={ciudad.name} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover z-0 group-hover:scale-105 transition-all duration-700" priority={ciudad.id === 'tulum'} />
                  <div className="absolute inset-0 w-full h-full bg-cyan-400/0 border-4 border-transparent group-hover:border-cyan-400 opacity-0 group-hover:opacity-100 group-hover:bg-cyan-400/10 group-hover:shadow-[inset_0_0_30px_rgba(34,211,238,0.3)] transition-all duration-300 z-10" />
                  <div className="absolute bottom-6 left-6 right-6 bg-black/80 backdrop-blur-md p-5 rounded-2xl border border-neutral-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 text-center">
                    <h3 className="font-montserrat text-2xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 uppercase tracking-tight">{ciudad.name}</h3>
                    <div className="mt-3 flex items-center justify-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
                      <p className="text-cyan-400 text-xs font-mono tracking-wider">{idioma === 'es' ? 'ENTRAR AL PORTAL' : 'ENTER PORTAL'}</p>
                    </div>
                  </div>
                </Link>
              ) : (
                <div className="w-full h-full block relative">
                  <Image src={ciudad.image} alt={ciudad.name} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover z-0 transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 w-full h-full bg-black/60 group-hover:bg-black/40 transition-colors duration-500 z-10" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none p-6 text-center">
                    <h3 className="font-montserrat text-2xl font-black text-white uppercase tracking-tight mb-3 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{ciudad.name}</h3>
                    <p className="text-gray-100 text-xs font-bold mt-2 tracking-widest uppercase border border-gray-400/60 px-4 py-2 rounded-full bg-black/70 shadow-xl backdrop-blur-sm">{idioma === 'es' ? 'En Desarrollo' : 'In Development'}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}