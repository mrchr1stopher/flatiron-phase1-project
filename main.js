document.querySelector("#search").addEventListener("click", getPokemon);

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function lowerCaseName(string) {
  return string.toLowerCase();
}

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
          return `${statName}: ${baseStat}`;
        })
        .join("<br>");

      document.querySelector(".pokemonBox").innerHTML = `
          <div>
            <img src="${
              data.sprites.other["official-artwork"].front_default
            }" alt="${capitalizeFirstLetter(data.name)}}" />
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

//e.preventDefault();
