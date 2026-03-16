// ── Pure liveness detection utilities (no React, no DOM references) ──

export interface FaceDetectionResult {
  detected: boolean;
  confidence: number;
  centerX: number;
  centerY: number;
}

export interface Rect { x: number; y: number; w: number; h: number; }

// Skin-tone detection in YCbCr color space — works across skin tones better than RGB.
function isSkinPixel(r: number, g: number, b: number): boolean {
  const y  =  0.299 * r + 0.587 * g + 0.114 * b;
  const cb = -0.169 * r - 0.331 * g + 0.500 * b + 128;
  const cr =  0.500 * r - 0.419 * g - 0.081 * b + 128;
  return y > 80 && cb > 77 && cb < 127 && cr > 133 && cr < 173;
}

// Detect face-like region in the center ROI of a frame
export function detectFace(imageData: ImageData): FaceDetectionResult {
  const { data, width, height } = imageData;

  // Region of interest — center 60% of the frame
  const roiX = Math.floor(width * 0.2);
  const roiY = Math.floor(height * 0.1);
  const roiW = Math.floor(width * 0.6);
  const roiH = Math.floor(height * 0.8);

  let skinPixels = 0;
  let totalPixels = 0;
  let sumX = 0;
  let sumY = 0;

  // Sample every 3rd pixel for performance
  for (let y = roiY; y < roiY + roiH; y += 3) {
    for (let x = roiX; x < roiX + roiW; x += 3) {
      const i = (y * width + x) * 4;
      totalPixels++;
      if (isSkinPixel(data[i], data[i + 1], data[i + 2])) {
        skinPixels++;
        sumX += x;
        sumY += y;
      }
    }
  }

  const confidence = totalPixels > 0 ? skinPixels / totalPixels : 0;
  const detected = confidence > 0.15;

  return {
    detected,
    confidence,
    centerX: skinPixels > 0 ? sumX / skinPixels : width / 2,
    centerY: skinPixels > 0 ? sumY / skinPixels : height / 2,
  };
}

// Compare two frames — returns ratio of changed pixels (0–1).
// A static photo will have near-zero motion; a live person moves.
export function detectMotion(prev: ImageData, curr: ImageData): number {
  const len = prev.data.length;
  let changed = 0;
  let total = 0;
  const threshold = 30; // per-channel delta to count as "changed"

  for (let i = 0; i < len; i += 16) { // sample every 4th pixel (stride 16 = 4 channels × 4)
    const dr = Math.abs(prev.data[i]     - curr.data[i]);
    const dg = Math.abs(prev.data[i + 1] - curr.data[i + 1]);
    const db = Math.abs(prev.data[i + 2] - curr.data[i + 2]);
    total++;
    if (dr + dg + db > threshold * 3) changed++;
  }

  return total > 0 ? changed / total : 0;
}

// ── Challenge state machine ──

export type ChallengeStep = "waiting" | "detecting" | "hold_still" | "move_head" | "capturing" | "passed" | "failed";

export interface ChallengeState {
  step: ChallengeStep;
  message: string;
  progress: number; // 0–100
}

export const CHALLENGE_MESSAGES: Record<ChallengeStep, string> = {
  waiting: "Position your face in the frame",
  detecting: "Face detected — hold still...",
  hold_still: "Good — stay still for a moment",
  move_head: "Now slowly turn your head left and right",
  capturing: "Capturing...",
  passed: "Liveness verified ✓",
  failed: "Verification failed — tap to retry",
};

// Thresholds
export const FACE_CONFIDENCE_MIN = 0.15;
export const MOTION_LIVENESS_MIN = 0.01;  // minimum motion to confirm "alive"
export const MOTION_STILL_MAX = 0.03;     // maximum motion to count as "holding still"
export const HOLD_STILL_FRAMES = 15;      // frames to hold still
export const MOTION_FRAMES_NEEDED = 5;    // frames with enough motion to pass
