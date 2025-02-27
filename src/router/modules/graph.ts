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
      path: "/graph/index",
      name: "Graph",
      component: () => import("@/views/graph/index.vue"),
      meta: {
        title: "知识图谱"
      }
    }
  ]
} satisfies RouteConfigsTable;
