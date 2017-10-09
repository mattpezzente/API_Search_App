const cors = 'https://cors-anywhere.herokuapp.com/';
const api = 'http://pokeapi.co/api/v2/';  
var limit = 12;
var h2Results;
var ulResults;
var frmSearch;
var txtSearch;
var cachedPokeArray;
var cachedTypeArray;
var tempHTML = '';

(() => {
  let btnSearch;

  h2Results = document.querySelector('#search-results h2');
  ulResults = document.querySelector('#search-results ul');
  txtSearch = document.querySelector('.txt-search');
  frmSearch = document.querySelector('#search-section form');
  btnSearch = document.querySelector('.btn-search');

  frmSearch.addEventListener('submit', stopForm);
  btnSearch.addEventListener('click', searchPoke);

  fetch('json/pokedex.json')
  .then(resp => resp.json())
  .then(resp => {
    cachedPokeArray = resp
    fetch('json/types.json')
      .then(resp => resp.json())
      .then(resp => {
        cachedTypeArray = resp
        cacheDisplay();
      })
      .catch(error => {
        console.log('error loading local types database, ' + error.message);
      });
  })
  .catch(error => {
    console.log('error loading local types database, ' + error.message);
  });

})();

/* Start External API Functions */

function searchPoke(e) {
  cacheResults(txtSearch.value);
  if (validateType(txtSearch.value)) {
  fetch(cors+api+'type/'+txtSearch.value)
    .then(resp => resp.json())
    .then(resp => {
      console.log(resp);
      for (let i = 0; i < limit; i++) {
        searchType(resp, i)
      }
    })
    .catch(error => {
      console.log('error loading Pokemon database, ' + error.message);
      displayStored();
    });
  }
}

function searchType(pokeArray, i) {
  fetch(cors+pokeArray.pokemon[i].pokemon.url)
    .then(resp => resp.json())
    .then(resp => { 
      console.log(resp);
      displayFetch(resp, i);
    })
    .catch(error => {
      console.log('error loading Types database, ' + error.message);
      displayStored();
    });
}

function displayFetch(typeArray, count) {
  h2Results.innerHTML = 'Search Results For: <span class="type type-' + txtSearch.value + '">' + txtSearch.value + '</span>';
  tempHTML = '<li>';
  tempHTML += '<img src="http://www.pokestadium.com/sprites/xy/' + typeArray.name + '.gif" alt="">';
  tempHTML += '<h3>' + typeArray.name.capsFirstLetter() + '</h3>';
  tempHTML += '<p class="type type-' + typeArray.types[0].type.name + '">' + typeArray.types[0].type.name + '</p>';
  if (typeArray.types[1]) {
    tempHTML += '<p class="type type-' + typeArray.types[1].type.name + '">' + typeArray.types[1].type.name + '</p>';
  }
  tempHTML += '</li>';

  ulResults.insertAdjacentHTML('beforeend', tempHTML);
  
  console.log(count + ' AND ' + limit);
  if (count == limit - 1) {
    removeLanding();
  }
}

function cacheResults(cache) {
  window.localStorage.setItem("poke_results", cache);
}

function cacheDisplay() {
  if (window.localStorage.poke_results) {
    txtSearch.value = window.localStorage.poke_results;
    displayStored();
  }
}

function displayStored() {
  let count = 0;
  h2Results.innerHTML = 'Search Results For: <span class="type type-' + txtSearch.value + '">' + txtSearch.value + '</span>';
  for (let i = 0; i < cachedPokeArray.length; i++) {
    if (cachedPokeArray[i].type[0].includes(findCName(txtSearch.value))) {
      tempHTML = '<li>';
      tempHTML += '<img src="http://www.pokestadium.com/sprites/xy/' + formatPokeName(cachedPokeArray[i].ename.toLowerCase()) + '.gif" alt="">';
      tempHTML += '<h3>' + cachedPokeArray[i].ename.capsFirstLetter() + '</h3>';
      tempHTML += '<p class="type type-' + txtSearch.value.toLowerCase() + '">' + txtSearch.value.toLowerCase() + '</p>';
      if (cachedPokeArray[i].type.length > 1) {
        tempHTML += '<p class="type type-' + findEName(cachedPokeArray[i].type[1]) + '">' + findEName(cachedPokeArray[i].type[1]) + '</p>';
      }
      tempHTML += '</li>';
      ulResults.insertAdjacentHTML('beforeend', tempHTML);
      count++;
    }
    else if (cachedPokeArray[i].type.length > 1 && cachedPokeArray[i].type[1].includes(findCName(txtSearch.value))) {
      tempHTML = '<li>';
      tempHTML += '<img src="http://www.pokestadium.com/sprites/xy/' + formatPokeName(cachedPokeArray[i].ename.toLowerCase()) + '.gif" alt="">';
      tempHTML += '<h3>' + cachedPokeArray[i].ename.capsFirstLetter() + '</h3>';
      tempHTML += '<p class="type type-' + txtSearch.value.toLowerCase() + '">' + txtSearch.value.toLowerCase() + '</p>';
      if (cachedPokeArray[i].type.length > 1) {
        tempHTML += '<p class="type type-' + findEName(cachedPokeArray[i].type[0]) + '">' + findEName(cachedPokeArray[i].type[0]) + '</p>';
      }
      tempHTML += '</li>';
      ulResults.insertAdjacentHTML('beforeend', tempHTML);
      count++;
    }
    if (count === limit) {
      tempHTML = '';
      break;
    }

  }

  if (count % limit > 0) {
    tempHTML = '<li style="background:none">';
    tempHTML += '</li>';
    ulResults.insertAdjacentHTML('beforeend', tempHTML);
  }

  removeLanding();

}

/* Utility Functions */

function stopForm(e) {
  e.preventDefault();
}

function validateType(value) {
  let valid

  if (frmSearch.querySelector('.search-error') !== null) {
    frmSearch.querySelector('.search-error').remove();
  }
  if (document.querySelector('.loading') === null) {
    h2Results.insertAdjacentHTML('afterend', '<img class="loading" src="/img/load.gif">');
  }
  for (let i = 0; i < cachedTypeArray.length; i++) {
    if (value.toLowerCase() === cachedTypeArray[i].ename.toLowerCase()) {
      if (frmSearch.querySelector('.search-error') !== null) {
        frmSearch.querySelector('.search-error').remove();
      }
      ulResults.innerHTML = '';
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
    removeLanding();
  }

  return valid;
}

function removeLanding() {
  if (document.querySelector('.loading')) {
    document.querySelector('.loading').remove();
  }
}

function formatPokeName(pokeName) {
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

function findEName(cname) {
  for (let i = 0; i < cachedTypeArray.length; i++) {
    if(cname.toLowerCase() === cachedTypeArray[i].cname){
      return cachedTypeArray[i].ename.toLowerCase();
    }
  }
}

function findCName(ename) {
  for (let i = 0; i < cachedTypeArray.length; i++) {
    if(ename.toLowerCase() === cachedTypeArray[i].ename.toLowerCase()){
      return cachedTypeArray[i].cname;
    }
  }
}

String.prototype.capsFirstLetter = function() {
  return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
};



