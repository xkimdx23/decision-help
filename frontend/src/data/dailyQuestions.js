const dailyQuestions = [
  { question: "Should I start learning a new language today?", mode: "yes_no" },
  { question: "Should I take a walk or read a book?", mode: "this_or_that", options: ["Take a walk", "Read a book"] },
  { question: "What should I focus on this week?", mode: "pick_from_list" },
  { question: "Is it time to start that creative project?", mode: "yes_no" },
  { question: "Should I save money or invest it?", mode: "this_or_that", options: ["Save money", "Invest"] },
  { question: "What skill should I learn next?", mode: "pick_from_list" },
  { question: "Should I reach out to an old friend today?", mode: "yes_no" },
  { question: "Cook dinner or order takeout?", mode: "this_or_that", options: ["Cook at home", "Order takeout"] },
  { question: "What hobby should I try this month?", mode: "pick_from_list" },
  { question: "Should I wake up earlier tomorrow?", mode: "yes_no" },
  { question: "Work out in the morning or evening?", mode: "this_or_that", options: ["Morning workout", "Evening workout"] },
  { question: "Which career move should I explore?", mode: "pick_from_list" },
  { question: "Should I start journaling today?", mode: "yes_no" },
  { question: "Listen to music or a podcast?", mode: "this_or_that", options: ["Listen to music", "Listen to a podcast"] },
  { question: "What book should I read next?", mode: "pick_from_list" },
  { question: "Should I take a social media break?", mode: "yes_no" },
  { question: "Stay home or go out tonight?", mode: "this_or_that", options: ["Stay home", "Go out"] },
  { question: "What new recipe should I try?", mode: "pick_from_list" },
  { question: "Should I sign up for that course?", mode: "yes_no" },
  { question: "Work on side project or learn something new?", mode: "this_or_that", options: ["Work on side project", "Learn something new"] },
  { question: "Which place should I visit this year?", mode: "pick_from_list" },
  { question: "Should I start meditating daily?", mode: "yes_no" },
  { question: "Call or text them?", mode: "this_or_that", options: ["Call", "Text"] },
  { question: "What habit should I build this month?", mode: "pick_from_list" },
  { question: "Should I ask for a raise?", mode: "yes_no" },
  { question: "Save money for travel or invest in skills?", mode: "this_or_that", options: ["Save for travel", "Invest in skills"] },
  { question: "Which online course should I take?", mode: "pick_from_list" },
  { question: "Should I adopt a pet?", mode: "yes_no" },
  { question: "Move to a new city or stay where I am?", mode: "this_or_that", options: ["Move to a new city", "Stay where I am"] },
  { question: "What volunteer work should I do?", mode: "pick_from_list" },
  { question: "Should I learn to play an instrument?", mode: "yes_no" },
  { question: "Start a business or get a job?", mode: "this_or_that", options: ["Start a business", "Get a job"] },
  { question: "What fitness goal should I set?", mode: "pick_from_list" },
  { question: "Should I delete social media apps?", mode: "yes_no" },
  { question: "Freelance or full-time job?", mode: "this_or_that", options: ["Freelance", "Full-time job"] },
  { question: "Which documentary should I watch?", mode: "pick_from_list" },
  { question: "Should I start a YouTube channel?", mode: "yes_no" },
  { question: "Learn piano or guitar?", mode: "this_or_that", options: ["Learn piano", "Learn guitar"] },
  { question: "What's my next big goal?", mode: "pick_from_list" },
  { question: "Should I take a vacation next month?", mode: "yes_no" },
  { question: "Read fiction or non-fiction?", mode: "this_or_that", options: ["Read fiction", "Read non-fiction"] },
  { question: "What new cuisine should I explore?", mode: "pick_from_list" },
  { question: "Should I go back to school?", mode: "yes_no" },
  { question: "Spend weekend relaxing or being productive?", mode: "this_or_that", options: ["Relax", "Be productive"] },
  { question: "Which language should I learn?", mode: "pick_from_list" }
];

export function getDailyQuestion() {
  const start = new Date("2026-01-01");
  const today = new Date();
  const diffDays = Math.floor((today - start) / (1000 * 60 * 60 * 24));
  const index = diffDays % dailyQuestions.length;
  return dailyQuestions[index];
}

export default dailyQuestions;
