const API_KEY = 'efc975a7-2cb3-49ac-8a5a-a9e92572bb98';
const API_URL_POPULAR = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_100_POPULAR_FILMS&page=1';
const API_URL_SEARCH = 'https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=';

getMovies(API_URL_POPULAR)

async function getMovies(url) {
    const resp = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            "X-API-KEY": API_KEY,
        }
    });
    const respData = await resp.json();
    renderMovies(respData);
}

function getClassByRate (rate) {
    if (rate >= 7) {
        return 'green'
    } else if (rate >= 5) {
        return 'orange'
    } else {
        return 'red'
    }
}

function renderMovies(data) {
    const moviesEl = document.querySelector('.movies');
    document.querySelector('.movies').innerHTML = ''
    data.films.forEach(movie => {
        const movieEl = document.createElement('div')
        movieEl.classList.add('movie')
        movieEl.innerHTML = `
        <div class="movie">
          <div class="movie__cover-inner">
            <img
              src=${movie.posterUrlPreview}
              class="movie__cover"
              alt=${movie.nameRu}
            />
            <div class="movie__cover_darkened"></div>
          </div>
          <div class="movie__info">
            <div class="movie__info-title">${movie.nameRu}</div>
            <div class="movie__info-genre">${movie.genres.map(genre => ` ${genre.genre}`)}</div>
            ${movie.rating &&
            `<div class="movie__info-rating movie__info-rating_${getClassByRate(movie.rating)}">${movie.rating}</div>
            `}
          </div>
        </div>`;
        moviesEl.appendChild(movieEl)
    })
}

const form = document.querySelector('form');
const search = document.querySelector('.header__content-search');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const apiSearchUrl = `${API_URL_SEARCH}${search.value}`
    if (search.value) {
        getMovies(apiSearchUrl);
        search.value = ''
    }
})