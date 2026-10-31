// Maps spoken Bangla medicine names/generics to English catalog names so voice search works in both Bangla & English
const BANGLA_TO_ENGLISH_PHONETIC: Record<string, string> = {
  "\u09A8\u09BE\u09AA\u09BE": "Napa",
  "\u09A8\u09BE\u09AA\u09BE \u098F\u0995\u09CD\u09B8\u099F\u09C7\u09A8\u09CD\u09A1": "Napa Extend",
  "\u09A8\u09BE\u09AA\u09BE \u098F\u0995\u09CD\u09B8\u099F\u09CD\u09B0\u09BE": "Napa Extra",
  "\u09B8\u09BE\u09B0\u09CD\u099C\u09C7\u09B2": "Sergel",
  "\u09B8\u09BE\u09B0\u099C\u09C7\u09B2": "Sergel",
  "\u09B8\u09C7\u0995\u09B2\u09CB": "Seclo",
  "\u09AE\u09CD\u09AF\u09BE\u0995\u09CD\u09B8\u09AA\u09CD\u09B0\u09CB": "Maxpro",
  "\u098F\u09B8": "Ace",
  "\u09AA\u09CD\u09AF\u09BE\u09B0\u09BE\u09B8\u09BF\u099F\u09BE\u09AE\u09B2": "Paracetamol",
  "\u0987\u09B8\u09CB\u09AE\u09BF\u09AA\u09CD\u09B0\u09BE\u099C\u09B2": "Esomeprazole",
  "\u0993\u09AE\u09BF\u09AA\u09CD\u09B0\u09BE\u099C\u09B2": "Omeprazole",
  "\u099C\u09BF\u09AE\u09CD\u09AF\u09BE\u0995\u09CD\u09B8": "Zimax",
  "\u09AE\u09A8\u09BE\u09B8": "Monas",
  "\u09AB\u09C7\u0995\u09CD\u09B8\u09CB": "Fexo",
  "\u0986\u09B2\u09BE\u099F\u09CD\u09B0\u09B2": "Alatrol",
  "\u0993\u09AE\u09B0\u09A8": "Omron",
  "\u0997\u09CD\u09AF\u09BE\u09B8\u09CD\u099F\u09CD\u09B0\u09BF\u0995": "Gastric",
  "\u099C\u09CD\u09AC\u09B0": "Fever",
  "\u09AC\u09CD\u09AF\u09A5\u09BE": "Pain",
  "\u0985\u09CD\u09AF\u09BE\u09A8\u09CD\u099F\u09BF\u09AC\u09BE\u09DF\u09CB\u099F\u09BF\u0995": "Cefixime",
  "\u09AD\u09BF\u099F\u09BE\u09AE\u09BF\u09A8": "Vitamin",
  "\u09A1\u09BE\u09DF\u09BE\u09AC\u09C7\u099F\u09BF\u09B8": "Diabetes",
};

export function normalizeVoiceQuery(rawTranscript: string): string {
  const cleaned = rawTranscript.trim().replace(/[।.,?!]+$/, "");
  if (!cleaned) return "";

  // Check direct or partial Bangla phonetic match
  for (const [bnWord, enWord] of Object.entries(BANGLA_TO_ENGLISH_PHONETIC)) {
    if (cleaned.includes(bnWord)) {
      return enWord;
    }
  }

  return cleaned;
}