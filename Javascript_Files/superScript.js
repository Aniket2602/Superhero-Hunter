// Public and private keys for the Marvel API
const publicKey = "a760387a96f91ca56c28399795937695";
const privateKey = "64e80258b0b149a61633a5fbaa9f61b5628d4bb8";

// Timestamp to create a unique request
const ts = new Date().getTime();

// Generate MD5 hash using timestamp, private key, and public key for authentication
const hash = CryptoJS.MD5(ts + privateKey + publicKey).toString();

// Extract heroId from the URL parameters
const urlParams = new URLSearchParams(window.location.search);
const heroId = urlParams.get("id");

// Function to fetch and display superhero details
async function showSuperheroDetails(heroId) {
  try {
    // Fetch superhero details from Marvel API
    const response = await fetch(
      `https://gateway.marvel.com:443/v1/public/characters/${heroId}?ts=${ts}&apikey=${publicKey}&hash=${hash}`
    );

    const data = await response.json();
    const hero = data.data.results[0];
    const detailsDiv = document.getElementById("superheroDetails");
    detailsDiv.innerHTML = `
      <img src="${hero.thumbnail.path}.${hero.thumbnail.extension}" alt="${hero.name}">
      <h1>${hero.name}</h1>
      <p>${hero.description || "No description available."}</p>
      <h2>Comics</h2>
      <ul>${hero.comics.items.map((comic) => `<li>${comic.name}</li>`).join("")}</ul>
      <h2>Series</h2>
      <ul>${hero.series.items.map((serie) => `<li>${serie.name}</li>`).join("")}</ul>
      <h2>Stories</h2>
      <ul>${hero.stories.items.map((story) => `<li>${story.name}</li>`).join("")}</ul>
      <h2>Events</h2>
      <ul>${hero.events.items.map((event) => `<li>${event.name}</li>`).join("")}</ul>
    `;
  } catch (error) {
    console.error(error);
  }
}

// Call the function to display superhero details
showSuperheroDetails(heroId);
