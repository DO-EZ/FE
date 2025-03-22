// src/api/captchaApi.ts

export interface CaptchaChallenge {
    id: string;
    expected: string;
  }
  
  export interface PredictResponse {
    passed: boolean;
    message?: string;
  }
  
  // ✅ mock challenge ID & expected 값 저장 (임의로 고정)
  let currentMockCaptcha: CaptchaChallenge = {
    id: "mock-123",
    expected: Math.floor(Math.random() * 10).toString() // 0~9 중 하나
  };
  
  export async function fetchCaptchaChallenge(): Promise<CaptchaChallenge> {
    // 시뮬레이션: 서버에서 새로운 캡차 받음
    currentMockCaptcha = {
      id: "mock-123",
      expected: Math.floor(Math.random() * 10).toString()
    };
    console.log("[Mock] New captcha:", currentMockCaptcha.expected);
    return new Promise(resolve => setTimeout(() => resolve(currentMockCaptcha), 300)); // simulate delay
  }
  
  export async function submitCaptchaImage(imageBase64: string, id: string): Promise<PredictResponse> {
    // 시뮬레이션: 랜덤으로 정답 or 오답 처리
    const passed = Math.random() < 0.5;
    return new Promise(resolve =>
      setTimeout(() => resolve({
        passed,
        message: passed ? "통과!" : "실패!"
      }), 500)
    );
  }
  