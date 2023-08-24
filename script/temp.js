const container = document.getElementsByClassName("container")[0];
const affirmative = document.getElementById("aff");
const negative=document.getElementById("neg");
const loading = document.getElementsByClassName("loading")[0];
const search_box = document.getElementsByClassName("search-box")[0];
const return_button=document.getElementsByClassName("go-back")[0]

const max_pokemons = 1010;
const json_url = "https://raw.githubusercontent.com/7marr/Pokedex/main/script/json/search/";
const pokeapi_url="https://pokeapi.co/api/v2/pokemon/"
const max_display=120

let search_value = "";
let json_file=1
let json_data
let time_out

let matching_pokemons =[]
let checked_pokemons = 0;
let new_search=false
let finnished=true


return_button.addEventListener("click",event=>{
    window.location.href = "index.html"
})

search_box.addEventListener("input", event => {
    affirmative.style.display = "none";
    loading.style.display = "flex";
    negative.style.display="none"

    if(!new_search&&finnished){
        json_file=1
        matching_pokemons=[]
        checked_pokemons=0
        search_value = event.target.value.trim().toLowerCase();
        clearTimeout(time_out)
        
        check_traffic()
    }



})

function check_traffic(){
    if(new_search&&!finnished){
        setTimeout(check_traffic,200)
        console.log("trafffic")
    }
    else{
        if(search_value!=""){
            time_out = setTimeout(fetch_json,1000)
        }
        else{
            affirmative.style.display = "flex";
            loading.style.display = "none";
        }
    }

}
async function fetch_json() {
    finnished=false
    const response = await fetch(json_url + `${json_file}.json`);
    json_data = await response.json();
    
    filter()
}

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

function is_int() {
    return !isNaN(parseInt(search_value));
}

function search(type){
    for(let i=0;matching_pokemons.length<max_display&&checked_pokemons<max_pokemons;i++){
        const pokemon = json_data[i];
        if (!pokemon) {
            // If we reached the end of the current JSON file, fetch the next one
            json_file += 1;
            fetch_json();
            break;
        }
        const value = type === "id" ? String(pokemon.id) : pokemon.name;
        if (value.includes(search_value)) {
            // If there's a match, push the ID of the pokemon to "pokemons"
            matching_pokemons.push(pokemon.id)
        }
        checked_pokemons++;
    }
    console.log(matching_pokemons)
    if(matching_pokemons.length===0 && checked_pokemons>=max_pokemons){
        loading.style.display="none"
        negative.style.display="flex"
    }
    if (matching_pokemons.length >= max_display || checked_pokemons >= max_pokemons) {
        console.log("fin")

    }


}