document.addEventListener("DOMContentLoaded", () => {
  // Handle submission
  const form = document.getElementById("submissionForm");
  const response = document.getElementById("response");

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const storyText = document.getElementById("story").value.trim();

      if (!storyText) {
        response.textContent = "Please write something first.";
        return;
      }

      // Save to localStorage
      const submissions = JSON.parse(localStorage.getItem("greylit_stories") || "[]");
      submissions.push({ text: storyText, date: new Date().toISOString() });
      localStorage.setItem("greylit_stories", JSON.stringify(submissions));

      // Show confirmation
      response.textContent = "Submitted. Thank you for your truth.";

      form.reset();
    });
  }

  // On homepage: display submissions
  const feed = document.getElementById("story-feed");
  if (feed) {
    const submissions = JSON.parse(localStorage.getItem("greylit_stories") || "[]").reverse();
    submissions.forEach((s) => {
      const div = document.createElement("div");
      div.className = "content-box";
      div.textContent = s.text;
      feed.appendChild(div);
    });
  }
  document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("submissionForm");
  const response = document.getElementById("response");

  // Handle form submit
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const storyText = document.getElementById("story").value.trim();
      if (!storyText) {
        response.textContent = "Please write something first.";
        return;
      }

      // Save to localStorage
      const submissions = JSON.parse(localStorage.getItem("greylit_stories") || "[]");
      submissions.push({ text: storyText, date: new Date().toISOString() });
      localStorage.setItem("greylit_stories", JSON.stringify(submissions));

      response.textContent = "Submitted. Thank you for your truth.";
      form.reset();
    });
  }

  // Render submissions on homepage
  const feed = document.getElementById("story-feed");
  if (feed) {
    const submissions = JSON.parse(localStorage.getItem("greylit_stories") || "[]").reverse();
    if (submissions.length === 0) {
      feed.innerHTML += `<p class="tagline">No stories yet. Be the first to share.</p>`;
    } else {
      submissions.forEach((s) => {
        const box = document.createElement("div");
        box.className = "content-box";
        box.textContent = s.text;
        feed.appendChild(box);
      });
    }
  }
});

