'use client';

import React, { use, useState, Suspense } from 'react';
import Link from 'next/link';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html, Splat, Float, Stars } from '@react-three/drei';

// 🛡️ BARRERA ANTI-LLOROS DE TYPESCRIPT 🛡️
const HtmlSafe = (props: any) => <Html {...props} />;
const SplatSafe = (props: any) => <Splat {...props} />;

// 👇👇👇 PEGA AQUÍ TU ENLACE DE SUPABASE PARA ALDEA ZAMA 👇👇👇
const URL_SPLAT_ALDEAZAMA = "https://izuozfbhtyvjwrckummr.supabase.co/storage/v1/object/public/modelos-3d/local_palapa.splat";
// 👆👆👆 ======================================================= 👆👆👆

// === NUEVA MATRIZ DE PORTALES 3D (Matrix Súper Dispersa) ===
const ZONAS_TULUM = [
  // --- FILA SUPERIOR (Más abajo que antes y súper abiertos a las orillas) ---
  { id: 'zamna', titulo: 'Tulum Zamna', posicion: [-11, 2, -4], urlSplat: null },
  { id: 'akumal', titulo: 'Tulum Akumal', posicion: [0, 2, -6], urlSplat: null }, 
  { id: 'zona_hotelera', titulo: 'Tulum Zona Hotelera', posicion: [11, 2, -4], urlSplat: null },

  // --- FILA INFERIOR (Mucho más abajo para separar las filas, y abiertos) ---
  { id: 'veleta', titulo: 'Tulum Veleta', posicion: [-10, -5, 2], urlSplat: null },
  { id: 'aldea_zama', titulo: 'Tulum Aldea Zama', posicion: [0, -5, 4], urlSplat: URL_SPLAT_ALDEAZAMA },
  { id: 'centro', titulo: 'Tulum Centro', posicion: [10, -5, 2], urlSplat: null },
];

type Props = {
  params: Promise<{
    estado: string;
    ciudad: string;
  }>;
};

// === COMPONENTE: PORTAL FLOTANTE ===
function PortalZona({ zona }: { zona: any }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Float speed={2} rotationIntensity={0.1} floatIntensity={1} floatingRange={[-0.2, 0.2]}>
      <group 
        position={zona.posicion as [number, number, number]} 
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
        <HtmlSafe position={[0, 2.8, 0]} center transform distanceFactor={10} zIndexRange={[100, 0]}>
          <div className={`px-5 py-2.5 rounded-2xl backdrop-blur-md border-2 transition-all duration-300 text-center whitespace-nowrap pointer-events-none ${hovered ? 'bg-cyan-950/90 border-cyan-400 scale-110 shadow-[0_0_30px_rgba(34,211,238,0.7)]' : 'bg-black/70 border-zinc-700 scale-100'}`}>
            <h2 className={`font-black text-xl tracking-widest uppercase ${hovered ? 'text-white' : 'text-zinc-200'}`}>{zona.titulo}</h2>
            <p className={`text-[10px] font-bold tracking-[0.2em] mt-1 ${zona.urlSplat ? 'text-yellow-400 animate-pulse' : 'text-zinc-500'}`}>
              {zona.urlSplat ? 'ENTRAR AL PORTAL ✨' : 'PRÓXIMAMENTE 🔒'}
            </p>
          </div>
        </HtmlSafe> {/* 👈 Y RECUERDA CERRAR LA ETIQUETA ASÍ */}

        {/* Lógica Visual (Splat vs Holograma) */}
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

  return (
    <main className="relative w-full h-[100dvh] bg-[#020202] text-white overflow-hidden selection:bg-cyan-900">
      
      {/* 🌌 EL CANVAS 3D */}
      <div className="absolute inset-0 z-0">
        {/* Se ajustó la cámara más atrás (Z=24) para que quepan los portales abiertos */}
        <Canvas camera={{ position: [0, 2, 24], fov: 60 }}>
          <Stars radius={100} depth={50} count={6000} factor={4} saturation={0} fade speed={0.5} />
          
          <OrbitControls 
            enableZoom={true} 
            maxDistance={30} 
            minDistance={8} 
            maxPolarAngle={Math.PI / 2 } // Bloquea la cámara a nivel del suelo
            minPolarAngle={Math.PI / 6} // No deja ver totalmente desde arriba
            enablePan={false}
          />

          <Suspense fallback={<Html center><div className="text-cyan-400 font-bold text-xl tracking-widest animate-pulse bg-black/50 px-6 py-3 rounded-full backdrop-blur-sm border border-cyan-500/30">Cargando Matrix Tulum...</div></Html>}>
            <group position={[0, -0.5, 0]}>
              {ZONAS_TULUM.map((zona) => (
                <PortalZona key={zona.id} zona={zona} />
              ))}
            </group>
          </Suspense>
        </Canvas>
      </div>

      {/* 🖥️ INTERFAZ UI 2D */}
      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col">
        
        {/* Cabecera Superior: Textos centrados y botón absoluto */}
        <header className="w-full relative pointer-events-auto bg-gradient-to-b from-black via-black/80 to-transparent pt-8 pb-20">
          
          {/* Botón Volver (Fijo a la izquierda) */}
          <div className="absolute left-6 top-8 md:left-10 md:top-10">
            <Link 
              href={`/${resolvedParams.estado}`}
              className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-zinc-800 bg-black/70 text-zinc-400 hover:text-cyan-400 hover:border-cyan-400/50 hover:bg-cyan-950/50 transition-all duration-300 font-inter text-sm backdrop-blur-md group shadow-xl"
            >
              <span className="text-lg group-hover:-translate-x-1 transition-transform duration-300">←</span> 
              <span className="tracking-wide hidden md:block">Volver a <span className="capitalize text-zinc-200 font-semibold">{estadoName}</span></span>
            </Link>
          </div>

          {/* Textos Centrados (Título reducido y breadcrumb) */}
          <div className="w-full flex flex-col items-center justify-center pt-14 md:pt-0">
            <p className="font-inter text-cyan-400/90 text-sm tracking-[0.4em] uppercase mb-2 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
              Virtual Metra / <span className="capitalize text-zinc-500">{estadoName}</span>
            </p>
            <h1 className="font-montserrat text-4xl md:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-yellow-100 via-yellow-400 to-yellow-600 drop-shadow-[0_0_25px_rgba(234,179,8,0.4)] mb-2">
              {ciudadName}
            </h1>
            <p className="font-inter text-zinc-400 max-w-xl mx-auto text-sm">
              Navega por la matriz dimensional y selecciona tu destino.
            </p>
          </div>
        </header>

      </div>
    </main>
  );
}