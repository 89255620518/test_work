import { useState, useEffect } from 'react';
import styles from './reviews.module.scss';
import axios from "axios";
import { Link } from 'react-router-dom';

const ReviewsComponent = ({ basketItems }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadReviews = async () => {
            try {
                const response = await axios.get('http://o-complex.com:1337/reviews/', {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                
                setReviews(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Ошибка при загрузке данных отзывов:", error);
                setError("Не удалось загрузить отзывы");
                setLoading(false);
            };
        };

        loadReviews();
    }, []);

    // Функция для безопасного вставки HTML
    const createMarkup = (html) => {
        return { __html: html };
    };

    return (
        <div className={styles.container}>
            {/* Навигационная панель */}
            <nav className={styles.nav}>
                <Link to="/Basket" className={styles.navLink}>
                    <span className={styles.navIcon}>🛒</span>
                    <span>Корзина ({basketItems.length})</span>
                </Link>
                
                <Link to="/Product" className={styles.navLink}>
                    <span className={styles.navIcon}>🍔</span>
                    <span>Меню товаров</span>
                </Link>
            </nav>

            {/* Основной контент */}
            <main className={styles.main}>
                <h1 className={styles.title}>Отзывы наших клиентов</h1>
                
                {loading ? (
                    <div className={styles.loader}>Загрузка отзывов...</div>
                ) : error ? (
                    <div className={styles.error}>{error}</div>
                ) : (
                    <div className={styles.reviewsGrid}>
                        {reviews.map((review) => (
                            <article key={review.id} className={styles.reviewCard}>
                                <div 
                                    className={styles.reviewContent}
                                    dangerouslySetInnerHTML={createMarkup(review.text)}
                                />
                            </article>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default ReviewsComponent;