import React from 'react';
import styled from 'styled-components';

interface MessageProps {
  content: string;
  sender: 'user' | 'character';
  character?: {
    id: string;
    name: string;
  };
  timestamp: string;
}

const MessageContainer = styled.div<{ $isUser: boolean }>`
  display: flex;
  flex-direction: column;
  max-width: 80%;
  margin-bottom: 16px;
  align-self: ${(props) => (props.$isUser ? 'flex-end' : 'flex-start')};
`;

const MessageBubble = styled.div<{ $isUser: boolean }>`
  padding: 12px 16px;
  border-radius: 12px;
  background-color: ${(props) => (props.$isUser ? '#e3f2fd' : '#f1f1f1')};
  color: #333;
  margin-top: 4px;
  position: relative;
  border-bottom-right-radius: ${(props) => (props.$isUser ? '4px' : '12px')};
  border-bottom-left-radius: ${(props) => (props.$isUser ? '12px' : '4px')};
`;

const MessageSender = styled.div<{ $isUser: boolean }>`
  font-weight: 600;
  font-size: 14px;
  color: ${(props) => (props.$isUser ? '#1976d2' : '#4a6fa5')};
`;

const MessageTime = styled.div`
  font-size: 12px;
  color: #999;
  margin-top: 4px;
  align-self: flex-end;
`;

const MessageBubbleComponent: React.FC<MessageProps> = ({ content, sender, character, timestamp }) => {
  const isUser = sender === 'user';
  const senderName = isUser ? 'You' : character?.name || 'Unknown';
  
  // Format timestamp
  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return '';
    }
  };

  return (
    <MessageContainer $isUser={isUser}>
      <MessageSender $isUser={isUser}>{senderName}</MessageSender>
      <MessageBubble $isUser={isUser}>{content}</MessageBubble>
      <MessageTime>{formatTime(timestamp)}</MessageTime>
    </MessageContainer>
  );
};

export default MessageBubbleComponent; 