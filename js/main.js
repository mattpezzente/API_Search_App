const cors = 'https://cors-anywhere.herokuapp.com/';
const api = 'http://pokeapi.co/api/v2/';
var limit = 12;
var temp = '';
var h2Results;
var ulResults;
var btnSearch;
var frmSearch;
var pokeArray;
var typeArray;

(() => {

h2Results = document.querySelector('#search-results h2');
ulResults = document.querySelector('#search-results ul');
frmSearch = document.querySelector('#search-section form');
btnSearch = document.querySelector('.btn-search');

frmSearch.addEventListener('submit', FormStop);
btnSearch.addEventListener('click', PokeSearch);

})()

function FormStop(e) {
  e.preventDefault();
}

function PokeSearch(e) {
  let target = e.target;
  let txtBox = document.querySelector('.txt-search');
  let txtValue = txtBox.value;

  fetch(cors+api+'type/'+txtValue)
    .then(resp => resp.json())
    .then(resp => {
      pokeArray = resp.pokemon;
      ulResults.innerHTML = '';
      TypeSearch();
    });
}

function TypeSearch() {
  typeArray = [];

  for (let i = 0; i < limit; i++) {
    fetch(cors+pokeArray[i].pokemon.url)
      .then(resp => resp.json())
      .then(resp => {
        typeArray.push(resp);
      })
     .then(() => {
        if (typeArray.length >= limit) {
          DisplayPokemon();
        }
      });
  }
}

function DisplayPokemon() {
  for (let i = 0; i < limit; i++) {
    temp = '<li>';
    temp += '<img src="http://www.pokestadium.com/sprites/xy/' + pokeArray[i].pokemon.name + '.gif" alt="">';
    temp += '<h3>' + pokeArray[i].pokemon.name.capsFirstLetter() + '</h3>';
    for (let j = 0; j < typeArray.length; j++) {
      if (typeArray[j].name == pokeArray[i].pokemon.name) {
          temp += '<p class="type-' + typeArray[j].types[0].type.name + '">' + typeArray[j].types[0].type.name + '</p>';
        if (typeArray[j].types[1]) {
          temp += '<p class="type-' + typeArray[j].types[1].type.name + '">' + typeArray[j].types[1].type.name + '</p>';
        }
      }
    }
    temp += '</li>';

    ulResults.insertAdjacentHTML('beforeend', temp);
  }
}

String.prototype.capsFirstLetter = function() {
  return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
}