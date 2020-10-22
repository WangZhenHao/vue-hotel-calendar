# 基于vue2.x的酒店日历选择插件

[git仓库地址](https://github.com/WangZhenHao/vue-hotel-calendar)

[演示地址](https://wangzhenhao.github.io/vue-hotel-calendar/example/dist/index.html)
##### 效果图

![image](https://github.com/WangZhenHao/vue-hotel-calendar/blob/master/example/static/1.jpg)
![image](https://github.com/WangZhenHao/vue-hotel-calendar/blob/master/example/static/2.jpg)


#### 快速使用
```
安装：
npm install -S vue-hotel-calendar 
或者
yarn add vue-hotel-calendar

使用：
import hotelCaldendar from 'vue-hotel-calendar'
```
#### 示例代码
```
<template>
  <div>
    <h2>在移动端模式查看</h2>
    <input
      :value="dateRange"
      @click="showCalendar"
      readonly
      type="text"
      class="input-wrap"
      placeholder="点击唤起日历组件"
    />
    <hotel-calendar
      ref="hotelCalendar"
      :visibility="show"
      @select-date-range="selectDateRangeHandle"
      :show-month="4"
      format="YYYY-M-D"
    ></hotel-calendar>
  </div>
</template>
<script>
import hotelCalendar from 'vue-hotel-calendar'

export default {
  components: {
    hotelCalendar
  },
  data() {
    return {
      show: false,
      dateRange: ''
    }
  },
  mounted() {
    var e = this.$refs.hotelCalendar.getValue()
    this.selectDateRangeHandle(e)
  },
  methods: {
    showCalendar() {
      this.show = true;
    },
    selectDateRangeHandle(e) {
      this.show = false;
      this.dateRange = `入住${e.startDate}离店${e.endDate}, 住${e.seletDays - 1}晚`
    }
  }
}
</script>
<style>
h2 {
  text-align: center;
}
.input-wrap {
  width: 300px;
  height: 36px;
  box-sizing: border-box;
  border-radius: 10px;
  outline: none;
  border:  1px solid #666;
  padding-left: 10px;
  display: block;
  margin: auto;
}
</style>

```

####  使用描述：


| props参数 | 类型 | 描述 | 是否必填 | 格式|
| -- | --- | --- | -- |--- |
| visibility | boolean | 选择弹框是否显示 | 必填  |默认：false |
| -- | --- | --- | -- |--- |
| format | String | 返回的日期格式 | 非必填 | 默认：YYYY-MM-DD|
| -- | --- | --- | -- |--- |
| initDate | object | 初始化选中的日期范围 | 非必填|  默认选中：当天日期~后天日期,传参格式{ startDate: 'xxxx-xx-xx', endDate: 'xxxx-xx-xx' }|
| -- | --- | --- | -- |--- |
| showMonth | Number | 显示多少个月 | 非必填 | 默认：3 |
| -- | --- | --- | -- |--- |


| 回调函数 | 类型 | 描述 | 格式 |
| --- | --- | --- | --- | --- |
| select-date-range | function | 选择两个日期的后的回调函数，返回选中的日期 | function(res) {....} |
| -- | --- | --- | -- |--- |

| 内置方法 | 描述 | 
| --- | --- | --- | --- |
| this.$refs['hotelCalendar'].getValue()  | 返回选中的日期,格式： {startDate: YYYY-MM-DD,endDate: YYYY-MM-DD,seletDays: Days }|
| --- | --- | --- | --- |
|this.$refs['hotelCalendar'].getCalenderList(date, mixDate, maxDate)|重新渲染列表， 格式：date: YYYY-MM 开始月份, mixDate: YYYY-MM-DD，maxDate: 'YYYY-MM-DD'|
| -- | --- | --- | -- |--- |
