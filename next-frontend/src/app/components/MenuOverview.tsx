import React, { useState, useEffect } from "react";
import { ShoppingCart, Check, Image, Filter } from "lucide-react";
import Footer from "./Footer";
import Cart from "./Cart";
import { useCart } from "../context/CartContext";
import "./MenuOverview.css";

const getWeekdays = () => {
  const weekdays: Date[] = [];
  const today = new Date();
  const monday = new Date(today.setDate(today.getDate() - today.getDay() + 1));
  for (let i = 0; i < 5; i++) {
    const day = new Date(monday);
    day.setDate(monday.getDate() + i);
    weekdays.push(day);
  }
  return weekdays;
};

const shortWeekdays = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];

type Meal = {
  id?: number;
  name: string;
  description: string;
  price: string | number;
  image?: string;
  allergen?: string | null;
  calories?: number | null;
};

interface MenuOverviewProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const MenuOverview: React.FC<MenuOverviewProps> = ({
  isDarkMode,
  toggleDarkMode,
}) => {
  const weekdays = getWeekdays();
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const [allMeals, setAllMeals] = useState<Meal[]>([]);
  const [dailyMeals, setDailyMeals] = useState<Record<number, Meal[]>>({});
  const [buttonStates, setButtonStates] = useState<
    Record<string, "idle" | "loading" | "success">
  >({});
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedDietaryFilter, setSelectedDietaryFilter] = useState<string>("alle");
  const [showFilterMenu, setShowFilterMenu] = useState<boolean>(false);
  const { items, addItem, updateQuantity, removeItem } = useCart();

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      isDarkMode ? "dark" : "light"
    );
  }, [isDarkMode]);

  useEffect(() => {
    fetch('/testdata.json')
      .then((res) => res.json())
      .then((data) => {
        setAllMeals(data);

        const shuffled = [...data].sort(() => 0.5 - Math.random());
        const mealsPerDay: Record<number, Meal[]> = {};
        for (let i = 0; i < 5; i++) {
          mealsPerDay[i] = shuffled.slice(i * 2, i * 2 + 3);
        }
        setDailyMeals(mealsPerDay);
      })
      .catch((error) => {
        console.error("Fehler beim Laden der Speisekarte:", error);
      });
  }, []);

  const getDietaryPreferences = (meal: Meal): string[] => {
    const preferences: string[] = [];
    
    // Basierend auf Allergenen und Namen
    if (meal.allergen) {
      const allergens = meal.allergen.toLowerCase();
      
      // Vegan (keine tierischen Produkte)
      if (!allergens.includes('milch') && !allergens.includes('eier') && 
          !meal.name.toLowerCase().includes('fleisch') && 
          !meal.name.toLowerCase().includes('hähnchen') && 
          !meal.name.toLowerCase().includes('schnitzel') &&
          !meal.name.toLowerCase().includes('bolognese')) {
        preferences.push('vegan');
      }
      
      // Vegetarisch (kein Fleisch)
      if (!meal.name.toLowerCase().includes('fleisch') && 
          !meal.name.toLowerCase().includes('hähnchen') && 
          !meal.name.toLowerCase().includes('schnitzel') &&
          !meal.name.toLowerCase().includes('bolognese')) {
        preferences.push('vegetarisch');
      }
      
      // Glutenfrei
      if (!allergens.includes('gluten')) {
        preferences.push('glutenfrei');
      }
    } else {
      // Wenn keine Allergene angegeben sind, basierend auf Namen
      const name = meal.name.toLowerCase();
      if (!name.includes('fleisch') && !name.includes('hähnchen') && 
          !name.includes('schnitzel') && !name.includes('bolognese')) {
        preferences.push('vegetarisch');
        if (!name.includes('käse') && !name.includes('milch')) {
          preferences.push('vegan');
        }
      }
    }
    
    // Fleisch-Gerichte
    if (meal.name.toLowerCase().includes('fleisch') || 
        meal.name.toLowerCase().includes('hähnchen') || 
        meal.name.toLowerCase().includes('schnitzel') ||
        meal.name.toLowerCase().includes('bolognese')) {
      preferences.push('fleisch');
    }
    
    return preferences.length > 0 ? preferences : ['fleisch']; // Default
  };

  const getDietaryBadge = (preferences: string[]): string => {
    if (preferences.includes('vegan')) return '🌱 Vegan';
    if (preferences.includes('vegetarisch')) return '🥬 Vegetarisch';
    if (preferences.includes('glutenfrei')) return '🌾 Glutenfrei';
    return '🍖 Fleisch';
  };

  const filterMeals = (meals: Meal[]) => {
    if (selectedDietaryFilter === "alle") {
      return meals;
    }
    return meals.filter(meal => {
      const preferences = getDietaryPreferences(meal);
      return preferences.includes(selectedDietaryFilter);
    });
  };

  const handleImageError = (mealName: string) => {
    setImageErrors((prev) => ({ ...prev, [mealName]: true }));
  };

  const handleAddToCart = async (meal: Meal) => {
    const buttonId = `${meal.name}-${selectedDayIndex}`;

    // Set loading state
    setButtonStates((prev) => ({ ...prev, [buttonId]: "loading" }));

    // Add item to cart
    addItem({ name: meal.name, price: meal.price, quantity: 1 });

    // Set success state
    setButtonStates((prev) => ({ ...prev, [buttonId]: "success" }));

    // Reset to idle after 2 seconds
    setButtonStates(prev => ({ ...prev, [buttonId]: 'loading' }));
    await new Promise(resolve => setTimeout(resolve, 1000));
    setButtonStates(prev => ({ ...prev, [buttonId]: 'success' }));
    console.log("In den Warenkorb:", meal);
  };

  const getButtonContent = (meal: Meal) => {
    const buttonId = `${meal.name}-${selectedDayIndex}`;
    const state = buttonStates[buttonId] || "idle";

    switch (state) {
      case "loading":
        return (
          <>
            <span>Wird hinzugefügt...</span>
          </>
        );
      case "success":
        return (
          <>
            <Check size={16} />
            <span>Hinzugefügt!</span>
          </>
        );
      default:
        return (
          <>
            <ShoppingCart size={16} />
            <span>In den Warenkorb</span>
          </>
        );
    }
  };

  const dietaryOptions = [
    { value: "alle", label: "Alle Gerichte" },
    { value: "vegetarisch", label: "🥬 Vegetarisch" },
    { value: "vegan", label: "🌱 Vegan" },
    { value: "glutenfrei", label: "🌾 Glutenfrei" },
    { value: "fleisch", label: "🍖 Mit Fleisch" },
  ];

  return (
    <>
      <div className="menu-overview" data-theme={isDarkMode ? "dark" : "light"}>
        <div className="cart-button" onClick={() => setIsCartOpen(true)}>
          <ShoppingCart size={24} />
          {items.length > 0 && (
            <span className="cart-count">
              {items.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          )}
        </div>
        <div className="weekday-circles">
          {weekdays.map((date, index) => (
            <div
              key={index}
              className={`weekday-circle ${selectedDayIndex === index ? "active" : ""}`}
              onClick={() => setSelectedDayIndex(index)}
            >
              <div className="weekday">{shortWeekdays[date.getDay()]}</div>
              <div className="date">{date.toLocaleDateString("de-DE")}</div>
            </div>
          ))}
        </div>

        <div className="filter-section">
          <div className="filter-container">
            <button 
              className="filter-button"
              onClick={() => setShowFilterMenu(!showFilterMenu)}
            >
              <Filter size={16} />
              <span>Ernährungspräferenzen</span>
            </button>
            
            {showFilterMenu && (
              <div className="filter-dropdown">
                {dietaryOptions.map((option) => (
                  <button
                    key={option.value}
                    className={`filter-option ${selectedDietaryFilter === option.value ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedDietaryFilter(option.value);
                      setShowFilterMenu(false);
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {selectedDietaryFilter !== "alle" && (
            <div className="active-filter">
              <span>Aktiver Filter: {dietaryOptions.find(opt => opt.value === selectedDietaryFilter)?.label}</span>
              <button 
                className="clear-filter"
                onClick={() => setSelectedDietaryFilter("alle")}
              >
                ✕
              </button>
            </div>
          )}
        </div>

        <div className="day-section">
          <h2 className="day-heading">
            {shortWeekdays[weekdays[selectedDayIndex].getDay()]} –{" "}
            {weekdays[selectedDayIndex].toLocaleDateString("de-DE")}
          </h2>

          <div className="meal-grid">
            {filterMeals(dailyMeals[selectedDayIndex] || []).map((meal, i) => {
              const buttonId = `${meal.name}-${selectedDayIndex}`;
              const buttonState = buttonStates[buttonId] || "idle";
              const hasImageError = imageErrors[meal.name];
              const dietaryPreferences = getDietaryPreferences(meal);

              const displayPrice = typeof meal.price === "number" ? `${meal.price.toFixed(2)}.-` : meal.price;

              return (
                <div key={i} className="meal-card">
                  {hasImageError ? (
                    <div className="meal-image-placeholder">
                      <Image size={48} />
                      <span>{meal.name}</span>
                    </div>
                  ) : (
                    <img
                      src={meal.image}
                      alt={meal.name}
                      className="meal-image"
                      onError={() => handleImageError(meal.name)}
                      loading="lazy"
                    />
                  )}

                  <div className="meal-content">
                    <div className="meal-header">
                      <h3>{meal.name}</h3>
                      <span className="dietary-badge">
                        {getDietaryBadge(dietaryPreferences)}
                      </span>
                    </div>
                    <p>{meal.description}</p>
                    <p className="meal-price">{displayPrice}</p>
                    {meal.calories != null && (
                      <p className="meal-info">Kalorien: {meal.calories} kcal</p>
                    )}
                    <p className="meal-info">
                      Allergene: {meal.allergen ? meal.allergen : "Keine Angaben"}
                    </p>
                    <button
                      className={`add-to-cart-btn ${buttonState}`}
                      onClick={() => handleAddToCart(meal)}
                      disabled={buttonState === "loading"}
                    >
                      {getButtonContent(meal)}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          
          {filterMeals(dailyMeals[selectedDayIndex] || []).length === 0 && (
            <div className="no-meals-message">
              <p>Keine Gerichte für diese Ernährungspräferenz verfügbar.</p>
              <button 
                className="clear-filter-btn"
                onClick={() => setSelectedDietaryFilter("alle")}
              >
                Alle Gerichte anzeigen
              </button>
            </div>
          )}
        </div>
      </div>
      <Cart
        items={items}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
      />
      <Footer isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
    </>
  );
};

export default MenuOverview;
