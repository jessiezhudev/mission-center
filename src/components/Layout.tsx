import { Link, useLocation } from 'react-router-dom'
import { ReactNode } from 'react'
import './Layout.css'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation()
  
  return (
    <div className="layout">
      <header className="header">
        <div className="header-content">
          <h1 className="logo">
            <Link to="/">Mission Center</Link>
          </h1>
          <nav className="nav">
            <Link 
              to="/" 
              className={location.pathname === '/' ? 'active' : ''}
            >
              任务列表
            </Link>
            <Link 
              to="/task/new" 
              className={location.pathname === '/task/new' ? 'active' : ''}
            >
              新建任务
            </Link>
          </nav>
        </div>
      </header>
      <main className="main-content">
        {children}
      </main>
    </div>
  )
}

