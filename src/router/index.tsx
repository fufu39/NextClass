import { createBrowserRouter, Navigate } from 'react-router-dom'
import App from '../App'
import Home from '../pages/Home'
import Login from '../pages/Login'
import DashboardLayout from '../pages/Dashboard'
import DashboardHome from '../pages/DashboardHome'
import Schedule from '../pages/Schedule'
import Settings from '../pages/Settings'
import AIChat from '../pages/AIChat'
import NotFound from '../pages/NotFound'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Navigate to="/home" replace />
      },
      {
        path: 'home',
        element: <Home />
      },
      {
        path: 'login',
        element: <Login />
      },
      {
        path: 'dashboard',
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: <DashboardHome />
          },
          {
            path: 'schedule',
            element: <Schedule />
          },
          {
            path: 'settings',
            element: <Settings />
          },
          {
            path: 'ai-chat',
            element: <AIChat />
          }
        ]
      },
      {
        path: '*',
        element: <NotFound />
      }
    ]
  }
])

export default router
