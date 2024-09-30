package bangumi

type Anigamer struct {
	Data []AnigamerData `json:"data"`
}
type AnigamerData struct {
	AcgSn       int    `json:"acg_sn"`
	AnimeSn     int    `json:"anime_sn"`
	Title       string `json:"title"`
	IsBilingual bool   `json:"is_bilingual"`
	Edition     string `json:"edition"`
	IsVip       bool   `json:"is_vip"`
}
