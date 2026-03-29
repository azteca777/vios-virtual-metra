'use client';

import React, { use, useState, useEffect, Suspense, useRef } from 'react';
import Link from 'next/link';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Splat, Stars } from '@react-three/drei';

// 🛡️ BARRERA ANTI-LLOROS DE TYPESCRIPT 🛡️
const HtmlSafe = Html as unknown as React.FC<any>;
const SplatSafe = Splat as unknown as React.FC<any>;

// 👇👇👇 EL SPLAT EN PANTALLA COMPLETA 👇👇👇
const URL_SPLAT_FULL = "https://izuozfbhtyvjwrckummr.supabase.co/storage/v1/object/public/modelos-3d/aldea_zama_V2.0.splat";

// === 📖 EL DICCIONARIO BILINGÜE 📖 ===
const TEXTOS = {
  es: {
    volver: "Volver a Matrix",
    sector: "ZONA COMERCIAL Y RESIDENCIAL",
    instrucciones: "🖱️ Arrastra para girar • 📜 Usa el scroll para hacer zoom",
    cargando: "Renderizando Aldea Zama...",
    btnIdioma: "EN",
    bandera: "🇺🇸",
    alertaMenu: "Abriendo menú de la categoría:",
    saltarIntro: "Saltar Intro ⏭️",
    pines: {
      restaurantes: "Restaurantes y Bares",
      boutiques: "Boutiques Ropa y Accesorios",
      servicios: "Servicios Múltiples",
      rentas: "Renta de Villas y Deptos",
      mercado: "Mercado Local" // Agregado
    }
  },
  en: {
    volver: "Return to Matrix",
    sector: "COMMERCIAL & RESIDENTIAL ZONE",
    instrucciones: "🖱️ Drag to rotate • 📜 Use scroll to zoom",
    cargando: "Rendering Aldea Zama...",
    btnIdioma: "ES",
    bandera: "🇲🇽",
    alertaMenu: "Opening menu for category:",
    saltarIntro: "Skip Intro ⏭️",
    pines: {
      restaurantes: "Restaurants & Bars",
      boutiques: "Clothing & Accessory Boutiques",
      servicios: "General Services",
      rentas: "Villa & Condo Rentals",
      mercado: "Local Market" // Agregado
    }
  }
};

// === COMPONENTE: PINES CATEGORIZADOS ===
function PinMetaverso({ posicion, titulo, icono, delay = 0, mensajeAlerta, accion }: { posicion: number[], titulo: string, icono: string, delay?: number, mensajeAlerta: string, accion?: () => void }) {
  const [brotar, setBrotar] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setBrotar(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <HtmlSafe position={posicion as [number, number, number]} center zIndexRange={[100, 0]}>
      <div 
        className={`flex flex-col items-center transition-all duration-700 ease-out transform pointer-events-auto cursor-pointer hover:scale-110 ${
          brotar ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-0'
        }`}
        onClick={(e) => {
            e.stopPropagation();
            if (accion) {
              accion();
            } else {
              alert(`${mensajeAlerta} ${titulo} 🚀`);
            }
        }}
      >
        <div className="w-10 h-10 md:w-12 md:h-12 bg-white/95 backdrop-blur-md rounded-full shadow-xl flex items-center justify-center text-xl md:text-2xl border-2 border-cyan-500 text-cyan-700 hover:bg-cyan-50 hover:border-cyan-400 transition-colors">
          {icono}
        </div>
        <div className="mt-2 px-3 py-1.5 bg-white/95 backdrop-blur-md text-cyan-900 text-[10px] md:text-xs font-bold rounded-xl whitespace-nowrap border border-gray-200 shadow-lg">
          {titulo}
        </div>
      </div>
    </HtmlSafe>
  );
}

// === COMPONENTE: ESCENA 3D ===
function EscenaAldeaZama({ lang }: { lang: 'es' | 'en' }) {
  const mapaRef = useRef<any>(null);
  const t = TEXTOS[lang];

  useFrame((state, delta) => {
    if (mapaRef.current) {
      mapaRef.current.rotation.y += delta * 0.05; 
    }
  });

  return (
    <group ref={mapaRef} position={[0, 1, 0]}>
      <SplatSafe src={URL_SPLAT_FULL} scale={13} />

      {/* PIN DE RESTAURANTES */}
      <PinMetaverso 
        titulo={t.pines.restaurantes} 
        icono="🍷" 
        posicion={[1.5, -3, 2]} 
        delay={500} 
        mensajeAlerta={t.alertaMenu} 
        accion={() => { window.location.href = "https://virtualuxurytulum.com"; }}
      />

      {/* PIN DE BOUTIQUES */}
      <PinMetaverso 
        titulo={t.pines.boutiques} 
        icono="🛍️" 
        posicion={[-2, -1.6, -5]} 
        delay={900} 
        mensajeAlerta={t.alertaMenu}
        accion={() => { window.location.href = "https://virtualuxurytulum.com/boutiques"; }} 
      />

      {/* 👇👇👇 NUEVO PIN DE MERCADO (Tianguis Tulum) 👇👇👇 */}
      <PinMetaverso 
        titulo={t.pines.mercado} 
        icono="🍎" 
        posicion={[-4, -2, 2]} 
        delay={1100} 
        mensajeAlerta={t.alertaMenu}
        accion={() => {
          // Salto al nodo de las fruterías
          window.location.href = "https://tianguistulum.com"; 
        }} 
      />

      {/* PINES RESTANTES */}
      <PinMetaverso titulo={t.pines.rentas} icono="🏡" posicion={[0, 0, -2]} delay={1300} mensajeAlerta={t.alertaMenu} />
      <PinMetaverso titulo={t.pines.servicios} icono="🛎️" posicion={[2, 0, 5]} delay={1700} mensajeAlerta={t.alertaMenu} />
    </group>
  );
}

// === VISTA PRINCIPAL DE LA PÁGINA ===
type Props = { 
  params: Promise<{ estado: string; ciudad: string; }>; 
}; 

export default function AldeaZamaPage({ params }: Props) {
  const resolvedParams = use(params); 
  const estadoName = decodeURIComponent(resolvedParams.estado).replace(/-/g, ' '); 
  const ciudadName = decodeURIComponent(resolvedParams.ciudad).replace(/-/g, ' ').toUpperCase(); 

  const [idioma, setIdioma] = useState<'es' | 'en'>('es');
  const t = TEXTOS[idioma];

  const [mostrarIntro, setMostrarIntro] = useState(true);
  const [desvanecerVideo, setDesvanecerVideo] = useState(false);

  const finalizarIntro = () => {
    setDesvanecerVideo(true);
    setTimeout(() => {
      setMostrarIntro(false);
    }, 1000);
  };

  return (
    <main className="relative w-full h-[100dvh] bg-[#f8fafc] overflow-hidden selection:bg-cyan-200">
      
      {/* CAPA DE VIDEO INTRO */}
      {mostrarIntro && (
        <div className={`absolute inset-0 z-50 bg-black flex items-center justify-center transition-opacity duration-1000 ease-in-out ${desvanecerVideo ? 'opacity-0' : 'opacity-100'}`}>
          <video 
            src="/zama_video_trans.mp4" 
            autoPlay 
            playsInline
            muted 
            className="w-full h-full object-cover"
            onEnded={finalizarIntro} 
          />
          <button 
            onClick={finalizarIntro}
            className="absolute bottom-10 right-10 bg-black/50 hover:bg-black/80 text-white border border-white/30 backdrop-blur-md px-6 py-2 rounded-full transition-all duration-300 tracking-widest text-xs uppercase font-bold z-50"
          >
            {t.saltarIntro}
          </button>
        </div>
      )}

      {/* EL CANVAS 3D */}
      <div className="absolute inset-0 z-0 bg-white">
        <Canvas camera={{ position: [0, 4, 10], fov: 50 }}>
          <Stars radius={100} depth={50} count={6000} factor={4} saturation={0} fade speed={0.5} />
          <OrbitControls enableZoom={true} maxDistance={25} minDistance={2} maxPolarAngle={Math.PI / 2 - 0.05} />
          <Suspense fallback={<HtmlSafe center><div className="text-cyan-600 font-bold text-sm md:text-xl tracking-widest animate-pulse bg-white/80 px-6 py-3 rounded-full backdrop-blur-sm border border-cyan-500/30 shadow-lg">{t.cargando}</div></HtmlSafe>}>
            <EscenaAldeaZama lang={idioma} />
          </Suspense>
        </Canvas>
      </div>

      {/* INTERFAZ UI 2D */}
      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between">
        <header className="w-full pointer-events-auto p-4 md:p-8 flex justify-between items-start">
          
          <Link 
            href={`/${resolvedParams.estado}/${resolvedParams.ciudad}`} 
            className="flex items-center justify-center w-10 h-10 md:w-auto md:h-auto md:px-5 md:py-2.5 rounded-full border border-gray-300 bg-white/90 text-gray-600 hover:text-cyan-600 hover:border-cyan-400/50 hover:bg-cyan-50/80 transition-all duration-300 font-inter text-sm backdrop-blur-md group shadow-md"
          >
            <span className="text-xl md:text-lg group-hover:-translate-x-1 transition-transform duration-300">←</span> 
            <span className="tracking-wide hidden md:block md:ml-3">{t.volver} <span className="capitalize text-gray-900 font-semibold">{ciudadName}</span></span>
          </Link>

          <div className="flex flex-col items-end gap-4">
            <button 
              onClick={() => setIdioma(idioma === 'es' ? 'en' : 'es')}
              className="flex items-center gap-2 bg-white/90 backdrop-blur-md border border-gray-300 px-4 py-2 rounded-full shadow-md text-sm font-bold text-gray-700 hover:bg-cyan-50 hover:text-cyan-600 transition-colors"
            >
              <span className="text-lg">{t.bandera}</span> {t.btnIdioma}
            </button>

            <div className="text-right">
              <h1 className="font-montserrat text-3xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-yellow-500 via-yellow-600 to-yellow-800 drop-shadow-sm">
                ALDEA ZAMA
              </h1>
              <p className="font-inter text-cyan-600/90 text-[10px] md:text-sm tracking-[0.3em] uppercase drop-shadow-sm mt-1">
                {t.sector}
              </p>
            </div>
          </div>
        </header>
        
        <div className="w-full p-6 flex justify-center pb-10">
          <div className="bg-white/80 backdrop-blur-md border border-gray-200 px-6 py-2 rounded-full shadow-lg pointer-events-auto">
            <p className="text-gray-600 text-xs md:text-sm font-medium">
              {t.instrucciones}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}