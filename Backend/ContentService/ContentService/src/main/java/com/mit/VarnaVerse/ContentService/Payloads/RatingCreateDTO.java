package com.mit.VarnaVerse.ContentService.Payloads;

public class RatingCreateDTO {
    private Integer ratingValue; // (1-5)

    // Constructors
    public RatingCreateDTO() {}

    public RatingCreateDTO(Integer ratingValue) {
        this.ratingValue = ratingValue;
    }

    // Getter and Setter
    public Integer getRatingValue() { return ratingValue; }
    public void setRatingValue(Integer ratingValue) { this.ratingValue = ratingValue; }
}