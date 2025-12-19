package com.smart_restaurant.demo.configuration;


import com.smart_restaurant.demo.Repository.AccountRepository;
import com.smart_restaurant.demo.Repository.PermissionRepository;
import com.smart_restaurant.demo.Repository.RoleRepository;
import com.smart_restaurant.demo.entity.Account;
import com.smart_restaurant.demo.entity.Role;
import com.smart_restaurant.demo.enums.Roles;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
@RequiredArgsConstructor
public class ApplicationInitConfig {
    RoleRepository roleRepository;
    PasswordEncoder passwordEncoder;
    PermissionRepository permissionRepository;
    @Bean
    ApplicationRunner applicationRunner(AccountRepository accountRepository){
        return args -> {
            if(accountRepository.findByUsername("superadmin").isEmpty()){
                var roles = new ArrayList<Role>();
                Optional<Role> role=roleRepository.findByName(Roles.SUPPER_ADMIN.toString());
                if((role.isEmpty())){
                    Role adminRole = roleRepository.save(Role.builder()
                            .name(Roles.SUPPER_ADMIN.toString())
                            .build());
                    roles.add(adminRole);
                }else{
                    roles.add(role.get());
                }
                Account account= Account.builder()
                        .username("superadmin")
                        .password(passwordEncoder.encode("superadmin"))
                        .isFirstActivity(false)
                        .isCustomer(false)
                        .isEmailVerify(true)
                        .roles(roles)
                        .build();
                accountRepository.save(account);
            }
        };
    }
}
