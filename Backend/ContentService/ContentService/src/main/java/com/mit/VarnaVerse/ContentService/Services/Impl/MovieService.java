package com.mit.VarnaVerse.ContentService.Services.Impl;


import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class MovieService {

    private final String API_KEY = "2095c90f"; // OMDb key
    private final String BASE_URL = "http://www.omdbapi.com/";

    private final RestTemplate restTemplate = new RestTemplate();

    // Search movies by title (multiple results)
    public String searchMovies(String title) {
        String url = BASE_URL + "?s=" + title + "&apikey=" + API_KEY;
        return restTemplate.getForObject(url, String.class);
    }

    // Get default/trending movies (for initial display)
    public String getDefaultMovies() {
        // You can choose a popular search term or random titles
        // For example, using "Avengers" as trending or multiple popular searches
        String defaultSearch = "Avengers";
        String url = BASE_URL + "?s=" + defaultSearch + "&apikey=" + API_KEY;
        return restTemplate.getForObject(url, String.class);
    }

    // Optional: search a single movie by exact title
    public String searchMovieByTitle(String title) {
        String url = BASE_URL + "?t=" + title + "&apikey=" + API_KEY;
        return restTemplate.getForObject(url, String.class);
    }
}

