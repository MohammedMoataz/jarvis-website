// Every sentence a visitor reads. Rules (design spec §1): no claim JARVIS does not back. The AI
// runs on the owner's machine, but the databases are hosted, so never say data stays on a PC.
// No iPhone, no push, no calories, no training progression. content/copy.test.mjs enforces this.

export type Section = {
  eyebrow: string;
  title: string;
  lead: string;
  icon: string; // primeicons class
  chips: string[];
  gold?: boolean; // recall and records only (token rule)
  points: string[];
};

const hero = {
  eyebrow: "A private second brain",
  title: "Say it once. Find it forever.",
  lead: "Capture anything from your phone, your browser or a chat. JARVIS files it, reminds you on time, and answers from your own notes, with sources.",
  primary: "Get JARVIS",
  secondary: "How it works",
  scene: {
    typed: "remind me to call mum at six",
    task: { kind: "Task", title: "Call mum", when: "Today · 18:00" },
    link: { kind: "Library", title: "How spaced repetition works", cite: "[1]" },
  },
};

const sayItOnce: Section = {
  eyebrow: "Capture",
  title: "Say it once.",
  lead: "One capture box, wherever you are. JARVIS keeps what you typed first, then works out what it is and files it.",
  icon: "pi pi-inbox",
  chips: ["task", "note", "link", "weight", "question"],
  points: [
    "Type in the phone's capture sheet, or share to JARVIS from any Android app.",
    "Right-click a page or a selection in Chrome, or press the shortcut.",
    "Take a photo of something printed: its text is read and filed like anything you typed.",
    "Each line becomes a task, a note, a saved link, a weight, or a question it answers.",
    "Kept the moment you send it, even offline or while the AI is busy.",
    "See what it filed in your weekly review, and move a note if it picked the wrong place.",
  ],
};

const askYourLibrary: Section = {
  eyebrow: "Recall",
  title: "Ask your own library.",
  lead: "Answers come from what you saved, with numbered sources you can open. When nothing matches, it says so.",
  icon: "pi pi-search",
  chips: ["[1]", "[2]", "Not in your library."],
  gold: true,
  points: [
    "Searches your notes, tasks, links, documents and video transcripts, by meaning and by words.",
    "Every answer cites its sources, and a video citation opens at the right second.",
    "Nothing relevant? It says “Not in your library.” and labels any general answer as general.",
    "Works in English and Arabic.",
    "Instructions hidden in something you saved are quoted, never obeyed.",
  ],
};

const readItLater: Section = {
  eyebrow: "Library",
  title: "Read it later, actually.",
  lead: "Save a link and JARVIS reads it in the background, then sums it up so you can ask about it.",
  icon: "pi pi-book",
  chips: ["article", "video", "playlist", "site section", "PDF"],
  gold: true,
  points: [
    "Articles and pages, without the clutter around them.",
    "YouTube videos through their captions, with chapters.",
    "Whole playlists and site sections, read one item at a time, with progress.",
    "A summary of up to 150 words with key points, in the source's own language.",
    "A summary never states a number that is not in the source.",
    "Attach a PDF in the Chrome extension: it is read page by page and cited by page.",
  ],
};

const yourDay: Section = {
  eyebrow: "Planning",
  title: "Your day, on your clock.",
  lead: "Tasks, reminders and meetings in your own time zone, and a daily rhythm that checks in at the times you choose.",
  icon: "pi pi-calendar",
  chips: ["18:00", "Today", "Weekly review"],
  points: [
    "Say “remind me to call mum at six” and get a task at 18:00 your time.",
    "Tasks with labels, priorities, estimates and repeats; deleted ones wait 30 days in a bin.",
    "Reminders that ring at the time you set, with snooze.",
    "Meetings and events that repeat, with one date skipped or moved.",
    "One notification per alert, even with several devices signed in.",
    "An evening plan for tomorrow, an end-of-day check-in, a morning briefing and a weekly review.",
    "Times stay right when the clocks change.",
  ],
};

const bodyAndHabits: Section = {
  eyebrow: "Habits",
  title: "Body and habits.",
  lead: "Training and meals that fit into the same day as everything else.",
  icon: "pi pi-heart",
  chips: ["slots", "programs", "meal line"],
  points: [
    "Weekly training slots keep the next two weeks of sessions on your calendar.",
    "Programs, session logs, and suggestions from your own library.",
    "A daily meal line from your own meals or the local AI: names, not numbers.",
    "Declare an allergy and it never shows up in a meal or a chat answer.",
  ],
};

const offline: Section = {
  eyebrow: "Offline",
  title: "Works without a connection.",
  lead: "The phone keeps your notes, tasks and saved links on the device and syncs when it can.",
  icon: "pi pi-wifi",
  chips: ["kept first", "synced later"],
  points: [
    "Capture on a plane; it is filed when you land.",
    "Notes, tasks and saved links open and change with no signal.",
    "The Chrome extension keeps what you type until it is sent.",
  ],
};

const privacy: Section = {
  eyebrow: "Privacy",
  title: "Private by design.",
  lead: "The AI runs on the owner's machine. No outside AI service ever sees what you write.",
  icon: "pi pi-shield",
  chips: ["Ollama", "your account only", "audited"],
  points: [
    "The AI runs locally on the owner's PC.",
    "Your data lives in databases that only this JARVIS uses.",
    "No member can reach another member's data: every search is limited to you inside the database itself.",
    "The owner can see a list of what you saved, read-only. Every look is audited and listed for you in the Chrome extension.",
    "Signing out or removing a device ends that session within seconds.",
  ],
};

const assistants: Section = {
  eyebrow: "For engineers",
  title: "Bring your other assistants.",
  lead: "JARVIS speaks MCP, so Claude or another assistant can work with your library on your terms.",
  icon: "pi pi-sitemap",
  chips: ["MCP", "search_library", "request_change"],
  points: [
    "Let an assistant search your library and see your open tasks.",
    "Let it drop captures into your capture box.",
    "Let it propose a change that waits for your Yes in the JARVIS chat.",
    "A desktop agent captures from your clipboard.",
    "Ask the owner to set up a connection for you.",
  ],
};

const getIt = {
  eyebrow: "Get it",
  title: "Have your own second brain.",
  lead: "Download the Android app and the Chrome extension, paste the server address, and create your account.",
  more: "Step-by-step setup",
};

export const copy = { hero, sayItOnce, askYourLibrary, readItLater, yourDay, bodyAndHabits, offline, privacy, assistants, getIt };

export const SECTIONS = ["sayItOnce", "askYourLibrary", "readItLater", "yourDay", "bodyAndHabits", "offline", "privacy", "assistants"] as const;
