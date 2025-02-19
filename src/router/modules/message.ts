export default {
  path: "/message",
  redirect: "/message/index",
  meta: {
    icon: "ri:edit-box-line",
    title: "留言板",
    rank: 41
  },
  children: [
    {
      path: "/message/index",
      name: "MessageBoard",
      component: () => import("@/views/message/index.vue"),
      meta: {
        title: "留言板"
      }
    }
  ]
} satisfies RouteConfigsTable;
