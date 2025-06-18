import { useState, useEffect } from "react";
import './App.css';
import Basket from './pages/basket';
import Product from './pages/product';
import Reviews from './pages/reviews';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  // Инициализация корзины с загрузкой из localStorage
  const [basketItems, setBasketItems] = useState(() => {
    const savedBasket = localStorage.getItem('basket');
    return savedBasket ? JSON.parse(savedBasket) : [];
  });

  // Сохраняем корзину в localStorage при каждом изменении
  useEffect(() => {
    localStorage.setItem('basket', JSON.stringify(basketItems));
  }, [basketItems]);

  // Функция для добавления товара в корзину
  const addToBasket = (product) => {
    setBasketItems(prevItems => {
      // Проверяем, есть ли уже такой товар в корзине
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        // Если товар уже есть, увеличиваем количество
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Если товара нет, добавляем его с количеством 1
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  // Функция для удаления товара из корзины
  const removeFromBasket = (productId) => {
    setBasketItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  // Функция для изменения количества товара
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromBasket(productId);
      return;
    }

    setBasketItems(prevItems =>
      prevItems.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  // Функция для очистки корзины
  const clearBasket = () => {
    setBasketItems([]);
  };

  // Подсчет общего количества товаров в корзине
  const totalItems = basketItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route 
            path='/Basket' 
            element={
              <Basket 
                items={basketItems}
                onRemove={removeFromBasket}
                onUpdateQuantity={updateQuantity}
                onClear={clearBasket}
              />
            } 
          />
          <Route 
            path='/' 
            element={<Reviews basketItems={basketItems} />} 
          />
          <Route 
            path='/Product' 
            element={
              <Product 
                onUpdateQuantity={updateQuantity}
                onAddToBasket={addToBasket}
                basketItems={basketItems}
                totalItems={totalItems}
              />
            } 
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;