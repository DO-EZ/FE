import React, { useEffect, useRef, useState } from 'react';
import { fetchCaptchaChallenge, submitCaptchaImage } from '../api/captchaApi';

const CANVAS_WIDTH = 200;
const CANVAS_HEIGHT = 200;

const CaptchaCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawing = useRef(false);
  const [message, setMessage] = useState('');
  const [captchaText, setCaptchaText] = useState<string>('');
  const [captchaId, setCaptchaId] = useState<string>('');


  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  };

  useEffect(() => {
    const initializeCaptcha = async () => {
      await fetchChallenge();
    };
    void initializeCaptcha();
  }, []);

  const fetchChallenge = async () => {
    try {
      const data = await fetchCaptchaChallenge();
      setCaptchaText(data.expected);
      setCaptchaId(data.id);
      clearCanvas();
      setMessage('');
    } catch (error) {
      setMessage('⚠️ 캡차 불러오기 실패');
      console.error(error);
    }
  };


  

  const handleMouseDown = (e: React.MouseEvent) => {
    isDrawing.current = true;
    const ctx = canvasRef.current?.getContext('2d');
    ctx?.beginPath();
    ctx?.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing.current) return;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.stroke();
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  const handleSubmit = async () => {
    const canvas = canvasRef.current;
    if (!canvas || !captchaId) return;

    const image = canvas.toDataURL('image/png');

    try {
      const res = await submitCaptchaImage(image, captchaId);
      const msg = res.message;
      console.log(res);
      if (res.passed) {
        setMessage(msg);
      } else {
        setMessage(msg);
        setTimeout(async () => {
          await fetchChallenge();
        }, 1000); // 실패 시 새로운 문제 불러오기
      }
    } catch (err) {
      setMessage('⚠️ 서버 오류');
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h3>아래에 "{captchaText}" 를 그려주세요</h3>
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{
          background: '#fff',
          border: '1px solid #aaa',
          cursor: 'crosshair',
        }}
      />
      <div style={{ marginTop: '10px' }}>
        <button type="button" onClick={() => void handleSubmit()} style={{ marginRight: '10px' }}>
          제출
        </button>
        <button type="button" onClick={() => void fetchChallenge()} style={{ marginRight: '10px' }}>
          새로고침
        </button>
      </div>
      <p style={{ marginTop: '10px' }}>{message}</p>
    </div>
  );
};

export default CaptchaCanvas;
