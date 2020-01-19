'use strict';

document.addEventListener('DOMContentLoaded', () => {
    // AliJSpress
    const search = document.querySelector('.search'); // Форма поиска
    const cartBtn = document.getElementById('cart'); // Кнопка корзины
    const wishlistBtn = document.getElementById('wishlist'); // Кнопка Избранное
    const goodsWrapper = document.querySelector('.goods-wrapper'); // Обертка карточки товаров 
    const cart = document.querySelector('.cart'); // Корзина
    const category = document.querySelector('.category'); // Категории
    const cartCounter = cartBtn.querySelector('.counter'); // Счетчик товаров в корзине
    const wishlistCounter = wishlistBtn.querySelector('.counter'); // Счетчик избранных товаров
    const cartWrapper = document.querySelector('.cart-wrapper'); // Обертка корзины

    const wishlist = [];
    const goodsBasket = {};

    // Запрос товаров с сервера
    const getGoods = (handler, filter) => {
    
        loading(handler.name);
 
        fetch('./db/db.json')
            .then(response => response.json())
            .then(filter)
            .then(handler)
    }
    
    const loading = (nameFunction) => {
        const spinner = `<div id="spinner" style="position: fixed;top: 50%;left: 50%;
        transform: translate(-50%, -50%); z-index: 1;"><div class="spinner-loading"><div><div><div></div>
        </div><div><div></div></div><div><div></div></div><div><div></div></div></div></div></div>`;

        if (nameFunction === 'renderCard') {
            goodsWrapper.innerHTML = spinner;
        }

        if (nameFunction === 'renderBasker') {
            cartWrapper.innerHTML = spinner;
        }
    }

    const createCardGoods = (id, title, price, img) => {
        const card = document.createElement('div');
        card.className = 'card-wrapper col-12 col-md-6 col-lg-4 col-xl-3 pb-3';
        card.innerHTML = `<div class="card">
                            <div class="card-img-wrapper">
                                <img class="card-img-top" src="${img}" alt="">
                                <button class="card-add-wishlist ${wishlist.includes(id) ? 'active' : ''}"
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
    }

    const createCartGoodsBasket = (id, title, price, img) => {
        const card = document.createElement('div');
        card.className = 'goods';
        card.innerHTML = `
                <div class="goods-img-wrapper">
						<img class="goods-img" src="${img}" alt="">

					</div>
					<div class="goods-description">
						<h2 class="goods-title">${title}</h2>
						<p class="goods-price">${price} ₽</p>

					</div>
					<div class="goods-price-count">
						<div class="goods-trigger">
							<button class="goods-add-wishlist ${wishlist.includes(id) ? 'active' : ''}" data-goods-id="${id}"></button>
							<button class="goods-delete" data-goods-id="${id}"></button>
						</div>
						<div class="goods-count">${goodsBasket[id]}</div>
					</div>`;

        return card;
    }

    // Рендеры
    const renderCard = (goods) => {
        goodsWrapper.textContent = '';

        if (goods.length) {
            goods.forEach(({ id, title, price, imgMin}) => {
                goodsWrapper.appendChild(createCardGoods(id, title, price, imgMin));
            });
        } else {
            goodsWrapper.textContent = '❌ Извините по вашему запросу товаров нет!';
        }
    }

    const renderBasket = goods => {
        cartWrapper.textContent = '';

        if (goods.length) {
            goods.forEach(({ id, title, price, imgMin}) => {
                cartWrapper.append(createCartGoodsBasket(id, title, price, imgMin));
            });
        } else {
            cartWrapper.innerHTML = '<div id="cart-empty"Ваша корзина пока пуста</div>';
        }
    }

    // Калькуляция
    const calcTotalPrice = goods => {
        let sum = goods.reduce((accum, item) => {
            return accum + item.price * goodsBasket[item.id];
        }, 0);

        cart.querySelector('.cart-total>span').textContent = sum.toFixed(2);
    }

    const checkCount = () => {
        wishlistCounter.textContent = wishlist.length;
        cartCounter.textContent = Object.keys(goodsBasket).length;
    }

    // Фильтры
    const showCardBasket = goods => {
        const basketGoods = goods.filter(item => goodsBasket.hasOwnProperty(item.id));
        calcTotalPrice(basketGoods);
        return basketGoods;
    }

    const showWishlist = () => {
        getGoods(renderCard, goods => goods.filter(item => wishlist.includes(item.id)));
    }

    const randomSort = (goods) => goods.sort(() => Math.random() - 0.5 );
    
    // Открываем и закрываем корзину
    const closeCart = (event) => {
        const target = event.target;
        
        if (target === cart ||
            target.classList.contains('cart-close') ||
            event.keyCode === 27) {
            cart.style.display = '';
            document.removeEventListener('keydown', closeCart);
        }
    }
    
    const openCart = (event) => {
        event.preventDefault(); // Отмена действия браузера
        cart.style.display = 'flex';
        document.addEventListener('keydown', closeCart);
        getGoods(renderBasket, showCardBasket);
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

    const searchGoods = event => {
        event.preventDefault;
        //console.log(event.target.elements);
        const input = event.target.elements.searchGoods;
        const inputValue = input.value.trim();

        if (inputValue !== '') {
            const searchString = new RegExp(inputValue, 'i');
            getGoods(renderCard, goods => goods.filter(item => searchString.test(item.title)));
        } else {
            search.classList.add('error');
            setTimeout( () => {
                search.classList.remove('error');
            }, 2000);
        }

        input.value = '';
    }

    const getCookie = name => {
        let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
    }

    const cookieQuery = get => {
        if (get) {
            if (getCookie('goodsBasket')) {
                Object.assign(goodsBasket, JSON.parse(getCookie('goodsBasket')));
            }
            checkCount();
        } else {
            document.cookie = `goodsBasket=${JSON.stringify(goodsBasket)};max-age=86400e3`;
        }
    }

    const storageQuery = get => {
        if (get) {
            if (localStorage.getItem('wishlist')) {
                wishlist.push(...JSON.parse(localStorage.getItem('wishlist')));
            }
            checkCount();
        } else {
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
        }
    }

    const toggleWishlist = (id, elem) => {
        if (wishlist.includes(id)) {
            wishlist.splice(wishlist.indexOf(id), 1);
            elem.classList.remove('active');
        } else {
            wishlist.push(id);
            elem.classList.add('active');
        }

        checkCount();
        storageQuery();
        //console.log(wishlist);
    }

    const addBasket = id => {
        if (goodsBasket[id]) {
            goodsBasket[id] += 1;
        } else {
            goodsBasket[id] = 1;
        }

        checkCount();
        cookieQuery();
    }

    const removeGoods = id => {
        delete goodsBasket[id];
        checkCount();
        cookieQuery();
        getGoods(renderBasket, showCardBasket);
    }
    
    // Handler's
    const handlerGoods = event => {
        const target = event.target;

        if (target.classList.contains('card-add-wishlist')) {
            toggleWishlist(target.dataset.goodsId, target);
        }

        if (target.classList.contains('card-add-cart')) {
            addBasket(target.dataset.goodsId);
        }
    }

    const handlerBasket = event => {
        const target = event.target;

        if (target.classList.contains('goods-add-wishlist')) {
            toggleWishlist(target.dataset.goodsId, target);
        }

        if (target.classList.contains('goods-delete')) {
            removeGoods(target.dataset.goodsId);
        }
    }


    // Инициализация
    {
    getGoods(renderCard, randomSort);
    storageQuery('get');
    cookieQuery('get');

    cartBtn.addEventListener('click', openCart); // вешаем слушатель на открытие корзины
    cart.addEventListener('click', closeCart); // вешаем слушатель на открытую корзину
    category.addEventListener('click', choiceCategory);
    search.addEventListener('submit', searchGoods);
    goodsWrapper.addEventListener('click', handlerGoods);
    cartWrapper.addEventListener('click', handlerBasket);
    wishlistBtn.addEventListener('click', showWishlist); 
    }

});