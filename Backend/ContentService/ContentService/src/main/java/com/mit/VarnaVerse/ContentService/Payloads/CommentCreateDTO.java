package com.mit.VarnaVerse.ContentService.Payloads;


public class CommentCreateDTO {
    private String text;

    // Constructors
    public CommentCreateDTO() {}

    public CommentCreateDTO(String text) {
        this.text = text;
    }

    // Getter and Setter
    public String getText() { return text; }
    public void setText(String text) { this.text = text; }
}