package com.mensa.repository;

import com.mensa.Menu;
import org.springframework.jdbc.core.RowMapper;
import java.sql.ResultSet;
import java.sql.SQLException;

public class MenuRowMapper implements RowMapper<Menu> {
    @Override
    public Menu mapRow(ResultSet rs, int rowNum) throws SQLException {
        Menu menu = new Menu();

        menu.setId(rs.getInt("id"));
        menu.setName(rs.getString("name"));
        menu.setDescription(rs.getString("description"));
        menu.setPrice(rs.getFloat("price"));
        menu.setAvailable(rs.getBoolean("available"));
        menu.setAllergen(rs.getString("allergen"));

        return menu;
    }
}