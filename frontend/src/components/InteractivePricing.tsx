import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../hooks/useAppHooks';
import { useLanguage } from '../i18n/LanguageContext';

interface LengthPrice {
  id: string;
  label: string;
  desc: string;
  keratina: string;
  reconstruccion: string;
  total: string;
  top: string;
}

const lengths: LengthPrice[] = [
  { id: '20-30', label: '20–30 cm', desc: 'Debajo de la oreja', keratina: '180€', reconstruccion: '110€', total: '240€', top: '32%' },
  { id: '30-40', label: '30–40 cm', desc: 'Hombros', keratina: '200€', reconstruccion: '120€', total: '260€', top: '42%' },
  { id: '40-50', label: '40–50 cm', desc: 'Mitad espalda', keratina: '220€', reconstruccion: '140€', total: '280€', top: '52%' },
  { id: '50-60', label: '50–60 cm', desc: 'Cintura', keratina: '240€', reconstruccion: '160€', total: '300€', top: '63%' },
  { id: '60-70', label: '60–70 cm', desc: 'Bajo cintura', keratina: '260€', reconstruccion: '200€', total: '320€', top: '73%' },
  { id: '70-80', label: '70–80 cm', desc: 'Cadera', keratina: '280€', reconstruccion: '200€', total: '340€', top: '82%' },
];

type Servicio = 'keratina' | 'reconstruccion' | 'total';

export default function InteractivePricing() {
  const [servicio, setServicio] = useState<Servicio>('reconstruccion');
  const [active, setActive] = useState<string | null>(null);
  const user = useAppSelector((s) => s.auth.user);
  const navigate = useNavigate();
  const { tr } = useLanguage();

  const WA_URL = 'https://wa.me/34641261559?text=Hola!%20Quiero%20reservar%20una%20cita';
  const activeItem = lengths.find((l) => l.id === active);

  const getPrice = (l: LengthPrice) =>
    servicio === 'keratina' ? l.keratina : servicio === 'total' ? l.total : l.reconstruccion;
  const getLabel = () =>
    servicio === 'keratina' ? tr.pricing.keratina : servicio === 'total' ? tr.pricing.total : tr.pricing.reconstruccion;

  return (
    <section id="precios" className="bg-[#F3F2EE] py-12 lg:py-18">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-10">

        {/* Header */}
        <div className="text-center mb-8 lg:mb-10">
          <p className="overline-accent text-[12px] tracking-[0.3em] uppercase text-[#8B7355] mb-3 font-medium">{tr.pricing.overline}</p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#3d3530] mb-3 font-normal tracking-wide">
            {tr.pricing.title}
          </h2>
          <p className="text-[#8B7355] text-sm md:text-base font-normal max-w-xl mx-auto leading-relaxed">
            {tr.pricing.subtitle}
          </p>
        </div>

        {/* Service Switcher */}
        <div className="flex justify-center mb-8 lg:mb-10">
          <div className="inline-flex border border-[#e8e2da] bg-white shadow-sm">
            {([
              ['keratina', tr.pricing.keratina],
              ['reconstruccion', tr.pricing.reconstruccion],
              ['total', tr.pricing.total],
            ] as [Servicio, string][]).map(([key, label]) => (
              <button
                key={key}
                onClick={() => { setServicio(key); setActive(null); }}
                className={`px-5 md:px-8 py-3 text-[11px] md:text-[12px] tracking-[0.14em] uppercase transition-all font-normal ${
                  servicio === key
                    ? 'bg-[#8B7355] text-white'
                    : 'text-[#8B7355] hover:bg-[#f0ebe4]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Layout */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-14 items-start">

          {/* ── Image with interactive markers ── */}
          <div className="w-full lg:w-[42%] flex-shrink-0">
            <div className="relative aspect-[3/4] bg-[#f0ebe4] overflow-hidden shadow-sm">
              <img
                src="/images/precios.jpeg"
                alt="Guía de longitud y precios"
                className="w-full h-full object-cover object-top relative z-10"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
              <div className="absolute inset-0 flex items-center justify-center bg-[#f0ebe4] z-0">
                <div className="text-center">
                  <svg className="w-10 h-10 text-[#c9bfb5] mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="m21 15-5-5L5 21" />
                  </svg>
                  <span className="text-xs tracking-widest uppercase text-[#c9bfb5]">precios.jpeg</span>
                </div>
              </div>

              {/* Interactive horizontal lines + dots */}
              {lengths.map((l) => {
                const isActive = active === l.id;
                return (
                  <button
                    key={l.id}
                    onClick={() => setActive(isActive ? null : l.id)}
                    className="absolute left-0 right-0 z-20 group cursor-pointer py-3 -translate-y-1/2"
                    style={{ top: l.top }}
                  >
                    {/* Horizontal line — gold when active */}
                    <div className={`transition-all duration-300 ${
                      isActive
                        ? 'h-[2px] bg-[#C9A96E] shadow-[0_0_6px_rgba(201,169,110,0.7)]'
                        : 'h-px bg-white/40 group-hover:bg-white/80 group-hover:h-[1.5px]'
                    }`} />
                    {/* Dot */}
                    <div className={`absolute right-[8%] top-1/2 -translate-y-1/2 rounded-full border-2 transition-all duration-300 ${
                      isActive
                        ? 'w-5 h-5 bg-[#C9A96E] border-white scale-125 shadow-[0_0_8px_rgba(201,169,110,0.6)]'
                        : 'w-3.5 h-3.5 bg-white/80 border-white/60 group-hover:w-4 group-hover:h-4 group-hover:bg-[#C9A96E] group-hover:border-white'
                    }`} />
                    {/* Floating price tag */}
                    <div className={`absolute right-[15%] top-1/2 -translate-y-1/2 bg-white shadow-md px-3.5 py-1.5 transition-all duration-300 whitespace-nowrap ${
                      isActive ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0'
                    }`}>
                      <span className="text-[9px] tracking-[0.15em] uppercase text-[#B8A99A] block font-light">{l.label}</span>
                      <span className="font-serif text-base text-[#3d3530] font-normal leading-tight">{getPrice(l)}</span>
                    </div>
                  </button>
                );
              })}

              {/* Bottom info strip — light, minimal */}
              {activeItem && (
                <div className="absolute bottom-0 left-0 right-0 z-30 bg-white/90 backdrop-blur-sm border-t border-[#e8e2da] px-5 py-3 animate-fade-in-up">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[11px] tracking-[0.18em] uppercase text-[#8B7355] font-medium">{activeItem.label}</p>
                      <p className="text-[10px] text-[#a09890] font-light mt-0.5">{activeItem.desc} · {getLabel()}</p>
                    </div>
                    <p className="font-serif text-2xl text-[#3d3530]">{getPrice(activeItem)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Price list ── */}
          <div className="flex-1 pt-0 lg:pt-1">
            <p className="text-[11px] tracking-[0.22em] uppercase text-[#B8A99A] mb-4 font-light">
              {getLabel()} — {tr.pricing.porLongitud}
            </p>

            <div className="flex flex-col">
              {lengths.map((l) => {
                const isActive = active === l.id;
                return (
                  <button
                    key={l.id}
                    onClick={() => setActive(isActive ? null : l.id)}
                    className={`flex items-center justify-between py-3 px-4 text-left transition-all border-b border-[#e8e2da] ${
                      isActive ? 'bg-[#8B7355]/8' : 'hover:bg-white/60'
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className={`text-sm tracking-wide transition-all ${isActive ? 'text-[#3d3530] font-semibold' : 'text-[#6a5f58] font-light'}`}>
                        {l.label}
                      </span>
                      <span className={`text-[11px] transition-all ${isActive ? 'text-[#8B7355]' : 'text-[#a09890]'} font-light`}>
                        {l.desc}
                      </span>
                    </div>
                    <span className={`font-serif transition-all duration-200 ${
                      isActive
                        ? 'text-3xl md:text-4xl text-[#3d3530] font-normal'
                        : 'text-xl md:text-2xl text-[#3d3530]/60'
                    }`}>
                      {getPrice(l)}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Extras */}
            <div className="mt-5 space-y-2">
              <div className="bg-white/70 border border-[#e8e2da] px-5 py-3 text-sm text-[#7a6f68]">
                <span className="text-[#3d3530] font-medium">{tr.pricing.abundante}:</span>
                <span className="font-light"> +20€ (7cm) · +40€ (9cm) · +60€ (10+cm)</span>
              </div>
              {servicio === 'keratina' ? (
                <div className="bg-white/70 border border-[#e8e2da] px-5 py-3 text-sm text-[#7a6f68]">
                  <span className="text-[#3d3530] font-medium">{tr.pricing.extras}:</span>
                  <span className="font-light"> Peeling anticaspa +65€ · Nano Gold +50€ · Corte puntas +20€</span>
                </div>
              ) : (
                <>
                  <div className="bg-white/70 border border-[#e8e2da] px-5 py-3.5 text-sm text-[#7a6f68]">
                    <p className="text-[#3d3530] font-medium mb-1">
                      {tr.pricing.nanoGold} <span className="font-normal text-[#B8A99A] ml-1">+50€</span>
                    </p>
                    <p className="font-light text-xs mb-2 text-[#9a8f88]">{tr.pricing.nanoGoldDesc}</p>
                    <ul className="text-xs space-y-1">
                      {tr.pricing.nanoGoldBen.map((b, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="mt-1.5 w-1 h-1 rounded-full bg-[#B8A99A] flex-shrink-0" />
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-white/70 border border-[#e8e2da] px-5 py-3 text-sm text-[#7a6f68]">
                    <span className="text-[#3d3530] font-medium">{tr.pricing.otros}:</span>
                    <span className="font-light"> Peeling anticaspa +65€ · Corte puntas +20€</span>
                  </div>
                </>
              )}
            </div>

            {/* CTA */}
            <div className="mt-7">
              {user ? (
                <button
                  onClick={() => navigate('/booking')}
                  className="w-full sm:w-auto px-12 py-4 bg-[#8B7355] text-white text-[12px] tracking-[0.2em] uppercase hover:bg-[#7A6348] transition-colors font-medium"
                >
                  {tr.pricing.reservarCita}
                </button>
              ) : (
                <a
                  href={WA_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block w-full sm:w-auto text-center px-12 py-4 bg-[#8B7355] text-white text-[12px] tracking-[0.2em] uppercase hover:bg-[#7A6348] transition-colors font-medium"
                >
                  {tr.pricing.reservarCita}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
