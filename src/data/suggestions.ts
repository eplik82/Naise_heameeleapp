export type Category =
  | 'lilled'
  | 'kultuur'
  | 'valjaskaik'
  | 'kodu'
  | 'kodutood'
  | 'kingitus'
  | 'tahelepanu'
  | 'heaolu'
  | 'seiklus';

export const CATEGORY_LABELS: Record<Category, string> = {
  lilled: '💐 Lilled',
  kultuur: '🎭 Kultuur',
  valjaskaik: '🍽️ Väljaskäik',
  kodu: '🏠 Kodus koos',
  kodutood: '🧺 Kodutööd',
  kingitus: '🎁 Kingitus',
  tahelepanu: '💌 Tähelepanu',
  heaolu: '🧖 Heaolu',
  seiklus: '🌲 Seiklus',
};

export const ALL_CATEGORIES = Object.keys(CATEGORY_LABELS) as Category[];

export type Suggestion = {
  id: string;
  category: Category;
  title: string;
  description: string;
  /** Kui kaua tegevus kalendris aega võtab (minutites). */
  durationMinutes: number;
  /** Kuud (1–12), millal soovitus sobib. Puudub = sobib aasta läbi. */
  months?: number[];
};

// Aastaajad Eesti kliima järgi.
const TALV = [12, 1, 2];
const KEVAD = [3, 4, 5];
const SUVI = [6, 7, 8];
const SUGIS = [9, 10, 11];
const SOE_AEG = [5, 6, 7, 8, 9];
const LUMEAEG = [12, 1, 2, 3];
const VALGE_AEG = [4, 5, 6, 7, 8, 9, 10];

export const SUGGESTIONS: Suggestion[] = [
  // Lilled
  { id: 'lilled-kimp', category: 'lilled', title: 'Osta lillekimp', description: 'Too koju lillekimp ilma erilise põhjuseta – just see teeb selle eriliseks.', durationMinutes: 30 },
  { id: 'lilled-lemmik', category: 'lilled', title: 'Tema lemmiklilled', description: 'Uuri välja ja osta tema lemmiklilled. Kui ei tea, küsi tema sõbrannalt.', durationMinutes: 30 },
  { id: 'lilled-potilill', category: 'lilled', title: 'Kingi potilill', description: 'Potilill rõõmustab kauem kui lõikelilled – vali midagi, mis õitseb.', durationMinutes: 30 },
  { id: 'lilled-uks', category: 'lilled', title: 'Üks roos lauale', description: 'Pane hommikul üksik roos lauale koos väikese sedeliga.', durationMinutes: 15 },
  { id: 'lilled-tulbid', category: 'lilled', title: 'Kevadised tulbid', description: 'Tulbikimp toob kevade tuppa – vali tema lemmikvärv.', durationMinutes: 20, months: KEVAD },
  { id: 'lilled-niit', category: 'lilled', title: 'Korja lilli', description: 'Korja jalutuskäigul niidult kimp ja kingi see talle.', durationMinutes: 30, months: [6, 7, 8] },
  { id: 'lilled-hyatsint', category: 'lilled', title: 'Talvine lilleke', description: 'Hüatsint või amarüllis potis – lõhnav rõõm keset talve.', durationMinutes: 20, months: [11, 12, 1, 2] },

  // Kultuur
  { id: 'kultuur-teater', category: 'kultuur', title: 'Mine teatrisse', description: 'Vaata, mis etendused lähinädalatel tulevad, ja osta kaks piletit.', durationMinutes: 180, months: [9, 10, 11, 12, 1, 2, 3, 4, 5] },
  { id: 'kultuur-suveteater', category: 'kultuur', title: 'Suveteater', description: 'Leia mõni suvelavastus vabas õhus ja osta piletid – võta tekk kaasa.', durationMinutes: 210, months: SUVI },
  { id: 'kultuur-kontsert', category: 'kultuur', title: 'Kontserdile', description: 'Leia tema lemmikartisti või -žanri kontsert ja üllata piletitega.', durationMinutes: 180 },
  { id: 'kultuur-kino', category: 'kultuur', title: 'Kinoõhtu', description: 'Vali film, mida ta on tahtnud näha, ja broneeri head kohad.', durationMinutes: 150 },
  { id: 'kultuur-naitus', category: 'kultuur', title: 'Muuseum või näitus', description: 'Külastage koos mõnda uut näitust või muuseumi.', durationMinutes: 150 },
  { id: 'kultuur-ooper', category: 'kultuur', title: 'Ooper või ballett', description: 'Pidulik õhtu – riietuge ilusti ja minge ooperisse või balletti.', durationMinutes: 210, months: [9, 10, 11, 12, 1, 2, 3, 4, 5] },
  { id: 'kultuur-joulukontsert', category: 'kultuur', title: 'Jõulukontsert', description: 'Osta piletid jõulukontserdile kirikus või kontserdisaalis.', durationMinutes: 150, months: [12] },

  // Väljaskäik
  { id: 'valjas-restoran', category: 'valjaskaik', title: 'Õhtusöök restoranis', description: 'Broneeri laud restoranis, kus te pole varem käinud.', durationMinutes: 150 },
  { id: 'valjas-kohvik', category: 'valjaskaik', title: 'Kohvik ja kook', description: 'Kutsu ta pärastlõunal kohvikusse kohvi ja koogi peale.', durationMinutes: 90 },
  { id: 'valjas-esimene', category: 'valjaskaik', title: 'Esimese kohtingu koht', description: 'Minge sinna, kus teil oli esimene kohtumine.', durationMinutes: 120 },
  { id: 'valjas-brunch', category: 'valjaskaik', title: 'Nädalavahetuse brunch', description: 'Broneeri laupäeva või pühapäeva hommikuks brunch.', durationMinutes: 120 },
  { id: 'valjas-terrass', category: 'valjaskaik', title: 'Õhtu väliterrassil', description: 'Leidke mõnus terrass ja nautige sooja õhtut klaasi veini või limonaadiga.', durationMinutes: 120, months: SOE_AEG },
  { id: 'valjas-jaatis', category: 'valjaskaik', title: 'Jäätisejalutuskäik', description: 'Minge jalutama ja ostke teel tema lemmikjäätist.', durationMinutes: 60, months: [5, 6, 7, 8] },
  { id: 'valjas-joulurg', category: 'valjaskaik', title: 'Jõuluturg', description: 'Minge jõuluturule, jooge glögi ja otsige koos väikseid kingitusi.', durationMinutes: 120, months: [12] },

  // Kodus koos
  { id: 'kodu-ohtusook', category: 'kodu', title: 'Valmista õhtusöök', description: 'Tee ise õhtusöök, kata laud ilusti ja süüta küünlad.', durationMinutes: 150 },
  { id: 'kodu-hommikusook', category: 'kodu', title: 'Hommikusöök voodisse', description: 'Üllata teda nädalavahetusel hommikusöögiga voodis.', durationMinutes: 45 },
  { id: 'kodu-filmiohtu', category: 'kodu', title: 'Hubane filmiõhtu', description: 'Tekid, popkorn ja tema valitud film – telefonid kõrvale.', durationMinutes: 150 },
  { id: 'kodu-lauamang', category: 'kodu', title: 'Lauamänguõhtu', description: 'Mängige koos lauamänge või pange kokku pusle.', durationMinutes: 120 },
  { id: 'kodu-grill', category: 'kodu', title: 'Grilliõhtu', description: 'Tee õues grilli ja kata laud aeda või rõdule.', durationMinutes: 150, months: SOE_AEG },
  { id: 'kodu-kakao', category: 'kodu', title: 'Kuum kakao ja tekk', description: 'Tee pärast külma päeva kuum kakao vahukommidega ja pakkige end tekki.', durationMinutes: 60, months: [10, 11, 12, 1, 2, 3] },
  { id: 'kodu-piparkoogid', category: 'kodu', title: 'Küpsetage piparkooke', description: 'Küpsetage ja kaunistage koos piparkooke, mängigu jõulumuusika.', durationMinutes: 150, months: [12] },
  { id: 'kodu-oun', category: 'kodu', title: 'Küpseta õunakook', description: 'Küpseta värsketest õuntest kook ja pakuta seda vaniljekastmega.', durationMinutes: 90, months: [8, 9, 10] },

  // Kodutööd
  { id: 'kodutood-pesu', category: 'kodutood', title: 'Aita pesu kokku panna', description: 'Pane puhas pesu kokku ja kappi – ilma, et keegi paluks.', durationMinutes: 30 },
  { id: 'kodutood-koristus', category: 'kodutood', title: 'Aita koristada', description: 'Tolmuimeja ja lapp kätte – koristage koos või tee see ise ära, kui ta on ära.', durationMinutes: 90 },
  { id: 'kodutood-noud', category: 'kodutood', title: 'Pese nõud ära', description: 'Pese pärast õhtusööki nõud või tühjenda nõudepesumasin, enne kui ta jõuab.', durationMinutes: 30 },
  { id: 'kodutood-ule', category: 'kodutood', title: 'Võta kodutööd üle', description: 'Tee ära need kodutööd, mis tavaliselt jäävad temale.', durationMinutes: 120 },
  { id: 'kodutood-voodipesu', category: 'kodutood', title: 'Vaheta voodipesu', description: 'Värske voodipesu on mõnus üllatus õhtul magama minnes.', durationMinutes: 30 },
  { id: 'kodutood-triiki', category: 'kodutood', title: 'Triigi riided', description: 'Triigi tema riided, mis ootavad – eriti see, mida ta homme kanda tahab.', durationMinutes: 45 },
  { id: 'kodutood-pood', category: 'kodutood', title: 'Käi poes ära', description: 'Küsi, mida kodus vaja on, ja tee kogu sisseost ise ära.', durationMinutes: 60 },
  { id: 'kodutood-prugi', category: 'kodutood', title: 'Vii prügi välja', description: 'Vii prügi ja taara ära enne, kui keegi seda meelde tuletab.', durationMinutes: 15 },
  { id: 'kodutood-paranda', category: 'kodutood', title: 'Paranda see, mis on ammu katki', description: 'Lekkiv kraan, logisev kapiuks, põlenud pirn – tee see lõpuks korda.', durationMinutes: 60 },
  { id: 'kodutood-sook', category: 'kodutood', title: 'Tee söök valmis', description: 'Valmista õhtusöök või järgmise päeva lõunasöök valmis, et tal oleks vähem muret.', durationMinutes: 60 },
  { id: 'kodutood-aknad', category: 'kodutood', title: 'Pese aknad', description: 'Puhtad aknad lasevad päikese tuppa – tee see ära ilma meeldetuletuseta.', durationMinutes: 120, months: [4, 5, 6, 7, 8, 9] },
  { id: 'kodutood-lumi', category: 'kodutood', title: 'Lükka lund', description: 'Puhasta hommikul tee ja auto lumest, enne kui ta välja läheb.', durationMinutes: 30, months: LUMEAEG },
  { id: 'kodutood-lehed', category: 'kodutood', title: 'Riisu lehti', description: 'Riisu aias lehed kokku – ta ei pea sellele mõtlema.', durationMinutes: 90, months: [9, 10, 11] },
  { id: 'kodutood-muru', category: 'kodutood', title: 'Niida muru', description: 'Niida muru ja korista aed, et saaks koos õues olla.', durationMinutes: 60, months: SOE_AEG },
  { id: 'kodutood-kevad', category: 'kodutood', title: 'Kevadkoristus', description: 'Võtke ette üks kapp või panipaik ja korrastage see koos.', durationMinutes: 120, months: [3, 4, 5] },

  // Kingitus
  { id: 'kingitus-sokolaad', category: 'kingitus', title: 'Tema lemmikšokolaad', description: 'Too poest tema lemmikmaius – väike asi, suur rõõm.', durationMinutes: 15 },
  { id: 'kingitus-raamat', category: 'kingitus', title: 'Raamat', description: 'Kingi raamat, mille kohta ta on maininud, et tahaks lugeda.', durationMinutes: 45 },
  { id: 'kingitus-ehe', category: 'kingitus', title: 'Väike ehe', description: 'Vali ehe, mis sobib tema stiiliga.', durationMinutes: 60 },
  { id: 'kingitus-fotoalbum', category: 'kingitus', title: 'Fotoalbum', description: 'Tee teie ühistest piltidest fotoraamat või -album.', durationMinutes: 120 },
  { id: 'kingitus-sall', category: 'kingitus', title: 'Soe sall või kindad', description: 'Kingi pehme sall või kindad, et tal oleks talvel soe.', durationMinutes: 45, months: [10, 11, 12, 1, 2] },
  { id: 'kingitus-sobrapaev', category: 'kingitus', title: 'Sõbrapäeva üllatus', description: '14. veebruar on tulekul – mõtle välja väike kingitus ja kaart.', durationMinutes: 45, months: [2] },
  { id: 'kingitus-naistepaev', category: 'kingitus', title: 'Naistepäev', description: '8. märts – too lilled ja ütle, kui väga sa teda hindad.', durationMinutes: 30, months: [3] },

  // Tähelepanu
  { id: 'tahel-kiri', category: 'tahelepanu', title: 'Kirjuta armastuskiri', description: 'Kirjuta käsitsi kiri sellest, mida sa temas hindad.', durationMinutes: 30 },
  { id: 'tahel-sedelid', category: 'tahelepanu', title: 'Peida armsad sedelid', description: 'Peida koju või tema kotti väikesi armsaid sedeleid.', durationMinutes: 20 },
  { id: 'tahel-sonum', category: 'tahelepanu', title: 'Sõnum keset päeva', description: 'Saada talle päeval sõnum, et mõtled temale.', durationMinutes: 5 },
  { id: 'tahel-kompliment', category: 'tahelepanu', title: 'Siiras kompliment', description: 'Ütle talle täna midagi head, mida sa pole ammu öelnud.', durationMinutes: 5 },
  { id: 'tahel-kuula', category: 'tahelepanu', title: 'Kuula ilma telefonita', description: 'Võta õhtul aega ja küsi, kuidas tal päriselt läheb.', durationMinutes: 60 },
  { id: 'tahel-auto', category: 'tahelepanu', title: 'Soe auto hommikul', description: 'Käivita hommikul tema auto ja kraabi aknad jääst puhtaks.', durationMinutes: 15, months: [11, 12, 1, 2, 3] },

  // Heaolu
  { id: 'heaolu-spaa', category: 'heaolu', title: 'Spaapäev', description: 'Kingi spaapakett või broneeri teile kahele spaapäev.', durationMinutes: 240 },
  { id: 'heaolu-massaaz', category: 'heaolu', title: 'Massaaž', description: 'Tee talle õhtul massaaž või kingi massaažikinkekaart.', durationMinutes: 60 },
  { id: 'heaolu-vaba', category: 'heaolu', title: 'Vaba päev talle', description: 'Võta lapsed ja kodu enda peale ning anna talle päev ainult endale.', durationMinutes: 480 },
  { id: 'heaolu-vann', category: 'heaolu', title: 'Mõnus vann', description: 'Valmista talle vann vahu, küünalde ja muusikaga.', durationMinutes: 60 },
  { id: 'heaolu-saun', category: 'heaolu', title: 'Saunaõhtu', description: 'Küta saun, pane valmis rätikud ja midagi head juua.', durationMinutes: 150 },

  // Seiklus
  { id: 'seiklus-matk', category: 'seiklus', title: 'Matk looduses', description: 'Minge koos matkarajale ja võtke termos ning võileivad kaasa.', durationMinutes: 240, months: [...KEVAD, ...SUVI, ...SUGIS] },
  { id: 'seiklus-piknik', category: 'seiklus', title: 'Piknik', description: 'Paki korv tema lemmiksöökidega ja minge parki või randa.', durationMinutes: 150, months: SOE_AEG },
  { id: 'seiklus-reis', category: 'seiklus', title: 'Nädalavahetuse reis', description: 'Planeeri üllatusreis mõnda uude linna või hubasesse majutusse.', durationMinutes: 1440 },
  { id: 'seiklus-tants', category: 'seiklus', title: 'Tantsutund', description: 'Registreeru koos tantsutundi – salsa, tango või valss.', durationMinutes: 90 },
  { id: 'seiklus-paikeseloojang', category: 'seiklus', title: 'Päikeseloojang', description: 'Viige termos ja tekk ilusasse kohta ning vaadake päikeseloojangut.', durationMinutes: 90, months: VALGE_AEG },
  { id: 'seiklus-ujuma', category: 'seiklus', title: 'Ujuma', description: 'Minge koos randa või järve äärde ujuma.', durationMinutes: 180, months: [6, 7, 8] },
  { id: 'seiklus-jaanituli', category: 'seiklus', title: 'Jaanituli', description: 'Planeerige koos jaaniõhtu – lõke, grill ja sõnajalaõie otsimine.', durationMinutes: 300, months: [6] },
  { id: 'seiklus-maasikad', category: 'seiklus', title: 'Maasikakorjamine', description: 'Minge talusse maasikaid korjama ja tehke kodus maasikakook.', durationMinutes: 180, months: [6, 7] },
  { id: 'seiklus-seened', category: 'seiklus', title: 'Seenemetsa', description: 'Minge koos metsa seenele või marjule.', durationMinutes: 240, months: [8, 9, 10] },
  { id: 'seiklus-lehed', category: 'seiklus', title: 'Sügisvärvide jalutuskäik', description: 'Minge parki või metsa värvilisi lehti imetlema ja pilti tegema.', durationMinutes: 90, months: [9, 10] },
  { id: 'seiklus-uisud', category: 'seiklus', title: 'Uisutama', description: 'Minge uisuväljakule ja jooge pärast kuuma jooki.', durationMinutes: 120, months: TALV },
  { id: 'seiklus-kelk', category: 'seiklus', title: 'Kelgutama', description: 'Võtke kelk ja minge mäest alla laskma – nagu lapsepõlves.', durationMinutes: 120, months: [12, 1, 2] },
  { id: 'seiklus-talvematk', category: 'seiklus', title: 'Talvine jalutuskäik', description: 'Jalutage lumises metsas või pargis, võtke termosega kuum tee kaasa.', durationMinutes: 90, months: TALV },
  { id: 'seiklus-ratas', category: 'seiklus', title: 'Rattasõit', description: 'Tehke koos rattamatk ja peatuge kohvikus või piknikul.', durationMinutes: 180, months: [5, 6, 7, 8, 9] },
];

/** Kas soovitus sobib antud kuupäeva aastaaega. */
export function isInSeason(s: Suggestion, date: Date): boolean {
  return !s.months || s.months.includes(date.getMonth() + 1);
}

export function getSuggestion(id: string): Suggestion | undefined {
  return SUGGESTIONS.find((s) => s.id === id);
}
