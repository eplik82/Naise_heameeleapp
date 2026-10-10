export type Category =
  | 'lilled'
  | 'kultuur'
  | 'valjaskaik'
  | 'kodu'
  | 'kingitus'
  | 'tahelepanu'
  | 'heaolu'
  | 'seiklus';

export const CATEGORY_LABELS: Record<Category, string> = {
  lilled: '💐 Lilled',
  kultuur: '🎭 Kultuur',
  valjaskaik: '🍽️ Väljaskäik',
  kodu: '🏠 Kodus',
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
};

export const SUGGESTIONS: Suggestion[] = [
  // Lilled
  { id: 'lilled-kimp', category: 'lilled', title: 'Osta lillekimp', description: 'Too koju lillekimp ilma erilise põhjuseta – just see teeb selle eriliseks.', durationMinutes: 30 },
  { id: 'lilled-lemmik', category: 'lilled', title: 'Tema lemmiklilled', description: 'Uuri välja ja osta tema lemmiklilled. Kui ei tea, küsi tema sõbrannalt.', durationMinutes: 30 },
  { id: 'lilled-potilill', category: 'lilled', title: 'Kingi potilill', description: 'Potilill rõõmustab kauem kui lõikelilled – vali midagi, mis õitseb.', durationMinutes: 30 },
  { id: 'lilled-uks', category: 'lilled', title: 'Üks roos lauale', description: 'Pane hommikul üksik roos lauale koos väikese sedeliga.', durationMinutes: 15 },

  // Kultuur
  { id: 'kultuur-teater', category: 'kultuur', title: 'Mine teatrisse', description: 'Vaata, mis etendused lähinädalatel tulevad, ja osta kaks piletit.', durationMinutes: 180 },
  { id: 'kultuur-kontsert', category: 'kultuur', title: 'Kontserdile', description: 'Leia tema lemmikartisti või -žanri kontsert ja üllata piletitega.', durationMinutes: 180 },
  { id: 'kultuur-kino', category: 'kultuur', title: 'Kinoõhtu', description: 'Vali film, mida ta on tahtnud näha, ja broneeri head kohad.', durationMinutes: 150 },
  { id: 'kultuur-naitus', category: 'kultuur', title: 'Muuseum või näitus', description: 'Külastage koos mõnda uut näitust või muuseumi.', durationMinutes: 150 },
  { id: 'kultuur-ooper', category: 'kultuur', title: 'Ooper või ballett', description: 'Pidulik õhtu – riietuge ilusti ja minge ooperisse või balletti.', durationMinutes: 210 },

  // Väljaskäik
  { id: 'valjas-restoran', category: 'valjaskaik', title: 'Õhtusöök restoranis', description: 'Broneeri laud restoranis, kus te pole varem käinud.', durationMinutes: 150 },
  { id: 'valjas-kohvik', category: 'valjaskaik', title: 'Kohvik ja kook', description: 'Kutsu ta pärastlõunal kohvikusse kohvi ja koogi peale.', durationMinutes: 90 },
  { id: 'valjas-esimene', category: 'valjaskaik', title: 'Esimese kohtingu koht', description: 'Minge sinna, kus teil oli esimene kohtumine.', durationMinutes: 120 },
  { id: 'valjas-brunch', category: 'valjaskaik', title: 'Nädalavahetuse brunch', description: 'Broneeri laupäeva või pühapäeva hommikuks brunch.', durationMinutes: 120 },

  // Kodus
  { id: 'kodu-ohtusook', category: 'kodu', title: 'Valmista õhtusöök', description: 'Tee ise õhtusöök, kata laud ilusti ja süüta küünlad.', durationMinutes: 150 },
  { id: 'kodu-hommikusook', category: 'kodu', title: 'Hommikusöök voodisse', description: 'Üllata teda nädalavahetusel hommikusöögiga voodis.', durationMinutes: 45 },
  { id: 'kodu-filmiohtu', category: 'kodu', title: 'Hubane filmiõhtu', description: 'Tekid, popkorn ja tema valitud film – telefonid kõrvale.', durationMinutes: 150 },
  { id: 'kodu-kodutood', category: 'kodu', title: 'Võta kodutööd üle', description: 'Tee ära need kodutööd, mis tavaliselt jäävad temale.', durationMinutes: 120 },
  { id: 'kodu-lauamang', category: 'kodu', title: 'Lauamänguõhtu', description: 'Mängige koos lauamänge või pange kokku pusle.', durationMinutes: 120 },

  // Kingitus
  { id: 'kingitus-sokolaad', category: 'kingitus', title: 'Tema lemmikšokolaad', description: 'Too poest tema lemmikmaius – väike asi, suur rõõm.', durationMinutes: 15 },
  { id: 'kingitus-raamat', category: 'kingitus', title: 'Raamat', description: 'Kingi raamat, mille kohta ta on maininud, et tahaks lugeda.', durationMinutes: 45 },
  { id: 'kingitus-ehe', category: 'kingitus', title: 'Väike ehe', description: 'Vali ehe, mis sobib tema stiiliga.', durationMinutes: 60 },
  { id: 'kingitus-fotoalbum', category: 'kingitus', title: 'Fotoalbum', description: 'Tee teie ühistest piltidest fotoraamat või -album.', durationMinutes: 120 },

  // Tähelepanu
  { id: 'tahel-kiri', category: 'tahelepanu', title: 'Kirjuta armastuskiri', description: 'Kirjuta käsitsi kiri sellest, mida sa temas hindad.', durationMinutes: 30 },
  { id: 'tahel-sedelid', category: 'tahelepanu', title: 'Peida armsad sedelid', description: 'Peida koju või tema kotti väikesi armsaid sedeleid.', durationMinutes: 20 },
  { id: 'tahel-sonum', category: 'tahelepanu', title: 'Sõnum keset päeva', description: 'Saada talle päeval sõnum, et mõtled temale.', durationMinutes: 5 },
  { id: 'tahel-kompliment', category: 'tahelepanu', title: 'Siiras kompliment', description: 'Ütle talle täna midagi head, mida sa pole ammu öelnud.', durationMinutes: 5 },
  { id: 'tahel-kuula', category: 'tahelepanu', title: 'Kuula ilma telefonita', description: 'Võta õhtul aega ja küsi, kuidas tal päriselt läheb.', durationMinutes: 60 },

  // Heaolu
  { id: 'heaolu-spaa', category: 'heaolu', title: 'Spaapäev', description: 'Kingi spaapakett või broneeri teile kahele spaapäev.', durationMinutes: 240 },
  { id: 'heaolu-massaaz', category: 'heaolu', title: 'Massaaž', description: 'Tee talle õhtul massaaž või kingi massaažikinkekaart.', durationMinutes: 60 },
  { id: 'heaolu-vaba', category: 'heaolu', title: 'Vaba päev talle', description: 'Võta lapsed ja kodu enda peale ning anna talle päev ainult endale.', durationMinutes: 480 },
  { id: 'heaolu-vann', category: 'heaolu', title: 'Mõnus vann', description: 'Valmista talle vann vahu, küünalde ja muusikaga.', durationMinutes: 60 },

  // Seiklus
  { id: 'seiklus-matk', category: 'seiklus', title: 'Matk looduses', description: 'Minge koos matkarajale ja võtke piknikukorv kaasa.', durationMinutes: 240 },
  { id: 'seiklus-piknik', category: 'seiklus', title: 'Piknik', description: 'Paki korv tema lemmiksöökidega ja minge parki või randa.', durationMinutes: 150 },
  { id: 'seiklus-reis', category: 'seiklus', title: 'Nädalavahetuse reis', description: 'Planeeri üllatusreis mõnda uude linna või hubasesse majutusse.', durationMinutes: 1440 },
  { id: 'seiklus-tants', category: 'seiklus', title: 'Tantsutund', description: 'Registreeru koos tantsutundi – salsa, tango või valss.', durationMinutes: 90 },
  { id: 'seiklus-paikeseloojang', category: 'seiklus', title: 'Päikeseloojang', description: 'Viige termos ja tekk ilusasse kohta ning vaadake päikeseloojangut.', durationMinutes: 90 },
];

export function getSuggestion(id: string): Suggestion | undefined {
  return SUGGESTIONS.find((s) => s.id === id);
}
