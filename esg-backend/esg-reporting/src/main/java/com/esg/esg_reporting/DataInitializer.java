package com.esg.esg_reporting;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.esg.esg_reporting.entity.AppUser;
import com.esg.esg_reporting.repository.AppUserRepository;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initializeAdmin(
            AppUserRepository appUserRepository,
            PasswordEncoder passwordEncoder) {

        return args -> {

            if (appUserRepository.findByUsername("admin").isEmpty()) {

                AppUser admin = new AppUser();

                admin.setUsername("admin");
                admin.setPassword(passwordEncoder.encode("Admin@123"));
                admin.setRole("ADMIN");

                appUserRepository.save(admin);

                System.out.println("Admin account created successfully!");
            } else {
                System.out.println("Admin account already exists.");
            }
        };
    }
}