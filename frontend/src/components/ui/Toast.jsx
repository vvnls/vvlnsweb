import { useEffect, useState, createContext, useContext, useRef } from 'react';

const ToastCtx = createContext(() => {});
export const useToast = () => useContext(ToastCtx);

export function ToastProvider({ children }) {
  const [msg, setMsg] = useState('');
  const [on, setOn] = useState(false);
  const timer = useRef();

  const show = (text) => {
    setMsg(text);
    setOn(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setOn(false), 2200);
  };

  return (
    <ToastCtx.Provider value={show}>
      {children}
      <div className={`ts${on ? ' on' : ''}`} role="status">{msg}</div>
    </ToastCtx.Provider>
  );
}