import { message, notification } from 'antd'
import 'antd/dist/reset.css'
import { Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import type { AppType } from 'next/app'
import { Router } from 'next/router'
import NProgress from 'nprogress'
import { DarkModeProvider } from '~/context/darkMode'
import { MessageApiProvider } from '~/context/messageApi'
import { NotificationApiProvider } from '~/context/notifcationApi'
import { useLocalStorage } from '~/hooks/useLocalStorage'
import { api } from '~/utils/api'
import '../styles/globals.css'

Router.events.on('routeChangeStart', () => NProgress.start())
Router.events.on('routeChangeComplete', () => NProgress.done())
Router.events.on('routeChangeError', () => NProgress.done())

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps }
}) => {
  const [notificationApi, notificationContextHolder] =
    notification.useNotification()
  const [isDarkMode, setDarkMode] = useLocalStorage('darkMode', false)
  const [messageApi, messageContextHolder] = message.useMessage()
  return (
    <SessionProvider session={session}>
      <DarkModeProvider
        value={{
          isDarkMode,
          toggleDarkMode: () => setDarkMode(!isDarkMode)
        }}
      >
        {notificationContextHolder}
        {messageContextHolder}
        <NotificationApiProvider value={notificationApi}>
          <MessageApiProvider value={messageApi}>
            <Component {...pageProps} />
          </MessageApiProvider>
        </NotificationApiProvider>
      </DarkModeProvider>
    </SessionProvider>
  )
}

export default api.withTRPC(MyApp)
