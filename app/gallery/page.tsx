import { PhotoGrid } from "../../components/PhotoGrid";
import { getApodList } from "../../services/apodService";
import { getDatesForPage } from "../../utils/date";

import "./GalleryPage.css";

const GalleryPage = async () => {
  let initialInfiniteData = undefined;
  try {
    const { startDate, endDate } = getDatesForPage(0);
    const firstPageData = await getApodList(startDate, endDate);
    initialInfiniteData = {
      pages: [firstPageData],
      pageParams: [0],
    };
  } catch (error) {
    console.error("Failed to fetch initial APOD data:", error);
  }

  return (
    <div className="gallery-page">
      <PhotoGrid initialInfiniteData={initialInfiniteData} />
    </div>
  );
};

GalleryPage.displayName = "GalleryPage";

export default GalleryPage;
