ALTER TABLE "bookmarks" ALTER COLUMN "description" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "bookmarks" ALTER COLUMN "description" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "folders" ALTER COLUMN "description" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "folders" ALTER COLUMN "description" SET NOT NULL;