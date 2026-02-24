// =======================
// DOM ELEMENTS
// =======================
const phasesContainer = document.getElementById("phases");
const progressText = document.getElementById("progressText");
const progressFill = document.getElementById("progressFill");
const aiBtn = document.getElementById("aiGenerateBtn"); // Ensure this button exists in your HTML

// =======================
// API BASE FROM ENV
// =======================
const API_BASE = process.env.REACT_APP_API_BASE; 
if (!API_BASE) {
  console.error("REACT_APP_API_BASE is not set in .env");
}

// =======================
// HARD-CODED ROADMAP DATA
// =======================
let roadmap = [
  {
    id: 1,
    title: "⚡JavaScript Frontend Mastery",
    duration: "1-2 Months",
    topics: ["ES6+", "Async/Await", "DOM", "Fetch API", "Error Handling", "Modules"],
    resources: ["Mozilla MDN", "Eloquent JavaScript"],
    build: ["Dynamic To-Do App", "Form Validation App", "API Consumption Project"],
    completed: false
  },
  {
    id: 2,
    title: "🐍Python Fundamentals",
    duration: "1 Month",
    topics: ["Functions", "OOP", "List Comprehensions", "Virtual Environments", "Modules", "Error Handling"],
    resources: ["Automate the Boring Stuff"],
    build: ["CLI Tools", "File Processing Scripts"],
    completed: false
  },
  {
    id: 3,
    title: "🔧Backend with FastAPI",
    duration: "2 Months",
    topics: ["REST APIs", "Pydantic", "JWT Auth", "SQLAlchemy ORM", "Alembic", "PostgreSQL"],
    resources: ["FastAPI Docs", "Database Design"],
    build: ["Auth System", "CRUD System", "Role-Based Access", "Pagination"],
    completed: false
  },
  {
    id: 4,
    title: "⚛️React Frontend",
    duration: "1-2 Months",
    topics: ["Components", "Hooks", "Routing", "Context", "API Integration", "State Management"],
    resources: ["React Docs", "React Router"],
    build: ["Full Auth Flow", "Dashboard", "Data Table", "Protected Routes"],
    completed: false
  },
  {
    id: 5,
    title: "🚀Deployment",
    duration: "2-3 Weeks",
    topics: ["Vercel/Netlify", "Render/Railway", "PostgreSQL", "CORS", "Environment Vars", "Logging"],
    resources: ["Platform Docs", "Production Best Practices"],
    build: ["Deploy Full-Stack App", "CI/CD Setup"],
    completed: false
  },
  {
    id: 6,
    title: "🛠️ Engineering Upgrade",
    duration: "Ongoing",
    topics: ["Testing (pytest)", "Docker Basics", "CI/CD", "System Design", "Caching (Redis)", "Clean Code"],
    resources: ["Clean Code Book", "Docker Docs"],
    build: ["Containerized App", "Test Coverage", "Performance Optimization"],
    completed: false
  }
];

// =======================
// LOAD SAVED PROGRESS
// =======================
const savedProgress = JSON.parse(localStorage.getItem("roadmapProgress")) || {};
roadmap.forEach(phase => {
  if (savedProgress[phase.id] !== undefined) phase.completed = savedProgress[phase.id];
});

// =======================
// RENDER FUNCTION
// =======================
function renderPhases() {
  phasesContainer.innerHTML = "";

  roadmap.forEach(phase => {
    const card = document.createElement("div");
    card.className = "phase-card";
    card.dataset.id = phase.id;
    if (phase.completed) card.classList.add("completed");

    card.innerHTML = `
      <div class="phase-header">
        <div>
          <h3>${phase.title}</h3>
          <span class="badge">${phase.duration}</span>
        </div>
        <button class="expand-btn">Details</button>
      </div>

      <div class="details">
        <div class="section-title">Topics</div>
        <div class="tag-list">${phase.topics.map(t => `<span>${t}</span>`).join("")}</div>

        <div class="section-title">Resources</div>
        <div class="tag-list">${phase.resources.map(r => `<span>${r}</span>`).join("")}</div>

        <div class="section-title">Build</div>
        <div class="tag-list">${phase.build.map(b => `<span>${b}</span>`).join("")}</div>

        <button class="complete-btn">
          ${phase.completed ? "Completed ✓" : "Mark as Complete"}
        </button>
      </div>
    `;

    phasesContainer.appendChild(card);

    // Event listeners
    card.querySelector(".expand-btn").addEventListener("click", () => card.classList.toggle("expanded"));
    card.querySelector(".complete-btn").addEventListener("click", () => toggleComplete(phase.id));
  });

  updateProgress();
}

// =======================
// TOGGLE COMPLETE
// =======================
function toggleComplete(id) {
  const phase = roadmap.find(p => p.id === id);
  phase.completed = !phase.completed;

  // Save progress
  const progressMap = {};
  roadmap.forEach(p => (progressMap[p.id] = p.completed));
  localStorage.setItem("roadmapProgress", JSON.stringify(progressMap));

  renderPhases();
}

// =======================
// UPDATE PROGRESS BAR
// =======================
function updateProgress() {
  const completed = roadmap.filter(p => p.completed).length;
  const percent = (completed / roadmap.length) * 100;

  progressText.textContent = `${completed}/${roadmap.length} Phases`;
  progressFill.style.width = percent + "%";
}

// =======================
// INITIAL RENDER
// =======================
renderPhases();

// =======================
// GET JWT TOKEN (if not exists)
// =======================
async function getJWT() {
  let token = localStorage.getItem("user_jwt");
  if (!token) {
    const tokenResp = await fetch(`${API_BASE}/token`, { method: "POST" });
    const data = await tokenResp.json();
    token = data.token;
    localStorage.setItem("user_jwt", token);
  }
  return token;
}

// =======================
// AI GENERATED ROADMAP
// =======================
aiBtn.addEventListener("click", async () => {
  aiBtn.disabled = true;
  aiBtn.textContent = "Generating...";

  try {
    const jwtToken = await getJWT();

    const response = await fetch(`${API_BASE}/generate-roadmap`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwtToken}`
      },
      body: JSON.stringify({ path: "fullstack" })
    });

    const aiRoadmap = await response.json();
    if (aiRoadmap.error) throw new Error(aiRoadmap.error);

    // Map AI roadmap
    roadmap = aiRoadmap.map((phase, index) => ({
      id: index + 1,
      title: phase.title,
      duration: phase.duration,
      topics: phase.topics,
      resources: phase.resources,
      build: phase.build,
      completed: false
    }));

    renderPhases();

  } catch (err) {
    console.error(err);
    alert("AI roadmap generation failed. Using default roadmap.");
  } finally {
    aiBtn.disabled = false;
    aiBtn.textContent = "Generate AI Roadmap";
  }
});