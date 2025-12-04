package com.smart_restaurant.demo.Repository;


import com.smart_restaurant.demo.entity.InvalidatedToken;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InvalidatedTokenRepository extends JpaRepository<InvalidatedToken,String> {
}
