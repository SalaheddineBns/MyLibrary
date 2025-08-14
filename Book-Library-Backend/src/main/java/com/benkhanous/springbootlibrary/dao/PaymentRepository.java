package com.benkhanous.springbootlibrary.dao;


import com.benkhanous.springbootlibrary.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
        Payment findByUserEmail(String userEmail);
}
