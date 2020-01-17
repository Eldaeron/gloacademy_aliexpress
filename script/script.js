document.addEventListener('DOMContentLoaded', () => {

    // AliExpress ver 1
    const body = document.querySelector('body'); // Документ
    const search = document.querySelector('.search'); // Форма поиска
    const cartBtn = document.getElementById('cart'); // Кнопка корзины
    const wishlistBtn = document.getElementById('wishlist'); // Кнопка Избранное
    const goodsWrapper = document.querySelector('.goods-wrapper'); // Обертка карточки товаров 
    const cart = document.querySelector('.cart'); // Корзина
    const category = document.querySelector('.category'); // Категории

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
    //goodsWrapper.appendChild(createCardGoods(1, 'Дартс', 2000, 'img/temp/Archer.jpg'));
    //goodsWrapper.appendChild(createCardGoods(2, 'Фламинго', 3000, 'img/temp/Flamingo.jpg'));
    //goodsWrapper.appendChild(createCardGoods(3, 'Носки', 333, 'img/temp/Socks.jpg'));

    const renderCard = (goods) => {
        goodsWrapper.textContent = '';
        goods.forEach(({ id, title, price, imgMin}) => {
            //console.log(title);
            //const { id, title, price, imgMin } = item; // обьявляем так или в самом forEach
            //goodsWrapper.appendChild(createCardGoods(item.id, item.title, item.price, item.imgMin)); если необьявленные
            goodsWrapper.appendChild(createCardGoods(id, title, price, imgMin));
        });
    }

    const renderSpinner = () => {
        const spinner = document.createElement('div');

        spinner.className = 'spinner';
        spinner.innerHTML = `<div id="spinner" style="position: fixed;top: 50%;left: 50%;
        transform: translate(-50%, -50%); z-index: 1;"><div class="spinner-loading"><div><div><div></div>
        </div><div><div></div></div><div><div></div></div><div><div></div></div></div></div></div>`;

        goodsWrapper.appendChild(spinner);
    }

    const getGoods = (handler, filter) => {
    
        renderSpinner()

        //setTimeout(() => function, 1000) /
        setTimeout(() => 
            fetch('db/db.json')
            .then(response => response.json())
            .then(filter)
            .then(handler)
        , 500) // Чисто чтоб подольше посмотреть на спиннер, а то быстро исчезает :)

        
    }

    const randomSort = (item) => {
        return item.sort( () => Math.random() - 0.5 );
    }
    
    // Получение товаров из JSON
    /* 
    Простой вариант 
    fetch ('../db/db.json')
        .then(response => response.json())
        .then(data => console.log(data));
        
    И более обьемный вариант написания
    fetch ('../db/db.json')
        .then((response) => {
            return (response.json());
        })
        .then(goods => console.log(goods);
    */

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
    const choiceCategory = event => {
        event.preventDefault();
        const target = event.target;

        if (target.classList.contains('category-item')) {
            const category = target.dataset.category;
            //console.log(target.dataset.category); // data-category
            getGoods(renderCard, goods => goods.filter(item => item.category.includes(category)));
        }

    }

    cartBtn.addEventListener('click', openCart); // вешаем слушатель на открытие корзины
    cart.addEventListener('click', closeCart); // вешаем слушатель на открытую корзину
    body.addEventListener('keydown', checkEsc); // вешаем слушатель на документ для закрытие по 'esc'
    category.addEventListener('click', choiceCategory);
    getGoods(renderCard, randomSort);

});