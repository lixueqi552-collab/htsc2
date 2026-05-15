import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FileText, Shield, Zap, Handshake, FileDown, User, Lock } from 'lucide-react'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!username.trim()) { setError('请输入用户名'); return }
    login(username.trim())
    navigate('/', { replace: true })
  }

  const features = [
    { icon: Shield, title: 'AI 智能审查', desc: '基于大模型的合同条款智能分析与风险识别', color: '#1677ff' },
    { icon: Zap, title: '极速响应', desc: '上传即审，3-5 分钟输出完整审查报告', color: '#1677ff' },
    { icon: Handshake, title: '专业合规', desc: '覆盖 12 类合同、100+ 审查规则，持续更新', color: '#1677ff' },
    { icon: FileDown, title: '报告导出', desc: '支持 Word 格式审查报告导出与归档', color: '#1677ff' },
  ]

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 via-cyan-50 to-green-50">
      {/* Left: Product Landing */}
      <div className="flex-1 flex items-center justify-center p-10 lg:p-16">
        <div className="max-w-lg">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#1677ff] to-[#4096ff] flex items-center justify-center text-white text-xl mb-6 shadow-lg">
            <FileText size={24} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">合同审查系统</h1>
          <p className="text-base text-gray-500 mt-2 mb-10 leading-relaxed">
            AI 驱动的智能合同审查平台，帮助企业快速识别合同风险、规范合同管理流程。
          </p>

          <div className="grid grid-cols-2 gap-4">
            {features.map((f) => (
              <div key={f.title} className="bg-white/80 rounded-lg border border-gray-100 p-4">
                <div className="flex gap-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: '#1677ff15', color: f.color }}>
                    <f.icon size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{f.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{f.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <hr className="my-8 border-gray-200" />
          <p className="text-xs text-gray-400 text-center">&copy; 2026 AI Contract Review System. All rights reserved.</p>
        </div>
      </div>

      {/* Right: Login Form */}
      <div className="w-[400px] min-h-screen flex items-center justify-center p-10 bg-white shadow-[-4px_0_24px_rgba(0,0,0,0.06)]">
        <div className="w-full">
          <h2 className="text-2xl font-bold text-gray-900">登录</h2>
          <p className="text-sm text-gray-500 mt-1 mb-8">欢迎使用合同审查系统</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">用户名</label>
              <div className="relative">
                <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => { setUsername(e.target.value); setError('') }}
                  placeholder="请输入用户名"
                  className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1677ff] focus:border-[#1677ff]"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">密码</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="请输入密码"
                  className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1677ff] focus:border-[#1677ff]"
                />
              </div>
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
            <button type="submit" className="w-full py-2.5 bg-[#1677ff] text-white rounded-lg text-sm font-semibold hover:bg-[#0958d9] transition shadow-sm">
              登 录
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-6">演示账号：任意用户名即可登录</p>
        </div>
      </div>
    </div>
  )
}
