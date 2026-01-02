import Admin from "./pages/Admin";
import Seller from "./pages/Seller";
import {ADMIN_ROUTE, SELLER_ROUTE, BASKET_ROUTE, FAVORITES_ROUTE, PROPERTY_ROUTE, LOGIN_ROUTE, REGISTRATION_ROUTE, SHOP_ROUTE, PROFILE_SETTINGS_ROUTE, ABOUT_ROUTE, SERVICES_ROUTE, CONTACTS_ROUTE} from "./utils/consts";
import Basket from "./pages/Basket";
import Favorites from "./pages/Favorites";
import Shop from "./pages/Shop";
import Auth from "./pages/Auth";
import PropertyPage from "./pages/PropertyPage";
import ProfileSettings from "./pages/ProfileSettings";
import About from "./pages/About";
import Services from "./pages/Services";
import Contacts from "./pages/Contacts";

export const authRoutes = [
    {
        path: ADMIN_ROUTE,
        Component: Admin,
        role: 'ADMIN' // Этот маршрут только для администраторов
    },
    {
        path: SELLER_ROUTE,
        Component: Seller,
        role: 'SELLER' // Этот маршрут для продавцов
    },
    {
        path: BASKET_ROUTE,
        Component: Basket,
        // role: 'USER' // Корзина доступна для всех авторизованных
    },
    {
        path: FAVORITES_ROUTE,
        Component: Favorites,
        // role: 'USER' // Избранное доступно для всех авторизованных
    },
    {
        path: PROFILE_SETTINGS_ROUTE,
        Component: ProfileSettings,
        // role: 'USER' // Настройки доступны для всех авторизованных
    },
]

export const publicRoutes = [
    {
        path: SHOP_ROUTE,
        Component: Shop
    },
    {
        path: LOGIN_ROUTE,
        Component: Auth
    },
    {
        path: REGISTRATION_ROUTE,
        Component: Auth
    },
    {
        path: PROPERTY_ROUTE + '/:id',
        Component: PropertyPage
    },
    {
        path: ABOUT_ROUTE,
        Component: About
    },
    {
        path: SERVICES_ROUTE,
        Component: Services
    },
    {
        path: CONTACTS_ROUTE,
        Component: Contacts
    },
]
