function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function lowerCaseName(string) {
  return string.toLowerCase();
}

//Main Pokemon
function getPokemon(e) {
  const name = document.querySelector("#pokemonName").value;
  const pokemonName = lowerCaseName(name);
  fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
    .then((response) => response.json())
    .then((data) => {
      // typing
      const type = data.types
        .map((type) => capitalizeFirstLetter(type.type.name))
        .join(" / ");
      //moves
      const moves = data.moves
        .map((move) => capitalizeFirstLetter(move.move.name))
        .join(", ");
      //stats
      const stats = data.stats
        .map((stat) => {
          const statName = capitalizeFirstLetter(stat.stat.name);
          const baseStat = stat.base_stat;
          return `<p>${statName}: ${baseStat}<p>`;
        })
        .join("<br>");

      document.querySelector(".pokemonBox").innerHTML = `
        <div>
          <img src="${
            data.sprites.other["official-artwork"].front_default
          }" alt="${capitalizeFirstLetter(data.name)}" />
        </div>
        <div class="pokemonInfo">
          <h1>${capitalizeFirstLetter(data.name)}</h1>
          <p>National Pokédex Number: #${data.id}</p>
          <p>Type: ${type}</p>
          <p>Weight: ${data.weight * 0.1} kg / ${data.weight * 0.22} lbs </p>
          <p>${stats}</p>
          <p>Moves: ${moves}</p>
        </div>
      `;
    })
    .catch((err) => {
      console.log("Pokemon not found", err);
    });
}

//pokemon list
fetch("https://pokeapi.co/api/v2/pokemon?limit=10000")
  .then((response) => response.json())
  .then((data) => {
    const pokemonList = document.querySelector("#pokemonList");
    data.results.forEach((pokemon) => {
      const option = document.createElement("option");
      option.value = pokemon.name;
      pokemonList.appendChild(option);
    });
  })
  .catch((err) => {
    console.log("Failed to fetch Pokémon list", err);
  });

const searchButton = document.getElementById("search");
searchButton.addEventListener("click", getPokemon);

//Featured Pokemon
function displayRandomPokemonCards() {
  getRandomPokemons().then((pokemonData) => {
    const randomPokemonBox = document.querySelector(".randomPokemonBox");
    randomPokemonBox.innerHTML = "";
    pokemonData.forEach((pokemon) => {
      const card = document.createElement("div");
      card.classList.add("card");

      const image = document.createElement("img");
      image.src = pokemon.sprites.other["official-artwork"].front_default;
      image.alt = capitalizeFirstLetter(pokemon.name);
      image.style.width = "100%";
      image.style.height = "100%";
      card.appendChild(image);

      const name = document.createElement("p");
      name.textContent = capitalizeFirstLetter(pokemon.name);
      card.appendChild(name);

      randomPokemonBox.appendChild(card);
    });
  });
}

function generateRandomIds(count) {
  const randomIds = [];
  while (randomIds.length < count) {
    const randomId = Math.floor(Math.random() * 1010) + 1;
    if (!randomIds.includes(randomId)) {
      randomIds.push(randomId);
    }
  }
  return randomIds;
}

//Dispolay Pokemon Cards
function displayPokemonCards(pokemonData) {
  const pokemonBox = document.querySelector(".pokemonBox");
  pokemonBox.innerHTML = "";
  pokemonData.forEach((pokemon) => {
    const card = document.createElement("div");
    card.classList.add("card");

    const image = document.createElement("img");
    image.src = pokemon.sprites.other["official-artwork"].front_default;
    image.alt = capitalizeFirstLetter(pokemon.name);
    card.appendChild(image);

    const name = document.createElement("p");
    name.textContent = capitalizeFirstLetter(pokemon.name);
    card.appendChild(name);

    pokemonBox.appendChild(card);
  });
}

async function getRandomPokemons() {
  try {
    const randomPokemonIds = generateRandomIds(5);
    const pokemonDataPromises = randomPokemonIds.map((id) =>
      fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`).then((response) =>
        response.json()
      )
    );
    const pokemonData = await Promise.all(pokemonDataPromises);
    return pokemonData;
  } catch (error) {
    console.error("Error fetching Pokémon data:", error);
  }
}

const randomPokemonButton = document.getElementById("randomPokemonButton");
randomPokemonButton.addEventListener("click", displayRandomPokemonCards);

displayRandomPokemonCards();
