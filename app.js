// ============================
// Sidebar Navigation + Refresh
// ============================
document.addEventListener("DOMContentLoaded", () => {
  const sidebarItems = document.querySelectorAll(".sidebar ul li");

  sidebarItems.forEach(item => {
    item.addEventListener("click", () => {
      let sectionId = item.getAttribute("data-section");

      // If no data-section, try extracting from onclick attribute
      if (!sectionId) {
        const onclickAttr = item.getAttribute("onclick");
        if (onclickAttr) {
          const match = onclickAttr.match(/\(['"]([^'"]+)['"]\)/);
          if (match) {
            sectionId = match[1];
          }
        }
      }

      if (!sectionId) return;

      const target = document.getElementById(sectionId);

      // If already active, refresh the section
      if (target && target.classList.contains("active")) {
        refreshSection(sectionId);
      } else {
        requestPinAndShow(sectionId);
      }
    });
  });
});

// Show a section and update sidebar active state
function showSection(sectionId) {
  // Hide all sections
  document.querySelectorAll(".section").forEach(sec => {
    sec.classList.remove("active");
    sec.style.display = "none";
  });

  // Show target section
  const target = document.getElementById(sectionId);
  if (target) {
    target.classList.add("active");
    target.style.display = "block";
  }

  // Update active state in sidebar
  document.querySelectorAll(".sidebar ul li").forEach(item => {
    const isActive = 
      item.getAttribute("data-section") === sectionId ||
      (item.getAttribute("onclick") && item.getAttribute("onclick").includes(`'${sectionId}'`));

    item.classList.toggle("active", isActive);
  });
}

// Wrapper for PIN-secured sections
function requestPinAndShow(sectionId) {
  showSection(sectionId);
}

// Refresh a section when clicked again
function refreshSection(sectionId) {
  const target = document.getElementById(sectionId);
  if (!target) return;

  // Option 1: Soft refresh (re-hide & re-show)
  target.style.display = "none";
  setTimeout(() => {
    target.style.display = "block";
  }, 150);
}

// ============================
// Header Clock + Daily Quotes + Greeting
// ============================
const quotes = [
  "Believe you can and you're halfway there.",
  "Every day is a new beginning.",
  "Do something today that your future self will thank you for.",
  "Success is not final, failure is not fatal: it is the courage to continue that counts.",
  "Happiness depends upon ourselves.",
  "Don't watch the clock; do what it does. Keep going.",
  "Your limitation—it's only your imagination.",
  "Push yourself, because no one else is going to do it for you."
];

function updateClock() {
  const now = new Date();

  // Update clock, day, and date
  document.getElementById("clock").textContent = now.toLocaleTimeString();
  document.getElementById("day").textContent = now.toLocaleDateString("en-US", { weekday: "long" });
  document.getElementById("date").textContent = now.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });

  // Greeting based on time
  const hour = now.getHours();
  let greeting = "";
  if (hour >= 5 && hour < 12) {
    greeting = "Good Morning";
  } else if (hour >= 12 && hour < 17) {
    greeting = "Good Afternoon";
  } else if (hour >= 17 && hour < 21) {
    greeting = "Good Evening";
  } else {
    greeting = "Good Night";
  }
  document.getElementById("greeting").textContent = greeting;

  // Pick a daily quote (changes each day)
  const dayIndex = now.getDay();
  document.getElementById("quote").textContent = quotes[dayIndex % quotes.length];
}

setInterval(updateClock, 1000);
updateClock();

//login js//
const logoutBtn = document.getElementById('logoutBtn');

logoutBtn.addEventListener('click', () => {
  const confirmLogout = confirm("Are you sure you want to log out?");
  if (confirmLogout) {
    localStorage.removeItem("currentUser");

    window.location.href = 'index.html';
  }
});

