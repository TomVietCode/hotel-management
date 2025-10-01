"use client"

import toast, { Toaster } from "react-hot-toast"

export const ToastContainer = () => {
  return (
    <Toaster 
      position="top-right" 
      reverseOrder={false}
      toastOptions={{
        duration: 3000,
        style: {
          padding: "16px 22px"
        }
      }}
    />
  )
}

class ToastService {
  success(message: string, duration: number = 2000) {
    toast.success((t) => (
      <div className="flex items-center justify-between">
        <span>{message}</span>
        <button 
          onClick={() => toast.dismiss(t.id)} 
          className="absolute top-1 right-1 hover:bg-gray-100 rounded-full p-1 transition-colors"
          style={{ alignSelf: 'flex-start' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    ), { duration })
  }

  error(message: string, duration: number = 3000) {
    toast.error((t) => (
      <div className="flex items-center justify-between">
        <span>{message}</span>
        <button 
          onClick={() => toast.dismiss(t.id)} 
          className="absolute top-1 right-1 hover:bg-gray-100 rounded-full p-1 transition-colors"
          style={{ alignSelf: 'flex-start' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    ), { duration })
  }


  info(message: string) {
    toast((t) => (
      <div className="flex items-center justify-between">
        <span>{message}</span>
        <button 
          onClick={() => toast.dismiss(t.id)} 
          className="absolute top-1 right-1 hover:bg-gray-100 rounded-full p-1 transition-colors"
          style={{ alignSelf: 'flex-start' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    ), { icon: 'ℹ️' })
  }

  loading(message: string) {
    return toast.loading(message)
  }
}

const Toast = new ToastService()
export default Toast