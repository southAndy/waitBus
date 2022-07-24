import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/NearbyStation",
      name: "NearbyStation",
      component: () => import("@/views/NearbyStation.vue"),
    },
    {
      path: "/:City/BusRoute",
      name: "BusRoute",
      props: true,
      component: () => import("@/views/BusRoute.vue"),
    },
    {
      path: "/StationDetail/:UID",
      name: "StationDeatil",
      props: true,
      component: () => import("@/views/StationDetail.vue"),
      // component: () => import("@/views/StationDeatil.vue"),
    },
  ],
});

export default router;
