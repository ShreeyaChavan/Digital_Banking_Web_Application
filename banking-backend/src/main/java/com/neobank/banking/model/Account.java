package com.neobank.banking.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "accounts")
public class Account {
    @Id
    private String id;

    private String userId;
    private String accountNumber;
    private String accountType;
    private Double balance = 0.0;
    private String ifscCode = "NEOB0001234";
    private String branch = "Pune Main";
    private String status = "Active";
    private LocalDateTime createdAt = LocalDateTime.now();
}