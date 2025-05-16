const SUPABASE_URL = "https://pzijwvijruzjgmoekjlx.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6aWp3dmlqcnV6amdtb2Vramx4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0MTY2ODUsImV4cCI6MjA2Mjk5MjY4NX0.cJzlLk44FQPaymfmtorU4sju_53W-TPIvHHSWUZK3PI"; // Keep your Supabase key here!
const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("submissionForm");
  const response = document.getElementById("response");

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const storyText = document.getElementById("story").value.trim();
      const imageFile = document.getElementById("image").files[0]; // Getting the image file

      if (!storyText && !imageFile) {
        response.textContent = "Please write something or upload an image.";
        return;
      }

      // Upload image to Supabase Storage if there's one
      let imageUrl = null;
      if (imageFile) {
        const fileName = `${Date.now()}_${imageFile.name}`; // Using timestamp to avoid name conflicts
        const { data, error: uploadError } = await client.storage
          .from("images") // Make sure you have a bucket named "images"
          .upload(fileName, imageFile);

        if (uploadError) {
          console.error("Error uploading image:", uploadError);
          response.textContent = "Failed to upload image.";
          return;
        }

        imageUrl = data.Key ? `https://pzijwvijruzjgmoekjlx.supabase.co/storage/v1/object/public/images/${data.Key}` : null;
      }

      // Insert the submission (text and image URL) into the database
      const { error } = await client
        .from("submissions")
        .insert([{ text: storyText, image_url: imageUrl }]);

      if (error) {
        console.error("Error submitting:", error);
        response.textContent = "Something went wrong. Try again.";
      } else {
        response.textContent = "Submitted. Thank you for your truth.";
        form.reset();
      }
    });
  }

  // Load stories on homepage
  const feed = document.getElementById("story-feed");
  if (feed) {
    loadStories(feed);
  }

  async function loadStories(feed) {
    const { data, error } = await client
      .from("submissions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading stories:", error);
      return;
    }

    if (data.length === 0) {
      feed.innerHTML += `<p class="tagline">No stories yet. Be the first to share.</p>`;
    } else {
      data.forEach((entry) => {
        const div = document.createElement("div");
        div.className = "content-box";
        div.textContent = entry.text;

        // If there's an image URL, display the image
        if (entry.image_url) {
          const img = document.createElement("img");
          img.src = entry.image_url;
          img.alt = "Uploaded image";
          img.className = "uploaded-image";
          div.appendChild(img);
        }

        feed.appendChild(div);
      });
    }
  }
});
