import { StatBox, SearchBar } from "@/components/molecules/index";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#0F172A] via-[#1E1B4B] to-[#0F172A] py-20 lg:py-32 shadow-2xl z-0">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_60%_50%,rgba(108,99,255,0.15)_0%,transparent_70%)] -z-10" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(108,99,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(108,99,255,0.06)_1px,transparent_1px)] bg-[size:60px_60px] -z-10" />
      
      <div className="container relative z-10 px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
          
          <div className="fade-up inline-flex items-center rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm font-semibold tracking-wide text-indigo-200">
            <span className="mr-2 flex h-2 w-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(108,99,255,0.8)]" />
            12,000+ белсенді вакансия
          </div>
          
          <h1 className="fade-up-2 text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-[4rem] leading-[1.15]">
            Арман жұмысыңды<br />
            <span className="bg-gradient-to-br from-primary via-indigo-400 to-purple-400 bg-clip-text text-transparent drop-shadow-sm">
              ЖұмысТап
            </span>
            -тан тап
          </h1>
          
          <p className="fade-up-3 text-lg text-white/70 max-w-2xl mx-auto font-medium">
            Қазақстандағы ең ірі жұмыс табу платформасы. Мыңдаған компаниялар,<br className="hidden md:block" />
            жүз мыңдаған маман — барлығы бір жерде.
          </p>
          
          <div className="w-full mt-4">
            <SearchBar />
          </div>
          
          <div className="fade-up-3 w-full grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-white/10">
            <StatBox target={12000} suffix="+" label="Вакансия" />
            <StatBox target={3500} suffix="+" label="Компания" />
            <StatBox target={85000} suffix="+" label="Маман" />
            <StatBox target={94} suffix="%" label="Сәтті орналасу" />
          </div>

        </div>
      </div>
    </section>
  );
}
