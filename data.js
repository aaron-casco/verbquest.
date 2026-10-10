import {eggSpecies} from './eggs.js';
// Lista completa facilitada por Aarón. Cada entrada pertenece a un examen.
export const DEMO_VERBS = [
  {
    "id": "be",
    "forms": [
      "be",
      "was/were",
      "been"
    ],
    "block": 0,
    "note": "",
    "meaning": "ser o estar",
    "context": "ready for class",
    "subject": "I"
  },
  {
    "id": "beat",
    "forms": [
      "beat",
      "beat",
      "beaten"
    ],
    "block": 0,
    "note": "",
    "meaning": "vencer o golpear",
    "context": "the record",
    "subject": "I"
  },
  {
    "id": "become",
    "forms": [
      "become",
      "became",
      "become"
    ],
    "block": 0,
    "note": "",
    "meaning": "convertirse en",
    "context": "a better player",
    "subject": "I"
  },
  {
    "id": "begin",
    "forms": [
      "begin",
      "began",
      "begun"
    ],
    "block": 0,
    "note": "",
    "meaning": "empezar",
    "context": "the lesson",
    "subject": "I"
  },
  {
    "id": "bend",
    "forms": [
      "bend",
      "bent",
      "bent"
    ],
    "block": 0,
    "note": "",
    "meaning": "doblar",
    "context": "the wire",
    "subject": "I"
  },
  {
    "id": "bet",
    "forms": [
      "bet",
      "bet",
      "bet"
    ],
    "block": 0,
    "note": "",
    "meaning": "apostar",
    "context": "on the result",
    "subject": "I"
  },
  {
    "id": "bite",
    "forms": [
      "bite",
      "bit",
      "bitten"
    ],
    "block": 0,
    "note": "",
    "meaning": "morder",
    "context": "the apple",
    "subject": "I"
  },
  {
    "id": "bleed",
    "forms": [
      "bleed",
      "bled",
      "bled"
    ],
    "block": 0,
    "note": "",
    "meaning": "sangrar",
    "context": "after the accident",
    "subject": "I"
  },
  {
    "id": "blow",
    "forms": [
      "blow",
      "blew",
      "blown"
    ],
    "block": 0,
    "note": "",
    "meaning": "soplar",
    "context": "the whistle",
    "subject": "I"
  },
  {
    "id": "break",
    "forms": [
      "break",
      "broke",
      "broken"
    ],
    "block": 0,
    "note": "",
    "meaning": "romper",
    "context": "the glass",
    "subject": "I"
  },
  {
    "id": "bring",
    "forms": [
      "bring",
      "brought",
      "brought"
    ],
    "block": 0,
    "note": "",
    "meaning": "traer",
    "context": "my notebook",
    "subject": "I"
  },
  {
    "id": "build",
    "forms": [
      "build",
      "built",
      "built"
    ],
    "block": 0,
    "note": "",
    "meaning": "construir",
    "context": "a small house",
    "subject": "I"
  },
  {
    "id": "burn",
    "forms": [
      "burn",
      "burnt/burned",
      "burnt/burned"
    ],
    "block": 0,
    "note": "",
    "meaning": "quemar",
    "context": "the toast",
    "subject": "I"
  },
  {
    "id": "buy",
    "forms": [
      "buy",
      "bought",
      "bought"
    ],
    "block": 0,
    "note": "",
    "meaning": "comprar",
    "context": "a new book",
    "subject": "I"
  },
  {
    "id": "catch",
    "forms": [
      "catch",
      "caught",
      "caught"
    ],
    "block": 0,
    "note": "",
    "meaning": "atrapar",
    "context": "the ball",
    "subject": "I"
  },
  {
    "id": "choose",
    "forms": [
      "choose",
      "chose",
      "chosen"
    ],
    "block": 0,
    "note": "",
    "meaning": "elegir",
    "context": "a blue shirt",
    "subject": "I"
  },
  {
    "id": "come",
    "forms": [
      "come",
      "came",
      "come"
    ],
    "block": 0,
    "note": "",
    "meaning": "venir",
    "context": "to the party",
    "subject": "I"
  },
  {
    "id": "cost",
    "forms": [
      "cost",
      "cost",
      "cost"
    ],
    "block": 0,
    "note": "",
    "meaning": "costar",
    "context": "ten pounds",
    "subject": "The ticket"
  },
  {
    "id": "cut",
    "forms": [
      "cut",
      "cut",
      "cut"
    ],
    "block": 0,
    "note": "",
    "meaning": "cortar",
    "context": "the paper",
    "subject": "I"
  },
  {
    "id": "dig",
    "forms": [
      "dig",
      "dug",
      "dug"
    ],
    "block": 0,
    "note": "",
    "meaning": "cavar",
    "context": "a hole",
    "subject": "I"
  },
  {
    "id": "do",
    "forms": [
      "do",
      "did",
      "done"
    ],
    "block": 0,
    "note": "",
    "meaning": "hacer",
    "context": "my homework",
    "subject": "I"
  },
  {
    "id": "draw",
    "forms": [
      "draw",
      "drew",
      "drawn"
    ],
    "block": 0,
    "note": "",
    "meaning": "dibujar",
    "context": "a dragon",
    "subject": "I"
  },
  {
    "id": "dream",
    "forms": [
      "dream",
      "dreamt/dreamed",
      "dreamt/dreamed"
    ],
    "block": 0,
    "note": "",
    "meaning": "soñar",
    "context": "about the sea",
    "subject": "I"
  },
  {
    "id": "drink",
    "forms": [
      "drink",
      "drank",
      "drunk"
    ],
    "block": 0,
    "note": "",
    "meaning": "beber",
    "context": "some water",
    "subject": "I"
  },
  {
    "id": "drive",
    "forms": [
      "drive",
      "drove",
      "driven"
    ],
    "block": 0,
    "note": "",
    "meaning": "conducir",
    "context": "to the station",
    "subject": "I"
  },
  {
    "id": "eat",
    "forms": [
      "eat",
      "ate",
      "eaten"
    ],
    "block": 1,
    "note": "",
    "meaning": "comer",
    "context": "an apple",
    "subject": "I"
  },
  {
    "id": "fall",
    "forms": [
      "fall",
      "fell",
      "fallen"
    ],
    "block": 1,
    "note": "",
    "meaning": "caer",
    "context": "on the ice",
    "subject": "I"
  },
  {
    "id": "feed",
    "forms": [
      "feed",
      "fed",
      "fed"
    ],
    "block": 1,
    "note": "",
    "meaning": "alimentar",
    "context": "the cat",
    "subject": "I"
  },
  {
    "id": "feel",
    "forms": [
      "feel",
      "felt",
      "felt"
    ],
    "block": 1,
    "note": "",
    "meaning": "sentir",
    "context": "happy",
    "subject": "I"
  },
  {
    "id": "fight",
    "forms": [
      "fight",
      "fought",
      "fought"
    ],
    "block": 1,
    "note": "",
    "meaning": "luchar",
    "context": "for my team",
    "subject": "I"
  },
  {
    "id": "find",
    "forms": [
      "find",
      "found",
      "found"
    ],
    "block": 1,
    "note": "",
    "meaning": "encontrar",
    "context": "my keys",
    "subject": "I"
  },
  {
    "id": "fly",
    "forms": [
      "fly",
      "flew",
      "flown"
    ],
    "block": 1,
    "note": "",
    "meaning": "volar",
    "context": "to London",
    "subject": "I"
  },
  {
    "id": "forget",
    "forms": [
      "forget",
      "forgot",
      "forgotten"
    ],
    "block": 1,
    "note": "",
    "meaning": "olvidar",
    "context": "my password",
    "subject": "I"
  },
  {
    "id": "forgive",
    "forms": [
      "forgive",
      "forgave",
      "forgiven"
    ],
    "block": 1,
    "note": "",
    "meaning": "perdonar",
    "context": "my friend",
    "subject": "I"
  },
  {
    "id": "freeze",
    "forms": [
      "freeze",
      "froze",
      "frozen"
    ],
    "block": 1,
    "note": "",
    "meaning": "congelar",
    "context": "the juice",
    "subject": "I"
  },
  {
    "id": "get",
    "forms": [
      "get",
      "got",
      "got/gotten"
    ],
    "block": 1,
    "note": "",
    "meaning": "conseguir",
    "context": "a new bike",
    "subject": "I"
  },
  {
    "id": "give",
    "forms": [
      "give",
      "gave",
      "given"
    ],
    "block": 1,
    "note": "",
    "meaning": "dar",
    "context": "her a gift",
    "subject": "I"
  },
  {
    "id": "go",
    "forms": [
      "go",
      "went",
      "gone"
    ],
    "block": 1,
    "note": "",
    "meaning": "ir",
    "context": "to the park",
    "subject": "I"
  },
  {
    "id": "grow",
    "forms": [
      "grow",
      "grew",
      "grown"
    ],
    "block": 1,
    "note": "",
    "meaning": "cultivar o crecer",
    "context": "tomatoes",
    "subject": "I"
  },
  {
    "id": "hang",
    "forms": [
      "hang",
      "hung",
      "hung"
    ],
    "block": 1,
    "note": "",
    "meaning": "colgar",
    "context": "the picture",
    "subject": "I"
  },
  {
    "id": "have",
    "forms": [
      "have",
      "had",
      "had"
    ],
    "block": 1,
    "note": "",
    "meaning": "tener",
    "context": "a good idea",
    "subject": "I"
  },
  {
    "id": "hear",
    "forms": [
      "hear",
      "heard",
      "heard"
    ],
    "block": 1,
    "note": "",
    "meaning": "oír",
    "context": "the music",
    "subject": "I"
  },
  {
    "id": "hide",
    "forms": [
      "hide",
      "hid",
      "hidden"
    ],
    "block": 1,
    "note": "",
    "meaning": "esconder",
    "context": "the present",
    "subject": "I"
  },
  {
    "id": "hit",
    "forms": [
      "hit",
      "hit",
      "hit"
    ],
    "block": 1,
    "note": "",
    "meaning": "golpear",
    "context": "the ball",
    "subject": "I"
  },
  {
    "id": "hold",
    "forms": [
      "hold",
      "held",
      "held"
    ],
    "block": 1,
    "note": "",
    "meaning": "sujetar",
    "context": "the rope",
    "subject": "I"
  },
  {
    "id": "hurt",
    "forms": [
      "hurt",
      "hurt",
      "hurt"
    ],
    "block": 1,
    "note": "",
    "meaning": "herir o doler",
    "context": "my knee",
    "subject": "I"
  },
  {
    "id": "keep",
    "forms": [
      "keep",
      "kept",
      "kept"
    ],
    "block": 1,
    "note": "",
    "meaning": "guardar",
    "context": "the ticket",
    "subject": "I"
  },
  {
    "id": "know",
    "forms": [
      "know",
      "knew",
      "known"
    ],
    "block": 1,
    "note": "",
    "meaning": "saber o conocer",
    "context": "the answer",
    "subject": "I"
  },
  {
    "id": "lay",
    "forms": [
      "lay",
      "laid",
      "laid"
    ],
    "block": 1,
    "note": "",
    "meaning": "poner o colocar",
    "context": "the blanket on the bed",
    "subject": "I"
  },
  {
    "id": "lead",
    "forms": [
      "lead",
      "led",
      "led"
    ],
    "block": 1,
    "note": "",
    "meaning": "guiar",
    "context": "the team",
    "subject": "I"
  },
  {
    "id": "learn",
    "forms": [
      "learn",
      "learnt/learned",
      "learnt/learned"
    ],
    "block": 1,
    "note": "",
    "meaning": "aprender",
    "context": "a new word",
    "subject": "I"
  },
  {
    "id": "leave",
    "forms": [
      "leave",
      "left",
      "left"
    ],
    "block": 1,
    "note": "",
    "meaning": "salir o dejar",
    "context": "the house",
    "subject": "I"
  },
  {
    "id": "lend",
    "forms": [
      "lend",
      "lent",
      "lent"
    ],
    "block": 1,
    "note": "",
    "meaning": "prestar",
    "context": "her my pen",
    "subject": "I"
  },
  {
    "id": "let",
    "forms": [
      "let",
      "let",
      "let"
    ],
    "block": 2,
    "note": "",
    "meaning": "permitir",
    "context": "my friend use my phone",
    "subject": "I"
  },
  {
    "id": "lie-rest",
    "forms": [
      "lie",
      "lay",
      "lain"
    ],
    "block": 2,
    "note": "Tumbarse · irregular",
    "meaning": "tumbarse",
    "context": "on the sofa",
    "subject": "I"
  },
  {
    "id": "lie-truth",
    "forms": [
      "lie",
      "lied",
      "lied"
    ],
    "block": 2,
    "note": "Mentir · regular",
    "meaning": "mentir",
    "context": "about my age",
    "subject": "I"
  },
  {
    "id": "light",
    "forms": [
      "light",
      "lit/lighted",
      "lit/lighted"
    ],
    "block": 2,
    "note": "",
    "meaning": "encender",
    "context": "the candle",
    "subject": "I"
  },
  {
    "id": "lose",
    "forms": [
      "lose",
      "lost",
      "lost"
    ],
    "block": 2,
    "note": "",
    "meaning": "perder",
    "context": "my keys",
    "subject": "I"
  },
  {
    "id": "make",
    "forms": [
      "make",
      "made",
      "made"
    ],
    "block": 2,
    "note": "",
    "meaning": "hacer o fabricar",
    "context": "a cake",
    "subject": "I"
  },
  {
    "id": "mean",
    "forms": [
      "mean",
      "meant",
      "meant"
    ],
    "block": 2,
    "note": "",
    "meaning": "tener la intención de",
    "context": "to help",
    "subject": "I"
  },
  {
    "id": "meet",
    "forms": [
      "meet",
      "met",
      "met"
    ],
    "block": 2,
    "note": "",
    "meaning": "conocer o reunirse con",
    "context": "my new teacher",
    "subject": "I"
  },
  {
    "id": "overcome",
    "forms": [
      "overcome",
      "overcame",
      "overcome"
    ],
    "block": 2,
    "note": "",
    "meaning": "superar",
    "context": "my fear",
    "subject": "I"
  },
  {
    "id": "pay",
    "forms": [
      "pay",
      "paid",
      "paid"
    ],
    "block": 2,
    "note": "",
    "meaning": "pagar",
    "context": "for the ticket",
    "subject": "I"
  },
  {
    "id": "put",
    "forms": [
      "put",
      "put",
      "put"
    ],
    "block": 2,
    "note": "",
    "meaning": "poner",
    "context": "the book on the desk",
    "subject": "I"
  },
  {
    "id": "quit",
    "forms": [
      "quit",
      "quit",
      "quit"
    ],
    "block": 2,
    "note": "",
    "meaning": "dejar o abandonar",
    "context": "the club",
    "subject": "I"
  },
  {
    "id": "read",
    "forms": [
      "read",
      "read",
      "read"
    ],
    "block": 2,
    "note": "",
    "meaning": "leer",
    "context": "a short story",
    "subject": "I"
  },
  {
    "id": "ride",
    "forms": [
      "ride",
      "rode",
      "ridden"
    ],
    "block": 2,
    "note": "",
    "meaning": "montar",
    "context": "my bike",
    "subject": "I"
  },
  {
    "id": "ring",
    "forms": [
      "ring",
      "rang",
      "rung"
    ],
    "block": 2,
    "note": "",
    "meaning": "hacer sonar",
    "context": "the bell",
    "subject": "I"
  },
  {
    "id": "rise",
    "forms": [
      "rise",
      "rose",
      "risen"
    ],
    "block": 2,
    "note": "",
    "meaning": "levantarse",
    "context": "early",
    "subject": "I"
  },
  {
    "id": "run",
    "forms": [
      "run",
      "ran",
      "run"
    ],
    "block": 2,
    "note": "",
    "meaning": "correr",
    "context": "in the park",
    "subject": "I"
  },
  {
    "id": "say",
    "forms": [
      "say",
      "said",
      "said"
    ],
    "block": 2,
    "note": "",
    "meaning": "decir",
    "context": "hello",
    "subject": "I"
  },
  {
    "id": "see",
    "forms": [
      "see",
      "saw",
      "seen"
    ],
    "block": 2,
    "note": "",
    "meaning": "ver",
    "context": "a rainbow",
    "subject": "I"
  },
  {
    "id": "sell",
    "forms": [
      "sell",
      "sold",
      "sold"
    ],
    "block": 2,
    "note": "",
    "meaning": "vender",
    "context": "my old bike",
    "subject": "I"
  },
  {
    "id": "send",
    "forms": [
      "send",
      "sent",
      "sent"
    ],
    "block": 2,
    "note": "",
    "meaning": "enviar",
    "context": "a message",
    "subject": "I"
  },
  {
    "id": "set",
    "forms": [
      "set",
      "set",
      "set"
    ],
    "block": 2,
    "note": "",
    "meaning": "ajustar o poner",
    "context": "the alarm",
    "subject": "I"
  },
  {
    "id": "shake",
    "forms": [
      "shake",
      "shook",
      "shaken"
    ],
    "block": 2,
    "note": "",
    "meaning": "agitar",
    "context": "the bottle",
    "subject": "I"
  },
  {
    "id": "shine",
    "forms": [
      "shine",
      "shone/shined",
      "shone/shined"
    ],
    "block": 2,
    "note": "",
    "meaning": "brillar",
    "context": "brightly",
    "subject": "The star"
  },
  {
    "id": "shoot",
    "forms": [
      "shoot",
      "shot",
      "shot"
    ],
    "block": 2,
    "note": "",
    "meaning": "disparar",
    "context": "at the target",
    "subject": "I"
  },
  {
    "id": "show",
    "forms": [
      "show",
      "showed",
      "shown/showed"
    ],
    "block": 3,
    "note": "",
    "meaning": "mostrar",
    "context": "her my drawing",
    "subject": "I"
  },
  {
    "id": "shut",
    "forms": [
      "shut",
      "shut",
      "shut"
    ],
    "block": 3,
    "note": "",
    "meaning": "cerrar",
    "context": "the window",
    "subject": "I"
  },
  {
    "id": "sing",
    "forms": [
      "sing",
      "sang",
      "sung"
    ],
    "block": 3,
    "note": "",
    "meaning": "cantar",
    "context": "a song",
    "subject": "I"
  },
  {
    "id": "sink",
    "forms": [
      "sink",
      "sank",
      "sunk"
    ],
    "block": 3,
    "note": "",
    "meaning": "hundir",
    "context": "the toy boat",
    "subject": "I"
  },
  {
    "id": "sit",
    "forms": [
      "sit",
      "sat",
      "sat"
    ],
    "block": 3,
    "note": "",
    "meaning": "sentarse",
    "context": "on the bench",
    "subject": "I"
  },
  {
    "id": "sleep",
    "forms": [
      "sleep",
      "slept",
      "slept"
    ],
    "block": 3,
    "note": "",
    "meaning": "dormir",
    "context": "well",
    "subject": "I"
  },
  {
    "id": "smell",
    "forms": [
      "smell",
      "smelt/smelled",
      "smelt/smelled"
    ],
    "block": 3,
    "note": "",
    "meaning": "oler",
    "context": "the flowers",
    "subject": "I"
  },
  {
    "id": "speak",
    "forms": [
      "speak",
      "spoke",
      "spoken"
    ],
    "block": 3,
    "note": "",
    "meaning": "hablar",
    "context": "to my teacher",
    "subject": "I"
  },
  {
    "id": "spell",
    "forms": [
      "spell",
      "spelt/spelled",
      "spelt/spelled"
    ],
    "block": 3,
    "note": "",
    "meaning": "deletrear",
    "context": "my name",
    "subject": "I"
  },
  {
    "id": "spend",
    "forms": [
      "spend",
      "spent",
      "spent"
    ],
    "block": 3,
    "note": "",
    "meaning": "gastar o pasar tiempo",
    "context": "an hour reading",
    "subject": "I"
  },
  {
    "id": "stand",
    "forms": [
      "stand",
      "stood",
      "stood"
    ],
    "block": 3,
    "note": "",
    "meaning": "estar de pie",
    "context": "near the door",
    "subject": "I"
  },
  {
    "id": "steal",
    "forms": [
      "steal",
      "stole",
      "stolen"
    ],
    "block": 3,
    "note": "",
    "meaning": "robar",
    "context": "the treasure",
    "subject": "I"
  },
  {
    "id": "stick",
    "forms": [
      "stick",
      "stuck",
      "stuck"
    ],
    "block": 3,
    "note": "",
    "meaning": "pegar",
    "context": "the label on the box",
    "subject": "I"
  },
  {
    "id": "sting",
    "forms": [
      "sting",
      "stung",
      "stung"
    ],
    "block": 3,
    "note": "",
    "meaning": "picar",
    "context": "my hand",
    "subject": "The bee"
  },
  {
    "id": "sweep",
    "forms": [
      "sweep",
      "swept",
      "swept"
    ],
    "block": 3,
    "note": "",
    "meaning": "barrer",
    "context": "the floor",
    "subject": "I"
  },
  {
    "id": "swim",
    "forms": [
      "swim",
      "swam",
      "swum"
    ],
    "block": 3,
    "note": "",
    "meaning": "nadar",
    "context": "in the pool",
    "subject": "I"
  },
  {
    "id": "take",
    "forms": [
      "take",
      "took",
      "taken"
    ],
    "block": 3,
    "note": "",
    "meaning": "tomar o llevar",
    "context": "the bus",
    "subject": "I"
  },
  {
    "id": "teach",
    "forms": [
      "teach",
      "taught",
      "taught"
    ],
    "block": 3,
    "note": "",
    "meaning": "enseñar",
    "context": "English",
    "subject": "I"
  },
  {
    "id": "tear",
    "forms": [
      "tear",
      "tore",
      "torn"
    ],
    "block": 3,
    "note": "",
    "meaning": "rasgar",
    "context": "the paper",
    "subject": "I"
  },
  {
    "id": "tell",
    "forms": [
      "tell",
      "told",
      "told"
    ],
    "block": 3,
    "note": "",
    "meaning": "contar o decir",
    "context": "her the truth",
    "subject": "I"
  },
  {
    "id": "think",
    "forms": [
      "think",
      "thought",
      "thought"
    ],
    "block": 3,
    "note": "",
    "meaning": "pensar",
    "context": "about the answer",
    "subject": "I"
  },
  {
    "id": "throw",
    "forms": [
      "throw",
      "threw",
      "thrown"
    ],
    "block": 3,
    "note": "",
    "meaning": "lanzar",
    "context": "the ball",
    "subject": "I"
  },
  {
    "id": "understand",
    "forms": [
      "understand",
      "understood",
      "understood"
    ],
    "block": 3,
    "note": "",
    "meaning": "entender",
    "context": "the question",
    "subject": "I"
  },
  {
    "id": "wake up",
    "forms": [
      "wake up",
      "woke up",
      "woken up"
    ],
    "block": 3,
    "note": "",
    "meaning": "despertarse",
    "context": "early",
    "subject": "I"
  },
  {
    "id": "wear",
    "forms": [
      "wear",
      "wore",
      "worn"
    ],
    "block": 3,
    "note": "",
    "meaning": "llevar puesto",
    "context": "a red coat",
    "subject": "I"
  },
  {
    "id": "win",
    "forms": [
      "win",
      "won",
      "won"
    ],
    "block": 3,
    "note": "",
    "meaning": "ganar",
    "context": "the match",
    "subject": "I"
  },
  {
    "id": "write",
    "forms": [
      "write",
      "wrote",
      "written"
    ],
    "block": 3,
    "note": "",
    "meaning": "escribir",
    "context": "a letter",
    "subject": "I"
  }
];
export const EXAMS = [
  {name:'Be–Drive',date:'2026-10-07',label:'7 octubre',block:0},
  {name:'Eat–Lend',date:'2026-10-14',label:'14 octubre',block:1},
  {name:'Let–Shoot',date:'2026-10-21',label:'21 octubre',block:2},
  {name:'Show–Write',date:'2026-10-28',label:'28 octubre',block:3},
];
export const PETS = [
  {id:'lumio',name:'Lumio',kind:'Guardián del fuego',primary:'#ed817a',secondary:'#ffe5a8',description:'Curioso, valiente y un poquito distraído.',stages:['Lumio','Lumir','Lumion']},
  {id:'nyx',name:'Nyx',kind:'Guardián de las mareas',primary:'#68b6e7',secondary:'#ffe195',description:'Pequeño, tranquilo y lleno de magia.',stages:['Nyx','Nyxel','Nyxora']},
  {id:'bruma',name:'Bruma',kind:'Espíritu del bosque',primary:'#9dcc69',secondary:'#b47bdd',description:'Su energía crece con cada nuevo descubrimiento.',stages:['Bruma','Brumel','Brumara']},
  {id:'luma',name:'Luma',kind:'Zorro lunar',primary:'#b391e5',secondary:'#f6bea6',description:'Guarda pequeños destellos de luna.',stages:['Luma','Lumara'],collectible:true,rarity:'Común',rarityClass:'common',weight:35},
  {id:'nimbo',name:'Nimbo',kind:'Ajolote de las nubes',primary:'#78cdbd',secondary:'#ffda76',description:'Lleva una nube suave a cada aventura.',stages:['Nimbo','Nimbora'],collectible:true,rarity:'Común',rarityClass:'common',weight:30},
  {id:'gema',name:'Gema',kind:'Tortuga de cristal',primary:'#eeaa91',secondary:'#68bdc3',description:'Su caparazón brilla con cada descubrimiento.',stages:['Gema','Gemaria'],collectible:true,rarity:'Poco común',rarityClass:'uncommon',weight:20},
  {id:'vesper',name:'Vesper',kind:'Murciélago estelar',primary:'#8582ce',secondary:'#e6a1bd',description:'Dibuja constelaciones con sus alas.',stages:['Vesper','Vesperion'],collectible:true,rarity:'Rara',rarityClass:'rare',weight:12},
  {id:'astra',name:'Astra',kind:'Grifo celestial',primary:'#e8ba57',secondary:'#b299df',description:'Una criatura legendaria de luz y estrellas.',stages:['Astra','Astralis'],collectible:true,rarity:'Legendaria',rarityClass:'legendary',weight:3},
];
PETS.push(...eggSpecies);
export const GAMES = [
  {id:'recall',name:'Memoria activa',tag:'ESCRIBE',icon:'brain',price:0,color:'purple',description:'Recuerda las formas sin ninguna pista.'},
  {id:'portals',name:'Verbs Translator',tag:'TRADUCE',icon:'book',price:40,color:'mint',description:'Del español al inglés. Cambia de sentido cuando quieras.'},
  {id:'chain',name:'Cadena de formas',tag:'ORDENA',icon:'chain',price:70,color:'peach',description:'Construye infinitivo, pasado y participio.'},
  {id:'detective',name:'Cazafallos',tag:'CORRIGE',icon:'search',price:100,color:'pink',description:'Encuentra al intruso y repara la cadena.'},
  {id:'roulette',name:'Ruleta verbal',tag:'GIRA Y COMPLETA',icon:'roulette',price:140,color:'blue',description:'Gira la ruleta y completa las formas de cinco verbos. Recorre todo tu examen.'},
];
