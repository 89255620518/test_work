import BasketComponent from '../component/BasketComponent/basketComponent';
import styles from '../pagesStyle/pages.module.scss';
import { Helmet } from 'react-helmet';

const Basket = ({
    items,
    onRemove,
    onUpdateQuantity,
    onClear
}) => {

    return (
        <div className={styles.containerBasket}>
            <Helmet>
                <title>Корзина</title>
                <meta name="description" content="Описание страницы" />
            </Helmet>
            <BasketComponent
                items={items}
                onRemove={onRemove}
                onUpdateQuantity={onUpdateQuantity}
                onClear={onClear}
            />
        </div>
    )
}

export default Basket;