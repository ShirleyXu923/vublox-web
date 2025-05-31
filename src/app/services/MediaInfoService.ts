import mediaInfoFactory from 'mediainfo.js';

let mediaInfoInstance: any = null;
let initPromise: Promise<any> | null = null;

export const getMediaInfo = async () => {
  if (mediaInfoInstance) {
    return mediaInfoInstance;
  }

  if (!initPromise) {
    initPromise = mediaInfoFactory({
      locateFile: () => '/MediaInfoModule.wasm',
    }).then(instance => {
      mediaInfoInstance = instance;
      return instance;
    });
  }

  return initPromise;
};

export const analyzeFile = async (file: File) => {
  const mediaInfo = await getMediaInfo();

  const getSize = () => file.size;
  const readChunk = async (size: number, offset: number) => {
    const reader = new FileReader();
    const blob = file.slice(offset, offset + size);

    return new Promise<Uint8Array>((resolve) => {
      reader.onload = (e) => {
        resolve(new Uint8Array((e.target as FileReader).result as ArrayBuffer));
      };
      reader.readAsArrayBuffer(blob);
    });
  };

  try {
    const result = await mediaInfo.analyzeData(getSize, readChunk);
    return result;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('MediaInfo processing error:', error);
    throw error;
  }
};

// Make sure to call this when your app is shutting down or when you're done with MediaInfo
export const closeMediaInfo = () => {
  if (mediaInfoInstance) {
    mediaInfoInstance.close();
    mediaInfoInstance = null;
    initPromise = null;
  }
};
