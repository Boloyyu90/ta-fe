// src/features/proctoring/utils/webcam.utils.ts

/**
 * Webcam Utilities
 * Helper functions for webcam capture and base64 conversion
 */

export const webcamUtils = {
    /**
     * Request webcam access
     */
    async requestWebcam(): Promise<MediaStream> {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 640 },
                    height: { ideal: 480 },
                    facingMode: 'user',
                },
                audio: false,
            });
            return stream;
        } catch (error) {
            throw new Error('Webcam access denied. Please allow camera access to continue.');
        }
    },

    /**
     * Capture frame from video element as base64
     */
    captureFrame(videoElement: HTMLVideoElement): string {
        const canvas = document.createElement('canvas');
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;

        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Canvas context not available');

        ctx.drawImage(videoElement, 0, 0);
        return canvas.toDataURL('image/jpeg', 0.8); // 80% quality
    },

    /**
     * Stop webcam stream
     */
    stopWebcam(stream: MediaStream | null): void {
        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
        }
    },

    /**
     * Check if webcam is available
     */
    async isWebcamAvailable(): Promise<boolean> {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            return devices.some((device) => device.kind === 'videoinput');
        } catch {
            return false;
        }
    },
};