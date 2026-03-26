'use client'; 

import React, { use, useState, useEffect, Suspense } from 'react'; 
import Link from 'next/link'; 
import { useRouter } from 'next/navigation';
import * as THREE from 'three'; 
import { Canvas } from '@react-three/fiber'; 
import { OrbitControls, Html, Float, Stars, useVideoTexture } from '@react-three/drei'; 

// 🛡️ BARRERA ANTI-LLOROS DE TYPESCRIPT 🛡️ 
const HtmlSafe = Html as unknown as React.FC<any>; 

// === MATRIZ RESPONSIVA === 
// Ahora usamos 'urlVideo' en lugar de 'urlSplat'
const ZONAS_TULUM = [ 
{ id: 'zamna', titulo: 'Tulum Zamna', posDesktop: [-19, 4, -4], posMobile: [-4, 8, -2], urlVideo: null }, 
{ id: 'akumal', titulo: 'Tulum Akumal', posDesktop: [0, 2, -6], posMobile: [4, 8, -2], urlVideo: null }, 
{ id: 'zona_hotelera', titulo: 'Zona Hotelera', posDesktop: [19, 4, -4], posMobile: [-4.5, 0, 1], urlVideo: null }, 
{ id: 'veleta', titulo: 'Tulum Veleta', posDesktop: [-17, -5, 2], posMobile: [4.5, 0, 1], urlVideo: null }, 
{ id: 'aldea_zama', titulo: 'Aldea Zama', posDesktop: [0, -5, 4], posMobile: [-4, -8, 4], urlVideo: '/zama_360.mp4' }, 
{ id: 'centro', titulo: 'Tulum Centro', posDesktop: [17, -5, 2], posMobile: [4, -8, 4], urlVideo: null }, 
]; 

type Props = { 
params: Promise<{ 
estado: string; 
ciudad: string; 
}>; 
}; 

// === 👇👇👇 COMPONENTE MODIFICADO: VIDEO SOBRE ESFERA 👇👇👇 ===
function VideoHologramaEsfera({ url }: { url: string }) { // He renombrado la función para mayor claridad
    // Reproduce el video en loop, sin sonido
    const texture = useVideoTexture(url, { muted: true, loop: true, start: true });
    return (
        // 1. Envolvemos en un grupo para rotar la esfera y alinear el video
        <group rotation={[0, -Math.PI / 2, 0]}>
            <mesh position={[0, -0.2, 0]}>
                {/* 2. === CAMBIADO: DE PLANE A SPHERE === */}
                {/* args=[radio, segmentos_ancho, segmentos_alto] */}
                <sphereGeometry args={[4, 35, 35]} />

                {/* 3. Agregamos propiedades para un efecto más "holográfico" */}
                <meshBasicMaterial 
                    map={texture} 
                    toneMapped={false} 
                    side={THREE.DoubleSide} 
                    transparent // Habilita la transparencia
                    opacity={0.9} // Un toque de transparencia
                />
            </mesh>
        </group>
    );
}
// === 👆👆👆 FIN COMPONENTE MODIFICADO 👆👆👆 ===

// === COMPONENTE: PORTAL FLOTANTE === 
function PortalZona({ zona, isMobile, estado, ciudad }: { zona: any, isMobile: boolean, estado: string, ciudad: string }) { 
const [hovered, setHovered] = useState(false); 
const router = useRouter();

// Decide qué posición usar dependiendo de la pantalla 
const posicionActiva = isMobile ? zona.posMobile : zona.posDesktop; 
// Ajusta el tamaño de la etiqueta en celular para que no se vea gigante 
const factorDistancia = isMobile ? 15 : 10; 

return ( 
<Float speed={2} rotationIntensity={0.1} floatIntensity={1} floatingRange={[-0.2, 0.2]}> 
<group position={posicionActiva as [number, number, number]}> 
  
  {/* 👇 Esfera detectora de clics 👇 */}
  <mesh 
    visible={false} 
    onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }} 
    onPointerOut={(e) => { e.stopPropagation(); setHovered(false); document.body.style.cursor = 'auto'; }} 
    onClick={(e) => { 
      e.stopPropagation(); 
      if (zona.urlVideo) { 
        // ¡TELETRANSPORTACIÓN A LA NUEVA PÁGINA!
        router.push(`/${estado}/${ciudad}/${zona.id}`);
      } else { 
        alert(`La dimensión de ${zona.titulo} aún está siendo mapeada. ¡Vuelve pronto! 🚁`); 
      } 
    }}
  >
    <sphereGeometry args={[2.8, 16, 16]} />
    <meshBasicMaterial transparent opacity={0} />
  </mesh>

{/* Etiqueta HTML flotante - MODO CLARO */} 
<HtmlSafe position={[0, 2.5, 0]} center transform distanceFactor={factorDistancia} zIndexRange={[100, 0]}> 
<div className={`px-4 py-2 md:px-5 md:py-2.5 rounded-2xl backdrop-blur-md border-2 transition-all duration-300 text-center whitespace-nowrap pointer-events-none ${hovered ? 'bg-cyan-50/90 border-cyan-500 scale-110 shadow-[0_0_30px_rgba(6,182,212,0.3)]' : 'bg-white/80 border-gray-300 scale-100'}`}> 
<h2 className={`font-black text-sm md:text-xl tracking-widest uppercase ${hovered ? 'text-cyan-900' : 'text-gray-900'}`}>{zona.titulo}</h2> 
<p className={`text-[8px] md:text-[10px] font-bold tracking-[0.2em] mt-1 ${zona.urlVideo ? 'text-yellow-600 animate-pulse' : 'text-gray-400'}`}> 
{zona.urlVideo ? 'ENTRAR AL PORTAL ✨' : 'PRÓXIMAMENTE 🔒'} 
</p> 
</div> 
</HtmlSafe> 

{/* Lógica Visual (Video Holograma vs Esfera Alámbrica) */} 
{zona.urlVideo ? ( 
<group scale={hovered ? 1.05 : 1}> 
  <VideoHologramaEsfera url={zona.urlVideo} />
</group> 
) : ( 
<group scale={hovered ? 1.1 : 1}> 
<mesh position={[0, 0, 0]}> 
<sphereGeometry args={[1.5, 16, 16]} /> 
<meshBasicMaterial color={hovered ? "#06b6d4" : "#1f2937"} wireframe transparent opacity={0.3} /> 
</mesh> 
<mesh position={[0, 0, 0]}> 
<octahedronGeometry args={[0.8, 0]} /> 
<meshBasicMaterial color={hovered ? "#000000" : "#4b5563"} wireframe /> 
</mesh> 
</group> 
)} 
{/* Base interactiva (sombra lumínica) */} 
<mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]}> 
<circleGeometry args={[2.2, 32]} /> 
<meshBasicMaterial color={zona.urlVideo ? "#eab308" : "#06b6d4"} transparent opacity={hovered ? 0.4 : 0.1} /> 
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
setIsMobile(window.innerWidth < 768); 
}; 
handleResize(); 
window.addEventListener('resize', handleResize); 
return () => window.removeEventListener('resize', handleResize); 
}, []); 

const posicionCamara = isMobile ? [0, 2, 32] : [0, 2, 24]; 

return ( 
<main className="relative w-full h-[100dvh] bg-[#f8fafc] text-gray-900 overflow-hidden selection:bg-cyan-200"> 
{/* 🌌 EL CANVAS 3D */} 
<div className="absolute inset-0 z-0 bg-white"> 
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

<Suspense fallback={<Html center><div className="text-cyan-600 font-bold text-sm md:text-xl tracking-widest animate-pulse bg-white/80 px-6 py-3 rounded-full backdrop-blur-sm border border-cyan-500/30 shadow-lg">Cargando Matrix Tulum...</div></Html>}> 
<group position={[0, isMobile ? 1.5 : -0.5, 0]}> 
{ZONAS_TULUM.map((zona) => ( 
<PortalZona key={zona.id} zona={zona} isMobile={isMobile} estado={resolvedParams.estado} ciudad={resolvedParams.ciudad} /> 
))} 
</group> 
</Suspense> 
</Canvas> 
</div> 

{/* 🖥️ INTERFAZ UI 2D */} 
<div className="absolute inset-0 z-10 pointer-events-none flex flex-col"> 
<header className="w-full relative pointer-events-auto bg-gradient-to-b from-white via-white/80 to-transparent pt-6 md:pt-8 pb-16 md:pb-20"> 
<div className="absolute left-4 top-6 md:left-10 md:top-10 z-20"> 
<Link 
href={`/${resolvedParams.estado}`} 
className="flex items-center justify-center w-10 h-10 md:w-auto md:h-auto md:px-5 md:py-2.5 rounded-full border border-gray-300 bg-white/90 text-gray-600 hover:text-cyan-600 hover:border-cyan-400/50 hover:bg-cyan-50/80 transition-all duration-300 font-inter text-sm backdrop-blur-md group shadow-md" 
> 
<span className="text-xl md:text-lg group-hover:-translate-x-1 transition-transform duration-300">←</span> 
<span className="tracking-wide hidden md:block md:ml-3">Volver a <span className="capitalize text-gray-900 font-semibold">{estadoName}</span></span> 
</Link> 
</div> 

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