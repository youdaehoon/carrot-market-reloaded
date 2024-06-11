import { getSession } from "./session";

export async function login(id: number) {
  const session = await getSession();
  session.id = id;
  await session.save();
}
