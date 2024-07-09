package main

import (
	"database/sql"
	"io"
	"log"
	"net/http"
	"os"
	"strconv"
	"time"

	_ "github.com/mattn/go-sqlite3"
	"github.com/volatiletech/sqlboiler/v4/boil"
)

type Scraper struct {
	client *http.Client
	db     *sql.DB
}

type Update struct {
	Ts int64 `json:"ts"`
}

func NewScraper() (*Scraper, error) {
	db, err := sql.Open("sqlite3", "./bangumi.db")
	if err != nil {
		return nil, err
	}

	boil.SetLocation(time.FixedZone("UTC+8", 8*60*60))

	db.Exec("pragma journal_mode = WAL;")
	db.Exec("pragma synchronous = normal;")
	db.Exec("pragma temp_store = memory;")
	db.Exec("pragma mmap_size = 30000000000;")

	return &Scraper{
		client: &http.Client{
			Timeout: time.Second * 10,
		},
		db: db,
	}, nil
}

func (s *Scraper) Close() {
	s.db.Exec("VACUUM;")
	s.db.Close()
}

func (s *Scraper) do(method, url string, body io.Reader) (*http.Response, error) {
	req, err := http.NewRequest(method, url, body)
	if err != nil {
		return nil, err
	}
	req.Header.Set("user-agent", DEFAULT_USER_AGENT)

	retries := 3
	for {
		r, err := s.client.Do(req)
		if r.StatusCode == http.StatusOK {
			return r, nil
		}
		if err != nil {
			log.Println(err)
		} else if r.StatusCode != http.StatusOK {
			log.Println(r.Status)
		}
		retries--
		if retries == 0 {
			return r, err
		}
		time.Sleep(time.Second * 5)
	}
}

func main() {
	// os.Remove("log.txt")
	// logFile, err := os.OpenFile("log.txt", os.O_CREATE|os.O_APPEND|os.O_RDWR, 0644)
	// if err != nil {
	// 	panic(err)
	// }
	// mw := io.MultiWriter(os.Stdout, logFile)
	log.SetOutput(os.Stdout)

	log.Println("Starting")
	scraper, err := NewScraper()
	if err != nil {
		panic(err)
	}
	defer scraper.Close()
	if err := scraper.scrapeAnigamer(); err != nil {
		log.Println(err)
	}
	if err := scraper.generateAnigamerJson(); err != nil {
		log.Println(err)
	}
	if err := scraper.scrapeBilibili(); err != nil {
		log.Println(err)
	}
	if err := scraper.generateBilibiliJson(); err != nil {
		log.Println(err)
	}

	if err := os.WriteFile("update.json", []byte(`{"ts":`+strconv.FormatInt(time.Now().Unix(), 10)+`}`), 0644); err != nil {
		log.Println(err)
	}
}
