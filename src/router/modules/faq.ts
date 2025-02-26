export default {
  path: "/faq",
  redirect: "/faq/index",
  meta: {
    icon: "iconoir:chat-bubble-question",
    title: "常见问题",
    rank: 40
  },
  children: [
    {
      path: "/faq/index",
      name: "Faq",
      component: () => import("@/views/faq/index.vue"),
      meta: {
        title: "问题索引"
      }
    }
  ]
} satisfies RouteConfigsTable;
