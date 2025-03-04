<script setup lang="ts">
import { onMounted, ref } from "vue";
// import { useECharts } from "@pureadmin/utils";
import * as ECharts from "echarts";
import axios from "axios";
import { ElMessage } from "element-plus";
const { VITE_BACKEND_ROOT_PATH } = import.meta.env;

// 初始化ECharts
const chartRef = ref();
let echarts: ECharts.ECharts;
onMounted(() => {
  echarts = ECharts.init(chartRef.value); // echartsInstance
  console.log(chartRef);
});
// const echarts = useECharts(chartRef);
// 这里的echarts应该是一个echartsInstance
// let echarts: echarts.ECharts;
interface GraphDataItem {
  type: string;
  categories: Array<{
    name: string;
    keyword: any;
    base: string | null;
  }>;
  nodes: Array<{
    name: string;
    value: number;
    category: number;
  }>;
  links: Array<{
    source: number;
    target: number;
  }>;
}

// interface Node {
//   id: string;          // 唯一标识
//   name: string;        // 显示名称
//   children?: Node[];   // 子节点（树形原始结构）
//   collapsed?: boolean; // 是否折叠（关键控制字段）
//   depth?: number;      // 层级深度（可选，用于样式）
// }

// interface Link {
//   source: string;     // 起点ID
//   target: string;     // 终点ID
// }

// // 原始数据示例
// const fullData = {
//   nodes: [
//     { id: 'root', name: 'Root', children: [...] },
//     // 其他节点...
//   ],
//   links: [] // 初始为空，动态生成
// };

// const graphData = ref<GraphDataItem>();
const graphData = ref();

// 数据api
const GRAPH_API_PATH = `${VITE_BACKEND_ROOT_PATH}echarts`;
console.log(GRAPH_API_PATH);

// const graphData;
// const graphData2;
async function getGraphData() {
  try {
    const response = await axios.get(GRAPH_API_PATH, {
      params: {
        type: "1"
      }
    });
    graphData.value = response.data;

    // const response2 = await axios.get(GRAPH_API_PATH, {
    //   params: {
    //     type: "2"
    //   }
    // });
    // const graphData2 = response2.data;

    // return {
    //   graphData: graphData,
    //   graphData2: graphData2
    // };
    echarts.setOption({
      /** 配置项 https://echarts.apache.org/zh/option.html */
      title: {
        id: "1",
        show: true,
        text: "知识图谱",
        textStyle: {
          fontSize: 20
        },
        left: "5%",
        bottom: "150px"
      },
      legend: {
        // 图例
        left: "5%",
        bottom: "3%",
        orient: "vertical",
        data: graphData.value.legendData
      },
      series: [
        {
          type: "graph", // 图表类型为关系图
          id: "1", // 此图表id
          layout: "force", // 力引导布局
          // animation: false,
          label: {
            show: true, // 展示标签
            position: "right", // 标签位置在右侧
            formatter: "{b}" // 设定标签内容，{b}表示数据名
          },
          draggable: true, // 节点可拖动
          data: graphData.value.nodes, // 数据集
          categories: graphData.value.categories, // 设定节点分类的类目
          // categories: [
          //   {
          //     name: "core",
          //     symbolSize: 40,
          //     itemStyle: {
          //       color: "#3182f1"
          //     }
          //   },
          //   {
          //     name: "一级知识点",
          //     symbolSize: 30,
          //     itemStyle: {
          //       color: "#3182f1"
          //     }
          //   },
          //   {
          //     name: "二级知识点",
          //     symbolSize: 20,
          //     itemStyle: {
          //       color: "#00b4e5"
          //     }
          //   },
          //   {
          //     name: "三级知识点",
          //     symbolSize: 10,
          //     itemStyle: {
          //       color: "#68c63d"
          //     }
          //   },
          //   {
          //     name: "四级知识点",
          //     symbolSize: 8,
          //     itemStyle: {
          //       color: "#fa891b"
          //     }
          //   },
          //   {
          //     name: "五级知识点",
          //     symbolSize: 5,
          //     itemStyle: {
          //       color: "#8547e8"
          //     }
          //   }
          // ],
          force: {
            edgeLength: 80, // 线长
            repulsion: [100, 70, 60, 40], // 节点斥力
            gravity: 0, // 中心引力
            friction: 0.7 // 节点移动速度
          },
          roam: true, // 可以缩放
          scaleLimit: {
            // 最小与最大缩放比例限制(倍数)
            min: 0.5,
            max: 4
          },
          edges: graphData.value.links // 节点间的关系数据(键名亦可用links)
        }
        // {
        //   type: "tree",
        //   data: [graphData2],
        //   expandAndCollapse: true
        // }
      ]
    });
  } catch (error) {
    ElMessage.error("后端无返回");
  }
}

// const graphData = getGraphData().then(item => item.graphData);
// const graphData2 = getGraphData().then(item => item.graphData2);
// console.log(graphData.nodes);

getGraphData();

function updateData() {
  graphData.value.nodes.pop();
  console.log(graphData.value.categories);
  console.log("更新了");

  echarts.setOption(
    {
      series: [
        {
          type: "graph",
          id: "1",
          layout: "force",
          animation: true,
          label: {
            position: "right",
            formatter: "{b}"
          },
          draggable: true,
          data: graphData.value.nodes,
          categories: graphData.value.categories,
          force: {
            edgeLength: 5,
            repulsion: 20,
            gravity: 0.05
          },
          roam: true,
          edges: graphData.value.links
        }
      ]
    }
    // { replaceMerge: "series" }
  );
}

// 根据配置项渲染ECharts
</script>

<template>
  <div ref="chartRef" style="width: 100%; height: 100%" />
  <ElButton
    id="return-button"
    class="update_button shadow"
    round
    @click="updateData()"
    >更新
  </ElButton>
</template>

<style lang="scss" scoped>
.update_button {
  position: fixed;
}
</style>
