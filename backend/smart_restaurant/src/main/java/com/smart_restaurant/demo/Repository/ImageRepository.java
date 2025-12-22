package com.smart_restaurant.demo.Repository;


import com.smart_restaurant.demo.entity.Image;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ImageRepository extends JpaRepository<Image,Integer> {
}
