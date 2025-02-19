export default {
  path: "/opus",
  redirect: "/opus/index",
  meta: {
    icon: "proicons:library",
    title: "学生作品",
    rank: 39
  },
  children: [
    {
      path: "/opus/index",
      name: "StudentOpusNew",
      component: () => import("@/views/opus/index.vue"),
      meta: {
        title: "学生作品"
      }
    },
    {
      path: "/opus/:year?", // 问号表示参数可选
      name: "ShowOpus",
      component: () => import("@/views/opus/showOpus.vue"),
      meta: {
        title: "学生作品展示",
        showLink: false
      }
    }
  ]
} satisfies RouteConfigsTable;
