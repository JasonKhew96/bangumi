package anigamer

func (lists Lists) Length() int {
	return len(lists)
}

func (lists Lists) Iterate() <-chan List {
	ch := make(chan List)
	go func() {
		for _, anime := range lists {
			ch <- anime
		}
		close(ch)
	}()
	return ch
}

//easyjson:json
type Lists []List

//easyjson:json
type List struct {
	AcgSn        int          `json:"acg_sn"`
	AnimeSn      int          `json:"anime_sn"`
	Title        string       `json:"title"`
	DcC1         int          `json:"dc_c1"`
	DcC2         int          `json:"dc_c2"`
	Favorite     bool         `json:"favorite"`
	Flag         string       `json:"flag"`
	Cover        string       `json:"cover"`
	Info         string       `json:"info"`
	Popular      string       `json:"popular"`
	HighlightTag HighlightTag `json:"highlightTag"`
	Score        float64      `json:"score"`
}

//easyjson:json
type HighlightTag struct {
	Bilingual bool   `json:"bilingual"`
	Edition   string `json:"edition"`
	VipTime   string `json:"vipTime"`
}
