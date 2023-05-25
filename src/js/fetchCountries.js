const BASE_URL = 'https://restcountries.com/v3.1';
const params = new URLSearchParams({
  fields: 'name,capital,population,flags,languages,',
});

 async function fetchCountries(name) {
  const resp = await fetch(`${BASE_URL}/name/${name}?${params}`)
  if (!resp.ok) {
      throw new Error(resp.status);
    }
      return resp.json();
  }
 
export { fetchCountries };
