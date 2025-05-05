import { render, screen } from "../../utils/test-utils";
import type {
  UseInfiniteQueryResult,
  InfiniteData,
} from "@tanstack/react-query";
import { PhotoGrid } from "./index";
import { ApodData } from "../../services/apodService";
import * as useApodQueries from "../../hooks/useApodQueries";

jest.mock("../../hooks/useApodQueries");

const mockPage1: ApodData[] = [
  {
    date: "2024-07-28",
    title: "Image 1",
    media_type: "image",
    url: "img1.jpg",
    explanation: "",
    service_version: "v1",
  },
  {
    date: "2024-07-27",
    title: "Image 2",
    media_type: "image",
    url: "img2.jpg",
    explanation: "",
    service_version: "v1",
  },
];

const mockInfiniteData = {
  pages: [mockPage1],
  pageParams: [0],
};

describe("PhotoGrid", () => {
  let mockUseInfiniteApodList: jest.SpyInstance;
  type MockedQueryResult = Partial<
    UseInfiniteQueryResult<InfiniteData<ApodData[], number>, Error>
  >;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseInfiniteApodList = jest.spyOn(useApodQueries, "useInfiniteApodList");
  });

  it("renders loading state initially", () => {
    mockUseInfiniteApodList.mockReturnValue({
      status: "pending",
      data: undefined,
      error: null,
      fetchNextPage: jest.fn(),
      hasNextPage: false,
      isFetching: true,
      isFetchingNextPage: false,
    } as MockedQueryResult);

    render(<PhotoGrid />);
    expect(screen.getByLabelText(/Loading images/i)).toBeInTheDocument();
  });

  it("renders error state", () => {
    const errorMessage = "Failed to fetch";
    mockUseInfiniteApodList.mockReturnValue({
      status: "error",
      data: undefined,
      error: new Error(errorMessage),
      fetchNextPage: jest.fn(),
      hasNextPage: false,
      isFetching: false,
      isFetchingNextPage: false,
    } as MockedQueryResult);

    render(<PhotoGrid />);
    expect(
      screen.getByText(`Error loading images: ${errorMessage}`)
    ).toBeInTheDocument();
  });

  it("renders grid with data when loaded successfully", () => {
    mockUseInfiniteApodList.mockReturnValue({
      status: "success",
      data: mockInfiniteData as InfiniteData<ApodData[], number>, // Cast mock data
      error: null,
      fetchNextPage: jest.fn(),
      hasNextPage: true,
      isFetching: false,
      isFetchingNextPage: false,
    } as MockedQueryResult);

    render(<PhotoGrid />);

    expect(screen.getByAltText(/Image 1/i)).toBeInTheDocument();
    expect(screen.getByAltText(/Image 2/i)).toBeInTheDocument();
    expect(screen.getByTestId("photo-grid-sentinel")).toBeInTheDocument();
  });

  it("renders loading more state when fetching next page", () => {
    mockUseInfiniteApodList.mockReturnValue({
      status: "success",
      data: mockInfiniteData as InfiniteData<ApodData[], number>,
      error: null,
      fetchNextPage: jest.fn(),
      hasNextPage: true,
      isFetching: false,
      isFetchingNextPage: true,
    } as MockedQueryResult);

    render(<PhotoGrid />);
    expect(screen.getByAltText(/Image 1/i)).toBeInTheDocument();
    expect(screen.getByAltText(/Image 2/i)).toBeInTheDocument();
    expect(screen.getByTestId("photo-grid-sentinel")).toBeInTheDocument();
  });

  it("renders end of list message when no more pages", () => {
    mockUseInfiniteApodList.mockReturnValue({
      status: "success",
      data: mockInfiniteData as InfiniteData<ApodData[], number>, // Cast mock data
      error: null,
      fetchNextPage: jest.fn(),
      hasNextPage: false,
      isFetching: false,
      isFetchingNextPage: false,
    } as MockedQueryResult);

    render(<PhotoGrid />);
    expect(screen.getByText(/No more images to load./i)).toBeInTheDocument();
  });
});
