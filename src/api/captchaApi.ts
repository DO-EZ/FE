// src/api/captchaApi.ts
import axios from 'axios';

export interface CaptchaChallenge {
  id: string;
  expected: string;
}

export interface PredictResponse {
  passed: boolean;
  message: string;
}

const BASE_URL = 'http://localhost:8000'; // 백엔드 주소

export async function fetchCaptchaChallenge(): Promise<CaptchaChallenge> {
  const res = await axios.get(`${BASE_URL}/captcha`, {
    withCredentials: true,
  });
  return await res.data;
}

export async function submitCaptchaImage(
  imageBase64: string,
  id: string
): Promise<PredictResponse> {
  const res = await axios.post(
    `${BASE_URL}/predict`,
    {
      image: imageBase64,
      id: id,
    },
    {
      withCredentials: true,
    }
  );

  return await res.data;
}
