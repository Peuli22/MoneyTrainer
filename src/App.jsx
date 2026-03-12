import { useEffect, useState } from 'react'

function App() {
  const [cenaNakupu, setCenaNakupu] = useState(0);
  const [platbaZakaznika, setPlatbaZakaznika] = useState(0);

  const [vydanePenize, setVydanePenize] = useState([]);

  const [streak, setStreak] = useState(0);
  const [nejvyssiStreak, setNejvyssiStreak] = useState(0);

  const [dohazovaciMod, setDohazovaciMod] = useState(false);

  const dostupneBankovkyAMince = [2000, 1000, 500, 200, 100, 50, 20, 10, 5, 2, 1];

  const vygenerovatZakaznika = (isModZapnuty = dohazovaciMod) => {
    let novaCena;

    do {
      novaCena = Math.floor(Math.random() * 950) + 50; 
    } while (Math.abs(novaCena - cenaNakupu) < 50);

    setCenaNakupu(novaCena);
    
    const moznostiPlatby = [];
    
    const dalsiPadesatka = Math.ceil(novaCena / 50) * 50;
    if (dalsiPadesatka > novaCena) moznostiPlatby.push(dalsiPadesatka);
    
    const dalsiStovka = Math.ceil(novaCena / 100) * 100;
    if (dalsiStovka > novaCena && dalsiStovka !== dalsiPadesatka) moznostiPlatby.push(dalsiStovka);

    const bankovky = [200, 500, 1000, 2000];
    const vhodneBankovky = bankovky.filter(b => b > novaCena);
    moznostiPlatby.push(...vhodneBankovky);

    let nahodnaPlatba = moznostiPlatby[Math.floor(Math.random() * moznostiPlatby.length)]; 
    
    const zbytekStovky = novaCena % 100; 
    const zbytekDesitky = novaCena % 10; 

    const chceDohazovat = isModZapnuty || Math.random() > 0.6; 

    // Musí mít vůbec co dohazovat (cena nesmí končit na 00)
    if (chceDohazovat && (zbytekStovky > 0 || zbytekDesitky > 0)) {
      
      if (isModZapnuty || nahodnaPlatba - novaCena <= 500) {
        
        if (zbytekStovky > 0 && zbytekDesitky > 0) {
          nahodnaPlatba += (Math.random() > 0.5) ? zbytekStovky : zbytekDesitky;
        } else if (zbytekStovky > 0) {
          nahodnaPlatba += zbytekStovky; 
        } else if (zbytekDesitky > 0) {
          nahodnaPlatba += zbytekDesitky; 
        }
      }
    }
    
    setPlatbaZakaznika(nahodnaPlatba);
    setVydanePenize([]); 
  }

  useEffect(() => {
    vygenerovatZakaznika();
  }, []);

  const pridejPeniz = (hodnota) => {
    setVydanePenize([...vydanePenize, hodnota]);
  }

  const zrusitVydane = () => {
    setVydanePenize([]);
  }

  const odeberPeniz = (indexKOdebrani) => {
    setVydanePenize((predchozi) => predchozi.filter((_, index) => index !== indexKOdebrani));
  }

  const toggleMod = () => {
    const novyStav = !dohazovaciMod;
    setDohazovaciMod(novyStav);
    setStreak(0);
    vygenerovatZakaznika(novyStav); 
  };

  const celkemVydano = vydanePenize.reduce((soucet, hodnota) => soucet + hodnota, 0);

  const zkontrolovat = () => {
    const spravneVraceno = platbaZakaznika - cenaNakupu;

    if (celkemVydano === spravneVraceno) {
      alert('Správně! Zákazník dostal přesně zpět.');
      setStreak(streak + 1);
      if (streak + 1 > nejvyssiStreak) {
        setNejvyssiStreak(streak + 1);
      }
      vygenerovatZakaznika();
    } else {
      alert(`Špatně! Zákazník měl dostat ${spravneVraceno} Kč, ale dostal ${celkemVydano} Kč.`);
      setStreak(0);
      zrusitVydane();
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center py-10 font-sans px-4">

      {/*Streak */}
      <div className="w-full max-w-2xl flex flex-col items-center mb-8">
        <h1 className="text-4xl font-extrabold text-slate-800 mb-4">Pokladní Trenažér</h1>
        <div className="flex justify-between items-end w-full">
          {/* Tlačítko pro Trénink dohazování */}
          <button
            onClick={toggleMod}
            className={`text-sm font-bold py-2 px-4 rounded-full transition-colors duration-300 max-w-xs ${
              dohazovaciMod
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-200 text-slate-500 hover:bg-slate-300'
            }`}
          >
            {dohazovaciMod ? '🧠 Trénink dohazování: ZAPNUTO' : 'Trénink dohazování: VYPNUTO'}
          </button>
          <div className="text-right">
            <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">Tvůj Streak</p>
            <p className="text-3xl font-black text-orange-500 flex items-center gap-1 justify-end">
              {streak} <span className="text-2xl">🔥</span>
            </p>
            {nejvyssiStreak > 0 && (
              <p className="text-xs text-slate-400 mt-1">Rekord: {nejvyssiStreak}</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Informace o nákupu */}
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 mb-6 relative overflow-hidden">
        {/* Pokud zákazník dal drobné (platba nekončí nulou), ukážeme malou nápovědu */}
        {platbaZakaznika % 100 !== 0 && (
          <div className="absolute top-0 right-0 bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-bl-lg">
            Zákazník přihodil drobné!
          </div>
        )}

        <div className="flex justify-between items-center text-xl mb-4">
          <span className="text-slate-500 font-medium">Cena nákupu:</span>
          <span className="font-bold text-red-500">{cenaNakupu} Kč</span>
        </div>
        <div className="flex justify-between items-center text-xl">
          <span className="text-slate-500 font-medium">Zákazník platí:</span>
          <span className="font-bold text-green-600">{platbaZakaznika} Kč</span>
        </div>
      </div>

      {/* Kasa - Výběr bankovek a mincí */}
      <div className="w-full max-w-2xl bg-slate-800 rounded-2xl shadow-xl p-6 mb-6">
        <h2 className="text-white text-lg font-bold mb-4">Kasa (Klikni pro výběr)</h2>
        <div className="flex flex-wrap gap-4 justify-center items-center">
          {dostupneBankovkyAMince.map((hodnota) => (
            <button
              key={hodnota}
              onClick={() => pridejPeniz(hodnota)}
              className="hover:scale-110 transition-transform duration-200 focus:outline-none"
            >
              <img 
                src={`/penize/${hodnota}.png`} 
                alt={`${hodnota} Kč`} 
                className={`object-contain drop-shadow-lg ${
                  hodnota >= 100 ? "w-32 rounded-sm object-contain" : "w-16 h-16 rounded-full"
                }`} 
              />
            </button>
          ))}
        </div>
      </div>

      {/* Tác - Co uživatel vrací */}
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6 border-4 border-dashed border-slate-300">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-slate-500 text-lg font-bold">Připraveno k vrácení:</h2>
          <span className="text-2xl font-black text-blue-600">{celkemVydano} Kč</span>
        </div>
        
        <div className="flex flex-wrap gap-2 min-h-[80px] p-4 bg-slate-50 rounded-lg mb-6 items-center border border-slate-200">
          {vydanePenize.length === 0 && <span className="text-slate-400 italic">Zatím jsi nevybral žádné peníze...</span>}
          {vydanePenize.map((hodnota, index) => (
             <img 
               key={index} 
               onClick={() => odeberPeniz(index)}
               src={`/penize/${hodnota}.png`} 
               alt={`${hodnota} Kč`} 
               className={`object-contain drop-shadow-sm hover:-translate-y-1 transition-transform cursor-pointer ${
                 hodnota >= 100 ? "w-20 rounded-sm" : "w-12 h-12 rounded-full"
               }`}
             />
          ))}
        </div>

        <div className="flex gap-4">
          <button 
            onClick={zrusitVydane}
            className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 font-bold py-3 px-4 rounded-xl transition-colors"
          >
            Smazat výběr
          </button>
          <button 
            onClick={zkontrolovat}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-xl transition-colors text-xl shadow-lg"
          >
            Vrátit zákazníkovi
          </button>
        </div>
        <div className="mt-6">
          <button 
            onClick={() => vygenerovatZakaznika()}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-colors text-lg shadow-md"
          >
            Další zákazník
          </button>
        </div>
      </div>

      <footer className="mt-auto py-8 border-t border-slate-200 w-full max-w-2xl text-center">
        <p className="text-slate-500 text-sm">
          © {new Date().getFullYear()} Pokladní Trenažér • Vytvořil{" "}
          <a 
            href="https://github.com/peuli22" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors"
          >
            Petr Dudek
          </a>
        </p>
      </footer>

    </div>
  );
}

export default App
