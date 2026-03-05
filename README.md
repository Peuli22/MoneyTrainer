# Pokladní Trenažér

Webová aplikace pro trénink počítání peněz na pokladně. Generuje náhodné částky nákupů a plateb, pomáhá zrychlit práci s hotovostí.

## Live Demo

**[https://money-trainer-two.vercel.app/](https://money-trainer-two.vercel.app/)**

![Pokladní Trenažér Screenshot](public/screenshots/app-preview.png)

## Funkce

- **Simulace nákupů** - Náhodné částky s realistickými platbami
- **Hard mód** - Zákazník "přihazuje" drobné k velké bankovce pro kulatou částku (např. nákup 246 Kč → platba 1046 Kč → vrácení 800 Kč)
- **Streak systém** - Počítání správných odpovědí v řadě, sledování osobního rekordu
- **Interaktivní UI** - Vizuální reprezentace českých mincí a bankovek, responzivní design

## Tech Stack

- [React](https://react.dev/) - UI knihovna
- [Vite](https://vitejs.dev/) - Build tool
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- JavaScript (ES6+)

## Instalace

```bash
git clone https://github.com/peuli22/moneytrainer.git
npm install
npm run dev
```

Aplikace běží na `http://localhost:5173/`