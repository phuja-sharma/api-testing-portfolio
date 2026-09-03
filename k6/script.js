import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 20,
  duration: '30s',
};

export default function () {
  // 1. Lakukan request Login
  const loginPayload = JSON.stringify({
    name: 'Pemilik',
    pin: '111111',
  });

  const loginParams = {
    headers: { 'Content-Type': 'application/json' },
  };

  const loginRes = http.post('http://localhost:3001/api/auth/login', loginPayload, loginParams);
  
  check(loginRes, {
    'login success': (r) => r.status === 200,
  });

  // 2. Tembak endpoint terproteksi (Cookie dari respon login akan otomatis dikirim)
  const res = http.get('http://localhost:3001/api/products');

  check(res, {
    'get products success': (r) => r.status === 200,
  });

  sleep(1);
}