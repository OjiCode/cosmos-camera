import "@testing-library/jest-dom";

import { render, screen } from "../../utils/test-utils";

import { ApodCard } from "./index";
import { ApodData } from "../../services/apodService";
import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({
  ...jest.requireActual("next/navigation"),
  useRouter: jest.fn(),
}));

const mockImageApod: ApodData = {
  date: "2024-07-28",
  title: "Test Image Title",
  explanation: "Test explanation",
  media_type: "image",
  url: "https://example.com/image.jpg",
  service_version: "v1",
};

const mockVideoApod: ApodData = {
  date: "2024-07-27",
  title: "Test Video Title",
  explanation: "Test video explanation",
  media_type: "video",
  url: "https://youtube.com/watch?v=12345",
  thumbnail_url: "https://example.com/thumb.jpg",
  service_version: "v1",
};

const mockRouter = {
  push: jest.fn(),
};

const renderComponent = (apod: ApodData) => {
  return render(<ApodCard apod={apod} />);
};

describe("ApodCard", () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    mockRouter.push.mockClear();
  });

  it("renders correctly for an image APOD", () => {
    renderComponent(mockImageApod);

    const linkElement = screen.getByRole("link");
    expect(linkElement).toHaveAttribute("href", `/apod/${mockImageApod.date}`);
    expect(linkElement).toHaveAccessibleName(
      `NASA's Astronomy Picture of the Day for ${mockImageApod.date}: ${mockImageApod.title}`
    );

    const imgElement = screen.getByRole("img");
    expect(imgElement).toHaveAttribute("src", mockImageApod.url);
    expect(imgElement).toHaveAttribute(
      "alt",
      `NASA's Astronomy Picture of the Day for ${mockImageApod.date}: ${mockImageApod.title}`
    );
    expect(imgElement).toHaveAttribute("loading", "lazy");
  });

  it("renders correctly for a video APOD (using thumbnail)", () => {
    renderComponent(mockVideoApod);

    const linkElement = screen.getByRole("link");
    expect(linkElement).toHaveAttribute("href", `/apod/${mockVideoApod.date}`);
    expect(linkElement).toHaveAccessibleName(
      `NASA's Astronomy Picture of the Day for ${mockVideoApod.date}: ${mockVideoApod.title}`
    );

    const imgElement = screen.getByRole("img");
    expect(imgElement).toHaveAttribute("src", mockVideoApod.thumbnail_url);
    expect(imgElement).toHaveAttribute(
      "alt",
      `Video thumbnail for NASA's Astronomy Picture of the Day for ${mockVideoApod.date}: ${mockVideoApod.title}`
    );
    expect(imgElement).toHaveAttribute("loading", "lazy");
  });

  it("does not render if displayUrl is missing", () => {
    const apodWithoutUrl = {
      ...mockImageApod,
      url: undefined as unknown as string,
    };
    const { container } = renderComponent(apodWithoutUrl);
    expect(container.firstChild).toBeNull();
  });
});
