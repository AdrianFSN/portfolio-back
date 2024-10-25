export function selectDeletionFlags(deletionFlagsList: object) {
  const trueFlagsList = Object.keys(deletionFlagsList).filter(
    (key) => (deletionFlagsList as any)[key] === "true"
  );
  return trueFlagsList;
}
