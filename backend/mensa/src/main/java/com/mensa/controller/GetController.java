package com.mensa.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mensa.repository.MenuRepository;
import com.mensa.Menu;

import java.util.List;
import java.util.Optional;


@RestController
public class GetController {

    @Autowired
    private MenuRepository menuRepository;  


    @GetMapping("/menu")
    public Optional<List<Menu>> getMenu() {
        Optional<List<Menu>> menu = menuRepository.getAllMenu();
        return menu;
    }

    @GetMapping("/menuavailable")
    public Optional<List<Menu>> getAvailable() {
        Optional<List<Menu>> menu = menuRepository.getAvailableMenu();
        return menu;
    }
}