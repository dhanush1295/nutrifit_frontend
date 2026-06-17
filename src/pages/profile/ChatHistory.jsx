import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import api from '../../services/api';
import ReactMarkdown from 'react-markdown';

export default function ChatHistory() {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await api.get('/coach/history');
      if (res.data && res.data.messages) {
        
        // Group by Date
        const grouped = {};
        
        res.data.messages.forEach(msg => {
          const dateObj = new Date(msg.timestamp);
          const timeString = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          
          let dateKey;
          const today = new Date();
          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);
          
          if (dateObj.toDateString() === today.toDateString()) {
            dateKey = 'Today';
          } else if (dateObj.toDateString() === yesterday.toDateString()) {
            dateKey = 'Yesterday';
          } else {
            dateKey = dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
          }
          
          if (!grouped[dateKey]) grouped[dateKey] = [];
          
          grouped[dateKey].push({
            id: msg.id,
            text: msg.content,
            isUser: msg.role === 'user',
            time: timeString,
            dateObj: dateObj
          });
        });

        // Sort keys
        const sortedKeys = Object.keys(grouped).sort((a, b) => {
          if (a === 'Today') return -1;
          if (b === 'Today') return 1;
          if (a === 'Yesterday') return -1;
          if (b === 'Yesterday') return 1;
          return grouped[b][0].dateObj - grouped[a][0].dateObj;
        });

        const sections = sortedKeys.map(key => ({
          date: key,
          messages: grouped[key]
        }));
        
        setConversations(sections);
      }
    } catch (err) {
      console.error('Failed to load chat history', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#000000', minHeight: '100vh', color: 'white', padding: '12px 0 100px' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '28px', padding: '0 24px' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: 0 }}>
          <ChevronLeft size={24} />
        </button>
        <div style={{ flex: 1, textAlign: 'center', fontSize: '22px', fontWeight: 'bold' }}>Chat History</div>
        <div style={{ width: '24px' }}></div>
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', marginTop: '100px', color: '#A78BFA' }}>
          Loading...
        </div>
      ) : conversations.length > 0 ? (
        <div style={{ padding: '0 24px' }}>
          {conversations.map((section, idx) => (
            <div key={idx} style={{ marginBottom: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                <div style={{ 
                  backgroundColor: '#12121A', padding: '6px 16px', borderRadius: '20px', 
                  fontSize: '13px', fontWeight: '600', color: 'gray' 
                }}>
                  {section.date}
                </div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {section.messages.map(msg => (
                  <div key={msg.id} style={{ 
                    display: 'flex', 
                    justifyContent: msg.isUser ? 'flex-end' : 'flex-start'
                  }}>
                    <div style={{ 
                      maxWidth: '80%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      alignItems: msg.isUser ? 'flex-end' : 'flex-start'
                    }}>
                      <div style={{
                        background: msg.isUser ? 'var(--primary-gradient)' : '#12121A',
                        padding: '14px 18px',
                        borderRadius: '24px',
                        fontSize: '15px',
                        color: 'white',
                        wordBreak: 'break-word',
                        border: msg.isUser ? 'none' : '1px solid rgba(255,255,255,0.08)'
                      }}>
                        {!msg.isUser ? (
                          <ReactMarkdown
                            components={{
                              p: ({node, ...props}) => <p style={{ margin: '0 0 8px 0', '&:last-child': { margin: 0 } }} {...props} />,
                              ul: ({node, ...props}) => <ul style={{ margin: '0 0 8px 0', paddingLeft: '20px' }} {...props} />,
                              ol: ({node, ...props}) => <ol style={{ margin: '0 0 8px 0', paddingLeft: '20px' }} {...props} />,
                              li: ({node, ...props}) => <li style={{ marginBottom: '4px' }} {...props} />,
                              strong: ({node, ...props}) => <strong style={{ fontWeight: 'bold', color: '#A78BFA' }} {...props} />
                            }}
                          >
                            {msg.text}
                          </ReactMarkdown>
                        ) : (
                          msg.text
                        )}
                      </div>
                      <div style={{ fontSize: '11px', color: 'gray', marginTop: '6px', padding: '0 8px' }}>
                        {msg.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', marginTop: '100px', color: 'gray' }}>
          No chat history found.
        </div>
      )}
    </div>
  );
}
