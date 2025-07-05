/**
 * TheRoundTable Conversation Flow Manager (TypeScript)
 * 
 * This module manages the flow of conversations in TheRoundTable application,
 * ensuring consistent behavior and responses across both backend and frontend.
 */

import { v4 as uuidv4 } from 'uuid';
import {
  Character,
  getDefaultCharacterById,
  generateFallbackResponse,
  formatAIRequestParams,
  isValidAPIKey
} from './conversation-manager';

// Response type for character messages
export interface CharacterResponse {
  id: string;
  characterId: string;
  name: string;
  content: string;
  timestamp: string;
}

// Configuration options for the flow manager
export interface ConversationFlowManagerOptions {
  aiClient: any; // AI client (e.g., OpenAI instance)
  dynamoDB?: any; // DynamoDB client
  redisClient?: any; // Redis client
  logger?: any; // Logger
  tableName?: string; // DynamoDB table name for conversations
}

// Parameters for processing a message
export interface ProcessMessageParams {
  message: string;
  characters: string[];
  conversationId?: string;
  options?: Record<string, any>;
}

// Result of processing a message
export interface ProcessMessageResult {
  conversationId: string;
  responses: CharacterResponse[];
}

/**
 * Conversation Flow Manager
 * Handles the conversation flow in a consistent manner across backend and frontend
 */
export class ConversationFlowManager {
  private aiClient: any;
  private dynamoDB?: any;
  private redisClient?: any;
  private logger: any;
  private tableName: string;

  /**
   * Create a new ConversationFlowManager
   * @param options Configuration options
   */
  constructor(options: ConversationFlowManagerOptions) {
    this.aiClient = options.aiClient;
    this.dynamoDB = options.dynamoDB;
    this.redisClient = options.redisClient;
    this.logger = options.logger || console;
    this.tableName = options.tableName || 'TheRoundTable-Conversations';
  }

  /**
   * Process a user message and generate character responses
   * @param params Processing parameters
   * @returns Processing result with conversationId and responses
   */
  async processMessage(params: ProcessMessageParams): Promise<ProcessMessageResult> {
    const { message, characters, conversationId = uuidv4(), options = {} } = params;
    
    this.logger.info(`Processing message for conversation ${conversationId} with characters: ${characters.join(', ')}`);

    try {
      // Validate input
      if (!message || !characters || !Array.isArray(characters) || characters.length === 0) {
        throw new Error('Invalid request. Please provide a message and at least one character ID.');
      }

      // Get character details
      const characterDetails = await this.getCharacterDetails(characters);
      
      // Check if AI client is available
      const useAI = !!this.aiClient;
      
      // Generate responses from each character
      const responses = await Promise.all(characterDetails.map(async (character) => {
        try {
          const characterId = character.characterId || character.id;
          const name = character.name || `Character ${characterId}`;
          
          // Generate content based on character
          let content: string;
          
          if (useAI) {
            // Generate using AI
            content = await this.generateAIResponse(message, character, options);
          } else {
            // Use fallback response generation
            content = generateFallbackResponse(message, character);
          }
          
          return {
            id: uuidv4(),
            characterId,
            name,
            content,
            timestamp: new Date().toISOString()
          };
        } catch (error) {
          this.logger.error(`Error generating response for character ${character.name}:`, error);
          
          // Return a fallback response on error
          return {
            id: uuidv4(),
            characterId: character.characterId || character.id,
            name: character.name || `Character ${character.characterId || character.id}`,
            content: `As ${character.name}, I'm afraid I cannot respond at the moment due to technical difficulties.`,
            timestamp: new Date().toISOString()
          };
        }
      }));

      // Store conversation in database if available
      if (this.dynamoDB) {
        await this.saveConversation(conversationId, message, responses);
      }

      // Cache in Redis if available
      if (this.redisClient) {
        await this.cacheConversation(conversationId, message, responses);
      }

      return {
        conversationId,
        responses
      };
    } catch (error) {
      this.logger.error(`Error processing message for conversation ${conversationId}:`, error);
      throw error;
    }
  }

  /**
   * Get character details (from database or defaults)
   * @param characterIds Array of character IDs
   * @returns Array of character details
   */
  async getCharacterDetails(characterIds: string[]): Promise<Character[]> {
    return Promise.all(
      characterIds.map(async (characterId) => {
        try {
          if (this.dynamoDB) {
            // Try to fetch from DynamoDB if available
            const characterData = await this.fetchCharacterFromDB(characterId);
            if (characterData) {
              return characterData;
            }
          }
        } catch (error) {
          this.logger.warn(`Failed to get character details for ID ${characterId}:`, error);
        }
        
        // Fallback to default character details
        return getDefaultCharacterById(characterId);
      })
    );
  }

  /**
   * Fetch character from database
   * @param characterId Character ID
   * @returns Character data or null if not found
   */
  async fetchCharacterFromDB(characterId: string): Promise<Character | null> {
    // This implementation will depend on your database schema
    // Example for DynamoDB with AWS SDK v3
    if (!this.dynamoDB) return null;
    
    try {
      // Try with characterId as primary key
      const params = {
        TableName: 'TheRoundTable-Characters',
        Key: { characterId }
      };
      
      const result = await this.dynamoDB.get(params).promise();
      
      if (result.Item) {
        return result.Item as Character;
      }
      
      // Try with id as primary key
      const paramsAlt = {
        TableName: 'TheRoundTable-Characters',
        Key: { id: characterId }
      };
      
      const resultAlt = await this.dynamoDB.get(paramsAlt).promise();
      
      if (resultAlt.Item) {
        return resultAlt.Item as Character;
      }
      
      return null;
    } catch (error) {
      this.logger.error(`DB error fetching character ${characterId}:`, error);
      return null;
    }
  }

  /**
   * Generate response using AI client
   * @param message User message
   * @param character Character data
   * @param options Additional options
   * @returns Generated response
   */
  async generateAIResponse(message: string, character: Character, options: Record<string, any> = {}): Promise<string> {
    try {
      const aiParams = formatAIRequestParams(message, character, options);
      
      const response = await this.aiClient.createChatCompletion(aiParams);
      
      return response.choices[0]?.message?.content?.trim() || 
        `As ${character.name}, I find your question most intriguing, but I'm unable to provide a detailed response at this moment.`;
    } catch (error) {
      this.logger.error(`AI generation error for ${character.name}:`, error);
      return generateFallbackResponse(message, character);
    }
  }

  /**
   * Save conversation to database
   * @param conversationId Conversation ID
   * @param message User message
   * @param responses Character responses
   */
  async saveConversation(
    conversationId: string, 
    message: string, 
    responses: CharacterResponse[]
  ): Promise<void> {
    if (!this.dynamoDB) return;
    
    try {
      const timestamp = new Date().toISOString();
      
      const conversationItem = {
        conversationId,
        timestamp,
        message,
        responses,
        updatedAt: timestamp
      };
      
      await this.dynamoDB.put({
        TableName: this.tableName,
        Item: conversationItem
      }).promise();
      
      this.logger.info(`Saved conversation ${conversationId} to database`);
    } catch (error) {
      this.logger.error(`Error saving conversation ${conversationId} to database:`, error);
    }
  }

  /**
   * Cache conversation in Redis
   * @param conversationId Conversation ID
   * @param message User message
   * @param responses Character responses
   */
  async cacheConversation(
    conversationId: string, 
    message: string, 
    responses: CharacterResponse[]
  ): Promise<void> {
    if (!this.redisClient) return;
    
    try {
      const cacheKey = `conversation:${conversationId}`;
      const cacheData = JSON.stringify({
        conversationId,
        message,
        responses,
        timestamp: new Date().toISOString()
      });
      
      await this.redisClient.set(cacheKey, cacheData, 'EX', 3600); // 1 hour expiration
      
      this.logger.info(`Cached conversation ${conversationId} in Redis`);
    } catch (error) {
      this.logger.error(`Error caching conversation ${conversationId} in Redis:`, error);
    }
  }

  /**
   * Get conversation history
   * @param conversationId Conversation ID
   * @returns Conversation history or null if not found
   */
  async getConversationHistory(conversationId: string): Promise<Record<string, any> | null> {
    try {
      // Try to get from Redis cache first
      if (this.redisClient) {
        const cacheKey = `conversation:${conversationId}`;
        const cachedData = await this.redisClient.get(cacheKey);
        
        if (cachedData) {
          this.logger.info(`Retrieved conversation ${conversationId} from cache`);
          return JSON.parse(cachedData);
        }
      }
      
      // If not in cache, try to get from database
      if (this.dynamoDB) {
        const result = await this.dynamoDB.get({
          TableName: this.tableName,
          Key: { conversationId }
        }).promise();
        
        if (result.Item) {
          this.logger.info(`Retrieved conversation ${conversationId} from database`);
          
          // Cache for future requests if Redis is available
          if (this.redisClient) {
            const cacheKey = `conversation:${conversationId}`;
            await this.redisClient.set(cacheKey, JSON.stringify(result.Item), 'EX', 3600);
          }
          
          return result.Item;
        }
      }
      
      this.logger.warn(`Conversation ${conversationId} not found`);
      return null;
    } catch (error) {
      this.logger.error(`Error retrieving conversation ${conversationId}:`, error);
      return null;
    }
  }
}
