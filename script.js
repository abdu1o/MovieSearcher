document.getElementById('searchButton').addEventListener('click', function() {
    const movieTitle = document.getElementById('movieTitle').value;
    const movieType = document.getElementById('movieType').value;
    const apiKey = '57c07217'; 

    if (movieTitle.trim() === '') {
        alert('Please enter a movie title');
        return;
    }

    const url = `http://www.omdbapi.com/?s=${movieTitle}&type=${movieType}&apikey=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const resultsDiv = document.getElementById('results');
            resultsDiv.innerHTML = ''; 

            if (data.Response === 'True') {
                data.Search.forEach(movie => {
                    const movieItem = document.createElement('div');
                    movieItem.classList.add('movie-item');
                    movieItem.innerHTML = 
                        `<h3>${movie.Title} (${movie.Year})</h3>
                        <img src="${movie.Poster}" alt="${movie.Title} Poster">
                        <button class="details-button" data-imdbid="${movie.imdbID}">Details</button>
                        <div class="movie-details" id="details-${movie.imdbID}" style="display: none;"></div>`;
                    resultsDiv.appendChild(movieItem);
                });

                document.querySelectorAll('.details-button').forEach(button => {
                    button.addEventListener('click', function() {
                        const imdbID = this.getAttribute('data-imdbid');
                        const detailsDiv = document.getElementById(`details-${imdbID}`);
                        
                        detailsDiv.classList.toggle('details-text');

                        if (detailsDiv.innerHTML !== '') {
                            if (detailsDiv.style.display === 'none') {
                                detailsDiv.style.display = 'block';
                            } 
                            else {
                                detailsDiv.style.display = 'none';
                            }
                            return;
                        }

                        const detailsUrl = `http://www.omdbapi.com/?i=${imdbID}&apikey=${apiKey}`;

                        fetch(detailsUrl)
                            .then(response => response.json())
                            .then(detailsData => {
                                if (detailsData.Response === 'True') {
                                    detailsDiv.innerHTML = `
                                        <p><strong>Director:</strong> ${detailsData.Director}</p>
                                        <p><strong>Actors:</strong> ${detailsData.Actors}</p>
                                        <p><strong>Plot:</strong> ${detailsData.Plot}</p>
                                        <p><strong>Runtime:</strong> ${detailsData.Runtime}</p>
                                    `;
                                    detailsDiv.style.display = 'block';
                                } 
                                else {
                                    detailsDiv.innerHTML = '<p>Details not found!</p>';
                                    detailsDiv.style.display = 'block';
                                }
                            })

                            .catch(error => {
                                // console.error('Error:', error);
                                detailsDiv.innerHTML = '<p>Error</p>';
                                detailsDiv.style.display = 'block';
                            });
                    });
                });

            } else {
                resultsDiv.innerHTML = '<p>Movie not found!</p>';
            }
        })
        .catch(error => {
            // console.error('Error:', error);
            const resultsDiv = document.getElementById('results');
            resultsDiv.innerHTML = '<p>Error</p>';
        });
});
