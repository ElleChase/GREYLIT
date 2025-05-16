const SUPABASE_URL = "https://pzijwvijruzjgmoekjlx.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6aWp3dmlqcnV6amdtb2Vramx4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0MTY2ODUsImV4cCI6MjA2Mjk5MjY4NX0.cJzlLk44FQPaymfmtorU4sju_53W-TPIvHHSWUZK3PI";

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("submissionForm");
  const response = document.getElementById("response");

  // Handle form submission
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const storyText = document.getElementById("story").value.trim();

      if (!storyText) {
        response.textContent = "Please write something first.";
        return;
      }

      console.log("Submitting:", storyText); // Optional: debug in console

      const { error } = await supabase.from("submissions").insert([
        { text: storyText }
      ]);

      if (error) {
        console.error("Error submitting:", error);
        response.textContent = "Something went wrong. Try again.";
      } else {
        response.textContent = "Submitted. Thank you for your truth.";
        form.reset();
      }
    });
  }

  // Load and display stories on the homepage
  const feed = document.getElementById("story-feed");
  if (feed) {
    loadStories(feed);
  }

  async function loadStories(feed) {
    const { data, error } = await supabase
      .from("submissions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading stories:", error);
      return;
    }

    data.forEach((entry) => {
      const div = document.createElement("div");
      div.className = "content-box";
      div.textContent = entry.text;
      feed.appendChild(div);
    });
  }
});
