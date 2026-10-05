"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { clearAdminSession, createAdminSession, isAdmin, passwordMatches } from "../../lib/admin-auth";
import { isPortfolioContent, prepareProjectImage, savePortfolio } from "../../lib/portfolio";

export type ActionState = { error?: string; success?: string };

export async function loginAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const password = formData.get("password");
  if (typeof password !== "string" || !passwordMatches(password)) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { error: "Incorrect password." };
  }
  await createAdminSession();
  redirect("/admin");
}

export async function logoutAction() {
  await clearAdminSession();
  redirect("/admin");
}

export async function saveContentAction(_: ActionState, formData: FormData): Promise<ActionState> {
  if (!await isAdmin()) return { error: "Your session expired. Sign in again." };
  const payload = formData.get("content");
  if (typeof payload !== "string" || payload.length > 100_000) return { error: "The submitted content is too large." };
  try {
    const content: unknown = JSON.parse(payload);
    if (!isPortfolioContent(content)) return { error: "Some fields are missing or invalid." };
    const images = [];
    for (const [index, project] of content.projects.entries()) {
      const file = formData.get(`projectImage-${index}`);
      if (file instanceof File && file.size > 0) {
        const image = await prepareProjectImage(file);
        images.push(image);
        project.image = `/api/project-images/${image.id}`;
      }
    }
    await savePortfolio(content, images);
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: "Portfolio updated." };
  } catch (error) {
    console.error("Unable to save portfolio content", error);
    if (error instanceof Error && error.message.startsWith("Project images")) return { error: error.message };
    return { error: "Could not save. Check the database connection and try again." };
  }
}
