'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Definimos las ciudades de Quintana Roo con sus imágenes
const ciudadesQuintanaRoo = [
  { id: 'cancun', name: 'CANCÚN', image: '/cancun.jpeg', disponible: false },
  { id: 'isla-mujeres', name: 'ISLA MUJERES', image: '/isla_mujeres.jpeg', disponible: false },
  { id: 'cozumel', name: 'ISLA DE COZUMEL', image: '/cozumel.jpeg', disponible: false },
  { id: 'tulum', name: 'TULUM', image: '/tulum.jpeg', disponible: true },
  { id: 'bacalar', name: 'BACALAR', image: '/bacalar.jpeg', disponible: false },
  // 🔥 NUEVA CIUDAD AÑADIDA 🔥
  { id: 'chetumal', name: 'CHETUMAL', image: '/chetumal.jpeg', disponible: false },
];

export default function ViosVirtualMetraRoot() {
  const [idioma, setIdioma] = useState('es');
  
  // Inicializamos en 'true' para cargar el fondo claro directamente
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
          <Link 
            href="https://vioscode.io" 
            target="_blank" 
            rel="noopener noreferrer"
            title="Ir a ViOs Code"
            className="block transition-transform hover:scale-105"
          >
            <img 
              src="/logo_vios.jpeg" 
              alt="ViOs Code Logo" 
              className={`h-12 w-auto object-contain transition-all duration-1000 ${!introTerminada ? 'invert brightness-0' : ''}`}
            />
          </Link>
        </div>
        <BotonIdioma />
      </nav>

      {/* 👤 SECCIÓN 1: INTRO */}
      <section className="pt-36 px-6 max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[40vh] md:min-h-[50vh] mb-24 relative">
        <div className="flex flex-col md:flex-row items-center md:items-center gap-12 lg:gap-20 w-full animate-[fadeIn_1s_ease-in-out]">
          
         {/* 🏙️ LA CIUDAD 3D INTERACTIVA (Izquierda) */}
          <div className="w-72 h-72 md:w-[450px] md:h-[450px] shrink-0 relative mx-auto md:mx-0 flex justify-center items-center drop-shadow-[0_10px_40px_rgba(34,211,238,0.25)]">
            <iframe 
              title="City 3D Model" 
              className="w-full h-full border-none"
              src="https://sketchfab.com/models/108841754fd3485886c1dde13301d341/embed?autostart=1&transparent=1&ui_infos=0&ui_watermark=0&ui_controls=0&autospin=0.2" 
              allow="autoplay; fullscreen; xr-spatial-tracking" 
            ></iframe>
          </div>
          
          {/* 📝 TEXTOS (Derecha) */}
          <div className="flex flex-col gap-4 text-left text-black w-full">
            <h2 className="font-montserrat text-4xl md:text-5xl lg:text-7xl font-black tracking-tight leading-tight">
              {idioma === 'es' ? 'La Metrópolis Virtual' : 'The Virtual Metropolis'} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-cyan-400">
                {idioma === 'es' ? 'de ViOs.' : 'of ViOs.'}
              </span>
            </h2>
            
            <p className="text-gray-700 text-lg lg:text-xl leading-relaxed max-w-2xl mt-4 font-normal text-left">
              {idioma === 'es' 
                ? 'ViOs Virtual Metra es el contenedor dinámico de ciudades y proyectos hiperlocales. Adéntrate en entornos específicos, descubre desarrollos inmersivos por región y conecta con la comunidad a un nivel detallado y geolocalizado.'
                : 'ViOs Virtual Metra is the dynamic container for cities and hyperlocal projects. Dive into specific environments, discover immersive developments by region, and connect with the community at a detailed, geolocated level.'}
            </p>
          </div>
        </div>
      </section>

      {/* 🏙️ SECCIÓN 2: LAS CIUDADES */}
      <section className="px-6 max-w-7xl mx-auto mb-32 flex flex-col items-center">
        <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between mb-16 gap-4">
          <div>
            <p className="font-inter text-cyan-600 font-bold tracking-[0.2em] text-sm uppercase mb-2">
              {idioma === 'es' ? 'Explorando: Quintana Roo' : 'Exploring: Quintana Roo'}
            </p>
            <h2 className={`font-montserrat text-3xl md:text-5xl font-black ${!introTerminada ? 'text-white' : 'text-black'} transition-colors duration-1000`}>
              {idioma === 'es' ? 'Ciudades Interactivas' : 'Interactive Cities'}
            </h2>
          </div>
          <div className={`h-px ${!introTerminada ? 'bg-gradient-to-r from-gray-800 to-transparent' : 'bg-gradient-to-r from-gray-300 to-transparent'} flex-grow ml-0 md:ml-8 transition-colors duration-1000 w-full md:w-auto`}></div>
        </div>

        {/* --- MAPA INTERACTIVO DE CIUDADES (Se actualiza automáticamente al añadir datos) --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
          {ciudadesQuintanaRoo.map((ciudad) => (
            <div key={ciudad.id} className="relative group rounded-3xl overflow-hidden aspect-[4/5] border border-neutral-800 shadow-sm">
              {ciudad.disponible ? (
                <Link 
                  href={`/quintana-roo/${ciudad.id}`} 
                  className="w-full h-full block relative cursor-pointer group-hover:border-cyan-400 transition-all duration-300"
                  aria-label={idioma === 'es' ? `Entrar al mapa virtual de ${ciudad.name}` : `Enter the virtual map of ${ciudad.name}`}
                >
                  <Image 
                    src={ciudad.image} 
                    alt={`Vista de ${ciudad.name}, Quintana Roo.`} 
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover z-0 group-hover:scale-105 transition-all duration-700"
                    priority={ciudad.id === 'tulum'} 
                  />

                  <div className="absolute inset-0 w-full h-full bg-cyan-400/0 border-4 border-transparent group-hover:border-cyan-400 opacity-0 group-hover:opacity-100 group-hover:bg-cyan-400/10 group-hover:shadow-[inset_0_0_30px_rgba(34,211,238,0.3)] transition-all duration-300 z-10" />
                  
                  <div className="absolute bottom-6 left-6 right-6 bg-black/80 backdrop-blur-md p-5 rounded-2xl border border-neutral-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 text-center">
                    <h3 className="font-montserrat text-2xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 uppercase tracking-tight">
                      {ciudad.name}
                    </h3>
                    <div className="mt-3 flex items-center justify-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
                      <p className="text-cyan-400 text-xs font-mono tracking-wider">
                        {idioma === 'es' ? 'ENTRAR AL PORTAL' : 'ENTER PORTAL'}
                      </p>
                    </div>
                  </div>
                </Link>
              ) : (
                /* ESTRUCTURA IDÉNTICA A TULUM, PERO CON CAPA OSCURA Z-10 PARA "EN DESARROLLO" */
                <div className="w-full h-full block relative">
                  <Image 
                    src={ciudad.image} 
                    alt={`Vista de ${ciudad.name}, Quintana Roo. En Desarrollo.`} 
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover z-0 transition-transform duration-700 group-hover:scale-105"
                  />
                  
                  {/* Capa negra semitransparente */}
                  <div className="absolute inset-0 w-full h-full bg-black/60 group-hover:bg-black/40 transition-colors duration-500 z-10" />

                  {/* Textos y Badges en primer plano */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none p-6 text-center">
                    <h3 className="font-montserrat text-2xl font-black text-white uppercase tracking-tight mb-3 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                      {ciudad.name}
                    </h3>
                    <p className="text-gray-100 text-xs font-bold mt-2 tracking-widest uppercase border border-gray-400/60 px-4 py-2 rounded-full bg-black/70 shadow-xl backdrop-blur-sm">
                      {idioma === 'es' ? 'En Desarrollo' : 'In Development'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        {/* --- FIN MAPA INTERACTIVO DE CIUDADES --- */}

        <div className="mt-20 flex items-center space-x-3">
          <div className="h-3 w-3 rounded-full bg-cyan-400 animate-ping"></div>
          <h2 className="text-xl md:text-2xl font-mono text-cyan-400 tracking-widest animate-pulse drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
            {idioma === 'es' ? 'SISTEMA DE CIUDADES ACTIVO...' : 'CITY SYSTEM ACTIVE...'}
          </h2>
        </div>
      </section>

      {/* 🌌 SECCIÓN 3: LA ARQUITECTURA */}
      <section className="px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className={`font-montserrat text-3xl md:text-5xl font-black mb-4 ${!introTerminada ? 'text-white' : 'text-black'} transition-colors duration-1000`}>
            {idioma === 'es' ? 'La Arquitectura del Multiverso' : 'The Multiverse Architecture'}
          </h2>
          <p className={`${!introTerminada ? 'text-gray-400' : 'text-gray-600'} text-lg max-w-2xl mx-auto transition-colors duration-1000`}>
            {idioma === 'es' ? 'Conoce todas las dimensiones que componen nuestro ecosistema escalable.' : 'Discover all the dimensions that make up our scalable ecosystem.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <Link href="https://www.viosmetaverse.com/" target="_blank" rel="noopener noreferrer" className="bg-white border border-gray-100 p-8 rounded-3xl hover:border-gray-200 hover:shadow-lg transition-all relative overflow-hidden group shadow-sm block cursor-pointer">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gray-100 rounded-full blur-3xl group-hover:bg-gray-200 transition-all"></div>
            <div className="text-5xl mb-6">🌐</div>
            <h3 className="font-montserrat text-2xl font-bold text-black mb-2">ViOs Metaverso</h3>
            <p className="text-gray-600 text-sm">{idioma === 'es' ? 'El portal principal de conexión.' : 'The main connection portal.'}</p>
          </Link>

          <Link href="https://virtualuniverse.com" target="_blank" rel="noopener noreferrer" className="bg-white border border-gray-100 p-8 rounded-3xl hover:border-gray-200 hover:shadow-lg transition-all relative overflow-hidden group shadow-sm block cursor-pointer">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gray-100 rounded-full blur-3xl group-hover:bg-gray-200 transition-all"></div>
            <div className="text-5xl mb-6">🌌</div>
            <h3 className="font-montserrat text-2xl font-bold text-black mb-2">Virtual Universe</h3>
            <p className="text-gray-600 text-sm">{idioma === 'es' ? 'La red maestra global.' : 'The global master network.'}</p>
          </Link>

          <Link href="https://viosvirtualplanet.com" target="_blank" rel="noopener noreferrer" className="bg-white border border-gray-100 p-8 rounded-3xl hover:border-gray-200 hover:shadow-lg transition-all relative overflow-hidden group shadow-sm block cursor-pointer">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gray-100 rounded-full blur-3xl group-hover:bg-gray-200 transition-all"></div>
            <div className="text-5xl mb-6">🪐</div>
            <h3 className="font-montserrat text-2xl font-bold text-black mb-2">Virtual Planet</h3>
            <p className="text-gray-600 text-sm">{idioma === 'es' ? 'Entornos globales por industrias.' : 'Global environments by industries.'}</p>
          </Link>

          <div className="bg-white border border-cyan-400/40 p-8 rounded-3xl hover:border-cyan-400 hover:shadow-[0_0_30px_rgba(34,211,238,0.15)] transition-all relative overflow-hidden group shadow-sm">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400/10 rounded-full blur-3xl group-hover:bg-cyan-400/20 transition-all"></div>
            <div className="text-5xl mb-6 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">🏙️</div>
            <h3 className="font-montserrat text-2xl font-bold text-cyan-600 mb-2">Virtual Metra</h3>
            <p className="text-gray-700 text-sm">
              {idioma === 'es' ? 'ESTÁS AQUÍ. Proyectos locales y desarrollos inmersivos hipersegmentados.' : 'YOU ARE HERE. Local projects and hyper-segmented immersive developments.'}
            </p>
          </div>

          {/* 🔥 CORRECCIÓN APLICADA AQUÍ: Se cierra con </div> 🔥 */}
          <div className="bg-white border border-gray-100 p-8 rounded-3xl hover:border-gray-200 hover:shadow-lg transition-all relative overflow-hidden group shadow-sm">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gray-100 rounded-full blur-3xl group-hover:bg-gray-200 transition-all"></div>
            <div className="text-5xl mb-6">🤝</div>
            <h3 className="font-montserrat text-2xl font-bold text-black mb-2">Virtual Social</h3>
            <p className="text-gray-600 text-sm">{idioma === 'es' ? 'El núcleo de la comunidad.' : 'The core of the community.'}</p>
          </div>

          <div className="bg-white border border-gray-100 p-8 rounded-3xl hover:border-gray-200 hover:shadow-lg transition-all relative overflow-hidden group shadow-sm">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gray-100 rounded-full blur-3xl group-hover:bg-gray-200 transition-all"></div>
            <div className="text-5xl mb-6">🌍</div>
            <h3 className="font-montserrat text-2xl font-bold text-black mb-2">Virtual Nomad</h3>
            <p className="text-gray-600 text-sm">{idioma === 'es' ? 'El puente físico-digital global.' : 'The global physical-digital bridge.'}</p>
          </div>

        </div>
      </section>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}