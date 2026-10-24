const goalButton = document.getElementById("goal-button");
const goalMessage = document.getElementById("goal-message");

goalButton.addEventListener("click", function () {
    goalMessage.textContent =
        "My next step is to build and publish my first complete website.";
});
const themeButton = document.getElementById("theme-button");

function applyTheme(isDark) {
    document.body.classList.toggle("dark-mode", isDark);

    themeButton.textContent = isDark
        ? "Enable Light Mode"
        : "Enable Dark Mode";

    themeButton.setAttribute("aria-pressed", String(isDark));
}

// Restore the saved theme when the page opens.
const savedTheme = localStorage.getItem("theme");
applyTheme(savedTheme === "dark");

// Change and save the theme when the button is clicked.
themeButton.addEventListener("click", function () {
    const isDark = !document.body.classList.contains("dark-mode");

    applyTheme(isDark);

    localStorage.setItem("theme", isDark ? "dark" : "light");
});
const yearElement = document.getElementById("current-year");
const currentYear = new Date().getFullYear();

yearElement.textContent = currentYear;

const projectForm = document.getElementById("project-form");
const projectTitle = document.getElementById("project-title");
const projectDescription =
    document.getElementById("project-description");
const projectGrid = document.querySelector(".project-grid");
const projectFeedback =
    document.getElementById("project-feedback");

let projects = [];

// Read previously saved projects.
try {
    const saved = JSON.parse(
        localStorage.getItem("portfolio-projects") || "[]"
    );

    if (Array.isArray(saved)) {
        projects = saved.filter(function (project) {
            return project !== null
                && typeof project === "object"
                && typeof project.title === "string"
                && typeof project.description === "string";
        });
    }
} catch (error) {
    projectFeedback.textContent =
        "Saved projects could not be loaded.";
}

// Display one project card.
function displayProject(project) {
    
    const card = document.createElement("article");
    card.className = "project-card";

    const heading = document.createElement("h3");
    heading.textContent = project.title;

    const paragraph = document.createElement("p");
    paragraph.textContent = project.description;

    const status = document.createElement("span");
    status.className = "status";
    status.textContent = "Planned";

    card.append(heading, paragraph, status);
    projectGrid.append(card);
}

// Restore saved cards.
projects.forEach(displayProject);

// Add and save a new project.
projectForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const title = projectTitle.value.trim();
    const description = projectDescription.value.trim();

    if (!title || !description) {
        projectFeedback.textContent =
            "Please enter a project name and description.";
        return;
    }

    const project = {
        title: title,
        description: description
    };

    projects.push(project);
    displayProject(project);

    try {
        localStorage.setItem(
            "portfolio-projects",
            JSON.stringify(projects)
        );

        projectFeedback.textContent = "Project added and saved!";
    } catch (error) {
        projectFeedback.textContent =
            "Project added, but could not be saved in this browser.";
    }

    projectForm.reset();
    projectTitle.focus();
});

const projectSearch = document.getElementById("project-search");
const searchFeedback = document.getElementById("search-feedback");
const noProjects = document.getElementById("no-projects");

function filterProjects() {
    const query = projectSearch.value.trim().toLowerCase();
    const cards = projectGrid.querySelectorAll(".project-card");
    let matches = 0;

    cards.forEach(function (card) {
        const title = card.querySelector("h3")
            .textContent.toLowerCase();

        const isMatch = title.includes(query);
        card.hidden = !isMatch;

        if (isMatch) {
            matches++;
        }
    });

    searchFeedback.textContent = query
        ? matches + " project(s) found."
        : "";
}

projectSearch.addEventListener("input", filterProjects);
noProjects.hidden = matches > 0;
