package main

import (
	"context"
	"database/sql"
	"errors"
	"io"
	"log"
	"net/http"
	"net/url"
	"os"
	"sort"
	"strconv"
	"strings"
	"time"

	"scraper/entity/anigamer"
	"scraper/entity/bangumi"
	"scraper/models"

	"github.com/mailru/easyjson"
	"github.com/r3labs/diff/v2"
	"github.com/volatiletech/null/v8"
	"github.com/volatiletech/sqlboiler/v4/boil"
	"github.com/volatiletech/sqlboiler/v4/queries/qm"
)

type ByAnimeSn []anigamer.Anime

func (a ByAnimeSn) Len() int           { return len(a) }
func (a ByAnimeSn) Less(i, j int) bool { return a[i].AnimeSn < a[j].AnimeSn }
func (a ByAnimeSn) Swap(i, j int)      { a[i], a[j] = a[j], a[i] }

func (s *Scraper) scrapeAnigamer() error {
	log.Println("Scraping anigamer...")
	values := url.Values{}
	page := 1
	totalPage := -1
	var l []anigamer.Anime
	for {
		values.Set("page", strconv.Itoa(page))
		apiUrl := API_ANIGAMER_LIST + "?" + values.Encode()
		resp, err := s.do(http.MethodGet, apiUrl, nil)
		if err != nil {
			return err
		}
		defer resp.Body.Close()
		if resp.StatusCode != http.StatusOK {
			return errors.New("status code error: " + resp.Status)
		}
		body, err := io.ReadAll(resp.Body)
		if err != nil {
			return err
		}
		anigamerRoot := &anigamer.List{}
		err = easyjson.Unmarshal(body, anigamerRoot)
		if err != nil {
			return err
		}
		totalPage = anigamerRoot.Data.TotalPage
		animeList := anigamerRoot.Data.AnimeList
		if animeList.Length() == 0 {
			break
		}
		for anime := range animeList.Iterate() {
			l = append(l, anime)
		}
		if page >= totalPage {
			break
		}
		page++
		time.Sleep(time.Second * 1)
	}

	sort.Sort(ByAnimeSn(l))

	log.Println("Updating anigamer...")
	for _, anime := range l {
		popular := int64(anime.Popular)
		vipTime, _ := time.Parse(TIMESTAMP_FORMAT, anime.HighlightTag.VipTime)

		old, err := models.Anigamers(models.AnigamerWhere.AnimeSN.EQ(int64(anime.AnimeSn))).One(context.Background(), s.db)
		if err != nil && err != sql.ErrNoRows {
			return err
		}

		new := &models.Anigamer{
			AcgSN:     int64(anime.AcgSn),
			AnimeSN:   int64(anime.AnimeSn),
			Title:     null.StringFrom(strings.TrimSpace(anime.Title)),
			Cover:     null.StringFrom(anime.Cover),
			Popular:   null.Int64From(popular),
			Bilingual: null.BoolFrom(anime.HighlightTag.Bilingual),
			Edition:   null.StringFrom(anime.HighlightTag.Edition),
			VipTime:   null.TimeFrom(vipTime),
			Score:     null.Float64From(anime.Score),
		}

		if err != sql.ErrNoRows &&
			old.AcgSN == new.AcgSN &&
			old.Title == new.Title &&
			old.Cover == new.Cover &&
			old.Popular == new.Popular &&
			old.Bilingual == new.Bilingual &&
			old.Edition == new.Edition &&
			old.VipTime == new.VipTime &&
			old.Score == new.Score {
			continue
		}

		if err != sql.ErrNoRows {
			changelog, err := diff.Diff(old, new)
			if err != nil {
				return err
			}
			log.Printf("anigamer diff [%d][%s]", anime.AnimeSn, anime.Title)
			for _, change := range changelog {
				if change.Path[0] == "UpdatedAt" || change.Path[0] == "CreatedAt" {
					continue
				}
				log.Printf(`  [%s][%s] "%v" -> "%v"`, change.Type, change.Path[0], change.From, change.To)
			}
		} else {
			history := models.History{
				AnimeID:  int64(anime.AnimeSn),
				Platform: PLATFORM_ANIGAMER,
				Type:     TYPE_NEW,
				Title:    null.StringFrom(anime.Title),
			}
			if err := history.Insert(context.Background(), s.db, boil.Infer()); err != nil {
				log.Println(err)
			}
			log.Printf("anigamer new [%d][%s]", anime.AnimeSn, anime.Title)
		}

		err = new.Upsert(context.Background(), s.db, true, []string{"anime_sn"}, boil.Blacklist("created_at"), boil.Infer())
		if err != nil {
			return err
		}
	}

	all, err := models.Anigamers().All(context.Background(), s.db)
	if err != nil {
		return err
	}
	for _, dbAnime := range all {
		found := false
		for _, newAnime := range l {
			if int64(newAnime.AnimeSn) == dbAnime.AnimeSN {
				found = true
				break
			}
			if int64(newAnime.AnimeSn) > dbAnime.AnimeSN {
				break
			}
		}
		if !found {
			history := models.History{
				AnimeID:  int64(dbAnime.AnimeSN),
				Platform: PLATFORM_ANIGAMER,
				Type:     TYPE_DELETE,
				Title:    dbAnime.Title,
			}
			if err := history.Insert(context.Background(), s.db, boil.Infer()); err != nil {
				log.Println(err)
			}
			log.Printf("anigamer delete [%d][%s]\n", dbAnime.AnimeSN, dbAnime.Title.String)
			if _, err := dbAnime.Delete(context.Background(), s.db); err != nil {
				return err
			}
		}
	}

	log.Println("done")
	return nil
}

func (s *Scraper) generateAnigamerJson() error {
	log.Println("Generating anigamer json file")

	all, err := models.Anigamers(qm.OrderBy("anime_sn asc")).All(context.Background(), s.db)
	if err != nil {
		return err
	}

	l := &bangumi.Anigamer{}

	for _, b := range all {
		l.Data = append(l.Data, bangumi.AnigamerData{
			AcgSn:       int(b.AcgSN),
			AnimeSn:     int(b.AnimeSN),
			Title:       b.Title.String,
			IsBilingual: b.Bilingual.Bool,
			Edition:     b.Edition.String,
			IsVip:       b.VipTime.Time.After(time.Now()),
		})
	}

	data, err := easyjson.Marshal(l)
	if err != nil {
		return err
	}

	if err := os.WriteFile("animad.json", data, 0644); err != nil {
		return err
	}

	log.Println("done")

	return nil
}
