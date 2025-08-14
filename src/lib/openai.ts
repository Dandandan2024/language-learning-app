import OpenAI from 'openai';
import { SentenceGeneration } from './core/schemas';

let openaiClient: OpenAI | null = null;

function getOpenAI(): OpenAI {
  if (openaiClient) return openaiClient;
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is required to generate sentences');
  }
  openaiClient = new OpenAI({ apiKey });
  return openaiClient;
}

export interface GenerateSentenceRequest {
  lexeme: string;
  pos?: string;
  cefr: CEFR;
  targetLanguage: string;
  nativeLanguage: string;
}

export type CEFR = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export async function generateSentence(request: GenerateSentenceRequest): Promise<SentenceGeneration> {
  const { lexeme, pos, cefr, targetLanguage, nativeLanguage } = request;
  
  const prompt = `Generate a sentence in ${targetLanguage} that includes the word "${lexeme}"${pos ? ` (${pos})` : ''} at CEFR level ${cefr}.

CEFR level guidelines:
- A1: Very basic, everyday expressions
- A2: Basic personal and family information, shopping, local geography
- B1: Simple connected text on familiar topics
- B2: Clear, detailed text on a wide range of subjects
- C1: Complex text with implicit meaning
- C2: Very complex text, understanding virtually everything

Strict constraints:
- Use a single, simple sentence (one independent clause). Avoid commas and semicolons.
- Use only very common, everyday words at the learner's level. Avoid rare/academic/idiomatic words.
- Prefer present tense and simple aspect unless the target word requires otherwise.
- Keep the sentence short for the specified level:
  • A1–A2: ≤ 9 words and ≤ 70 characters
  • B1: ≤ 12 words and ≤ 90 characters
  • B2: ≤ 15 words and ≤ 110 characters
  • C1–C2: ≤ 18 words and ≤ 130 characters
- The sentence must still include "${lexeme}" naturally.
- Provide a concise translation in ${nativeLanguage}.

Return the response as a JSON object with these exact fields:
{
  "sentence_l2": "the sentence in ${targetLanguage}",
  "sentence_l1": "the translation in ${nativeLanguage}",
  "target_form": "the specific form of ${lexeme} used (if different from base form)",
  "cefr": "${cefr}",
  "notes": "brief explanation of why this sentence fits the CEFR level"
}`;

  try {
    const completion = await getOpenAI().chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a language learning expert. Generate natural, level-appropriate sentences for language learners. Always respond with valid JSON. Prefer short, simple sentences and high-frequency vocabulary appropriate to the specified CEFR level."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.4,
      max_tokens: 200,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    // Try to parse the JSON response
    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch (parseError) {
      // If JSON parsing fails, try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Failed to parse OpenAI response as JSON');
      }
    }

    // Validate the response against our schema
    const result = SentenceSchema.parse(parsed);
    return result;
  } catch (error) {
    console.error('OpenAI sentence generation error:', error);
    throw new Error('Failed to generate sentence');
  }
}

// Import the schema for validation
import { SentenceSchema } from './core/schemas';