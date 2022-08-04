import Vue from 'vue'
import VueRouter, {RouteConfig} from 'vue-router'
import {SecurityService} from "@/security/SecurityService";
import LoginView from "@/views/LoginView/LoginView.vue";
import PageNotFoundView from "@/views/PageNotFoundView/PageNotFoundView.vue";
import MainView from "@/views/MainView/MainView.vue";
import RegistrationView from "@/views/RegistrationView/RegistrationView.vue";
import ValidView from "@/views/ValidView/ValidView.vue";
import NoValidView from "@/views/NoValidView/NoValidView.vue";

Vue.use(VueRouter);

const routes: RouteConfig[] = [
    {
        path: '/',
        name: 'MainView',
        component: MainView,
        meta: {
            authorized: true
        }
    },
    {
        path: '/login',
        name: 'LoginView',
        component: LoginView
    },
    {
        path: '/registration',
        name: 'RegistrationView',
        component: RegistrationView
    },
    {
        path: '/novalid',
        name: 'NoValidView',
        component: NoValidView,
        meta: {
            authorized: false
        }
    },
    {
        path: '/:userId?/:code?',
        name: 'ValidView',
        component: ValidView
    },
    {
        path: '/*',
        name: 'PageNotFoundView',
        component: PageNotFoundView
    },
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
});

router.beforeEach((to, from, next) => {
    if (to.meta.authorized && !SecurityService.isAuthorized()){
        next('/login');
    } else next()
});

export default router
