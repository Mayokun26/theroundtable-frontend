import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import MessageBubble from './MessageBubble';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'character';
  character?: {
    id: string;
    name: string;
  };
  timestamp: string;
}

interface ConversationPanelProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  loading: boolean;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: linear-gradient(170deg, #fdf6ea 0%, #f3e6ce 100%);
  border: 1px solid rgba(111, 68, 39, 0.24);
  border-radius: 14px;
  box-shadow: 0 12px 24px rgba(39, 25, 14, 0.14);
  overflow: hidden;
`;

const Header = styled.div`
  background: linear-gradient(90deg, #4d321f 0%, #71472a 100%);
  color: #f7e7cb;
  padding: 14px 18px;
  font-family: 'Cormorant Garamond', serif;
  font-weight: 700;
  letter-spacing: 0.6px;
  font-size: 1.25rem;
  border-bottom: 1px solid rgba(255, 239, 211, 0.24);

  @media (max-width: 700px) {
    font-size: 1.05rem;
    padding: 12px 14px;
  }
`;

const MessagesContainer = styled.div`
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, rgba(251, 242, 223, 0.72) 0%, rgba(250, 239, 214, 0.86) 100%);

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(111, 68, 39, 0.28);
    border-radius: 8px;
  }

  @media (max-width: 700px) {
    padding: 12px;
  }
`;

const InputContainer = styled.div`
  display: flex;
  padding: 12px;
  border-top: 1px solid rgba(111, 68, 39, 0.2);
  background: rgba(251, 240, 216, 0.9);

  @media (max-width: 700px) {
    padding: 10px;
    gap: 8px;
  }
`;

const Input = styled.input`
  flex: 1;
  padding: 11px 14px;
  border: 1px solid rgba(111, 68, 39, 0.3);
  background: rgba(255, 250, 240, 0.96);
  border-radius: 24px;
  font-size: 0.98rem;
  color: #3d2a1b;
  outline: none;

  &::placeholder {
    color: #7b5f4b;
  }

  &:focus {
    border-color: rgba(111, 68, 39, 0.6);
    box-shadow: 0 0 0 2px rgba(111, 68, 39, 0.12);
  }

  @media (max-width: 700px) {
    font-size: 0.95rem;
    padding: 10px 12px;
  }
`;

const SendButton = styled.button<{ disabled: boolean }>`
  margin-left: 10px;
  padding: 10px 14px;
  background: ${(props) =>
    props.disabled
      ? 'linear-gradient(135deg, #ccbba2 0%, #c4b29a 100%)'
      : 'linear-gradient(135deg, #6f4427 0%, #8a5a39 100%)'};
  color: #f9ecd7;
  border: none;
  border-radius: 22px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  transition: transform 0.18s ease, box-shadow 0.18s ease;

  &:hover {
    transform: ${(props) => (props.disabled ? 'none' : 'translateY(-1px)')};
    box-shadow: ${(props) =>
      props.disabled ? 'none' : '0 8px 14px rgba(47, 30, 18, 0.24)'};
  }

  @media (max-width: 700px) {
    margin-left: 0;
    padding: 9px 12px;
    min-width: 74px;
  }
`;

const LoadingIndicator = styled.div`
  display: inline-flex;
  align-items: center;
  margin: 8px 0;
  color: #654730;
  font-weight: 600;
  font-size: 0.92rem;

  &::after {
    content: '...';
    animation: dots 1.5s infinite;
    font-weight: 700;
    min-width: 18px;
  }

  @keyframes dots {
    0%,
    20% {
      content: '.';
    }
    40% {
      content: '..';
    }
    60%,
    100% {
      content: '...';
    }
  }
`;

const ConversationPanel: React.FC<ConversationPanelProps> = ({ messages, onSendMessage, loading }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !loading) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <Container>
      <Header>Round Table Conversation</Header>
      <MessagesContainer>
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            content={message.content}
            sender={message.sender}
            character={message.character}
            timestamp={message.timestamp}
          />
        ))}
        {loading && <LoadingIndicator>The panel is thinking</LoadingIndicator>}
        <div ref={messagesEndRef} />
      </MessagesContainer>
      <form onSubmit={handleSubmit}>
        <InputContainer>
          <Input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask the round table..."
            disabled={loading}
          />
          <SendButton type="submit" disabled={loading || !input.trim()}>
            Send
          </SendButton>
        </InputContainer>
      </form>
    </Container>
  );
};

export default ConversationPanel;
