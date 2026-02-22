const roadmap = [
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
    title: ">🛠️ Engineering Upgrade",
    duration: "Ongoing",
    topics: ["Testing (pytest)", "Docker Basics", "CI/CD", "System Design", "Caching (Redis)", "Clean Code"],
    resources: ["Clean Code Book", "Docker Docs"],
    build: ["Containerized App", "Test Coverage", "Performance Optimization"],
    completed: false
  }
];

// Load saved progress
const saved = JSON.parse(localStorage.getItem("roadmap"));
if (saved) {
  for (let i = 0; i < roadmap.length; i++) {
    roadmap[i].completed = saved[i].completed;
  }
}

const phasesContainer = document.getElementById("phases");

function renderPhases() {
  phasesContainer.innerHTML = "";

  roadmap.forEach(phase => {
    const card = document.createElement("div");
    card.className = "phase-card";
    if (phase.completed) card.classList.add("completed");

    card.innerHTML = `
      <div class="phase-header">
        <div>
          <h3>${phase.title}</h3>
          <span class="badge">${phase.duration}</span>
        </div>
        <button onclick="toggleExpand(${phase.id})">Details</button>
      </div>

      <div class="details">
        <div class="section-title">Topics</div>
        <div class="tag-list">
          ${phase.topics.map(t => `<span>${t}</span>`).join("")}
        </div>

        <div class="section-title">Resources</div>
        <div class="tag-list">
          ${phase.resources.map(r => `<span>${r}</span>`).join("")}
        </div>

        <div class="section-title">Build</div>
        <div class="tag-list">
          ${phase.build.map(b => `<span>${b}</span>`).join("")}
        </div>

        <button onclick="toggleComplete(${phase.id})">
          ${phase.completed ? "Completed ✓" : "Mark as Complete"}
        </button>
      </div>
    `;

    phasesContainer.appendChild(card);
  });

  updateProgress();
}

function toggleComplete(id) {
  const phase = roadmap.find(p => p.id === id);
  phase.completed = !phase.completed;

  localStorage.setItem("roadmap", JSON.stringify(roadmap));
  renderPhases();
}

function updateProgress() {
  const completed = roadmap.filter(p => p.completed).length;
  const percent = (completed / roadmap.length) * 100;

  document.getElementById("progressText").textContent =
    `${completed}/${roadmap.length} Phases`;

  document.getElementById("progressFill").style.width = percent + "%";
}

function toggleExpand(id) {
  const cards = document.querySelectorAll(".phase-card");
  cards[id - 1].classList.toggle("expanded");
}

renderPhases();