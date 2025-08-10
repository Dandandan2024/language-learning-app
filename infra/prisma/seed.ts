import { PrismaClient } from "../../node_modules/.prisma/client";
import { generateUniqueHash, normalizeText } from "../../packages/core/dist/index";

const prisma = new PrismaClient();

// Sample Russian lexemes with CEFR levels and frequency rankings
const lexemes = [
  // A1 Level - Most common words
  { lemma: "быть", pos: "verb", freqRank: 1, cefr: "A1", forms: ["есть", "был", "была", "было", "были"] },
  { lemma: "я", pos: "pronoun", freqRank: 2, cefr: "A1", forms: [] },
  { lemma: "он", pos: "pronoun", freqRank: 3, cefr: "A1", forms: ["она", "оно", "они"] },
  { lemma: "на", pos: "preposition", freqRank: 4, cefr: "A1", forms: [] },
  { lemma: "с", pos: "preposition", freqRank: 5, cefr: "A1", forms: [] },
  { lemma: "не", pos: "particle", freqRank: 6, cefr: "A1", forms: [] },
  { lemma: "что", pos: "pronoun", freqRank: 7, cefr: "A1", forms: [] },
  { lemma: "этот", pos: "pronoun", freqRank: 8, cefr: "A1", forms: ["эта", "это", "эти"] },
  { lemma: "как", pos: "adverb", freqRank: 9, cefr: "A1", forms: [] },
  { lemma: "в", pos: "preposition", freqRank: 10, cefr: "A1", forms: [] },
  
  // A2 Level
  { lemma: "говорить", pos: "verb", freqRank: 50, cefr: "A2", forms: ["говорю", "говорит", "говорят"] },
  { lemma: "дом", pos: "noun", freqRank: 80, cefr: "A2", forms: ["дома", "дому", "домом"] },
  { lemma: "работать", pos: "verb", freqRank: 120, cefr: "A2", forms: ["работаю", "работает"] },
  { lemma: "хотеть", pos: "verb", freqRank: 90, cefr: "A2", forms: ["хочу", "хочет", "хотят"] },
  { lemma: "жить", pos: "verb", freqRank: 110, cefr: "A2", forms: ["живу", "живёт", "живут"] },
  
  // B1 Level
  { lemma: "понимать", pos: "verb", freqRank: 200, cefr: "B1", forms: ["понимаю", "понимает"] },
  { lemma: "изучать", pos: "verb", freqRank: 350, cefr: "B1", forms: ["изучаю", "изучает"] },
  { lemma: "объяснять", pos: "verb", freqRank: 450, cefr: "B1", forms: ["объясняю", "объясняет"] },
  { lemma: "развивать", pos: "verb", freqRank: 500, cefr: "B1", forms: ["развиваю", "развивает"] },
  { lemma: "создавать", pos: "verb", freqRank: 400, cefr: "B1", forms: ["создаю", "создаёт"] },
  
  // B2 Level
  { lemma: "анализировать", pos: "verb", freqRank: 800, cefr: "B2", forms: ["анализирую", "анализирует"] },
  { lemma: "исследование", pos: "noun", freqRank: 1200, cefr: "B2", forms: ["исследования", "исследованию"] },
  { lemma: "эффективный", pos: "adjective", freqRank: 1500, cefr: "B2", forms: ["эффективная", "эффективное"] },
  { lemma: "технология", pos: "noun", freqRank: 1800, cefr: "B2", forms: ["технологии", "технологию"] },
  { lemma: "принцип", pos: "noun", freqRank: 2000, cefr: "B2", forms: ["принципы", "принципа"] },
  
  // C1 Level
  { lemma: "концепция", pos: "noun", freqRank: 3000, cefr: "C1", forms: ["концепции", "концепцию"] },
  { lemma: "интеграция", pos: "noun", freqRank: 3500, cefr: "C1", forms: ["интеграции", "интеграцию"] },
  { lemma: "оптимизировать", pos: "verb", freqRank: 4000, cefr: "C1", forms: ["оптимизирую", "оптимизирует"] },
  { lemma: "структурировать", pos: "verb", freqRank: 4200, cefr: "C1", forms: ["структурирую"] },
  { lemma: "специфический", pos: "adjective", freqRank: 3800, cefr: "C1", forms: ["специфическая"] }
];

// Sample sentences for each lexeme
const sentences = [
  // A1 sentences
  { lemma: "быть", textL2: "Я хочу быть учителем.", textL1: "I want to be a teacher.", targetForm: "быть", cefr: "A1" },
  { lemma: "я", textL2: "Я изучаю русский язык.", textL1: "I am studying Russian.", targetForm: "я", cefr: "A1" },
  { lemma: "он", textL2: "Он читает книгу каждый день.", textL1: "He reads a book every day.", targetForm: "он", cefr: "A1" },
  { lemma: "на", textL2: "Книга лежит на столе.", textL1: "The book lies on the table.", targetForm: "на", cefr: "A1" },
  { lemma: "с", textL2: "Я иду в магазин с другом.", textL1: "I'm going to the store with a friend.", targetForm: "с", cefr: "A1" },
  
  // A2 sentences  
  { lemma: "говорить", textL2: "Мы говорим о работе.", textL1: "We are talking about work.", targetForm: "говорим", cefr: "A2" },
  { lemma: "дом", textL2: "Мой дом находится в центре города.", textL1: "My house is located in the city center.", targetForm: "дом", cefr: "A2" },
  { lemma: "работать", textL2: "Она работает в больнице.", textL1: "She works in a hospital.", targetForm: "работает", cefr: "A2" },
  { lemma: "хотеть", textL2: "Дети хотят играть в парке.", textL1: "The children want to play in the park.", targetForm: "хотят", cefr: "A2" },
  
  // B1 sentences
  { lemma: "понимать", textL2: "Я понимаю основные принципы.", textL1: "I understand the basic principles.", targetForm: "понимаю", cefr: "B1" },
  { lemma: "изучать", textL2: "Студенты изучают новый материал.", textL1: "Students are studying new material.", targetForm: "изучают", cefr: "B1" },
  { lemma: "объяснять", textL2: "Учитель объясняет сложную тему.", textL1: "The teacher explains a complex topic.", targetForm: "объясняет", cefr: "B1" },
  
  // B2 sentences
  { lemma: "анализировать", textL2: "Мы анализируем результаты исследования.", textL1: "We are analyzing the research results.", targetForm: "анализируем", cefr: "B2" },
  { lemma: "технология", textL2: "Новая технология изменит индустрию.", textL1: "New technology will change the industry.", targetForm: "технология", cefr: "B2" },
  { lemma: "эффективный", textL2: "Это очень эффективный метод обучения.", textL1: "This is a very effective teaching method.", targetForm: "эффективный", cefr: "B2" },
  
  // C1 sentences
  { lemma: "концепция", textL2: "Эта концепция требует глубокого понимания.", textL1: "This concept requires deep understanding.", targetForm: "концепция", cefr: "C1" },
  { lemma: "интеграция", textL2: "Интеграция систем проходит успешно.", textL1: "Systems integration is proceeding successfully.", targetForm: "интеграция", cefr: "C1" }
];

async function main() {
  console.log("🌱 Starting database seed...");

  // Clear existing data
  console.log("🧹 Cleaning existing data...");
  await prisma.review.deleteMany();
  await prisma.lexemeState.deleteMany();
  await prisma.card.deleteMany();
  await prisma.sentence.deleteMany();
  await prisma.lexeme.deleteMany();

  // Create lexemes
  console.log("📝 Creating lexemes...");
  const createdLexemes = new Map();
  
  for (const lexeme of lexemes) {
    const created = await prisma.lexeme.create({
      data: {
        lemma: lexeme.lemma,
        pos: lexeme.pos,
        freqRank: lexeme.freqRank,
        cefr: lexeme.cefr,
        forms: lexeme.forms,
        notes: `Common ${lexeme.pos} used in ${lexeme.cefr} level Russian`
      }
    });
    createdLexemes.set(lexeme.lemma, created);
    console.log(`  ✓ Created lexeme: ${lexeme.lemma} (${lexeme.cefr})`);
  }

  // Create sentences
  console.log("📚 Creating sentences...");
  for (const sentence of sentences) {
    const lexeme = createdLexemes.get(sentence.lemma);
    if (!lexeme) {
      console.log(`  ⚠️  Lexeme not found for sentence: ${sentence.lemma}`);
      continue;
    }

    const normalizedText = normalizeText(sentence.textL2);
    const uniqueHash = generateUniqueHash(normalizedText);

    await prisma.sentence.create({
      data: {
        targetLexemeId: lexeme.id,
        textL2: sentence.textL2,
        textL1: sentence.textL1,
        cefr: sentence.cefr,
        difficulty: 0.5, // Default difficulty
        tokens: sentence.textL2.split(' '),
        source: 'seed',
        targetForm: sentence.targetForm,
        uniqueHash: uniqueHash,
        notes: `Seed sentence for ${sentence.lemma}`
      }
    });
    console.log(`  ✓ Created sentence for: ${sentence.lemma}`);
  }

  console.log("🎉 Database seeded successfully!");
  console.log(`📊 Created ${lexemes.length} lexemes and ${sentences.length} sentences`);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
