package com.esg.esg_reporting.service;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.esg.esg_reporting.entity.AppUser;
import com.esg.esg_reporting.repository.AppUserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final AppUserRepository appUserRepository;

    @Override
    public UserDetails loadUserByUsername(String username)
            throws UsernameNotFoundException {

        System.out.println("==================================");
        System.out.println("Spring Security login attempt");
        System.out.println("Username received: " + username);

        AppUser appUser = appUserRepository.findByUsername(username)
                .orElseThrow(() -> {
                    System.out.println("User not found in database!");
                    return new UsernameNotFoundException(
                            "User not found: " + username);
                });

        System.out.println("User found: " + appUser.getUsername());
        System.out.println("Role: " + appUser.getRole());

        boolean bcryptPassword = appUser.getPassword() != null
                && appUser.getPassword().matches("^\\$2[aby]\\$.*");

        System.out.println("Password appears BCrypt-encoded: " + bcryptPassword);
        System.out.println("==================================");

        return User.builder()
                .username(appUser.getUsername())
                .password(appUser.getPassword())
                .roles(appUser.getRole())
                .build();
    }
}