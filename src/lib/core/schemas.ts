import { z } from "zod";

/**
 * Zod schemas for validation throughout the app
 */

// LLM output schema for sentence generation
export const SentenceSchema = z.object({
  sentence_l2: z.string().min(3).max(160),
  sentence_l1: z.string().min(1).max(200),
  target_form: z.string().optional(),
  cefr: z.enum(["A1", "A2", "B1", "B2", "C1", "C2"]),
  notes: z.string().max(200).optional()
});

export type SentenceGeneration = z.infer<typeof SentenceSchema>;

// API request/response schemas
export const PlacementAnswerSchema = z.object({
  outcome: z.enum(["easy", "hard"]),
  lexemeId: z.string().min(1).optional()
});

export const StudyReviewSchema = z.object({
  cardId: z.string().cuid(),
  rating: z.number().int().min(1).max(4)
});

export const GenerateRequestSchema = z.object({
  lexemeId: z.string().cuid(),
  difficultyHint: z.object({
    cefrBand: z.enum(["A1", "A2", "B1", "B2", "C1", "C2"]),
    theta: z.number().optional()
  })
});

// Settings schema
export const UserSettingsSchema = z.object({
  dailyGoal: z.number().int().min(5).max(200).default(20),
  hideTranslation: z.boolean().default(false),
  enableTTS: z.boolean().default(false),
  language: z.string().default("ru"), // target language code
  nativeLanguage: z.string().default("en")
});

export type UserSettings = z.infer<typeof UserSettingsSchema>;

// Level estimate schema
export const LevelEstimateSchema = z.object({
  cefrBand: z.enum(["A1", "A2", "B1", "B2", "C1", "C2"]),
  vocabIndex: z.number().min(0).max(10),
  confidence: z.number().min(0).max(1)
});

// Lexeme schema for seeding
export const LexemeSchema = z.object({
  lemma: z.string().min(1).max(100),
  pos: z.string().optional(),
  freqRank: z.number().int().min(1),
  cefr: z.enum(["A1", "A2", "B1", "B2", "C1", "C2"]),
  forms: z.array(z.string()).default([]),
  notes: z.string().optional()
});

export type LexemeData = z.infer<typeof LexemeSchema>;

export const AssessmentStartResponse = z.object({
	sessionId: z.string(),
	stage: z.enum(['yesno', 'cat']),
	items: z.array(z.object({
		id: z.string(),
		type: z.enum(['yesno_real', 'yesno_pseudo', 'mc4', 'recall']),
		lexemeId: z.string().optional(),
		lemma: z.string().optional(),
		pseudoword: z.string().optional(),
		g: z.number(),
		b: z.number().optional()
	}))
});

export const AssessmentAnswerRequest = z.object({
	sessionId: z.string(),
	itemId: z.string(),
	y: z.union([z.literal(0), z.literal(1)])
});

export const AssessmentAnswerResponse = z.object({
	continue: z.boolean(),
	stage: z.enum(['yesno', 'cat', 'done']),
	nextItem: z.object({
		id: z.string(),
		type: z.enum(['yesno_real', 'yesno_pseudo', 'mc4', 'recall']),
		lexemeId: z.string().optional(),
		pseudoword: z.string().optional(),
		g: z.number(),
		b: z.number().optional()
	}).nullable()
});

export const AssessmentResultResponse = z.object({
	sessionId: z.string(),
	theta: z.number(),
	SE: z.number(),
	vocabSize: z.number().optional(),
	coverageByZipf: z.array(z.object({ zipf: z.number(), coverage: z.number() })),
	perWord: z.object({
		page: z.number(),
		pageSize: z.number(),
		total: z.number(),
		items: z.array(z.object({
			lexemeId: z.string(),
			p: z.number(),
			ci68: z.tuple([z.number(), z.number()]),
			ci95: z.tuple([z.number(), z.number()])
		}))
	})
});
