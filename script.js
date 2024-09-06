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

const movieService = new MovieService('57c07217');

async function handleSearch() {
    const movieTitle = document.getElementById('movieTitle').value;
    const movieType = document.getElementById('movieType').value;

    if (movieTitle.trim() === '') {
        alert('Please enter a movie title');
        return;
    }

    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    try {
        const data = await movieService.search(movieTitle, movieType);
        if (data.Response === 'True') {
            data.Search.forEach(movie => {
                const movieItem = document.createElement('div');
                movieItem.classList.add('movie-item');
                movieItem.innerHTML = `
                    <h3>${movie.Title} (${movie.Year})</h3>
                    <img src="${movie.Poster}" alt="${movie.Title} Poster">
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
                        } else {
                            detailsDiv.style.display = 'none';
                        }
                        return;
                    }

                    try {
                        const detailsData = await movieService.getMovie(imdbID);
                        if (detailsData.Response === 'True') {
                            detailsDiv.innerHTML = `
                                <p><strong>Director:</strong> ${detailsData.Director}</p>
                                <p><strong>Actors:</strong> ${detailsData.Actors}</p>
                                <p><strong>Plot:</strong> ${detailsData.Plot}</p>
                                <p><strong>Runtime:</strong> ${detailsData.Runtime}</p>
                            `;
                            detailsDiv.style.display = 'block';
                        } else {
                            detailsDiv.innerHTML = '<p>Details not found!</p>';
                            detailsDiv.style.display = 'block';
                        }
                    } catch (error) {
                        detailsDiv.innerHTML = '<p>Error loading details</p>';
                    }
                });
            });
        } else {
            resultsDiv.innerHTML = '<p>Movie not found!</p>';
        }
    } catch (error) {
        resultsDiv.innerHTML = '<p>Error during search</p>';
    }
}

document.getElementById('searchButton').addEventListener('click', handleSearch);
