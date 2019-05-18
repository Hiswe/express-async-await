const wait = (t = 300, val) => new Promise(r => setTimeout(() => r(val), t));

// this is a fake DB for the example

export const VALID_PARAM = `valid-param`;
export const JOIN_ID = `join-id`;

export async function getItem(itemParam) {
  await wait();
  if (itemParam !== VALID_PARAM) return null;
  return { itemParam, joinId: JOIN_ID };
}

export async function getTableJoinItem(joinId) {
  await wait();
  if (!joinId) throw new Error(`joinId is needed`);
  if (joinId === JOIN_ID) return { message: `that's cool bro`, _id: `join-id` };
  return { code: 4059, reason: `not found` };
}
