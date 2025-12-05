package com.smart_restaurant.demo.Repository;

import com.smart_restaurant.demo.entity.Item;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ItemRepository extends JpaRepository<Item,Integer> {
}
