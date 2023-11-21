import { FC } from 'react'

export const Badge: FC<{
  title: string
  flash?: boolean
}> = ({ title }) => {
  return (
    <span className="text-red-500 bg-primary rounded-md px-2 py-1 text-xs font-bold mr-2">
      {title}
    </span>
  )
}
