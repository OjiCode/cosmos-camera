import { ApodData } from "./apodService";

const mockApodEntryBase = {
  explanation: "Test explanation",
  service_version: "v1",
  copyright: "copyyrighted.",
};

const mockApodImage: ApodData = {
  ...mockApodEntryBase,
  date: "2024-07-15",
  title: "Spiral Galaxy NGC 1234",
  media_type: "image",
  url: "https://example.com/images/ngc1234.jpg",
  hdurl: "https://example.com/images/ngc1234_hd.jpg",
};

const mockApodVideo: ApodData = {
  ...mockApodEntryBase,
  date: "2024-07-13",
  title: "Mars Rover Curiosity Journey Video",
  media_type: "video",
  url: "https://example.com/videos/curiosity.mp4",
  thumbnail_url: "https://example.com/videos/curiosity_thumb.jpg",
};

let getApodList: typeof import("./apodService").getApodList;
let getApodByDate: typeof import("./apodService").getApodByDate;

global.fetch = jest.fn();

const MOCK_API_KEY = "test-api-key-from-jest";

describe("apodService", () => {
  beforeAll(async () => {
    jest.resetModules();
    process.env.NEXT_PUBLIC_NASA_KEY = MOCK_API_KEY;
    const apodServiceModule = await import("./apodService");
    getApodList = apodServiceModule.getApodList;
    getApodByDate = apodServiceModule.getApodByDate;
  });

  afterAll(() => {
    delete process.env.NEXT_PUBLIC_NASA_KEY;
  });

  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
    (global.fetch as jest.Mock).mockReset();
  });

  describe("getApodList", () => {
    it("should fetch and return a list of APOD entries successfully", async () => {
      const mockDataArray: ApodData[] = [mockApodImage, mockApodVideo];
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockDataArray,
      });

      const startDate = "2023-10-01";
      const endDate = "2023-10-02";
      const result = await getApodList(startDate, endDate);

      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith(
        `https://api.nasa.gov/planetary/apod?start_date=${startDate}&end_date=${endDate}&thumbs=true&api_key=${MOCK_API_KEY}`
      );
      expect(result).toEqual(mockDataArray);
    });

    it("should throw an error if the API call fails (response not ok)", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
        text: async () => "Server error details for getApodList",
      });

      const startDate = "2023-10-01";
      const endDate = "2023-10-02";

      await expect(getApodList(startDate, endDate)).rejects.toThrow(
        "Error: 500 Internal Server Error"
      );
    });
  });

  describe("getApodByDate", () => {
    it("should fetch and return a single APOD entry for a given date successfully", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockApodImage,
      });

      const dateToFetch = mockApodImage.date;
      const result = await getApodByDate(dateToFetch);

      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith(
        `https://api.nasa.gov/planetary/apod?date=${dateToFetch}&api_key=${MOCK_API_KEY}`
      );
      expect(result).toEqual(mockApodImage);
    });

    it("should throw an error if the API call for a single entry fails (response not ok)", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: "Not Found",
        text: async () => "Server error details for getApodByDate",
      });

      const dateToFetch = "2023-11-15";

      await expect(getApodByDate(dateToFetch)).rejects.toThrow(
        "Error: 404 Not Found"
      );
    });
  });
});
