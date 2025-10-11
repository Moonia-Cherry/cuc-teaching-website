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
      name: "Docsifysiwei",
      component: () => import("@/views/anli/VideoList.vue"),
      meta: {
        title: "思维案例"
      }
    },
    {
      path: "/docs/qiujie",
      name: "DocsifyQiujie",
      component: () => import("@/views/QiujieCaseView.vue"),
      meta: {
        title: "求解案例"
      }
    }
  ]
} satisfies RouteConfigsTable;
