document.addEventListener('DOMContentLoaded', () => {

    // AliExpress ver 1
    const body = document.querySelector('body'); // Документ
    const search = document.querySelector('.search'); // Форма поиска
    const cartBtn = document.getElementById('cart'); // Кнопка корзины
    const wishlistBtn = document.getElementById('wishlist'); // Кнопка Избранное
    const goodsWrapper = document.querySelector('.goods-wrapper'); // Обертка карточки товаров 
    const cart = document.querySelector('.cart'); // Корзина

    

    const createCardGoods = (id, title, price, img) => {
        const card = document.createElement('div');
        card.className = 'card-wrapper col-12 col-md-6 col-lg-4 col-xl-3 pb-3';
        card.innerHTML = `<div class="card">
                            <div class="card-img-wrapper">
                                <img class="card-img-top" src="${img}" alt="">
                                <button class="card-add-wishlist"
                                    data-goods-id="${id}"></button>

                            </div>
                            <div class="card-body justify-content-between">
                                <a href="#" class="card-title">${title}</a>
                                <div class="card-price">${price}</div>
                                <div>
                                    <button class="card-add-cart"
                                        data-goods-id="${id}">Добавить в корзину</button>
                                </div>
                            </div>
                        </div>`;

        return card; // Обьязательно возвращаем карточку иначе ошибка :)
        //<?php var_dump(card);
    }

    // Добавляем 3 товара
    goodsWrapper.appendChild(createCardGoods(1, 'Дартс', 2000, 'img/temp/Archer.jpg'));
    goodsWrapper.appendChild(createCardGoods(2, 'Фламинго', 3000, 'img/temp/Flamingo.jpg'));
    goodsWrapper.appendChild(createCardGoods(3, 'Носки', 333, 'img/temp/Socks.jpg'));

    // Открываем и закрываем мой любимый Opencart 2.3:)
    const openCart = (event) => {
        event.preventDefault(); // Отмена действия браузера
        cart.style.display = 'flex'; // изменяеи из display:none на flex
    }
    const closeCart = (event) => {
        const target = event.target;
        
        if (target === cart || target.classList.contains('cart-close')) {
            cart.style.display = '';
        }
        //console.log(event);
    }
    const checkEsc = (event) => {
        if (cart.style.display === 'flex' && event.keyCode === 27) { // если корзина открыта
            cart.style.display = '';
        }
    }

    cartBtn.addEventListener('click', openCart); // вешаем слушатель на открытие корзины
    cart.addEventListener('click', closeCart); // вешаем слушатель на открытую корзину
    body.addEventListener('keydown', checkEsc); // вешаем слушатель на документ для закрытие по 'esc'
});