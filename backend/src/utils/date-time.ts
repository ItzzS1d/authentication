export const thirtyDaysFromNow = (): Date =>
  new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

export const fourtyFiveFromNow = (): Date => {
  const date = new Date();
  date.setMinutes(new Date().getMinutes() + 45);

  return date;
};
export const threeMinutesAgo = (): Date => new Date(Date.now() - 3 * 60 * 1000);
export const anHourFromNow = (): Date => {
  const date = new Date();
  date.setHours(new Date().getHours() + 60 * 60 * 1000);
  return date;
};
export const thenMinutesAgo = (): Date => new Date(Date.now() - 10 * 60 * 1000);
