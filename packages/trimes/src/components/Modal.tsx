import { FC, ReactNode } from 'react'

export const Modal: FC<{ children: ReactNode; empty?: boolean }> = ({
  children,
  empty
}) => {
  return (
    <div className="fixed inset-0 px-4 z-[100] pb-4 flex items-center justify-center">
      <div className="fixed inset-0 transition-opacity">
        <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
      </div>
      {empty ? (
        children
      ) : (
        <div className="bg-white rounded-lg  px-4 pt-5 pb-4 shadow-xl transform transition-all sm:max-w-lg w-full sm:p-6">
          {children}
        </div>
      )}
    </div>
  )
}
