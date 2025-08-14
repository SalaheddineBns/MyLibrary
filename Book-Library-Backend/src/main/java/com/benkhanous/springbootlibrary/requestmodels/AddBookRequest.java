package com.benkhanous.springbootlibrary.requestmodels;

import lombok.Data;

@Data
public class AddBookRequest {
private String title;
private String description;
private String author;
private int copies;
private String category;
private String img;
}
