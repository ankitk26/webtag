import { createServerFn } from "@tanstack/react-start";
import { and, count, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "~/db";
import { bookmark_folders, folders } from "~/db/schema";
import { authMiddleware } from "~/lib/auth-middleware";

export const getFolders = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const user = context.user;
    const data = await db
      .select()
      .from(folders)
      .where(eq(folders.created_by, user.id));

    return data;
  });

export const getFolderById = createServerFn({ method: "GET" })
  .validator((folder: { folderId: number }) => {
    return folder;
  })
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const user = context.user;
    const folder = await db
      .select()
      .from(folders)
      .where(
        and(eq(folders.created_by, user.id), eq(folders.id, data.folderId))
      )
      .limit(1);

    return folder[0];
  });

export const getFoldersWithBookmarkCount = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const user = context.user;

    const data = await db
      .select({
        id: folders.id,
        name: folders.name,
        bookmark_count: count(bookmark_folders.bookmark_id),
      })
      .from(folders)
      .leftJoin(bookmark_folders, eq(folders.id, bookmark_folders.folder_id))
      .where(eq(folders.created_by, user.id))
      .groupBy(folders.id, folders.name);

    return data;
  });

export const addFolder = createServerFn({ method: "POST" })
  .validator(
    z.object({
      name: z.string().nonempty().trim(),
      description: z.string().optional(),
    })
  )
  .middleware([authMiddleware])
  .handler(async ({ data, context }) => {
    const user = context.user;

    await db.insert(folders).values({
      created_by: user.id,
      ...data,
    });
  });

export const updateFolder = createServerFn({ method: "POST" })
  .validator(
    z.object({
      id: z.number(),
      name: z.string().nonempty().trim(),
      description: z.string().optional(),
    })
  )
  .middleware([authMiddleware])
  .handler(async ({ data }) => {
    await db
      .update(folders)
      .set({
        name: data.name,
        description: data.description,
      })
      .where(eq(folders.id, data.id));
  });

export const deleteFolder = createServerFn({ method: "POST" })
  .validator(
    z.object({
      folderId: z.number(),
    })
  )
  .middleware([authMiddleware])
  .handler(async ({ data, context }) => {
    if (data.folderId === -1) {
      throw new Error("Invalid folder");
    }

    const user = context.user;

    const folder = await db
      .select()
      .from(folders)
      .where(eq(folders.id, data.folderId))
      .limit(1);
    if (folder && folder[0]) {
      if (folder[0].created_by != user.id) {
        throw new Error("Unauthorized request");
      }
    }

    await db.delete(folders).where(eq(folders.id, data.folderId));
  });

export const getFoldersbyBookmark = createServerFn({ method: "POST" })
  .validator(
    z.object({
      bookmarkId: z.number(),
    })
  )
  .middleware([authMiddleware])
  .handler(async ({ data, context }) => {
    if (data.bookmarkId === -1) {
      throw new Error("Invalid Bookmark");
    }

    const user = context.user;

    const folderData = await db
      .selectDistinct({
        id: folders.id,
        name: folders.name,
      })
      .from(folders)
      .innerJoin(bookmark_folders, eq(folders.id, bookmark_folders.folder_id))
      .where(
        and(
          eq(bookmark_folders.bookmark_id, data.bookmarkId),
          eq(folders.created_by, user.id)
        )
      );

    return folderData;
  });
