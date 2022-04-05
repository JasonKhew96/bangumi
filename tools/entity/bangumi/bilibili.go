package bangumi

type Bilibili struct {
	Data []BilibiliData `json:"data"`
}
type BilibiliData struct {
	SeasonID    int    `json:"season_id"`
	MediaID     int    `json:"media_id"`
	Title       string `json:"title"`
	IsVip       bool   `json:"is_vip"`
	IsExclusive bool   `json:"is_exclusive"`
	Type        int    `json:"type"`
}
