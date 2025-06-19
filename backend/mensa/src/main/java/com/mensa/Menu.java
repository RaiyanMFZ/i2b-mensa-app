package com.mensa;

public class Menu {
    private int id;
    private String name, description, allergen;
    private Boolean available;
    private Float price;

    public Menu() {}

    public Menu(int id, String name, String description, Boolean available, Float price, String allergen) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.available = available;
        this.price = price;
        this.allergen = allergen;
    }

    
    // Getters
    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public Boolean getAvailable() {
        return available;
    }

    public Float getPrice() {
        return price;
    }

    public String getAllergen() {
        return allergen;
    }

    // Setters
    public void setId(int id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setAvailable(Boolean available) {
        this.available = available;
    }

    public void setPrice(Float price) {
        this.price = price;
    }

    public void setAllergen(String allergen) {
        this.allergen = allergen;
    }
}
