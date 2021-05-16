export interface Title {
  [key: string]: string
}

export interface PremiereTime {
  [key: string]: {
    releaseEvery: number
    timestamp: number
  }
}

export interface ScheduledTime {
  [key: string]: number
}

export interface TimelineItem {
  title: Title
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

export interface Links {
  official: string
  twitter: string
  bilibiliCN: number
  bilibiliHK: number
  bilibiliTW: number
  bilibiliIntl: number
  iQIYiTW: string
  iQIYiSEA: string
}

export interface Bangumi {
  title: Title
  premiereTime: PremiereTime
  schedule: {
    type: string
    index: number
    time: ScheduledTime
  }[]
  episodesLength: number
  episodeStart: number
}

export interface RawTimelineData {
  status: number
  startTime: number
  endTime: number
  result: Bangumi[]
}
