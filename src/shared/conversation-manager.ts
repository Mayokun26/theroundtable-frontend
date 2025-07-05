/**
 * TheRoundTable Conversation Manager - Unified utilities for conversation handling (TypeScript)
 * 
 * This shared module provides consistent conversation management logic that can be used
 * by both frontend and backend components of TheRoundTable application.
 */

// Character interface matching both frontend and backend types
export interface Character {
  id: string;
  characterId?: string; // Alternative character ID format (for DynamoDB compatibility)
  name: string;
  era?: string;
  background?: string;
  traits?: string[];
  description?: string; // Frontend focused
  category?: string; // Frontend focused
  imageUrl?: string; // URL to character image (frontend focused)
}

// Message interface matching both frontend and backend types
export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'character';
  character?: {
    id: string;
    name: string;
  };
  timestamp: string;
}

// AI request options
export interface AIRequestOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

// Map of default historical characters with consistent data across frontend and backend
export const defaultCharacters: Record<string, Character> = {
  '1': { 
    id: '1', 
    characterId: '1',
    name: 'Socrates',
    era: 'Ancient Greece',
    traits: ['philosophical', 'questioning'],
    background: 'Classical Greek philosopher credited as one of the founders of Western philosophy.',
    category: 'Philosophy',
    imageUrl: '/images/characters/socrates.jpg'
  },
  '2': { 
    id: '2', 
    characterId: '2',
    name: 'Marie Curie',
    era: 'Modern Era',
    traits: ['scientific', 'determined'],
    background: 'Physicist and chemist who conducted pioneering research on radioactivity.',
    category: 'Science',
    imageUrl: '/images/characters/marie-curie.jpg'
  },
  '3': { 
    id: '3',
    characterId: '3',
    name: 'Sun Tzu',
    era: 'Ancient China',
    traits: ['strategic', 'wise'],
    background: 'Chinese general, military strategist, writer, and philosopher known for "The Art of War".',
    category: 'Strategy',
    imageUrl: '/images/characters/sun-tzu.jpg'
  },
  '4': { 
    id: '4',
    characterId: '4',
    name: 'Leonardo da Vinci',
    era: 'Renaissance',
    traits: ['creative', 'inventive'],
    background: 'Italian polymath of the Renaissance whose areas of interest included invention, drawing, painting, and sculpture.',
    category: 'Art',
    imageUrl: '/images/characters/leonardo.jpg'
  },
  '5': { 
    id: '5',
    characterId: '5',
    name: 'William Shakespeare',
    era: 'Elizabethan Era',
    traits: ['poetic', 'dramatic'],
    background: 'English playwright, poet, and actor, widely regarded as the greatest writer in the English language.',
    category: 'Literature',
    imageUrl: '/images/characters/shakespeare.jpg'
  }
};

/**
 * Get default character data by ID
 * @param id - Character ID 
 * @returns Character object or generic character if ID not found
 */
export function getDefaultCharacterById(id: string): Character {
  return defaultCharacters[id] || { 
    id, 
    characterId: id,
    name: `Character ${id}`,
    traits: ['generic'],
    era: 'Unknown',
    background: 'A historical figure',
    category: 'Other',
    imageUrl: '/images/characters/default.jpg'
  };
}

/**
 * Generate a fallback response for a character when AI service is unavailable
 * @param userMessage - The user's message 
 * @param character - Character data
 * @returns Generated response text
 */
export function generateFallbackResponse(userMessage: string, character: Character): string {
  const characterId = character.characterId || character.id;
  let content = `This is a response from ${character.name} to your message: "${userMessage}"`;
  
  // Generate specific responses based on character
  if (characterId === '1') { // Socrates
    content = `I must question you on this: "${userMessage}". What do you truly mean by that? As I always say, the unexamined life is not worth living.`;
  } else if (characterId === '2') { // Marie Curie
    content = `Interesting question: "${userMessage}". In my scientific observations, I have found that one must never lose curiosity. Nothing in life is to be feared, it is only to be understood.`;
  } else if (characterId === '3') { // Sun Tzu
    content = `When you ask "${userMessage}", you must consider the strategic implications. Know yourself, know your enemy, and you need not fear the result of a hundred battles.`;
  } else if (characterId === '4') { // Leonardo da Vinci
    content = `Your inquiry about "${userMessage}" fascinates me. I believe simplicity is the ultimate sophistication. Let us examine this from multiple perspectives.`;
  } else if (characterId === '5') { // Shakespeare
    content = `To ponder "${userMessage}" or not to ponder, that is the question! All the world's a stage, and all the men and women merely players. Let me share my thoughts on this matter.`;
  } else {
    // For other characters, use their traits and background to inform the response
    if (character.name && character.background) {
      content = `As ${character.name}, ${character.background.split('.')[0]}. I find your question about "${userMessage}" most intriguing.`;
    }
  }
    
  return content;
}

/**
 * Generate system prompt for AI based on character
 * @param character - Character data
 * @returns System prompt for AI
 */
export function generateCharacterSystemPrompt(character: Character): string {
  // Build a prompt that captures the character's persona
  const characterInfo = character.background ? 
    `${character.name} (${character.era || 'Unknown Era'}) who ${character.background}` : 
    `${character.name} from ${character.era || 'Unknown Era'}`;
  
  const traits = character.traits && character.traits.length > 0 ? 
    `Known for being ${character.traits.join(', ')}.` : '';
  
  // Create a system prompt to define the character's voice and knowledge
  return `You are ${characterInfo}. ${traits} 
    Respond as this historical figure would, with their speaking style, knowledge, 
    and perspectives limited to what they would have known in their time period. 
    Keep responses concise (2-3 paragraphs maximum).`;
}

/**
 * Format AI response parameters for API calls
 * @param userMessage - User's message 
 * @param character - Character data
 * @param options - Additional options
 * @returns Formatted parameters for AI API call
 */
export function formatAIRequestParams(
  userMessage: string, 
  character: Character, 
  options: AIRequestOptions = {}
): Record<string, any> {
  const {
    model = "gpt-3.5-turbo",
    temperature = 0.7,
    maxTokens = 200
  } = options;
  
  return {
    model,
    messages: [
      { role: "system", content: generateCharacterSystemPrompt(character) },
      { role: "user", content: userMessage }
    ],
    temperature,
    max_tokens: maxTokens
  };
}

/**
 * Validate API key for AI service
 * @param apiKey - API key to validate
 * @returns Whether the key is valid
 */
export function isValidAPIKey(apiKey: string): boolean {
  // Check for proper OpenAI API key format (starts with 'sk-' or 'sk-proj-')
  return !(!apiKey || 
    apiKey === 'fallback-key' || 
    apiKey.includes('your-openai') || 
    apiKey.includes('test_your_openai_key')) && 
    (apiKey.startsWith('sk-') || apiKey.startsWith('sk-proj-'));
}
