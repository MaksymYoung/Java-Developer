package it.dan.userprofile.config;

import io.minio.MinioClient;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import it.dan.userprofile.security.JwtTokenFilter;
import it.dan.userprofile.security.JwtTokenProvider;
import it.dan.userprofile.utility.MinioProperties;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor(onConstructor = @__(@Lazy))
public class ApplicationConfig {

    private final JwtTokenProvider tokenProvider;
    private final MinioProperties minioProperties;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    @SneakyThrows
    public SecurityFilterChain filterChain(
            final HttpSecurity httpSecurity
    ) {
        httpSecurity
                .csrf(AbstractHttpConfigurer::disable)
                .cors(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable)
                .sessionManagement(sessionManagement ->
                        sessionManagement
                                .sessionCreationPolicy(
                                        SessionCreationPolicy.STATELESS
                                )
                )
                .exceptionHandling(configurer ->
                        configurer.authenticationEntryPoint(
                                        (request, response, exception) -> {
                                            response.setStatus(
                                                    HttpStatus.UNAUTHORIZED
                                                            .value()
                                            );
                                            response.getWriter()
                                                    .write("Unauthorized.");
                                        })
                                .accessDeniedHandler(
                                        (request, response, exception) -> {
                                            response.setStatus(
                                                    HttpStatus.FORBIDDEN
                                                            .value()
                                            );
                                            response.getWriter()
                                                    .write("Unauthorized.");
                                        }))
                .authorizeHttpRequests(configurer ->
                        configurer
                                .requestMatchers("/swagger-ui/**", "/actuator/**")
                                .permitAll()
                                .requestMatchers("/v3/api-docs/**")
                                .permitAll()
                                .requestMatchers("/actuator/**")
                                .permitAll()
                                .anyRequest().authenticated())
                .anonymous(AbstractHttpConfigurer::disable)
                .addFilterBefore(new JwtTokenFilter(tokenProvider),
                        UsernamePasswordAuthenticationFilter.class);
        System.out.println();

        return httpSecurity.build();
    }

    @Bean
    public MinioClient minioClient() {
        return MinioClient.builder()
                .endpoint(minioProperties.getUrl())
                .credentials(minioProperties.getAccessKey(),
                        minioProperties.getSecretKey())
                .build();
    }

    @Bean
    public OpenAPI springShopOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("User Profile Service")
                        .description("Social Network Information System sample application")
                        .version("v0.0.1")
                        .license(new License().name("Apache 2.0").url("http://springdoc.org"))
                        .description("SpringShop Wiki Documentation")
                        .contact(new Contact().email("test@test.com").url("http://fullstackcode.dev")))
                .components(new Components().addSecuritySchemes("bearer-jwt",
                        new SecurityScheme().type(SecurityScheme.Type.HTTP).scheme("bearer").bearerFormat("JWT")
                                .in(SecurityScheme.In.HEADER).name("Authorization")))
                .info(new Info().title("App API").version("snapshot"))
                .addSecurityItem(
                        new SecurityRequirement().addList("bearer-jwt", Arrays.asList("read", "write")));
    }
}
