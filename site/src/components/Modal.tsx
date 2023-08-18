import { FC, MouseEventHandler, ReactNode, useEffect } from 'react'

export const Modal: FC<{
  children: ReactNode
  empty?: boolean
  open: boolean
  onCancel?: MouseEventHandler<HTMLDivElement>
}> = ({ children, empty, open, onCancel }) => {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [open])

  return open ? (
    <div className="fixed inset-0 px-4 z-[100] pb-4 max-h-screen flex items-center justify-center">
      <div className="fixed inset-0 transition-opacity" onClick={onCancel}>
        <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
      </div>
      {empty ? (
        <div className="transform flex items-center justify-center rounded-lg p-2 w-full min-h-[50dvh] max-h-[90dvh] overflow-auto lg:max-w-6xl">
          {children}
        </div>
      ) : (
        <div className="bg-white rounded-lg px-4 max-h-[90vh] overflow-auto pt-5 pb-4 shadow-xl transform transition-all sm:max-w-lg w-full sm:p-6">
          {children}
        </div>
      )}
    </div>
  ) : null
}
