import React from 'react';
import styled from 'styled-components';
import { logger } from '../utils/logger';

interface Character {
  id: string;
  name: string;
  category: string;
  era: string;
  description: string;
  traits: string[];
  imageUrl: string;
}

/**
 * Loads and validates a character's image, with proper error handling
 * @param {string} imageUrl - The URL of the character's image
 * @param {string} characterName - The name of the character for error reporting
 * @returns {Promise<HTMLImageElement>} - A promise that resolves to the loaded image
 * @throws {Error} - If the image fails to load or validate
 */
const loadCharacterImage = async (imageUrl: string, characterName: string): Promise<HTMLImageElement> => {
  try {
    const image = new Image();
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error(`Failed to load image for ${characterName}`));
      image.src = imageUrl;
    });
    return image;
  } catch (error) {
    console.error('Image loading failed', { characterName, imageUrl, error });
    throw new Error(`Unable to load character image for ${characterName}`);
  }
};

interface CharacterCardProps {
  character: Character;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const Card = styled.div<{ isSelected: boolean }>`
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: white;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: ${(props) => (props.isSelected ? '2px solid #4285f4' : '1px solid #e0e0e0')};
  transform: ${(props) => (props.isSelected ? 'scale(1.03)' : 'scale(1)')};
  
  &:hover {
    transform: ${(props) => (props.isSelected ? 'scale(1.03)' : 'scale(1.02)')};
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
`;

const CharacterImage = styled.div<{ imageUrl: string }>`
  height: 150px;
  border-radius: 6px;
  background-image: ${(props) => props.imageUrl ? `url(${props.imageUrl})` : 'linear-gradient(135deg, #4285f4, #34a853)'};
  background-size: cover;
  background-position: center;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &::after {
    content: ${(props) => !props.imageUrl ? '"👤"' : '""'};
    font-size: 3rem;
    color: white;
  }
`;

const CharacterName = styled.h3`
  margin: 0 0 8px 0;
  color: #333;
  font-size: 1.2rem;
`;

const CharacterMeta = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 0.9rem;
  color: #666;
`;

const CharacterDescription = styled.p`
  font-size: 0.9rem;
  color: #555;
  margin-bottom: 12px;
`;

const TraitsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const Trait = styled.span`
  background-color: #f0f0f0;
  border-radius: 12px;
  padding: 4px 8px;
  font-size: 0.8rem;
  color: #555;
`;

const CharacterCard: React.FC<CharacterCardProps> = ({ character, isSelected, onSelect }) => {
  return (
    <Card isSelected={isSelected} onClick={() => onSelect(character.id)}>
      <CharacterImage imageUrl={character.imageUrl} />
      <CharacterName>{character.name}</CharacterName>
      <CharacterMeta>
        <span>{character.category}</span>
        <span>{character.era}</span>
      </CharacterMeta>
      <CharacterDescription>{character.description}</CharacterDescription>
      <TraitsList>
        {character.traits.map((trait) => (
          <Trait key={trait}>{trait}</Trait>
        ))}
      </TraitsList>
    </Card>
  );
};

export default CharacterCard;
