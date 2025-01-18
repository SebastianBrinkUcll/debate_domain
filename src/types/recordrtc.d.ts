declare module 'recordrtc' {
  interface RecordRTCConfiguration {
    type: string;
    mimeType: string;
    recorderType: any;
    timeSlice?: number;
    ondataavailable?: (blob: Blob) => void;
  }

  class RecordRTC {
    constructor(stream: MediaStream, config: RecordRTCConfiguration);
    startRecording(): void;
    stopRecording(callback?: () => void): void;
    static StereoAudioRecorder: any;
  }

  export = RecordRTC;
} 