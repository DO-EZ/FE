export interface CaptchaChallenge {
    id: string;
    expected: string;
  }
  
  export interface PredictResponse {
    passed: boolean;
    message?: string;
  }
  
  export async function fetchCaptchaChallenge(): Promise<CaptchaChallenge> {
    const res = await fetch("http://localhost:8000/captcha");
    if (!res.ok) throw new Error("캡차 로딩 실패");
    return await res.json();
  }
  
  export async function submitCaptchaImage(imageBase64: string, id: string): Promise<PredictResponse> {
    const res = await fetch("http://localhost:8000/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ image: imageBase64, id })
    });
    if (!res.ok) throw new Error("제출 실패");
    return await res.json();
  }
  