import db from "@/lib/db";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";
import { login as Login } from "@/lib/utils";

async function getGitgubToken(code: string) {
  const accessTokenURL = "https://github.com/login/oauth/access_token";
  const accessTokenParams = {
    client_id: process.env.GITHUB_CLIENT_ID!,
    client_secret: process.env.GITHUB_CLIENT_SECRET!,
    code,
  };

  const formattedParams = new URLSearchParams(accessTokenParams).toString();
  const finalUrl = `${accessTokenURL}?${formattedParams}`;

  const { error, access_token }: { error: any; access_token: string } = await (
    await fetch(finalUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();

  return { error, access_token };
}

async function getGithubProfile(access_token: string) {
  const userProfileResponse = await fetch("https://api.github.com/user", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    cache: "no-cache",
  });
  console.log(userProfileResponse);
  const {
    id,
    login,
    avatar_url,
  }: { id: number; login: string; avatar_url: string } =
    await userProfileResponse.json();

  return { id, login, avatar_url };
}

async function getGihubEmail(access_token: string) {
  const userEmailResponse = await fetch("https://api.github.com/user/emails", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${access_token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    cache: "no-cache",
  });

  const { email }: { email: string } = (await userEmailResponse.json()).find(
    (res: { primary: boolean }) => res.primary == true
  );

  return { email };
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  if (!code) return new Response(null, { status: 400 });

  const { error, access_token } = await getGitgubToken(code);
  if (error) {
    return new Response(null, { status: 400 });
  }

  const { avatar_url, id, login } = await getGithubProfile(access_token);
  const { email } = await getGihubEmail(access_token);

  const user = await db.user.findUnique({
    where: {
      gitgub_id: id + "",
    },
    select: { id: true },
  });

  if (user) {
    await Login(user.id);

    return redirect("/profile");
  }

  const username = await db.user.findUnique({
    where: {
      username: login,
    },
    select: { id: true },
  });

  const newUser = await db.user.create({
    data: {
      gitgub_id: id + "",
      avatar: avatar_url,
      username: Boolean(username) ? login + "_github" : login,
      email,
    },
    select: {
      id: true,
    },
  });

  await Login(newUser.id);

  return redirect("/profile");
}
