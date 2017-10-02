const cors = 'https://cors-anywhere.herokuapp.com/';
const api = 'http://pokeapi.co/api/v2/';  
var limit = 12;
var h2Results;
var ulResults;
var btnSearch;
var frmSearch;
var txtSearch;
var pokeArray;
var typeArray;
var cachedPokeArray;
var cachedTypeArray;
var inputValue;
var valid;

(() => {
  h2Results = document.querySelector('#search-results h2');
  ulResults = document.querySelector('#search-results ul');
  txtSearch = document.querySelector('.txt-search');
  frmSearch = document.querySelector('#search-section form');
  btnSearch = document.querySelector('.btn-search');

  frmSearch.addEventListener('submit', FormStop);
  btnSearch.addEventListener('click', PokeSearch);

  fetch('json/pokedex.json')
  .then(resp => resp.json())
  .then(resp => cachedPokeArray = resp)
  .catch(error => {
    console.log('error loading local types database, ' + error.message);
  });

  fetch('json/types.json')
  .then(resp => resp.json())
  .then(resp => cachedTypeArray = resp)
  .catch(error => {
    console.log('error loading local types database, ' + error.message);
  });
})();

/* Start External API Functions */

function PokeSearch(e) {
  inputValue = txtSearch.value;
  
  if (ValidateType(inputValue)) {
    console.log('yup');
    fetch(cors+api+'type/'+inputValue)
      .then(resp => resp.json())
      .then(resp => {
        pokeArray = resp.pokemon;
        TypeSearch();
      })
      .catch(error => {
        console.log('error loading Pokemon database, ' + error.message);
        DisplayCachedPokemon();
      });
  }
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
      })
      .catch(error => {
        console.log('error loading types database, ' + error.message);
        DisplayCachedPokemon();
      });
  }
}

function DisplayPokemon() {
  ulResults.innerHTML = '';
  h2Results.innerHTML = 'Search Results For: <span class="type type-' + inputValue + '">' + inputValue + '</span>';

  for (let i = 0; i < limit; i++) {
    temp = '<li>';
    temp += '<img src="http://www.pokestadium.com/sprites/xy/' + pokeArray[i].pokemon.name + '.gif" alt="">';
    temp += '<h3>' + pokeArray[i].pokemon.name.capsFirstLetter() + '</h3>';
    for (let j = 0; j < typeArray.length; j++) {
      if (typeArray[j].name == pokeArray[i].pokemon.name) {
          temp += '<p class="type type-' + typeArray[j].types[0].type.name + '">' + typeArray[j].types[0].type.name + '</p>';
        if (typeArray[j].types[1]) {
          temp += '<p class="type type-' + typeArray[j].types[1].type.name + '">' + typeArray[j].types[1].type.name + '</p>';
        }
      }
    }
    temp += '</li>';

    ulResults.insertAdjacentHTML('beforeend', temp);
  }
  RemoveLoading();
}

/* End External API Functions */

/* Start Cached API Functions */

function DisplayCachedPokemon() {
  let tempHTML
  let count = 0;

  ulResults.innerHTML = '';
  h2Results.innerHTML = 'Search Results For: <span class="type type-' + inputValue + '">' + inputValue + '</span>';

  for (let i = 0; i < cachedPokeArray.length; i++) {
    if (cachedPokeArray[i].type[0].includes(FindCName(inputValue))) {
      tempHTML = '<li>';
      tempHTML += '<img src="http://www.pokestadium.com/sprites/xy/' + FormatPokeName(cachedPokeArray[i].ename.toLowerCase()) + '.gif" alt="">';
      tempHTML += '<h3>' + cachedPokeArray[i].ename.capsFirstLetter() + '</h3>';
      tempHTML += '<p class="type type-' + inputValue.toLowerCase() + '">' + inputValue.toLowerCase() + '</p>';
      if (cachedPokeArray[i].type.length > 1) {
        tempHTML += '<p class="type type-' + FindEName(cachedPokeArray[i].type[1]) + '">' + FindEName(cachedPokeArray[i].type[1]) + '</p>';
      }
      tempHTML += '</li>';
      ulResults.insertAdjacentHTML('beforeend', tempHTML);
      count++;
    }
    else if (cachedPokeArray[i].type.length > 1 && cachedPokeArray[i].type[1].includes(FindCName(inputValue))) {
      tempHTML = '<li>';
      tempHTML += '<img src="http://www.pokestadium.com/sprites/xy/' + FormatPokeName(cachedPokeArray[i].ename.toLowerCase()) + '.gif" alt="">';
      tempHTML += '<h3>' + cachedPokeArray[i].ename.capsFirstLetter() + '</h3>';
      tempHTML += '<p class="type type-' + inputValue.toLowerCase() + '">' + inputValue.toLowerCase() + '</p>';
      if (cachedPokeArray[i].type.length > 1) {
        tempHTML += '<p class="type type-' + FindEName(cachedPokeArray[i].type[0]) + '">' + FindEName(cachedPokeArray[i].type[0]) + '</p>';
      }
      tempHTML += '</li>';
      ulResults.insertAdjacentHTML('beforeend', tempHTML);
      count++;
    }

    if (i >= limit) {
      break;
    }

  }
  if (count % limit > 0) {
    tempHTML = '<li style="background:none">';
    tempHTML += '</li>';
    ulResults.insertAdjacentHTML('beforeend', tempHTML);
  }
  RemoveLoading();
}

/* End Cached API Functions */

/* Start Utility Functions */

function FormStop(e) {
  e.preventDefault();
}

function ValidateType(value) {
  if (frmSearch.querySelector('.search-error') !== null) {
    frmSearch.querySelector('.search-error').remove();
  }
  if (document.querySelector('.loading') === null) {
    h2Results.insertAdjacentHTML('afterend', '<img class="loading" src="/assets/load.gif">');
  }
  for (let i = 0; i < cachedTypeArray.length; i++) {
    if (value.toLowerCase() === cachedTypeArray[i].ename.toLowerCase()) {
      if (frmSearch.querySelector('.search-error') !== null) {
        frmSearch.querySelector('.search-error').remove();
      }
      valid = true;
      break;
    }
    else {
      valid = false;
    }
  }
  if(valid === false && frmSearch.querySelector('.search-error') === null) {
    errorHTML = '<label class="search-error">error, type not found</label>';
    frmSearch.insertAdjacentHTML('beforeend', errorHTML);
    RemoveLoading();
  }

  return valid;
}

function RemoveLoading() {
  if (document.querySelector('.loading')) {
    document.querySelector('.loading').remove();
  }
}

function FormatPokeName(pokeName) {
  if (pokeName.includes('\'')) {
    pokeName = pokeName.replace('\'', '');
  }
  if (pokeName.includes('.')) {
    pokeName = pokeName.replace('.', '');
  }
  if (pokeName.indexOf(' ') > 0) {
    pokeName = pokeName.replace(' ', '-');  
  }

  return pokeName;
}

function FindEName(cname) {
  for (let i = 0; i < cachedTypeArray.length; i++) {
    if(cname.toLowerCase() === cachedTypeArray[i].cname){
      return cachedTypeArray[i].ename.toLowerCase();
    }
  }
}

function FindCName(ename) {
  for (let i = 0; i < cachedTypeArray.length; i++) {
    if(ename.toLowerCase() === cachedTypeArray[i].ename.toLowerCase()){
      return cachedTypeArray[i].cname;
    }
  }
}

String.prototype.capsFirstLetter = function() {
  return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
};

/* End Utility Functions */


