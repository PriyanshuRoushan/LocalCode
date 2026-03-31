// data/dashboardData.js
// Fallback data and static content for DashboardPage.

export const USER_FALLBACK = {
  avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBKk0R9tkCF-7RFv9jKJFMAskFCkpAS5kn-wKEc-yyApp5LeMsbpttpbmJ1lsRvPztxlQZAIqAMqEjilz_KPQhFGpEkx0lzycQf9o0d-EqoBPExwf9nDn_DukiXo0AkeVRnHh7apAfaKAllrv1JTiamGWBr_fKHlir8fV_ip6XMCb23x5C-F1Swwu_akdrEkXUW-umMAJR5q7dmQWZHyTifgXbTzdAMjtsO7fiImMHhDudm27-4iyGHgiB4-UV-3OLV2zDbmHWmQgQ",
  streakDays: 14,
  xp: 2450,
  subtitle: "You're in the top 5% of solvers this week. Keep up the good work!",
};

export const CURRENT_PROBLEM = {
  id: 312,
  title: "Burst Balloons",
  ctaLabel: "Continue Solving: 312. Burst Balloons",
};

export const FOCUS_TOPIC = "Linked List";

export const MOCK_PROBLEM_METADATA = {
  // Mapping problem IDs to titles and difficulties for the dashboard
  1: { title: "Two Sum", difficulty: "Easy" },
  2: { title: "Add Two Numbers", difficulty: "Medium" },
  3: { title: "Longest Substring Without Repeating Characters", difficulty: "Medium" },
  4: { title: "Median of Two Sorted Arrays", difficulty: "Hard" },
  5: { title: "Longest Palindromic Substring", difficulty: "Medium" },
  20: { title: "Valid Parentheses", difficulty: "Easy" },
  21: { title: "Merge Two Sorted Lists", difficulty: "Easy" },
  42: { title: "Trapping Rain Water", difficulty: "Hard" },
  53: { title: "Maximum Subarray", difficulty: "Medium" },
  70: { title: "Climbing Stairs", difficulty: "Easy" },
  79: { title: "Word Search", difficulty: "Medium" },
  121: { title: "Best Time to Buy and Sell Stock", difficulty: "Easy" },
  141: { title: "Linked List Cycle", difficulty: "Easy" },
  167: { title: "Two Sum II - Input Array Is Sorted", difficulty: "Medium" },
  206: { title: "Reverse Linked List", difficulty: "Easy" },
  312: { title: "Burst Balloons", difficulty: "Hard" },
  // Default values used if problem not found:
  default: { title: "Unknown Problem", difficulty: "Medium" }
};