BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "bilibili_sea" (
	"cover" VARCHAR(128),
	"index_show" VARCHAR(16),
	"is_finish" BOOLEAN,
	"season_id" INTEGER NOT NULL PRIMARY KEY UNIQUE,
	"season_type" INTEGER NOT NULL,
	"title" VARCHAR(128),
	"updated_at" DATETIME NOT NULL,
	"created_at" DATETIME NOT NULL,
);
CREATE TABLE IF NOT EXISTS "bilibili" (
	"actors" VARCHAR(512),
	"areas" VARCHAR(16),
	"alias" VARCHAR(256),
	"cover" VARCHAR(128),
	"evaluate" VARCHAR(512),
	"jp_title" VARCHAR(128),
	"media_id" INTEGER NOT NULL,
	"is_vip" BOOLEAN NOT NULL,
	"pub_time" DATETIME,
	"rating_count" INTEGER,
	"rating_score" REAL,
	"copyright" VARCHAR(16),
	"season_id" INTEGER NOT NULL PRIMARY KEY UNIQUE,
	"season_title" VARCHAR(128),
	"season_type" INTEGER NOT NULL,
	"series_title" VARCHAR(128),
	"square_cover" VARCHAR(128),
	"coins" INTEGER,
	"danmakus" INTEGER,
	"views" INTEGER,
	"style" VARCHAR(64),
	"title" VARCHAR(128),
	"up_mid" INTEGER,
	"updated_at" DATETIME NOT NULL,
	"created_at" DATETIME NOT NULL,
);
CREATE TABLE IF NOT EXISTS "anigamer" (
	"acg_sn" INTEGER NOT NULL,
	"anime_sn" INTEGER NOT NULL PRIMARY KEY UNIQUE,
	"title" VARCHAR(128),
	"cover" VARCHAR(128),
	"popular" INTEGER,
	"bilingual" BOOLEAN,
	"edition" VARCHAR(16),
	"vip_time" DATETIME,
	"score" REAL,
	"updated_at" DATETIME NOT NULL,
	"created_at" DATETIME NOT NULL
);
-- PLATFORM
--   0 : UNKNOWN
--   1 : BILIBILI SEA
--   2 : BILIBILI
--   3 : ANIGAMER
-- TYPE
--   0 : UNKNOWN
--   1 : NEW
--   2 : DELETE
CREATE TABLE IF NOT EXISTS "history" (
	"id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	"anime_id" INTEGER NOT NULL,
	"platform" INTEGER NOT NULL,
	"type" INTEGER NOT NULL,
	"title" VARCHAR(128),
	"updated_at" DATETIME NOT NULL,
	"created_at" DATETIME NOT NULL
);
COMMIT;