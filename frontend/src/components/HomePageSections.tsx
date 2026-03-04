// frontend/src/components/HomePageSections.tsx — v4
// CAMBIOS v4:
//   - "Consultar precio" → scrollTo #precios (no WhatsApp)
//   - KitCarousel: 3 fotos rotando cada 3 segundos, pequeño en mobile
//   - Nota especialista: texto mejorado sobre importancia del homecare
import { useState, useEffect } from 'react';

const WA_URL = 'https://wa.me/34641261559?text=Hola!%20Quiero%20reservar%20una%20cita';
const WA_KIT  = 'https://wa.me/34641261559?text=Hola!%20Me%20interesa%20el%20kit%20de%20homecare';

// ─────────────────────────────────────────────
// 1. ¿POR QUÉ ELEGIR KERATIN MADRID?
// ─────────────────────────────────────────────
const beneficios = [
  {
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path strokeLinecap="round" d="m21 21-4.35-4.35"/></svg>,
    titulo: 'Diagnóstico con tricóscopo',
    texto: 'Analizamos cabello y cuero cabelludo antes de elegir cualquier protocolo.',
  },
  {
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z"/></svg>,
    titulo: 'Protocolos exclusivos',
    texto: 'Tecnología premium anti-daño. Fórmulas seguras que no queman ni resecan.',
  },
  {
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"/></svg>,
    titulo: 'Servicio de alto nivel',
    texto: 'Atención personalizada, experiencia cómoda y cuidado en cada detalle.',
  },
  {
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"/></svg>,
    titulo: 'Seguimiento y cuidado',
    texto: 'Plan claro para prolongar resultados al máximo después del tratamiento.',
  },
  {
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/></svg>,
    titulo: 'Corrección de hábitos',
    texto: 'Ajustamos hábitos sencillos que marcan la diferencia día a día.',
  },
  {
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"/></svg>,
    titulo: 'Resultados duraderos',
    texto: 'Trabajamos para meses, no para un día. Resultados acumulativos y reales.',
  },
];

export function PorQueElegirSection() {
  return (
    <section id="inicio" className="bg-white py-20 lg:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-[11px] tracking-[0.25em] uppercase text-[#8B7355] mb-4">Beneficios</p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#3d3530] mb-5">
            ¿Por qué elegir Keratin Madrid?
          </h2>
          <p className="text-[#8B7355] text-base md:text-lg max-w-lg mx-auto mb-8">
            Nos diferenciamos por nuestro enfoque en la salud capilar y resultados duraderos.
          </p>
          <button
            onClick={() => document.getElementById('servicios')?.scrollIntoView({ behavior: 'smooth' })}
            className="inline-flex items-center gap-2 text-[12px] tracking-[0.2em] uppercase text-[#B8A99A] border-b border-[#B8A99A] pb-0.5 hover:text-[#9A8B7A] transition-colors">
            Ver tratamientos
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"/>
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {beneficios.map((b, i) => (
            <div key={i} className="flex flex-col gap-3 p-6 md:p-7 border border-[#f0ebe4] hover:border-[#B8A99A] hover:shadow-sm transition-all duration-300">
              <div className="w-9 h-9 flex items-center justify-center text-[#8B7355]">{b.icon}</div>
              <h3 className="font-serif text-lg md:text-xl text-[#3d3530]">{b.titulo}</h3>
              <p className="text-[#7a6f68] text-sm md:text-base leading-relaxed">{b.texto}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// 2. TRATAMIENTOS
// ─────────────────────────────────────────────
const tratamientos = [
  { img: '/images/image1.jpg', tag: 'Bestseller', nombre: 'Alisado de Keratina', duracion: '3–6 meses', desc: 'Alisado seguro, sin formol. Adaptado al diagnóstico previo de cada tipo de cabello.', ben: ['Reduce frizz', 'Brillo espejo duradero', 'Más disciplina', 'Ahorra tiempo al peinar'], indicado: 'Cabellos rizados, encrespados, rebeldes', efecto: 'Liso, brillante y manejable 3–6 meses.' },
  { img: '/images/image2.jpg', tag: 'Reparador', nombre: 'Reconstrucción en frío', duracion: 'Resultado acumulativo', desc: 'Recuperación profunda sin alisar. Restaura fuerza, densidad y elasticidad.', ben: ['Reposición de proteínas', 'Reduce rotura', 'Mejora brillo', 'Compatible con decoloraciones'], indicado: 'Cabello seco, dañado o decolorado', efecto: 'Más fuerte y nutrido, resultado acumulativo.' },
  { img: '/images/image3.jpg', tag: 'Detox', nombre: 'Peeling Capilar', duracion: 'Limpieza + diagnóstico', desc: 'Limpieza profunda con diagnóstico mediante tricóscopo.', ben: ['Elimina grasa y residuos', 'Activa la circulación', 'Previene caspa', 'Mejora oxigenación'], indicado: 'Cuero cabelludo graso, caída, pesadez', efecto: 'Frescor, ligereza y mayor volumen.' },
  { img: '/images/image4.jpg', tag: 'Relax', nombre: 'Head Spa', duracion: 'Ritual de bienestar', desc: 'Ritual de salud y relax con masaje y productos profesionales.', ben: ['Activa la microcirculación', 'Nutre el folículo', 'Reduce estrés', 'Favorece el crecimiento'], indicado: 'Caída, estrés, bienestar general', efecto: 'Ligereza, brillo y equilibrio total.' },
];

function ImgPlaceholder({ label }: { label: string }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#f0ebe4]">
      <svg className="w-7 h-7 text-[#c9bfb5] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/>
      </svg>
      <span className="text-[10px] tracking-widest uppercase text-[#c9bfb5]">{label}</span>
    </div>
  );
}

export function TratamientosSection() {
  // ✅ FIX: "Consultar precio" → scrollTo #precios (no WhatsApp)
  const scrollToPrecios = () => {
    document.getElementById('precios')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="servicios" className="bg-[#FAF8F5] py-20 lg:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-[11px] tracking-[0.25em] uppercase text-[#8B7355] mb-4">Servicios</p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#3d3530] mb-5">Tratamientos</h2>
          <p className="text-[#8B7355] text-base md:text-lg">Tratamientos profesionales adaptados a tu tipo de cabello</p>
        </div>

        <div className="flex flex-col gap-14">
          {tratamientos.map((t, i) => (
            <div key={i} className={`flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 md:gap-12 items-center`}>
              {/* Imagen */}
              <div className="w-full md:w-[260px] lg:w-[300px] flex-shrink-0">
                <div className="relative aspect-[3/4] bg-[#e8e2da] overflow-hidden">
                  <img src={t.img} alt={t.nombre} className="w-full h-full object-cover relative z-10"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}/>
                  <ImgPlaceholder label={t.img.split('/').pop() || ''}/>
                  <div className="absolute top-3 left-3 bg-[#3d3530] text-white text-[9px] tracking-[0.15em] uppercase px-3 py-1 z-20">
                    {t.tag}
                  </div>
                </div>
              </div>

              {/* Contenido */}
              <div className="flex-1 flex flex-col gap-4">
                <div>
                  <p className="text-[11px] tracking-[0.2em] uppercase text-[#B8A99A] mb-1">{t.duracion}</p>
                  <h3 className="font-serif text-2xl md:text-3xl text-[#3d3530] mb-2">{t.nombre}</h3>
                  <p className="text-[#7a6f68] text-base md:text-lg leading-relaxed">{t.desc}</p>
                </div>
                <ul className="grid grid-cols-2 gap-2">
                  {t.ben.map((b, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm md:text-base text-[#7a6f68]">
                      <span className="mt-2 w-1 h-1 rounded-full bg-[#B8A99A] flex-shrink-0"/>
                      {b}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-col sm:flex-row gap-3 text-sm md:text-base">
                  <div className="flex-1 bg-white px-4 py-3">
                    <p className="text-[10px] tracking-widest uppercase text-[#B8A99A] mb-1">Indicado para</p>
                    <p className="text-[#3d3530]">{t.indicado}</p>
                  </div>
                  <div className="flex-1 bg-white px-4 py-3">
                    <p className="text-[10px] tracking-widest uppercase text-[#B8A99A] mb-1">Efecto</p>
                    <p className="text-[#3d3530]">{t.efecto}</p>
                  </div>
                </div>
                {/* ✅ FIX: scrollTo #precios */}
                <button
                  onClick={scrollToPrecios}
                  className="self-start px-7 py-2.5 border border-[#B8A99A] text-[#B8A99A] text-[11px] tracking-[0.2em] uppercase hover:bg-[#B8A99A] hover:text-white transition-all duration-300 cursor-pointer">
                  Ver precio
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// 3. TABLA DE PRECIOS
// ─────────────────────────────────────────────
const precios = [
  { l: '20–30 cm', k: '180€', r: '150€' },
  { l: '30–40 cm', k: '200€', r: '165€' },
  { l: '40–50 cm', k: '220€', r: '180€' },
  { l: '50–60 cm', k: '240€', r: '200€' },
  { l: '60–70 cm', k: '260€', r: '220€' },
  { l: '70–80 cm', k: '280€', r: '240€' },
];

export function TablaDePreciosSection() {
  const [tab, setTab] = useState<'k' | 'r'>('k');
  return (
    <section id="precios" className="bg-white py-20 lg:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-[11px] tracking-[0.25em] uppercase text-[#8B7355] mb-4">Precios</p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#3d3530] mb-5">Tabla de Precios</h2>
          <p className="text-[#8B7355] text-base md:text-lg">Precios transparentes adaptados a la longitud de tu cabello</p>
        </div>
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
          <div className="flex-1 w-full">
            <div className="flex border-b border-[#e8e2da] mb-8">
              {[['k', 'Keratina / Botox'], ['r', 'Reconstrucción']].map(([v, label]) => (
                <button key={v} onClick={() => setTab(v as 'k' | 'r')}
                  className={`pb-3 px-6 text-[12px] tracking-[0.12em] uppercase transition-all ${tab === v ? 'border-b-2 border-[#B8A99A] text-[#3d3530]' : 'text-[#a09890] hover:text-[#3d3530]'}`}>
                  {label}
                </button>
              ))}
            </div>
            <div className="flex flex-col divide-y divide-[#f0ebe4]">
              {precios.map((p, i) => (
                <div key={i} className="flex justify-between items-center py-4">
                  <span className="text-base md:text-lg text-[#3d3530]">{p.l}</span>
                  <span className="font-serif text-xl md:text-2xl text-[#3d3530]">{tab === 'k' ? p.k : p.r}</span>
                </div>
              ))}
            </div>
            <div className="mt-7 bg-[#FAF8F5] px-5 py-4 text-sm md:text-base text-[#7a6f68] space-y-1.5">
              <p><span className="text-[#3d3530] font-medium">Cabello muy abundante:</span> +20€ (7cm) · +40€ (9cm) · +60€ (10+cm)</p>
              <p><span className="text-[#3d3530] font-medium">Extras:</span> Peeling anticaspa +65€ · Nano Gold +50€ · Corte puntas +20€</p>
            </div>
            <a href={WA_URL} target="_blank" rel="noopener noreferrer"
              className="mt-6 inline-block px-8 py-3 bg-[#B8A99A] text-white text-[11px] tracking-[0.2em] uppercase hover:bg-[#9A8B7A] transition-colors">
              Calcular mi precio
            </a>
          </div>

          {/* Guía longitud */}
          <div className="w-full lg:w-72 flex-shrink-0">
            <p className="text-[11px] tracking-[0.2em] uppercase text-[#8B7355] mb-4 text-center">Guía de longitud</p>
            <div className="relative bg-[#f0ebe4] overflow-hidden">
              <img src="/images/image8.jpg" alt="Guía de longitud" className="w-full object-contain relative z-10"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}/>
              <div className="absolute inset-0 flex items-center justify-center bg-[#f0ebe4]">
                <span className="text-[10px] tracking-widest uppercase text-[#c9bfb5]">image8.jpg</span>
              </div>
            </div>
            <div className="mt-4 space-y-1.5 text-sm">
              {[['20–30 cm','Debajo de la oreja'],['30–40 cm','Hombros'],['40–50 cm','Mitad espalda'],['50–60 cm','Cintura'],['60–70 cm','Bajo cintura'],['70–80 cm','Cadera']].map(([l,d]) => (
                <div key={l} className="flex gap-3">
                  <span className="text-[#B8A99A] font-medium w-20 flex-shrink-0">{l}</span>
                  <span className="text-[#7a6f68]">{d}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// 4. ANTES & DESPUÉS
// ─────────────────────────────────────────────
const adFotos = [
  { img: '/images/photo-output.jpeg', link: 'https://www.instagram.com/reel/DCJ-1UTNQ1_/' },
  { img: '/images/image7.jpg',        link: 'https://www.instagram.com/reel/DCDVx8RNsVt/' },
  { img: '/images/image6.jpeg',       link: 'https://www.instagram.com/reel/DCDWDpztO7N/' },
  { img: '/images/image5.jpg',        link: 'https://www.instagram.com/reel/DCDWSW4Njcx/' },
];

export function AntesDespuesSection() {
  return (
    <section id="resultados" className="bg-[#FAF8F5] py-20 lg:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-[11px] tracking-[0.25em] uppercase text-[#8B7355] mb-4">Resultados</p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#3d3530] mb-5">Antes / Después</h2>
          <p className="text-[#8B7355] text-base md:text-lg">Resultados reales de nuestros tratamientos</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {adFotos.map((item, i) => (
            <a key={i} href={item.link} target="_blank" rel="noopener noreferrer"
              className="relative aspect-[3/4] bg-[#e8e2da] overflow-hidden group block">
              <img src={item.img} alt={`Transformación ${i+1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 relative z-10"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}/>
              <ImgPlaceholder label="Foto"/>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 z-20"/>
            </a>
          ))}
        </div>
        <div className="text-center mt-8">
          <a href="https://www.instagram.com/keratin_madrid" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[12px] tracking-[0.2em] uppercase text-[#8B7355] border-b border-[#B8A99A] pb-1 hover:text-[#3d3530] transition-colors">
            Ver más en Instagram
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"/>
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// 5. OPINIONES
// ─────────────────────────────────────────────
const resenasEstaticas = [
  { nombre: 'Ana M.', estrellas: 5, texto: 'El resultado fue increíble desde la primera sesión. El cabello quedó brillante, suave y sin frizz. El diagnóstico previo me pareció muy profesional.' },
  { nombre: 'Laura P.', estrellas: 5, texto: 'Llevo dos años yendo y cada vez mejor. La keratina dura muchísimo y el trato es excelente. Sin duda el mejor estudio de Madrid.' },
  { nombre: 'Sofía R.', estrellas: 5, texto: 'Tenía el pelo muy dañado por decoloraciones y después de la reconstrucción en frío cambió completamente. Muy profesional y detallista.' },
  { nombre: 'María G.', estrellas: 5, texto: 'El Head Spa fue una experiencia maravillosa. Me fui con el cuero cabelludo limpio, el pelo brillante y completamente relajada.' },
  { nombre: 'Elena T.', estrellas: 5, texto: 'Vine por recomendación y no me arrepiento. El diagnóstico con tricóscopo fue lo que me convenció. Todo muy personalizado.' },
  { nombre: 'Carmen V.', estrellas: 5, texto: 'El kit de homecare que me recomendaron alargó el resultado del alisado mucho más de lo esperado. Los productos son increíbles.' },
];

interface ReviewForm { nombre: string; texto: string; estrellas: number; }

export function ReviewsSection() {
  const [form, setForm]     = useState<ReviewForm>({ nombre: '', texto: '', estrellas: 5 });
  const [sent, setSent]     = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');

  const handleSubmit = async () => {
    if (!form.nombre.trim() || !form.texto.trim()) {
      setError('Completa tu nombre y experiencia.');
      return;
    }
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setSent(true);
    } catch { setError('No se pudo enviar. Inténtalo más tarde.'); }
    finally { setLoading(false); }
  };

  return (
    <section id="opiniones" className="bg-white py-20 lg:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-[11px] tracking-[0.25em] uppercase text-[#8B7355] mb-4">Testimonios</p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#3d3530] mb-5">
            Lo que dicen nuestras clientas
          </h2>
          <p className="text-[#8B7355] text-base md:text-lg">Experiencias reales de quienes confían en nosotras</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 mb-14">
          {resenasEstaticas.map((r, i) => (
            <div key={i} className="flex flex-col gap-3 p-6 bg-[#FAF8F5] border border-[#f0ebe4]">
              <div className="flex gap-0.5">
                {[...Array(r.estrellas)].map((_, j) => (
                  <span key={j} className="text-[#B8A99A] text-sm">★</span>
                ))}
              </div>
              <p className="text-[#3d3530] text-sm md:text-base leading-relaxed flex-1 italic font-serif">
                "{r.texto}"
              </p>
              <p className="text-[11px] tracking-[0.15em] uppercase text-[#8B7355]">{r.nombre}</p>
            </div>
          ))}
        </div>

        {/* Mini formulario */}
        <div className="max-w-md mx-auto">
          <p className="text-[11px] tracking-[0.2em] uppercase text-[#a09890] text-center mb-6">
            ¿Fuiste clienta? Comparte tu experiencia
          </p>
          {sent ? (
            <p className="text-center text-sm text-[#8B7355] py-4">¡Gracias! Lo revisaremos pronto.</p>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="flex gap-1 justify-center">
                {[1,2,3,4,5].map((n) => (
                  <button key={n} onClick={() => setForm(f => ({ ...f, estrellas: n }))}
                    className={`text-xl transition-colors ${n <= form.estrellas ? 'text-[#B8A99A]' : 'text-[#e8e2da]'}`}>★</button>
                ))}
              </div>
              <input type="text" placeholder="Tu nombre"
                value={form.nombre}
                onChange={(e) => setForm(f => ({ ...f, nombre: e.target.value }))}
                className="w-full border border-[#e8e2da] px-4 py-2.5 text-sm text-[#3d3530] bg-white focus:outline-none focus:border-[#B8A99A] transition-colors"/>
              <textarea rows={3} placeholder="Tu experiencia..."
                value={form.texto}
                onChange={(e) => setForm(f => ({ ...f, texto: e.target.value }))}
                className="w-full border border-[#e8e2da] px-4 py-2.5 text-sm text-[#3d3530] bg-white focus:outline-none focus:border-[#B8A99A] resize-none transition-colors"/>
              {error && <p className="text-red-400 text-xs">{error}</p>}
              <button onClick={handleSubmit} disabled={loading}
                className="w-full py-2.5 border border-[#d4cfc9] text-[#8B7355] text-[11px] tracking-[0.15em] uppercase hover:border-[#B8A99A] transition-colors disabled:opacity-50">
                {loading ? 'Enviando...' : 'Enviar reseña'}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// 6. HOMECARE — con KitCarousel
// ─────────────────────────────────────────────

// ✅ NUEVO: Carousel pequeño de kit productos
// 📁 Añadir imágenes: frontend/public/images/kit1.jpg, kit2.jpg, kit3.jpg
const KIT_FOTOS = ['/images/kit1.jpg', '/images/kit2.jpg', '/images/kit3.jpg'];

function KitCarousel() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIdx(i => (i + 1) % KIT_FOTOS.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    // Mobile: max-w-[180px] centrado y pequeño
    // Desktop: ancho completo del contenedor padre (w-full)
    <div className="relative w-full max-w-[180px] mx-auto lg:max-w-full aspect-square overflow-hidden bg-[#e8e2da]">
      {KIT_FOTOS.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={`Kit homecare ${i + 1}`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${i === idx ? 'opacity-100' : 'opacity-0'}`}
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
      ))}

      {/* Placeholder si no hay fotos */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <svg className="w-6 h-6 text-[#c9bfb5] mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/>
        </svg>
        <span className="text-[9px] tracking-widest uppercase text-[#c9bfb5]">kit{idx + 1}.jpg</span>
      </div>

      {/* Indicadores / dots */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
        {KIT_FOTOS.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === idx ? 'bg-white scale-125' : 'bg-white/50'}`}
            aria-label={`Foto ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

const pasos = [
  'Lavar según necesidad con champú adaptado',
  'Mascarilla 1–2 veces por semana (20–30 min)',
  'Acondicionador en días sin mascarilla',
  'Termoprotector siempre antes de secar',
  'Secar con secador en aire tibio o frío',
  'Cepillo con púas suaves, sin frotar',
  'No dormir con el pelo mojado',
  'Evitar agua muy caliente en la ducha',
];

interface HomecareProps { user?: { name?: string } | null; }

export function HomecareSection({ user }: HomecareProps) {
  return (
    <section id="homecare" className="bg-[#FAF8F5] py-20 lg:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-[11px] tracking-[0.25em] uppercase text-[#8B7355] mb-4">Homecare</p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#3d3530] mb-5">Cuidado en casa</h2>
          <p className="text-[#8B7355] text-base md:text-lg max-w-lg mx-auto">
            Prolonga los resultados de tu tratamiento profesional con estos sencillos pasos.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
          {/* Pasos */}
          <div className="flex-1">
            <ul className="flex flex-col divide-y divide-[#ede8e2]">
              {pasos.map((paso, i) => (
                <li key={i} className="flex items-start gap-4 py-4">
                  <span className="flex-shrink-0 w-6 h-6 border border-[#d4cfc9] flex items-center justify-center text-[10px] text-[#B8A99A] mt-0.5 font-light">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-base md:text-lg text-[#3d3530] leading-snug">{paso}</span>
                </li>
              ))}
            </ul>

            {/* ✅ Nota especialista mejorada */}
            <div className="mt-10 border-l-2 border-[#B8A99A] pl-6 py-1">
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#B8A99A] mb-3">Nota de la especialista</p>
              <p className="font-serif text-lg md:text-xl text-[#3d3530] leading-relaxed italic mb-3">
                "El salón hace el 50% del trabajo. El otro 50% lo haces tú en casa."
              </p>
              <p className="text-sm md:text-base text-[#8B7355] leading-relaxed">
                Un buen tratamiento puede durar 3 meses — o convertirse en 5 o 6 con el cuidado correcto.
                El homecare no es opcional: es la segunda parte del protocolo.
                Los primeros tres días son los más críticos: sin lavar, sin gomas, sin clips metálicos.
                Lo que hagas esos días determina cuánto dura el resultado.
              </p>
            </div>
          </div>

          {/* ✅ Producto + KitCarousel pequeño */}
          <div className="w-full lg:w-72 flex-shrink-0">
            {/* Carousel — pequeño en mobile, normal en desktop */}
            <KitCarousel />

            <div className="bg-white p-6 border border-[#e8e2da] mt-0">
              <p className="text-[10px] tracking-widest uppercase text-[#B8A99A] mb-2">Producto destacado</p>
              <h3 className="font-serif text-xl text-[#3d3530] mb-2">Kit personalizado</h3>
              <p className="text-sm text-[#7a6f68] mb-4 leading-relaxed">
                Champú · Acondicionador · Mascarilla · Protector térmico.
                Seleccionado según tu tipo de cabello y tratamiento.
              </p>
              <p className="font-serif text-2xl text-[#3d3530] mb-4">90€</p>
              <a href={WA_KIT} target="_blank" rel="noopener noreferrer"
                className="block text-center py-3 bg-[#B8A99A] text-white text-[11px] tracking-widest uppercase hover:bg-[#9A8B7A] transition-colors">
                Reservar productos
              </a>
              <p className="text-[10px] text-[#a09890] text-center mt-3 leading-relaxed">
                Recogida en salón o envío a domicilio.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// 7. FORMACIONES
// ─────────────────────────────────────────────
export function FormacionesSection() {
  return (
    <section id="formaciones" className="bg-white py-20 lg:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-[11px] tracking-[0.25em] uppercase text-[#8B7355] mb-4">Para Profesionales</p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#3d3530] mb-5">Formaciones</h2>
          <p className="text-[#8B7355] text-base md:text-lg">Aprende técnicas profesionales de tratamiento capilar</p>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-14">
          {['/images/img-9502.jpeg', '/images/img-9505.jpeg', '/images/img-9506.jpeg'].map((src, i) => (
            <div key={i} className="relative aspect-square bg-[#f0ebe4] overflow-hidden">
              <img src={src} alt={`Formación ${i+1}`} className="w-full h-full object-cover relative z-10"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}/>
              <ImgPlaceholder label="Foto"/>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="border border-[#e8e2da] p-7 md:p-9 flex flex-col gap-5">
            <span className="self-start text-[10px] tracking-[0.2em] uppercase text-white bg-[#3d3530] px-3 py-1">Curso destacado</span>
            <div>
              <h3 className="font-serif text-2xl md:text-3xl text-[#3d3530] mb-1">Curso intensivo de keratina</h3>
              <p className="text-sm text-[#8B7355]">Formación completa · 2 días · Práctica con modelos</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {['Diagnóstico tricoscópico','Técnicas de aplicación','Selección de productos','Gestión del calor','Precio y venta','Práctica con modelos'].map(t => (
                <div key={t} className="flex items-start gap-2 text-sm text-[#7a6f68]">
                  <span className="mt-1.5 w-1 h-1 rounded-full bg-[#B8A99A] flex-shrink-0"/>
                  {t}
                </div>
              ))}
            </div>
            <p className="text-sm text-[#7a6f68]">
              <span className="text-[#3d3530]">Incluye:</span> Materiales · Manual PDF · Fotos portfolio · Certificado
            </p>
            <div className="flex items-center justify-between pt-4 border-t border-[#f0ebe4]">
              <span className="font-serif text-3xl text-[#3d3530]">1.400€</span>
              <a href={WA_URL} target="_blank" rel="noopener noreferrer"
                className="px-6 py-3 bg-[#B8A99A] text-white text-[11px] tracking-widest uppercase hover:bg-[#9A8B7A] transition-colors">
                Reservar plaza
              </a>
            </div>
          </div>

          <div className="border border-[#e8e2da] p-7 md:p-9 flex flex-col gap-5">
            <span className="self-start text-[10px] tracking-[0.2em] uppercase text-white bg-[#8B7355] px-3 py-1">Masterclass</span>
            <div>
              <h3 className="font-serif text-2xl md:text-3xl text-[#3d3530] mb-1">Reconstrucción en Frío</h3>
              <p className="text-sm text-[#8B7355]">Especialización · Intensivo · Máx. 6 personas</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {['Técnicas avanzadas','Métodos profesionales','Grupos reducidos','Material incluido','Guía completa','Certificado'].map(t => (
                <div key={t} className="flex items-start gap-2 text-sm text-[#7a6f68]">
                  <span className="mt-1.5 w-1 h-1 rounded-full bg-[#B8A99A] flex-shrink-0"/>
                  {t}
                </div>
              ))}
            </div>
            <p className="text-sm text-[#7a6f68]">
              <span className="text-[#3d3530]">Para quién:</span> Profesionales con experiencia básica · Estilistas que amplían servicios
            </p>
            <div className="flex items-center justify-between pt-4 border-t border-[#f0ebe4]">
              <div>
                <span className="font-serif text-3xl text-[#3d3530]">350€</span>
                <span className="text-xs text-[#8B7355] block">por persona · mín. 3</span>
              </div>
              <a href={WA_URL} target="_blank" rel="noopener noreferrer"
                className="px-6 py-3 border border-[#B8A99A] text-[#B8A99A] text-[11px] tracking-widest uppercase hover:bg-[#B8A99A] hover:text-white transition-all">
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// 8. BEAUTY SCRIPTS
// ─────────────────────────────────────────────
export function BeautyScriptsSection() {
  return (
    <section id="scripts" className="bg-[#FAF8F5] py-20 lg:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
          <div className="w-full sm:w-72 lg:w-80 flex-shrink-0 mx-auto lg:mx-0">
            <div className="relative aspect-[4/5] bg-[#f0ebe4] overflow-hidden">
              <img src="/images/img-9476.jpeg" alt="Beauty Scripts"
                className="w-full h-full object-cover relative z-10"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}/>
              <ImgPlaceholder label="img-9476.jpeg"/>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div>
              <p className="text-[11px] tracking-[0.25em] uppercase text-[#8B7355] mb-4">Scripts</p>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#3d3530] mb-4">Beauty Scripts</h2>
              <p className="text-base md:text-lg text-[#7a6f68] leading-relaxed">
                Scripts listos para usar que aumentan tus ventas.
                Diálogos profesionales para maestros de belleza y especialistas capilares.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              {[
                ['Ahorra tiempo', 'No pienses qué decir — usa scripts probados y listos.'],
                ['Reduce estrés', 'Responde con confianza a cualquier pregunta.'],
                ['Aumenta conversiones', 'Scripts optimizados para cerrar más ventas.'],
              ].map(([t, d]) => (
                <div key={t} className="flex gap-4">
                  <div className="w-5 h-5 border border-[#B8A99A] flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-2.5 h-2.5 text-[#B8A99A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="m4.5 12.75 6 6 9-13.5"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-base md:text-lg font-medium text-[#3d3530]">{t}</p>
                    <p className="text-sm md:text-base text-[#8B7355]">{d}</p>
                  </div>
                </div>
              ))}
            </div>
            <a href="https://wa.me/34641261559?text=Hola!%20Me%20interesan%20los%20Beauty%20Scripts"
              target="_blank" rel="noopener noreferrer"
              className="self-start px-8 py-3 bg-[#B8A99A] text-white text-[11px] tracking-[0.2em] uppercase hover:bg-[#9A8B7A] transition-colors">
              Quiero los Scripts
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
