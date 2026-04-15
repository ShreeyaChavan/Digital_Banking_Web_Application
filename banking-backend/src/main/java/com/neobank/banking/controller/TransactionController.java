package com.neobank.banking.controller;

import com.neobank.banking.dto.TransferRequest;
import com.neobank.banking.model.Transaction;
import com.neobank.banking.service.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    @GetMapping
    public ResponseEntity<List<Transaction>> getMyTransactions(Authentication auth) {
        return ResponseEntity.ok(transactionService.getUserTransactions(auth.getName()));
    }

    @PostMapping("/transfer")
    public ResponseEntity<Transaction> transfer(
            Authentication auth,
            @Valid @RequestBody TransferRequest request) {
        return ResponseEntity.ok(transactionService.transfer(auth.getName(), request));
    }

    
}