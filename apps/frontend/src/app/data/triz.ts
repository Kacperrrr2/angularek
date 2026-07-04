// Standardowe 39 parametrów inżynierskich macierzy sprzeczności TRIZ (39x39).
export interface TrizParameter {
  id: number;
  name: string;
}

export const TRIZ_PARAMETERS: TrizParameter[] = [
  { id: 1, name: "Masa obiektu ruchomego" },
  { id: 2, name: "Masa obiektu nieruchomego" },
  { id: 3, name: "Długość obiektu ruchomego" },
  { id: 4, name: "Długość obiektu nieruchomego" },
  { id: 5, name: "Powierzchnia obiektu ruchomego" },
  { id: 6, name: "Powierzchnia obiektu nieruchomego" },
  { id: 7, name: "Objętość obiektu ruchomego" },
  { id: 8, name: "Objętość obiektu nieruchomego" },
  { id: 9, name: "Prędkość" },
  { id: 10, name: "Siła" },
  { id: 11, name: "Naprężenie / ciśnienie" },
  { id: 12, name: "Kształt" },
  { id: 13, name: "Stabilność struktury obiektu" },
  { id: 14, name: "Wytrzymałość" },
  { id: 15, name: "Trwałość obiektu ruchomego" },
  { id: 16, name: "Trwałość obiektu nieruchomego" },
  { id: 17, name: "Temperatura" },
  { id: 18, name: "Natężenie oświetlenia" },
  { id: 19, name: "Energia zużywana przez obiekt ruchomy" },
  { id: 20, name: "Energia zużywana przez obiekt nieruchomy" },
  { id: 21, name: "Moc" },
  { id: 22, name: "Straty energii" },
  { id: 23, name: "Straty substancji" },
  { id: 24, name: "Straty informacji" },
  { id: 25, name: "Straty czasu" },
  { id: 26, name: "Ilość substancji" },
  { id: 27, name: "Niezawodność" },
  { id: 28, name: "Dokładność pomiaru" },
  { id: 29, name: "Dokładność wytwarzania" },
  { id: 30, name: "Czynniki szkodliwe działające na obiekt" },
  { id: 31, name: "Szkodliwe efekty uboczne" },
  { id: 32, name: "Łatwość wytwarzania" },
  { id: 33, name: "Łatwość obsługi" },
  { id: 34, name: "Łatwość naprawy" },
  { id: 35, name: "Adaptacyjność / uniwersalność" },
  { id: 36, name: "Złożoność urządzenia" },
  { id: 37, name: "Złożoność sterowania i pomiaru" },
  { id: 38, name: "Poziom automatyzacji" },
  { id: 39, name: "Wydajność" },
];

// 40 zasad wynalazczych TRIZ (skrócony rejestr używany w uzasadnieniach).
export const INVENTIVE_PRINCIPLES: Record<number, string> = {
  1: "Segmentacja",
  2: "Wydzielenie",
  3: "Lokalna jakość",
  10: "Działanie wyprzedzające",
  13: "Odwrócenie",
  15: "Dynamiczność",
  17: "Przejście w inny wymiar",
  19: "Działanie okresowe",
  28: "Zastąpienie systemu mechanicznego",
  35: "Zmiana parametrów stanu",
};

export interface Solution {
  id: string;
  principleIds: number[];
  title: string;
  summary: string;
  rationale: string;
}

// Mock: koncepcje wygenerowane po sformułowaniu problemu.
export const MOCK_SOLUTIONS: Solution[] = [
  {
    id: "S-01",
    principleIds: [1, 15],
    title: "Segmentacja struktury nośnej",
    summary:
      "Podział monolitycznego elementu na moduły o zmiennej sztywności.",
    rationale:
      "Zasada 1 (Segmentacja) w połączeniu z 15 (Dynamiczność) pozwala zredukować masę obiektu ruchomego bez utraty wytrzymałości. Segmenty przenoszą obciążenie lokalnie, a połączenia elastyczne adaptują sztywność do chwilowego rozkładu sił.",
  },
  {
    id: "S-02",
    principleIds: [2, 3],
    title: "Wydzielenie funkcji krytycznej",
    summary:
      "Oddzielenie elementu przenoszącego obciążenie od elementu prowadzącego.",
    rationale:
      "Zasada 2 (Wydzielenie) izoluje właściwość szkodliwą do osobnego podsystemu. Dzięki temu poprawiana cecha rośnie, a cecha pogarszana zostaje ograniczona do minimalnego, kontrolowanego obszaru (Zasada 3 — Lokalna jakość).",
  },
  {
    id: "S-03",
    principleIds: [28, 35],
    title: "Zastąpienie układu mechanicznego polem",
    summary:
      "Wymiana sprzężenia mechanicznego na oddziaływanie magnetyczne.",
    rationale:
      "Zasada 28 eliminuje kontakt cierny, redukując straty energii i zużycie. Zmiana parametrów stanu (Zasada 35) umożliwia sterowanie siłą bez zmiany geometrii obiektu.",
  },
  {
    id: "S-04",
    principleIds: [10, 19],
    title: "Działanie wyprzedzające impulsowe",
    summary:
      "Wprowadzenie kompensacji obciążenia przed wystąpieniem szczytu.",
    rationale:
      "Połączenie zasady 10 (Działanie wyprzedzające) i 19 (Działanie okresowe) rozkłada obciążenie w czasie. Impulsowa kompensacja obniża naprężenie szczytowe, poprawiając trwałość przy niezmienionej masie.",
  },
];

export interface Criterion {
  id: string;
  label: string;
  weight: number;
}

export const DEFAULT_CRITERIA: Criterion[] = [
  { id: "feasibility", label: "Wykonalność techniczna", weight: 40 },
  { id: "cost", label: "Koszt wdrożenia", weight: 30 },
  { id: "risk", label: "Ryzyko projektowe", weight: 30 },
];
