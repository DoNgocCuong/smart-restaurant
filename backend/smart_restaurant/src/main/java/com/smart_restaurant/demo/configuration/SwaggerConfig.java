package com.smart_restaurant.demo.configuration;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.ExternalDocumentation;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {
    @Bean
    public OpenAPI customOpenAPI() {
        SecurityScheme securityScheme = new SecurityScheme()
                .type(SecurityScheme.Type.HTTP)
                .scheme("bearer")
                .bearerFormat("JWT")
                .description("JWT Bearer Token");

        SecurityRequirement securityRequirement = new SecurityRequirement().addList("Bearer Authentication");

        return new OpenAPI()
                .info(
                        new Info()
                                .title("Smart Restaurant API")
                                .version("1.0.0")
                                .description("This is a Spring Boot Smart Restaurant API")
                                .license(new License().name("Apache 2.0").url("http://springdoc.org"))
                                .contact(
                                        new Contact()
                                                .name("Do Ngoc Cuong")
                                                .email("cuong01656499081@gmail.com")
                                                .url("https://github.com/DoNgocCuong")
                                )
                )
                .externalDocs(
                        new ExternalDocumentation()
                                .description("Project documentation")
                                .url("https://github.com/DoNgocCuong/smart-restaurant")
                )
                .components(
                        new Components()
                                .addSecuritySchemes("Bearer Authentication", securityScheme)
                )
                .addSecurityItem(securityRequirement);
    }
}
