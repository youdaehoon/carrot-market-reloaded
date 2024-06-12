import { getSession } from "./session";

export async function login(id: number) {
  const session = await getSession();
  session.id = id;
  await session.save();
}

export function formatToWon(price: number) {
  return price.toLocaleString("ko-KR");
}

export function formatToTimeAgo(date: string) {
  const daInMs = 1000 * 60 * 60 * 24;
  const time = new Date(date).getTime();
  const now = new Date().getTime();
  const diff = Math.round((time - now) / daInMs);

  const formatter = new Intl.RelativeTimeFormat("ko");
  return formatter.format(diff,"days");
}
