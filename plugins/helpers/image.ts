export const imageUrl = (path: string): string => {
  return formatImageUrl(path)
}

function formatImageUrl(path: string) {
  return process.env.CDN_DOMAIN + "/" + path
}
