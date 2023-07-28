// Get the 'id' parameter from the URL query string
const URL = new URLSearchParams(window.location.search);
const id = URL.get("id");
let evolution_chain_id
let type_num = [];

// Base URLs for API endpoints
const API_url_pokemon = "https://pokeapi.co/api/v2/pokemon/";
const API_url_pokemon_species = "https://pokeapi.co/api/v2/pokemon-species/";
const API_url_evolution_chain="https://pokeapi.co/api/v2/evolution-chain/"
const github_types_url="https://raw.githubusercontent.com/7marr/Pokedex/main/script/json/types/"
/* --------- Fetching and Displaying Pokemon Data Group --------- */

// Fetch Pokemon data from API and call display_pokemon_1 to show it
function fetching_pokemon_1() {
  fetch(API_url_pokemon + id)
    .then(res => res.json())
    .then(data => display_pokemon_1(data));
}

// Display Pokemon data retrieved from API
function display_pokemon_1(data) {
  // Extract Pokemon data
  const pokemon_id = id_format(data.id);
  const pokemon_name = remove_unnecessary(capitalize(data.name)).replaceAll("-"," ").replace("Nidoran m", "Nidoran ♂").replace("Nidoran f", "Nidoran ♀");
  const pokemon_image = data.sprites.other["official-artwork"].front_default;
  const pokemon_height = data.height;
  const pokemon_weight = data.weight;
  let pokemon_abilities = get_abilities(data.abilities);
  let pokemon_types = get_types(data.types);
  let pokemon_stats= data.stats
  // Get HTML elements and store them
  const id_element = document.getElementById("id");
  const name_element = document.getElementById("name");
  const image_element = document.getElementById("image");
  const height_element = document.getElementById("height");
  const weight_element = document.getElementById("weight");
  const type_1_element = document.getElementById("t1");
  const type_2_element = document.getElementById("t2");
  const ability_element = document.getElementById("ability");
  const hidden_class = document.getElementsByClassName("ability")[1];
  const hidden_element = document.getElementById("hidden");
  // Display Pokemon information
  id_element.textContent = pokemon_id;
  name_element.textContent = pokemon_name;
  image_element.src = pokemon_image;

  if (pokemon_height >= 10) {
    height_element.textContent = pokemon_height / 10 + " m";
  } else {
    height_element.textContent = pokemon_height * 10 + " cm";
  }
  weight_element.textContent = pokemon_weight / 10 + " kg";

  set_type(pokemon_types, type_1_element, type_2_element);
  name_size(pokemon_name, name_element);
  set_abilities(pokemon_abilities, ability_element, hidden_class, hidden_element);
  set_sprite(pokemon_image,data)
  set_stats(pokemon_stats)
  fetch_damage(pokemon_types)
}


// Fetch Pokemon data from API and call display_pokemon_2 to show it
function fetching_pokemon_2() {
  fetch(API_url_pokemon_species + id)
    .then(res => res.json())
    .then(data => display_pokemon_2(data));
   
}

// Display Pokemon species data retrieved from API
function display_pokemon_2(data) {
  // Extract Pokemon generation and description
  let pokemon_gen = data.generation["name"];
  const is_legendary = data.is_legendary;
  const is_mythical = data.is_mythical;
  let pokemon_description = data.flavor_text_entries;

  
  // Converting roman numerals to base-10 numerals
  pokemon_gen = roman_to_num(pokemon_gen);

  // Get HTML elements and store them
  const gen_element = document.getElementById("generation");
  const description_element = document.getElementsByClassName("entry")[0];
  const uniqueness_icon = document.getElementById("uniqueness");
  const uniqueness_label = document.getElementsByClassName("uniqueness")[0];


  // Display Pokemon generation
  gen_element.textContent = pokemon_gen;
  description_element.textContent = find_en_description(pokemon_description);
  set_uniqueness(is_legendary, is_mythical, uniqueness_icon, uniqueness_label);
}







// Function to get an array of Pokemon types
function get_types(arr) {
  type_num = arr.length;
  return arr.map(item => item["type"]["name"]);
}

// Function to set Pokemon types on the UI
function set_type(type, type_1_element, type_2_element) {
  const type_elements = [type_1_element, type_2_element];

  for (let i = 0; i < type.length; i++) {
    type_elements[i].classList = "default " + type[i];
    type_elements[i].textContent = type[i].toUpperCase();
  }


  
  if (type.length === 1) {
    type_2_element.remove();
    type_1_element.style.width="200px"
  }

}

// Function to get abilities from the data and categorize them into normal and hidden abilities
function get_abilities(arr) {
  let hidden = "";
  let normal = [];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i]["is_hidden"]) {
      hidden = arr[i]["ability"]["name"];
    } else {
      normal.push(arr[i]["ability"]["name"]);
    }
  }
  return [normal, hidden];
}

// Function to set abilities on the UI
function set_abilities(pokemon_abilities, ability_element, hidden_class, hidden_element) {
  if (pokemon_abilities[1] != "") {
    hidden_element.textContent = capitalize(pokemon_abilities[1]).replace("-", " ");
  } else {
    hidden_class.style.display="none";
  }
  let text = "";
  for (let i = 0; i < pokemon_abilities[0].length; i++) {
    text += capitalize(pokemon_abilities[0][i]) + " ";
  }
  ability_element.textContent = ability_format(text, pokemon_abilities);
  if (hidden_element.textContent.trim()==ability_element.textContent.trim()){
    hidden_class.remove();
    hidden_element.remove();
  }

}

// Function to set Pokemon uniqueness (common, legendary, mythical) on the UI
function set_uniqueness(is_legendary, is_mythical, uniqueness_icon, uniqueness_label) {
  if (is_legendary) {
    uniqueness_icon.classList = "legendary";
    uniqueness_label.textContent = "Legendary";
    uniqueness_label.style.color = "#c0e00a";
  } else if (is_mythical) {
    uniqueness_icon.classList = "mythical";
    uniqueness_label.textContent = "Mythical";
    uniqueness_label.style.color = "#ff00bf";
  } else if (id == 258 || id == 259 || id == 260||id==570||id==571) {
    uniqueness_icon.classList = "heart";
    uniqueness_label.textContent = "Awesome";
    uniqueness_label.style.color = "#ffffff";
  } else {
    uniqueness_icon.classList = "common";
    uniqueness_label.textContent = "Common";
  }
}

function set_sprite(img_url5,data){
  const img1=document.getElementById("fd")
  const img2=document.getElementById("bd")
  const img3=document.getElementById("fs")
  const img4=document.getElementById("bs")
  const img5=document.getElementById("n-aw")
  const img6=document.getElementById("s-aw")
  const img7=document.getElementById("n-3d")
  const img8=document.getElementById("s-3d")

  const img_url1=data.sprites.front_default
  const img_url2=data.sprites.back_default
  const img_url3=data.sprites.front_shiny
  const img_url4=data.sprites.back_shiny
  const img_url6=data.sprites.other["official-artwork"].front_shiny;
  const img_url7=data.sprites.other["home"].front_default
  const img_url8=data.sprites.other["home"].front_shiny


  
  const arr1=[img1,img2,img3,img4,img5,img6,img7,img8]
  const arr2=[img_url1,img_url2,img_url3,img_url4,img_url5,img_url6,img_url7,img_url8]


  for(let i=0;i<arr1.length;i++){
    if(arr2[i]==null){
      arr1[i].remove()
    }
    else{
      arr1[i].src=arr2[i]
    }
  }
  


}
function set_stats(stats){
  stat_arr=[]
  for(let i=0;i<stats.length;i++){
    document.getElementsByClassName("bar")[i].textContent=stats[i].base_stat
    stat_arr.push(parseInt(document.getElementsByClassName("bar")[i].textContent))
  }
  const total= stat_arr.reduce((acc, curr) => acc + curr, 0);
  document.getElementById("total").textContent=total
  const max_num=Math.max(...stat_arr)
  const bars=["h","a","d","s-a","s-d","s"]
  for(let i=0;i<6;i++){
    const bar_width=Math.round((100*stat_arr[i]/max_num)*75/100)
    document.getElementsByClassName(bars[i])[0].style.width=String(bar_width)+"%"
  }

}
async function fetch_damage(types){
  if(types.length==1){
    fetch(`${github_types_url}${types[0]}.json`)
    .then(res=>res.json())
    .then(data=>set_damage(data))
    
  }
  else if(types.length==2){
    let data=[]
    for(let i=0;i<2;i++){
      await fetch(`${github_types_url}${types[i]}.json`)
      .then(res=>res.json())
      .then(res=>{
        data.push(res)
      })
    }
    calc_damage(data)
  }
}
function calc_damage(data){
  let calculated_data=data[0]

  for(let i=0;i<data[0].length;i++){
    calculated_data[i].damage=data[0][i].damage*data[1][i].damage
  }
  set_damage(calculated_data)
}
function set_damage(data){
  let weaknesses=[]
  let resistences=[]
  for(let i=0;i<data.length;i++){
    if(data[i].damage>1){
      weaknesses.push(data[i])
    }
    else if(data[i].damage<1){
      resistences.push(data[i])
    }
  }
  weaknesses_container=document.getElementById("weakness")
  resistences_container=document.getElementById("resistant")

  for(let i=0;i<weaknesses.length;i++){
    weaknesses_container.appendChild(display_damage(weaknesses[i],weaknesses.length))
  }
  for(let i=0;i<resistences.length;i++){
    resistences_container.appendChild(display_damage(resistences[i],resistences.length))
  }
}

function display_damage(thing,len){
  const a_type=document.createElement("div")
  const type=document.createElement("div")
  const damage=document.createElement("div")

  a_type.classList="a-type"

  type.classList=`secondary ${thing.name}`
  type.textContent=thing.name.toUpperCase()

  damage.classList=`damage d-${thing.name}`
  damage.textContent=String(thing.damage).replace("0.5","½").replace("0.25","¼")+"x"

  if(len==1){
    type.style.height="45px"
    damage.style.height="45px"
    type.style.fontSize="19px"
    damage.style.fontSize="19px"
  }
  else{
    type.style.height="35px"
    damage.style.height="35px"
  }


  a_type.appendChild(type)
  a_type.appendChild(damage)
  return a_type
}




// Function to find and return English description from the available descriptions
function find_en_description(description) {
  for (let i = 0; i < description.length; i++) {
    if (description[i]["language"]["name"] === "en") {
      description = description[i]["flavor_text"];
      break;
    }
  }
  description = description.replaceAll("", " ");
  return description;
}










// Function to format Pokemon ID with leading zeros
function id_format(id) {
  id = String(id).padStart(4, "0");
  return "#" + id;
}

// Function to remove unnecessary words from the Pokemon name
function remove_unnecessary(str) {
  let unnecessary = [" baile", " male", " normal"," red meteor", " plant", " altered", " land", " red striped", " standard", " incarnate", " ordinary", " aria", " shield", " average", " 50", " midday", " solo", " disguised", " amped", " ice", " full belly", " single strike"];
  str = str.replaceAll("-", " ");
  for (let i = 0; i < unnecessary.length; i++) {
    str = str.replace(unnecessary[i], "");
  }
  return str;
}

// Function to adjust font size based on the length of the Pokemon name
function name_size(pokemon_name, name_element) {
  if (pokemon_name.length > 10) {
    name_element.style.fontSize = "50px";
  }
}

// Function to capitalize the first letter of a string
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Function to format abilities text with slashes and replace hyphens with spaces
function ability_format(txt, pokemon_abilities) {
  if (pokemon_abilities[0].length == 2) {
    txt = txt.replace(" ", " / ");
  }
  txt = txt.replace(/-/g, " ");
  return txt;
}

// Function to convert roman numerals to base-10 numerals
function roman_to_num(str) {
  str = str.replace("generation-", "");
  const numerals = {
    "i": 1,
    "ii": 2,
    "iii": 3,
    "iv": 4,
    "v": 5,
    "vi": 6,
    "vii": 7,
    "viii": 8,
    "ix": 9,
  };
  return numerals[str];
}

// Fetch and display Pokemon data from API



fetching_pokemon_1()
fetching_pokemon_2()
