import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FileText, Home, LogOut, User, Clock } from 'lucide-react'

const navLinks = [
  { path: '/', label: '工作台', icon: Home },
  { path: '/review', label: '合同审查', icon: FileText },
  { path: '/history', label: '历史记录', icon: Clock },
]

export default function Layout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path)

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex flex-col">
      <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 lg:px-8 sticky top-0 z-50">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#1677ff] to-[#4096ff] flex items-center justify-center text-white text-sm font-bold shadow-sm">
              <FileText size={18} />
            </div>
            <span className="font-semibold text-base text-gray-900">智能合同审查</span>
          </div>
          <nav className="flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors duration-200 ${
                  isActive(link.path)
                    ? 'text-[#1677ff] font-semibold bg-blue-50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <link.icon size={17} />
                {link.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5 text-sm text-gray-500">
            <div className="w-8 h-8 rounded-full bg-[#1677ff] flex items-center justify-center text-white text-xs font-semibold">
              {user?.name?.[0] || 'U'}
            </div>
            <span className="text-sm text-gray-600">{user?.name || '用户'}</span>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500 transition-colors px-2.5 py-1.5 rounded hover:bg-red-50">
            <LogOut size={14} /> 退出
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 lg:px-8 py-6 lg:py-8">
        <Outlet />
      </main>

      <footer className="text-center py-4 border-t border-gray-100 bg-white">
        <span className="text-xs text-gray-400">智能合同审查系统 &copy; 2026</span>
      </footer>
    </div>
  )
}
