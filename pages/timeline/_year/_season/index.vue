<template>
  <div>
    <app-nav-bar />
    <b-container>
      <b-form-group label="Language">
        <b-form-radio-group
          v-model="inputLang"
          :options="optsLang"
        ></b-form-radio-group>
      </b-form-group>
      <b-form-group label="Distributor">
        <b-form-radio-group
          v-model="inputDistributor"
          :options="optsDistributor"
        ></b-form-radio-group>
      </b-form-group>
    </b-container>
    <app-timeline :timeline="inputTimeline" :input-lang="inputLang" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  Bangumi,
  RawTimelineData,
  TimelineItem,
  Title,
} from '@/assets/entities'
import AppNavBar from '~/components/AppNavBar.vue'
import AppTimeline from '~/components/AppTimeline.vue'

export default Vue.extend({
  components: { AppNavBar, AppTimeline },
  async asyncData({ params, $http }) {
    const year = params.year
    const season = params.season
    const cacheResp = await $http.$get(`/timeline/${year}/${season}/data.json`)
    return { cacheResp }
  },
  data() {
    return {
      inputLang: 'ja',
      inputDistributor: 'ja',
      inputTimeline: [] as TimelineItem[],
      timelineType: 0,
      cacheResp: {},
      optsLang: [
        { value: 'ja', text: '日本語' },
        { value: 'zh-tw', text: '中文繁體(臺灣)' },
        { value: 'zh-cn', text: '中文简体(中国)' },
        { value: 'en', text: 'English' },
      ],
      optsDistributor: [
        { value: 'ja', text: '日本' },
        { value: 'anigamer', text: '巴哈動畫瘋' },
        { value: 'bilibiliMainland', text: 'B站 大陆' },
        { value: 'bilibiliOverseas', text: 'B站 港澳臺' },
        { value: 'bilibiliIntl', text: 'B站 东南亚' },
        { value: 'iqiyiTaiwan', text: '愛奇異 臺灣' },
        { value: 'iqiyiAsia', text: 'iQIYI Asia' },
        { value: 'funimation', text: 'Funimation' },
        { value: 'crunchyroll', text: 'Crunchyroll' },
        { value: 'netflix', text: 'Netflix' },
        { value: 'netflixjp', text: 'Netflix JP' },
      ],
    }
  },
  watch: {
    inputLang(newLang: String) {
      localStorage.inputLang = newLang
    },
    inputDistributor(newDist: String) {
      this.processBangumi()
      localStorage.inputDistributor = newDist
    },
  },
  mounted() {
    if (localStorage.inputLang) {
      this.inputLang = localStorage.inputLang
    }
    if (localStorage.inputDistributor) {
      this.inputDistributor = localStorage.inputDistributor
    }
    this.processBangumi()
  },
  methods: {
    processBangumi(): void {
      this.inputTimeline = []
      const data = this.cacheResp as RawTimelineData
      const result = data.result

      result.forEach((bangumi): void => {
        const epStart: number = bangumi.episodeStart || 1
        const epLen: number = bangumi.episodesLength || 25
        if (!(this.inputDistributor in bangumi.premiereTime)) return
        const premiereTimeArea = bangumi.premiereTime[this.inputDistributor]
        const releaseEvery: number =
          premiereTimeArea.releaseEvery === undefined
            ? 86400 * 7
            : premiereTimeArea.releaseEvery
        let offset: number = 0
        for (let j = 1; j <= epLen; j++) {
          const premiereTime: number = premiereTimeArea.timestamp
          let timestamp = premiereTime + (j - 1) * releaseEvery + offset

          // unintended schedule
          if (bangumi.schedule && bangumi.schedule.length > 0) {
            const filtered = bangumi.schedule.filter(function (
              element,
              _index
            ) {
              return element.index === j
            })
            if (filtered.length > 0) {
              switch (filtered[0].type) {
                case 'scheduled':
                  if (!(this.inputDistributor in filtered[0].time)) continue
                  timestamp = filtered[0].time[this.inputDistributor]
                  // offset -= releaseEvery
                  break
                case 'delayed_normal':
                  offset += releaseEvery
                  timestamp += releaseEvery
                  break
                case 'delayed_to':
                  if (!(this.inputDistributor in filtered[0].time)) continue
                  timestamp = filtered[0].time[this.inputDistributor]
                  offset += releaseEvery
                  break
                case 'canceled':
                  j = epLen + 1
                  continue
                default:
                  break
              }
            }
          }

          if (!this.isTimeInRange(data.startTime, data.endTime, timestamp)) {
            continue
          }

          const title: Title = bangumi.title

          const obj = {
            title,
            timestamp,
            index: j + epStart - 1,
            isEnd: bangumi.episodesLength === j,
            isSync: this.isSync(bangumi),
            unsyncTime: this.calcUnsyncTime(bangumi),
          }
          this.inputTimeline.push(obj)
        }
      })
      this.inputTimeline = this.inputTimeline.sort(this.timelineSortFunc)
    },
    isSync(bangumi: Bangumi): boolean {
      if (this.inputDistributor === 'ja') return false
      if (!(this.inputDistributor in bangumi.premiereTime)) {
        return false
      }
      if (!('ja' in bangumi.premiereTime)) {
        return false
      }
      return (
        bangumi.premiereTime[this.inputDistributor].timestamp ===
        bangumi.premiereTime.ja.timestamp
      )
    },
    calcUnsyncTime(bangumi: Bangumi): number {
      if (!('ja' in bangumi.premiereTime)) return 0
      if (!(this.inputDistributor in bangumi.premiereTime)) return 0
      if (bangumi.premiereTime.ja.timestamp <= 0) return 0
      return (
        bangumi.premiereTime[this.inputDistributor].timestamp -
        bangumi.premiereTime.ja.timestamp
      )
    },
    timelineSortFunc(a1: TimelineItem, a2: TimelineItem): number {
      if (a1.timestamp > a2.timestamp) {
        return 1
      }
      if (a1.timestamp < a2.timestamp) {
        return -1
      }
      return 0
    },
    isTimeInRange(start: number, end: number, current: number): boolean {
      if (current >= start && current < end) {
        return true
      }
      return false
    },
    handleTitleSwitch(area: string, title: Title): string {
      return title[area] || title.ja || 'UNDEFINED'
    },
  },
})
</script>
