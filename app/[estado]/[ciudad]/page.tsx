import Link from 'next/link';
// Asegúrate de importar y configurar next/font/google en tu layout.tsx 
// para las clases font-montserrat y font-inter.

type Props = {
  params: Promise<{
    estado: string;
    ciudad: string;
  }>;
};

export default async function CiudadPage({ params }: Props) {
  // En Next.js 15, resolvemos los parámetros asíncronamente
  const resolvedParams = await params;
  
  // Decodificamos la URL y capitalizamos (ej. quintana-roo -> Quintana Roo)
  const estadoName = decodeURIComponent(resolvedParams.estado).replace(/-/g, ' ');
  const ciudadName = decodeURIComponent(resolvedParams.ciudad).replace(/-/g, ' ').toUpperCase();

  const satelites = [
    { 
      id: 'tianguis', 
      name: 'Tianguis Tulum', 
      desc: 'Mercado inmersivo en 3D para comercio digital y experiencias locales.' 
    },
    { 
      id: 'nomad', 
      name: 'Virtual Nomad Tulum', 
      desc: 'El hub de conexión, espacios de trabajo y comunidad para creadores globales.' 
    },
    { 
      id: 'luxury', 
      name: 'Virtual Luxury Tulum', 
      desc: 'Bienes raíces de alto nivel y accesos exclusivos a experiencias premium.' 
    },
    { 
      id: 'explore', 
      name: 'Virtual Explore Tulum', 
      desc: 'Aventuras hiperlocales, cenotes ocultos y descubrimientos interactivos.' 
    },
    { 
      id: 'social', 
      name: 'Virtual Social Tulum', 
      desc: 'Vida nocturna interactiva, festivales y eventos en tiempo real.' 
    },
  ];

  return (
    <main className="min-h-screen bg-black text-white px-6 py-24 selection:bg-cyan-900">
      {/* Encabezado Cinematográfico */}
      <header className="max-w-6xl mx-auto mb-20 text-center">
        <p className="font-inter text-zinc-400 text-sm tracking-[0.3em] uppercase mb-4">
          Virtual Metra / {estadoName}
        </p>
        <h1 className="font-montserrat text-5xl md:text-7xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-yellow-500 to-yellow-700 drop-shadow-[0_0_15px_rgba(234,179,8,0.2)]">
          {ciudadName}
        </h1>
        <p className="mt-6 font-inter text-zinc-300 max-w-2xl mx-auto text-lg">
          Selecciona tu dimensión y adéntrate en el ecosistema digital hiperlocal.
        </p>
      </header>

      {/* Grid de Satélites */}
      <section className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {satelites.map((satelite) => (
            <Link 
              href={`/${resolvedParams.estado}/${resolvedParams.ciudad}/${satelite.id}`} 
              key={satelite.id}
              className="group relative block p-8 rounded-2xl bg-[#0a0a0a] border border-zinc-800 transition-all duration-300 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] overflow-hidden"
            >
              {/* Efecto de pulso neón interno en hover */}
              <div className="absolute inset-0 bg-cyan-400/5 opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-300 pointer-events-none z-0" />
              
              <div className="relative z-10">
                <h3 className="font-montserrat text-xl font-bold text-zinc-100 mb-3 group-hover:text-cyan-300 transition-colors duration-300">
                  {satelite.name}
                </h3>
                <p className="font-inter text-sm text-zinc-400 leading-relaxed group-hover:text-zinc-300 transition-colors duration-300">
                  {satelite.desc}
                </p>
              </div>

              {/* Acento decorativo */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-zinc-800 to-transparent opacity-50 rounded-tr-2xl group-hover:from-cyan-900 transition-all duration-300" />
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}