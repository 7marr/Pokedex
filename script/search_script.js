// Get DOM elements
const container = document.getElementsByClassName("container")[0];
const affirmative = document.getElementById("aff");
const negative=document.getElementById("neg");
const loading = document.getElementsByClassName("loading")[0];
const search_box = document.getElementsByClassName("search-box")[0];
const return_button=document.getElementsByClassName("go-back")[0]
// Constants and URLs
const max_pokemons = 1010;
const json_url = "https://raw.githubusercontent.com/7marr/Pokedex/main/script/json/search/";
const pokeapi_url="https://pokeapi.co/api/v2/pokemon/"

// Variables 
let pokemons=[];
let json_file = 1;
let json_data;
let checked_pokemons = 0;
let search_value = "";
let matches = 0;
let new_search=false
let finnished=true

function checkEnd(){
    if(new_search==true&&finnished==false){
        setTimeout(checkEnd,200)
        console.log("jjjjj")
    }
    else{
        new_search=false
        finnished=true

        if (search_value == "") {
            container.innerHTML=""
            finnished=false
            console.log("njjnjnjj")
            // Show the affirmative message if search box is empty
            affirmative.style.display = "flex";
            loading.style.display = "none";
            negative.style.display="none"
            //reset
            new_search=false
            finnished=true
    
        } 
        else {
            finnished=false
            container.innerHTML=""

            // Hide the affirmative message and show loading
            affirmative.style.display = "none";
            loading.style.display = "flex";
            negative.style.display="none"
    
            setTimeout(fetch_json,1000)
        }
    }
}

search_box.addEventListener("input", event => {
    search_value = event.target.value.trim().toLowerCase();
    // Reset variables for a new search
    json_file = 1;
    checked_pokemons = 0;
    matches=0
    pokemons=[]
    new_search=true
    checkEnd()

    }
);

return_button.addEventListener("click",event=>{
    window.location.href = "index.html"
})

// Function to fetch JSON data
async function fetch_json() {

    const response = await fetch(json_url + `${json_file}.json`);
    json_data = await response.json();
    
    filter()
}
// Function to determine search type (by ID or by name) and call search function

function filter() {
    if (is_int()) {
        // If the search value is a number, search by ID
        search("id");
    }
    else if(!is_int()){
        // If the search value is not a number, search by name
        search("name");
    }
}
// Function to check if the search value is an integer
function is_int() {
    return !isNaN(parseInt(search_value));
}

// Function to perform the search
function search(type) {
    for (let i = 0;checked_pokemons < max_pokemons && matches < 60 &&search_value!=""; i++) {
        if(new_search){
            new_search=false
            finnished=true
            container.innerHTML=""
            break
        }

        const pokemon = json_data[i];
        if (!pokemon) {
            // If we reached the end of the current JSON file, fetch the next one
            json_file += 1;
            fetch_json();
            break;
        }
        const value = type === "id" ? String(pokemon.id) : pokemon.name;
        if (value.includes(search_value)&&search_value!="") {
            // If there's a match, push the ID of the pokemon to "pokemons"
            pokemons.push(pokemon.id)
            matches++;
        }
        checked_pokemons++;
    }

    if(matches===0 && checked_pokemons>=max_pokemons&&search_value!=""){
        loading.style.display="none"
        negative.style.display="flex"
        finnished=true
    }
    if (matches >= 60 || checked_pokemons >= max_pokemons&&search_value!="") {
        fetching_pokemon();
    }


}

async function fetching_pokemon() {
    for (let i = 0; i <pokemons.length; i++) {
        if(new_search){
            new_search=false
            finnished=true
            container.innerHTML=""
            break
        }
      await fetch(pokeapi_url + pokemons[i])
        .then((res) => res.json())
        .then((data) => display_pokemon(data));
    }
    pokemons=[]
    loading.style.display="none"
    finnished=true
}


// Function to remove unnecessary words from the Pokemon name
function remove_unnecessary(str) {
    let unnecessary = [
      " baile", " male", " normal", " plant", " altered", " land", " red striped", " standard",
      " incarnate", " ordinary", " aria", " shield", " average", " 50", " midday", " solo",
      " disguised", " amped", " ice", " full belly", " single strike"," red meteor"
    ];
    str = str.replaceAll("-", " ");
    for (let i = 0; i < unnecessary.length; i++) {
      str = str.replace(unnecessary[i], "");
    }
    str = str.replace("fetchd","fetch'd").replace("Nidoran m", "Nidoran ♂").replace("Nidoran f", "Nidoran ♀").replace("Type null","Type:Null");
    return str;
  }
  
  // Function to capitalize the first letter of a string
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  
  // Function to display a Pokemon in the UI
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
        search_box.value=""
        search_value=""
      window.location.href = "info.html?id=" + pokemon_id;
    });
  
    container.appendChild(pokemon_box);
}
  




