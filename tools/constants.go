package main

import "time"

const (
	DEFAULT_USER_AGENT = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.0.0 Safari/537.36"
	API_ANIGAMER_LIST  = "https://api.gamer.com.tw/mobile_app/anime/v1/list.php"
	API_BILIBILI_SEASON = "https://bangumi.bilibili.com/view/web_api/season"
	TIMESTAMP_FORMAT   = "2006-01-02 15:04:05"
	SLEEP_INTERVAL = time.Millisecond * 1000
)