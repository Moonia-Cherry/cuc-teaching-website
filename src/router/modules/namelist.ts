export default {
  path: "/namelist",
  redirect: "/namelist/index",
  meta: {
    icon: "ri:profile-line",
    title: "用户名单",
    rank: 45
  },
  children: [
    {
      path: "/namelist/index",
      name: "Fighting",
      component: () => import("@/views/namelist/index.vue"),
      meta: {
        title: "用户名单"
      }
    }
  ]
} satisfies RouteConfigsTable;
