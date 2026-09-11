export const MOTIVATIONS = [
  "Every small step forward is progress. Keep going! 🚀",
  "Discipline is the bridge between goals and accomplishment. 🌉",
  "The secret of getting ahead is getting started. — Mark Twain ✨",
  "Success is the sum of small efforts repeated day in and day out. 💪",
  "You don't have to be great to start, but you have to start to be great. 🌟",
  "Small daily improvements are the key to staggering long-term results. 📈",
  "Consistency is what transforms average into excellence. ⭐",
  "Your future is created by what you do today, not tomorrow. 🔮",
  "Progress, not perfection. Keep moving forward. 🎯",
  "The journey of a thousand miles begins with a single step. — Lao Tzu 🥾",
  "Do something today that your future self will thank you for. 🙏",
  "Motivation gets you started. Habit keeps you going. — Jim Ryun 🔄",
  "Don't wish for it. Work for it. 💼",
  "Every accomplishment starts with the decision to try. 🌱",
  "Bismillah — begin with the name of Allah and trust the process. 🕌",
  "Verily, with hardship comes ease. — Quran 94:6 🌸",
  "The best deeds are those done consistently, even if small. — Hadith 📿",
  "Discipline yourself today so you can be free tomorrow. 🕊️",
];

export const getDailyMotivation = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start;
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  return MOTIVATIONS[dayOfYear % MOTIVATIONS.length];
};

export const getRandomMotivation = () =>
  MOTIVATIONS[Math.floor(Math.random() * MOTIVATIONS.length)];