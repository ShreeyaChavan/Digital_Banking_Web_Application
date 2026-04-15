package com.neobank.banking.service;

import com.neobank.banking.model.Account;
import com.neobank.banking.model.User;
import com.neobank.banking.repository.AccountRepository;
import com.neobank.banking.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AccountService {

    private final AccountRepository accountRepository;
    private final UserRepository userRepository;

    public List<Account> getUserAccounts(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return accountRepository.findByUserId(user.getId());
    }

    public Account getAccountById(String accountId) {
        return accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));
    }

    public Account createAccount(String email, Account account) {
    User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

    account.setUserId(user.getId());
    account.setAccountNumber(String.valueOf(System.currentTimeMillis())); // simple generator
    account.setBalance(0.0);
    account.setStatus("Active");

    return accountRepository.save(account);
}
}