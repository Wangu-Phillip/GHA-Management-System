-- Migration: Facebook Ads integration + AI Advisor cache
-- Apply with: wrangler d1 migrations apply gha-management-db --local

CREATE TABLE IF NOT EXISTS "FacebookAdAccount" (
    "id"            TEXT NOT NULL PRIMARY KEY,
    "adAccountId"   TEXT NOT NULL,         -- e.g. act_1234567890
    "accessToken"   TEXT NOT NULL,
    "pageId"        TEXT,
    "accountName"   TEXT,
    "currency"      TEXT DEFAULT 'USD',
    "timezone"      TEXT DEFAULT 'UTC',
    "connectedAt"   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "FacebookCampaign" (
    "id"              TEXT NOT NULL PRIMARY KEY,   -- Facebook Campaign ID
    "adAccountId"     TEXT NOT NULL,
    "name"            TEXT NOT NULL,
    "status"          TEXT NOT NULL DEFAULT 'PAUSED',  -- ACTIVE | PAUSED | ARCHIVED | DELETED
    "objective"       TEXT,                             -- REACH | TRAFFIC | CONVERSIONS | LEAD_GENERATION etc.
    "dailyBudget"     REAL,
    "lifetimeBudget"  REAL,
    "startTime"       DATETIME,
    "stopTime"        DATETIME,
    "syncedAt"        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt"       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "FacebookAdSet" (
    "id"              TEXT NOT NULL PRIMARY KEY,   -- Facebook AdSet ID
    "campaignId"      TEXT NOT NULL,
    "name"            TEXT NOT NULL,
    "status"          TEXT NOT NULL DEFAULT 'PAUSED',
    "dailyBudget"     REAL,
    "targeting"       TEXT,                              -- JSON blob of targeting spec
    "bidStrategy"     TEXT,
    "syncedAt"        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FacebookAdSet_campaignId_fkey"
        FOREIGN KEY ("campaignId") REFERENCES "FacebookCampaign" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX IF NOT EXISTS "FacebookAdSet_campaignId_idx" ON "FacebookAdSet"("campaignId");

CREATE TABLE IF NOT EXISTS "FacebookAd" (
    "id"              TEXT NOT NULL PRIMARY KEY,   -- Facebook Ad ID
    "adSetId"         TEXT NOT NULL,
    "name"            TEXT NOT NULL,
    "status"          TEXT NOT NULL DEFAULT 'PAUSED',
    "creativeTitle"   TEXT,
    "creativeBody"    TEXT,
    "previewUrl"      TEXT,
    "syncedAt"        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FacebookAd_adSetId_fkey"
        FOREIGN KEY ("adSetId") REFERENCES "FacebookAdSet" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX IF NOT EXISTS "FacebookAd_adSetId_idx" ON "FacebookAd"("adSetId");

CREATE TABLE IF NOT EXISTS "FacebookInsight" (
    "id"            TEXT NOT NULL PRIMARY KEY,
    "adAccountId"   TEXT NOT NULL,
    "objectId"      TEXT NOT NULL,       -- campaign/adset/ad ID
    "objectLevel"   TEXT NOT NULL,       -- CAMPAIGN | ADSET | AD | ACCOUNT
    "objectName"    TEXT,
    "date"          TEXT NOT NULL,       -- YYYY-MM-DD (daily breakdown)
    "impressions"   INTEGER NOT NULL DEFAULT 0,
    "clicks"        INTEGER NOT NULL DEFAULT 0,
    "spend"         REAL NOT NULL DEFAULT 0,
    "reach"         INTEGER NOT NULL DEFAULT 0,
    "conversions"   INTEGER NOT NULL DEFAULT 0,
    "cpm"           REAL DEFAULT 0,      -- Cost per 1000 impressions
    "ctr"           REAL DEFAULT 0,      -- Click-through rate %
    "cpc"           REAL DEFAULT 0,      -- Cost per click
    "roas"          REAL DEFAULT 0,      -- Return on ad spend
    "syncedAt"      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX IF NOT EXISTS "FacebookInsight_unique_key"
    ON "FacebookInsight"("adAccountId", "objectId", "objectLevel", "date");
CREATE INDEX IF NOT EXISTS "FacebookInsight_date_idx"
    ON "FacebookInsight"("date");

-- AI Advisor response cache (keyed per time window)
CREATE TABLE IF NOT EXISTS "AiAdvisorCache" (
    "id"            TEXT NOT NULL PRIMARY KEY,
    "windowDays"    INTEGER NOT NULL DEFAULT 30,   -- 30 or 90
    "adviceJson"    TEXT NOT NULL,                 -- Full JSON blob from Gemini
    "generatedAt"   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX IF NOT EXISTS "AiAdvisorCache_window_key"
    ON "AiAdvisorCache"("windowDays");
