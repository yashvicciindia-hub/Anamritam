import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowRight, Leaf, MessageCircle, Send, ShoppingBag, X } from 'lucide-react';
import { MAIN_QUICK_ACTIONS, WELCOME_MESSAGE, type ChatQuickAction } from './chatbotData';
import { getChatbotReply, type ChatProduct, type ChatbotReply } from './chatbotLogic';
import './Chatbot.css';

type Message = {
  id: number;
  role: 'assistant' | 'user';
  text: string;
  reply?: ChatbotReply;
};

type ChatbotProps = {
  products: ChatProduct[];
  onViewProduct: (productId: string) => void;
  onAddToCart: (productId: string) => void;
  onExplore: (category: 'All' | 'Ladoos' | 'Protein Bars') => void;
  onOpenCart: () => void;
  onContact: () => void;
};

export default function Chatbot({ products, onViewProduct, onAddToCart, onExplore, onOpenCart, onContact }: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, role: 'assistant', text: WELCOME_MESSAGE, reply: { text: WELCOME_MESSAGE, quickActions: MAIN_QUICK_ACTIONS } },
  ]);
  const nextId = useRef(2);
  const conversationEnd = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    conversationEnd.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [isOpen, messages]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    window.setTimeout(() => inputRef.current?.focus(), 120);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const sendMessage = (rawMessage: string) => {
    const message = rawMessage.trim();
    if (!message) return;
    const reply = getChatbotReply(message, products);
    setMessages(current => [
      ...current,
      { id: nextId.current++, role: 'user', text: message },
      { id: nextId.current++, role: 'assistant', text: reply.text, reply },
    ]);
    setInput('');
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    sendMessage(input);
  };

  const handleQuickAction = (action: ChatQuickAction) => sendMessage(action.message);
  const runAndClose = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  return (
    <div className={`chatbot ${isOpen ? 'is-open' : ''}`}>
      {isOpen && (
        <section className="chatbot-panel" role="dialog" aria-label="Anamritam customer support chat">
          <header className="chatbot-header">
            <div className="chatbot-brand-mark" aria-hidden="true"><Leaf size={19} /></div>
            <div>
              <h2>Anamritam Assistant</h2>
              <p><span aria-hidden="true" /> Here to help</p>
            </div>
            <button type="button" className="chatbot-close" onClick={() => setIsOpen(false)} aria-label="Close Anamritam Assistant">
              <X size={19} />
            </button>
          </header>

          <div className="chatbot-messages" aria-live="polite">
            {messages.map(message => (
              <div className={`chatbot-message-row ${message.role}`} key={message.id}>
                <div className="chatbot-message">{message.text}</div>
                {message.role === 'assistant' && message.reply && (
                  <>
                    {message.reply.quickActions && (
                      <div className="chatbot-quick-actions">
                        {message.reply.quickActions.map(action => (
                          <button type="button" key={action.label} onClick={() => handleQuickAction(action)}>{action.label}</button>
                        ))}
                      </div>
                    )}
                    {(message.reply.productId || message.reply.category || message.reply.showCart || message.reply.showContact) && (
                      <div className="chatbot-context-actions">
                        {message.reply.productId && <>
                          <button type="button" onClick={() => runAndClose(() => onViewProduct(message.reply!.productId!))}>View product <ArrowRight size={14} /></button>
                          <button type="button" onClick={() => onAddToCart(message.reply!.productId!)}>Add to cart <ShoppingBag size={14} /></button>
                        </>}
                        {message.reply.category && <button type="button" onClick={() => runAndClose(() => onExplore(message.reply!.category!))}>Explore products <ArrowRight size={14} /></button>}
                        {message.reply.showCart && <button type="button" onClick={() => runAndClose(onOpenCart)}>Open cart <ShoppingBag size={14} /></button>}
                        {message.reply.showContact && <button type="button" onClick={() => runAndClose(onContact)}>Contact us <ArrowRight size={14} /></button>}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
            <div ref={conversationEnd} />
          </div>

          <form className="chatbot-input-row" onSubmit={submit}>
            <label className="sr-only" htmlFor="anamritam-chat-input">Ask Anamritam a question</label>
            <input
              id="anamritam-chat-input"
              ref={inputRef}
              value={input}
              onChange={event => setInput(event.target.value)}
              placeholder="Ask about our products…"
              autoComplete="off"
            />
            <button type="submit" disabled={!input.trim()} aria-label="Send message"><Send size={17} /></button>
          </form>
        </section>
      )}

      <button
        type="button"
        className="chatbot-toggle"
        onClick={() => setIsOpen(open => !open)}
        aria-label={isOpen ? 'Close Anamritam Assistant' : 'Open Anamritam Assistant'}
        aria-expanded={isOpen}
      >
        {isOpen ? <X size={23} /> : <MessageCircle size={24} />}
      </button>
    </div>
  );
}
