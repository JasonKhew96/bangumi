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
	"strconv"
	"strings"
	"time"

	"scraper/entity/bangumi"
	"scraper/entity/bilibili"
	"scraper/models"

	"github.com/mailru/easyjson"
	"github.com/r3labs/diff/v2"
	"github.com/volatiletech/null/v8"
	"github.com/volatiletech/sqlboiler/v4/boil"
	"github.com/volatiletech/sqlboiler/v4/queries/qm"
)

func (s *Scraper) updateBilibiliOverseas() error {
	log.Println("updating bilibili overseas")

	datas, err := models.Bilibilis(models.BilibiliWhere.UpMid.EQ(null.Int64From(11783021))).All(context.Background(), s.db)
	if err != nil && err != sql.ErrNoRows {
		return err
	}

	values := url.Values{}
	for _, old := range datas {
		values.Set("season_id", strconv.FormatInt(old.SeasonID, 10))
		apiUrl := API_BANGUMI_BILIBILI_SEASON + "?" + values.Encode()
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
		bilibiliRoot := &bilibili.SeasonResult{}
		err = easyjson.Unmarshal(body, bilibiliRoot)
		if err != nil {
			return err
		}

		if bilibiliRoot.Code != 0 {
			if err != sql.ErrNoRows {
				log.Printf("bilibili delete [%d][%s]", old.SeasonID, old.Title.String)
				if _, err := old.Delete(context.Background(), s.db); err != nil {
					return err
				}
			}
			time.Sleep(SLEEP_INTERVAL)
			continue
		}

		result := bilibiliRoot.Result

		var areas []string
		for _, area := range result.Areas {
			areas = append(areas, area.Name)
		}
		pubTime, _ := time.Parse(TIMESTAMP_FORMAT, result.Publish.PubTime)
		new := &models.Bilibili{
			Actors:      null.StringFrom(result.Actors),
			Areas:       null.StringFrom(strings.Join(areas, "|")),
			Alias:       null.StringFrom(result.Alias),
			Cover:       null.StringFrom(result.Cover),
			Evaluate:    null.StringFrom(result.Evaluate),
			JPTitle:     null.StringFrom(result.JpTitle),
			MediaID:     int64(result.MediaID),
			IsVip:       result.Payment != nil,
			PubTime:     null.TimeFrom(pubTime),
			RatingCount: null.Int64From(int64(result.Rating.Count)),
			RatingScore: null.Float64From(result.Rating.Score),
			Copyright:   null.StringFrom(result.Rights.Copyright),
			SeasonID:    int64(result.SeasonID),
			SeasonTitle: null.StringFrom(result.SeasonTitle),
			SeasonType:  int64(result.SeasonType),
			SeriesTitle: null.StringFrom(result.SeriesTitle),
			SquareCover: null.StringFrom(result.SquareCover),
			Coins:       null.Int64From(int64(result.Stat.Coins)),
			Danmakus:    null.Int64From(int64(result.Stat.Danmakus)),
			Views:       null.Int64From(int64(result.Stat.Views)),
			Style:       null.StringFrom(strings.Join(result.Style, "|")),
			Title:       null.StringFrom(strings.TrimSpace(result.Title)),
			UpMid:       null.Int64From(int64(result.UpInfo.Mid)),
		}

		if err != sql.ErrNoRows &&
			old.Actors == new.Actors &&
			old.Areas == new.Areas &&
			old.Alias == new.Alias &&
			old.Cover == new.Cover &&
			old.Evaluate == new.Evaluate &&
			old.JPTitle == new.JPTitle &&
			old.MediaID == new.MediaID &&
			old.IsVip == new.IsVip &&
			old.PubTime == new.PubTime &&
			old.RatingCount == new.RatingCount &&
			old.RatingScore == new.RatingScore &&
			old.Copyright == new.Copyright &&
			old.SeasonTitle == new.SeasonTitle &&
			old.SeasonType == new.SeasonType &&
			old.SeriesTitle == new.SeriesTitle &&
			old.SquareCover == new.SquareCover &&
			old.Coins == new.Coins &&
			old.Danmakus == new.Danmakus &&
			old.Views == new.Views &&
			old.Style == new.Style &&
			old.Title == new.Title &&
			old.UpMid == new.UpMid {
			time.Sleep(SLEEP_INTERVAL)
			continue
		}

		if err != sql.ErrNoRows {
			changelog, err := diff.Diff(old, new)
			if err != nil {
				return err
			}
			log.Printf("bilibili diff [%d][%s]", new.SeasonID, new.Title.String)
			for _, change := range changelog {
				if change.Type == diff.UPDATE {
					if len(change.Path) > 0 && (change.Path[0] == "UpdatedAt" || change.Path[0] == "CreatedAt") {
						continue
					}
				}
				log.Printf(`  [%s][%s] "%v" -> "%v"`, change.Type, change.Path[0], change.From, change.To)
			}
		} else {
			log.Printf("bilibili new [%d][%s]", new.SeasonID, new.Title.String)
		}

		err = new.Upsert(context.Background(), s.db, true, []string{"season_id"}, boil.Blacklist("created_at"), boil.Infer())
		if err != nil {
			return err
		}

		time.Sleep(SLEEP_INTERVAL)
	}
	return nil
}

func (s *Scraper) scrapeBilibili() error {
	log.Println("Scraping bilibili...")

	last, err := models.Bilibilis(qm.OrderBy("season_id desc")).One(context.Background(), s.db)
	if err != nil && err != sql.ErrNoRows {
		return err
	}
	var seasonID int64
	if err == sql.ErrNoRows {
		seasonID = 34000
	} else {
		seasonID = last.SeasonID - 2048
	}

	values := url.Values{}
	errCount := 0
	for {
		values.Set("season_id", strconv.FormatInt(seasonID, 10))
		apiUrl := API_BILIBILI_SEASON + "?" + values.Encode()
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
		bilibiliRoot := &bilibili.SeasonResult{}
		err = easyjson.Unmarshal(body, bilibiliRoot)
		if err != nil {
			return err
		}

		old, err := models.Bilibilis(models.BilibiliWhere.SeasonID.EQ(seasonID)).One(context.Background(), s.db)
		if err != nil && err != sql.ErrNoRows {
			return err
		}

		if bilibiliRoot.Code != 0 {
			if err != sql.ErrNoRows {
				history := models.History{
					AnimeID:  old.SeasonID,
					Platform: PLATFORM_BILIBILI,
					Type:     TYPE_DELETE,
					Title:    old.Title,
				}
				if err := history.Insert(context.Background(), s.db, boil.Infer()); err != nil {
					log.Println(err)
				}
				log.Printf("bilibili delete [%d][%s]", old.SeasonID, old.Title.String)
				if _, err := old.Delete(context.Background(), s.db); err != nil {
					return err
				}
			}

			seasonID++
			errCount++
			if errCount > 256 {
				log.Println("bilibili no more seasons")
				break
			}
			time.Sleep(SLEEP_INTERVAL)
			continue
		}

		result := bilibiliRoot.Result

		var areas []string
		for _, area := range result.Areas {
			areas = append(areas, area.Name)
		}
		pubTime, _ := time.Parse(TIMESTAMP_FORMAT, result.Publish.PubTime)
		seasonType := result.SeasonType
		if seasonType == 0 {
			seasonType = result.ShowSeasonType
		}
		seriesTitle := result.SeriesTitle
		if seriesTitle == "" {
			seriesTitle = result.Series.SeriesTitle
		}
		styles := result.Style
		if len(styles) == 0 {
			styles = result.Styles
		}
		new := &models.Bilibili{
			Actors:      null.StringFrom(result.Actors),
			Areas:       null.StringFrom(strings.Join(areas, "|")),
			Alias:       null.StringFrom(result.Alias),
			Cover:       null.StringFrom(result.Cover),
			Evaluate:    null.StringFrom(result.Evaluate),
			JPTitle:     null.StringFrom(result.JpTitle),
			MediaID:     int64(result.MediaID),
			IsVip:       result.Payment != nil,
			PubTime:     null.TimeFrom(pubTime),
			RatingCount: null.Int64From(int64(result.Rating.Count)),
			RatingScore: null.Float64From(result.Rating.Score),
			Copyright:   null.StringFrom(result.Rights.Copyright),
			SeasonID:    int64(result.SeasonID),
			SeasonTitle: null.StringFrom(result.SeasonTitle),
			SeasonType:  int64(seasonType),
			SeriesTitle: null.StringFrom(seriesTitle),
			SquareCover: null.StringFrom(result.SquareCover),
			Coins:       null.Int64From(int64(result.Stat.Coins)),
			Danmakus:    null.Int64From(int64(result.Stat.Danmakus)),
			Views:       null.Int64From(int64(result.Stat.Views)),
			Style:       null.StringFrom(strings.Join(styles, "|")),
			Title:       null.StringFrom(strings.TrimSpace(result.Title)),
			UpMid:       null.Int64From(int64(result.UpInfo.Mid)),
		}

		if err != sql.ErrNoRows &&
			old.Actors == new.Actors &&
			old.Areas == new.Areas &&
			old.Alias == new.Alias &&
			old.Cover == new.Cover &&
			old.Evaluate == new.Evaluate &&
			old.JPTitle == new.JPTitle &&
			old.MediaID == new.MediaID &&
			old.IsVip == new.IsVip &&
			old.PubTime == new.PubTime &&
			old.RatingCount == new.RatingCount &&
			old.RatingScore == new.RatingScore &&
			old.Copyright == new.Copyright &&
			old.SeasonTitle == new.SeasonTitle &&
			old.SeasonType == new.SeasonType &&
			old.SeriesTitle == new.SeriesTitle &&
			old.SquareCover == new.SquareCover &&
			old.Coins == new.Coins &&
			old.Danmakus == new.Danmakus &&
			old.Views == new.Views &&
			old.Style == new.Style &&
			old.Title == new.Title &&
			old.UpMid == new.UpMid {
			seasonID++
			errCount = 0
			time.Sleep(SLEEP_INTERVAL)
			continue
		}

		if err != sql.ErrNoRows {
			changelog, err := diff.Diff(old, new)
			if err != nil {
				return err
			}
			log.Printf("bilibili diff [%d][%s]", new.SeasonID, new.Title.String)
			for _, change := range changelog {
				if change.Type == diff.UPDATE {
					if len(change.Path) > 0 && (change.Path[0] == "UpdatedAt" || change.Path[0] == "CreatedAt") {
						continue
					}
				}
				log.Printf(`  [%s][%s] "%v" -> "%v"`, change.Type, change.Path[0], change.From, change.To)
			}
		} else {
			history := models.History{
				AnimeID:  new.SeasonID,
				Platform: PLATFORM_BILIBILI,
				Type:     TYPE_NEW,
				Title:    new.Title,
			}
			if err := history.Insert(context.Background(), s.db, boil.Infer()); err != nil {
				log.Println(err)
			}
			log.Printf("bilibili new [%d][%s]", new.SeasonID, new.Title.String)
		}

		err = new.Upsert(context.Background(), s.db, true, []string{"season_id"}, boil.Blacklist("created_at"), boil.Infer())
		if err != nil {
			return err
		}

		seasonID++
		errCount = 0
		time.Sleep(SLEEP_INTERVAL)
	}

	log.Println("done")
	return nil
}

func (s *Scraper) generateBilibiliJson() error {
	log.Println("Generating bilibili json file")

	all, err := models.Bilibilis(qm.OrderBy("season_id asc")).All(context.Background(), s.db)
	if err != nil {
		return err
	}

	l := &bangumi.Bilibili{}

	for _, b := range all {
		// 677043260 Classic_Anime
		// 688418886 Anime_Ongoing
		if b.UpMid.Int64 == 677043260 || b.UpMid.Int64 == 688418886 {
			continue
		}
		l.Data = append(l.Data, bangumi.BilibiliData{
			SeasonID:    int(b.SeasonID),
			MediaID:     int(b.MediaID),
			Title:       b.Title.String,
			IsVip:       b.IsVip,
			IsExclusive: b.Copyright.String == "dujia",
			Type:        int(b.SeasonType),
		})
	}

	data, err := easyjson.Marshal(l)
	if err != nil {
		return err
	}

	if err := os.WriteFile("bilibili.json", data, 0644); err != nil {
		return err
	}

	log.Println("done")

	return nil
}
