// Public and private keys for the Marvel API
const publicKey = "a760387a96f91ca56c28399795937695";
const privateKey = "64e80258b0b149a61633a5fbaa9f61b5628d4bb8";

// Timestamp to create a unique request
const ts = new Date().getTime();

// Generate MD5 hash using timestamp, private key, and public key for authentication
const hash = CryptoJS.MD5(ts + privateKey + publicKey).toString();

// Base URL for the Marvel API with necessary query parameters
const apiUrl = `https://gateway.marvel.com:443/v1/public/characters?ts=${ts}&apikey=${publicKey}&hash=${hash}`;

// Async function to fetch superhero data from Marvel API
async function fetchSuperheroData(query = "") {
  try {
    // Make a GET request to the API with the search query
    const response = await fetch(`${apiUrl}&nameStartsWith=${query}`);
    // Check if the response is not OK, throw an error
    if (!response.ok) {
      throw new Error(`An error has occured: ${response.status}`);
    }
    const data = await response.json();
    return data.data.results;
  } catch (error) {
    console.error(error);
    return [];
  }
}

// Function to display superheroes on the page
function displaySuperheroes(superheroes) {
  const resultDiv = document.getElementById("results");
  resultDiv.innerHTML = "";

  superheroes.forEach((hero) => {
    const heroDiv = document.createElement("div");
    heroDiv.className = "card";
    heroDiv.innerHTML = `
      <img src="${hero.thumbnail.path}.${hero.thumbnail.extension}" alt="${hero.name}">
      <h3>${hero.name}</h3>
      <button onclick="addToFavourites('${hero.id}')">Add to Favourites</button>
      <button onclick="window.location.href='superhero.html?id=${hero.id}'">More Info</button>
    `;
    resultDiv.appendChild(heroDiv);
  });
}

// Add event listener to the search input field
document
  .getElementById("input-type-search")
  .addEventListener("input", async function () {
    const query = this.value; // Get the value of the input field
    const superheroes = await fetchSuperheroData(query); // Fetch superhero data
    displaySuperheroes(superheroes); // Display the fetched superheroes
  });

// Retrieve favourites from local storage or initialize as an empty array
const favourites = JSON.parse(localStorage.getItem("myfavourite")) || [];

// Function to add a superhero to favourites
function addToFavourites(heroId) {
  if (!favourites.includes(heroId)) {
    favourites.push(heroId); // Add the hero ID to favourites if not already present
    localStorage.setItem("myfavourite", JSON.stringify(favourites)); // Save favourites to local storage
  }
}
