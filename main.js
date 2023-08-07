function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function lowerCaseName(string) {
  return string.toLowerCase();
}

//Pokemon Search Box
fetch("https://pokeapi.co/api/v2/pokemon?limit=10000")
  .then((response) => response.json())
  .then((data) => {
    const pokemonList = document.querySelector("#pokemonList");
    data.results.forEach((pokemon) => {
      const option = document.createElement("option");
      option.value = capitalizeFirstLetter(pokemon.name);
      pokemonList.appendChild(option);
    });
  })
  .catch((err) => {
    console.log("Failed to fetch Pokémon list", err);
  });

const searchButton = document.getElementById("search");
searchButton.addEventListener("click", getPokemon);

const searchInput = document.getElementById("pokemonName");
searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    getPokemon();
  }
});

//Main Pokemon
function getPokemon(e) {
  const name = document.querySelector("#pokemonName").value;
  const pokemonName = lowerCaseName(name);
  fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
    .then((response) => response.json())
    .then((data) => {
      //Dex Number
      const nationalDexNumber = data.id;
      const nationalDexText =
        nationalDexNumber <= 1010 ? `#${nationalDexNumber}` : "???";

      //Typing
      const type = data.types
        .map((type) => capitalizeFirstLetter(type.type.name))
        .join(" / ");

      //Stats
      const stats = data.stats
        .map((stat) => {
          const statName = capitalizeFirstLetter(stat.stat.name);
          const baseStat = stat.base_stat;
          return `${statName}: ${baseStat}`;
        })
        .join("<br>");

      //Moves
      const movesBox = document.createElement("div");
      movesBox.classList.add("pokemonInfo");
      data.moves.forEach((move) => {
        const moveName = capitalizeFirstLetter(move.move.name);
        const moveBox = document.createElement("div");
        moveBox.classList.add("movesBox");
        moveBox.textContent = moveName;
        movesBox.appendChild(moveBox);
      });

      // Height
      const heightMeters = (data.height * 0.1).toFixed(2);
      const heightFeet = (data.height * 0.328084).toFixed(2);

      //Weight
      const weightKg = (data.weight * 0.1).toFixed(2);
      const weightLbs = (data.weight * 0.22).toFixed(2);

      //Species Info
      fetch(data.species.url)
        .then((response) => response.json())
        .then((speciesData) => {
          const speciesName = capitalizeFirstLetter(
            speciesData.genera.find((genus) => genus.language.name === "en")
              .genus
          );

          // Pokédex Entry
          const scarletVersion = speciesData.flavor_text_entries.find(
            (entry) =>
              entry.language.name === "en" && entry.version.name === "scarlet"
          );
          const legendsVersion = speciesData.flavor_text_entries.find(
            (entry) =>
              entry.language.name === "en" && entry.version.name === "legends"
          );
          const swordVersion = speciesData.flavor_text_entries.find(
            (entry) =>
              entry.language.name === "en" && entry.version.name === "sword"
          );
          const ultraSunVersion = speciesData.flavor_text_entries.find(
            (entry) =>
              entry.language.name === "en" && entry.version.name === "ultra-sun"
          );
          const omegaRubyVersion = speciesData.flavor_text_entries.find(
            (entry) =>
              entry.language.name === "en" &&
              entry.version.name === "omega-ruby"
          );

          const pokedexEntry = scarletVersion
            ? scarletVersion.flavor_text
            : legendsVersion
            ? legendsVersion.flavor_text
            : swordVersion
            ? swordVersion.flavor_text
            : ultraSunVersion
            ? ultraSunVersion.flavor_text
            : omegaRubyVersion
            ? omegaRubyVersion.flavor_text
            : "Pokédex entry not available.";

          // Dispayed Info
          document.querySelector(".pokemonBox").innerHTML = `
            <div>
            <div class = "pokedexNumBox">
              <p>National Pokédex Number: ${nationalDexText}</p>
              </div>
              <h1>${capitalizeFirstLetter(data.name)}</h1>
              <div class="speciesBox">
                <p>${speciesName}</p>
              </div>
              <div class = "pokedexEntryBox">
              <p>${pokedexEntry}</p>
              <div class="pokemonType">
              <p>${type}</p>
            </div>
              <div class="pokemonImageBox">
                <img src="${
                  data.sprites.other["official-artwork"].front_default
                }" alt="${capitalizeFirstLetter(data.name)}" />
              </div>
              <p>Height: ${heightMeters} M / ${heightFeet} Ft </p>
              <div class = pokemonWeight></div>
              <p>Weight: ${weightKg} Kg / ${weightLbs} Lbs</p>
              </div>
              </div>
              <div class="pokemonStatInfoBox">
              <p>${stats}</p>

              </div>
            </div>
              <div class="pokemonMoves">
              <p> ${movesBox.innerHTML}</p>
            </div>
          `;
          document.querySelector("#pokemonName").value = "";
        })
        .catch((err) => {
          console.log("Error fetching species data", err);
        });
    })
    .catch((err) => {
      console.log("Pokemon not found", err);
    });
}

//Featured Pokemon
function displayRandomPokemonCards() {
  getRandomPokemons().then((pokemonData) => {
    const randomPokemonBox = document.querySelector(".randomPokemonBox");
    randomPokemonBox.innerHTML = "";
    pokemonData.forEach((pokemon) => {
      const card = document.createElement("div");
      card.classList.add("card");
      const name = document.createElement("p");
      name.textContent = `#${pokemon.id} ${capitalizeFirstLetter(
        pokemon.name
      )}`;
      card.appendChild(name);
      const image = document.createElement("img");
      image.src = pokemon.sprites.other["official-artwork"].front_default;
      image.alt = capitalizeFirstLetter(pokemon.name);
      image.style.width = "100%";
      image.style.height = "100%";
      card.appendChild(image);
      const type = document.createElement("p");
      type.textContent = `Type: ${pokemon.types
        .map((t) => capitalizeFirstLetter(t.type.name))
        .join(" / ")}`;
      card.appendChild(type);
      randomPokemonBox.appendChild(card);
    });
  });
}

// Random Counter
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

//Display Random Pokemon Cards
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

//Random Card Loader
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

//Random Button
const randomPokemonButton = document.getElementById("randomPokemonButton");
randomPokemonButton.addEventListener("click", displayRandomPokemonCards);

displayRandomPokemonCards();
