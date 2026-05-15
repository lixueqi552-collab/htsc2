import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, Search, Eye, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'

const mockData = [
  { id: 'CT-2026-001', name: '设备采购框架协议.pdf', permission: '仅自己', creator: '张明', status: 'completed', time: '2026-05-14 09:30', score: 88 },
  { id: 'CT-2026-002', name: 'IT 运维服务合同.docx', permission: '团队', creator: '李华', status: 'reviewing', time: '2026-05-14 10:15', score: null },
  { id: 'CT-2026-003', name: '保密协议-v3.pdf', permission: '仅自己', creator: '张明', status: 'pending', time: '2026-05-13 16:45', score: null },
  { id: 'CT-2026-004', name: '办公楼租赁协议.pdf', permission: '所有人', creator: '王磊', status: 'risk', time: '2026-05-13 14:20', score: 65 },
  { id: 'CT-2026-005', name: '软件许可及服务协议.pdf', permission: '团队', creator: '李华', status: 'completed', time: '2026-05-12 11:00', score: 92 },
  { id: 'CT-2026-006', name: '货物运输合同.pdf', permission: '仅自己', creator: '张明', status: 'completed', time: '2026-05-11 15:30', score: 78 },
  { id: 'CT-2026-007', name: '技术服务合同.docx', permission: '团队', creator: '赵丽', status: 'pending', time: '2026-05-10 09:00', score: null },
  { id: 'CT-2026-008', name: '年度采购框架协议.pdf', permission: '所有人', creator: '王磊', status: 'completed', time: '2026-05-09 13:45', score: 85 },
]

const statusConfig = {
  completed: { label: '审查完成', class: 'tag-green' },
  reviewing: { label: '审查中', class: 'tag-blue' },
  pending: { label: '待审查', class: 'tag-gold' },
  risk: { label: '有风险', class: 'tag-red' },
}

const perPage = 6

export default function ReviewList() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')

  const filtered = mockData.filter((r) => r.name.toLowerCase().includes(search.toLowerCase()))
  const totalPages = Math.ceil(filtered.length / perPage)
  const paged = filtered.slice((page - 1) * perPage, page * perPage)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">智能审查</h1>
          <p className="text-base text-gray-500 mt-1">管理所有合同审查任务，查看审查报告</p>
        </div>
        <button
          onClick={() => navigate('/review/upload')}
          className="bg-[#1677ff] text-white px-6 py-3 rounded-lg font-semibold text-base hover:bg-[#0958d9] transition-colors flex items-center gap-2 shadow-sm"
        >
          <Upload size={16} />
          上传文档
        </button>
      </div>

      <div className="card overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="relative w-80">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              placeholder="搜索文档名称..."
              className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#1677ff] focus:ring-1 focus:ring-[#1677ff]/20"
            />
          </div>
          <span className="text-sm text-gray-400">共 {filtered.length} 条记录</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="py-3.5 px-4 text-sm font-medium text-gray-500 w-[140px]">合同编号</th>
                <th className="py-3.5 px-4 text-sm font-medium text-gray-500">审查文档名称</th>
                <th className="py-3.5 px-4 text-sm font-medium text-gray-500 w-[90px]">文档权限</th>
                <th className="py-3.5 px-4 text-sm font-medium text-gray-500 w-[80px]">创建人</th>
                <th className="py-3.5 px-4 text-sm font-medium text-gray-500 w-[80px]">状态</th>
                <th className="py-3.5 px-4 text-sm font-medium text-gray-500 w-[150px]">上传时间</th>
                <th className="py-3.5 px-4 text-sm font-medium text-gray-500 w-[200px]">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paged.map((row) => {
                const info = statusConfig[row.status]
                return (
                  <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3.5 px-4 text-sm text-gray-600 font-mono">{row.id}</td>
                    <td className="py-3.5 px-4">
                      <span className="text-base text-gray-800 font-medium">{row.name}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-sm text-gray-500">{row.permission}</span>
                    </td>
                    <td className="py-3.5 px-4 text-sm text-gray-600">{row.creator}</td>
                    <td className="py-3.5 px-4">
                      <span className={info.class}>{info.label}</span>
                    </td>
                    <td className="py-3.5 px-4 text-sm text-gray-500">{row.time}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate('/review/upload?report=1')}
                          className="flex items-center gap-1 px-3 py-2 rounded text-sm text-[#1677ff] hover:bg-blue-50 transition-colors"
                        >
                          <Eye size={15} /> 查看
                        </button>
                        <button className="flex items-center gap-1 px-3 py-2 rounded text-sm text-gray-500 hover:bg-gray-100 transition-colors">
                          <Edit size={15} /> 编辑
                        </button>
                        <button className="flex items-center gap-1 px-3 py-2 rounded text-sm text-red-500 hover:bg-red-50 transition-colors">
                          <Trash2 size={15} /> 删除
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {paged.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-sm text-gray-400">暂无数据</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <span className="text-xs text-gray-400">第 {page}/{totalPages} 页</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={14} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-7 h-7 rounded text-xs font-medium ${
                    p === page ? 'bg-[#1677ff] text-white' : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1.5 rounded border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
