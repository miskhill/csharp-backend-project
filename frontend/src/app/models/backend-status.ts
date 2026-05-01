// This interface describes the JSON shape returned by the C# backend.
// Keeping the shape in one place makes the service and component easier to read.
export interface BackendStatus {
  status: string;
  message: string;
  serverUrl: string;
  learningNote: string;
}
