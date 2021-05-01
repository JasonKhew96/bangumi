<template>
  <div>
    <b-container class="timelines">
      <b-row>
        <b-col
          v-for="(tl, i) in timelineDay"
          :id="isToday(tl.day) ? 'today' : ''"
          :key="i"
          cols="12"
          md="4"
          class="timeline"
        >
          <p class="date">{{ datets2text(tl.day) }}</p>
          <b-list-group>
            <b-list-group-item
              v-for="(series, j) in tl.series"
              :key="j"
              class="timeline-bangumi"
              :variant="isTimePassed(series.timestamp) ? 'light' : ''"
            >
              {{ datets2time(series.timestamp) }}
              <b-badge :variant="series.isEnd ? 'danger' : ''">{{
                series.index
              }}</b-badge>
              {{ getTitle(series.title) }}
              <b-badge v-if="series.isSync" variant="success">SYNC</b-badge>
              <b-badge v-if="series.unsyncTime != 0">{{
                humanizeSeconds(series.unsyncTime)
              }}</b-badge>
            </b-list-group-item>
          </b-list-group>
        </b-col>
      </b-row>
    </b-container>
    <div
      id="toTopBtn"
      :class="scY <= 256 ? 'hide floatBtn' : 'floatBtn'"
      @click="toTop"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#4a5568"
        stroke-width="1"
        stroke-linecap="square"
        stroke-linejoin="arcs"
      >
        <path d="M18 15l-6-6-6 6" />
      </svg>
    </div>
    <div
      id="toTodayBtn"
      :class="scY > 256 ? 'hide floatBtn' : 'floatBtn'"
      @click="toToday"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        transform="rotate(180)"
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#4a5568"
        stroke-width="1"
        stroke-linecap="square"
        stroke-linejoin="arcs"
      >
        <path d="M18 15l-6-6-6 6" />
      </svg>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { TimelineDay, TimelineItem, Title } from '@/assets/entities'
import moment from 'moment'

export default Vue.extend({
  props: {
    timeline: {
      type: Array as PropType<Array<TimelineItem>>,
      default: () => [],
    },
    inputLang: {
      type: String,
      default: 'ja',
    },
  },
  data() {
    return {
      timelineDay: [] as TimelineDay[],
      scTimer: null as any,
      scY: 0,
    }
  },
  computed: {},
  watch: {
    timeline() {
      this.processProp()
    },
    inputLang() {
      moment.locale(this.inputLang)
      // this.$forceUpdate()
    },
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
  },
  methods: {
    handleScroll() {
      this.scY = window.scrollY
    },
    toTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    },
    getTitle(title: Title): string {
      return title[this.inputLang] || title.ja
    },
    toToday() {
      const el = document.getElementById('today')
      if (el != null) {
        el.scrollIntoView({ behavior: 'smooth' })
      }
    },
    datets2text: (time: number) => {
      return moment.unix(time).format('MM-DD (dddd)')
    },
    datets2time: (time: number) => {
      return moment.unix(time).format('HH:mm')
    },
    isTimePassed: (time: number) => {
      return new Date().getTime() / 1000 >= time
    },
    isToday: (time: number): boolean => {
      const todayStartTime = new Date()
      todayStartTime.setHours(0, 0, 0, 0)
      const todayStartTs = todayStartTime.getTime() / 1000
      return time === todayStartTs
    },
    humanizeSeconds(secs: number): string {
      return moment.duration(secs, 'seconds').humanize()
    },
    processProp(): TimelineDay[] {
      this.timelineDay = []
      if (this.timeline.length <= 0) {
        return []
      }
      let startTime = new Date(this.timeline[0].timestamp * 1000)
      startTime.setHours(0, 0, 0, 0)
      let tmpTlDay: TimelineDay = {
        day: startTime.getTime() / 1000,
        series: [],
      }
      this.timeline.forEach((e): void => {
        if (e.timestamp >= startTime.getTime() / 1000 + 86400) {
          this.timelineDay.push(tmpTlDay)
          startTime = new Date(e.timestamp * 1000)
          startTime.setHours(0, 0, 0, 0)
          tmpTlDay = {
            day: startTime.getTime() / 1000,
            series: [],
          }
        }
        tmpTlDay.series.push(e)
      })
      this.timelineDay.push(tmpTlDay)
      return this.timelineDay
    },
  },
})
</script>

<style scoped>
.aired {
  font-weight: bold;
}
.date {
  margin: 8px 4px;
}
.timeline-bangumi {
  padding: 4px;
}
.timeline-bangumi > p {
  margin: 0px;
}
.floatBtn {
  position: fixed;
  bottom: 20px;
  right: 30px;
  z-index: 99;
}
.hide {
  display: none;
}
</style>
