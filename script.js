const SUPABASE_URL = "https://pzijwvijruzjgmoekjlx.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6aWp3dmlqcnV6amdtb2Vramx4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0MTY2ODUsImV4cCI6MjA2Mjk5MjY4NX0.cJzlLk44FQPaymfmtorU4sju_53W-TPIvHHSWUZK3PI";

const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("submissionForm");
  const response = document.getElementById("response");

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const storyText = document.getElementById("story").value.trim();
      const imageFile = document.getElementById("image").files[0]; // Get the uploaded image

      if (!storyText && !imageFile) {
        response.textContent = "Please write something or upload an image first.";
        return;
      }

      let imageUrl = null;

      // If an image is selected, upload it to Supabase Storage
      if (imageFile) {
        const { data, error: uploadError } = await client.storage
          .from("images") // Using the 'images' bucket in Supabase Storage
          .upload(`public/${imageFile.name}`, imageFile, {
            cacheControl: "3600", // Cache the image for 1 hour
            upsert: true, // Allows overwriting if the file already exists
          });

        if (uploadError) {
          console.error("Error uploading image:", uploadError);
          response.textContent = "Something went wrong with the image upload.";
          return;
        }

        // Get the URL of the uploaded image
        imageUrl = `${SUPABASE_URL}/storage/v1/object/public/images/${data.path}`;
      }

      // Insert both text and image URL into the database
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
          img.alt = "Uploaded Image";
          img.style.maxWidth = "100%"; // Adjust max width for the image
          div.appendChild(img);
        }
        
        feed.appendChild(div);
      });
    }
  }
});

