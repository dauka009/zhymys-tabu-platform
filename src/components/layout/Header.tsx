"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Briefcase, Menu, Moon, Sun, X, Bell, MessageSquare } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth.store";

export function Header() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { isAuth, user } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  const baseLinks = [
    { name: "Басты бет", href: "/" },
    { name: "Вакансиялар", href: "/vacancies" },
    { name: "Компаниялар", href: "/companies" },
    { name: "Біз туралы", href: "/about" },
    { name: "Бағалар", href: "/pricing" },
    { name: "Байланыс", href: "/contact" },
  ];

  // Рөлге байланысты навигация
  const adminLink = { name: "Admin", href: "/admin" };
  const navLinks = isAuth && user?.role === "admin"
    ? [...baseLinks, adminLink]
    : baseLinks;

  const [realNotifications, setRealNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const [notifOpen, setNotifOpen] = useState(false);

  useEffect(() => {
    if (isAuth && user?.id) {
      const fetchNotifs = async () => {
        try {
          const res = await fetch(`/api/notifications?userId=${user.id}&t=${Date.now()}`, { cache: 'no-store' });
          const data = await res.json();
          if (Array.isArray(data)) {
            setRealNotifications(data);
            setUnreadCount(data.filter(n => !n.is_read).length);
          }
        } catch (err) {
          console.error('Failed to fetch notifications:', err);
        }
      };
      fetchNotifs();
      
      // Also fetch messages to get unread count
      const fetchMessages = async () => {
        try {
          const res = await fetch(`/api/messages?userId=${user.id}&t=${Date.now()}`, { cache: 'no-store' });
          const data = await res.json();
          if (Array.isArray(data)) {
            const totalUnread = data.reduce((sum: number, room: any) => sum + parseInt(room.unread_count || 0), 0);
            setUnreadMessagesCount(totalUnread);
          }
        } catch (err) {}
      };
      fetchMessages();

      // Polling every 30 seconds for new notifications
      const interval = setInterval(() => {
        fetchNotifs();
        fetchMessages();
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuth, user?.id, pathname]);

  const markAsRead = async (id?: string) => {
    console.log('markAsRead called with id:', id, 'userId:', user?.id);
    try {
      const response = await fetch('/api/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          notificationId: id, 
          userId: user?.id,
          all: !id 
        })
      });
      const resData = await response.json();
      console.log('markAsRead API response:', resData);
      
      if (id) {
        setRealNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
      } else {
        setRealNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        setUnreadCount(0);
      }
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const clearNotifications = async () => {
    if (!user?.id || !confirm('Барлық хабарламаларды өшіру?')) return;
    try {
      await fetch(`/api/notifications?userId=${user.id}`, {
        method: 'DELETE'
      });
      setRealNotifications([]);
      setUnreadCount(0);
      setNotifOpen(false);
    } catch (err) {
      console.error('Failed to clear notifications:', err);
    }
  };

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const past = new Date(date);
    const diffInMs = now.getTime() - past.getTime();
    const diffInMin = Math.floor(diffInMs / 60000);
    
    if (diffInMin < 1) return 'Жаңа ғана';
    if (diffInMin < 60) return `${diffInMin} мин бұрын`;
    const diffInHr = Math.floor(diffInMin / 60);
    if (diffInHr < 24) return `${diffInHr} сағ бұрын`;
    return `${Math.floor(diffInHr / 24)} күн бұрын`;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-indigo-600 shadow-md group-hover:shadow-lg transition-all duration-300">
            <Briefcase className="h-5 w-5 text-white" />
          </div>
          <span className="font-heading text-xl font-extrabold tracking-tight">
            Жұмыс<span className="text-primary">Тап</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary relative ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {link.name}
                {isActive && (
                  <span className="absolute -bottom-6 left-0 right-0 h-0.5 bg-primary rounded-t-lg" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full"
            aria-label="Toggle theme"
          >
            {mounted && theme === "dark" ? (
              <Sun className="h-5 w-5 text-amber-500" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          {isAuth ? (
            <div className="flex items-center gap-3 relative">
              <div className="relative">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="relative rounded-full"
                  onClick={() => setNotifOpen(!notifOpen)}
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-2 h-2 w-2 rounded-full bg-destructive animate-pulse" />
                  )}
                </Button>

                <Link href="/messages">
                  <Button variant="ghost" size="icon" className="relative rounded-full ml-1">
                    <MessageSquare className="h-5 w-5" />
                    {unreadMessagesCount > 0 && (
                      <span className="absolute top-1.5 right-2 h-2 w-2 rounded-full bg-primary animate-pulse" />
                    )}
                  </Button>
                </Link>

                {notifOpen && (
                  <div className="absolute top-12 right-0 w-80 bg-card border rounded-2xl shadow-2xl z-[100] p-4 animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex justify-between items-center mb-4 pb-2 border-b">
                       <h4 className="font-bold">Хабарламалар</h4>
                       <div className="flex items-center gap-2">
                         <button 
                           onClick={clearNotifications}
                           className="text-[10px] text-destructive hover:underline font-bold uppercase"
                         >
                           Тазалау
                         </button>
                         {unreadCount > 0 && (
                           <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold uppercase">
                             {unreadCount} жаңа
                           </span>
                         )}
                       </div>
                    </div>
                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                       {realNotifications.length > 0 ? (
                         realNotifications.map((n) => (
                          <div 
                            key={n.id} 
                            className={`group cursor-pointer p-2 rounded-xl transition-colors ${n.is_read ? 'opacity-70' : 'bg-primary/5'}`}
                            onClick={async () => {
                              if (!n.is_read) await markAsRead(n.id);
                              if (n.link) {
                                setNotifOpen(false);
                                window.location.href = n.link;
                              }
                            }}
                          >
                             <div className="flex justify-between items-start mb-0.5">
                                <span className={`text-sm font-bold group-hover:text-primary transition-colors ${!n.is_read && 'text-primary'}`}>
                                  {n.title}
                                </span>
                                <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2">
                                  {getTimeAgo(n.created_at)}
                                </span>
                             </div>
                             <p className="text-xs text-muted-foreground line-clamp-2">{n.content}</p>
                          </div>
                        ))
                       ) : (
                         <div className="text-center py-8 text-muted-foreground text-sm">
                           Хабарламалар жоқ
                         </div>
                       )}
                    </div>

                    <Button 
                      variant="outline" 
                      className="w-full mt-2 h-9 text-xs rounded-xl" 
                      onClick={async () => {
                        await markAsRead();
                        setNotifOpen(false);
                      }}
                    >
                      Жабу
                    </Button>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Link href="/cabinet">
                  <Button className={`rounded-full gap-2 shadow-md hover:shadow-lg transition-all ${
                    user?.role === "admin"
                      ? "bg-gradient-to-r from-red-500 to-rose-600 hover:opacity-90"
                      : "bg-gradient-to-r from-primary to-indigo-600 hover:opacity-90"
                  }`}>
                    <span>{user?.role === "admin" ? "Admin" : "Жеке кабинет"}</span>
                    <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full uppercase tracking-wider">{user?.role}</span>
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" className="rounded-full">Кіру</Button>
              </Link>
              <Link href="/register">
                <Button className="rounded-full shadow-md hover:shadow-lg transition-all bg-gradient-to-r from-primary to-indigo-600 hover:opacity-90">
                  Тіркелу
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {mounted && theme === "dark" ? <Sun className="h-5 w-5 text-amber-500" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <nav className="flex flex-col p-4 gap-4 pb-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-base font-medium px-4 py-2 flex items-center rounded-lg ${
                  pathname === link.href
                    ? "bg-primary/10 text-primary"
                    : "text-foreground"
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="h-px bg-border my-2" />
            {isAuth ? (
              <Link href="/cabinet" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full">Жеке кабинет</Button>
              </Link>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full">Кіру</Button>
                </Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full">Тіркелу</Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
