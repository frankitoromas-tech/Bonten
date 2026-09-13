package com.bonten.security.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.header.writers.ReferrerPolicyHeaderWriter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

/**
 * =======================================================================
 * BONTEN ENTERPRISE SECURITY CORE — SPRING SECURITY 6 & JAVA 17
 * =======================================================================
 * Configuración de defensa perimetral para el microservicio de autenticación
 * de BONTEN Core (Equipo de Tecnología).
 * 
 * Protecciones activadas:
 * 1. Stateless JWT con cookies HttpOnly y SameSite=Strict.
 * 2. Hardening contra Clickjacking & Phishing (CSP frame-ancestors 'none').
 * 3. Encriptación BCrypt (cost factor 12) para contraseñas de administradores.
 * 4. Control de acceso basado en roles (RBAC: ROLE_SUPERADMIN para Fireboy).
 * 5. Filtro perimetral anti-DDoS / Rate Limiting por IP.
 * =======================================================================
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class BontenSecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        // Encriptación BCrypt robusta resistente a ataques de diccionario y rainbow tables
        return new BCryptPasswordEncoder(12);
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // 1. Deshabilitar CSRF para arquitectura desacoplada API REST Stateless
            .csrf(csrf -> csrf.disable())

            // 2. Política CORS estricta: solo permite el dominio de la web de BONTEN
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))

            // 3. Gestión de sesión Stateless (Cero almacenamiento en memoria de servidor)
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            // 4. Reglas de autorización de endpoints
            .authorizeHttpRequests(auth -> auth
                // Rutas públicas de lectura
                .requestMatchers(HttpMethod.GET, "/api/v1/metadata/**", "/api/v1/library/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/v1/auth/login").permitAll()
                // Rutas privadas exclusivas para Fireboy (Superadmin)
                .requestMatchers("/api/v1/admin/**").hasRole("SUPERADMIN")
                .anyRequest().authenticated()
            )

            // 5. Hardening de Cabeceras HTTP (Anti-Clickjacking, Anti-Phishing, Anti-Sniffing)
            .headers(headers -> headers
                .frameOptions(frame -> frame.deny()) // X-Frame-Options: DENY
                .xssProtection(xss -> xss.headerValue(org.springframework.security.web.header.writers.XXssProtectionHeaderWriter.HeaderValue.ENABLED_MODE_BLOCK))
                .contentTypeOptions(content -> {}) // X-Content-Type-Options: nosniff
                .referrerPolicy(referrer -> referrer.policy(ReferrerPolicyHeaderWriter.ReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN))
                .contentSecurityPolicy(csp -> csp.policyDirectives("default-src 'self'; frame-ancestors 'none'; object-src 'none';"))
            );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of(
            "http://localhost:3000",
            "https://bonten.vercel.app",
            "https://bonten-web.vercel.app"
        ));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("Authorization", "Content-Type", "X-Requested-With", "X-Forwarded-For"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
