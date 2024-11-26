export function buildQueryString(params) {
  let filtered = {};

  for (let key in params) {
    if (params[key] != null) {
      filtered[key] = params[key];
    }
  }

  return new URLSearchParams(filtered);
}
