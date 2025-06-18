import { useState, useEffect } from 'react';
import styles from './basket.module.scss';
import { Link } from 'react-router-dom';

const BasketComponent = ({
    items,
    onRemove,
    onUpdateQuantity,
    onClear
}) => {
    const [phone, setPhone] = useState('+7');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [error, setError] = useState('');

    const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

    const handlePhoneChange = (e) => {
        let value = e.target.value;
        
        if (!value.startsWith('+7')) {
            value = '+7';
        }
        
        if (value.length <= 12) {
            setPhone(value);
        }
    };

    const handleSubmitOrder = async () => {
        if (items.length === 0) {
            setError('Добавьте товары в корзину');
            return;
        }

        const phoneRegex = /^\+7\d{10}$/;
        if (!phoneRegex.test(phone)) {
            setError('Введите корректный номер телефона');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            const cart = items.map(item => ({
                id: item.id,
                quantity: item.quantity
            }));

            const response = await fetch('http://o-complex.com:1337/order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    phone: phone,
                    cart: cart
                })
            });

            if (!response.ok) {
                throw new Error('Ошибка при оформлении заказа');
            }

            const result = await response.json();
            console.log('Order success:', result);
            setOrderSuccess(true);
            onClear();
        } catch (err) {
            console.error('Order error:', err);
            setError('Произошла ошибка при оформлении заказа. Попробуйте позже.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatPhoneDisplay = (phone) => {
        if (phone.length <= 2) return phone;
        if (phone.length <= 5) return `${phone.slice(0, 2)} (${phone.slice(2)}`;
        if (phone.length <= 8) return `${phone.slice(0, 2)} (${phone.slice(2, 5)}) ${phone.slice(5)}`;
        if (phone.length <= 10) return `${phone.slice(0, 2)} (${phone.slice(2, 5)}) ${phone.slice(5, 8)}-${phone.slice(8)}`;
        return `${phone.slice(0, 2)} (${phone.slice(2, 5)}) ${phone.slice(5, 8)}-${phone.slice(8, 10)}-${phone.slice(10)}`;
    };

    return (
        <div className={styles.container}>
            <nav className={styles.nav}>
                <Link to="/" className={styles.navLink}>
                    <span className={styles.navIcon}>💬</span>
                    <span>Отзывы</span>
                </Link>
                
                <Link to="/Product" className={styles.navLink}>
                    <span className={styles.navIcon}>🍔</span>
                    <span>Меню</span>
                </Link>
            </nav>

            <div className={styles.basketContainer}>
                <h1 className={styles.title}>Ваша корзина</h1>
                <p className={styles.itemsCount}>{items.length} {items.length === 1 ? 'товар' : items.length < 5 ? 'товара' : 'товаров'}</p>
                
                {orderSuccess ? (
                    <div className={styles.successMessage}>
                        <div className={styles.successIcon}>✓</div>
                        <h2>Заказ успешно оформлен!</h2>
                        <p>Мы скоро свяжемся с вами по номеру {formatPhoneDisplay(phone)}</p>
                        <Link to="/Product" className={styles.continueShopping}>
                            Продолжить покупки
                        </Link>
                    </div>
                ) : items.length === 0 ? (
                    <div className={styles.emptyBasket}>
                        <div className={styles.emptyIcon}>🛒</div>
                        <h2>Ваша корзина пуста</h2>
                        <p>Добавьте товары из меню</p>
                        <Link to="/Product" className={styles.shopButton}>
                            Перейти в меню
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className={styles.itemsList}>
                            {items.map(item => (
                                <div key={item.id} className={styles.itemCard}>
                                    <div className={styles.itemImageContainer}>
                                        {item.image ? (
                                            <img src={item.image} alt={item.title} />
                                        ) : (
                                            <div className={styles.itemImage}>🛍️</div>
                                        )}
                                    </div>
                                    
                                    <div className={styles.itemDetails}>
                                        <h3 className={styles.itemName}>{item.title}</h3>
                                        
                                        <div className={styles.priceControls}>
                                            <div className={styles.quantityControl}>
                                                <button 
                                                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                                                    className={styles.quantityButton}
                                                    disabled={item.quantity <= 1}
                                                >
                                                    −
                                                </button>
                                                <span className={styles.quantity}>{item.quantity}</span>
                                                <button 
                                                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                                    className={styles.quantityButton}
                                                >
                                                    +
                                                </button>
                                            </div>
                                            
                                            <div className={styles.priceWrapper}>
                                                <p className={styles.itemTotal}>{item.price * item.quantity} ₽</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <button 
                                        onClick={() => onRemove(item.id)}
                                        className={styles.removeButton}
                                        aria-label="Удалить товар"
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))}
                        </div>
                        
                        <div className={styles.orderForm}>
                            <div className={styles.phoneInputContainer}>
                                <label htmlFor="phone" className={styles.phoneLabel}>Номер телефона</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    value={phone}
                                    onChange={handlePhoneChange}
                                    className={styles.phoneInput}
                                    placeholder="+7 (___) ___-__-__"
                                    maxLength="12"
                                />
                            </div>
                            
                            {error && <div className={styles.errorMessage}>{error}</div>}
                            
                            <div className={styles.summaryCard}>
                                <div className={styles.summaryRow}>
                                    <span>Товаров:</span>
                                    <span>{items.length} шт.</span>
                                </div>
                                <div className={styles.summaryRow}>
                                    <span>Сумма:</span>
                                    <span className={styles.totalPrice}>{totalPrice} ₽</span>
                                </div>
                                
                                <div className={styles.actionButtons}>
                                    <button 
                                        onClick={onClear}
                                        className={styles.clearButton}
                                        disabled={isSubmitting}
                                    >
                                        Очистить корзину
                                    </button>
                                    
                                    <button 
                                        onClick={handleSubmitOrder}
                                        className={styles.checkoutButton}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Оформляем...' : 'Оформить заказ'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default BasketComponent;