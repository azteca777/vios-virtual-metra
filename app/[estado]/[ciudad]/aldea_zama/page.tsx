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
const URL_SPLAT_FULL = "https://izuozfbhtyvjwrckummr.supabase.co/storage/v1/object/public/modelos-3d/zama_pruba.splat";

// === 📖 EL DICCIONARIO BILINGÜE 📖 ===
const TEXTOS = {
  es: {
    volver: "Volver a Matrix",
    sector: "ZONA COMERCIAL Y RESIDENCIAL",
    instrucciones: "🖱️ Arrastra para girar • 📜 Usa el scroll para hacer zoom",
    cargando: "Renderizando Aldea Zama...",
    btnIdioma: "EN", // Muestra la opción contraria
    bandera: "🇺🇸",
    alertaMenu: "Abriendo menú de la categoría:",
    pines: {
      restaurantes: "Restaurantes y Bares",
      boutiques: "Boutiques Ropa y Accesorios",
      servicios: "Servicios Múltiples",
      rentas: "Renta de Villas y Deptos"
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
    pines: {
      restaurantes: "Restaurants & Bars",
      boutiques: "Clothing & Accessory Boutiques",
      servicios: "General Services",
      rentas: "Villa & Condo Rentals"
    }
  }
};

// === COMPONENTE: PINES CATEGORIZADOS ===
function PinMetaverso({ posicion, titulo, icono, delay = 0, mensajeAlerta }: { posicion: number[], titulo: string, icono: string, delay?: number, mensajeAlerta: string }) {
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
            alert(`${mensajeAlerta} ${titulo} 🚀`);
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

// === COMPONENTE: ESCENA 3D (RECIBE EL IDIOMA) ===
function EscenaAldeaZama({ lang }: { lang: 'es' | 'en' }) {
  const mapaRef = useRef<any>(null);
  const t = TEXTOS[lang]; // Tomamos los textos del idioma actual

  // Giro súper suave
  useFrame((state, delta) => {
    if (mapaRef.current) {
      mapaRef.current.rotation.y += delta * 0.05; 
    }
  });

  return (
    <group ref={mapaRef} position={[0, -1, 0]}>
      {/* Tu archivo Splat de Aldea Zama */}
      <SplatSafe src={URL_SPLAT_FULL} scale={1.5} />

      {/* TUS 4 NUEVAS CATEGORÍAS (Las posiciones X,Y,Z las tienes que ajustar después a ojo) */}
      <PinMetaverso 
        titulo={t.pines.restaurantes} 
        icono="🍷" 
        posicion={[1.5, 0.5, 2]} 
        delay={500} 
        mensajeAlerta={t.alertaMenu}
      />
      <PinMetaverso 
        titulo={t.pines.boutiques} 
        icono="🛍️" 
        posicion={[-2, 0.5, 1]} 
        delay={900} 
        mensajeAlerta={t.alertaMenu}
      />
      <PinMetaverso 
        titulo={t.pines.rentas} 
        icono="🏡" 
        posicion={[0, 0.5, -2]} 
        delay={1300} 
        mensajeAlerta={t.alertaMenu}
      />
      <PinMetaverso 
        titulo={t.pines.servicios} 
        icono="🛎️" 
        posicion={[2, 0.5, -1.5]} 
        delay={1700} 
        mensajeAlerta={t.alertaMenu}
      />
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

  // ESTADO QUE CONTROLA EL IDIOMA DE TODA LA PÁGINA ('es' por defecto)
  const [idioma, setIdioma] = useState<'es' | 'en'>('es');
  const t = TEXTOS[idioma];

  return (
    <main className="relative w-full h-[100dvh] bg-[#f8fafc] overflow-hidden selection:bg-cyan-200">
      
      {/* 🌌 EL CANVAS 3D */}
      <div className="absolute inset-0 z-0 bg-white">
        <Canvas camera={{ position: [0, 4, 10], fov: 50 }}>
          <Stars radius={100} depth={50} count={6000} factor={4} saturation={0} fade speed={0.5} color="#333333" />
          
          <OrbitControls 
            enableZoom={true} 
            maxDistance={25} 
            minDistance={2} 
            maxPolarAngle={Math.PI / 2 - 0.05} 
          />

          <Suspense fallback={<Html center><div className="text-cyan-600 font-bold text-sm md:text-xl tracking-widest animate-pulse bg-white/80 px-6 py-3 rounded-full backdrop-blur-sm border border-cyan-500/30 shadow-lg">{t.cargando}</div></Html>}>
            {/* Le pasamos el idioma a la escena 3D para que actualice los pines */}
            <EscenaAldeaZama lang={idioma} />
          </Suspense>
        </Canvas>
      </div>

      {/* 🖥️ INTERFAZ UI 2D SUPERIOR */}
      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between">
        <header className="w-full pointer-events-auto p-4 md:p-8 flex justify-between items-start">
          
          {/* Botón Volver Dinámico */}
          <Link 
            href={`/${resolvedParams.estado}/${resolvedParams.ciudad}`} 
            className="flex items-center justify-center w-10 h-10 md:w-auto md:h-auto md:px-5 md:py-2.5 rounded-full border border-gray-300 bg-white/90 text-gray-600 hover:text-cyan-600 hover:border-cyan-400/50 hover:bg-cyan-50/80 transition-all duration-300 font-inter text-sm backdrop-blur-md group shadow-md"
          >
            <span className="text-xl md:text-lg group-hover:-translate-x-1 transition-transform duration-300">←</span> 
            <span className="tracking-wide hidden md:block md:ml-3">{t.volver} <span className="capitalize text-gray-900 font-semibold">{ciudadName}</span></span>
          </Link>

          {/* Panel Superior Derecho (Título + Switch Idioma) */}
          <div className="flex flex-col items-end gap-4">
            {/* BOTÓN DE CAMBIO DE IDIOMA */}
            <button 
              onClick={() => setIdioma(idioma === 'es' ? 'en' : 'es')}
              className="flex items-center gap-2 bg-white/90 backdrop-blur-md border border-gray-300 px-4 py-2 rounded-full shadow-md text-sm font-bold text-gray-700 hover:bg-cyan-50 hover:text-cyan-600 transition-colors"
            >
              <span className="text-lg">{t.bandera}</span> {t.btnIdioma}
            </button>

            {/* Título */}
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
        
        {/* Panel inferior dinámico */}
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