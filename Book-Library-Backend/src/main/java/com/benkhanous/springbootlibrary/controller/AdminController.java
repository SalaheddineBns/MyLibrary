package com.benkhanous.springbootlibrary.controller;

import com.benkhanous.springbootlibrary.requestmodels.AddBookRequest;
import com.benkhanous.springbootlibrary.service.AdminService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin({"http://localhost:3000", "https://effective-giggle-7xgg7gvx64gcj69-3000.app.github.dev"})
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private AdminService adminService;

    @Autowired
    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @PutMapping("/secure/increase/book/quantity")
    public void increaseBookQuantity(@AuthenticationPrincipal Jwt jwt,
                                     @RequestParam Long bookId) throws Exception {

        List<String> roles = jwt.getClaimAsStringList("https://salaheddine-library.com/roles");
        String admin = roles != null && !roles.isEmpty() ? roles.get(0) : null;

        if (admin == null || !admin.equals("admin")) {
            throw new Exception("Administration page only");
        }
        adminService.increaseBookQuantity(bookId);
    }

    @PutMapping("/secure/decrease/book/quantity")
    public void decreaseBookQuantity(@AuthenticationPrincipal Jwt jwt,
                                     @RequestParam Long bookId) throws Exception {
        List<String> roles = jwt.getClaimAsStringList("https://salaheddine-library.com/roles");
        String admin = roles != null && !roles.isEmpty() ? roles.get(0) : null;

        if (admin == null || !admin.equals("admin")) {
            throw new Exception("Administration page only");
        }
        adminService.decreaseBookQuantity(bookId);
    }

    @PostMapping("/secure/add/book")
    public void postBook(@AuthenticationPrincipal Jwt jwt,
                         @RequestBody AddBookRequest addBookRequest) throws Exception {
        List<String> roles = jwt.getClaimAsStringList("https://salaheddine-library.com/roles");
        String admin = roles != null && !roles.isEmpty() ? roles.get(0) : null;

        if (admin == null || !admin.equals("admin")) {
            throw new Exception("Administration page only");
        }
        adminService.postBook(addBookRequest);
    }

    @DeleteMapping("/secure/delete/book")
    public void deleteBook(@AuthenticationPrincipal Jwt jwt,
                           @RequestParam Long bookId) throws Exception {
        List<String> roles = jwt.getClaimAsStringList("https://salaheddine-library.com/roles");
        String admin = roles != null && !roles.isEmpty() ? roles.get(0) : null;

        if (admin == null || !admin.equals("admin")) {
            throw new Exception("Administration page only");
        }
        adminService.deleteBook(bookId);
    }

}
