package com.neobank.banking.service;

import com.neobank.banking.dto.AuthResponse;
import com.neobank.banking.dto.LoginRequest;
import com.neobank.banking.dto.RegisterRequest;
import com.neobank.banking.model.Account;
import com.neobank.banking.model.User;
import com.neobank.banking.repository.AccountRepository;
import com.neobank.banking.repository.UserRepository;
import com.neobank.banking.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail()))
            throw new RuntimeException("Email already registered");

        if (userRepository.existsByPhone(request.getPhone()))
            throw new RuntimeException("Phone already registered");

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        User savedUser = userRepository.save(user);

        Account account = new Account();
        account.setUserId(savedUser.getId());
        account.setAccountNumber(generateAccountNumber());
        account.setAccountType("Savings Account");
        account.setBalance(1000.0);
        accountRepository.save(account);

        String token = jwtUtil.generateToken(savedUser.getEmail());
        return buildResponse(savedUser, token);
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword()))
            throw new RuntimeException("Invalid email or password");

        String token = jwtUtil.generateToken(user.getEmail());
        return buildResponse(user, token);
    }

    private AuthResponse buildResponse(User user, String token) {
        AuthResponse.UserDto userDto = new AuthResponse.UserDto(
                user.getId(), user.getName(),
                user.getEmail(), user.getPhone(), user.getRole()
        );
        return new AuthResponse(token, userDto);
    }

    private String generateAccountNumber() {
        Random random = new Random();
        String number;
        do {
            number = String.format("%016d", (long)(random.nextDouble() * 9999999999999999L));
        } while (accountRepository.existsByAccountNumber(number));
        return number;
    }
}