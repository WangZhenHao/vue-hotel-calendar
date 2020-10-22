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
