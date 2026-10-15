package com.esg.esg_reporting.service;

import java.util.List;
import java.util.Locale;
import java.util.Set;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.esg.esg_reporting.entity.AppUser;
import com.esg.esg_reporting.repository.AppUserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AppUserService {

    private final AppUserRepository appUserRepository;
    private final PasswordEncoder passwordEncoder;

    private static final Set<String> ALLOWED_ROLES =
            Set.of("ADMIN", "DATA_ENTRY", "REVIEWER");

    public List<AppUser> getAllUsers() {
        return appUserRepository.findAll();
    }

    public AppUser getUserById(Long id) {
        return appUserRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));
    }

    @Transactional
    public AppUser registerUser(AppUser appUser) {

        if (appUser.getUsername() == null
                || appUser.getUsername().isBlank()) {
            throw new IllegalArgumentException(
                    "Username is required");
        }

        if (appUser.getPassword() == null
                || appUser.getPassword().isBlank()) {
            throw new IllegalArgumentException(
                    "Password is required");
        }

        String username = appUser.getUsername().trim();

        if (appUserRepository.existsByUsername(username)) {
            throw new IllegalArgumentException(
                    "Username already exists");
        }

        appUser.setUsername(username);
        appUser.setRole("DATA_ENTRY");
        appUser.setPassword(
                passwordEncoder.encode(appUser.getPassword())
        );

        return appUserRepository.save(appUser);
    }

    @Transactional
    public AppUser updateUserRole(Long id, String role) {

        if (role == null) {
            throw new IllegalArgumentException(
                    "Role is required");
        }

        String normalizedRole =
                role.trim().toUpperCase(Locale.ROOT);

        if (!ALLOWED_ROLES.contains(normalizedRole)) {
            throw new IllegalArgumentException(
                    "Invalid role. Use ADMIN, DATA_ENTRY, or REVIEWER");
        }

        AppUser user = appUserRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        user.setRole(normalizedRole);

        return appUserRepository.save(user);
    }

    @Transactional
    public void deleteUser(Long id) {

        AppUser user = appUserRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        appUserRepository.delete(user);
    }
}