import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Create sample lexemes with different CEFR levels
  const lexemes = [
    // A1 Level
    { lemma: 'hello', pos: 'interjection', freqRank: 1, cefr: 'A1', forms: ['hello', 'hi'] },
    { lemma: 'good', pos: 'adjective', freqRank: 2, cefr: 'A1', forms: ['good', 'better', 'best'] },
    { lemma: 'water', pos: 'noun', freqRank: 3, cefr: 'A1', forms: ['water', 'waters'] },
    { lemma: 'eat', pos: 'verb', freqRank: 4, cefr: 'A1', forms: ['eat', 'eats', 'eating', 'ate', 'eaten'] },
    { lemma: 'house', pos: 'noun', freqRank: 5, cefr: 'A1', forms: ['house', 'houses'] },
    
    // A2 Level
    { lemma: 'because', pos: 'conjunction', freqRank: 50, cefr: 'A2', forms: ['because'] },
    { lemma: 'understand', pos: 'verb', freqRank: 51, cefr: 'A2', forms: ['understand', 'understands', 'understanding', 'understood'] },
    { lemma: 'friend', pos: 'noun', freqRank: 52, cefr: 'A2', forms: ['friend', 'friends'] },
    { lemma: 'important', pos: 'adjective', freqRank: 53, cefr: 'A2', forms: ['important', 'more important', 'most important'] },
    
    // B1 Level
    { lemma: 'suggest', pos: 'verb', freqRank: 200, cefr: 'B1', forms: ['suggest', 'suggests', 'suggesting', 'suggested'] },
    { lemma: 'opinion', pos: 'noun', freqRank: 201, cefr: 'B1', forms: ['opinion', 'opinions'] },
    { lemma: 'probably', pos: 'adverb', freqRank: 202, cefr: 'B1', forms: ['probably'] },
    { lemma: 'experience', pos: 'noun', freqRank: 203, cefr: 'B1', forms: ['experience', 'experiences'] },
    
    // B2 Level
    { lemma: 'despite', pos: 'preposition', freqRank: 500, cefr: 'B2', forms: ['despite'] },
    { lemma: 'achieve', pos: 'verb', freqRank: 501, cefr: 'B2', forms: ['achieve', 'achieves', 'achieving', 'achieved'] },
    { lemma: 'significant', pos: 'adjective', freqRank: 502, cefr: 'B2', forms: ['significant', 'more significant', 'most significant'] },
    
    // C1 Level
    { lemma: 'nevertheless', pos: 'adverb', freqRank: 1000, cefr: 'C1', forms: ['nevertheless'] },
    { lemma: 'contemplate', pos: 'verb', freqRank: 1001, cefr: 'C1', forms: ['contemplate', 'contemplates', 'contemplating', 'contemplated'] },
  ];

  // Create lexemes
  for (const lexeme of lexemes) {
    const created = await prisma.lexeme.upsert({
      where: { id: `seed-${lexeme.lemma}` },
      update: {},
      create: {
        id: `seed-${lexeme.lemma}`,
        ...lexeme
      }
    });
    console.log(`Created lexeme: ${created.lemma}`);
  }

  // Create sample sentences for placement (seed sentences)
  const seedSentences = [
    // A1 sentences
    { lexemeId: 'seed-hello', textL2: 'Hello, how are you?', textL1: 'Hola, ¿cómo estás?', cefr: 'A1', difficulty: 0.1, targetForm: 'hello' },
    { lexemeId: 'seed-good', textL2: 'This is good food.', textL1: 'Esta es buena comida.', cefr: 'A1', difficulty: 0.15, targetForm: 'good' },
    { lexemeId: 'seed-water', textL2: 'I drink water every day.', textL1: 'Bebo agua todos los días.', cefr: 'A1', difficulty: 0.2, targetForm: 'water' },
    
    // A2 sentences
    { lexemeId: 'seed-because', textL2: 'I study because I want to learn.', textL1: 'Estudio porque quiero aprender.', cefr: 'A2', difficulty: 0.3, targetForm: 'because' },
    { lexemeId: 'seed-understand', textL2: 'I understand what you mean.', textL1: 'Entiendo lo que quieres decir.', cefr: 'A2', difficulty: 0.35, targetForm: 'understand' },
    
    // B1 sentences
    { lexemeId: 'seed-suggest', textL2: 'I suggest we meet tomorrow.', textL1: 'Sugiero que nos encontremos mañana.', cefr: 'B1', difficulty: 0.5, targetForm: 'suggest' },
    { lexemeId: 'seed-opinion', textL2: 'In my opinion, this is correct.', textL1: 'En mi opinión, esto es correcto.', cefr: 'B1', difficulty: 0.55, targetForm: 'opinion' },
    
    // B2 sentences
    { lexemeId: 'seed-despite', textL2: 'Despite the rain, we went outside.', textL1: 'A pesar de la lluvia, salimos.', cefr: 'B2', difficulty: 0.7, targetForm: 'despite' },
    { lexemeId: 'seed-achieve', textL2: 'You can achieve your goals with hard work.', textL1: 'Puedes lograr tus metas con trabajo duro.', cefr: 'B2', difficulty: 0.75, targetForm: 'achieve' },
  ];

  // Create sentences
  for (const sentence of seedSentences) {
    const uniqueHash = Buffer.from(`${sentence.lexemeId}-${sentence.textL2}`).toString('base64').slice(0, 16);
    
    const created = await prisma.sentence.upsert({
      where: { uniqueHash },
      update: {},
      create: {
        targetLexemeId: sentence.lexemeId,
        textL2: sentence.textL2,
        textL1: sentence.textL1,
        cefr: sentence.cefr,
        difficulty: sentence.difficulty,
        tokens: sentence.textL2.toLowerCase().split(' '),
        source: 'seed',
        targetForm: sentence.targetForm,
        uniqueHash
      }
    });
    console.log(`Created sentence for: ${sentence.targetForm}`);
  }

  console.log('Seed completed!');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
