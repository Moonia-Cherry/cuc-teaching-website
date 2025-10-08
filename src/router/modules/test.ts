export default {
  path: "/test",
  redirect: "/test/siwei",
  meta: {
    icon: "ri:profile-line",
    title: "实操训练",
    rank: 100
  },
  children: [
    {
      path: "/test/siwei",
      name: "TestSiwei",
      component: () => import("@/views/test/index.vue"),
      meta: {
        title: "思维实操"
      }
    },
    {
      path: "/test/qiujie",
      name: "TestQiujie",
      component: () => import("@/views/test/index.vue"),
      meta: {
        title: "求解实操"
      }
    }
  ]
} satisfies RouteConfigsTable;
