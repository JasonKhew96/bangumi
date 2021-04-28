<template>
  <b-container class="timelines">
    <b-row>
      <b-col
        v-for="(tl, i) in timelineDay"
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
            {{ series.title }}
            <b-badge v-if="series.isSync" variant="success">SYNC</b-badge>
            <b-badge v-if="series.unsyncTime != 0">{{
              humanizeSeconds(series.unsyncTime)
            }}</b-badge>
          </b-list-group-item>
        </b-list-group>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { TimelineDay, TimelineItem } from '@/assets/entities'
import moment from 'moment'

export default Vue.extend({
  props: {
    timeline: {
      type: Array as PropType<Array<TimelineItem>>,
      default: () => [],
    },
  },
  data() {
    return {
      timelineDay: [] as TimelineDay[],
    }
  },
  watch: {
    timeline() {
      this.processProp()
    },
  },
  mounted() {},
  methods: {
    datets2text: (time: number) => {
      return moment.unix(time).format('MM-DD')
    },
    datets2time: (time: number) => {
      return moment.unix(time).format('HH:mm')
    },
    isTimePassed: (time: number) => {
      return new Date().getTime() / 1000 >= time
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
</style>
