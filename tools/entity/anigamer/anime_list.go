package anigamer

func (lists AnimeLists) Length() int {
	return len(lists)
}

func (lists AnimeLists) Iterate() <-chan Anime {
	ch := make(chan Anime)
	go func() {
		for _, anime := range lists {
			ch <- anime
		}
		close(ch)
	}()
	return ch
}

type List struct {
	Data Data `json:"data"`
}

type Data struct {
	AnimeList AnimeLists `json:"animeList"`
	TotalPage int        `json:"totalPage"`
}

//easyjson:json
type AnimeLists []Anime

//easyjson:json
type Anime struct {
	AcgSn        int          `json:"acgSn"`
	AnimeSn      int          `json:"animeSn"`
	VideoSn      int          `json:"videoSn"`
	Title        string       `json:"title"`
	Favorite     bool         `json:"favorite"`
	Flag         int          `json:"flag"`
	Cover        string       `json:"cover"`
	DateInfo     string       `json:"dateInfo"`
	TotalEpisode int          `json:"totalEpisode"`
	Popular      int          `json:"popular"`
	HighlightTag HighlightTag `json:"highlightTag"`
	Score        float64      `json:"score"`
}

//easyjson:json
type HighlightTag struct {
	Bilingual  bool   `json:"bilingual"`
	Edition    string `json:"edition"`
	VipTime    string `json:"vipTime"`
	NewArrival bool   `json:"newArrival"`
}
