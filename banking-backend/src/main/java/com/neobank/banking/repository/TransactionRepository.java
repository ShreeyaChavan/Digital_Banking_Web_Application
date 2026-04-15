package com.neobank.banking.repository;

import com.neobank.banking.model.Transaction;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface TransactionRepository extends MongoRepository<Transaction, String> {
    List<Transaction> findByAccountIdOrderByCreatedAtDesc(String accountId);
    List<Transaction> findByUserIdOrderByCreatedAtDesc(String userId);
    List<Transaction> findByAccountId(String accountId);

}