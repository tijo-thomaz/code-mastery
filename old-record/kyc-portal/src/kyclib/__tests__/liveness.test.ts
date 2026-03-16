import { detectFace, detectMotion, FACE_CONFIDENCE_MIN, MOTION_LIVENESS_MIN } from "../liveness";

// jsdom doesn't provide ImageData — polyfill for tests
if (typeof globalThis.ImageData === "undefined") {
  (globalThis as any).ImageData = class ImageData {
    data: Uint8ClampedArray;
    width: number;
    height: number;
    constructor(data: Uint8ClampedArray, width: number, height: number) {
      this.data = data; this.width = width; this.height = height;
    }
  };
}

function makeImageData(width: number, height: number, fill: (x: number, y: number) => [number, number, number, number]): ImageData {
  const data = new Uint8ClampedArray(width * height * 4);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const [r, g, b, a] = fill(x, y);
      data[i] = r; data[i + 1] = g; data[i + 2] = b; data[i + 3] = a;
    }
  }
  return new ImageData(data, width, height);
}

describe("detectFace", () => {
  it("detects skin-tone pixels in center ROI as a face", () => {
    // Fill center with a skin-tone color (light brown: R=200, G=150, B=120)
    const frame = makeImageData(100, 100, (x, y) => {
      const inCenter = x >= 20 && x < 80 && y >= 10 && y < 90;
      return inCenter ? [200, 150, 120, 255] : [30, 30, 30, 255];
    });

    const result = detectFace(frame);
    expect(result.detected).toBe(true);
    expect(result.confidence).toBeGreaterThanOrEqual(FACE_CONFIDENCE_MIN);
  });

  it("returns not detected for non-skin-tone frame", () => {
    // All dark blue — no skin tones
    const frame = makeImageData(100, 100, () => [10, 10, 80, 255]);
    const result = detectFace(frame);
    expect(result.detected).toBe(false);
    expect(result.confidence).toBeLessThan(FACE_CONFIDENCE_MIN);
  });

  it("returns not detected for a completely black frame", () => {
    const frame = makeImageData(100, 100, () => [0, 0, 0, 255]);
    const result = detectFace(frame);
    expect(result.detected).toBe(false);
  });

  it("works with darker skin tones", () => {
    // Darker skin tone (R=150, G=100, B=70)
    const frame = makeImageData(100, 100, (x, y) => {
      const inCenter = x >= 20 && x < 80 && y >= 10 && y < 90;
      return inCenter ? [150, 100, 70, 255] : [20, 20, 20, 255];
    });
    const result = detectFace(frame);
    expect(result.detected).toBe(true);
  });
});

describe("detectMotion", () => {
  it("returns zero motion for identical frames", () => {
    const frame = makeImageData(100, 100, () => [100, 100, 100, 255]);
    const motion = detectMotion(frame, frame);
    expect(motion).toBe(0);
  });

  it("detects motion between significantly different frames", () => {
    const frame1 = makeImageData(100, 100, () => [50, 50, 50, 255]);
    const frame2 = makeImageData(100, 100, () => [200, 200, 200, 255]);
    const motion = detectMotion(frame1, frame2);
    expect(motion).toBeGreaterThan(MOTION_LIVENESS_MIN);
  });

  it("returns low motion for small pixel changes", () => {
    const frame1 = makeImageData(100, 100, () => [100, 100, 100, 255]);
    // Only a tiny change per channel (below the per-channel threshold of 30)
    const frame2 = makeImageData(100, 100, () => [105, 105, 105, 255]);
    const motion = detectMotion(frame1, frame2);
    expect(motion).toBe(0);
  });

  it("detects partial frame motion", () => {
    const frame1 = makeImageData(100, 100, () => [100, 100, 100, 255]);
    // Change only the left half significantly
    const frame2 = makeImageData(100, 100, (x) =>
      x < 50 ? [250, 250, 250, 255] : [100, 100, 100, 255]
    );
    const motion = detectMotion(frame1, frame2);
    expect(motion).toBeGreaterThan(0);
    expect(motion).toBeLessThan(1);
  });
});
