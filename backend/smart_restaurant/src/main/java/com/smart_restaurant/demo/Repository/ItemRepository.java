package com.smart_restaurant.demo.Repository;

import com.smart_restaurant.demo.entity.Category;
import com.smart_restaurant.demo.entity.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ItemRepository extends JpaRepository<Item,Integer> {
    boolean existsByItemNameAndCategoryIn(String itemName, List<Category> category);
    boolean existsByItemNameAndCategoryInAndItemIdNot( String itemName,
                                                       List<Category> category,
                                                       Integer itemId);

    @Query("SELECT DISTINCT i FROM Item i " +
            "JOIN i.category c " +
            "WHERE c.tenant.tenantId = :tenantId")
    List<Item> findAllByTenantId(@Param("tenantId") Integer tenantId);


}
