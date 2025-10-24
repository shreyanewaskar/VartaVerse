package com.mit.VarnaVerse.ContentService.Exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

// This annotation makes Spring automatically return a 404 Not Found error
@ResponseStatus(value = HttpStatus.NOT_FOUND) 
public class ResourceNotFoundException extends RuntimeException {

    // Constructor to pass a custom message
    public ResourceNotFoundException(String message) {
        super(message);
    }
}