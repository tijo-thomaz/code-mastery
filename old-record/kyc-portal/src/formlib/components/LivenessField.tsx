import { useState, useRef, useCallback, useEffect } from "react";
import type { FieldComponentProps, LivenessFieldConfig } from "../types";
import {
  detectFace, detectMotion,
  CHALLENGE_MESSAGES, FACE_CONFIDENCE_MIN, MOTION_LIVENESS_MIN,
  MOTION_STILL_MAX, HOLD_STILL_FRAMES, MOTION_FRAMES_NEEDED,
  type ChallengeStep,
} from "../../kyclib/liveness";

type Status = "idle" | "active" | "passed" | "failed" | "denied";

export const LivenessField = ({ field, value, error, onChange }: FieldComponentProps<LivenessFieldConfig>) => {
  const [status, setStatus] = useState<Status>(value === "passed" ? "passed" : "idle");
  const [challenge, setChallenge] = useState<ChallengeStep>("waiting");
  const [progress, setProgress] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const prevFrameRef = useRef<ImageData | null>(null);
  const rafRef = useRef<number>(0);
  const countersRef = useRef({ still: 0, motion: 0 });

  const stopCamera = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    prevFrameRef.current = null;
    countersRef.current = { still: 0, motion: 0 };
  }, []);

  useEffect(() => () => stopCamera(), [stopCamera]);

  const runChallenge = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.readyState < 2) {
      rafRef.current = requestAnimationFrame(runChallenge);
      return;
    }

    const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const face = detectFace(frame);
    const prev = prevFrameRef.current;
    const motion = prev ? detectMotion(prev, frame) : 0;
    prevFrameRef.current = frame;

    const c = countersRef.current;

    // State machine
    setChallenge((current) => {
      if (current === "passed" || current === "failed") return current;

      // Step 1: waiting for face
      if (current === "waiting") {
        if (face.detected && face.confidence >= FACE_CONFIDENCE_MIN) {
          c.still = 0;
          setProgress(20);
          return "detecting";
        }
        return "waiting";
      }

      // Step 2: face detected, confirm it's stable
      if (current === "detecting") {
        if (!face.detected) { setProgress(0); return "waiting"; }
        if (motion < MOTION_STILL_MAX) c.still++;
        else c.still = 0;
        setProgress(20 + Math.min((c.still / HOLD_STILL_FRAMES) * 30, 30));
        if (c.still >= HOLD_STILL_FRAMES) {
          c.motion = 0;
          setProgress(50);
          return "hold_still";
        }
        return "detecting";
      }

      // Step 3: held still, now transition to motion check
      if (current === "hold_still") {
        setProgress(55);
        c.motion = 0;
        return "move_head";
      }

      // Step 4: detect intentional motion (anti-spoofing)
      if (current === "move_head") {
        if (!face.detected) {
          // Lost face during motion — could be too much movement, give a chance
          if (c.motion >= MOTION_FRAMES_NEEDED) {
            setProgress(100);
            return "capturing";
          }
          setProgress(0);
          c.still = 0;
          c.motion = 0;
          return "waiting";
        }
        if (motion > MOTION_LIVENESS_MIN) c.motion++;
        setProgress(55 + Math.min((c.motion / MOTION_FRAMES_NEEDED) * 40, 40));
        if (c.motion >= MOTION_FRAMES_NEEDED) {
          setProgress(100);
          return "capturing";
        }
        return "move_head";
      }

      // Step 5: capturing / finalizing
      if (current === "capturing") {
        setTimeout(() => {
          setStatus("passed");
          setChallenge("passed");
          onChange(field.name, "passed");
          stopCamera();
        }, 500);
        return "capturing";
      }

      return current;
    });

    rafRef.current = requestAnimationFrame(runChallenge);
  }, [field.name, onChange, stopCamera]);

  const startScan = useCallback(async () => {
    if (status === "active") return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setStatus("active");
      setChallenge("waiting");
      setProgress(0);
      countersRef.current = { still: 0, motion: 0 };
      prevFrameRef.current = null;
      rafRef.current = requestAnimationFrame(runChallenge);
    } catch {
      setStatus("denied");
    }
  }, [status, runChallenge]);

  const retry = useCallback(() => {
    stopCamera();
    setStatus("idle");
    setChallenge("waiting");
    setProgress(0);
    onChange(field.name, "");
  }, [stopCamera, field.name, onChange]);

  // Colors per challenge step
  const stepColor: Record<ChallengeStep, string> = {
    waiting: "var(--color-text-muted)",
    detecting: "var(--color-info)",
    hold_still: "var(--color-info)",
    move_head: "var(--color-warning)",
    capturing: "var(--color-brand)",
    passed: "var(--color-brand)",
    failed: "var(--color-error)",
  };

  return (
    <div style={{ marginBottom: "var(--space-md)" }}>
      <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--color-text-label)", marginBottom: "var(--space-xs)", letterSpacing: "0.05em", textTransform: "uppercase" }}>
        {field.label}{field.required && <span style={{ color: "var(--color-brand)", marginLeft: 2 }}>*</span>}
      </label>

      <div style={{
        borderRadius: "var(--radius-md)", overflow: "hidden",
        border: `2px solid ${error ? "var(--color-error)" : status === "passed" ? "var(--color-brand)" : "var(--color-border)"}`,
        background: "var(--color-bg-input)", transition: "border-color 0.3s",
      }}>
        {/* Camera viewport */}
        {status === "active" && (
          <div style={{ position: "relative", background: "#000" }}>
            <video ref={videoRef} muted playsInline style={{ width: "100%", display: "block", transform: "scaleX(-1)" }} />
            <canvas ref={canvasRef} style={{ display: "none" }} />

            {/* Oval guide overlay */}
            <div style={{
              position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
              pointerEvents: "none",
            }}>
              <div style={{
                width: "55%", height: "75%", borderRadius: "50%",
                border: `3px solid ${stepColor[challenge]}`,
                boxShadow: `0 0 0 9999px rgba(0,0,0,0.4), inset 0 0 30px rgba(0,0,0,0.1)`,
                transition: "border-color 0.3s",
              }} />
            </div>

            {/* Progress bar */}
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 4, background: "rgba(0,0,0,0.5)" }}>
              <div style={{
                height: "100%", width: `${progress}%`, background: stepColor[challenge],
                transition: "width 0.3s, background 0.3s",
              }} />
            </div>
          </div>
        )}

        {/* Status / action area */}
        <div
          onClick={status === "idle" || status === "failed" || status === "denied" ? startScan : status === "passed" ? undefined : undefined}
          role={status === "idle" || status === "failed" || status === "denied" ? "button" : undefined}
          aria-label={status === "idle" ? "Start face scan" : undefined}
          style={{
            padding: "var(--space-lg)", textAlign: "center",
            cursor: status === "idle" || status === "failed" || status === "denied" ? "pointer" : "default",
          }}
        >
          {status === "idle" && (
            <>
              <div style={{ fontSize: "40px", marginBottom: "var(--space-sm)" }}>📷</div>
              <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--color-text-muted)" }}>Start Face Verification</div>
              <div style={{ fontSize: "11px", color: "var(--color-text-muted)", marginTop: "var(--space-xs)" }}>Requires camera access</div>
            </>
          )}

          {status === "active" && (
            <>
              <div style={{ fontSize: "14px", fontWeight: 600, color: stepColor[challenge], marginBottom: 4 }}>
                {CHALLENGE_MESSAGES[challenge]}
              </div>
              <div style={{ fontSize: "11px", color: "var(--color-text-muted)" }}>
                {challenge === "waiting" && "Center your face in the oval above"}
                {challenge === "detecting" && "Analyzing..."}
                {challenge === "hold_still" && "Almost there..."}
                {challenge === "move_head" && "Slowly turn left, then right"}
                {challenge === "capturing" && "Hold on..."}
              </div>
            </>
          )}

          {status === "passed" && (
            <>
              <div style={{ fontSize: "40px", marginBottom: "var(--space-sm)" }}>✅</div>
              <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--color-brand)" }}>Liveness Verified</div>
              <div style={{ fontSize: "11px", color: "var(--color-text-muted)", marginTop: "var(--space-xs)" }}>Face check passed</div>
            </>
          )}

          {status === "failed" && (
            <>
              <div style={{ fontSize: "40px", marginBottom: "var(--space-sm)" }}>❌</div>
              <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--color-error)" }}>Failed — Tap to Retry</div>
            </>
          )}

          {status === "denied" && (
            <>
              <div style={{ fontSize: "40px", marginBottom: "var(--space-sm)" }}>🚫</div>
              <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--color-error)" }}>Camera access denied</div>
              <div style={{ fontSize: "11px", color: "var(--color-text-muted)", marginTop: "var(--space-xs)" }}>
                Allow camera permissions and tap to retry
              </div>
            </>
          )}
        </div>

        {/* Retry button when active */}
        {(status === "active" || status === "passed") && (
          <div style={{ borderTop: "1px solid var(--color-border)", padding: "var(--space-sm)", textAlign: "center" }}>
            <button onClick={retry} style={{
              background: "transparent", border: "none", color: "var(--color-text-muted)",
              fontSize: "12px", cursor: "pointer", fontFamily: "var(--font-body)", fontWeight: 600,
            }}>
              ↺ Restart
            </button>
          </div>
        )}
      </div>

      {error && <span role="alert" style={{ fontSize: "11px", color: "var(--color-error)", marginTop: 4, display: "block" }}>{error}</span>}
    </div>
  );
};
