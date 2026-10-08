// Server-side stub for agora-rtc-sdk-ng to prevent bundling 2MB+ WebRTC engine into SSR server chunks
export const AgoraRTC = {
  createClient: () => null,
  createCameraVideoTrack: () => Promise.resolve(null),
  createMicrophoneAudioTrack: () => Promise.resolve(null),
  checkSystemRequirements: () => false,
  getDevices: () => Promise.resolve([]),
};

export default AgoraRTC;
