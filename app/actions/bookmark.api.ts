import { createServerFn } from "@tanstack/react-start";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "~/db";
import {
  bookmark_folders,
  bookmark_tags,
  bookmarks,
  folders,
  tags,
} from "~/db/schema";
import { authMiddleware } from "~/lib/auth-middleware";

export const getAllBookmarks = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const user = context.user;
    const bookmarksData = await db
      .select()
      .from(bookmarks)
      .where(eq(bookmarks.created_by, user.id));
    return bookmarksData;
  });

export const getFilteredBookmarks = createServerFn({ method: "GET" })
  .validator(
    z.object({
      folderId: z.number().optional(),
      access: z.enum(["all", "public", "private"]).default("all"),
      tags: z.array(z.number()).optional().default([]),
    })
  )
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const user = context.user;

    const bookmarksData = await db.query.bookmarks.findMany({
      columns: {
        created_by: false,
      },
      with: {
        tags: {
          with: {
            tag: {
              columns: {
                id: true,
                name: true,
              },
            },
          },
        },
        folders: {
          with: {
            folder: {
              columns: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      where: (bookmarks, { and, eq, inArray, sql }) =>
        and(
          eq(bookmarks.created_by, user.id),
          data.access === "all"
            ? sql`TRUE`
            : eq(bookmarks.is_public, data.access === "public"),
          data.folderId === undefined
            ? sql`TRUE`
            : inArray(
                bookmarks.id,
                db
                  .select({ bookmark_id: bookmark_folders.bookmark_id })
                  .from(bookmark_folders)
                  .where(eq(bookmark_folders.folder_id, data.folderId))
              ),
          data.tags === undefined || data.tags.length === 0
            ? sql`TRUE`
            : inArray(
                bookmarks.id,
                db
                  .select({ bookmark_id: bookmark_tags.bookmark_id })
                  .from(bookmark_tags)
                  .where(inArray(bookmark_tags.tag_id, data.tags))
              )
        ),
      orderBy: [desc(bookmarks.created_at)],
    });

    const finalData = bookmarksData.map((bookmark) => ({
      ...bookmark,
      tags: bookmark.tags.map((t) => t.tag),
      folders: bookmark.folders.map((f) => f.folder),
    }));

    return finalData;
  });

export const addBookmark = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      bookmark: z.object({
        name: z.string().nonempty(),
        url: z.string().nonempty(),
        description: z.string(),
        is_public: z.boolean().default(false),
      }),
      folders: z.array(
        z.object({
          id: z.number().optional(),
          name: z.string().optional(),
        })
      ),
      tags: z.array(
        z.object({
          id: z.number().optional(),
          name: z.string().nonempty().optional(),
        })
      ),
    })
  )
  .handler(async ({ context, data }) => {
    const user = context.user;

    await db
      .transaction(async (tx) => {
        const [newBookmark] = await tx
          .insert(bookmarks)
          .values({
            created_by: user.id,
            ...data.bookmark,
          })
          .returning({ id: bookmarks.id });

        const bookmarkFolders = await Promise.all(
          data.folders.map(async (folder) => {
            if (folder.id) {
              return {
                folder_id: folder.id,
                bookmark_id: newBookmark.id,
              };
            }

            const [newFolder] = await tx
              .insert(folders)
              .values({
                created_by: user.id,
                name: folder.name!,
              })
              .returning({ id: folders.id });

            return { folder_id: newFolder.id, bookmark_id: newBookmark.id };
          })
        );

        if (bookmarkFolders.length > 0) {
          await tx.insert(bookmark_folders).values(bookmarkFolders);
        }

        const bookmarkTags = await Promise.all(
          data.tags.map(async (tag) => {
            if (tag.id) {
              return {
                tag_id: tag.id,
                bookmark_id: newBookmark.id,
              };
            }

            const [newTag] = await tx
              .insert(tags)
              .values({
                name: tag.name!,
              })
              .returning({ id: tags.id });

            return { tag_id: newTag.id, bookmark_id: newBookmark.id };
          })
        );

        if (bookmarkTags.length > 0) {
          await tx.insert(bookmark_tags).values(bookmarkTags);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  });

export const deleteBookmark = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      bookmarkId: z.number(),
    })
  )
  .handler(async ({ data }) => {
    await db.delete(bookmarks).where(eq(bookmarks.id, data.bookmarkId));
  });

export const updateBookmark = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      bookmark: z.object({
        id: z.number(),
        name: z.string().nonempty(),
        url: z.string().nonempty(),
        description: z.string(),
        is_public: z.boolean().default(false),
      }),
      folders: z.array(
        z.object({
          id: z.number().optional(),
          name: z.string().optional(),
        })
      ),
      tags: z.array(
        z.object({
          id: z.number().optional(),
          name: z.string().nonempty().optional(),
        })
      ),
    })
  )
  .handler(async ({ context, data }) => {
    const user = context.user;

    if (data.bookmark.id === -1) {
      throw new Error("Invalid bookmark");
    }

    await db
      .transaction(async (tx) => {
        const bookmarkExists = await tx
          .select()
          .from(bookmarks)
          .where(eq(bookmarks.id, data.bookmark.id));
        if (
          !bookmarkExists ||
          (bookmarkExists && bookmarkExists.length === 0)
        ) {
          throw new Error("Invalid Request");
        }

        await tx
          .update(bookmarks)
          .set({
            name: data.bookmark.name,
            url: data.bookmark.url,
            description: data.bookmark.description,
            is_public: data.bookmark.is_public,
          })
          .where(eq(bookmarks.id, data.bookmark.id));

        console.log("form data - ", { folders: data.folders, tags: data.tags });

        const f = await tx
          .select()
          .from(bookmark_folders)
          .where(eq(bookmark_folders.bookmark_id, data.bookmark.id));
        const t = await tx
          .select()
          .from(bookmark_tags)
          .where(eq(bookmark_tags.bookmark_id, data.bookmark.id));
        console.log({ f, t });

        await tx
          .delete(bookmark_folders)
          .where(eq(bookmark_folders.bookmark_id, data.bookmark.id));
        await tx
          .delete(bookmark_tags)
          .where(eq(bookmark_tags.bookmark_id, data.bookmark.id));

        const bookmarkFolders = await Promise.all(
          data.folders.map(async (folder) => {
            if (folder.id) {
              return {
                folder_id: folder.id,
                bookmark_id: data.bookmark.id,
              };
            }

            const [newFolder] = await tx
              .insert(folders)
              .values({
                created_by: user.id,
                name: folder.name!,
              })
              .returning({ id: folders.id });

            return { folder_id: newFolder.id, bookmark_id: data.bookmark.id };
          })
        );

        if (bookmarkFolders.length > 0) {
          await tx.insert(bookmark_folders).values(bookmarkFolders);
        }

        console.log("TAGS BEFORE - ", data.tags);

        const bookmarkTags = await Promise.all(
          data.tags.map(async (tag) => {
            if (tag.id) {
              return {
                tag_id: tag.id,
                bookmark_id: data.bookmark.id,
              };
            }

            const [newTag] = await tx
              .insert(tags)
              .values({
                name: tag.name!,
              })
              .returning({ id: tags.id });

            return { tag_id: newTag.id, bookmark_id: data.bookmark.id };
          })
        );

        if (bookmarkTags.length > 0) {
          console.log("TAGS AFTER - ", bookmarkTags);
          await tx.insert(bookmark_tags).values(bookmarkTags);
        }

        const f2 = await tx
          .select()
          .from(bookmark_folders)
          .where(eq(bookmark_folders.bookmark_id, data.bookmark.id));
        const t2 = await tx
          .select()
          .from(bookmark_tags)
          .where(eq(bookmark_tags.bookmark_id, data.bookmark.id));
        console.log({ f2, t2 });
      })
      .catch((e) => {
        console.log(e);
      });
  });
