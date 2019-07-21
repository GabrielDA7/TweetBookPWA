import { Router } from '@vaadin/router';
import routes from '../../../constantes/routes';

const router = new Router(document.getElementById('outlet'));
router.setRoutes([
    { path: routes.HOME_ROUTE, component: 'tweet-home' },
    { path: routes.SEARCH_ROUTE, component: 'tweet-search' },
    { path: routes.SIGNIN_ROUTE, component: 'tweet-signin' },
    { path: routes.SIGNUP_ROUTE, component: 'tweet-signup' },
    { path: routes.PROFIL_ROUTE, component: 'tweet-account' },
    { path: routes.NOT_FOUND_ROUTE, component: 'not-found-view' },
]);

export default router;