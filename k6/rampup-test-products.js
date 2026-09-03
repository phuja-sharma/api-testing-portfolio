import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 10 },
    { duration: '20s', target: 50 },
    { duration: '10s', target: 0 },
  ],
};

// 1. Dijalankan HANYA 1 KALI sebelum load test dimulai
export function setup() {
  const loginPayload = JSON.stringify({
    name: 'Pemilik',
    pin: '111111',
  });

  const loginParams = {
    headers: { 'Content-Type': 'application/json' },
  };

  const loginRes = http.post('http://localhost:3001/api/auth/login', loginPayload, loginParams);

  check(loginRes, {
    'setup login success': (r) => r.status === 200,
  });

  // Ambil cookie dari response header 'Set-Cookie'
  const cookieHeader = loginRes.headers['Set-Cookie'];

  // Return data cookie ini agar bisa dipakai oleh fungsi default
  return { authCookie: cookieHeader };
}

// 2. Dijalankan berulang kali oleh Virtual Users (VUs)
export default function (data) {
  // Ambil cookie dari parameter 'data' yang dikirim oleh setup()
  const params = {
    headers: {
      'Cookie': data.authCookie,
    },
  };

  const res = http.get('http://localhost:3001/api/products', params);

  check(res, {
    'get products success': (r) => r.status === 200,
  });

  sleep(1);
}