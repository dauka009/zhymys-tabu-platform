"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useAuthStore } from "@/stores/auth.store";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

import { Search, Send, User, Building, MapPin, MoreVertical, Paperclip, Smile, MessageSquare, Reply, Trash2, X, Download, FileText, Image as ImageIcon, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

function MessagesContent() {
  const router = useRouter();
  const { isAuth, user } = useAuthStore();
  const searchParams = useSearchParams();
  const roomIdParam = searchParams.get('room');
  
  const [rooms, setRooms] = useState<any[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const [replyingTo, setReplyingTo] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showChatMenu, setShowChatMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-select room from URL or participant ID
  useEffect(() => {
    if (!roomIdParam || !user?.id) return;

    if (roomIdParam === 'support') {
      const startSupportChat = async () => {
        const adminId = '150174e0-6dcc-4ca7-b05a-44c464fc39be';
        try {
          await fetch('/api/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              senderId: user.id,
              receiverId: adminId,
              content: 'Сәлеметсіз бе! Маған техникалық көмек қажет.'
            })
          });
          
          const roomsRes = await fetch(`/api/messages?userId=${user.id}&t=${Date.now()}`, { cache: 'no-store' });
          if (roomsRes.ok) {
            const roomsData = await roomsRes.json();
            setRooms(roomsData);
            const supportRoom = roomsData.find((r: any) => r.participant_id === adminId);
            if (supportRoom) setSelectedRoom(supportRoom);
          }
        } catch (error) {
          console.error('Support chat creation failed:', error);
        }
      };
      startSupportChat();
      return;
    }

    // 1. Алдымен бар чаттардың арасынан бөлме ID немесе пайдаланушы ID бойынша іздеу
    const existingRoom = rooms.find(r => r.room_id === roomIdParam || r.participant_id === roomIdParam);
    
    if (existingRoom) {
      setSelectedRoom(existingRoom);
    } else {
      // 2. Егер тізімде жоқ болса, бұл жаңа пайдаланушы болуы мүмкін
      const fetchTargetUser = async () => {
        try {
          const res = await fetch(`/api/users/${roomIdParam}`);
          if (res.ok) {
            const targetUser = await res.json();
            setSelectedRoom({
              room_id: null,
              participant_id: targetUser.id,
              first_name: targetUser.first_name,
              last_name: targetUser.last_name,
              avatar_url: targetUser.avatar_url,
              title: 'Жаңа хабарлама'
            });
          }
        } catch (err) {
          console.error('Target user fetch failed:', err);
        }
      };
      fetchTargetUser();
    }
  }, [roomIdParam, rooms.length, user?.id]);
  
  // Fetch rooms
  useEffect(() => {
    if (user?.id) {
      const fetchRooms = async () => {
        const res = await fetch(`/api/messages?userId=${user.id}`);
        if (res.ok) {
          const data = await res.json();
          setRooms(data);
        }
      };
      fetchRooms();
    }
  }, [user?.id]);

  // Fetch messages when room selected
  useEffect(() => {
    if (selectedRoom?.room_id) {
      const fetchMessages = async () => {
        const res = await fetch(`/api/messages/${selectedRoom.room_id}?userId=${user.id}`);
        if (res.ok) {
          const data = await res.json();
          setMessages(data);
        }
      };
      fetchMessages();
      
      // Setup simple polling for new messages in selected room
      const interval = setInterval(() => {
        if (!sending) fetchMessages();
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [selectedRoom?.room_id, sending, user?.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages.length]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const scrollToMessage = (id: string) => {
    const el = document.getElementById(`msg-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('bg-primary/20');
      setTimeout(() => el.classList.remove('bg-primary/20'), 2000);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!newMessage.trim() && !selectedFile) || !selectedRoom || !user?.id || sending) return;

    setSending(true);
    const content = newMessage;
    const replyId = replyingTo?.id;
    const file = selectedFile;
    
    let fileBase64 = '';
    if (file) {
      fileBase64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    }

    setNewMessage("");
    setReplyingTo(null);
    setSelectedFile(null);
    setEmojiPickerOpen(false);

    // Optimistic UI update
    const tempId = Date.now();
    const tempMsg = {
      id: tempId,
      sender_id: user.id,
      content,
      created_at: new Date().toISOString(),
      reply_to_id: replyId,
      attachments: file ? [{ name: file.name, size: file.size, type: file.type, data: fileBase64 }] : null,
      is_loading: true
    };
    
    setMessages(prev => [...prev, tempMsg]);
    scrollToBottom();

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId: user.id,
          receiverId: selectedRoom.participant_id,
          content,
          replyToId: replyId,
          attachments: file ? [{ name: file.name, size: file.size, type: file.type, data: fileBase64 }] : null,
          vacancyId: selectedRoom.vacancy_id,
          companyId: selectedRoom.company_id
        })
      });
      
      if (!res.ok) {
        setMessages(prev => prev.filter(m => m.id !== tempId));
        toast.error("Хабарлама жіберілмеді");
      } else {
        const data = await res.json();
        if (data.success && data.message) {
          // Нақты хабарламамен алмастыру
          setMessages(prev => prev.map(m => m.id === tempId ? data.message : m));
          
          // Егер бұл жаңа бөлме болса, оны таңдаулы етіп орнату
          if (!selectedRoom.room_id && data.message.room_id) {
            setSelectedRoom((prev: any) => ({ ...prev, room_id: data.message.room_id }));
            
            // Тізімді жаңарту
            const fetchRooms = async () => {
              const res = await fetch(`/api/messages?userId=${user.id}`);
              if (res.ok) {
                const roomsData = await res.json();
                setRooms(roomsData);
              }
            };
            fetchRooms();
          }
        }
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => prev.filter(m => m.id !== tempId));
      toast.error("Желілік қате");
    } finally {
      setSending(false);
    }
  };

  const deleteMessage = async (id: number) => {
    if (!confirm("Хабарламаны өшіру?")) return;
    try {
      const res = await fetch(`/api/messages/${selectedRoom.room_id}?messageId=${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setMessages(prev => prev.map(m => m.id === id ? { ...m, is_deleted: true, content: 'Хабарлама өшірілген' } : m));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const clearChat = async () => {
    if (!selectedRoom || !confirm('Чатты толығымен тазалау?')) return;
    try {
      const res = await fetch(`/api/messages/${selectedRoom.room_id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setMessages([]);
        setShowChatMenu(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const formatTime = (dateString: string) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    return d.toLocaleTimeString('kk-KZ', { hour: '2-digit', minute: '2-digit' });
  };

  const [isBlocked, setIsBlocked] = useState(false);

  // Reset block status when room changes
  useEffect(() => {
    setIsBlocked(false); 
  }, [selectedRoom?.room_id]);

  const toggleBlock = () => {
    setIsBlocked(!isBlocked);
    toast.success(isBlocked ? "Пайдаланушы бұғаттаудан шығарылды" : "Пайдаланушы бұғатталды");
    setShowChatMenu(false);
  };

  if (!isAuth) {
    return (
      <div className="min-h-[calc(100vh-73px)] bg-gray-50 flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Чатты көру үшін жүйеге кіріңіз</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-73px)] bg-background flex flex-col overflow-hidden">
      <main className="flex-1 max-w-[1400px] w-full mx-auto p-4 md:p-6 lg:p-8 h-full">
        <div className="bg-card border rounded-2xl shadow-sm h-full flex overflow-hidden">
          
          {/* Left Sidebar - Rooms List */}
          <div className={`w-full md:w-[350px] lg:w-[400px] border-r flex flex-col bg-muted/20 ${selectedRoom ? 'hidden md:flex' : 'flex'}`}>
            <div className="p-4 border-b bg-card">
              <h2 className="text-xl font-bold mb-4">Хабарламалар</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Іздеу..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-muted/50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {rooms.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-6 text-center space-y-3">
                  <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center">
                    <MessageSquare className="h-8 w-8 opacity-50" />
                  </div>
                  <p>Әзірге хабарламалар жоқ</p>
                </div>
              ) : (
                rooms
                  .filter(room => {
                    const fullName = `${room.first_name || ''} ${room.last_name || ''}`.toLowerCase();
                    const companyName = (room.company_name || '').toLowerCase();
                    const title = (room.title || '').toLowerCase();
                    const q = searchQuery.toLowerCase();
                    return fullName.includes(q) || companyName.includes(q) || title.includes(q);
                  })
                  .map((room) => (
                  <div 
                    key={room.room_id} 
                    onClick={() => setSelectedRoom(room)}
                    className={`p-4 border-b cursor-pointer transition-all hover:bg-muted/50 flex gap-3 ${selectedRoom?.room_id === room.room_id ? 'bg-primary/5 border-l-4 border-l-primary' : 'border-l-4 border-l-transparent'}`}
                  >
                    <div className="relative h-12 w-12 flex-shrink-0">
                      {room.company_logo || room.avatar_url ? (
                        <img src={room.company_logo || room.avatar_url} alt="" className="h-full w-full rounded-full object-cover border" />
                      ) : (
                        <div className="h-full w-full bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-lg">
                          {room.first_name?.[0] || room.company_name?.[0] || 'U'}
                        </div>
                      )}
                      <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-card rounded-full"></span>
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="font-semibold text-sm truncate">
                          {user?.role === 'admin' || user?.role === 'employer' 
                            ? `${room.first_name || ''} ${room.last_name || ''}`.trim() || room.email || 'Пайдаланушы'
                            : (room.company_name || `${room.first_name || ''} ${room.last_name || ''}`.trim() || 'Компания')}
                        </h3>
                        <div className="flex items-center gap-2">
                          {room.unread_count > 0 && (
                            <span className="bg-primary text-primary-foreground text-[10px] font-bold h-4 min-w-[16px] px-1 rounded-full flex items-center justify-center animate-pulse">
                              {room.unread_count}
                            </span>
                          )}
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {formatTime(room.last_message_at)}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {room.title || 'Жұмыс барысы туралы'}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Area - Chat Window */}
          <div className={`flex-1 flex flex-col bg-background relative ${!selectedRoom ? 'hidden md:flex' : 'flex'}`}>
            {!selectedRoom ? (
              <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground bg-muted/10">
                <div className="h-24 w-24 bg-primary/5 rounded-full flex items-center justify-center mb-4">
                  <Send className="h-10 w-10 text-primary/40" />
                </div>
                <h2 className="text-xl font-medium text-foreground mb-2">Чатты бастау</h2>
                <p className="text-sm max-w-sm text-center">Сол жақтағы тізімнен сұхбаттасушыны таңдап, хат алмасуды бастаңыз.</p>
              </div>
            ) : (
              <>
                {/* Chat Header */}
                <div className="h-16 border-b flex items-center justify-between px-4 sm:px-6 bg-card">
                  <div className="flex items-center gap-3">
                    <button 
                      className="md:hidden mr-2 p-2 hover:bg-muted rounded-full"
                      onClick={() => setSelectedRoom(null)}
                    >
                      <User className="h-5 w-5" />
                    </button>
                    <div className="h-10 w-10 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {selectedRoom.company_logo || selectedRoom.avatar_url ? (
                        <img src={selectedRoom.company_logo || selectedRoom.avatar_url} alt="" className="h-full w-full object-cover" />
                      ) : (
                        selectedRoom.first_name?.[0] || selectedRoom.company_name?.[0] || 'U'
                      )}
                    </div>
                    <div>
                      <h2 className="font-bold text-sm sm:text-base">
                         {user?.role === 'admin' || user?.role === 'employer' 
                            ? `${selectedRoom.first_name || ''} ${selectedRoom.last_name || ''}`.trim() || 'Пайдаланушы'
                            : (selectedRoom.company_name || `${selectedRoom.first_name || ''} ${selectedRoom.last_name || ''}`.trim() || 'Компания')}
                      </h2>
                      <p className="text-xs text-green-500 font-medium">Желіде</p>
                    </div>
                  </div>
                  <div className="relative">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className={`rounded-full ${showChatMenu ? 'bg-muted' : ''}`}
                      onClick={() => setShowChatMenu(!showChatMenu)}
                    >
                      <MoreVertical className="h-5 w-5 text-muted-foreground" />
                    </Button>
                    
                    {showChatMenu && (
                      <div className="absolute right-0 top-full mt-2 w-52 bg-background border rounded-xl shadow-xl z-50 py-2 animate-in fade-in zoom-in duration-100">
                        <button 
                          className="w-full text-left px-4 py-2 text-sm hover:bg-muted flex items-center gap-2 text-destructive"
                          onClick={clearChat}
                        >
                          <Trash2 className="h-4 w-4" /> Чатты тазалау
                        </button>
                        <button 
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-muted flex items-center gap-2 border-t ${isBlocked ? 'text-green-600' : ''}`}
                          onClick={toggleBlock}
                        >
                          {isBlocked ? (
                            <> <CheckCircle className="h-4 w-4" /> Бұғаттаудан шығару </>
                          ) : (
                            <> <X className="h-4 w-4" /> Бұғаттау </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-muted/10 relative">
                  {isBlocked && (
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-destructive/10 text-destructive text-[10px] px-3 py-1 rounded-full font-bold border border-destructive/20 backdrop-blur-md">
                      СІЗ БҰЛ ПАЙДАЛАНУШЫНЫ БҰҒАТТАДЫҢЫЗ
                    </div>
                  )}
                  {messages.map((msg, i) => {
                    const isMe = msg.sender_id === user?.id;
                    const showTime = i === messages.length - 1 || (messages[i+1] && new Date(messages[i+1].created_at).getTime() - new Date(msg.created_at).getTime() > 300000);
                    
                    return (
                      <div key={msg.id} id={`msg-${msg.id}`} className={`flex flex-col group transition-colors duration-500 rounded-lg p-1 ${isMe ? 'items-end' : 'items-start'}`}>
                        {/* Reply reference */}
                        {msg.reply_to_id && (
                          <div 
                            onClick={() => scrollToMessage(msg.reply_to_id)}
                            className={`mb-1 px-3 py-1.5 rounded-lg bg-muted/50 border-l-4 border-primary text-[10px] max-w-[80%] truncate cursor-pointer hover:bg-muted transition-all active:scale-95`}
                          >
                            <p className="font-bold text-primary mb-0.5 uppercase tracking-wider">Жауап:</p>
                            <p className="opacity-70 italic">{msg.reply_content || 'Хабарламаға жауап...'}</p>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-2 max-w-[85%] sm:max-w-[75%]">
                          {isMe && !msg.is_deleted && (
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                              <button onClick={() => setReplyingTo(msg)} className="p-1.5 hover:bg-muted rounded-full text-muted-foreground"><Reply className="h-3.5 w-3.5" /></button>
                              <button onClick={() => deleteMessage(msg.id)} className="p-1.5 hover:bg-muted rounded-full text-muted-foreground hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
                            </div>
                          )}

                          <div 
                            className={`rounded-2xl px-4 py-2.5 shadow-sm relative ${
                              isMe 
                                ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                                : 'bg-card border text-card-foreground rounded-tl-sm'
                            } ${msg.is_deleted ? 'italic opacity-60' : ''} ${msg.is_loading ? 'opacity-70 animate-pulse' : ''}`}
                          >
                            {msg.is_deleted ? (
                              <p className="text-sm">Хабарлама өшірілген</p>
                            ) : (
                              <>
                                <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{msg.content}</p>
                                {msg.attachments && msg.attachments.length > 0 && (
                                  <div className="mt-2 pt-2 border-t border-white/20 space-y-2">
                                    {msg.attachments.map((file: any, idx: number) => (
                                      <div key={idx} className="flex items-center gap-2 bg-white/10 p-2 rounded-lg text-xs">
                                        <FileText className="h-4 w-4" />
                                        <span className="flex-1 truncate">{file.name}</span>
                                        <Download 
                                          className="h-3.5 w-3.5 cursor-pointer hover:text-white transition-colors" 
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            if (file.data) {
                                              const a = document.createElement("a");
                                              a.href = file.data;
                                              a.download = file.name;
                                              a.click();
                                              toast.success(`${file.name} жүктелуде...`);
                                            } else {
                                              toast.error("Файл табылмады (Демо шектеуі)");
                                            }
                                          }}
                                        />
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </>
                            )}
                          </div>

                          {!isMe && !msg.is_deleted && (
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => setReplyingTo(msg)} className="p-1.5 hover:bg-muted rounded-full text-muted-foreground"><Reply className="h-3.5 w-3.5" /></button>
                            </div>
                          )}
                        </div>

                        {showTime && (
                          <span className="text-[10px] text-muted-foreground mt-1 mx-1 flex items-center gap-1">
                            {formatTime(msg.created_at)}
                            {isMe && (
                              <span className={msg.is_read ? "text-blue-500" : ""}>
                                {msg.is_read ? '✓✓' : '✓'}
                              </span>
                            )}
                          </span>
                        )}
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-3 sm:p-4 bg-card border-t relative">
                  {/* Reply Preview */}
                  {replyingTo && (
                    <div className="absolute bottom-full left-0 right-0 bg-muted/80 backdrop-blur-md p-3 border-t flex items-center gap-3 animate-in slide-in-from-bottom-2">
                      <div className="w-1 h-10 bg-primary rounded-full" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-bold text-primary uppercase">Жауап беру</p>
                        <p className="text-sm truncate text-muted-foreground">{replyingTo.content}</p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => setReplyingTo(null)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}

                  {/* Emoji Picker */}
                  {emojiPickerOpen && (
                    <div className="absolute bottom-full left-4 mb-2 p-2 bg-background border rounded-2xl shadow-2xl z-50 w-72 grid grid-cols-7 gap-1 animate-in fade-in slide-in-from-bottom-2 duration-200">
                      {['😊', '😂', '😍', '👍', '🙏', '🙌', '🔥', '✨', '💯', '👋', '🤝', '✅', '❌', '💡', '📌', '🚀', '💻', '📞', '❤️', '🎉', '😢'].map(emoji => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => {
                            setNewMessage(prev => prev + emoji);
                            setEmojiPickerOpen(false);
                          }}
                          className="h-9 w-9 flex items-center justify-center hover:bg-muted rounded-lg text-lg transition-colors"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  )}

                  <form onSubmit={sendMessage} className={`flex items-end gap-2 bg-muted/30 p-1 sm:p-2 rounded-2xl border transition-all relative ${isBlocked ? 'opacity-50 pointer-events-none' : 'focus-within:border-primary focus-within:ring-1 focus-within:ring-primary'}`}>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      disabled={isBlocked}
                      className={`rounded-full flex-shrink-0 transition-colors ${emojiPickerOpen ? 'text-primary bg-primary/10' : 'text-muted-foreground'}`}
                      onClick={() => setEmojiPickerOpen(!emojiPickerOpen)}
                    >
                      <Smile className="h-5 w-5" />
                    </Button>
                    
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      disabled={isBlocked}
                      onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} 
                    />
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      disabled={isBlocked}
                      className={`rounded-full flex-shrink-0 transition-colors ${selectedFile ? 'text-primary bg-primary/10' : 'text-muted-foreground'}`}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Paperclip className="h-5 w-5" />
                    </Button>

                    {selectedFile && (
                      <div className="absolute bottom-[calc(100%+10px)] left-0 bg-primary text-white px-3 py-1.5 rounded-full text-xs flex items-center gap-2 shadow-lg">
                        <FileText className="h-3.5 w-3.5" />
                        <span className="max-w-[150px] truncate">{selectedFile.name}</span>
                        <X className="h-3 w-3 cursor-pointer hover:text-red-200" onClick={() => setSelectedFile(null)} />
                      </div>
                    )}

                    <textarea 
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      disabled={isBlocked}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage(e);
                        }
                      }}
                      placeholder={isBlocked ? "Бұл пайдаланушы бұғатталған" : "Хабарлама жазыңыз..."}
                      className="flex-1 bg-transparent border-none focus:ring-0 resize-none max-h-32 min-h-[40px] py-2 px-2 outline-none text-sm"
                      rows={1}
                    />
                    <Button 
                      type="submit" 
                      size="icon" 
                      disabled={(!newMessage.trim() && !selectedFile) || sending || isBlocked}
                      className={`rounded-full h-10 w-10 flex-shrink-0 shadow-md transition-all ${sending ? 'animate-pulse' : ''}`}
                    >
                      <Send className="h-4 w-4 ml-0.5" />
                    </Button>
                  </form>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen text-muted-foreground">Жүктелуде...</div>}>
      <MessagesContent />
    </Suspense>
  );
}
