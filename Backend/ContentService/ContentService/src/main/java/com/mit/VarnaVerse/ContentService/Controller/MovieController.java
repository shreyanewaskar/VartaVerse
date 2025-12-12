package com.mit.VarnaVerse.ContentService.Controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.mit.VarnaVerse.ContentService.Services.Impl.MovieService;

@RestController
@RequestMapping("/api/movies")
public class MovieController {

    @Autowired
    private MovieService movieService;

    // Search by title
    @GetMapping("/search")
    public String searchMovies(@RequestParam String title) {
        return movieService.searchMovies(title);
    }
}
