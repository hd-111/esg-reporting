package com.esg.esg_reporting.config;

import java.util.List;

import lombok.RequiredArgsConstructor;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final UserDetailsService userDetailsService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)
            throws Exception {

        http
            .cors(Customizer.withDefaults())

            .csrf(csrf -> csrf.disable())

            .authenticationProvider(authenticationProvider())

            .authorizeHttpRequests(auth -> auth

                // Public registration
                .requestMatchers("/api/auth/register").permitAll()

                // Only ADMIN can manage users
                .requestMatchers("/api/auth/users/**")
                .hasRole("ADMIN")

                // Only ADMIN can manage organizations
                .requestMatchers(
                    "/api/organizations",
                    "/api/organizations/**"
                ).hasRole("ADMIN")

                // Metric entries: ADMIN and DATA_ENTRY
                .requestMatchers(
                    "/api/metric-entries",
                    "/api/metric-entries/**"
                ).hasAnyRole("ADMIN", "DATA_ENTRY")

                // Reviews: ADMIN and REVIEWER
                .requestMatchers(
                    "/api/reviews",
                    "/api/reviews/**"
                ).hasAnyRole("ADMIN", "REVIEWER")

                // Only ADMIN can create facilities
                .requestMatchers(
                    HttpMethod.POST,
                    "/api/facilities",
                    "/api/facilities/**"
                ).hasRole("ADMIN")

                // Only ADMIN can update facilities
                .requestMatchers(
                    HttpMethod.PUT,
                    "/api/facilities",
                    "/api/facilities/**"
                ).hasRole("ADMIN")

                // Only ADMIN can delete facilities
                .requestMatchers(
                    HttpMethod.DELETE,
                    "/api/facilities",
                    "/api/facilities/**"
                ).hasRole("ADMIN")

                // Allowed roles can read facilities
                .requestMatchers(
                    HttpMethod.GET,
                    "/api/facilities",
                    "/api/facilities/**"
                ).hasAnyRole("ADMIN", "DATA_ENTRY", "REVIEWER")

                // Other API endpoints
                .requestMatchers("/api/**")
                .hasAnyRole("ADMIN", "DATA_ENTRY", "REVIEWER")

                // All other requests require authentication
                .anyRequest().authenticated()
            )

            // HTTP Basic authentication
            .httpBasic(Customizer.withDefaults());

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(
            List.of("http://localhost:5173")
        );

        configuration.setAllowedMethods(
            List.of(
                "GET",
                "POST",
                "PUT",
                "PATCH",
                "DELETE",
                "OPTIONS"
            )
        );

        configuration.setAllowedHeaders(
            List.of(
                "Authorization",
                "Content-Type",
                "Accept"
            )
        );

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
            new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", configuration);

        return source;
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {

        DaoAuthenticationProvider provider =
            new DaoAuthenticationProvider(userDetailsService);

        provider.setPasswordEncoder(passwordEncoder());

        return provider;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {

        return new BCryptPasswordEncoder();
    }
}