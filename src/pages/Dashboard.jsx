import { useNavigate } from 'react-router-dom'
import {
  FileSearch, FileText, FileImage, FileSpreadsheet, ArrowLeftRight,
  ScanLine, ShieldCheck, Clock, Zap,
} from 'lucide-react'

const tools = [
  { icon: FileText, title: 'PDF 转 Word', desc: '精准转换，保留排版', color: '#ff4d4f' },
  { icon: FileImage, title: '图片转文字', desc: 'OCR 识别，提取文本', color: '#722ed1' },
  { icon: FileSpreadsheet, title: '表格提取', desc: '从文档中提取表格数据', color: '#52c41a' },
  { icon: ArrowLeftRight, title: '文档对比', desc: '比对两份文档的差异', color: '#1677ff' },
  { icon: ScanLine, title: '格式转换', desc: '支持 10+ 格式互转', color: '#faad14' },
  { icon: ShieldCheck, title: '智能纠错', desc: '检查字词和语法错误', color: '#13c2c2' },
]

const activities = [
  { name: '设备采购框架协议', status: 'completed', time: '10 分钟前', score: 88 },
  { name: 'IT 运维服务合同', status: 'reviewing', time: '30 分钟前', score: null },
  { name: '保密协议-v3.pdf', status: 'pending', time: '1 小时前', score: null },
  { name: '办公楼租赁协议', status: 'risk', time: '2 小时前', score: 65 },
]

const statusConfig = {
  completed: { label: '审查完成', className: 'tag-green' },
  reviewing: { label: '审查中', className: 'tag-blue' },
  pending: { label: '待审查', className: 'tag-gold' },
  risk: { label: '有风险', className: 'tag-red' },
}

export default function Dashboard() {
  const navigate = useNavigate()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">欢迎回来</h1>
        <p className="text-base text-gray-500 mt-1">今天有 3 份合同待审查，点击下方开始</p>
      </div>

      <div className="bg-gradient-to-br from-[#1677ff] to-[#4096ff] rounded-xl p-8 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div className="max-w-lg">
            <h2 className="text-2xl font-bold mb-2">AI 智能合同审查</h2>
            <p className="text-base text-white/80 mb-6 leading-relaxed">
              上传合同文件，AI 自动识别类型并全面审查风险点，3-5 分钟获取专业审查报告
            </p>
            <button
              onClick={() => navigate('/review/upload')}
              className="inline-flex items-center gap-2 bg-white text-[#1677ff] font-semibold px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
            >
              <FileSearch size={18} />
              立即审查合同
            </button>
          </div>
          <div className="hidden md:flex w-28 h-28 rounded-full bg-white/15 items-center justify-center">
            <FileSearch size={44} className="text-white/90" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Zap size={16} className="text-[#1677ff]" />
              <h3 className="font-semibold text-base text-gray-800">辅助工具</h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {tools.map((tool) => (
                <div
                  key={tool.title}
                  className="flex flex-col items-center gap-2 p-5 rounded-lg border border-gray-100 hover:border-gray-200 hover:shadow-sm cursor-pointer transition-all"
                >
                  <tool.icon size={28} style={{ color: tool.color }} />
                  <span className="text-sm font-medium text-gray-700">{tool.title}</span>
                  <span className="text-xs text-gray-400 text-center leading-tight">{tool.desc}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock size={16} className="text-[#1677ff]" />
              <h3 className="font-semibold text-base text-gray-800">最近动态</h3>
            </div>
            <div className="space-y-1">
              {activities.map((item) => {
                const info = statusConfig[item.status]
                return (
                  <div
                    key={item.name}
                    className="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => item.status !== 'pending' && navigate('/review')}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2.5 h-2.5 rounded-full ${
                        item.status === 'completed' ? 'bg-green-500' :
                        item.status === 'reviewing' ? 'bg-blue-500' :
                        item.status === 'risk' ? 'bg-red-500' : 'bg-yellow-500'
                      }`} />
                      <div>
                        <span className="text-base text-gray-800">{item.name}</span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={info.className}>{info.label}</span>
                          <span className="text-xs text-gray-400">{item.time}</span>
                        </div>
                      </div>
                    </div>
                    {item.score && (
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                        item.score >= 80 ? 'bg-green-50 text-green-600' :
                        item.score >= 60 ? 'bg-yellow-50 text-yellow-600' : 'bg-red-50 text-red-600'
                      }`}>
                        {item.score}分
                      </span>
                    )}
                    {item.status === 'reviewing' && (
                      <div className="flex gap-1">
                        {[0,1,2,3].map((i) => (
                          <div key={i} className={`w-4 h-1.5 rounded-sm ${i <= 1 ? 'bg-blue-500' : 'bg-gray-200'}`} />
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck size={16} className="text-[#1677ff]" />
              <h3 className="font-semibold text-sm text-gray-800">快速入口</h3>
            </div>
            <div className="space-y-2">
              <button onClick={() => navigate('/review/upload')} className="w-full bg-[#1677ff] text-white py-3 rounded-lg font-semibold text-sm hover:bg-[#0958d9] transition-colors flex items-center justify-center gap-2">
                <FileSearch size={16} /> 合同审查
              </button>
              <button className="w-full border border-gray-200 text-gray-600 py-2.5 rounded-lg text-sm hover:border-[#1677ff] hover:text-[#1677ff] transition-colors flex items-center justify-center gap-2">
                <ArrowLeftRight size={14} /> 文档格式转换
              </button>
              <button className="w-full border border-gray-200 text-gray-600 py-2.5 rounded-lg text-sm hover:border-[#1677ff] hover:text-[#1677ff] transition-colors flex items-center justify-center gap-2">
                <FileText size={14} /> PDF 转 Word
              </button>
              <button className="w-full border border-gray-200 text-gray-600 py-2.5 rounded-lg text-sm hover:border-[#1677ff] hover:text-[#1677ff] transition-colors flex items-center justify-center gap-2">
                <ScanLine size={14} /> 图片文字识别
              </button>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex gap-3">
              <span className="text-lg">💡</span>
              <div>
                <p className="text-xs font-semibold text-blue-800 mb-0.5">使用提示</p>
                <p className="text-[11px] text-blue-600 leading-relaxed">
                  支持 PDF/DOC/DOCX 格式，单个文件最大 50MB，建议上传 PDF 以获得最佳审查效果
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
