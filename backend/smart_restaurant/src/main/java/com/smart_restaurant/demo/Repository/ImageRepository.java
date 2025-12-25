package com.smart_restaurant.demo.Repository;


import com.smart_restaurant.demo.entity.Image;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ImageRepository extends JpaRepository<Image,Integer> {
    List<Image> findAllByItem_ItemId(Integer itemId);
}
