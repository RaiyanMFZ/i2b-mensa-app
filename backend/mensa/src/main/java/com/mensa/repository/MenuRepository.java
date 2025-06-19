package com.mensa.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;

import com.mensa.Menu;

import java.util.Optional;
import java.util.List;

@Repository
public class MenuRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    
    public Optional<List<Menu>> getAllMenu() {
        String query = """
            SELECT id, name, description, price, available, allergen
            FROM products
            ORDER BY id;
        """;

        try {
            List<Menu> menus = jdbcTemplate.query(query, new MenuRowMapper());
            return Optional.of(menus);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

        public Optional<List<Menu>> getAvailableMenu() {
        String query = """
            SELECT id, name, description, price, available, allergen
            FROM products
            WHERE available = true
            ORDER BY id;
        """;

        try {
            List<Menu> menus = jdbcTemplate.query(query, new MenuRowMapper());
            return Optional.of(menus);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }
}
