package main

import "time"

const (
	DEFAULT_USER_AGENT          = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36"
	API_ANIGAMER_LIST           = "https://api.gamer.com.tw/mobile_app/anime/v1/list.php"
	API_BANGUMI_BILIBILI_SEASON = "https://bangumi.bilibili.com/view/web_api/season"
	API_BILIBILI_SEASON         = "https://api.bilibili.com/pgc/view/web/season"
	TIMESTAMP_FORMAT            = "2006-01-02 15:04:05"
	SLEEP_INTERVAL              = time.Millisecond * 1000
)

const (
	PLATFORM_BILIBILI_SEA = 1
	PLATFORM_BILIBILI     = 2
	PLATFORM_ANIGAMER     = 3

	TYPE_NEW    = 1
	TYPE_DELETE = 2
)
