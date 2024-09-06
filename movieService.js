export class MovieService {
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
