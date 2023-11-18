import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import DefaultLayout from '../layouts/DefaultLayout.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Chat from '../views/Chat.vue'
import store from '../store'

const routes = [
    {
        path:'/',
        name:'Public',
        component:DefaultLayout,
        redirect: '/',
        children:[
            {
                path:'/',
                name:'Home',
                component:Home
            },
            {
                path: '/login',
                name: 'Login',
                component: Login,
            },
            {
                path: '/register',
                name: 'Register',
                component: Register,
            },
            {
                path: '/chat',
                name: 'Chat',
                component: Chat,
            },
        ]
    },
]
   
const router = createRouter({
    history: createWebHistory(),
    routes,
})

//if the user is not logged in, redirecting to login page
const except = ['Register' ]
router.beforeEach((to, from, next) => {
  let token = store.state.token
  console.log('router ==' + token)
  if (to.name !== 'Login' && !token && !except.includes(to.name))
    next({ name: 'Login' })
  else next()
})
export default router