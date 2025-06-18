import ReviewsComponent from '../component/ReviewsComponent/reviewsComponent';
import styles from '../pagesStyle/pages.module.scss';
import { Helmet } from 'react-helmet';

const Reviews = ({ basketItems }) => {

    return (
        <div className={styles.containerReviews}>
            <Helmet>
                <title>Отзывы</title>
                <meta name="description" content="Описание страницы" />
            </Helmet>
            <ReviewsComponent basketItems={basketItems} />
        </div>
    )
}

export default Reviews;