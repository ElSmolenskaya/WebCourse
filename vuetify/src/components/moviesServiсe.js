import axios from 'axios';

export default class MoviesService {
    constructor() {
        this.baseUrl = "https://api.themoviedb.org/3/";
        this.apiKey = "2ebe3b15255a67e613dd6a9905f78e14";
        this.language = "en-US";
        //this.maximumPageNumber = 1000;
    }

    async getMovies(movieId, pageNumber, term) {
        /*if (pageNumber > this.maximumPageNumber) {
            return;
        }*/

        let queryString;

        if (movieId) {
            queryString = this.baseUrl
                + "movie/" + movieId
                + "/recommendations?api_key=" + this.apiKey
                + "&language=" + this.language
                + "&page=" + pageNumber;
        } else {
            queryString = term
                ? this.baseUrl + "search/movie?api_key=" + this.apiKey + "&language=" + this.language + "&query="
                + term + "&page=" + pageNumber
                : this.baseUrl + "movie/popular?api_key=" + this.apiKey + "&language=" + this.language
                + "&page=" + pageNumber;
        }

        return await axios.get(queryString);
    }

    getGenres() {
        return axios.get(this.baseUrl
            + "genre/movie/list?api_key=" + this.apiKey
            + "&language=" + this.language
        );
    }

    getMovie(movieId) {
        return axios.get(this.baseUrl
            + "movie/" + movieId
            + "?api_key=" + this.apiKey
            + "&language=" + this.language
        );
    }
}