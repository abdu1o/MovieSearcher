class MovieService {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl = 'http://www.omdbapi.com/';
    }

    async search(title, type, page = 1) {
        const url = `${this.baseUrl}?s=${title}&type=${type}&page=${page}&apikey=${this.apiKey}`;
        const response = await fetch(url);
        const data = await response.json();
        return data;
    }

    async getMovie(movieId) {
        const url = `${this.baseUrl}?i=${movieId}&apikey=${this.apiKey}`;
        const response = await fetch(url);
        const data = await response.json();
        return data;
    }
}

class LoadingSpinner {
    constructor(spinnerId) {
        this.spinner = document.getElementById(spinnerId);
    }

    show() {
        this.spinner.style.display = 'block';
    }

    hide() {
        this.spinner.style.display = 'none';
    }
}

const movieService = new MovieService('57c07217');
let currentPage = 1;
let currentTitle = '';
let currentType = '';

const loadingSpinner = new LoadingSpinner('loadingSpinner');

async function handleSearch() {
    const movieTitle = document.getElementById('movieTitle').value;
    const movieType = document.getElementById('movieType').value;

    if (movieTitle.trim() === '') {
        alert('Please enter a movie title');
        return;
    }

    currentPage = 1;
    currentTitle = movieTitle;
    currentType = movieType;

    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';
    document.getElementById('moreButton').style.display = 'none';

    await loadMovies();
}

async function loadMovies() {
    const resultsDiv = document.getElementById('results');

    try {
        loadingSpinner.show();

        const data = await movieService.search(currentTitle, currentType, currentPage);

        loadingSpinner.hide();

        if (data.Response === 'True') {
            data.Search.forEach(movie => {
                const movieItem = document.createElement('div');
                movieItem.classList.add('movie-item');
                movieItem.innerHTML = `
                    <h3>${movie.Title} (${movie.Year})</h3>
                    <img src="${movie.Poster}" alt="Title doesn't have a poster" style="color: white;">
                    <button class="details-button" data-imdbid="${movie.imdbID}">Details</button>
                    <div class="movie-details" id="details-${movie.imdbID}" style="display: none;"></div>
                `;
                resultsDiv.appendChild(movieItem);
            });

            document.querySelectorAll('.details-button').forEach(button => {
                button.addEventListener('click', async function() {
                    const imdbID = this.getAttribute('data-imdbid');
                    const detailsDiv = document.getElementById(`details-${imdbID}`);

                    if (detailsDiv.innerHTML !== '') {
                        if (detailsDiv.style.display === 'none') {
                            detailsDiv.style.display = 'block';
                        } 
                        else {
                            detailsDiv.style.display = 'none';
                        }
                        return;
                    }

                    try {
                        const detailsData = await movieService.getMovie(imdbID);
                        if (detailsData.Response === 'True') {
                            detailsDiv.innerHTML = `
                                <p style="color: white;"><strong>Director:</strong> ${detailsData.Director}</p>
                                <p style="color: white;"><strong>Actors:</strong> ${detailsData.Actors}</p>
                                <p style="color: white;"><strong>Plot:</strong> ${detailsData.Plot}</p>
                                <p style="color: white;"><strong>Runtime:</strong> ${detailsData.Runtime}</p>
                            `;
                            detailsDiv.style.display = 'block';
                        } 
                        else {
                            detailsDiv.innerHTML = '<p>Details not found!</p>';
                            detailsDiv.style.display = 'block';
                        }
                    } 
                    catch (error) {
                        detailsDiv.innerHTML = '<p>Error loading details</p>';
                    }
                });
            });

            if (data.totalResults > currentPage * 10) {
                document.getElementById('moreButton').style.display = 'block';
            } 
            else {
                document.getElementById('moreButton').style.display = 'none';
            }

            currentPage++;
        } 

        else {
            if (currentPage === 1) {
                resultsDiv.innerHTML = '<p>Movie not found!</p>';
            }
            document.getElementById('moreButton').style.display = 'none';
        }
    } 
    catch (error) {
        loadingSpinner.hide();
        resultsDiv.innerHTML = '<p>Error during search</p>';
    }
}

document.getElementById('searchButton').addEventListener('click', handleSearch);
document.getElementById('moreButton').addEventListener('click', loadMovies);
