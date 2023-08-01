// Get the 'id' parameter from the URL query string
const URL = new URLSearchParams(window.location.search);
const id = URL.get("id");
let type_num = [];
let evolutions=[]

// Base URLs for API endpoints
const API_url_pokemon = "https://pokeapi.co/api/v2/pokemon/";
const API_url_pokemon_species = "https://pokeapi.co/api/v2/pokemon-species/";
const API_url_evolution_chain="https://pokeapi.co/api/v2/evolution-chain/"
const github_types_url="https://raw.githubusercontent.com/7marr/Pokedex/main/script/json/types/"
const github_sprited_url="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/"//ex : back/shiny/637.gif 
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
  const pokemon_name = remove_unnecessary(capitalize(data.name));
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
async function display_pokemon_2(data) {
  // Extract Pokemon generation and description
  let pokemon_gen = data.generation["name"];
  const is_legendary = data.is_legendary;
  const is_mythical = data.is_mythical;
  const is_baby=data.is_baby;
  let pokemon_description = data.flavor_text_entries;
  const evolution_chain_id=data.evolution_chain.url.replace("https://pokeapi.co/api/v2/evolution-chain/","").replace("/","")


  // Converting roman numerals to base-10 numerals
  pokemon_gen = roman_to_num(pokemon_gen);

  // Get HTML elements and store them
  const gen_element = document.getElementById("generation");
  const description_element = document.getElementsByClassName("entry")[0];
  const uniqueness_icon = document.getElementById("uniqueness");
  const uniqueness_label = document.getElementsByClassName("uniqueness")[0];
  
  const evolution_container=document.getElementsByClassName("n6")[0]
  const first_stage=document.getElementById("first")
  const second_stage=document.getElementById("second")
  const last_stage=document.getElementById("last")
  const first_arrow=document.getElementsByClassName("arrow")[0]
  const second_arrow=document.getElementsByClassName("arrow")[1]


  // Display Pokemon generation
  description_element.textContent = find_en_description(pokemon_description);
  gen_element.textContent = pokemon_gen;
  set_uniqueness(is_legendary, is_mythical,is_baby, uniqueness_icon, uniqueness_label);
  await fetching_evolution_chain(evolution_chain_id)

  if(evolutions.length==1){
    handle_1_evo(evolution_container,first_stage,second_stage,last_stage,first_arrow,second_arrow)
  }
  else if(evolutions.length==2){
    handle_2_evo(evolution_container,first_stage,second_stage,last_stage,first_arrow,second_arrow)

  }
  else if(evolutions.length==3){
  handle_3_evo(evolution_container,first_stage,second_stage,last_stage,first_arrow,second_arrow)

  } 


}
async function handle_1_evo(evolution_container,first_stage,second_stage,last_stage,first_arrow,second_arrow){
  await fetch_evolution_pokemon(first_stage,evolutions[0])
  second_stage.remove()
  last_stage.remove()
  first_arrow.remove()
  second_arrow.remove()
  first_stage.innerHTML+="This Pokemon doesn't evolve"
}
async function handle_2_evo(evolution_container,first_stage,second_stage,last_stage,first_arrow,second_arrow){

  await fetch_evolution_pokemon(first_stage,evolutions[0])
  
  // if there is a single second evolution
  if(!Array.isArray(evolutions[1])){
    fetch_evolution_pokemon(second_stage,evolutions[1])
    last_stage.remove()
    second_arrow.remove()
  }
  // if there is 2 possible second evolutions
  else if(Array.isArray(evolutions[1])&&evolutions[1].length==2){
    first_stage.innerHTML=""
    fetch_evolution_pokemon(second_stage,evolutions[0])
    fetch_evolution_pokemon(first_stage,evolutions[1][0])
    fetch_evolution_pokemon(last_stage,evolutions[1][1])
    first_arrow.innerHTML="&larr;"
  }
  //if there is 3 possible second evolutions
  else if(Array.isArray(evolutions[1])&&evolutions[1].length==3){
    const pokemon_box=document.getElementsByClassName("pokemon-box")
    first_arrow.innerHTML="&rarr;"
    second_stage.style.flexDirection="row"
    last_stage.remove()
    second_arrow.remove()
    for(let i=0;i<evolutions[1].length;i++){
      await fetch_evolution_pokemon(second_stage,evolutions[1][i])

    }
  }
}
async function handle_3_evo(evolution_container,first_stage,second_stage,last_stage,first_arrow,second_arrow){
  await fetch_evolution_pokemon(first_stage,evolutions[0])
  // if there is 2 possible last and second evolutions
  if(Array.isArray(evolutions[1])){
    for(let i=0;i<evolutions[1].length;i++){
    await fetch_evolution_pokemon(second_stage,evolutions[1][i])
    await fetch_evolution_pokemon(last_stage,evolutions[2][i])
  }
  }
  // if there is 2 possible last evolution
  else if (Array.isArray(evolutions[2])){
    await fetch_evolution_pokemon(second_stage,evolutions[1])
    for(let i=0;i<evolutions[1].length;i++){
      await fetch_evolution_pokemon(last_stage,evolutions[2][i])
    }
  }
  // if there is a single second and last evolutions
  else{
    await fetch_evolution_pokemon(second_stage,evolutions[1])
    await fetch_evolution_pokemon(last_stage,evolutions[2])
  }
}


async function fetch_evolution_pokemon(stage,id){
  await fetch(API_url_pokemon+id)
  .then(res=>res.json())
  .then(data=>create_pokemon_box(data,stage))
}

function create_pokemon_box(data,stage){
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

  stage.appendChild(pokemon_box);

}

async function fetching_evolution_chain(evolution_chain_id){
  await fetch(API_url_evolution_chain+evolution_chain_id)
  .then(res=>res.json())
  .then(data=>get_them_ids(data))
}


function get_them_ids(data){
  let temp=get_evolution(data.chain.evolves_to)
  let another_temp=[]
  let is_there_second=false

  
  evolutions.push(extract_id(data.chain.species.url))
  if(temp!=null){
    evolutions.push(temp)
    is_there_second=true
  }
  if(is_there_second){
    if(Array.isArray(evolutions[1])){
      for(let i=0;i<evolutions[1].length;i++){
        if(get_evolution(data.chain.evolves_to[i].evolves_to)!=null){
          another_temp.push(get_evolution(data.chain.evolves_to[i].evolves_to))
        }
      }
      if(another_temp.length!=0){
        evolutions.push(another_temp)
      }
    }
    else{
      if(get_evolution(data.chain.evolves_to[0].evolves_to)!=null)
      evolutions.push(get_evolution(data.chain.evolves_to[0].evolves_to))
    }
  }
  
}

function get_evolution(path){
  if(path.length==0){
    return null
  }
  else if(path.length==1){
    return extract_id(path[0].species.url)
  }
  else if(path.length>1){
    let temp=[]
    for(let i=0;i<path.length;i++){
      temp.push(extract_id(path[i].species.url))
    }
    return temp
  }
}
function extract_id(url){
  return url.replace(API_url_pokemon_species,"").replace("/","")
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
function set_uniqueness(is_legendary, is_mythical,is_baby, uniqueness_icon, uniqueness_label) {
  const pseudo_legendary=[149,248,373,376,445,635,706,784,887,998]
  const favorites=[258,259,260,359,570,571]

  if (is_legendary) {
    uniqueness_icon.classList = "legendary";
    uniqueness_label.textContent = "Legendary";
    uniqueness_label.style.color = "#c0e00a";
  } 
  else if (is_mythical) {
    uniqueness_icon.classList = "mythical";
    uniqueness_label.textContent = "Mythical";
    uniqueness_label.style.color = "#ff00bf";
  } 
  else if (is_baby) {
    uniqueness_icon.classList = "baby";
    uniqueness_label.textContent = "Baby";
    uniqueness_label.style.color = "#eb9cc4";
  } 
  else if(pseudo_legendary.includes(parseInt(id))){
    uniqueness_icon.classList = "pseudo-legendary";
    uniqueness_label.textContent = "Pseudo-legendary";
    uniqueness_label.style.color = "#eba040";
  }
  else if (favorites.includes(parseInt(id))) {
    uniqueness_icon.classList = "heart";
    uniqueness_label.textContent = "Awesome";
    uniqueness_label.style.color = "#ffffff";
  } 
  else {
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
  const img9=document.getElementById("afd")
  const img10=document.getElementById("abd")
  const img11=document.getElementById("afs")
  const img12=document.getElementById("abs")

  const img_url1=data.sprites.front_default
  const img_url2=data.sprites.back_default
  const img_url3=data.sprites.front_shiny
  const img_url4=data.sprites.back_shiny
  const img_url6=data.sprites.other["official-artwork"].front_shiny;
  const img_url7=data.sprites.other["home"].front_default
  const img_url8=data.sprites.other["home"].front_shiny

  const img_url9=`${github_sprited_url}${id}.gif`
  const img_url10=`${github_sprited_url}back/${id}.gif`
  const img_url11=`${github_sprited_url}shiny/${id}.gif`
  const img_url12=`${github_sprited_url}back/shiny/${id}.gif`

  
  const arr1=[img1,img2,img3,img4,img5,img6,img7,img8,img9,img10,img11,img12]
  const arr2=[img_url1,img_url2,img_url3,img_url4,img_url5,img_url6,img_url7,img_url8,img_url9,img_url10,img_url11,img_url12]


  for(let i=0;i<arr1.length;i++){
    if(i==8){
      arr1[i].addEventListener("error",handle_img_error)
    }
    if(arr2[i]==null){
      arr1[i].remove()
    }
    else{
      arr1[i].src=arr2[i]
    }
  }
  


}
function handle_img_error(){
  animation_container=document.getElementsByClassName("sprites")[1]
  animation_container.remove()
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
  try{
    for (let i = 0; i < description.length; i++) {
      if (description[i]["language"]["name"] === "en") {
        description = description[i]["flavor_text"];
        break;
      }
    }
    description = description.replaceAll("", " ");
    return description;
  }
  catch{
    console.log("stupid error")
  }

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
  return str.replace("Nidoran m", "Nidoran ♂").replace("Nidoran f", "Nidoran ♀").replace("fetchd","fetch'd");
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
