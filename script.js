// Only declare once!
const SUPABASE_URL = "https://pzijwvijruzjgmoekjlx.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6aWp3dmlqcnV6amdtb2Vramx4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0MTY2ODUsImV4cCI6MjA2Mjk5MjY4NX0.cJzlLk44FQPaymfmtorU4sju_53W-TPIvHHSWUZK3PI";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("submissionForm");
  const response = document.getElementById("response");

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const storyText = document.getElementById("story").value.trim();

      if (!storyText) {
        response.textContent = "Please write something first.";
        return;
      }

      console.log("Submitting:", storyText);

      const { error } = await supabase
        .from("submissions")
        .insert([{ text: storyText }]);

      if (error) {
        console.error("Error submitting:", error);
        response.textContent = "Something went wrong. Try again.";
      } else {
        response.textContent = "Submitted. Thank you for your truth.";
        form.reset();
      }
    });
  }

  const feed = document.getElementById("story-feed");
  if (feed) {
    loadStories(feed);
  }

  async function loadStories(feed) {
    const { data, error } = await supabase
      .from("submissions")
      .select("*")
      .order("created_at", { ascending: false_
