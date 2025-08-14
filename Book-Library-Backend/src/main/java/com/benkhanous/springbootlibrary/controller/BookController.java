package com.benkhanous.springbootlibrary.controller;

import com.benkhanous.springbootlibrary.entity.Book;
import com.benkhanous.springbootlibrary.responsemodels.ShelfCurrentLoansResponse;
import com.benkhanous.springbootlibrary.service.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import utils.ExtractJWT;

import java.util.List;

@CrossOrigin("https://localhost:3000")
@RestController
@RequestMapping("/api/books")
public class BookController {
    BookService bookService;

    @Autowired
    public BookController(BookService bookService){
        this.bookService=bookService;
    }

    @GetMapping("/secure/currentloans")
    public List<ShelfCurrentLoansResponse> getCurrentLoans(@RequestHeader(value = "Authorization") String token) throws Exception {
        String userEmail=ExtractJWT.payloadJWTExtraction(token,"\"sub\"");
        return bookService.currentLoans(userEmail);
    }

    @GetMapping("/secure/currentloans/count")
     public int currentLoansCount(@RequestHeader(value = "Authorization") String token){
        String userEmail=ExtractJWT.payloadJWTExtraction(token,"\"sub\"");
        return bookService.currentLoansCount(userEmail);
    }

    @PutMapping("/secure/checkout")
    public Book checkoutBook(@RequestParam Long bookId,@RequestHeader(value = "Authorization") String token) throws Exception {
     String userEmail= ExtractJWT.payloadJWTExtraction(token,"\"sub\"");
     return bookService.checkoutBook(userEmail,bookId);
    }
    @GetMapping("/secure/ischeckout/byuser")
    public Boolean checkoutBookByUser(@RequestParam Long bookId,@RequestHeader(value = "Authorization") String token) throws Exception{
        String userEmail=ExtractJWT.payloadJWTExtraction(token,"\"sub\"");
        return bookService.checkoutBookByUser(userEmail,bookId);
    }
    @PutMapping("/secure/return")
    public void returnBook(@RequestHeader(value = "Authorization") String token,@RequestParam Long bookId)throws Exception{
        System.out.println(token);
        String userEmail=ExtractJWT.payloadJWTExtraction(token,"\"sub\"");
        bookService.returnBook(userEmail,bookId);
    }

    @PutMapping("/secure/renew/loan")
    public void renewLoan(@RequestHeader(value = "Authorization") String token,@RequestParam Long bookId)throws Exception{
        String userEmail=ExtractJWT.payloadJWTExtraction(token,"\"sub\"");
        bookService.renewLoan(userEmail,bookId);
    }

}
