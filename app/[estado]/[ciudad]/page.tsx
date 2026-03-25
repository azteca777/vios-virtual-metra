'use client';

import React, { use, useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html, Splat, Float, Stars } from '@react-three/drei';

// 🛡️ BARRERA ANTI-LLOROS DE TYPESCRIPT 🛡️
const HtmlSafe = Html as unknown as React.FC<any>;
const SplatSafe = Splat as unknown as React.FC<any>;

// 👇👇👇 PEGA AQUÍ TU ENLACE DE SUPABASE PARA ALDEA ZAMA 👇👇👇
const URL_SPLAT_ALDEAZAMA = "https://izuozfbhtyvjwrckummr.supabase.co/storage/v1/object/public/modelos-3d/local_palapa.splat";
// 👆👆👆 ======================================================= 👆👆👆

// === MATRIZ RESPONSIVA ===
// Cada zona sabe dónde ponerse si es monitor (posDesktop) o celular (posMobile)
const ZONAS_TULUM = [
  { id: 'zamna', titulo: 'Tulum Zamna', posDesktop: [-11, 2, -4], posMobile: [-4, 8, -2], urlSplat: null },
  { id: 'akumal', titulo: 'Tulum Akumal', posDesktop: [0, 2, -6], posMobile: [4, 8, -2], urlSplat: null }, 
  { id: 'zona_hotelera', titulo: 'Zona Hotelera', posDesktop: [11, 2, -4], posMobile: [-4.5, 0, 1], urlSplat: null },
  { id: 'veleta', titulo: 'Tulum Veleta', posDesktop: [-10, -5, 2], posMobile: [4.5, 0, 1], urlSplat: null },
  { id: 'aldea_zama', titulo: 'Aldea Zama', posDesktop: [0, -5, 4], posMobile: [-4, -8, 4], urlSplat: URL_SPLAT_ALDEAZAMA },
  { id: 'centro', titulo: 'Tulum Centro', posDesktop: [10, -5, 2], posMobile: [4, -8, 4], urlSplat: null },
];

type Props = {
  params: Promise<{
    estado: string;
    ciudad: string;
  }>;
};

// === COMPONENTE: PORTAL FLOTANTE ===
function PortalZona({ zona, isMobile }: { zona: any, isMobile: boolean }) {
  const [hovered, setHovered] = useState(false);

  // Decide qué posición usar dependiendo de la pantalla
  const posicionActiva = isMobile ? zona.posMobile : zona.posDesktop;
  // Ajusta el tamaño de la etiqueta en celular para que no se vea gigante
  const factorDistancia = isMobile ? 15 : 10;

  return (
    <Float speed={2} rotationIntensity={0.1} floatIntensity={1} floatingRange={[-0.2, 0.2]}>
      <group 
        position={posicionActiva as [number, number, number]} 
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={(e) => { e.stopPropagation(); setHovered(false); document.body.style.cursor = 'auto'; }}
        onClick={(e) => { 
          e.stopPropagation(); 
          if (zona.urlSplat) {
            alert(`¡Iniciando viaje cuántico a ${zona.titulo}! 🚀`);
          } else {
            alert(`La dimensión de ${zona.titulo} aún está siendo mapeada. ¡Vuelve pronto! 🚁`);
          }
        }}
      >
        {/* Etiqueta HTML flotante */}
        <HtmlSafe position={[0, 2.8, 0]} center transform distanceFactor={factorDistancia} zIndexRange={[100, 0]}>
          <div className={`px-4 py-2 md:px-5 md:py-2.5 rounded-2xl backdrop-blur-md border-2 transition-all duration-300 text-center whitespace-nowrap pointer-events-none ${hovered ? 'bg-cyan-950/90 border-cyan-400 scale-110 shadow-[0_0_30px_rgba(34,211,238,0.7)]' : 'bg-black/70 border-zinc-700 scale-100'}`}>
            <h2 className={`font-black text-sm md:text-xl tracking-widest uppercase ${hovered ? 'text-white' : 'text-zinc-200'}`}>{zona.titulo}</h2>
            <p className={`text-[8px] md:text-[10px] font-bold tracking-[0.2em] mt-1 ${zona.urlSplat ? 'text-yellow-400 animate-pulse' : 'text-zinc-500'}`}>
              {zona.urlSplat ? 'ENTRAR AL PORTAL ✨' : 'PRÓXIMAMENTE 🔒'}
            </p>
          </div>
        </HtmlSafe>

        {/* Lógica Visual (Splat vs Holograma) - CON TUS VALORES DE PALAPA */}
        {zona.urlSplat ? (
          <group scale={hovered ? 1.05 : 1}>
            <SplatSafe src={zona.urlSplat} position={[0, -0.8, 0]} scale={9} rotation={[0, 3.14, 0]} />
          </group>
        ) : (
          <group scale={hovered ? 1.1 : 1}>
            <mesh position={[0, 0, 0]}>
              <sphereGeometry args={[1.5, 16, 16]} />
              <meshBasicMaterial color={hovered ? "#22d3ee" : "#27272a"} wireframe transparent opacity={0.2} />
            </mesh>
            <mesh position={[0, 0, 0]}>
              <octahedronGeometry args={[0.8, 0]} />
              <meshBasicMaterial color={hovered ? "#ffffff" : "#3f3f46"} wireframe />
            </mesh>
          </group>
        )}
        
        {/* Base interactiva (sombra lumínica) */}
        <mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[2.2, 32]} />
          <meshBasicMaterial color={zona.urlSplat ? "#eab308" : "#22d3ee"} transparent opacity={hovered ? 0.3 : 0.05} />
        </mesh>
      </group>
    </Float>
  );
}

// === VISTA PRINCIPAL ===
export default function CiudadPage({ params }: Props) {
  const resolvedParams = use(params);
  
  const estadoName = decodeURIComponent(resolvedParams.estado).replace(/-/g, ' ');
  const ciudadName = decodeURIComponent(resolvedParams.ciudad).replace(/-/g, ' ').toUpperCase();

  // 📱 DETECCIÓN DE PANTALLA RESPONSIVA 📱
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      // Si la pantalla mide menos de 768px de ancho, es celular
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize(); // Checamos al cargar la página
    window.addEventListener('resize', handleResize); // Escuchamos si giran el teléfono
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Alejamos la cámara si es celular para que entren las 3 filas
  const posicionCamara = isMobile ? [0, 2, 32] : [0, 2, 24];

  return (
    <main className="relative w-full h-[100dvh] bg-[#020202] text-white overflow-hidden selection:bg-cyan-900">
      
      {/* 🌌 EL CANVAS 3D */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: posicionCamara as [number, number, number], fov: 60 }}>
          <Stars radius={100} depth={50} count={6000} factor={4} saturation={0} fade speed={0.5} />
          
          <OrbitControls 
            enableZoom={true} 
            maxDistance={35} 
            minDistance={8} 
            maxPolarAngle={Math.PI / 2 } 
            minPolarAngle={Math.PI / 6} 
            enablePan={false}
          />

          <Suspense fallback={<Html center><div className="text-cyan-400 font-bold text-sm md:text-xl tracking-widest animate-pulse bg-black/50 px-6 py-3 rounded-full backdrop-blur-sm border border-cyan-500/30">Cargando Matrix Tulum...</div></Html>}>
            <group position={[0, isMobile ? 1.5 : -0.5, 0]}>
              {ZONAS_TULUM.map((zona) => (
                <PortalZona key={zona.id} zona={zona} isMobile={isMobile} />
              ))}
            </group>
          </Suspense>
        </Canvas>
      </div>

      {/* 🖥️ INTERFAZ UI 2D */}
      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col">
        
        <header className="w-full relative pointer-events-auto bg-gradient-to-b from-black via-black/80 to-transparent pt-6 md:pt-8 pb-16 md:pb-20">
          
          {/* Botón Volver (Fijo y responsive) */}
          <div className="absolute left-4 top-6 md:left-10 md:top-10 z-20">
            <Link 
              href={`/${resolvedParams.estado}`}
              className="flex items-center justify-center w-10 h-10 md:w-auto md:h-auto md:px-5 md:py-2.5 rounded-full border border-zinc-800 bg-black/70 text-zinc-400 hover:text-cyan-400 hover:border-cyan-400/50 hover:bg-cyan-950/50 transition-all duration-300 font-inter text-sm backdrop-blur-md group shadow-xl"
            >
              <span className="text-xl md:text-lg group-hover:-translate-x-1 transition-transform duration-300">←</span> 
              <span className="tracking-wide hidden md:block md:ml-3">Volver a <span className="capitalize text-zinc-200 font-semibold">{estadoName}</span></span>
            </Link>
          </div>

          {/* Textos Centrados Limpios (Sin la descripción) */}
          <div className="w-full flex flex-col items-center justify-center mt-2 md:mt-0">
            <p className="font-inter text-cyan-400/90 text-[10px] md:text-sm tracking-[0.3em] md:tracking-[0.4em] uppercase mb-1 md:mb-2 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
              Virtual Metra / <span className="capitalize text-zinc-500">{estadoName}</span>
            </p>
            <h1 className="font-montserrat text-4xl md:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-yellow-100 via-yellow-400 to-yellow-600 drop-shadow-[0_0_25px_rgba(234,179,8,0.4)] mb-1 md:mb-2">
              {ciudadName}
            </h1>
          </div>
        </header>

      </div>
    </main>
  );
}