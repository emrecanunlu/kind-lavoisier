"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { AppSettings, MemoryItem, CouponItem, BucketListItem, LoveNote, LoveNotification } from "@/types";

interface AppContextType {
  settings: AppSettings;
  memories: MemoryItem[];
  coupons: CouponItem[];
  bucketList: BucketListItem[];
  notes: LoveNote[];
  notifications: LoveNotification[];
  activeToast: LoveNotification | null;
  notificationPermission: NotificationPermission | "default" | "unsupported";
  isUnlocked: boolean;
  setIsUnlocked: (val: boolean) => void;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  addMemory: (memory: Omit<MemoryItem, "id">) => void;
  deleteMemory: (id: string) => void;
  toggleCoupon: (id: string) => void;
  addCoupon: (coupon: Omit<CouponItem, "id" | "isClaimed">) => void;
  editCoupon: (id: string, updated: Partial<CouponItem>) => void;
  deleteCoupon: (id: string) => void;
  unlockCoupon: (id: string) => void;
  resetCouponCooldown: (id: string) => void;
  toggleBucketListItem: (id: string) => void;
  addBucketListItem: (title: string, category: string) => void;
  deleteBucketListItem: (id: string) => void;
  addNote: (text: string, emoji?: string) => void;
  deleteNote: (id: string) => void;
  addNotification: (title: string, message: string, type: LoveNotification["type"]) => void;
  requestNativeNotificationPermission: () => Promise<void>;
  markNotificationsRead: () => void;
  clearNotifications: () => void;
  dismissToast: () => void;
  resetToDefaults: () => void;
}

const defaultSettings: AppSettings = {
  userName: "Emre",
  partnerName: "Bitanem",
  passcode: "1402",
  isPasscodeEnabled: true,
  reunionDate: "2026-08-15",
  anniversaryDate: "2025-10-14",
  birthdayDate: "2026-09-20",
  userCity: "İstanbul",
  partnerCity: "İzmir",
  distanceKm: 0,
  letterTitle: "Canım Sevgilim,",
  letterContent: `Seninle hayatımın en güzel, en huzurlu ve en anlamlı günlerini yaşıyorum. 

Yanında olduğum her saniye, yüzündeki gülücüğü gördüğüm her an dünyadaki en mutlu insan gibi hissediyorum. Sevgimiz, birbirimize olan bağlılığımız ve kalplerimizin bir atması benim bu hayattaki en büyük zenginliğim.

Gözlerinin içine bakacağım, elini sımsıkı tutacağım her ana şükrediyorum. Birlikte hayaller kurduğumuz, güldüğümüz ve paylaşacağımız daha nice güzel günlerimiz var. İyi ki hayatımdasın, iyi ki benimsin... ❤️`,
  letterSender: "Seni Her Şeyden Çok Seven Sevgilin",
};

const defaultMemories: MemoryItem[] = [
  {
    id: "m-1",
    title: "İlk Merhaba",
    date: "10 Mayıs 2024",
    description: "Hayatımın en güzel hikayesinin başladığı o unutulmaz ilk mesaj ve ses tonun...",
    imageUrl: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=800&auto=format&fit=crop",
    location: "İlk Sohbetimiz",
    tag: "Başlangıç",
  },
  {
    id: "m-2",
    title: "Unutulmaz Buluşma & Sımsıkı Sarılma",
    date: "1 Haziran 2024",
    description: "Kalbimin göğüs kafesimden fırlayacak gibi çarptığı, sarıldığımızda zamanın durduğu an.",
    imageUrl: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=800&auto=format&fit=crop",
    location: "En Sevdiğimiz Yer",
    tag: "Buluşma",
  },
  {
    id: "m-3",
    title: "Sabaha Kadar Tatlı Sohbetlerimiz",
    date: "20 Kasım 2024",
    description: "Zamanın nasıl geçtiğini anlamadığımız, saatlerce güldüğümüz ve geleceği düşlediğimiz muhteşem gecemiz.",
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop",
    location: "Gönül Bağımız",
    tag: "Aşkımız",
  },
];

const defaultCoupons: CouponItem[] = [
  {
    id: "c1",
    title: "1 Adet Sınırsız Sarılma Kuponu",
    description: "Dilediğin an sımsıkı ve uzun sarılma garantili!",
    icon: "HeartHandshake",
    isClaimed: false,
    lockDays: 7,
  },
  {
    id: "c2",
    title: "Tüm Gün Film & Abur Cubur Maratonu",
    description: "Filmleri sen seçiyorsun, mısırları ben patlatıyorum!",
    icon: "Film",
    isClaimed: false,
    lockDays: 7,
  },
  {
    id: "c3",
    title: "Sürpriz Akşam Yemeği Kuponu",
    description: "İki tarafa da en sevdiği lezzetler benden sipariş ediliyor!",
    icon: "Utensils",
    isClaimed: false,
    lockDays: 14,
  },
  {
    id: "c4",
    title: "Anında Küslük Bitiş Kuponu",
    description: "Tartışma anında gösterildiği an tüm tripler sıfırlanır ❤️",
    icon: "Sparkles",
    isClaimed: false,
    lockDays: 3,
  },
];

const defaultBucketList: BucketListItem[] = [
  { id: "b1", title: "Gün batımında sahil kenarında el ele yürümek", category: "Romantik", completed: true },
  { id: "b2", title: "Aynı mutfakta birlikte akşam yemeği pişirmek", category: "Mutfak", completed: false },
  { id: "b3", title: "Uzun bir araba yolculuğunda yüksek sesle şarkı söylemek", category: "Macera", completed: false },
];

const defaultNotes: LoveNote[] = [
  {
    id: "n1",
    sender: "Emre",
    text: "Seni her şeyden çok seviyorum bitanem, iyi ki hayatımdasın! ❤️",
    date: "Bugün 10:20",
    emoji: "❤️",
  },
  {
    id: "n2",
    sender: "Bitanem",
    text: "Günün harika geçsin sevgilim, aklım her an sende 🌸",
    date: "Dün 22:15",
    emoji: "🌸",
  },
];

const defaultNotifications: LoveNotification[] = [
  {
    id: "notif-init-1",
    title: "Yeni Sevgi Notu Bırakıldı 💌",
    message: "Emre sana tatlı bir not bıraktı: 'Seni her şeyden çok seviyorum...'",
    timestamp: "10 dakika önce",
    type: "note",
    read: false,
  },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [memories, setMemories] = useState<MemoryItem[]>(defaultMemories);
  const [coupons, setCoupons] = useState<CouponItem[]>(defaultCoupons);
  const [bucketList, setBucketList] = useState<BucketListItem[]>(defaultBucketList);
  const [notes, setNotes] = useState<LoveNote[]>(defaultNotes);
  const [notifications, setNotifications] = useState<LoveNotification[]>(defaultNotifications);
  const [activeToast, setActiveToast] = useState<LoveNotification | null>(null);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission | "default" | "unsupported">("default");
  const [lastCouponClaimedTime, setLastCouponClaimedTime] = useState<number | null>(null);

  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const generateUniqueId = (prefix: string = "id") => {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      if ("Notification" in window) {
        setNotificationPermission(Notification.permission);
        if ("permissions" in navigator) {
          navigator.permissions.query({ name: "notifications" as PermissionName }).then((status) => {
            status.onchange = () => {
              setNotificationPermission(Notification.permission);
            };
          }).catch(() => {});
        }
      } else {
        setNotificationPermission("unsupported");
      }

      if ("serviceWorker" in navigator) {
        navigator.serviceWorker
          .register("/sw.js")
          .then((reg) => console.log("Service worker registered", reg))
          .catch((err) => console.log("Service worker registration error", err));
      }
    }
  }, []);

  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem("love_settings");
      const savedMemories = localStorage.getItem("love_memories");
      const savedCoupons = localStorage.getItem("love_coupons");
      const savedBucketList = localStorage.getItem("love_bucketlist");
      const savedNotes = localStorage.getItem("love_notes");
      const savedNotifications = localStorage.getItem("love_notifications");
      const savedUnlocked = localStorage.getItem("love_unlocked");
      const savedLastClaim = localStorage.getItem("love_last_coupon_time");

      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setSettings({
          ...parsed,
          reunionDate: parsed.reunionDate ? parsed.reunionDate.slice(0, 10) : defaultSettings.reunionDate,
          anniversaryDate: parsed.anniversaryDate ? parsed.anniversaryDate.slice(0, 10) : defaultSettings.anniversaryDate,
          birthdayDate: parsed.birthdayDate ? parsed.birthdayDate.slice(0, 10) : defaultSettings.birthdayDate,
        });
      }
      if (savedMemories) setMemories(JSON.parse(savedMemories));
      
      if (savedCoupons) {
        const parsedCoupons: CouponItem[] = JSON.parse(savedCoupons);
        const cleanedCoupons = parsedCoupons.map((c) => {
          const defaultLock = c.id === "c3" ? 14 : c.id === "c4" ? 3 : 7;
          const days = c.lockDays || defaultLock;

          if (c.lockedUntil && (c.lockedUntil.includes("2026-08-02") || c.lockedUntil.includes(defaultSettings.reunionDate.slice(0, 10)))) {
            return {
              ...c,
              lockDays: days,
              lockedUntil: new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString(),
            };
          }
          return { ...c, lockDays: days };
        });
        setCoupons(cleanedCoupons);
      }
      
      if (savedBucketList) setBucketList(JSON.parse(savedBucketList));
      if (savedNotes) setNotes(JSON.parse(savedNotes));
      
      if (savedNotifications) {
        const parsedNotifs: LoveNotification[] = JSON.parse(savedNotifications);
        const seenIds = new Set<string>();
        const sanitizedNotifs: LoveNotification[] = [];

        parsedNotifs.forEach((item, idx) => {
          if (!seenIds.has(item.id)) {
            seenIds.add(item.id);
            sanitizedNotifs.push({
              ...item,
              id: item.id.includes("-") ? item.id : `notif-sanitized-${idx}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            });
          }
        });
        setNotifications(sanitizedNotifs);
      }

      if (savedUnlocked) setIsUnlocked(JSON.parse(savedUnlocked));
      if (savedLastClaim) setLastCouponClaimedTime(JSON.parse(savedLastClaim));
    } catch (e) {
      console.error("Error reading localStorage", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem("love_settings", JSON.stringify(settings));
      localStorage.setItem("love_memories", JSON.stringify(memories));
      localStorage.setItem("love_coupons", JSON.stringify(coupons));
      localStorage.setItem("love_bucketlist", JSON.stringify(bucketList));
      localStorage.setItem("love_notes", JSON.stringify(notes));
      localStorage.setItem("love_notifications", JSON.stringify(notifications));
      localStorage.setItem("love_unlocked", JSON.stringify(isUnlocked));
      if (lastCouponClaimedTime) localStorage.setItem("love_last_coupon_time", JSON.stringify(lastCouponClaimedTime));
    } catch (e) {
      console.error("Error saving to localStorage", e);
    }
  }, [settings, memories, coupons, bucketList, notes, notifications, isUnlocked, lastCouponClaimedTime, isLoaded]);

  // ── Cross-Tab Sync via localStorage 'storage' event ──
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleStorageChange = (e: StorageEvent) => {
      if (!e.key || !e.newValue) return;

      try {
        switch (e.key) {
          case "love_notes": {
            const newNotes: LoveNote[] = JSON.parse(e.newValue);
            const currentIds = new Set(notes.map((n) => n.id));
            const addedNotes = newNotes.filter((n) => !currentIds.has(n.id));
            setNotes(newNotes);
            // Show toast for new notes from another tab
            if (addedNotes.length > 0) {
              const latest = addedNotes[0];
              const toast: LoveNotification = {
                id: generateUniqueId("cross-tab"),
                title: "Yeni Sevgi Notu Bırakıldı 💌",
                message: `${latest.sender}: "${latest.text}"`,
                timestamp: "Şimdi",
                type: "note",
                read: false,
              };
              setActiveToast(toast);
              setTimeout(() => setActiveToast((curr) => (curr?.id === toast.id ? null : curr)), 4500);
            }
            break;
          }
          case "love_notifications":
            setNotifications(JSON.parse(e.newValue));
            break;
          case "love_coupons":
            setCoupons(JSON.parse(e.newValue));
            break;
          case "love_bucketlist":
            setBucketList(JSON.parse(e.newValue));
            break;
          case "love_memories":
            setMemories(JSON.parse(e.newValue));
            break;
          case "love_settings":
            setSettings(JSON.parse(e.newValue));
            break;
        }
      } catch (err) {
        console.error("Cross-tab sync error:", err);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [notes]);

  const triggerNativeOSNotification = (title: string, body: string) => {
    if (typeof window === "undefined") return;

    if ("Notification" in window && Notification.permission === "granted") {
      try {
        new Notification(title, {
          body,
          icon: "/favicon.ico",
          badge: "/favicon.ico",
        });
      } catch (e) {
        console.log("Direct Notification error", e);
      }
    }

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready.then((reg) => {
        reg.showNotification(title, {
          body,
          icon: "/favicon.ico",
          badge: "/favicon.ico",
        } as NotificationOptions).catch(() => {});
      }).catch(() => {});
    }
  };

  const requestNativeNotificationPermission = async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      addNotification(
        "Canlı Not Bildirimleri Aktif 💌",
        "İçerideki canlı not & bildirim sistemi eksiksiz çalışmaktadır. Kilit ekranı bildirimleri ise site HTTPS ortamına yüklendiğinde otomatik aktif olacaktır!",
        "note"
      );
      return;
    }

    try {
      const perm = await Notification.requestPermission();
      setNotificationPermission(perm);

      if (perm === "granted") {
        addNotification("Bildirimler Etkinleştirildi 🔔", "Sitede yeni bir not veya eylem olduğunda cihazınıza anlık bildirim gelecek!", "note");
        triggerNativeOSNotification("Test Bildirimi 🔔", "Aşkımızın Sayfası bildirimleri cihazınızda aktif edildi! ❤️");
      } else if (perm === "denied") {
        addNotification(
          "Bildirim İzni Engellendi 🔒",
          "Tarayıcı adres çubuğundaki kilit (🔒) simgesine tıklayıp Bildirim iznini 'İzin Ver' olarak değiştiriniz.",
          "note"
        );
      }
    } catch (e) {
      console.error("Permission request error", e);
    }
  };

  const addNotification = (title: string, message: string, type: LoveNotification["type"]) => {
    const newNotif: LoveNotification = {
      id: generateUniqueId("notif"),
      title,
      message,
      timestamp: "Şimdi",
      type,
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
    setActiveToast(newNotif);

    triggerNativeOSNotification(title, message);

    setTimeout(() => {
      setActiveToast((curr) => (curr?.id === newNotif.id ? null : curr));
    }, 4500);
  };

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const addMemory = (memory: Omit<MemoryItem, "id">) => {
    const newItem: MemoryItem = {
      ...memory,
      id: generateUniqueId("memory"),
    };
    setMemories((prev) => [newItem, ...prev]);
    addNotification("Yeni Anı Eklendi 📸", `"${memory.title}" anılarımıza eklendi!`, "memory");
  };

  const deleteMemory = (id: string) => {
    setMemories((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleCoupon = (id: string) => {
    const targetCoupon = coupons.find((c) => c.id === id);
    if (!targetCoupon) return;

    const now = Date.now();
    const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

    // 1. RULE: Check 24 Hour Cooldown if trying to claim a new coupon
    if (!targetCoupon.isClaimed) {
      if (lastCouponClaimedTime && now - lastCouponClaimedTime < TWENTY_FOUR_HOURS) {
        const remainingMs = TWENTY_FOUR_HOURS - (now - lastCouponClaimedTime);
        const remainingHours = Math.ceil(remainingMs / (1000 * 60 * 60));
        addNotification(
          "Günlük Kupon Limiti Doldu! ⏳",
          `Günde yalnızca 1 kupon kullanabilirsiniz. Bir sonraki kupon hakkınız yaklaşık ${remainingHours} saat sonra açılacaktır ❤️`,
          "coupon"
        );
        return;
      }
    }

    // 2. RULE: Check Specific Expiration Date (lockedUntil)
    const isCurrentlyLocked = targetCoupon.isClaimed && targetCoupon.lockedUntil && new Date() < new Date(targetCoupon.lockedUntil);

    if (isCurrentlyLocked) {
      const formattedDate = new Date(targetCoupon.lockedUntil!).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
      addNotification(
        "Kupon Kilitli! 🔒",
        `"${targetCoupon.title}" kuponu kullanılmıştır. Yeniden talep etme tarihine (${formattedDate}) kadar kilitlidir ❤️`,
        "coupon"
      );
      return;
    }

    const willClaim = !targetCoupon.isClaimed;
    const lockDays = targetCoupon.lockDays || (targetCoupon.id === "c3" ? 14 : targetCoupon.id === "c4" ? 3 : 7);
    const newExpireIso = new Date(now + lockDays * 24 * 60 * 60 * 1000).toISOString();

    if (willClaim) {
      setLastCouponClaimedTime(now);
      const formattedDate = new Date(newExpireIso).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });

      addNotification(
        "Aşk Kuponu Kullanıldı! 🎟️",
        `"${targetCoupon.title}" kuponu kullanıldı. Yeniden talep tarihi: ${formattedDate} ❤️`,
        "coupon"
      );
    }

    setCoupons((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          return {
            ...c,
            isClaimed: willClaim,
            claimedAt: willClaim ? new Date().toLocaleDateString("tr-TR") : undefined,
            lockedUntil: willClaim ? newExpireIso : undefined,
          };
        }
        return c;
      })
    );
  };

  const addCoupon = (coupon: Omit<CouponItem, "id" | "isClaimed">) => {
    const newCoupon: CouponItem = {
      ...coupon,
      id: generateUniqueId("coupon"),
      isClaimed: false,
      lockDays: coupon.lockDays || 7,
    };
    setCoupons((prev) => [...prev, newCoupon]);
    addNotification("Yeni Kupon Eklendi 🎟️", `"${coupon.title}" kuponlar listesine eklendi!`, "coupon");
  };

  const editCoupon = (id: string, updated: Partial<CouponItem>) => {
    setCoupons((prev) => prev.map((c) => (c.id === id ? { ...c, ...updated } : c)));
  };

  const deleteCoupon = (id: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
  };

  const unlockCoupon = (id: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isClaimed: false, lockedUntil: undefined, claimedAt: undefined } : c))
    );
    setLastCouponClaimedTime(null);
    addNotification("Kupon Kilit Açıldı 🔓", "Kupon yeniden kullanılabilir hale getirildi!", "coupon");
  };

  const resetCouponCooldown = (id: string) => {
    unlockCoupon(id);
  };

  const toggleBucketListItem = (id: string) => {
    setBucketList((prev) =>
      prev.map((b) => {
        if (b.id === id) {
          const willComplete = !b.completed;
          if (willComplete) {
            addNotification("Gelecek Planı Tamamlandı! ✨", `"${b.title}" hayalimiz gerçekleşti!`, "bucketlist");
          }
          return { ...b, completed: willComplete };
        }
        return b;
      })
    );
  };

  const addBucketListItem = (title: string, category: string) => {
    const newItem: BucketListItem = {
      id: generateUniqueId("bucket"),
      title,
      category: category || "Hayat",
      completed: false,
    };
    setBucketList((prev) => [...prev, newItem]);
    addNotification("Yeni Gelecek Planı Eklendi 🗺️", `"${title}" hayaller listemize eklendi!`, "bucketlist");
  };

  const deleteBucketListItem = (id: string) => {
    setBucketList((prev) => prev.filter((b) => b.id !== id));
  };

  const addNote = (text: string, emoji: string = "❤️") => {
    const newNote: LoveNote = {
      id: generateUniqueId("note"),
      sender: settings.userName || "Sevgilin",
      text,
      date: `Bugün ${new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}`,
      emoji,
    };
    setNotes((prev) => [newNote, ...prev]);
    addNotification("Yeni Sevgi Notu Bırakıldı 💌", `${newNote.sender} yeni bir not bıraktı: "${text}"`, "note");
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const markNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const dismissToast = () => {
    setActiveToast(null);
  };

  const resetToDefaults = () => {
    setSettings(defaultSettings);
    setMemories(defaultMemories);
    setCoupons(defaultCoupons);
    setBucketList(defaultBucketList);
    setNotes(defaultNotes);
    setNotifications(defaultNotifications);
    setLastCouponClaimedTime(null);
    setIsUnlocked(false);
    localStorage.clear();
  };

  return (
    <AppContext.Provider
      value={{
        settings,
        memories,
        coupons,
        bucketList,
        notes,
        notifications,
        activeToast,
        notificationPermission,
        isUnlocked,
        setIsUnlocked,
        updateSettings,
        addMemory,
        deleteMemory,
        toggleCoupon,
        addCoupon,
        editCoupon,
        deleteCoupon,
        unlockCoupon,
        resetCouponCooldown,
        toggleBucketListItem,
        addBucketListItem,
        deleteBucketListItem,
        addNote,
        deleteNote,
        addNotification,
        requestNativeNotificationPermission,
        markNotificationsRead,
        clearNotifications,
        dismissToast,
        resetToDefaults,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
