package com.neobank.banking.service;

import com.neobank.banking.dto.TransferRequest;
import com.neobank.banking.model.Account;
import com.neobank.banking.model.Transaction;
import com.neobank.banking.model.User;
import com.neobank.banking.repository.AccountRepository;
import com.neobank.banking.repository.TransactionRepository;
import com.neobank.banking.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final AccountRepository accountRepository;
    private final UserRepository userRepository;

    public List<Transaction> getUserTransactions(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return transactionRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
    }

    public Transaction transfer(String email, TransferRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Account fromAccount = accountRepository.findById(request.getFromAccountId())
                .orElseThrow(() -> new RuntimeException("Source account not found"));

        Account toAccount = accountRepository.findByAccountNumber(request.getToAccountNumber())
                .orElseThrow(() -> new RuntimeException("Destination account not found"));

        if (!fromAccount.getUserId().equals(user.getId()))
            throw new RuntimeException("Unauthorized");
        if (fromAccount.getId().equals(toAccount.getId()))
        throw new RuntimeException("Cannot transfer to the same account");

        if (request.getAmount() < 1)
        throw new RuntimeException("Minimum transfer amount is ₹1");

        if (fromAccount.getBalance() < request.getAmount())
            throw new RuntimeException("Insufficient balance");

        fromAccount.setBalance(fromAccount.getBalance() - request.getAmount());
        toAccount.setBalance(toAccount.getBalance() + request.getAmount());
        accountRepository.save(fromAccount);
        accountRepository.save(toAccount);

        String refNumber = "TXN" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

Transaction debitTxn = new Transaction();
debitTxn.setAccountId(fromAccount.getId());
debitTxn.setUserId(user.getId());
debitTxn.setType("debit");
debitTxn.setAmount(request.getAmount());
debitTxn.setBalanceAfter(fromAccount.getBalance());
debitTxn.setDescription(request.getDescription() != null ? request.getDescription() : "Fund transfer");
debitTxn.setCategory("Transfer");
debitTxn.setReferenceNumber(refNumber);
transactionRepository.save(debitTxn);

Transaction creditTxn = new Transaction();
creditTxn.setAccountId(toAccount.getId());
creditTxn.setUserId(toAccount.getUserId());
creditTxn.setType("credit");
creditTxn.setAmount(request.getAmount());
creditTxn.setBalanceAfter(toAccount.getBalance());
creditTxn.setDescription("Received: " + (request.getDescription() != null ? request.getDescription() : "Fund transfer"));
creditTxn.setCategory("Transfer");
creditTxn.setReferenceNumber(refNumber);
transactionRepository.save(creditTxn);

return debitTxn;
    }
}