import { useState, useEffect } from 'react';
import { Send, Bot } from 'lucide-react';
import api from '../../services/api';
import ReactMarkdown from 'react-markdown';

export default function Coach() {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Hi! I'm your NutriFit AI Coach. How can I help you today?" }
  ]);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const res = await api.get('/coach/history');
        if (res.data && res.data.messages && res.data.messages.length > 0) {
          const formatted = res.data.messages.map(m => ({
            role: m.role,
            text: m.content
          }));
          setMessages(formatted);
        }
      } catch (err) {
        console.error("Failed to load history", err);
      }
    };
    loadHistory();
  }, []);

  const handleSend = async () => {
    if (!query) return;
    const userMessage = { role: 'user', text: query };
    setMessages(prev => [...prev, userMessage]);
    setQuery('');
    setIsLoading(true);
    
    try {
      const res = await api.post('/coach/chat', { message: userMessage.text });
      setMessages(prev => [...prev, { role: 'assistant', text: res.data.reply }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'assistant', text: "I'm having trouble connecting to the server. Try again later!" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', padding: '20px 20px 100px' }}>
      <h1 style={{ marginBottom: 4 }}>AI Coach</h1>
      <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 24 }}>Your personal nutrition assistant</p>
      
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 20 }}>
        {messages.map((m, i) => {
          const isUser = m.role === 'user';
          return (
            <div key={i} style={{ 
              display: 'flex', 
              flexDirection: isUser ? 'row-reverse' : 'row',
              gap: 8,
              alignItems: 'flex-end'
            }}>
              {!isUser && (
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--primary-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Bot size={16} color="white" />
                </div>
              )}
              <div style={{ 
                background: isUser ? 'var(--primary-gradient)' : 'var(--bg-card)',
                color: isUser ? 'white' : 'var(--text-main)',
                padding: '12px 16px',
                borderRadius: isUser ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                maxWidth: '75%',
                fontSize: 14,
                lineHeight: 1.5,
                border: isUser ? 'none' : '1px solid var(--border-color)',
                overflowWrap: 'break-word',
                wordBreak: 'break-word'
              }}>
                <ReactMarkdown
                  components={{
                    p: ({node, ...props}) => <p style={{ margin: '0 0 8px 0' }} {...props} />,
                    ul: ({node, ...props}) => <ul style={{ margin: '0 0 8px 0', paddingLeft: '20px' }} {...props} />,
                    ol: ({node, ...props}) => <ol style={{ margin: '0 0 8px 0', paddingLeft: '20px' }} {...props} />,
                    li: ({node, ...props}) => <li style={{ marginBottom: '4px' }} {...props} />,
                    strong: ({node, ...props}) => <strong style={{ fontWeight: 'bold', color: isUser ? 'white' : '#A78BFA' }} {...props} />
                  }}
                >
                  {m.text}
                </ReactMarkdown>
              </div>
            </div>
          );
        })}
        {isLoading && (
          <div style={{ display: 'flex', flexDirection: 'row', gap: 8, alignItems: 'flex-end' }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--primary-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bot size={16} color="white" />
            </div>
            <div style={{ 
              background: 'var(--bg-card)', color: 'var(--text-main)', padding: '12px 16px',
              borderRadius: '20px 20px 20px 4px', maxWidth: '75%', fontSize: 14,
              border: '1px solid var(--border-color)', fontStyle: 'italic'
            }}>
              Coach is typing...
            </div>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <div className="input-container" style={{ flex: 1 }}>
          <input 
            type="text" 
            placeholder="Ask me anything..." 
            className="input-field" 
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !isLoading && handleSend()}
            disabled={isLoading}
          />
        </div>
        <button 
          style={{ 
            width: 52, height: 52, borderRadius: 12, 
            background: isLoading ? 'var(--bg-card)' : 'var(--primary-gradient)', 
            border: 'none', color: isLoading ? 'gray' : 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center', 
            cursor: isLoading ? 'not-allowed' : 'pointer'
          }} 
          onClick={handleSend}
          disabled={isLoading}
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}
