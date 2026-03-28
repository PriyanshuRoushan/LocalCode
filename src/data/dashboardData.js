// data/dashboardData.js
// All static/seed data consumed by DashboardPage.
// Replace with API calls as needed.

export const USER = {
  name: "Alex",
  avatarUrl:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBKk0R9tkCF-7RFv9jKJFMAskFCkpAS5kn-wKEc-yyApp5LeMsbpttpbmJ1lsRvPztxlQZAIqAMqEjilz_KPQhFGpEkx0lzycQf9o0d-EqoBPExwf9nDn_DukiXo0AkeVRnHh7apAfaKAllrv1JTiamGWBr_fKHlir8fV_ip6XMCb23x5C-F1Swwu_akdrEkXUW-umMAJR5q7dmQWZHyTifgXbTzdAMjtsO7fiImMHhDudm27-4iyGHgiB4-UV-3OLV2zDbmHWmQgQ",
  streakDays: 14,
  xp: 2450,
  subtitle: "You're in the top 5% of solvers this week. One more problem to hit your daily goal.",
};

export const CURRENT_PROBLEM = {
  id: 312,
  title: "Burst Balloons",
  ctaLabel: "Continue Solving: 312. Burst Balloons",
};

export const PROBLEM_STATS = {
  totalSolved: 412,
  totalProbs: 550,
  breakdown: { Easy: 132, Medium: 245, Hard: 35 },
};

export const WEEKLY_DATA = [
  { day: "Mon", count: 2 },
  { day: "Tue", count: 4 },
  { day: "Wed", count: 7, active: true },
  { day: "Thu", count: 3 },
  { day: "Fri", count: 5 },
  { day: "Sat", count: 2 },
  { day: "Sun", count: 1 },
];

export const RECENT_ACTIVITY = [
  {
    status: "accepted",
    title: "Two Sum II - Input Array Is Sorted",
    meta: "Java • 2 mins ago • 1.2ms Runtime",
  },
  {
    status: "rejected",
    title: "Word Search",
    meta: "C++ • 1 hour ago • Time Limit Exceeded",
  },
  {
    status: "accepted",
    title: "Valid Palindrome",
    meta: "Python • 4 hours ago • 98% Memory Rank",
  },
];

export const FOCUS_TOPIC = "Linked List";