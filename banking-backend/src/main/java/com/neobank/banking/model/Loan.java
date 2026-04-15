package com.neobank.banking.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "loans")
public class Loan {

    @Id
    private String id;
    private String type;
    private String userId;
    private Double amount;
    private String status = "PENDING";
}