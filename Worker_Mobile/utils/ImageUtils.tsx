import * as FileSystem from "expo-file-system";
import {
  ImageResult,
  SaveFormat,
  manipulateAsync,
} from "expo-image-manipulator";
export function Base64ToBinary(base64: string): Blob {
  const binary = atob(base64);
  const array = [];
  for (let i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i));
  }
  return new Blob([new Uint8Array(array)], { type: "image/jpeg" });
}

export async function CompressPhoto(
  photo: any,
  w: number,
  h: number,
  compressRatio: number
): Promise<ImageResult> {
  const compresedPhoto = await manipulateAsync(
    photo.localUri || photo.uri,
    [
      {
        resize: { width: w, height: h },
      },
    ],
    { compress: compressRatio, format: SaveFormat.PNG }
  );
  return compresedPhoto;
}

export async function ImagePathToBase64(imagePath: string): Promise<string> {
  try {
    const base64 = await FileSystem.readAsStringAsync(imagePath, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return `data:image/jpeg;base64,${base64}`;
  } catch (error) {
    console.error("Error converting to Base64:", error);
    throw error;
  }
}
