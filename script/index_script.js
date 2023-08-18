// Constants
const max_pokemon = 1010;
const not_loading=document.getElementById("aaa")
const loading=document.getElementsByClassName("loading")[0]
const container = document.getElementsByClassName("container")[0];
const blur=document.getElementsByClassName("blur")[0]
const filter=document.getElementsByClassName("filter-container")[0]
// API url
const url = "https://pokeapi.co/api/v2/pokemon/";
const mega_url= "https://raw.githubusercontent.com/7marr/Pokedex/main/script/json/mega%20evolution/mega.json";


// filter components
const filter_options=Array.from(document.getElementsByClassName("options"))
const subC_none=document.getElementsByClassName("none")[0]
const subC_type=document.getElementsByClassName("type")[0]
const subC_gen=document.getElementsByClassName("gen")[0]
const subC_class=document.getElementsByClassName("class")[0]
const selected_option=document.getElementsByClassName("active-option")[0]
const filter_inner_buttons=document.querySelectorAll(".buttons-container button")

// loading conponents
const loading_button = document.getElementsByClassName("loading-button")[0];
const loading_image = document.getElementById("loading-image");
const close_filter_button=document.getElementsByClassName("close")[0]
const filter_button=document.getElementsByClassName("filter")[0]


const classes=["Common","Alt-forms","Starter","Baby","Ancient","Ultra beast","Legendary","P-legendary","Mythical","Paradox"]
const paradox=[984,985,986,987,988,989,990,991,992,993,994,995,1005,1006,1009,1010]
const ancient=[138,139,140,141,142,345,346,347,348,408,409,410,411,564,565,566,567,696,697,698,699,880,881,882,883]
const ultra_beast=[793,794,795,796,797,798,799,803,804,805,806]
const starter=[1,4,7,152,155,158,252,255,258,387,390,393,495,498,501,650,653,656,722,725,728,810,813,816,906,909,912]
const pseudo_legendary=[149,248,373,376,445,635,706,784,887,998]

const legendary=[144,145,146,150,243,
    244,245,249,250,377,378,379,380,
    381,382,383,384,480, 481,482,483,
    484,485,486,487,488,638,639,640,641,
    642,643,644,645,646,716,717,718,772,773,
    785,786,787,788,789,790,791,792,800,888,
    889,890,891,892,894,895,896,897,898,905,
    1001,1002,1003,1004,1008,1007]
const mythical=[151,251,385,386,489,490,491,492,493,494,647,648,649,719,720,721,801,802,807,808,809,893]
const baby=[172,173,174,175,236,238,239,240,298,360,406,433,438,439,440,446,447,458,848]
const classes_vars=[starter,baby,ancient,ultra_beast,legendary,pseudo_legendary,mythical,paradox]

// Variables
//  manage how many pokemons are displayed
let startpoint = 1;
let endpoint = 120;
let steps=120
// store the mega data and wich index is in
let mega_data
let mega_index=0
// stores if there is a new filter
let new_filter=false
let finnished_displaying=true
let current_filter="none"



// fetch the mega data then storing it then start fetching for pokemons
async function fetching_megaData(){
    await fetch(mega_url)
    .then(res=>res.json())
    .then(data=>mega_data=data)
    if(sessionStorage.getItem("x")=="null"){
        fetching_pokemon(startpoint,endpoint)
        sessionStorage.setItem("x","done")
    }

}



// main pokemon fetching function 
async function fetching_pokemon(startpoint,endpoint) {
    // check if the value of endpoint is greater then the actual number of pokemon
    if(endpoint>max_pokemon){
        endpoint=max_pokemon
        document.getElementById("load-container").style.display="none";
    }


    display_loading_screen("flex","none")

    finnished_displaying=false
    for (let i = startpoint; i <= endpoint; i++) {
        console.log("still....")
        if(new_filter){
            new_filter=false
            finnished_displaying=true
            break
        }
        // fetch and display each pokemon
        await fetch(url + i)
        .then(res=>res.json())
        .then(data=>display_pokemon(data,false))
        
        try{
            if(mega_index<mega_data.length){
                if (i==mega_data[mega_index].id){
                    let j=0
                    if(i==6||i==150){
                        j=2
                    }
                    else{
                        j=1
                    }
                    for(let i=0;i<j;i++){
                        await fetch(url+mega_data[mega_index].api_id)
                        .then(res=>res.json())
                        .then(data=>{
                            data.name=data.name.replace("-mega","").replace("-x"," X").replace("-y"," Y").replace("-primal","")
                            data.id=mega_data[mega_index].id
                            display_pokemon(data,mega_data[mega_index].api_id)})
                        mega_index++
                    }
        
                }
            }
        }
        catch{
            location.reload()
        }


    }
    display_loading_screen("none","flex")
    finnished_displaying=true

}

function display_loading_screen(state1,state2){
    loading.style.display=state1
    not_loading.style.display=state2
}
function display_pokemon(data,mega) {
    const pokemon_name = data.name;
    const pokemon_image = data.sprites.other["official-artwork"].front_default;
    const pokemon_id = data.id;

    const pokemon_box = document.createElement("div");
    pokemon_box.classList.add("pokemon-box");
    if(mega){
        pokemon_box.classList.add("mega-box")
    }

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
        if(mega){
            window.location.href = "info.html?id=" + mega;  
        }
        else{
            window.location.href = "info.html?id=" + pokemon_id;
        }
    });

    container.appendChild(pokemon_box); 
}

function load_more_pokemon() {

    startpoint = endpoint + 1;
    endpoint += steps
    steps+=120
    fetching_pokemon(startpoint,endpoint);

}
let active_category=0
let active_sub_category=0
const sub_categories=[subC_none,subC_type,subC_gen,subC_class]

function handle_filter_options(event){


    const f_index=filter_options.indexOf(event.target)
    

    if(f_index<4){
        filter_options[active_category].classList.remove("selected")
        sub_categories[active_category].classList.remove("visible")
        filter_options[f_index].classList.add("selected")
        sub_categories[f_index].classList.add("visible")
        active_category=f_index
        
        if(f_index==0){
            selected_option.innerHTML="Selected : None"
            filter_options[active_sub_category].classList.remove("selected")
            active_sub_category=0

            

        }
    }
    else{
        filter_options[f_index].classList.add("selected")
        selected_option.innerHTML="Selected : "+filter_options[f_index].innerHTML
        filter_options[active_sub_category].classList.remove("selected")
        active_sub_category=f_index

        


    }
//22,31

}




function close_filter(){
    blur.style.display="none"
}
function open_filter(){
    blur.style.display="flex"
}
// Event litener for loading button

loading_button.onclick = load_more_pokemon;
loading_image.onclick = load_more_pokemon;
close_filter_button.onclick = close_filter
filter_button.onclick = open_filter


filter_inner_buttons[0].addEventListener("click",close_filter)
filter_inner_buttons[1].addEventListener("click",apply_filter)
for(let i=0;i<filter_options.length;i++){
    filter_options[i].addEventListener("click",handle_filter_options)
}



function apply_filter(){
    close_filter()
    active=selected_option.innerHTML.replace("Selected : ","")
    if(current_filter!=active){
    current_filter=active
    new_filter=true
    sessionStorage.setItem("filter",active)
    FilterBy(active)
    }

    
}
function FilterBy(active){
    console.log(active)
    if(new_filter==true&&finnished_displaying==false){
        setTimeout(()=>{FilterBy(active)},200)
        console.log("kkkkk",new_filter,finnished_displaying)
    }
    else{
        new_filter=false
        finnished_displaying=true
        container.innerHTML=""
        if(active=="None"){
            filter_by_none()
        }
        else if(active.includes("GEN")){
            filter_by_gen(active.slice(-1,))
        }
        else if(classes.includes(active)){
            filter_by_class(classes.indexOf(active))
        }
        else{
            filter_by_type(active)
        }
    }
}

function filter_by_none(){
    document.getElementById("load-container").style.display="flex";
    mega_index=0
    new_filter=false
    finnished_displaying=true
    startpoint=1
    endpoint=120
    steps=120
    container.innerHTML=""
    fetching_pokemon(startpoint,endpoint)
}
function filter_by_gen(gen){

    let gens=[
        [1,151,0],[152,251,15],[252,386,21],
        [387,493,43],[494,649,48],[650,721,49],
        [722,809,50],[810,905,50],[906,1010,50]
    ]
    const startpoint=gens[gen-1][0]
    const endpoint=gens[gen-1][1]
    mega_index=gens[gen-1][2]

    fetching_pokemon(startpoint,endpoint)
    document.getElementById("load-container").style.display="none";

}
function filter_by_class(index){
    index-=2
    console.log(index)
    if(index>=0){
        fetching_pokemon2(classes_vars[index],"class")
        document.getElementById("load-container").style.display="none";
    }
    else if (index==-1){
        
    }
}
async function filter_by_type(type){
    await fetch("https://pokeapi.co/api/v2/type/"+type.toLowerCase())
    .then(res=>res.json())
    .then(data=>fetching_pokemon2(data.pokemon,"type"))
    document.getElementById("load-container").style.display="none";

}

async function fetching_pokemon2(arr,func){
    finnished_displaying=false
    display_loading_screen("flex","none")
    for(let i=0;i<arr.length;i++){
        if(new_filter){
            new_filter=false
            finnished_displaying=true
            break
        }
        let id2
        if(func=="type"){
            id2=arr[i].pokemon.url.replace("https://pokeapi.co/api/v2/pokemon/","").replace("/","")
        }
        else{
            id2=String(arr[i])
        }

        console.log(id2)
        if(id2.length<5){
            await fetch("https://pokeapi.co/api/v2/pokemon/"+id2)
            .then(res=>res.json())
            .then(data=>display_pokemon(data,false))
        }

    }
    display_loading_screen("none","flex")
    finnished_displaying=true

}
console.log(sessionStorage.getItem("filter"))
if(sessionStorage.getItem("filter")==null){
    sessionStorage.setItem("x","null")
    fetching_megaData()
    selected_option.innerHTML="Selected : None"

}
else{
    selected_option.innerHTML="Selected : "+sessionStorage.getItem("filter")
    fetching_megaData()
    FilterBy(sessionStorage.getItem("filter"))
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
    return str.replace("Nidoran m", "Nidoran ♂").replace("Nidoran f", "Nidoran ♀").replace("fetchd","fetch'd").replace("Type null","Type:Null");
  }

