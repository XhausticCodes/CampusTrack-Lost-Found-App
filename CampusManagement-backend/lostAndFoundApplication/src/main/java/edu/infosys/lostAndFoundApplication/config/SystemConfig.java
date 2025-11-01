package edu.infosys.lostAndFoundApplication.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.logout.HttpStatusReturningLogoutSuccessHandler;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import jakarta.servlet.http.HttpServletResponse;

@Configuration
@EnableWebSecurity
public class SystemConfig {

    @Autowired
    private UserDetailsService userDetailsService;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.addAllowedOrigin("http://localhost:3939");
        configuration.addAllowedMethod("*");
        configuration.addAllowedHeader("*");
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .authenticationProvider(authenticationProvider())
            .securityContext(context ->
                context.securityContextRepository(new HttpSessionSecurityContextRepository())
            )
            .formLogin(form -> form
                .loginProcessingUrl("/lost-found/login")
                .usernameParameter("username")
                .passwordParameter("password")
                .successHandler(successHandler())
                .failureHandler(failureHandler())
                .permitAll()
            )
            .logout(logout -> logout
                .logoutUrl("/lost-found/logout")
                .logoutSuccessHandler(new HttpStatusReturningLogoutSuccessHandler(HttpStatus.OK))
                .deleteCookies("JSESSIONID")
                .invalidateHttpSession(true)
                .permitAll()
            )
            .exceptionHandling(e ->
                e.authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED))
            )
            .authorizeHttpRequests(authorize -> authorize
                // Public Endpoints
                .requestMatchers(HttpMethod.POST, "/lost-found/register").permitAll()
                .requestMatchers(HttpMethod.POST, "/lost-found/login").permitAll()
                .requestMatchers(HttpMethod.POST, "/lost-found/logout").permitAll()
                .requestMatchers("/ws/**").permitAll() // Allow WebSocket handshake

                // Authenticated User Details
                .requestMatchers(HttpMethod.GET, "/lost-found/user/details").authenticated()

                // Admin Endpoints
                .requestMatchers(HttpMethod.GET, "/lost-found/lost-items", "/lost-found/found-items").hasRole("ADMIN")
                .requestMatchers("/lost-found/admin/students", "/lost-found/admin/student/**").hasRole("ADMIN")

                // Student Endpoints
                .requestMatchers(HttpMethod.POST, "/lost-found/lost-items", "/lost-found/found-items").hasRole("STUDENT")
                .requestMatchers("/lost-found/lost-items/user", "/lost-found/found-items/user").hasRole("STUDENT")
                .requestMatchers("/lost-found/fuzzy/**").hasRole("STUDENT")
                .requestMatchers("/lost-found/lost-items/{id}", "/lost-found/found-items/{id}").hasRole("STUDENT")
                .requestMatchers(HttpMethod.DELETE, "/lost-found/lost-items/{id}").hasRole("STUDENT")

                .anyRequest().authenticated()
            );

        return http.build();
    }

    @Bean
    public AuthenticationSuccessHandler successHandler() {
        return (request, response, authentication) -> {
            String username = authentication.getName();
            String role = authentication.getAuthorities().stream()
                .findFirst()
                .map(grantedAuthority -> grantedAuthority.getAuthority().replace("ROLE_", ""))
                .orElse("USER");

            response.setStatus(HttpServletResponse.SC_OK);
            response.setContentType("application/json");
            // Updated to include username for chat display
            response.getWriter().write(String.format("{\"username\": \"%s\", \"role\": \"%s\"}", username, role));
            response.getWriter().flush();
        };
    }

    @Bean
    public AuthenticationFailureHandler failureHandler() {
        return (request, response, exception) -> {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\": \"Invalid Credentials\"}");
            response.getWriter().flush();
        };
    }
}