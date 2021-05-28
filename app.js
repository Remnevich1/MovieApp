const API_KEY = 'efc975a7-2cb3-49ac-8a5a-a9e92572bb98';
const API_URL_POPULAR = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_100_POPULAR_FILMS&page=';
const API_URL_SEARCH = 'https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=';
let searchStr = '';

getMovies(API_URL_POPULAR);

async function getMovies(url, pageId = 1) {
    const resp = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            "X-API-KEY": API_KEY,
        }
    });
    const respData = await resp.json();
    console.log(respData)
    renderMovies(respData);
    renderPagination(respData, pageId);
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

const paginationEl = document.querySelector('.pagination');

const getPaginEl = (i, searchStr, isActive, text) => {
    const paginEl = document.createElement('a');
    if (searchStr) {
        const apiSearchUrl = `${API_URL_SEARCH}${searchStr}`
        paginEl.href = apiSearchUrl + '&page=' + (i + 1);
    } else {
        paginEl.href = API_URL_POPULAR + (i + 1);
    }
    paginEl.classList.add('paginationEl');
    if (isActive) {
        paginEl.classList.add('active');
    }
    paginEl.setAttribute('data-id', i + 1);
    paginEl.innerHTML = text || i + 1;
    return paginEl
}

function getDots () {
    const dots = document.createElement('span');
    dots.classList.add('whiteDots')
    dots.innerHTML = '...';
    return dots
}

function renderPagination(data, pageId) {
    document.querySelector('.pagination').innerHTML = '';
    if (pageId > 1) {
        paginationEl.appendChild(getPaginEl(pageId - 2, searchStr, false, '<-'))
    }
    paginationEl.appendChild(getPaginEl(0, searchStr, 1 == pageId))
    if (data.pagesCount > 2) {
        if(1 == pageId || data.pagesCount == pageId) {
            paginationEl.appendChild(getDots())
        } else {
            // первый раз показать точки?
            if (pageId > 2) {
                paginationEl.appendChild(getDots())
            }
            // показать активную страницу
            paginationEl.appendChild(getPaginEl(pageId - 1, searchStr, true))
            // второй раз показать точки?
            if (pageId < data.pagesCount -1) {
                paginationEl.appendChild(getDots())
            }
        }
        // for (let i = 0; i < data.pagesCount; i++) {
        //     const paginEl = getPaginEl(i, searchStr, i + 1 == pageId)
        //     paginationEl.appendChild(paginEl)
        // }
    }
    if(data.pagesCount != 1) {
        paginationEl.appendChild(getPaginEl(data.pagesCount - 1, searchStr, data.pagesCount == pageId))
    }
    if (pageId < data.pagesCount) {
        paginationEl.appendChild(getPaginEl(+pageId, searchStr, false, '->'))
    }
}
paginationEl.addEventListener('click', (e) => {
    e.preventDefault();
    const paginEls = document.querySelector('.paginationEl')
    getMovies(e.target.href, e.target.getAttribute('data-id'))
})

const form = document.querySelector('form');
const search = document.querySelector('.header__content-search');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const apiSearchUrl = `${API_URL_SEARCH}${search.value}`
    if (search.value) {
        searchStr = search.value;
        getMovies(apiSearchUrl);
        search.value = ''
    }
})