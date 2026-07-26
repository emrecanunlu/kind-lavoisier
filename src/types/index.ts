export interface MemoryItem {
  id: string;
  title: string;
  date: string;
  description: string;
  imageUrl?: string;
  location?: string;
  tag?: string;
}

export interface CouponItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  isClaimed: boolean;
  claimedAt?: string;
  lockDays?: number; // Duration in days (e.g., 3 days, 7 days, 14 days)
  lockedUntil?: string; // ISO date string of expiration
}

export interface BucketListItem {
  id: string;
  title: string;
  category: string;
  completed: boolean;
}

export interface LoveNote {
  id: string;
  sender: string;
  text: string;
  date: string;
  emoji: string;
}

export interface LoveNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: "note" | "coupon" | "memory" | "bucketlist";
  read: boolean;
}

export interface AppSettings {
  userName: string;
  partnerName: string;
  passcode: string;
  isPasscodeEnabled: boolean;
  reunionDate: string; // YYYY-MM-DDTHH:mm
  anniversaryDate: string;
  birthdayDate: string;
  userCity: string;
  partnerCity: string;
  distanceKm: number;
  letterTitle: string;
  letterContent: string;
  letterSender: string;
  customAudioUrl?: string;
}
