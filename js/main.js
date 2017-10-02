// const cors = 'https://cors-anywhere.herokuapp.com/';
// const api = 'http://pokeapi.co/api/v2/';  
// var limit = 12;
var h2Results;
var ulResults;
var btnSearch;
var frmSearch;
var txtSearch;
var pokeArray;
var typeArray;

(() => {
  h2Results = document.querySelector('#search-results h2');
  ulResults = document.querySelector('#search-results ul');
  txtSearch = document.querySelector('.txt-search');
  frmSearch = document.querySelector('#search-section form');
  btnSearch = document.querySelector('.btn-search');

  frmSearch.addEventListener('submit', FormStop);
  btnSearch.addEventListener('click', TypeSearch);

/* Cached API Functions */
  pokeArray = [];
  fetch('json/pokedex.json')
    .then(resp => resp.json())
    .then(resp => {
      pokeArray = resp;
    })
    .catch(error => {
      console.log('error loading pokedex database, ' + error.message);
    });

  fetch('json/types.json')
    .then(resp => resp.json())
    .then(resp => typeArray = resp)
    .catch(error => {
      console.log('error loading types database, ' + error.message);
    });
/************************/

})();

function FormStop(e) {
  e.preventDefault();
}

/* Start Cached API Functions */

function TypeSearch(e) {
  let errorHTML;

  if (frmSearch.querySelector('.search-error') !== null) {
    frmSearch.querySelector('.search-error').remove();
  }
  else {
    if (frmSearch.querySelector('.search-error') === null) {
      errorHTML = '<label class="search-error">error, type not found</label>';
      frmSearch.insertAdjacentHTML('beforeend', errorHTML);
    }
  }

  for (var i = 0; i < typeArray.length; i++) {
    if (txtSearch.value.toLowerCase() === typeArray[i].ename.toLowerCase()) {
      ulResults.innerHTML = '';
      DisplayPokemon();
      if (frmSearch.querySelector('.search-error') !== null) {
        frmSearch.querySelector('.search-error').remove();
        break;
      }
    }
    else {
      if (frmSearch.querySelector('.search-error') === null) {
        errorHTML = '<label class="search-error">error, type not found</label>';
        frmSearch.insertAdjacentHTML('beforeend', errorHTML);
      }
    }
  }
}

function DisplayPokemon() {
  let tempHTML
  let tempType1 = txtSearch.value;
  let count = 0;

  h2Results.innerHTML = 'Search Results For: <span class="type type-' + tempType1 + '">' + tempType1 + '</span>';

  for (let i = 0; i < pokeArray.length; i++) {
    if (pokeArray[i].type[0].includes(FindCName(tempType1))) {
      tempHTML = '<li>';
      tempHTML += '<img src="http://www.pokestadium.com/sprites/xy/' + FormatPokeName(pokeArray[i].ename.toLowerCase()) + '.gif" alt="">';
      tempHTML += '<h3>' + pokeArray[i].ename.capsFirstLetter() + '</h3>';
      tempHTML += '<p class="type type-' + tempType1.toLowerCase() + '">' + tempType1.toLowerCase() + '</p>';
      if (pokeArray[i].type.length > 1) {
        tempHTML += '<p class="type type-' + FindEName(pokeArray[i].type[1]) + '">' + FindEName(pokeArray[i].type[1]) + '</p>';
      }
      tempHTML += '</li>';
      ulResults.insertAdjacentHTML('beforeend', tempHTML);
      count++;
    }
    else if (pokeArray[i].type.length > 1 && pokeArray[i].type[1].includes(FindCName(tempType1))) {
      tempHTML = '<li>';
      tempHTML += '<img src="http://www.pokestadium.com/sprites/xy/' + FormatPokeName(pokeArray[i].ename.toLowerCase()) + '.gif" alt="">';
      tempHTML += '<h3>' + pokeArray[i].ename.capsFirstLetter() + '</h3>';
      tempHTML += '<p class="type type-' + tempType1.toLowerCase() + '">' + tempType1.toLowerCase() + '</p>';
      if (pokeArray[i].type.length > 1) {
        tempHTML += '<p class="type type-' + FindEName(pokeArray[i].type[0]) + '">' + FindEName(pokeArray[i].type[0]) + '</p>';
      }
      tempHTML += '</li>';
      ulResults.insertAdjacentHTML('beforeend', tempHTML);
      count++;
    }
  }
  if (count % 3 !== 0) {
    tempHTML = '<li style="background:none">';
    tempHTML += '</li>';
    ulResults.insertAdjacentHTML('beforeend', tempHTML);
  }
}

/* End Cached API Functions */

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
  for (let i = 0; i < typeArray.length; i++) {
    if(cname.toLowerCase() === typeArray[i].cname){
      return typeArray[i].ename.toLowerCase();
    }
  }
}

function FindCName(ename) {
  for (let i = 0; i < typeArray.length; i++) {
    if(ename.toLowerCase() === typeArray[i].ename.toLowerCase()){
      return typeArray[i].cname;
    }
  }
}

String.prototype.capsFirstLetter = function() {
  return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
};



/* Start External API Functions */
/*

function PokeSearch(e) {
  let txtValue = txtSearch.value;
  pokeArray = [];

  fetch(cors+api+'type/'+txtValue)
    .then(resp => resp.json())
    .then(resp => {
      pokeArray = resp.pokemon;
      ulResults.innerHTML = '';
      TypeSearch();
    })
    .catch(error => {
      console.log('error loading types database, ' + error.message);
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
      })
      .catch(error => {
        console.log('error loading types database, ' + error.message);
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

/* End External API Functions */