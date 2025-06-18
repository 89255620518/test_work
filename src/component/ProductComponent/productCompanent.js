import styles from './product.module.scss';
import axios from "axios";
import { Link } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';

const ProductComponent = ({ 
  onAddToBasket, 
  basketItems = [], 
  totalItems,
  onUpdateQuantity 
}) => {
    const [products, setProducts] = useState([]);
    const [visibleProducts, setVisibleProducts] = useState(6);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Загрузка товаров с useCallback для мемоизации
    const loadProducts = useCallback(async () => {
        try {
            const response = await axios.get('http://o-complex.com:1337/products/', {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            
            setProducts(response.data?.items || []);
            setLoading(false);
        } catch (error) {
            console.error("Ошибка при загрузке товаров:", error);
            setError("Не удалось загрузить товары");
            setLoading(false);
        };
    }, []);

    useEffect(() => {
        loadProducts();
    }, [loadProducts]);

    // Проверка наличия товара в корзине
    const getBasketItem = useCallback((productId) => {
        return basketItems.find(item => item.id === productId);
    }, [basketItems]);

    // Обработчик увеличения количества
    const handleIncrement = (product) => {
        const basketItem = getBasketItem(product.id);
        if (basketItem) {
            onUpdateQuantity(product.id, basketItem.quantity + 1);
        } else {
            onAddToBasket(product);
        }
    };

    // Обработчик уменьшения количества
    const handleDecrement = (product) => {
        const basketItem = getBasketItem(product.id);
        if (basketItem && basketItem.quantity > 1) {
            onUpdateQuantity(product.id, basketItem.quantity - 1);
        } else {
            onUpdateQuantity(product.id, 0); // Удалит товар при quantity = 0
        }
    };

    const loadMoreProducts = () => {
        setVisibleProducts(prev => prev + 6);
    };

    if (loading) return <div className={styles.loading}>Загрузка товаров...</div>;
    if (error) return <div className={styles.error}>{error}</div>;

    return (
        <div className={styles.containerProductComponent}>
            <nav className={styles.nav}>
                <Link to="/Basket" className={styles.navLink}>
                    <span className={styles.navIcon}>🛒</span>
                    <span>Корзина ({basketItems.length})</span>
                </Link>
                
                <Link to="/" className={styles.navLink}>
                    <span className={styles.navIcon}>💬</span>
                    <span>Отзывы</span>
                </Link>
            </nav>

            <div className={styles.productsWrapper}>
                <h1 className={styles.title}>Наши товары</h1>
                
                {products.length > 0 ? (
                    <>
                        <div className={styles.productsGrid}>
                            {products.slice(0, visibleProducts).map(product => {
                                const basketItem = getBasketItem(product.id);
                                const quantity = basketItem?.quantity || 0;
                                
                                return (
                                    <div key={product.id} className={styles.productCard}>
                                        <div className={styles.productImage}>
                                            {product.image ? (
                                                <img src={product.image} alt={product.title} />
                                            ) : (
                                                <div className={styles.imagePlaceholder}>🛍️</div>
                                            )}
                                        </div>
                                        <div className={styles.productInfo}>
                                            <h3 className={styles.productTitle}>{product.title}</h3>
                                            <p className={styles.productDescription}>
                                                {product.description || 'Описание отсутствует'}
                                            </p>
                                            <div className={styles.productFooter}>
                                                <span className={styles.productPrice}>
                                                    {product.price ? `${product.price} ₽` : 'Цена не указана'}
                                                </span>
                                                
                                                {quantity > 0 ? (
                                                    <div className={styles.quantityControls}>
                                                        <button 
                                                            onClick={() => handleDecrement(product)}
                                                            className={styles.quantityButton}
                                                        >
                                                            -
                                                        </button>
                                                        <span className={styles.quantityValue}>
                                                            {quantity}
                                                        </span>
                                                        <button 
                                                            onClick={() => handleIncrement(product)}
                                                            className={styles.quantityButton}
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => handleIncrement(product)}
                                                        className={styles.addButton}
                                                    >
                                                        Добавить
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {visibleProducts < products.length && (
                            <div className={styles.loadMoreContainer}>
                                <button 
                                    onClick={loadMoreProducts}
                                    className={styles.loadMoreButton}
                                >
                                    Показать еще
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className={styles.noProducts}>Товары отсутствуют</div>
                )}
            </div>
        </div>
    );
};

export default ProductComponent;