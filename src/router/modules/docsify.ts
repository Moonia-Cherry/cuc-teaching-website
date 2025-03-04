export default {
  path: "/docs",
  redirect: "/docs/docsify",
  meta: {
    icon: "material-symbols:docs-outline-rounded",
    // showLink: false,
    title: "课程案例",
    rank: 35
  },
  children: [
    {
      path: "/docs/docsify",
      name: "Docsify",
      component: () => import("@/views/DocsView.vue"),
      meta: {
        title: "课程案例"
      }
    }
  ]
} satisfies RouteConfigsTable;
