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
        title: "常见问题"
      }
    },
    {
      path: "/faq/add",
      name: "addFaq",
      component: () => import("@/views/faq/addFaq.vue"),
      meta: {
        title: "添加问题",
        showLink: false
      }
    }
  ]
} satisfies RouteConfigsTable;
