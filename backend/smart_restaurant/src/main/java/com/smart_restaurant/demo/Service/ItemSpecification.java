package com.smart_restaurant.demo.Service;

import com.smart_restaurant.demo.entity.Category;
import com.smart_restaurant.demo.entity.Item;
import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;

public class ItemSpecification {

    public static Specification<Item> filter(
            String name,
            Integer categoryId,
            Boolean status
    ) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();


            if (name != null && !name.isBlank()) {
                predicates.add(
                        cb.like(
                                cb.lower(root.get("itemName")),
                                "%" + name.toLowerCase() + "%"
                        )
                );
            }

            // 🔗 filter theo category (ManyToMany → JOIN)
            if (categoryId != null) {
                Join<Item, Category> categoryJoin =
                        root.join("category", JoinType.INNER);

                predicates.add(
                        cb.equal(categoryJoin.get("id"), categoryId)
                );

                // tránh duplicate item
                query.distinct(true);
            }


            if (status != null) {
                predicates.add(
                        cb.equal(root.get("status"), status)
                );
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
