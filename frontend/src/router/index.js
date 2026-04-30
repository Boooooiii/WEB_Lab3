import { createRouter, createWebHistory } from 'vue-router';

import AuthView from '../../Auth.vue';
import CalculatorView from '../../Calculator.vue';
import ProfileView from '../../Profile.vue';
import InfoView from '../../Info.vue';

const routes = [
    {
        path: '/profile',
        name: 'Profile',
        component: ProfileView
    },
    {
        path: '/',
        redirect: '/calculator'
    },
    {
        path: '/auth',
        name: 'Auth',
        component: AuthView
    },
    {
        path: '/calculator',
        name: 'Calculator',
        component: CalculatorView
    },
    {
        path: '/info',
        name: 'Info',
        component: InfoView
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;