package com.benkhanous.springbootlibrary.service;

import com.benkhanous.springbootlibrary.dao.BookRepository;
import com.benkhanous.springbootlibrary.dao.ReviewRepository;
import com.benkhanous.springbootlibrary.entity.Review;
import com.benkhanous.springbootlibrary.requestmodels.ReviewRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Date;
import java.time.LocalDate;

@Service
@Transactional
public class ReviewService {

    private ReviewRepository reviewRepository;


    @Autowired
    public ReviewService(BookRepository bookRepository, ReviewRepository reviewRepository) {

        this.reviewRepository = reviewRepository;
    }

    public void postReview(String userEmail, ReviewRequest reviewRequest) throws Exception {
        Review validateReview=reviewRepository.findByUserEmailAndBookId(userEmail,reviewRequest.getBookId());
        if(validateReview !=null){
            throw new Exception("Review already created");
        }
        Review review=new Review();
        review.setBookId(reviewRequest.getBookId());
        review.setRating(reviewRequest.getRating());
        review.setUserEmail(userEmail);
        review.setDate(Date.valueOf(LocalDate.now()));
        if (reviewRequest.getReviewDescription().isPresent())
        review.setReviewDescription(reviewRequest.getReviewDescription().map(
                Object::toString
        ).orElse(null));
        reviewRepository.save(review);
    }

    public boolean userReviewListed(String userEmail,Long bookId){
        Review validateReview=reviewRepository.findByUserEmailAndBookId(userEmail,bookId);
        if(validateReview!=null){
            return true;
        }else{
            return false;
        }
    }
}
