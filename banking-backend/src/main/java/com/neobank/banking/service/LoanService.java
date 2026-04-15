package com.neobank.banking.service;

import com.neobank.banking.model.Loan;
import com.neobank.banking.model.User;
import com.neobank.banking.repository.LoanRepository;
import com.neobank.banking.repository.UserRepository;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LoanService {

    private final LoanRepository loanRepository;
    private final UserRepository userRepository;

    public Loan applyLoan(String email, Double amount, String type) {
    User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

    Loan loan = new Loan();
    loan.setUserId(user.getId());
    loan.setAmount(amount);
    loan.setType(type);
    loan.setStatus("PENDING");

    return loanRepository.save(loan);
}

public List<Loan> getUserLoans(String email) {
    User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

    return loanRepository.findByUserId(user.getId());
}
}