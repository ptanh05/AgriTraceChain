'use client'

import React, { useEffect, useState } from 'react';
import { BrowserWallet, Wallet } from '@meshsdk/core'; // Import BrowserWallet từ Mesh.js
import axios from 'axios';
import { useRouter } from 'next/navigation';
import jwt from 'jsonwebtoken';

export default function Login() {
  const router = useRouter();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [connected, setConnected] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [walletAvailable, setWalletAvailable] = useState<{ id: string; name: string; icon: string }[] | undefined>();

  useEffect(() => {
    async function getW() {
      const availableWallets = await BrowserWallet.getAvailableWallets();
      setWalletAvailable(availableWallets);
    }
    getW();
  }, []);

  async function connectWallet(id: string) {
    try {
      console.log('Đang kết nối ví...' + id);
      const walletInstance = await BrowserWallet.enable(id);
      setWallet(walletInstance);

      const address = await walletInstance.getChangeAddress();
      setWalletAddress(address);
      console.log('Địa chỉ ví:', address);
      setConnected(true);
    } catch (error) {
      console.error("Lỗi khi kết nối ví:", error);
      alert("Vui lòng cài đặt ví Nami hoặc Eternl!");
    }
  }

  useEffect(() => {
    const authenticate = async () => {
      if (connected && wallet) {
        setLoading(true);
        try {
          console.log('Đang xác thực...' + walletAddress);
          // Lấy nonce từ máy chủ
          const { data: { nonce } } = await axios.get(`/api/login/getNonce?addressWallet=${walletAddress}`);

          console.log(nonce);
          // Ký nonce với BrowserWallet bằng signData
          const signedMessage = await wallet.signData(nonce);

          // Gửi chữ ký về máy chủ để xác thực
          const { data: { accessToken } } = await axios.post('/api/login/verifySignature', {
            addressWallet: walletAddress,
            signature: signedMessage,
            nonce: nonce
          });

          // Lưu JWT vào localStorage
          localStorage.setItem("accessToken", accessToken);

          alert('Xác thực thành công!');

          const response = await axios.get('/api/checkAddressWallet', {
            params: { addressWallet: walletAddress },
            headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` },
          });
          console.log(response.data);
          if (response.data) {
            if (response.data.role == "0") {
               router.push("/dashboard");
            } else if (response.data.role == "1") {
               router.push("/dashboard");
            } else if (response.data.role == "2") {
               router.push("/dashboard");
            } else if (response.data.role == "3") {
               router.push("/dashboard");
            } else {
              alert("Tài khoản chưa đăng kí, tạo tài khoản mới");
               router.push('/register');
            }
          } else {
            alert("Đăng nhập thất bại, đăng nhập lại");
             router.push('/login');
          }
        } catch (error) {
          setConnected(false);
          console.error('Xác thực thất bại:', error);
          alert('Xác thực thất bại!');
        } finally {
          setLoading(false);
        }
      }
    };

    authenticate();
  }, [connected, wallet, walletAddress, router]);

  return (
    <div>
      <section className="relative isolate overflow-hidden bg-white px-6 py-24 sm:py-32 lg:px-8">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.indigo.100),white)] opacity-20" />
        <div className="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-white shadow-xl shadow-indigo-600/10 ring-1 ring-indigo-50 sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-center" />
        <div className="mx-auto max-w-2xl lg:max-w-4xl">
          <div className='flex justify-center items-center'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 h-12 text-red-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" />
            </svg>
          </div>
          <figure className="mt-10">
            <blockquote className="text-center text-xl font-semibold leading-8 text-gray-900 sm:text-2xl sm:leading-9">
              <p>
                Chào mừng đến với hệ thống bệnh viện phi tập trung
              </p>
            </blockquote>
            <div className='flex-col justify-center items-center'>
              <div className='flex justify-center items-center m-[20px]'>Các ví sẵn sàng kết nối</div>
              <div className='flex gap-10 justify-center items-center'>
                {walletAvailable?.map(wallet => (
                  <div key={wallet.name} className='bg-slate-200 p-2 rounded w-[100px] h-[100px]' onClick={() => connectWallet(wallet.id)}>
                    <p className='text-center'>{wallet.name}</p>
                    <div className='flex justify-center'>
                      <img src={wallet.icon} alt={wallet.name} className='size-[60px]' />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <figcaption className="mt-10">
              <div className="mt-4 flex items-center justify-center space-x-3 text-base">
                <div className="font-semibold text-gray-900"></div>
                <svg width={3} height={3} viewBox="0 0 2 2" aria-hidden="true" className="fill-gray-900">
                  <circle r={1} cx={1} cy={1} />
                </svg>
                <div className="text-gray-600">Nếu chưa có tài khoản <a href="register">Đăng kí</a></div>
              </div>
            </figcaption>
          </figure>
        </div>
      </section>
    </div>
  );
}
