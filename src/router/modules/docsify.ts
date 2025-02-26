export default {
  path: "/docs",
  redirect: "/docs/docsify",
  meta: {
    icon: "ri:information-line",
    // showLink: false,
    title: "docs",
    rank: 9
  },
  children: [
    {
      path: "/docs/docsify",
      name: "Docsify",
      component: () => import("@/views/DocsView.vue"),
      meta: {
        title: "docsify"
      }
    }
  ]
} satisfies RouteConfigsTable;
