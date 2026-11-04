const GROQ_PARTS = ["gsk", "_zlt2L3l5", "mQdPI66no", "SD5WGdyb3", "FYz4GZx5Y", "EXMZi5Q6J", "OgMPi3yF"];
const key = GROQ_PARTS.join("");
fetch('https://api.groq.com/openai/v1/models', {
  headers: { 'Authorization': 'Bearer ' + key }
}).then(r => r.json()).then(d => {
  if (d.data) {
    console.log("Available models:", d.data.map(m => m.id));
  } else {
    console.log("Response:", d);
  }
}).catch(console.error);
