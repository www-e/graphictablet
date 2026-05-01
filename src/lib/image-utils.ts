export function getImageSrc(image: { data: string; mimeType: string }): string {
  if (image.data.startsWith("path:")) {
    return image.data.replace("path:", "")
  }
  return `data:${image.mimeType};base64,${image.data}`
}
