package bilibili

type SeasonResult struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
	Result  Result `json:"result"`
}

type Areas struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

type Episodes struct {
	Aid           int    `json:"aid"`
	Attr          int    `json:"attr"`
	Bvid          string `json:"bvid"`
	Cid           int    `json:"cid"`
	Cover         string `json:"cover"`
	Ctime         string `json:"ctime"`
	Duration      int    `json:"duration"`
	EpID          int    `json:"ep_id"`
	EpisodeStatus int    `json:"episode_status"`
	From          string `json:"from"`
	Index         string `json:"index"`
	IndexTitle    string `json:"index_title"`
	Mid           int    `json:"mid"`
	Page          int    `json:"page"`
	Premiere      bool   `json:"premiere"`
	PubRealTime   string `json:"pub_real_time"`
	SectionID     int    `json:"section_id"`
	SectionType   int    `json:"section_type"`
	Vid           string `json:"vid"`
	EpisodeType   int    `json:"episode_type,omitempty"`
}

type NewestEp struct {
	Desc        string `json:"desc"`
	ID          int    `json:"id"`
	Index       string `json:"index"`
	IsNew       int    `json:"is_new"`
	PubRealTime string `json:"pub_real_time"`
}

type PayType struct {
	AllowDiscount    int `json:"allow_discount"`
	AllowPack        int `json:"allow_pack"`
	AllowTicket      int `json:"allow_ticket"`
	AllowTimeLimit   int `json:"allow_time_limit"`
	AllowVipDiscount int `json:"allow_vip_discount"`
	ForbidBb         int `json:"forbid_bb"`
}

type Payment struct {
	Discount       int     `json:"discount"`
	PayType        PayType `json:"pay_type"`
	Price          string  `json:"price"`
	Promotion      string  `json:"promotion"`
	Tip            string  `json:"tip"`
	VipDiscount    int     `json:"vip_discount"`
	VipFirstSwitch string  `json:"vip_first_switch"`
	VipPromotion   string  `json:"vip_promotion"`
}

type Publish struct {
	IsFinish    int    `json:"is_finish"`
	IsStarted   int    `json:"is_started"`
	PubTime     string `json:"pub_time"`
	PubTimeShow string `json:"pub_time_show"`
	Weekday     int    `json:"weekday"`
}

type Rating struct {
	Count int     `json:"count"`
	Score float64 `json:"score"`
}

type Rights struct {
	AllowBp       int    `json:"allow_bp"`
	AllowBpRank   int    `json:"allow_bp_rank"`
	AllowDownload int    `json:"allow_download"`
	AllowReview   int    `json:"allow_review"`
	CanWatch      int    `json:"can_watch"`
	Copyright     string `json:"copyright"`
	IsPreview     int    `json:"is_preview"`
	WatchPlatform int    `json:"watch_platform"`
}

type NewEp struct {
	Cover     string `json:"cover"`
	ID        int    `json:"id"`
	IndexShow string `json:"index_show"`
}

type Seasons struct {
	Badge       string `json:"badge"`
	BadgeType   int    `json:"badge_type"`
	Cover       string `json:"cover"`
	MediaID     int    `json:"media_id"`
	NewEp       NewEp  `json:"new_ep"`
	SeasonID    int    `json:"season_id"`
	SeasonTitle string `json:"season_title"`
	SeasonType  int    `json:"season_type"`
	Stat        Stat   `json:"stat"`
	Title       string `json:"title"`
}

type Stat struct {
	Coins     int `json:"coins"`
	Danmakus  int `json:"danmakus"`
	Favorites int `json:"favorites"`
	Reply     int `json:"reply"`
	Share     int `json:"share"`
	Views     int `json:"views"`
}

type Pendant struct {
	Image string `json:"image"`
	Name  string `json:"name"`
	Pid   int    `json:"pid"`
}

type UpInfo struct {
	Avatar     string  `json:"avatar"`
	Follower   int     `json:"follower"`
	IsVip      int     `json:"is_vip"`
	Mid        int     `json:"mid"`
	Pendant    Pendant `json:"pendant"`
	Uname      string  `json:"uname"`
	VerifyType int     `json:"verify_type"`
}

type Result struct {
	Actors         string     `json:"actors"`
	Alias          string     `json:"alias"`
	Areas          []Areas    `json:"areas"`
	Cover          string     `json:"cover"`
	Episodes       []Episodes `json:"episodes"`
	Evaluate       string     `json:"evaluate"`
	IsPasterAds    int        `json:"is_paster_ads"`
	JpTitle        string     `json:"jp_title"`
	Link           string     `json:"link"`
	MediaID        int        `json:"media_id"`
	Mode           int        `json:"mode"`
	NewestEp       NewestEp   `json:"newest_ep"`
	PasterText     string     `json:"paster_text"`
	Payment        *Payment   `json:"payment,omitempty"`
	Publish        Publish    `json:"publish"`
	Rating         Rating     `json:"rating"`
	Rights         Rights     `json:"rights"`
	SeasonID       int        `json:"season_id"`
	SeasonStatus   int        `json:"season_status"`
	SeasonTitle    string     `json:"season_title"`
	SeasonType     int        `json:"season_type"`
	ShowSeasonType int        `json:"show_season_type"`
	Seasons        []Seasons  `json:"seasons"`
	SeriesTitle    string     `json:"series_title"`
	Series         struct {
		SeriesTitle string `json:"series_title"`
	} `json:"series"`
	SquareCover string   `json:"square_cover"`
	Staff       string   `json:"staff"`
	Stat        Stat     `json:"stat"`
	Style       []string `json:"style"`
	Styles      []string `json:"styles"`
	Title       string   `json:"title"`
	TotalEp     int      `json:"total_ep"`
	UpInfo      UpInfo   `json:"up_info"`
}
