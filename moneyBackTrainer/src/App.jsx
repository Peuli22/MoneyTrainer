import { useEffect, useState } from 'react'

function App() {
  const [cenaNakupu, setCenaNakupu] = useState(0);
  const [platbaZakaznika, setPlatbaZakaznika] = useState(0);

  const [vydanePenize, setVydanePenize] = useState([]);

  const dostupneBankovkyAMince = [2000, 1000, 500, 200, 100, 50, 20, 10, 5, 2, 1];

  const vygenerovatZakaznika = () => {
    const novaCena = Math.floor(Math.random() * 950) + 50; // Generuje náhodnou cenu mezi 50 a 1000
    setCenaNakupu(novaCena);
    
    const bankovky = [100, 200, 500, 1000];

    const vhodneBankovky = bankovky.filter(bankovka => bankovka >= novaCena); // Filtruje bankovky, které jsou větší nebo rovny ceně nákupu
    const nahodnaBankovka = vhodneBankovky[Math.floor(Math.random() * vhodneBankovky.length)]; // Náhodně vybere jednu z vhodných bankovek
    setPlatbaZakaznika(nahodnaBankovka);
    setVydanePenize([]); // Resetuje vydané peníze pro nového zákazníka
  }

  // useEffect zajistí, že se funkce spustí hned při prvním načtení stránky
  useEffect(() => {
    vygenerovatZakaznika();
  }, []);

  const pridejPeniz = (hodnota) => {
    setVydanePenize([...vydanePenize, hodnota]);
  }

  const zrusitVydane = () => {
    setVydanePenize([]);
  }

  const celkemVydano = vydanePenize.reduce((soucet, hodnota) => soucet + hodnota, 0);

  const zkontrolovat = () => {
    const spravneVraceno = platbaZakaznika - cenaNakupu;
    if (celkemVydano === spravneVraceno) {
      alert('Správně! Zákazník dostal přesně zpět.');
      vygenerovatZakaznika();
    } else {
      alert(`Špatně! Zákazník měl dostat ${spravneVraceno} Kč, ale dostal ${celkemVydano} Kč.`);
      zrusitVydane();
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center py-10 font-sans px-4">
      <h1 className="text-4xl font-extrabold text-slate-800 mb-8">Pokladní Trenažér</h1>
      
      {/* Informace o nákupu */}
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 mb-6">
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
              // Tlačítko už nemá šedé pozadí, jen se při najetí myší trochu zvětší
              className="hover:scale-110 transition-transform duration-200 focus:outline-none"
            >
              {/* Tady voláme obrázek podle jeho hodnoty */}
              <img 
                src={`/penize/${hodnota}.jpg`} 
                alt={`${hodnota} Kč`} 
                // Zde použijeme zpětné uvozovky (backticks) pro vložení podmínky
                className={`object-contain drop-shadow-lg ${
                  hodnota >= 100 
                    ? "w-36 rounded-sm" // Bankovky budou širší (144px)
                    : "w-16 h-16 rounded-full" // Mince budou menší a zaoblí se jim bílé rohy!
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
               src={`/penize/${hodnota}.jpg`} 
               alt={`${hodnota} Kč`} 
               className={`object-contain drop-shadow-sm hover:-translate-y-1 transition-transform ${
                 hodnota >= 100 
                   ? "w-24 rounded-sm" // Bankovky na tácu
                   : "w-15 h-15 rounded-full" // Mince na tácu
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
            onClick={vygenerovatZakaznika}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-colors text-lg shadow-md"
          >
            Další zákazník
          </button>
        </div>
      </div>

    </div>
  );
}

export default App
