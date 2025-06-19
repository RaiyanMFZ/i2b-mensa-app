package com.mensa.Service;

import org.springframework.stereotype.Service;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.mensa.User;
import com.mensa.repository.UserRepository;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

@Service
public class AuthService {
    @Autowired
    private UserRepository UserRepository;
    
    @Autowired
    private PasswordEncoder PasswordEncoder;

    @Autowired
    private SessionService sessionService;

    public ResponseEntity<String> register(User user) {
        user.setPassword(PasswordEncoder.encode(user.getPassword()));
        UserRepository.registerUser(user);
        return ResponseEntity.ok().body("User has been registered");
    }

    public ResponseEntity<String> login(User user, HttpServletResponse response) {
        Optional<User> optionalUser = UserRepository.findByUsername(user.getUsername());
        if (!optionalUser.isPresent()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
        }

        User dbUser = optionalUser.get();
        if (!PasswordEncoder.matches(user.getPassword(), dbUser.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Credentials");
        }

        Cookie cookie = sessionService.createSession(user.getUsername());
        response.addCookie(cookie);

        return ResponseEntity.ok("Login successful");
    }
}