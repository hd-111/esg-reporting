package com.esg.esg_reporting.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.esg.esg_reporting.entity.AppUser;
import com.esg.esg_reporting.service.AppUserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AuthController {

    private final AppUserService appUserService;

    // Register a user
    @PostMapping("/auth/register")
    public AppUser registerUser(@RequestBody AppUser appUser) {

        try {
            return appUserService.registerUser(appUser);
        } catch (IllegalArgumentException exception) {

            HttpStatus status =
                    "Username already exists".equals(exception.getMessage())
                            ? HttpStatus.CONFLICT
                            : HttpStatus.BAD_REQUEST;

            throw new ResponseStatusException(
                    status,
                    exception.getMessage()
            );
        }
    }

    // Get all users
    @GetMapping("/users")
    public List<AppUser> getAllUsers() {
        return appUserService.getAllUsers();
    }

    // Get a user by ID
    @GetMapping("/users/{id}")
    public AppUser getUserById(@PathVariable Long id) {

        try {
            return appUserService.getUserById(id);
        } catch (RuntimeException exception) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "User not found"
            );
        }
    }

    // Update a user's role
    @PutMapping("/auth/users/{id}/role")
    public AppUser updateUserRole(
            @PathVariable Long id,
            @RequestBody RoleUpdateRequest request) {

        try {
            return appUserService.updateUserRole(
                    id,
                    request.getRole()
            );
        } catch (IllegalArgumentException exception) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    exception.getMessage()
            );
        } catch (RuntimeException exception) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "User not found"
            );
        }
    }

    // Delete a user
    @DeleteMapping("/users/{id}")
    public void deleteUser(@PathVariable Long id) {

        try {
            appUserService.deleteUser(id);
        } catch (RuntimeException exception) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "User not found"
            );
        }
    }

    public static class RoleUpdateRequest {

        private String role;

        public String getRole() {
            return role;
        }

        public void setRole(String role) {
            this.role = role;
        }
    }
}