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
  lead: "The AI that files and answers runs on the owner's machine. An outside assistant sees your library only if you connect one.",
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

const getStarted = {
  title: "Get started",
  lead: "Two downloads, one address, one account. About ten minutes.",
  phoneTitle: "On your Android phone",
  phone: [
    "Tap “Android app (APK)” above and open the downloaded file.",
    "If Android asks, allow your browser to install unknown apps, then tap Install.",
    "Open JARVIS and paste the server address from this page.",
    "Choose “Create an account”, enter an email or a username, and a password of at least 8 characters.",
    "Answer the short setup: about you, your day, and training. You can skip it.",
    "Tap the centre button and capture your first thought.",
  ],
  extensionTitle: "In Chrome on your computer",
  extension: [
    "Tap “Chrome extension (zip)” above and unzip it into a folder you will keep.",
    "Open chrome://extensions and turn on Developer mode (top right).",
    "Click Load unpacked and choose the unzipped folder.",
    "Pin JARVIS from the puzzle-piece menu, then click it to open the side panel.",
    "Paste the server address. Chrome asks once to let JARVIS reach that address: allow it.",
    "Sign in with the same account you made on the phone.",
  ],
  google: "Continue with Google works only if the owner has added your Google account. Otherwise use an email or username and a password.",
  iphone: "iPhone: not available. JARVIS has an Android app and a Chrome extension.",
  updatingTitle: "Updating",
  updating: [
    "Phone: download the new APK from this page and install it over the old one. Your data stays.",
    "Chrome: unzip the new version into the same folder, then click the reload arrow on JARVIS in chrome://extensions.",
  ],
  troubleshootingTitle: "If something goes wrong",
  troubleshooting: [
    {
      q: "JARVIS shows as offline.",
      a: "It runs on the owner's PC, which is off or restarting. Your phone keeps what you capture and sends it later. Try again in a while.",
    },
    {
      q: "Creating an account fails.",
      a: "Registration may be closed. Ask the owner to open it or to make an account for you.",
    },
    {
      q: "Android blocks the install.",
      a: "Allow installs from your browser in Settings, or tap “Install anyway” if Play Protect asks.",
    },
    {
      q: "The server address changed.",
      a: "Open JARVIS while the old address still works so everything can sync, then sign out and sign in with the new address. Signing out clears what is stored on the device, so let it sync first.",
    },
  ],
};

const howItWorks = {
  title: "How it works",
  lead: "For the curious and the engineers: what happens to a line you type, where it runs, and how it stays private.",
  loopTitle: "The loop",
  loop: [
    "Capture: the line is stored first, raw, with an id your device made, so a retry is never a duplicate.",
    "Classify: a local model decides task, note, link, weight or question, held to a fixed schema.",
    "File: the line becomes a real task, note or saved link; times are worked out in code, in your time zone.",
    "Index: notes, tasks, links and documents are split into passages and embedded for search.",
    "Recall: questions search by meaning and by words, and answers cite the passages they used.",
    "Act: reminders, the daily plan, the check-in and the weekly review keep it moving.",
  ],
  diagramTitle: "Architecture",
  patternsTitle: "How the code is built",
  patterns: [
    { title: "Bounded contexts", text: "19 contexts, each owning its data. None reads another's collections; a lint rule enforces it." },
    { title: "Vertical slices", text: "One folder per use case, holding its handler, its endpoint and its tests." },
    { title: "Commands and queries", text: "Changes are REST commands, reads are GraphQL, and one socket per device carries live replies." },
    { title: "Transactional outbox", text: "Every change writes its event in the same transaction, delivered at least once to idempotent consumers." },
    { title: "Model work off the event path", text: "Classifying, summarising and embedding run in worker loops with heartbeats, so one slow call holds nothing up." },
    { title: "Checks that are proven", text: "Each architecture rule has a probe: a deliberately bad file that must make the check fail." },
  ],
  aiTitle: "Local AI",
  ai: [
    "Ollama on the owner's PC runs qwen2.5:3b-instruct for chat and classification, and embeddinggemma for search.",
    "Extraction is held to a JSON schema, then checked in code: a number the line never said is thrown away.",
    "The model never does dates or arithmetic: “at six” becomes 18:00 in your time zone in code.",
    "Prompts stay byte-for-byte stable between turns, so the model answers quickly.",
  ],
  syncTitle: "Offline sync",
  sync: [
    "The phone keeps notes, tasks and links in a local database and sends changes in one batch.",
    "Each change carries the server time it was based on; an edit made on an older copy is refused as stale and the phone takes the server's version.",
    "Another device's change reaches you within seconds through a nudge on the socket.",
  ],
  privacyTitle: "Privacy model",
  privacy: [
    "Every row carries its owner, and every search filters by you inside the database query.",
    "Each renewal of a session swaps its renewal token for a new one; replaying an old one ends the whole session.",
    "The owner's view of a member's library is read-only and audited, and the member sees each access.",
    "Only one port is open to the world: everything goes through a single edge.",
  ],
  stackTitle: "Stack",
  stack: [
    "NestJS backend · MongoDB and PostgreSQL",
    "Flutter phone app with an offline database",
    "Chrome extension built with WXT",
    "Admin portal in Next.js",
    "Ollama for local AI",
    "Docker Compose behind nginx",
  ],
};

export const copy = {
  hero,
  sayItOnce,
  askYourLibrary,
  readItLater,
  yourDay,
  bodyAndHabits,
  offline,
  privacy,
  assistants,
  getIt,
  getStarted,
  howItWorks,
};

export const SECTIONS = ["sayItOnce", "askYourLibrary", "readItLater", "yourDay", "bodyAndHabits", "offline", "privacy", "assistants"] as const;
