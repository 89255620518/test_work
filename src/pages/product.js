import ProductCompanent from '../component/ProductComponent/productCompanent'
import styles from '../pagesStyle/pages.module.scss'
import { Helmet } from 'react-helmet';

const Product = ({ onAddToBasket, basketItems, totalItems, onUpdateQuantity }) => {

    return (
        <div className={styles.containerProduct}>
            <Helmet>
                <title>Меню Товаров</title>
                <meta name="description" content="Описание страницы" />
            </Helmet>
            <ProductCompanent
                onAddToBasket={onAddToBasket}
                basketItems={basketItems}
                totalItems={totalItems}
                onUpdateQuantity={onUpdateQuantity}
            />
        </div>
    )
}

export default Product;