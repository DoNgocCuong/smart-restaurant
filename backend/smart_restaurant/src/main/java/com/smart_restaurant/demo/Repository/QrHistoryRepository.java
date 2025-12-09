package com.smart_restaurant.demo.Repository;

import com.smart_restaurant.demo.entity.QrHistory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QrHistoryRepository extends JpaRepository<QrHistory,Integer> {
}
