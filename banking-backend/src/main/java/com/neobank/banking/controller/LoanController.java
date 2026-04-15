package com.neobank.banking.controller;

import com.neobank.banking.model.Loan;
import com.neobank.banking.service.LoanService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/loans")
@RequiredArgsConstructor
public class LoanController {

    private final LoanService loanService;

    @PostMapping
public ResponseEntity<Loan> applyLoan(
        Authentication auth,
        @RequestBody Map<String, Object> body
) {
    Double amount = Double.valueOf(body.get("amount").toString());
    String type = body.get("type").toString();

    return ResponseEntity.ok(
        loanService.applyLoan(auth.getName(), amount, type)
    );
}

@GetMapping
public ResponseEntity<List<Loan>> getLoans(Authentication auth) {
    return ResponseEntity.ok(loanService.getUserLoans(auth.getName()));
}
}