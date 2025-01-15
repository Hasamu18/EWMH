export function BuildSearchParams(params: any): string {
  let result = "?";

  Object.entries(params).forEach(([key, value]) => {
    if (value != "") result += `${key}=${value}&`;
  });
  if (result.endsWith("&")) {
    result = result.slice(0, -1);
  }
  console.log(`result: ${result}`);
  return result;
}
