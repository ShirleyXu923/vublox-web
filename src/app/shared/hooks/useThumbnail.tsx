import { PreviewMedia } from '@shared/utils/preview-media';

function useThumbnail(item: any, preview = false) {
  let thumbnail: any = null;
  const image = item.banner?.sm
  || item.banner_url?.sm || item.cover_image?.sm
  || item.cover_photo?.sm || item.preview_image_urls?.sm || item.image?.sm;

  if (item.name || item.title) {
    if (preview) {
      thumbnail = (
        <div className="image-placeholder image w-100">
          <div className="b5 h-100 d-flex align-items-center justify-content-center text-truncate">{item.name || item.title}</div>
        </div>
      );
    } else {
      thumbnail = (
        <div className="b5 d-flex align-items-center justify-content-center text-truncate image">
          <span>{item.name || item.title}</span>
        </div>
      );
    }
  }

  if (item.description || item.bio) {
    if (preview) {
      thumbnail = (
        <div className="image-placeholder image w-100">
          <div className="b5 h-100 d-flex align-items-center justify-content-center text-break text-center text-truncate">{item.description || item.bio}</div>
        </div>
      );
    } else {
      thumbnail = (
        <div className="b5 d-flex align-items-center justify-content-center text-break text-center text-truncate image">
          <span>{item.description || item.bio}</span>
        </div>
      );
    }
  }

  if (image) {
    if (preview) {
      thumbnail = (
        <div className="image">
          <PreviewMedia
            previewImage={
              item?.banner_url || item.preview_image_urls || item.cover_image || item.logo
            }
            mediaType=""
            videoSrc={item?.banner_url || item.media_url || item.cover_image || item.logo}
          />
        </div>
      );
    } else {
      thumbnail = (
        <div className="image h-100 w-100">
          <img className="w-100 h-100 object-cover" src={image} alt="" />
        </div>
      );
    }
  }

  return {
    thumbnail,
  };
}

export default useThumbnail;
