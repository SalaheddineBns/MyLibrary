package com.benkhanous.springbootlibrary.controller;

import com.benkhanous.springbootlibrary.requestmodels.AddBookRequest;
import com.benkhanous.springbootlibrary.service.AdminService;
import com.benkhanous.springbootlibrary.service.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import utils.ExtractJWT;

@CrossOrigin("https://localhost:3000")
@RestController
@RequestMapping("api/admin")
public class AdminController {

    private AdminService adminService;

    @Autowired
    public AdminController(AdminService adminService){
        this.adminService=adminService;
    }
    @PostMapping("/secure/add/book")
    public void postBook(@RequestHeader(value = "Authorization") String token,@RequestBody AddBookRequest addBookRequest) throws Exception
    {
        String admin= ExtractJWT.payloadJWTExtraction(token,"\"userType\"");
        if(admin==null || !admin.equals("admin")){
            throw new Exception("Administration page only");
        }
        adminService.postBook(addBookRequest);
    }

    @PutMapping("/secure/increase/book/quantity")
    public void increaseBookQuantity(@RequestHeader(value="Authorization") String token,@RequestParam Long bookId) throws Exception {
        String admin= ExtractJWT.payloadJWTExtraction(token,"\"userType\"");
        if(admin==null || !admin.equals("admin")){
            throw new Exception("Admnistration page only");
        }
        adminService.increaseBookQuantity(bookId);
    }
    @PutMapping("/secure/decrease/book/quantity")
    public void decreaseBookQuantity(@RequestHeader(value = "Authorization")String token,@RequestParam Long bookId) throws Exception{
        String admin=ExtractJWT.payloadJWTExtraction(token,"\"userType\"");
        if(admin==null || !admin.equals("admin")){
            throw new Exception("Administration access only");
        }
        adminService.decreaseBookQuantity(bookId);

    }
    @DeleteMapping("secure/delete/book")
    public void deleteBook(@RequestHeader(value = "Authorization") String token,@RequestParam Long bookId) throws Exception{
        String admin=ExtractJWT.payloadJWTExtraction(token,"\"userType\"");
        if(admin == null || !admin.equals("admin")){
            throw new Exception("Administration Page only ");
        }
        adminService.deleteBookService(bookId);
    }
}
