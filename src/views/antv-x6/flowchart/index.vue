<template>
  <div id="containerER">
    <div id="stencil">

    </div>
    <div id="graph-container">

    </div>
  </div>
</template>

<script>
import { Graph, Shape, Addon } from"@antv/x6"
import "@antv/x6-vue-shape";
// import blockComp from "./components/node.vue"
// import mockData from "./json/hasDealEr.js"

export default {
  data() {
    return {
        mainList:{},
        // mockEntityData: mockData,
    };
  },
  created() {
    
  },
  mounted(){
    this.init();
  },
  methods: {
    init(){
        this.initGraph();
        this.initStencil();
        this.initGraphEvent();
        this.initNode();
    },
    initGraph(){
        // #region 初始化画布
        const graph = new Graph({
            container: document.getElementById('graph-container'),
            grid: true,
            mousewheel: {
                enabled: true,
                zoomAtMousePosition: true,
                modifiers: 'ctrl',
                minScale: 0.5,
                maxScale: 3,
            },
            connecting: {
                router: {
                name: 'manhattan',
                args: {
                    padding: 1,
                },
                },
                connector: {
                name: 'rounded',
                args: {
                    radius: 8,
                },
                },
                anchor: 'center',
                connectionPoint: 'anchor',
                allowBlank: false,
                snap: {
                radius: 20,
                },
                createEdge() {
                return new Shape.Edge({
                    attrs: {
                    line: {
                        stroke: '#A2B1C3',
                        strokeWidth: 2,
                        targetMarker: {
                        name: 'block',
                        width: 12,
                        height: 8,
                        },
                    },
                    },
                    zIndex: 0,
                })
                },
                validateConnection({ targetMagnet }) {
                return !!targetMagnet
                },
            },
            highlighting: {
                magnetAdsorbed: {
                name: 'stroke',
                args: {
                    attrs: {
                    fill: '#5F95FF',
                    stroke: '#5F95FF',
                    },
                },
                },
            },
            resizing: true,
            rotating: true,
            selecting: {
                enabled: true,
                rubberband: true,
                showNodeSelectionBox: true,
            },
            snapline: true,
            keyboard: true,
            clipboard: true,
        })
        this.graph = graph;
        // #endregion
    },
    initStencil(){
        // #region 初始化 stencil
        const graph = this.graph;
        const stencil = new Addon.Stencil({
            title: '流程图',
            target: graph,
            stencilGraphWidth: 200,
            stencilGraphHeight: 180,
            collapsable: true,
            groups: [
                {
                title: '基础流程图',
                name: 'group1',
                },
                {
                title: '系统设计图',
                name: 'group2',
                graphHeight: 250,
                layoutOptions: {
                    rowHeight: 70,
                },
                },
            ],
            layoutOptions: {
                columns: 2,
                columnWidth: 80,
                rowHeight: 55,
            },
            getDragNode: (node) => node.clone({ keepId: true }), //保持节点拖拽后id不变
            getDropNode: (node) => node.clone({ keepId: true }), //保持节点拖拽后id不变
            // 判断当前节点是否可以放入目标画布
            validateNode(node,opt){
                console.log(node,opt,"sssss")
                const {sourceNode,targetGraph} = opt;
                if(sourceNode.id=="custom-start"){
                    const s = targetGraph.getCellById("custom-start");
                    console.log(targetGraph.getCells(),"ffff")
                    if(s){
                        alert("一个画布只能有一个开始")
                        return false
                    }
                }
                return true;
            }
        })
        document.getElementById('stencil').appendChild(stencil.container)
        this.stencil = stencil;
        // #endregion

    },
    initNode(){
        // #region 初始化图形
        const graph = this.graph;
        const stencil = this.stencil;
        const ports = {
        groups: {
            top: {
            position: 'top',
            attrs: {
                circle: {
                r: 4,
                magnet: true,
                stroke: '#5F95FF',
                strokeWidth: 1,
                fill: '#fff',
                style: {
                    visibility: 'hidden',
                },
                },
            },
            },
            right: {
            position: 'right',
            attrs: {
                circle: {
                r: 4,
                magnet: true,
                stroke: '#5F95FF',
                strokeWidth: 1,
                fill: '#fff',
                style: {
                    visibility: 'hidden',
                },
                },
            },
            },
            bottom: {
            position: 'bottom',
            attrs: {
                circle: {
                r: 4,
                magnet: true,
                stroke: '#5F95FF',
                strokeWidth: 1,
                fill: '#fff',
                style: {
                    visibility: 'hidden',
                },
                },
            },
            },
            left: {
            position: 'left',
            attrs: {
                circle: {
                r: 4,
                magnet: true,
                stroke: '#5F95FF',
                strokeWidth: 1,
                fill: '#fff',
                style: {
                    visibility: 'hidden',
                },
                },
            },
            },
        },
        items: [
            {
            group: 'top',
            },
            {
            group: 'right',
            },
            {
            group: 'bottom',
            },
            {
            group: 'left',
            },
        ],
        }

        Graph.registerNode(
        'custom-rect',
        {
            inherit: 'rect',
            width: 66,
            height: 36,
            attrs: {
            body: {
                strokeWidth: 1,
                stroke: '#5F95FF',
                fill: '#EFF4FF',
            },
            text: {
                fontSize: 12,
                fill: '#262626',
            },
            },
            ports: { ...ports },
        },
        true,
        )

        Graph.registerNode(
        'custom-polygon',
        {
            inherit: 'polygon',
            width: 66,
            height: 36,
            attrs: {
            body: {
                strokeWidth: 1,
                stroke: '#5F95FF',
                fill: '#EFF4FF',
            },
            text: {
                fontSize: 12,
                fill: '#262626',
            },
            },
            ports: {
            ...ports,
            items: [
                {
                group: 'top',
                },
                {
                group: 'bottom',
                },
            ],
            },
        },
        true,
        )

        Graph.registerNode(
        'custom-circle',
        {
            inherit: 'circle',
            width: 45,
            height: 45,
            attrs: {
            body: {
                strokeWidth: 1,
                stroke: '#5F95FF',
                fill: '#EFF4FF',
            },
            text: {
                fontSize: 12,
                fill: '#262626',
            },
            },
            ports: { ...ports },
        },
        true,
        )

        Graph.registerNode(
        'custom-image',
        {
            inherit: 'rect',
            width: 52,
            height: 52,
            markup: [
            {
                tagName: 'rect',
                selector: 'body',
            },
            {
                tagName: 'image',
            },
            {
                tagName: 'text',
                selector: 'label',
            },
            ],
            attrs: {
            body: {
                stroke: '#5F95FF',
                fill: '#5F95FF',
            },
            image: {
                width: 26,
                height: 26,
                refX: 13,
                refY: 16,
            },
            label: {
                refX: 3,
                refY: 2,
                textAnchor: 'left',
                textVerticalAnchor: 'top',
                fontSize: 12,
                fill: '#fff',
            },
            },
            ports: { ...ports },
        },
        true,
        )

        const r1 = graph.createNode({
        shape: 'custom-rect',
        label: '开始',
        attrs: {
            body: {
            rx: 20,
            ry: 26,
            },
        },
        })
        const r2 = graph.createNode({
            shape: 'custom-rect',
            label: '过程',
        })
        const r3 = graph.createNode({
        shape: 'custom-rect',
        attrs: {
            body: {
            rx: 6,
            ry: 6,
            },
        },
        label: '可选过程',
        })
        const r4 = graph.createNode({
        shape: 'custom-polygon',
        attrs: {
            body: {
            refPoints: '0,10 10,0 20,10 10,20',
            },
        },
        label: '决策',
        })
        const r5 = graph.createNode({
        shape: 'custom-polygon',
        attrs: {
            body: {
            refPoints: '10,0 40,0 30,20 0,20',
            },
        },
        label: '数据',
        })
        const r6 = graph.createNode({
        shape: 'custom-circle',
        label: '连接',
        })
        
        const startNode = {
            width:100,
            height:45,
            shape:"html",
            ports: { ...ports },
            id:"custom-start",
            x:400,
            y:100,
            html() {
                const wrap = document.createElement('div')
                wrap.innerHTML = `
                <span href="#" class="my-btn">
                    开始
                </span>`
                return wrap
            },
        }
        const r7 = graph.createNode(startNode)

        stencil.load([r1, r2,r7, r3, r4, r5, r6], 'group1');

        graph.addNode(startNode)
        const imageShapes = [
        {
            label: 'Client',
            image:
            'https://gw.alipayobjects.com/zos/bmw-prod/687b6cb9-4b97-42a6-96d0-34b3099133ac.svg',
        },
        {
            label: 'Http',
            image:
            'https://gw.alipayobjects.com/zos/bmw-prod/dc1ced06-417d-466f-927b-b4a4d3265791.svg',
        },
        {
            label: 'Api',
            image:
            'https://gw.alipayobjects.com/zos/bmw-prod/c55d7ae1-8d20-4585-bd8f-ca23653a4489.svg',
        },
        {
            label: 'Sql',
            image:
            'https://gw.alipayobjects.com/zos/bmw-prod/6eb71764-18ed-4149-b868-53ad1542c405.svg',
        },
        {
            label: 'Clound',
            image:
            'https://gw.alipayobjects.com/zos/bmw-prod/c36fe7cb-dc24-4854-aeb5-88d8dc36d52e.svg',
        },
        {
            label: 'Mq',
            image:
            'https://gw.alipayobjects.com/zos/bmw-prod/2010ac9f-40e7-49d4-8c4a-4fcf2f83033b.svg',
        },
        ]
        const imageNodes = imageShapes.map((item) =>
        graph.createNode({
            shape: 'custom-image',
            label: item.label,
            attrs: {
            image: {
                'xlink:href': item.image,
            },
            },
        }),
        )
        stencil.load(imageNodes, 'group2')
        // #endregion

    },
    initGraphEvent(){
        // #region 快捷键与事件
        const graph = this.graph;
        // copy cut paste
        graph.bindKey(['meta+c', 'ctrl+c'], () => {
        const cells = graph.getSelectedCells()
        if (cells.length) {
            graph.copy(cells)
        }
        return false
        })
        graph.bindKey(['meta+x', 'ctrl+x'], () => {
        const cells = graph.getSelectedCells()
        if (cells.length) {
            graph.cut(cells)
        }
        return false
        })
        graph.bindKey(['meta+v', 'ctrl+v'], () => {
        if (!graph.isClipboardEmpty()) {
            const cells = graph.paste({ offset: 32 })
            graph.cleanSelection()
            graph.select(cells)
        }
        return false
        })

        //undo redo
        graph.bindKey(['meta+z', 'ctrl+z'], () => {
        if (graph.history.canUndo()) {
            graph.history.undo()
        }
        return false
        })
        graph.bindKey(['meta+shift+z', 'ctrl+shift+z'], () => {
        if (graph.history.canRedo()) {
            graph.history.redo()
        }
        return false
        })

        // select all
        graph.bindKey(['meta+a', 'ctrl+a'], () => {
        const nodes = graph.getNodes()
        if (nodes) {
            graph.select(nodes)
        }
        })

        //delete
        graph.bindKey('backspace', () => {
        const cells = graph.getSelectedCells()
        if (cells.length) {
            graph.removeCells(cells)
        }
        })

        // zoom
        graph.bindKey(['ctrl+1', 'meta+1'], () => {
        const zoom = graph.zoom()
        if (zoom < 1.5) {
            graph.zoom(0.1)
        }
        })
        graph.bindKey(['ctrl+2', 'meta+2'], () => {
        const zoom = graph.zoom()
        if (zoom > 0.5) {
            graph.zoom(-0.1)
        }
        })

        // 控制连接桩显示/隐藏
        const showPorts = (ports, show) => {
            for (let i = 0, len = ports.length; i < len; i = i + 1) {
                ports[i].style.visibility = show ? 'visible' : 'hidden'
            }
        }
        graph.on('node:mouseenter', () => {
            const container = document.getElementById('graph-container')
            const ports = container.querySelectorAll(
                '.x6-port-body',
            )
            showPorts(ports, true)
        })
        graph.on('node:mouseleave', () => {
            const container = document.getElementById('graph-container')
            const ports = container.querySelectorAll(
                '.x6-port-body',
            )
            showPorts(ports, false)
        })
        // #endregion

    }
  },
};
</script>

<style scoped lang="less">
    #containerER {
      display: flex;
      height:700px;
      border: 1px solid #dfe3e8;
    }
    #stencil {
      width: 180px;
      height: 100%;
      position: relative;
      border-right: 1px solid #dfe3e8;
    }
    #graph-container {
      width: calc(100% - 180px);
      flex:1;
      height: 100%;
    }
    .x6-widget-stencil  {
      background-color: #fff;
    }
    .x6-widget-stencil-title {
      background-color: #fff;
    }
    .x6-widget-stencil-group-title {
      background-color: #fff !important;
    }
    .x6-widget-transform {
      margin: -1px 0 0 -1px;
      padding: 0px;
      border: 1px solid #239edd;
    }
    .x6-widget-transform > div {
      border: 1px solid #239edd;
    }
    .x6-widget-transform > div:hover {
      background-color: #3dafe4;
    }
    .x6-widget-transform-active-handle {
      background-color: #3dafe4;
    }
    .x6-widget-transform-resize {
      border-radius: 0;
    }
    .x6-widget-selection-inner {
      border: 1px solid #239edd;
    }
    .x6-widget-selection-box {
      opacity: 0;
    }
</style>