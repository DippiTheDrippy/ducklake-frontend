export function formatValue(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  return value;
}

export function formatPercentage(value: number | null | undefined) {
  if (value === null || value === undefined) {
    return "—";
  }

  return `${value.toFixed(2)}%`;
}

export function formatColumnType(type: string) {
  return type
    .replaceAll("(", "(\n")
    .replaceAll(")", "\n)")
    .replaceAll(",", ",\n");
}
