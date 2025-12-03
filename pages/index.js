// pages/index.js
import { useState } from 'react';

export default function Home() {
  const [messages, setMessages] = useState([]); // { role: 'user'|'assistant', content: string }
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  async function sendMessage(e) {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessages = [
      ...messages,
      { role: 'user', content: input.trim() },
    ];

    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error('API error:', data);
        setMessages([
          ...newMessages,
          {
            role: 'assistant',
            content: '⚠️ Gann Baba ko kuch gadbad lag rahi hai. Thoda baad mein try karna.',
          },
        ]);
      } else {
        setMessages([
          ...newMessages,
          { role: 'assistant', content: data.reply },
        ]);
      }
    } catch (err) {
      console.error(err);
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: '⚠️ Network error. Gann Baba ka wifi toot gaya lagta hai.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(circle at top, #1c1b33, #050509)',
      color: 'white',
      display: 'flex',
      justifyContent: 'center',
      padding: '20px',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '700px',
        borderRadius: '18px',
        border: '1px solid rgba(255,255,255,0.1)',
        background: 'rgba(10, 10, 25, 0.95)',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}>
        <header style={{ marginBottom: '8px' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '700' }}>
            🔮 GANN BABA – Digital Guru
          </h1>
          <p style={{ opacity: 0.8, fontSize: '0.95rem' }}>
            Ask anything about life, love, career, confusion… Gann Baba will roast you,
            heal you, and explain you. Hinglish only. 😈
          </p>
        </header>

        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            maxHeight: '60vh',
            padding: '10px',
            borderRadius: '12px',
            background: 'rgba(0,0,0,0.4)',
          }}
        >
          {messages.length === 0 && (
            <p style={{ opacity: 0.7, fontSize: '0.9rem' }}>
              👉 Start with something like: <br />
              <em>"Baba, mujhe life mein itna anxious kyu lagta hai?"</em>
            </p>
          )}

          {messages.map((msg, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                marginBottom: '8px',
              }}
            >
              <div
                style={{
                  maxWidth: '80%',
                  padding: '8px 12px',
                  borderRadius: '12px',
                  fontSize: '0.95rem',
                  whiteSpace: 'pre-wrap',
                  background:
                    msg.role === 'user'
                      ? 'linear-gradient(135deg, #ff7a3c, #ffb347)'
                      : 'rgba(15, 15, 40, 0.95)',
                }}
              >
                <strong style={{ fontSize: '0.75rem', opacity: 0.8 }}>
                  {msg.role === 'user' ? 'You' : 'Gann Baba'}
                </strong>
                <div>{msg.content}</div>
              </div>
            </div>
          ))}

          {loading && (
            <div style={{ opacity: 0.8, fontSize: '0.85rem', marginTop: '4px' }}>
              Gann Baba soch raha hai… 🧠✨
            </div>
          )}
        </div>

        <form
          onSubmit={sendMessage}
          style={{ display: 'flex', gap: '8px', marginTop: '10px' }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question for Gann Baba..."
            style={{
              flex: 1,
              padding: '10px 12px',
              borderRadius: '10px',
              border: '1px solid rgba(255,255,255,0.2)',
              background: 'rgba(0,0,0,0.5)',
              color: 'white',
              outline: 'none',
            }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '10px 16px',
              borderRadius: '10px',
              border: 'none',
              background: loading ? '#555' : 'linear-gradient(135deg, #ff7a3c, #ffb347)',
              color: 'black',
              fontWeight: 600,
              cursor: loading ? 'default' : 'pointer',
            }}
          >
            {loading ? '...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
}
