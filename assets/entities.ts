export interface TimelineItem {
  title: string
  timestamp: number
  index: number
  isEnd: boolean
  isSync: boolean
  unsyncTime: number
}

export interface TimelineObject {
  jp: TimelineItem[]
  anigamer: TimelineItem[]
  bilibiliIntl: TimelineItem[]
  bilibiliMainland: TimelineItem[]
  bilibiliOverseas: TimelineItem[]
}

export interface TimelineDay {
  day: number
  series: TimelineItem[]
}

export interface RawTimelineData {
  status: number
  startTime: number
  endTime: number
  result: {
    title: {
      jp: string
      tw: string
      cn: string
      en: string
    }
    releaseEvery: number
    premiereTime: {
      jp: number
      anigamer: number
      bilibiliIntl: number
      bilibiliMainland: number
      bilibiliOverseas: number
      iqiyiTaiwan: number
      iqiyiAsia: number
      funimation: number
      crunchyroll: number
    }
    schedule: {
      type: string
      index: number
      time: {
        jp: number
        anigamer: number
        bilibiliIntl: number
        bilibiliMainland: number
        bilibiliOverseas: number
        iqiyiTaiwan: number
        iqiyiAsia: number
        funimation: number
        crunchyroll: number
      }
    }[]
    episodesLength: number
    episodeStart: number
  }[]
}
