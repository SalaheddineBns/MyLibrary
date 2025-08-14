package com.benkhanous.springbootlibrary.entity;

import lombok.Data;

import javax.persistence.*;

@Entity
@Table(name = "history")
@Data
public class History {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    @Column(name = "user_email")
    private String userEmail;
    @Column(name="returned_date")
    private String returnedDate;

    @Column(name = "checkout_Date" )
    private String checkoutDate;

    @Column(name = "title")
    private String title;

    @Column(name = "author")
    private String author;

    @Column(name = "img")
    private String img;
    @Column(name = "description")
    private String description;
    public History(String userEmail,String checkoutDate,String returnedDate,String title,String description,String author,String img){
            this.userEmail=userEmail;
            this.checkoutDate=checkoutDate;
            this.returnedDate=returnedDate;
            this.title=title;
            this.author=author;
            this.description=description;
    }

    public History() {

    }
}
