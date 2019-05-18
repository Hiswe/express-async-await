const wait = (t = 300, val) => new Promise(r => setTimeout(() => r(val), t));

export const VALID_PARAM = `valid-param`;
export const JOIN_ID = `join-id`;

export async function getItem(itemParam) {
  await wait();
  if (!itemParam) return null;
  if (itemParam === VALID_PARAM) return { itemParam, joinId: JOIN_ID };
  throw new Error(`validation fail for itemId`, itemParam);
}

export async function getTableJoinItem(joinId) {
  await wait();
  if (!joinId) throw new Error(`joinId is needed`);
  if (joinId === JOIN_ID) return { message: `that's cool bro`, _id: `join-id` };
  return { code: 4059, reason: `not found` };
}
