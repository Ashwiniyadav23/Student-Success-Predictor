import React, { createContext, useContext, useState, type ReactNode } from 'react';

type ToastNotification = {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
};

type UIContextType = {
  enableAmbientParticles: boolean;
  setEnableAmbientParticles: (enabled: boolean) => void;
  toggleAmbientParticles: () => void;
  toast: ToastNotification | null;
  showToast: (message: string, type?: ToastNotification['type']) => void;
  hideToast: () => void;
};

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [enableAmbientParticles, setEnableAmbientParticles] = useState<boolean>(true);
  const [toast, setToast] = useState<ToastNotification | null>(null);

  const toggleAmbientParticles = () => {
    setEnableAmbientParticles((prev) => !prev);
  };

  const showToast = (message: string, type: ToastNotification['type'] = 'info') => {
    const id = Date.now().toString();
    setToast({ id, message, type });
    setTimeout(() => {
      setToast((current) => (current?.id === id ? null : current));
    }, 3500);
  };

  const hideToast = () => {
    setToast(null);
  };

  return (
    <UIContext.Provider
      value={{
        enableAmbientParticles,
        setEnableAmbientParticles,
        toggleAmbientParticles,
        toast,
        showToast,
        hideToast,
      }}
    >
      {children}
    </UIContext.Provider>
  );
};

export const useUI = (): UIContextType => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};
