import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../hooks/useAppHooks';

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

  const WA_URL = 'https://wa.me/34641261559?text=Hola!%20Quiero%20reservar%20una%20cita';
  const activeItem = lengths.find((l) => l.id === active);

  const getPrice = (l: LengthPrice) =>
    servicio === 'keratina' ? l.keratina : servicio === 'total' ? l.total : l.reconstruccion;
  const getLabel = () =>
    servicio === 'keratina' ? 'Keratina / Botox' : servicio === 'total' ? 'Reconstrucción Total' : 'Reconstrucción';

  return (
    <section id="precios" className="bg-[#F0EBE4] py-6 lg:py-9">
        <div className="max-w-[1400px] mx-auto px-8">
        {/* Header */}
        <div className="text-center mb-4 lg:mb-5">
          <p className="text-[12px] tracking-[0.3em] uppercase text-[#8B7355] mb-2 font-light">Precios</p>
          <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl text-[#3d3530] mb-2 font-light tracking-wide">
            Tabla de Precios
          </h2>
          <p className="text-[#8B7355] text-sm md:text-base font-light max-w-2xl mx-auto">
            Selecciona el servicio y toca una longitud para ver el precio
          </p>
        </div>

        {/* Service Switcher */}
        <div className="flex justify-center mb-4">
          <div className="inline-flex border border-[#e8e2da] bg-[#FAF8F5]">
            {([
              ['keratina', 'Keratina / Botox'],
              ['reconstruccion', 'Reconstrucción'],
              ['total', 'Total (frío+caliente)'],
            ] as const).map(([key, label]) => (
              <button
                key={key}
                onClick={() => { setServicio(key); setActive(null); }}
                className={`px-4 md:px-7 py-2.5 text-[11px] md:text-[12px] tracking-[0.12em] uppercase transition-all font-light ${
                  servicio === key
                    ? 'bg-[#3d3530] text-white'
                    : 'text-[#8B7355] hover:bg-[#f0ebe4]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Layout: Image + List */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-0 items-start">
          {/* Image with interactive markers — dominates the section */}
          <div className="relative w-full lg:w-[34%] xl:w-[30%] flex-shrink-0">
            <div className="relative aspect-[3/4] bg-[#f0ebe4] overflow-hidden">
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
                    className="absolute left-0 right-0 z-20 group cursor-pointer"
                    style={{ top: l.top }}
                  >
                    {/* Horizontal line */}
                    <div className={`h-px transition-all duration-300 ${isActive ? 'bg-[#B8A99A]' : 'bg-white/40 group-hover:bg-white/70'}`} />
                    {/* Dot on the right side */}
                    <div
                      className={`absolute right-[8%] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                        isActive
                          ? 'bg-[#B8A99A] border-white scale-150 shadow-lg'
                          : 'bg-white/80 border-[#B8A99A]/60 group-hover:bg-[#B8A99A] group-hover:border-white group-hover:scale-125'
                      }`}
                    />
                    {/* Price label that appears on hover/active */}
                    <div
                      className={`absolute right-[14%] top-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-sm shadow-md px-4 py-2 transition-all duration-300 whitespace-nowrap ${
                        isActive ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0'
                      }`}
                    >
                      <span className="text-[10px] tracking-[0.15em] uppercase text-[#B8A99A] block font-light">{l.label}</span>
                      <span className="font-serif text-xl text-[#3d3530]">
                        {getPrice(l)}
                      </span>
                    </div>
                  </button>
                );
              })}

              {/* Bottom tooltip for selected length */}
              {activeItem && (
                <div className="absolute bottom-0 left-0 right-0 z-30 bg-[#3d3530]/95 backdrop-blur-sm px-5 py-3.5 animate-fade-in-up">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[11px] tracking-[0.2em] uppercase text-[#B8A99A] mb-0.5 font-light">{activeItem.label}</p>
                      <p className="text-xs text-white/60 font-light capitalize">{getLabel()}</p>
                    </div>
                    <p className="font-serif text-3xl text-white font-light">
                      {getPrice(activeItem)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Price list + extras sidebar */}
          <div className="flex-1 lg:pl-7 xl:pl-9">
            <p className="text-[11px] tracking-[0.2em] uppercase text-[#B8A99A] mb-4 font-light">
              {getLabel()} — Por longitud
            </p>

            <div className="flex flex-col divide-y divide-[#f0ebe4]">
              {lengths.map((l) => (
                <button
                  key={l.id}
                  onClick={() => setActive(active === l.id ? null : l.id)}
                  className={`flex justify-between items-center py-1.5 px-1 text-left transition-all ${
                    active === l.id ? 'bg-[#B8A99A]/8' : 'hover:bg-[#FAF8F5]'
                  }`}
                >
                  <div>
                    <span className="text-sm md:text-base text-[#3d3530] font-light tracking-wide">{l.label}</span>
                  </div>
                  <span
                    className={`font-serif text-2xl md:text-3xl transition-all ${
                      active === l.id ? 'text-[#B8A99A]' : 'text-[#3d3530]'
                    }`}
                  >
                    {getPrice(l)}
                  </span>
                </button>
              ))}
            </div>

            {/* Extras */}
            <div className="mt-4 space-y-1.5">
              <div className="bg-[#FAF8F5] px-5 py-2.5 text-sm text-[#7a6f68]">
                <span className="text-[#3d3530] font-medium">Abundante:</span>
                <span className="font-light"> +20€ (7cm) · +40€ (9cm) · +60€ (10+cm)</span>
              </div>
              <div className="bg-[#FAF8F5] px-5 py-2.5 text-sm text-[#7a6f68]">
                <span className="text-[#3d3530] font-medium">Extras:</span>
                <span className="font-light"> Peeling +65€ · Nano Gold +50€ · Corte +20€</span>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-6">
              {user ? (
                <button
                  onClick={() => navigate('/booking')}
                  className="px-12 py-4.5 bg-[#B8A99A] text-white text-[13px] tracking-[0.2em] uppercase hover:bg-[#9A8B7A] transition-colors font-light"
                >
                  Reservar cita
                </button>
              ) : (
                <a
                  href={WA_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-12 py-4.5 bg-[#B8A99A] text-white text-[13px] tracking-[0.2em] uppercase hover:bg-[#9A8B7A] transition-colors font-light"
                >
                  Reservar cita
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
