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
const URL_SPLAT_ALDEAZAMA = "https://izuozfbhtyvjwrckummr.supabase.co/storage/v1/object/public/modelos-3d/zama_360.splat"; 
// 👆👆👆 ======================================================= 👆👆👆 

// === MATRIZ RESPONSIVA === 
// Cada zona sabe dónde ponerse si es monitor (posDesktop) o celular (posMobile) 
const ZONAS_TULUM = [ 
{ id: 'zamna', titulo: 'Tulum Zamna', posDesktop: [-19, 4, -4], posMobile: [-4, 8, -2], urlSplat: null }, 
{ id: 'akumal', titulo: 'Tulum Akumal', posDesktop: [0, 2, -6], posMobile: [4, 8, -2], urlSplat: null }, 
{ id: 'zona_hotelera', titulo: 'Zona Hotelera', posDesktop: [19, 4, -4], posMobile: [-4.5, 0, 1], urlSplat: null }, 
{ id: 'veleta', titulo: 'Tulum Veleta', posDesktop: [-17, -5, 2], posMobile: [4.5, 0, 1], urlSplat: null }, 
{ id: 'aldea_zama', titulo: 'Aldea Zama', posDesktop: [0, -5, 4], posMobile: [-4, -8, 4], urlSplat: URL_SPLAT_ALDEAZAMA }, 
{ id: 'centro', titulo: 'Tulum Centro', posDesktop: [17, -5, 2], posMobile: [4, -8, 4], urlSplat: null }, 
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
<group position={posicionActiva as [number, number, number]}> 
  
  {/* 👇👇👇 LA SOLUCIÓN MÁGICA: ESFERA DETECTORA DE CLICS 👇👇👇 */}
  {/* Solo detectamos hover y click en un radio exacto (args=[2.5]), ignorando la caja gigante del Splat */}
  <mesh 
    visible={false} 
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
    <sphereGeometry args={[2.5, 16, 16]} />
    <meshBasicMaterial transparent opacity={0} />
  </mesh>
  {/* 👆👆👆 FIN SOLUCIÓN MÁGICA 👆👆👆 */}

{/* Etiqueta HTML flotante - INVERTIDA A MODO CLARO */} 
<HtmlSafe position={[0, 2.8, 0]} center transform distanceFactor={factorDistancia} zIndexRange={[100, 0]}> 
<div className={`px-4 py-2 md:px-5 md:py-2.5 rounded-2xl backdrop-blur-md border-2 transition-all duration-300 text-center whitespace-nowrap pointer-events-none ${hovered ? 'bg-cyan-50/90 border-cyan-500 scale-110 shadow-[0_0_30px_rgba(6,182,212,0.3)]' : 'bg-white/80 border-gray-300 scale-100'}`}> 
<h2 className={`font-black text-sm md:text-xl tracking-widest uppercase ${hovered ? 'text-cyan-900' : 'text-gray-900'}`}>{zona.titulo}</h2> 
<p className={`text-[8px] md:text-[10px] font-bold tracking-[0.2em] mt-1 ${zona.urlSplat ? 'text-yellow-600 animate-pulse' : 'text-gray-400'}`}> 
{zona.urlSplat ? 'ENTRAR AL PORTAL ✨' : 'PRÓXIMAMENTE 🔒'} 
</p> 
</div> 
</HtmlSafe> 

{/* Lógica Visual (Splat vs Holograma) */} 
{zona.urlSplat ? ( 
<group scale={hovered ? 1.05 : 1}> 
{/* Se mantiene tu escala de 9, pero el clic ya no se mezcla */}
<SplatSafe src={zona.urlSplat} position={[0, 0, 0]} scale={9} rotation={[0, 0, 0]} /> 
</group> 
) : ( 
<group scale={hovered ? 1.1 : 1}> 
<mesh position={[0, 0, 0]}> 
<sphereGeometry args={[1.5, 16, 16]} /> 
{/* Holograma invertido: Alambres negros en vez de blancos */}
<meshBasicMaterial color={hovered ? "#06b6d4" : "#1f2937"} wireframe transparent opacity={0.3} /> 
</mesh> 
<mesh position={[0, 0, 0]}> 
<octahedronGeometry args={[0.8, 0]} /> 
{/* Octaedro invertido: Negro/Gris oscuro en vez de blanco */}
<meshBasicMaterial color={hovered ? "#000000" : "#4b5563"} wireframe /> 
</mesh> 
</group> 
)} 
{/* Base interactiva (sombra lumínica) */} 
<mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]}> 
<circleGeometry args={[2.2, 32]} /> 
<meshBasicMaterial color={zona.urlSplat ? "#eab308" : "#06b6d4"} transparent opacity={hovered ? 0.4 : 0.1} /> 
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
// INVERTIDO: Fondo blanco principal
<main className="relative w-full h-[100dvh] bg-[#f8fafc] text-gray-900 overflow-hidden selection:bg-cyan-200"> 
{/* 🌌 EL CANVAS 3D */} 
<div className="absolute inset-0 z-0 bg-white"> 
<Canvas camera={{ position: posicionCamara as [number, number, number], fov: 60 }}> 
{/* INVERTIDO: Estrellas de color oscuro para que se vean en fondo blanco */}
<Stars radius={100} depth={50} count={6000} factor={4} saturation={0} fade speed={0.5} /> 
<OrbitControls 
enableZoom={true} 
maxDistance={35} 
minDistance={8} 
maxPolarAngle={Math.PI / 2 } 
minPolarAngle={Math.PI / 6} 
enablePan={false} 
/> 

<Suspense fallback={<Html center><div className="text-cyan-600 font-bold text-sm md:text-xl tracking-widest animate-pulse bg-white/80 px-6 py-3 rounded-full backdrop-blur-sm border border-cyan-500/30 shadow-lg">Cargando Matrix Tulum...</div></Html>}> 
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
{/* INVERTIDO: Gradiente de blanco a transparente en el header */}
<header className="w-full relative pointer-events-auto bg-gradient-to-b from-white via-white/80 to-transparent pt-6 md:pt-8 pb-16 md:pb-20"> 
{/* Botón Volver (Fijo y responsive) - INVERTIDO */} 
<div className="absolute left-4 top-6 md:left-10 md:top-10 z-20"> 
<Link 
href={`/${resolvedParams.estado}`} 
className="flex items-center justify-center w-10 h-10 md:w-auto md:h-auto md:px-5 md:py-2.5 rounded-full border border-gray-300 bg-white/90 text-gray-600 hover:text-cyan-600 hover:border-cyan-400/50 hover:bg-cyan-50/80 transition-all duration-300 font-inter text-sm backdrop-blur-md group shadow-md" 
> 
<span className="text-xl md:text-lg group-hover:-translate-x-1 transition-transform duration-300">←</span> 
<span className="tracking-wide hidden md:block md:ml-3">Volver a <span className="capitalize text-gray-900 font-semibold">{estadoName}</span></span> 
</Link> 
</div> 

{/* Textos Centrados Limpios (Sin la descripción) - INVERTIDO */} 
<div className="w-full flex flex-col items-center justify-center mt-2 md:mt-0"> 
<p className="font-inter text-cyan-600/90 text-[10px] md:text-sm tracking-[0.3em] md:tracking-[0.4em] uppercase mb-1 md:mb-2 drop-shadow-sm"> 
Virtual Metra / <span className="capitalize text-gray-500">{estadoName}</span> 
</p> 
<h1 className="font-montserrat text-4xl md:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-yellow-500 via-yellow-600 to-yellow-800 drop-shadow-sm mb-1 md:mb-2"> 
{ciudadName} 
</h1> 
</div> 
</header> 

</div> 
</main> 
); 
}