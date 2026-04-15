package com.neobank.banking.repository;

import com.neobank.banking.model.Loan;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface LoanRepository extends MongoRepository<Loan, String> {
    List<Loan> findByUserId(String userId);
}