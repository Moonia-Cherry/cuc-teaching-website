export default {
  path: "/graph",
  redirect: "/graph/index",
  meta: {
    icon: "ph:graph-fill",
    title: "知识图谱",
    rank: 38
  },
  children: [
    {
      path: "/graph/siwei",
      name: "GraphSiwei",
      component: () => import("@/views/graph/index.vue"),
      meta: {
        title: "思维图谱"
      }
    },
    {
      path: "/graph/qiujie",
      name: "GraphQiujie",
      component: () => import("@/views/graph/index.vue"),
      meta: {
        title: "求解图谱"
      }
    }
  ]
} satisfies RouteConfigsTable;
