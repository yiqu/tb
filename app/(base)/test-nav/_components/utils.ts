export const MOCK_ITEMS: { id: number; name: string }[] = Array.from({ length: 10 }, (_, index) => {
  let chance = Math.random();
  let name = 'small';
  if (chance > 0.3) {
    name = 'medium';
  } else if (chance > 0.6) {
    name = 'large';
  } else {
    name = 'small';
  }
  return {
    id: index + 1,
    name,
  };
});
