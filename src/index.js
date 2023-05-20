import './css/styles.css';
import debounce from 'lodash/debounce';
import { fetchCountries } from './js/fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;
const refs = {
  input: document.querySelector('#search-box'),
  list: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
  body: document.querySelector('body'),
};

refs.input.addEventListener('input', debounce(handlerSearch, DEBOUNCE_DELAY));

function handlerSearch(e) {
  const name = e.target.value.trim();
  if (name === '') {
    refs.list.innerHTML = '';
    return;
  }
  fetchCountries(name)
    .then(data => {
      if (data.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        clearInterface();
        return;
      }
      renderCountries(data);
    })
    .catch(err => {
      if (err.message === '404') {
        Notify.failure('Oops, there is no country with that name');
        clearInterface();
      } else {
        Notify.failure(`${err.message}`);
      }
    });
}

function renderCountries(data) {
  if (data.length >= 2 && data.length <= 10) {
    refs.countryInfo.innerHTML = '';
    refs.list.innerHTML = createMarkupListOfCountries(data);
  }
  if (data.length === 1) {
    refs.list.innerHTML = '';
    refs.countryInfo.innerHTML = createCountryCard(data);
  }
}
function createMarkupListOfCountries(countries) {
  return countries
    .map(
      ({ name: { common }, flags: { svg } }) =>
        `<li class="list">
           <img width="40" heigth="40" src="${svg}" alt="${common}">
           <span class="country-name-list">${common}</span></li>`
    )
    .join(' ');
}

function createCountryCard(country) {
  return country
    .map(
      ({ name: { common }, capital, population, flags: { svg }, languages }) =>
        `<img width="40"  src="${svg}" alt="${common}">
      <h2 class="country-name">${common}</h2>
      <ul>
        <li><b>Capital</b>: <span>${capital}</span></li>
        <li><b>Population</b>: <span>${population}</span></li>
        <li><b>Languages</b>: <span>${Object.values(languages).join(
          ', '
        )}</span></li>
      </ul>`
    )
    .join();
}
function clearInterface() {
  refs.list.innerHTML = '';
  refs.countryInfo.innerHTML = '';
}
