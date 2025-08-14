package com.benkhanous.springbootlibrary.entity;

import lombok.Data;

import javax.persistence.*;

@Entity
@Table(name = "checkout")
@Data
public class Checkout {

    public Checkout() {

    }

    public Checkout(String user_email, String checkout_date, String return_Date, Long book_id) {
        this.userEmail = user_email;
        this.checkoutDate = checkout_date;
        this.returnDate = return_Date;
        this.bookId = book_id;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "user_email")
    private String userEmail;

    @Column(name = "checkout_date")
    private String checkoutDate;

    @Column(name = "return_date")
    private String returnDate;

    @Column(name = "book_id")
    private Long bookId;
}
