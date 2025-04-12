import { google } from "@ai-sdk/google";
import { createServerFn } from "@tanstack/react-start";
import { generateObject } from "ai";
import { z } from "zod";
import { db } from "~/db";
import { tags } from "~/db/schema";
import { authMiddleware } from "~/lib/auth-middleware";

export const getBookmarkFieldSuggestions = createServerFn({ method: "GET" })
  .validator(z.object({ url: z.string() }))
  .middleware([authMiddleware])
  .handler(async ({ data }) => {
    const model = google("gemini-2.0-pro-exp-02-05");

    const existingTags = await db
      .select({ id: tags.id, name: tags.name })
      .from(tags);

    const prompt = [
      "Analyze this website: " + data.url,
      "",
      "Return a JSON object with the following fields:",
      "- name: The name of the website or product.",
      "- description: A short and clear summary of what the website does.",
      "- tags: Exactly 5 lowercase, hyphen-separated tags relevant to the website.",
      "",
      "Tag rules:",
      "- You are given a list of existing tags from the database (see below).",
      "- Match tag names case-insensitively.",
      '- Always include "name" for every tag.',
      '- If the tag exists, include its "id" and set "isNew": false.',
      '- If it\'s a new tag, include just "name" and set "isNew": true.',
      "",
      "Existing tags:",
      JSON.stringify(existingTags, null, 2),
      "",
      "Example response format:",
      "{",
      '  "name": "Example Site",',
      '  "description": "A site for doing cool things.",',
      '  "tags": [',
      '    { "id": 2, "name": "productivity", "isNew": false },',
      '    { "name": "open-source", "isNew": true }',
      "  ]",
      "}",
    ].join("\n");

    const result = await generateObject({
      model,
      prompt,
      schema: z.object({
        name: z.string().describe("Name of the website or product"),
        description: z
          .string()
          .describe("A short summary of what the website does"),
        tags: z
          .array(
            z.object({
              id: z
                .number()
                .optional()
                .describe("Only for existing tags from the list above"),
              name: z.string().describe("Name of the tag (always required)"),
              isNew: z
                .boolean()
                .describe("True if this tag is newly generated"),
            })
          )
          .length(5)
          .describe("Exactly 5 relevant tags"),
      }),
    });

    return result.object;
  });

export const checkUrlExists = createServerFn({ method: "POST" })
  .validator(z.object({ url: z.string() }))
  .handler(async ({ data }) => {
    try {
      const res = await fetch(data.url, { method: "HEAD" });
      return res.ok;
    } catch {
      return false;
    }
  });
