package com.neobank.banking.controller;

import com.neobank.banking.model.Account;
import com.neobank.banking.model.Transaction;
import com.neobank.banking.repository.TransactionRepository;
import com.neobank.banking.service.AccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
public class AccountController {

    private final AccountService accountService;
    private final TransactionRepository transactionRepository;

    @GetMapping
    public ResponseEntity<List<Account>> getMyAccounts(Authentication auth) {
        return ResponseEntity.ok(accountService.getUserAccounts(auth.getName()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Account> getAccount(@PathVariable String id) {
        return ResponseEntity.ok(accountService.getAccountById(id));
    }

    @PostMapping
    public ResponseEntity<Account> createAccount(Authentication auth, @RequestBody Account account) {
    return ResponseEntity.ok(accountService.createAccount(auth.getName(), account));
}

  @GetMapping("/{id}/transactions")
public ResponseEntity<List<Transaction>> getTransactions(@PathVariable String id) {
    return ResponseEntity.ok(transactionRepository.findByAccountId(id));
}

@GetMapping("/{id}/statement")
public ResponseEntity<List<Transaction>> downloadStatement(@PathVariable String id) {
    return ResponseEntity.ok(transactionRepository.findByAccountId(id));
}

}