// Public and private keys for the Marvel API
const publicKey = "a760387a96f91ca56c28399795937695";
const privateKey = "64e80258b0b149a61633a5fbaa9f61b5628d4bb8";

// Timestamp to create a unique request
const ts = new Date().getTime();

// Generate MD5 hash using timestamp, private key, and public key for authentication
const hash = CryptoJS.MD5(ts + privateKey + publicKey).toString();

// Retrieve favourites from local storage or initialize as an empty array
const favourites = JSON.parse(localStorage.getItem("myfavourite")) || [];

// Async function to display favourite superheroes
async function displayfavourites() {
  const favouriteDiv = document.getElementById("results");
  favouriteDiv.innerHTML = ""; // Clear previous results

  // Display message if there are no favourites
  if (favourites.length === 0) {
    const noFavouritesMessage = document.createElement("p");
    noFavouritesMessage.textContent = "No favourite superheroes.";
    noFavouritesMessage.classList.add("no-favourites-message");
    favouriteDiv.appendChild(noFavouritesMessage);
    return;
  }

  // Iterate over each favourite superhero ID
  for (let id of favourites) {
    try {
      // Fetch superhero data by ID from Marvel API
      const response = await fetch(
        `https://gateway.marvel.com:443/v1/public/characters/${id}?ts=${ts}&apikey=${publicKey}&hash=${hash}`
      );
      // Check if the response is not OK, throw an error
      if (!response.ok) {
        throw new Error(`An error has occured: ${response.status}`);
      }
      const data = await response.json();
      const hero = data.data.results[0];
      
      // Create a card element for the superhero
      const heroDiv = document.createElement("div");
      heroDiv.className = "card";
      heroDiv.innerHTML = `
        <img src="${hero.thumbnail.path}.${hero.thumbnail.extension}" alt="${hero.name}">
        <h3>${hero.name}</h3>
        <button onclick="removeFromFavourites('${hero.id}')">Remove from Favourites</button>
        <button onclick="window.location.href='superhero.html?id=${hero.id}'">More Info</button>
      `;
      favouriteDiv.appendChild(heroDiv);
    } catch (error) {
      console.error(error);
    }
  }
}

// Function to remove a superhero from favourites
function removeFromFavourites(heroId) {
  const index = favourites.indexOf(heroId); // Find the index of the hero ID in the favourites array
  if (index > -1) {
    favourites.splice(index, 1); // Remove the hero ID from the array
    localStorage.setItem("myfavourite", JSON.stringify(favourites)); // Update local storage
    displayfavourites(); // Refresh the displayed favourites
  }
}

// Initial call to display favourites on page load
displayfavourites();
