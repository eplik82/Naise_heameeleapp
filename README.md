# Heameel – naise heameeleapp

Mobiiläpp (Android ja iOS), mis aitab mehel oma kaaslast rõõmsamaks teha:
annab teavitustega soovitusi (näiteks osta lilli või minna teatrisse), aitab
üllatusi planeerida, tuletab neid meelde ja lisab need telefoni kalendrisse.

Nõuded on kirjas failis [LAHTEULESANNE.md](LAHTEULESANNE.md).

## Mida äpp teeb

| Lähteülesande nõue | Kus äpis |
|---|---|
| Soovitused erinevate tegevuste kohta | **Täna** – 76 soovitust üheksas kategoorias (lilled, kultuur, väljaskäik, kodus koos, kodutööd, kingitus, tähelepanu, heaolu, seiklus). Hiljutised soovitused ei kordu ja kaks järjestikust soovitust on eri kategooriast. |
| Soovitused aastaaja järgi | Igal soovitusel võivad olla kuud, millal see sobib: talvel ei tule piknikku ega ujumist, suvel lumelükkamist ega uisutamist; detsembris tulevad jõuluturg ja piparkoogid, juunis jaanituli. Ette ajastatud teavitused arvestavad oma kuupäeva aastaaega. |
| Kodused tegevused | Kategooria **Kodutööd**: aita pesu kokku panna, aita koristada, pese nõud, vaheta voodipesu, käi poes jne. |
| Teavitus soovitusest | Soovitused tulevad telefoni teavitustena. Teavitust vajutades avaneb see soovitus äpis. |
| Seadetes saab määrata, kui tihti | **Seaded** – iga päev, ülepäeviti, kaks korda nädalas, kord nädalas või kord kahe nädala jooksul, ning kellaaeg. Valida saab ka kategooriad. |
| Meeldetuletused ja üllatuste planeerimine | **Plaanid** – soovituse või oma idee saab planeerida kindlaks ajaks. Meeldetuletus tuleb valitud päevade arv enne (vaikimisi 1 päev enne kell 9.00). |
| Kalendrikirjed | Planeerides lisatakse kirje telefoni kalendrisse koos meeldetuletusega 1 h enne. Plaani kustutades kustub ka kalendrikirje. |

## Käivitamine

Vaja on [Node.js](https://nodejs.org/) 20+ ja telefoni äppi **Expo Go**
(Google Play / App Store).

```bash
npm install
npx expo start
```

Skanni terminalis näidatud QR-kood telefoniga (Androidis Expo Go äpist, iPhone'is
kaameraga). Telefon ja arvuti peavad olema samas WiFi-võrgus; kui ei ole, kasuta
`npx expo start --tunnel`.

Esimesel käivitamisel küsib äpp luba teavitusteks ja planeerimisel kalendri
kasutamiseks. Teavituse proovimiseks vajuta **Seaded → Saada proovisoovitus**.

### Paigaldamine Android-telefoni (APK)

Iga muudatus `main`-harus ehitab GitHub Actionsis uue paigaldusfaili ja paneb selle
release'i **[uusim](https://github.com/eplik82/Naise_heameeleapp/releases/tag/uusim)** alla.

1. Ava see link telefonis ja laadi alla `heameel.apk`.
2. Ava allalaaditud fail. Kui telefon küsib, luba brauseril (või failihalduril)
   tundmatutest allikatest äppe paigaldada.
3. Uue versiooni saab paigaldada vana peale, andmed jäävad alles.

APK on allkirjastatud Expo malli arendusvõtmega – telefoni panemiseks sobib, Google
Play poodi panemiseks on vaja oma võtit. Ehitus on tehtud 64-bitistele (arm64)
telefonidele, mis on kõik viimase ~8 aasta Android-telefonid.

## Arendus

```bash
npm run typecheck   # TypeScripti kontroll
npm test            # soovituste ja ajastamise loogika testid
```

| Kaust/fail | Sisu |
|---|---|
| `src/app/` | Ekraanid (Expo Router): `index.tsx` Täna, `plaanid.tsx`, `seaded.tsx` |
| `src/data/suggestions.ts` | Soovituste kataloog – uued soovitused lisa siia |
| `src/lib/logic.ts` | Soovituse valik ja teavituste aegade arvutus (testitud) |
| `src/lib/notifications.ts` | Kohalikud teavitused |
| `src/lib/calendar.ts` | Kalendrikirjed |
| `src/lib/store.tsx` | Äpi olek ja salvestus telefoni |

Kuna kohalikud teavitused peavad olema ette ajastatud, ajastab äpp korraga
järgmised 20 soovitust. Iga kord, kui äpp avatakse või seadeid muudetakse,
ajastatakse need uuesti.
