<template>
  <div :class="`wrapper ${nodeData.isMain ? 'isMain' : ''}`">
    <div class="header">
        <p>{{nodeData.name}}</p>
        <p>区域名称：{{nodeData.cnName}}</p>
    </div>
    <div class="list">
        <div class="item">
          <span>字段英文名</span>
          <span>字段中文名</span>
          <span>字段类型</span>
        </div>
        <div class="scroll">
          <div :ref="`${nodeData.isMain ? item.attributeName+'_ref' : ''}`" v-for="item in nodeData.fieldList" :key="item.columnId" class="item">
            <span>{{item.attributeName || item.columnName}}</span>
            <span>{{item.fieldTitle || item.title}}</span>
            <span>{{item.typeCnName || item.dataType}}</span>
          </div>
        </div>
        
    </div>
  </div>
</template>

<script>
export default {
  props:["nodeData"]
}
</script>

<style lang="less" scoped>
.wrapper{
  background:white;
  padding:20px 0;
  display: flex;
  flex-direction: column;
  &:not(.isMain){
    width:100%;
    height:100%;
  }
  &.isMain{
    position: relative;
  }
    .header{
      
    }
    .list{
      flex:1;
      display: flex;
      flex-direction: column;
      max-height:calc(100% - 90px);
      &>.item{
        padding:0 20px;
      }
      .scroll{
        flex:1;
        overflow: auto;
        overflow-x: hidden;
        max-height: calc(100% - 22px);
        padding:0 20px;
      }
      .item{
        display: flex;
        align-items: center;
        justify-content: space-between;
        span{
          width: 33.3%;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
          text-align: left;
          padding-right:5px;
        }
      }
    }
}

</style>