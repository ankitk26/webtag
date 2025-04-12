ALTER TABLE "bookmark_folders" DROP CONSTRAINT "bookmark_folders_bookmark_id_bookmarks_id_fk";
--> statement-breakpoint
ALTER TABLE "bookmark_folders" DROP CONSTRAINT "bookmark_folders_folder_id_folders_id_fk";
--> statement-breakpoint
ALTER TABLE "bookmark_tags" DROP CONSTRAINT "bookmark_tags_bookmark_id_bookmarks_id_fk";
--> statement-breakpoint
ALTER TABLE "bookmark_tags" DROP CONSTRAINT "bookmark_tags_tag_id_tags_id_fk";
--> statement-breakpoint
ALTER TABLE "bookmark_folders" ADD CONSTRAINT "bookmark_folders_bookmark_id_bookmarks_id_fk" FOREIGN KEY ("bookmark_id") REFERENCES "public"."bookmarks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookmark_folders" ADD CONSTRAINT "bookmark_folders_folder_id_folders_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."folders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookmark_tags" ADD CONSTRAINT "bookmark_tags_bookmark_id_bookmarks_id_fk" FOREIGN KEY ("bookmark_id") REFERENCES "public"."bookmarks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookmark_tags" ADD CONSTRAINT "bookmark_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;