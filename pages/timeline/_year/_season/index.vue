<template>
  <div>
    <app-nav-bar />
    <b-container>
      <b-button-toolbar>
        <b-button-group>
          <b-button @click="setLang('jp')">日本語</b-button>
          <b-button @click="setLang('zh-hant')">繁體中文</b-button>
          <b-button @click="setLang('zh-hans')">简体中文</b-button>
          <b-button @click="setLang('en')">English</b-button>
        </b-button-group>
      </b-button-toolbar>
      <b-button-toolbar>
        <b-button-group>
          <b-button @click="setTime('jp')">日本</b-button>
          <b-button @click="setTime('anigamer')">巴哈動畫瘋</b-button>
          <b-button @click="setTime('bilibiliMainland')">B站 大陆</b-button>
          <b-button @click="setTime('bilibiliOverseas')">B站 港澳臺</b-button>
          <b-button @click="setTime('bilibiliIntl')">B站 东南亚</b-button>
          <b-button @click="setTime('iqiyiTaiwan')">愛奇異 臺灣</b-button>
          <b-button @click="setTime('iqiyiAsia')">iQIYI Asia</b-button>
          <b-button @click="setTime('funimation')">Funimation</b-button>
          <b-button @click="setTime('crunchyroll')">Crunchyroll</b-button>
        </b-button-group>
      </b-button-toolbar>
    </b-container>
    <app-timeline :timeline="inputTimeline" />
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
      inputLang: 'jp',
      inputTime: 'jp',
      inputTimeline: [] as TimelineItem[],
      timelineType: 0,
      cacheResp: {},
    }
  },
  mounted() {
    this.processBangumi()
  },
  methods: {
    setLang(lang: string) {
      this.inputLang = lang
      this.processBangumi()
    },
    setTime(time: string) {
      this.inputTime = time
      this.processBangumi()
    },
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
            this.inputTime,
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
                    this.inputTime,
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
              this.inputTime === 'jp'
                ? false
                : bangumi.premiereTime.jp ===
                  this.handleTimeSwitch(this.inputTime, bangumi.premiereTime),
            unsyncTime: bangumi.premiereTime.jp
              ? this.handleTimeSwitch(this.inputTime, bangumi.premiereTime) -
                bangumi.premiereTime.jp
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
        case 'jp':
          return title.jp
        case 'zh-hant':
          return title.tw || title.jp
        case 'zh-hans':
          return title.cn || title.jp
        case 'en':
          return title.en || title.jp
        default:
          return title.jp
      }
    },
    handleTimeSwitch(area: string, time: any): number {
      switch (area) {
        case 'jp':
          return time.jp || 0
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
