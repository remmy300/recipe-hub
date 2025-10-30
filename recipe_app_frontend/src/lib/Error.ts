import axios from "axios";

/**
 * A reusable helper for handling Axios errors in createAsyncThunk
 * @param err - The error caught inside try/catch
 * @param rejectWithValue - The reject function provided by createAsyncThunk
 * @returns Rejected value with a proper error message
 */
export function handleAxiosError(
  err: unknown,
  rejectWithValue: (value: string) => unknown
): unknown {
  if (axios.isAxiosError(err)) {
    const message =
      (err.response?.data as { message?: string })?.message ||
      err.message ||
      "Request failed";
    return rejectWithValue(message) as never;
  }

  return rejectWithValue("An unexpected error occurred") as never;
}
