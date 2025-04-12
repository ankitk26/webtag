import { createServerFn } from "@tanstack/react-start";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "~/db";
import { bookmark_tags, bookmarks, tags } from "~/db/schema";
import { authMiddleware } from "~/lib/auth-middleware";

export const getBookmarkTags = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const user = context.user;

    const data = await db
      .selectDistinct({
        id: tags.id,
        name: tags.name,
        created_at: bookmark_tags.created_at,
      })
      .from(bookmarks)
      .innerJoin(bookmark_tags, eq(bookmarks.id, bookmark_tags.bookmark_id))
      .innerJoin(tags, eq(bookmark_tags.tag_id, tags.id))
      .where(eq(bookmarks.created_by, user.id))
      .orderBy(desc(bookmark_tags.created_at));

    return data;
  });

export const getSingleBookmarkTags = createServerFn({ method: "GET" })
  .validator(z.object({ bookmarkId: z.number() }))
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const user = context.user;

    const tagsData = await db
      .selectDistinct({
        id: tags.id,
        name: tags.name,
      })
      .from(bookmarks)
      .innerJoin(bookmark_tags, eq(bookmarks.id, bookmark_tags.bookmark_id))
      .innerJoin(tags, eq(bookmark_tags.tag_id, tags.id))
      .where(
        and(
          eq(bookmarks.created_by, user.id),
          eq(bookmarks.id, data.bookmarkId)
        )
      );

    return tagsData;
  });

export const getTags = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async () => {
    const tagsData = await db.select().from(tags);
    return tagsData;
  });
