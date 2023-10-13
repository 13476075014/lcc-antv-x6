<template>
  <div id="containerER"></div>
</template>

<script>
import { Graph } from"@antv/x6"
import "@antv/x6-vue-shape";
import blockComp from "./components/node.vue"
import mockData from "./json/hasDealEr.js"
const variables = {
  primaryColor:"blue"
}
export default {
  data() {
    return {
        mainList:{},
        mockEntityData: mockData,
    };
  },
  created() {
    
  },
  mounted(){
    this.initGraphNode();
  },
  methods: {
    initGraph() {
      const mainGraph = new Graph({
        container: document.getElementById("containerER"),
        // autoResize: true,//自动适应宽高
        height:600,
        background: {
          color: "#F7F7F7", // 设置画布背景颜色
        },
        scroller: {//使画布具备滚动、平移、居中、缩放等能力 https://x6.antv.vision/zh/docs/tutorial/basic/scroller
          autoResize:true,
          enabled: true,
          pageVisible: false,//是否分页，默认为 false。
          pageBreak: false,//是否显示分页符，默认为 false。
          pannable: true,//是否启用画布平移能力（在空白位置按下鼠标后拖动平移画布），默认为 false。
          scrollToContent: true,
        },
        /** 画布网格 */
        grid: {
          visible: true,
          //   size: 20,
          //   type: 'doubleMesh',
          args: [
            {
              color: "#888",
              // thickness: 1,
            },
            // {
            //   color: '#ddd',
            //   thickness: 1,
            //   factor: 4,
            // },
          ],
        },
        /** 全局连线配置 */
        // connecting: {
        //   anchor: 'midSide',
        //   router: {
        //     name: 'er'
        //   },
        //   connector: {
        //     name: 'smooth'
        //   }
        // },
        connecting: {
          connector: {
            name: "rounded",
          },
          router: {
            name: "er",
            args: {
              direction: "H",
            },
          },
        },
        /** 对齐线 */
        snapline: {
          enabled: true,
        },
        /** 滚轮缩放 */
        mousewheel: {
          enabled: true,
          zoomAtMousePosition: false,
          factor: 1.1,
          modifiers: "ctrl",
        },
      });
      mainGraph.fromJSON(this.mainList);
      mainGraph.scrollToContent({ animation: { duration: 300 } });
    },
    initGraphNode() {
      const nodeList = [];
      const nodeEdgesList = [];
      Graph.registerEdge(
        "custom-edge-label",
        {
          inherit: "edge",
          defaultLabel: {
            markup: [
              {
                tagName: "rect",
                selector: "body",
              },
              {
                tagName: "text",
                selector: "label",
              },
            ],
            attrs: {
              label: {
                fill: variables.primaryColor,
                fontSize: 12,
                textAnchor: "middle",
                textVerticalAnchor: "middle",
                pointerEvents: "none",
              },
              body: {
                ref: "label",
                fill: "#fff",
                stroke: variables.primaryColor,
                strokeWidth: 1,
                rx: 4,
                ry: 4,
                refWidth: "120%",
                refHeight: "140%",
                refX: "-10%",
                refY: "-20%",
              },
            },
            position: {
              distance: 100,
            },
          },
        },
        true
      );

      let firstNode = {};

      //处理主表的哪些字段需要建立连接桩
      let allL = this.mockEntityData.map((item,i) => {
        //处理node展示的位置
        if(item.isMain){
          item.x = 20;
          item.y = (this.mockEntityData.length * 350)/2
        }else{
          item.x = (i+1)%2 === 0 ? 600 : 800;
          item.y = i * 400
        }

        const ii = this.mockEntityData[0].fieldList.findIndex(
          (f) => item.label && f.attributeName == item.label
        );
        return {
          label: item.label,
          index: ii + 1,
        };
      });
      allL = allL.filter((item) => item.label);

      this.mockEntityData.forEach((v) => {
        const { entityId, x, y, width, height, label } = v;
        const nodeData = {
          shape: "vue-shape",
          x,
          y,
          width,
            // height,
          id: entityId,
          component: {
            inject: ["getNode"], //注入全局获取当前节点得方法
            template: `<block-comp :nodeData="testNum"></block-comp>`,
            data() {
              return {
                testNum: v,
              };
            },
            mounted() {
              if (entityId == 1) {
                //这里可以手动修改连接桩的一些信息
                console.log(this.$children[0].$refs,"rrrrrr")
                // this.getNode().setPortProp("1-port-1","args",{y:250})
              }
            },
            components: {
              blockComp,
            },
          },
        };
        if (entityId == 1) {
          nodeData.ports = {
            groups: {
              bottom: {
                position: [420, 140],
                attrs: {
                  circle: {
                    stroke: "green",
                    strokeWidth: 1,
                    r: 4,
                    magnet: false,
                  },
                },
              },
            },
            items:allL.map((item) => {
                    return {
                      id: entityId + "-port-" + item.label,
                      group: "bottom",
                      args: {
                        y: 131 + item.index * 22 - 14,//动态计算出连接桩应该在的Y轴位置
                      },
                    };
                  })
          };
        } else {
          nodeData.height = height;
        }
        if (entityId && entityId !== "1") {
          const nodeEdges = {
            source: { cell: "1", port: `1-port-${label}` }, // String，必须，起始节点 id
            target: `${entityId}`, // String，必须，目标节点 id
            shape: "custom-edge-label",
            label,
            attrs: {
              line: {
                stroke: variables.primaryColor,
              },
            },
            router: {
              // name: 'manhattan',
              // args: { 
              //   startDirections: ['top'],
              //   endDirections: ['left'],
              // },
              name: 'metro',
              args: { 
                startDirections: ['right'],
                endDirections: ['left'],
              },
              // name: "er",
              // args: {
              //   offset: "center",
              // },
            },
          };
          nodeEdgesList.push(nodeEdges);
        }
        if (nodeData.id == 1) {
          firstNode = nodeData;
        } else {
          nodeList.push(nodeData);
        }
      });
      nodeList.push(firstNode);
      this.mainList.nodes = nodeList;
      this.mainList.edges = nodeEdgesList;

      this.initGraph();
    },
  },
};
</script>

<style>
</style>