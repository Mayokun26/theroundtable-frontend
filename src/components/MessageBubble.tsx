import React from 'react';
import styled, { keyframes } from 'styled-components';

interface MessageProps {
  content: string;
  sender: 'user' | 'character';
  character?: {
    id: string;
    name: string;
  };
  timestamp: string;
}

const riseIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const MessageContainer = styled.div<{ $isUser: boolean }>`
  display: flex;
  flex-direction: column;
  max-width: 82%;
  margin-bottom: 14px;
  align-self: ${(props) => (props.$isUser ? 'flex-end' : 'flex-start')};
  animation: ${riseIn} 240ms ease-out;

  @media (max-width: 700px) {
    max-width: 92%;
    margin-bottom: 10px;
  }
`;

const MessageBubble = styled.div<{ $isUser: boolean }>`
  padding: 11px 14px;
  border-radius: 12px;
  background: ${(props) =>
    props.$isUser
      ? 'linear-gradient(160deg, #e8f0e7 0%, #dceada 100%)'
      : 'linear-gradient(160deg, #f8ebd5 0%, #f2e1c5 100%)'};
  color: #302116;
  margin-top: 4px;
  position: relative;
  border-bottom-right-radius: ${(props) => (props.$isUser ? '5px' : '12px')};
  border-bottom-left-radius: ${(props) => (props.$isUser ? '12px' : '5px')};
  border: 1px solid
    ${(props) => (props.$isUser ? 'rgba(72, 105, 80, 0.25)' : 'rgba(111, 68, 39, 0.24)')};
  line-height: 1.38;
`;

const MessageSender = styled.div<{ $isUser: boolean }>`
  font-weight: 700;
  font-size: 0.8rem;
  color: ${(props) => (props.$isUser ? '#365245' : '#6f4427')};
  letter-spacing: 0.2px;
`;

const MessageTime = styled.div`
  font-size: 0.72rem;
  color: #8a6f5a;
  margin-top: 4px;
  align-self: flex-end;
`;

const MessageBubbleComponent: React.FC<MessageProps> = ({ content, sender, character, timestamp }) => {
  const isUser = sender === 'user';
  const senderName = isUser ? 'You' : character?.name || 'Unknown';

  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
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
