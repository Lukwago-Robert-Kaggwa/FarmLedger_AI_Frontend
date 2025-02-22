import { createRouter, createWebHistory } from "vue-router";
import LandingPage from "@/views/LandingPage.vue"
import LoginPage from "@/views/LoginPage.vue";
import SignupPage from "@/views/SignupPage.vue";
import HomePage from "@/views/HomePage.vue";
import Ledger from "@/views/Ledger.vue";
import TrackingPage from "@/views/TrackingPage.vue";
import Demo from "@/views/Demo.vue";
import Veterinary from "@/views/Veterinary.vue";

const routes = [
  {
    path: "/",
    name: "landing",
    component: LandingPage,
  },

  {
    path: "/login",
    name: "login",
    component: LoginPage,
  },

  {
    path: "/signup",
    name: "signup",
    component: SignupPage,
  },

  {
    path: "/ledger",
    name: "ledger",
    component: Ledger,
  },

  {
    path: '/tracking/:rfid/:behaviour/:healthStatus/:statusLastModified/:longitude/:latitude',
    name: 'TrackingPage',
    component: TrackingPage,
  },
  
  {
    path: "/home",
    name: "home",
    component: HomePage,
  },

  {
    path: "/demo",
    name: "DemoPage",
    component: Demo,
  },
  {
    path: "/veterinary/:rfid/:healthStatus/:statusLastModified",
    name: "Veterinary",
    component: Veterinary,
  },
  {
    path: "/about",
    name: "AboutPage",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
