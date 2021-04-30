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
import { RawTimelineData, TimelineItem } from '@/assets/entities'
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
      ],
    }
  },
  watch: {
    inputLang() {
      this.processBangumi()
    },
    inputDistributor() {
      this.processBangumi()
    },
  },
  mounted() {
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
        const releaseEvery: number = bangumi.releaseEvery || 86400 * 7
        let offset: number = 0
        for (let j = 1; j <= epLen; j++) {
          const premiereTime: number = this.handleTimeSwitch(
            this.inputDistributor,
            bangumi.premiereTime
          )
          if (premiereTime === 0) continue
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
                  timestamp = this.handleTimeSwitch(
                    this.inputDistributor,
                    filtered[0].time
                  )
                  offset -= releaseEvery
                  break
                case 'delayed_normal':
                  offset += releaseEvery
                  timestamp += releaseEvery
                  break
                case 'delayed_to':
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

          const title: string = this.handleTitleSwitch(
            this.inputLang,
            bangumi.title
          )
          const obj = {
            title,
            timestamp,
            index: j + epStart - 1,
            isEnd: bangumi.episodesLength === j,
            isSync:
              this.inputDistributor === 'ja'
                ? false
                : bangumi.premiereTime.ja ===
                  this.handleTimeSwitch(
                    this.inputDistributor,
                    bangumi.premiereTime
                  ),
            unsyncTime: bangumi.premiereTime.ja
              ? this.handleTimeSwitch(
                  this.inputDistributor,
                  bangumi.premiereTime
                ) - bangumi.premiereTime.ja
              : 0,
          }
          this.inputTimeline.push(obj)
        }
      })
      this.inputTimeline = this.inputTimeline.sort(this.timelineSortFunc)
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
    handleTitleSwitch(area: string, title: any): string {
      switch (area) {
        case 'ja':
          return title.ja
        case 'zh-tw':
          return title.tw || title.ja
        case 'zh-cn':
          return title.cn || title.ja
        case 'en':
          return title.en || title.ja
        default:
          return title.ja
      }
    },
    handleTimeSwitch(area: string, time: any): number {
      switch (area) {
        case 'ja':
          return time.ja || 0
        case 'anigamer':
          return time.anigamer || 0
        case 'bilibiliMainland':
          return time.bilibiliMainland || 0
        case 'bilibiliOverseas':
          return time.bilibiliOverseas || 0
        case 'bilibiliIntl':
          return time.bilibiliIntl || 0
        case 'iqiyiTaiwan':
          return time.iqiyiTaiwan || 0
        case 'iqiyiAsia':
          return time.iqiyiAsia || 0
        case 'funimation':
          return time.funimation || 0
        case 'crunchyroll':
          return time.crunchyroll || 0
        default:
          return 0
      }
    },
  },
})
</script>
