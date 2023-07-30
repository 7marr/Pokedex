// Constants
const max_pokemon = 1010;
const not_loading=document.getElementById("aaa")
const loading=document.getElementsByClassName("loading")[0]
const container = document.getElementsByClassName("container")[0];


// Variables
let startpoint = 1;
let endpoint = 120;
let start_steps=120
let end_steps=120









// Main functions
async function fetching_pokemon() {
    is_end();

    const url = "https://pokeapi.co/api/v2/pokemon/";

    loading.style.display="flex"
    not_loading.style.display="none"

    for (let i = startpoint; i <= endpoint; i++) {
        await fetch(url + i)
        .then(res=>res.json())
        .then(data=>display_pokemon(data))
    }


    loading.style.display="none"
    not_loading.style.display="flex"
}

function display_pokemon(data) {
    const pokemon_name = data.name;
    const pokemon_image = data.sprites.other["official-artwork"].front_default;
    const pokemon_id = data.id;

    const pokemon_box = document.createElement("div");
    pokemon_box.classList.add("pokemon-box");

    const name_element = document.createElement("h4");
    const image_element = document.createElement("img");
    const id_element = document.createElement("h3");

    name_element.textContent = remove_unnecessary(capitalize(pokemon_name));
    image_element.src = pokemon_image;
    id_element.textContent = "#" + pokemon_id;

    pokemon_box.appendChild(name_element);
    pokemon_box.appendChild(image_element);
    pokemon_box.appendChild(id_element);
    pokemon_box.addEventListener("click", function() {
        window.location.href = "info.html?id=" + pokemon_id;
    });

    container.appendChild(pokemon_box);
    
}

function load_more_pokemon() {

    startpoint += start_steps;
    endpoint += end_steps;
    start_steps=end_steps
    end_steps+=60
    fetching_pokemon();

}

// Secondary functions
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function remove_unnecessary(str) {
    let unnecessary = [" baile", " male", " normal", " plant", " altered", " land",
     " red striped", " standard", " incarnate", " ordinary", " aria", " shield",
      " average", " 50", " midday", " solo", " disguised", " amped", " ice"," red meteor",
       " full belly", " single strike"];
    str = str.replaceAll("-", " ");
    for (let i = 0; i < unnecessary.length; i++) {
      str = str.replace(unnecessary[i], "");
    }
    return str.replace("Nidoran m", "Nidoran ♂").replace("Nidoran f", "Nidoran ♀").replace("fetchd","fetch'd");
  }

function is_end() {
    if (endpoint > max_pokemon) {
        endpoint = max_pokemon;
        loading_button.remove();
        loading_image.remove();
        document.getElementById("load-container").remove();
    }
}

// Event listener for loading button
const loading_button = document.getElementsByClassName("loading-button")[0];
const loading_image = document.getElementById("loading-image");
loading_button.onclick = load_more_pokemon;
loading_image.onclick = load_more_pokemon;

// Initial fetching of Pokemon data
fetching_pokemon();
