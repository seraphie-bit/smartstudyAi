import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  User as UserIcon,
  Copy,
  Check,
  FilePlus,
  Trash2,
  RefreshCw,
  Lightbulb,
} from 'lucide-react';
import { ChatMessage, SubjectType, TutorPersona } from '../types';
import { generateTutorResponse, QUICK_PROMPTS } from '../services/aiChatEngine';
import { useAuth } from '../context/AuthContext';

interface ChatbotViewProps {
  onSaveToNotes: (title: string, content: string, subject: SubjectType) => void;
  onNotify: (msg: string) => void;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg_welcome',
    sender: 'ai',
    text: `### Hello, I'm your Smart Study AI Tutor! 🎓

I'm here to help you master challenging concepts across **Mathematics, Physics, Chemistry, Biology, Computer Science, Literature, and History**.

Choose your preferred tutoring style:
- **Concept Explainer**: Clear everyday analogies & intuitive breakdowns
- **Socratic Guide**: Guided hints that lead you to discover the answer
- **Exam Coach**: High-yield facts, traps to avoid, and test formulas
- **Quick Summary**: Crisp bulleted takeaways

What topic would you like to explore today?`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    suggestedFollowUps: [
      'Explain the Feynman study technique',
      'What are Newton\'s 3 Laws of Motion?',
      'How do Ionic and Covalent bonds differ?',
    ],
  },
];

export const ChatbotView: React.FC<ChatbotViewProps> = ({ onSaveToNotes, onNotify }) => {
  const { user, addXP } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('smart_study_chat_history');
      return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
    } catch {
      return INITIAL_MESSAGES;
    }
  });

  const [input, setInput] = useState('');
  const [persona, setPersona] = useState<TutorPersona>('explainer');
  const [selectedSubject, setSelectedSubject] = useState<SubjectType | 'general'>('general');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('smart_study_chat_history', JSON.stringify(messages));
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const subjectArg = selectedSubject === 'general' ? undefined : selectedSubject;
      const response = await generateTutorResponse({
        prompt: query,
        history: messages,
        persona,
        subject: subjectArg,
      });

      const aiMsg: ChatMessage = {
        id: 'msg_' + (Date.now() + 1),
        sender: 'ai',
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        persona,
        suggestedFollowUps: response.suggestedFollowUps,
      };

      setMessages((prev) => [...prev, aiMsg]);
      addXP(15);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: 'msg_' + (Date.now() + 1),
        sender: 'ai',
        text: 'Sorry, I encountered an issue analyzing this question. Please try asking in different words.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    onNotify('Response copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreateNoteFromChat = (text: string) => {
    const lines = text.split('\n');
    const firstLine = lines.find((l) => l.trim().length > 0) || 'Study Tutor Notes';
    const cleanTitle = firstLine.replace(/^[#* \-_]+/, '').slice(0, 40);
    const targetSubject = selectedSubject === 'general' ? 'mathematics' : selectedSubject;
    onSaveToNotes(cleanTitle, text, targetSubject);
    onNotify('Saved to your Notes notebook!');
  };

  const handleClearChat = () => {
    setMessages(INITIAL_MESSAGES);
    onNotify('Chat history reset.');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8.5rem)] max-w-5xl mx-auto rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden animate-in fade-in">
      {/* Top Configuration Toolbar */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>AI Study Tutor</span>
              <span className="text-[10px] font-mono font-normal text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                Active · Free Engine
              </span>
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Interactive Socratic & Concept Explanation
            </p>
          </div>
        </div>

        {/* Persona Selectors */}
        <div className="flex items-center gap-1 p-1 bg-slate-200/60 dark:bg-slate-800 rounded-xl text-xs">
          <button
            onClick={() => setPersona('explainer')}
            className={`px-2.5 py-1 rounded-lg transition-colors font-medium ${
              persona === 'explainer'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Explainer
          </button>
          <button
            onClick={() => setPersona('socratic')}
            className={`px-2.5 py-1 rounded-lg transition-colors font-medium ${
              persona === 'socratic'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Socratic
          </button>
          <button
            onClick={() => setPersona('coach')}
            className={`px-2.5 py-1 rounded-lg transition-colors font-medium ${
              persona === 'coach'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Exam Coach
          </button>
          <button
            onClick={() => setPersona('summary')}
            className={`px-2.5 py-1 rounded-lg transition-colors font-medium ${
              persona === 'summary'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Summary
          </button>
        </div>

        {/* Reset Chat button */}
        <button
          onClick={handleClearChat}
          className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800 rounded-lg transition-colors text-xs flex items-center gap-1"
          title="Clear Conversation"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  isUser
                    ? 'bg-indigo-600 text-white'
                    : 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                }`}
              >
                {isUser ? <UserIcon className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble Container */}
              <div className={`max-w-[85%] sm:max-w-[75%] space-y-2`}>
                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                    isUser
                      ? 'bg-indigo-600 text-white rounded-tr-none'
                      : 'bg-slate-100/80 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 border border-slate-200/60 dark:border-slate-700/60 rounded-tl-none'
                  }`}
                >
                  {/* Clean Markdown-like Rendering */}
                  <div className="whitespace-pre-wrap font-normal space-y-2">
                    {msg.text}
                  </div>

                  <div
                    className={`mt-2 pt-2 text-[10px] flex items-center justify-between border-t ${
                      isUser
                        ? 'border-indigo-500/40 text-indigo-200'
                        : 'border-slate-200/50 dark:border-slate-700/50 text-slate-400'
                    }`}
                  >
                    <span>{msg.timestamp}</span>
                    {!isUser && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleCopy(msg.id, msg.text)}
                          className="p-1 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                          title="Copy text"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <button
                          onClick={() => handleCreateNoteFromChat(msg.text)}
                          className="p-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                          title="Save as Note"
                        >
                          <FilePlus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Suggested Follow-Ups */}
                {!isUser && msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[10px] text-slate-400 flex items-center gap-1 mr-1">
                      <Lightbulb className="w-3 h-3 text-amber-500" /> Suggested:
                    </span>
                    {msg.suggestedFollowUps.map((promptText, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(promptText)}
                        className="text-[11px] px-2.5 py-1 rounded-lg bg-indigo-50/80 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/40 transition-colors text-left"
                      >
                        {promptText}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 flex items-center justify-center">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 rounded-tl-none border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse delay-75" />
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse delay-150" />
              <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">
                Tutor is formulating explanation...
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Preset Prompt Strip */}
      <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto text-xs no-scrollbar bg-slate-50/40 dark:bg-slate-900/40">
        <span className="text-[11px] text-slate-400 font-medium shrink-0">Quick Ask:</span>
        {QUICK_PROMPTS.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-500 whitespace-nowrap text-xs transition-colors shrink-0"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Composer */}
      <div className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-2xl p-1.5 border border-slate-200 dark:border-slate-700 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent transition-all"
        >
          <input
            type="text"
            placeholder="Ask a question about physics, math, biology, essay writing, etc..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="flex-1 bg-transparent px-3 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-40 disabled:hover:bg-indigo-600 transition-colors shadow-sm shrink-0"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 px-1">
          <span>Earn +15 XP per question asked</span>
          <span>Press Enter to send</span>
        </div>
      </div>
    </div>
  );
};
