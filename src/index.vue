<template>
  <!-- <m-nav-bar :bar-style="{background: ''}" :fill-nav-bar="true"></m-nav-bar> -->
  <transition name="slider">
    <div
      class="hl-calendar-wrap"
      v-show="visibility"
    >
      <p class="hl-calendar-week align-center">
        <span>日</span>
        <span>一</span>
        <span>二</span>
        <span>三</span>
        <span>四</span>
        <span>五</span>
        <span>六</span>
      </p>
      <div
        @click="handleClick"
        class="calendar-content clearfix align-center"
        ref="calendarWrap"
      >
        <div
          :key="item.title"
          v-for="item in list"
        >
          <div class="ig-title">{{ item.title }}</div>
          <div class="calendar-content_list-wrap clearfix">
            <div
              :class="{
                'ig-range': info.inRange,
                'ig-visibility': info.tips === 'pre' || info.tips === 'next', 
                'ig-disable': info.disable,
                'ig-start': info.start,
                'ig-end': info.end,
                'ig-cursor': info.tips === 'cur'
              }"
              :date-timeStamp="info.timeStamp"
              :key="info.timeStamp"
              class="ig-cal-list"
              v-for="info in item.list"
            >
              <div>
                <span
                  class="page-table-note"
                  v-if="info.start"
                >入住</span>
                <span
                  class="page-table-note"
                  v-if="info.end"
                >离开</span>
                <span>{{ info.text }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
/**
 酒店日期选择组件

 props参数
 visibility            boolean         选择弹框是否显示      必填        默认false      
 format                string          返回的日期格式        非必填      默认：YYYY-MM-DD
 initDate              object          开始选中的日期范围    非必填      默认选中：当天日期~后天日期  传参格式{ startDate: 'xxxx-xx-xx', endDate: 'xxxx-xx-xx' }
 
 
 事件
 select-date-range     function        选择两个日期的回调函数    返回选中的日期
 

 外部可以调用方法
 this.$refs['glHoelCalendar'].getValue()                                 返回选中的日期
 this.$refs['glHoelCalendar'].getCalenderList(date, mixDate, maxDate)    重新渲染列表 date: YYYY-MM 开始月份, mixDate: YYYY-MM-DD 入住日期, maxDte: YYYY-MM-DD 离店日期
 */
import { Calender, timestampToDate } from './calendar'

let bodyEl = document.body
let top = 0

function stopBodyScroll(isFixed) {
  if (isFixed) {
    top = window.scrollY

    bodyEl.style.position = 'fixed'
    bodyEl.style.top = -top + 'px'
  } else {
    bodyEl.style.position = ''
    bodyEl.style.top = ''

    window.scrollTo(0, top) // 回到原先的top
  }
}

export default {
  props: {
    visibility: {
      type: Boolean,
      default: false
    },
    format: {
      type: String,
      default: 'YYYY-MM-DD'
    },
    initDate: {
      type: Object,
      default() {
        return {
          startDate: '',
          endDate: ''
        }
      }
    },
    showMonth: {
      type: Number,
      default: 3
    }
  },
  data() {
    return {
      // visibility: false,
      list: [],
      mixDate: null,
      maxDate: null
    }
  },
  // watch: {
  //   visibility(newValue) {
  //     stopBodyScroll(newValue)
  //   }
  // },
  // deactivated() {
  //   stopBodyScroll(false)
  // },
  created() {
  },
  mounted() {
    this.createList();
  },
  methods: {
    createList() {
      const currentTime = new Date().getTime()
      const date = timestampToDate('yyyy-MM', currentTime)
      
      const mixDate = this.initDate.startDate ? this.initDate.startDate : timestampToDate('yyyy-MM-DD', currentTime)
      const maxDate = this.initDate.endDate ? this.initDate.endDate : timestampToDate('yyyy-MM-DD', currentTime + 86400000)
      
      this.getCalenderList(date, mixDate, maxDate);
    },
    getCalenderList(date, mixDate, maxDate) {
      const list = []
      this.calender = new Calender({
        date,
        mixDate: mixDate,
        maxDate: maxDate
      })

      this.mixDate = this.calender.mixDate
      this.maxDate = this.calender.maxDate
      // debugger
      list.push({
        title: date,
        list: this.calender.getList()
      })

      for (let i = 0; i < this.showMonth - 1; i++) {
        const listDetail = this.calender.switchNextMonth()
        const month = this.calender.month >= 10 ? this.calender.month : '0' + this.calender.month

        list.push({
          title: this.calender.year + '-' + month,
          list: listDetail
        })
      }
      this.list = list
    },
    getValue() {
      let mix = Math.min(this.mixDate, this.maxDate)
      let max = Math.max(this.mixDate, this.maxDate)

      return {
        startDate: timestampToDate(this.format, mix),
        endDate: timestampToDate(this.format, max),
        seletDays: (max - mix) / 86400000 + 1
      }
    },
    handleClick(event) {
      let target = event.target
      target = this.searchElement(target, 'ig-cal-list')
      // debugger
      if (!target) return

      if (target.className.indexOf('visibility') > -1 || target.className.indexOf('disable') > -1) return

      var timeStamp = target.getAttribute('date-timestamp')

      if (timeStamp) {
        this._calHandleClick(timeStamp)
      }
    },
    _calHandleClick(selectData) {
      if (this.selecting) {
        this.selecting = false
        this.maxDate = selectData
      } else {
        this.selecting = true
        this.mixDate = selectData
        this.maxDate = null
      }

      let mix = Math.min(this.mixDate, this.maxDate)
      let max = Math.max(this.mixDate, this.maxDate)

      if (mix === max) {
        this.$emit('select-date-range', this.getValue())
        return
      } else {
        this.markRange(mix, max, this.list)
      }

      if (!this.selecting) {
        // console.log('您选择的是：', this.mixDate, this.maxDate);
        this.$emit('select-date-range', this.getValue())
      }
    },
    markRange(mixDate, maxDate, rows) {
      for (let item of rows) {
        item.list.forEach((info) => {
          var time = info.timeStamp
          info.inRange = mixDate && time >= mixDate && time <= maxDate

          if (!mixDate && maxDate) {
            info.start = time === maxDate
            info.end = false
          } else {
            info.start = mixDate && time === mixDate
            info.end = maxDate && time === maxDate
          }
        })
      }

      // console.log(rows);
    },
    /**
     * 搜索元素,解决事件委托颗粒度问题
     * @param  {[type]} el   [description]
     * @param  {[type]} attr [description]
     * @return {[type]}      [description]
     */
    searchElement: function (el, attr) {
      var touchTarget = el,
        count = 0,
        endTarget = 'class'

      while (touchTarget) {
        count++

        if (count > 5 || touchTarget.nodeName.toLowerCase() == 'html') {
          touchTarget = null

          return touchTarget
        } else if (touchTarget.getAttribute(endTarget) != null && touchTarget.getAttribute(endTarget).indexOf(attr) > -1) {
          return touchTarget
        }

        touchTarget = touchTarget.parentNode
      }
    }
  }
}
</script>
<style>
.slider-enter-active,
.slider-leave-active {
  transition: all 0.3s ease;
}
.slider-enter,
.slider-leave-to {
  transform: translateX(100%);
}
.clearfix {
  zoom: 1;
}
.clearfix:after {
  content: '';
  display: block;
  clear: both;
}
.ig-visibility {
  visibility: hidden;
}
.align-center {
  text-align: center;
}
.ig-title {
  background: hsla(210, 8%, 95%, 0.9);
  position: sticky;
  top: 0;
  z-index: 1;
  height: 30px;
  line-height: 30px;
}
.hl-calendar-wrap {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  overflow: auto;
  background: #fff;
  z-index: 1000;
}
.hl-calendar-wrap > .hl-calendar-week {
  height: 30px;
  display: flex;
  line-height: 30px;
  background: #fafafa;
  font-size: 14px;
  margin: 0;
  padding: 0;
}

.hl-calendar-wrap > .hl-calendar-week > span {
  flex: 1;
}

.ig-cal-list {
  float: left;
  width: 14.2%;
  margin: 5px 0;
  position: relative;
  height: 60px;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
}
.ig-cal-list:nth-of-type(7n + 1),
.ig-cal-list:nth-of-type(7n + 7) {
  color: #fb8800 !important;
}
.ig-cal-list.ig-disable {
  color: #999 !important;
}
.ig-range {
  background: #ffecc1;
}

.ig-start,
.ig-end {
  background: #eac05e;
}

.hl-calendar-wrap .ig-start,
.hl-calendar-wrap .ig-end {
  color: #fff !important;
}

.cal-list > div {
  width: 100%;
}
.ig-cal-list .page-table-note {
  display: block;
  font-size: 12px;
}
</style>