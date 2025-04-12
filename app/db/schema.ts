import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  boolean,
  primaryKey,
  pgSchema,
  uuid,
  unique,
} from "drizzle-orm/pg-core";

const authSchema = pgSchema("auth");

const users = authSchema.table("users", {
  id: uuid("id").primaryKey(),
});

const timestamps = {
  created_at: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
};

export const bookmarks = pgTable(
  "bookmarks",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    url: text("url").notNull(),
    description: text("description").notNull().default(""),
    is_public: boolean("is_public").default(false).notNull(),
    created_by: uuid("created_by")
      .notNull()
      .references(() => users.id),
    ...timestamps,
  },
  (table) => [unique().on(table.created_by, table.url)]
);

export const folders = pgTable(
  "folders",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    description: text("description").notNull().default(""),
    created_by: uuid("created_by")
      .notNull()
      .references(() => users.id),
    is_public: boolean("is_public").default(false).notNull(),
    ...timestamps,
  },
  (table) => [unique().on(table.created_by, table.name)]
);

export const tags = pgTable("tags", {
  id: serial("id").primaryKey(),
  name: text("name").unique().notNull(),
  ...timestamps,
});

export const bookmark_tags = pgTable(
  "bookmark_tags",
  {
    bookmark_id: integer("bookmark_id")
      .notNull()
      .references(() => bookmarks.id, { onDelete: "cascade" }),
    tag_id: integer("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
    ...timestamps,
  },
  (table) => [primaryKey({ columns: [table.bookmark_id, table.tag_id] })]
);

export const bookmark_folders = pgTable(
  "bookmark_folders",
  {
    bookmark_id: integer("bookmark_id")
      .notNull()
      .references(() => bookmarks.id, { onDelete: "cascade" }),
    folder_id: integer("folder_id")
      .notNull()
      .references(() => folders.id, { onDelete: "cascade" }),
    ...timestamps,
  },
  (table) => [primaryKey({ columns: [table.bookmark_id, table.folder_id] })]
);

export const bookmarkRelations = relations(bookmarks, ({ many }) => ({
  tags: many(bookmark_tags),
  folders: many(bookmark_folders),
}));

export const folderRelations = relations(folders, ({ many }) => ({
  bookmarks: many(bookmark_folders),
}));

export const bookmarkTagsRelations = relations(bookmark_tags, ({ one }) => ({
  bookmark: one(bookmarks, {
    fields: [bookmark_tags.bookmark_id],
    references: [bookmarks.id],
  }),
  tag: one(tags, {
    fields: [bookmark_tags.tag_id],
    references: [tags.id],
  }),
}));

export const bookmarkFoldersRelations = relations(
  bookmark_folders,
  ({ one }) => ({
    bookmark: one(bookmarks, {
      fields: [bookmark_folders.bookmark_id],
      references: [bookmarks.id],
    }),
    folder: one(folders, {
      fields: [bookmark_folders.folder_id],
      references: [folders.id],
    }),
  })
);

// Bookmarks
export type Bookmark = InferSelectModel<typeof bookmarks>;
export type NewBookmark = InferInsertModel<typeof bookmarks>;

// Folders
export type Folder = InferSelectModel<typeof folders>;
export type NewFolder = InferInsertModel<typeof folders>;

// Tags
export type Tag = InferSelectModel<typeof tags>;
export type NewTag = InferInsertModel<typeof tags>;

// BookmarkTags
export type BookmarkTag = InferSelectModel<typeof bookmark_tags>;
export type NewBookmarkTag = InferInsertModel<typeof bookmark_tags>;

// BookmarkFolders
export type BookmarkFolder = InferSelectModel<typeof bookmark_folders>;
export type NewBookmarkFolder = InferInsertModel<typeof bookmark_folders>;

export type BookmarkDisplay = {
  tags: {
    id: number;
    name: string;
  }[];
  folders: {
    id: number;
    name: string;
  }[];
  id: number;
  name: string;
  created_at: Date;
  updated_at: Date;
  url: string;
  description: string | null;
  is_public: boolean;
};

export type TBookmarkForm = Omit<
  Bookmark,
  "created_by" | "created_at" | "updated_at" | "id"
>;
