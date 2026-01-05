package com.smart_restaurant.demo.Repository;

import com.smart_restaurant.demo.entity.Status;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StatusRepository extends JpaRepository<Status, Integer> {

}
