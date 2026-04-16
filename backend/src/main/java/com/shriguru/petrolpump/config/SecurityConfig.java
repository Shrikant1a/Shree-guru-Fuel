package com.shriguru.petrolpump.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.Customizer;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Disabled for local development/APIs
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/fuel/prices", "/api/requests/submit").permitAll() // Public access
                .anyRequest().permitAll() // Allow all for initial setup, change to .authenticated() for production
            )
            .httpBasic(Customizer.withDefaults());
        
        return http.build();
    }
}
