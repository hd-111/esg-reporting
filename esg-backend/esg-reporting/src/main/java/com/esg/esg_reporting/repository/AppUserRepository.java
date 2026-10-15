package com.esg.esg_reporting.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.esg.esg_reporting.entity.AppUser;

public interface AppUserRepository extends JpaRepository<AppUser, Long> {

    Optional<AppUser> findByUsername(String username);

    boolean existsByUsername(String username);
}