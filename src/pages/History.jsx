import { useState, useMemo } from 'react'
import {
  Search, Download, ChevronLeft, ChevronRight, Clock, FileText,
} from 'lucide-react'

const allRecords = [
  { id: 1, name: '设备采购框架协议', type: '采购合同', score: 76, issues: '5 项', reviewer: 'AI 自动审查', time: '2026-05-14 09:30', status: '待复核', statusClass: 'tag-gold' },
  { id: 2, name: 'IT 运维服务合同', type: '服务合同', score: 88, issues: '2 项', reviewer: 'AI 自动审查', time: '2026-05-13 15:20', status: '已完成', statusClass: 'tag-green' },
  { id: 3, name: '原材料供货框架协议', type: '采购合同', score: null, issues: '--', reviewer: '--', time: '2026-05-13 11:05', status: '审查中', statusClass: 'tag-blue' },
  { id: 4, name: '办公楼租赁协议', type: '租赁合同', score: 58, issues: '7 项', reviewer: 'AI 自动审查', time: '2026-05-13 09:45', status: '法务复核', statusClass: 'tag-red' },
  { id: 5, name: '软件开发外包服务合同', type: '服务合同', score: null, issues: '--', reviewer: '--', time: '2026-05-12 16:30', status: '待审查', statusClass: 'text-gray-500 bg-gray-100 px-2 py-0.5 rounded text-xs font-medium' },
  { id: 6, name: '年度审计服务协议', type: '服务合同', score: 92, issues: '1 项', reviewer: 'AI 自动审查', time: '2026-05-12 14:00', status: '已完成', statusClass: 'tag-green' },
  { id: 7, name: '数据中心托管服务合同', type: '服务合同', score: 71, issues: '4 项', reviewer: 'AI 自动审查', time: '2026-05-12 10:30', status: '待复核', statusClass: 'tag-gold' },
  { id: 8, name: '品牌授权使用协议', type: '授权合同', score: 84, issues: '3 项', reviewer: 'AI 自动审查', time: '2026-05-11 17:20', status: '已完成', statusClass: 'tag-green' },
  { id: 9, name: '物流配送服务合同', type: '服务合同', score: 65, issues: '6 项', reviewer: 'AI 自动审查', time: '2026-05-11 14:15', status: '法务复核', statusClass: 'tag-red' },
  { id: 10, name: '技术开发合作合同', type: '技术合同', score: 79, issues: '3 项', reviewer: 'AI 自动审查', time: '2026-05-11 09:00', status: '已完成', statusClass: 'tag-green' },
  { id: 11, name: '市场营销推广合同', type: '服务合同', score: null, issues: '--', reviewer: '--', time: '2026-05-10 16:45', status: '待审查', statusClass: 'text-gray-500 bg-gray-100 px-2 py-0.5 rounded text-xs font-medium' },
  { id: 12, name: '员工保密协议（2026版）', type: '保密协议', score: 90, issues: '1 项', reviewer: 'AI 自动审查', time: '2026-05-10 14:30', status: '已完成', statusClass: 'tag-green' },
  { id: 13, name: '供应商质量保证协议', type: '质量协议', score: 73, issues: '4 项', reviewer: 'AI 自动审查', time: '2026-05-10 11:00', status: '待复核', statusClass: 'tag-gold' },
  { id: 14, name: '软件许可使用协议', type: '许可合同', score: 86, issues: '2 项', reviewer: 'AI 自动审查', time: '2026-05-09 16:30', status: '已完成', statusClass: 'tag-green' },
  { id: 15, name: '设备维护保养合同', type: '服务合同', score: 68, issues: '5 项', reviewer: 'AI 自动审查', time: '2026-05-09 13:20', status: '法务复核', statusClass: 'tag-red' },
  { id: 16, name: '知识产权转让协议', type: '知识产权', score: 81, issues: '2 项', reviewer: 'AI 自动审查', time: '2026-05-09 10:00', status: '已完成', statusClass: 'tag-green' },
  { id: 17, name: '股权投资意向书', type: '投资合同', score: 62, issues: '8 项', reviewer: 'AI 自动审查', time: '2026-05-08 15:40', status: '法务复核', statusClass: 'tag-red' },
  { id: 18, name: '云计算服务等级协议', type: '服务合同', score: 87, issues: '2 项', reviewer: 'AI 自动审查', time: '2026-05-08 11:15', status: '已完成', statusClass: 'tag-green' },
  { id: 19, name: '供应链金融合作协议', type: '金融合同', score: 74, issues: '4 项', reviewer: 'AI 自动审查', time: '2026-05-08 09:00', status: '待复核', statusClass: 'tag-gold' },
  { id: 20, name: '跨境电商代运营合同', type: '服务合同', score: null, issues: '--', reviewer: '--', time: '2026-05-07 17:30', status: '待审查', statusClass: 'text-gray-500 bg-gray-100 px-2 py-0.5 rounded text-xs font-medium' },
  { id: 21, name: '产学研合作框架协议', type: '合作协议', score: 83, issues: '3 项', reviewer: 'AI 自动审查', time: '2026-05-07 14:00', status: '已完成', statusClass: 'tag-green' },
  { id: 22, name: '渠道代理销售合同', type: '销售合同', score: 70, issues: '5 项', reviewer: 'AI 自动审查', time: '2026-05-07 10:30', status: '待复核', statusClass: 'tag-gold' },
  { id: 23, name: '企业并购法律尽职调查合同', type: '服务合同', score: 91, issues: '1 项', reviewer: 'AI 自动审查', time: '2026-05-06 16:00', status: '已完成', statusClass: 'tag-green' },
  { id: 24, name: '数据中心机房租赁合同', type: '租赁合同', score: 66, issues: '6 项', reviewer: 'AI 自动审查', time: '2026-05-06 13:15', status: '法务复核', statusClass: 'tag-red' },
  { id: 25, name: '战略合作框架备忘录', type: '备忘录', score: 85, issues: '2 项', reviewer: 'AI 自动审查', time: '2026-05-06 09:45', status: '已完成', statusClass: 'tag-green' },
]

const timeline = [
  { date: '今日', items: [
    { title: '设备采购框架协议', status: '已完成审查', dotColor: 'bg-blue-500', time: '09:30', desc: '综合评分 76，发现 5 项问题（2 高 1 中 2 低）' },
  ]},
  { date: '昨日', items: [
    { title: 'IT 运维服务合同', status: '已完成审查', dotColor: 'bg-green-500', time: '15:20', desc: '综合评分 88，发现 2 项问题（0 高 1 中 1 低）' },
    { title: '原材料供货框架协议', status: '审查中', dotColor: 'bg-yellow-500', time: '11:05', desc: 'AI 正在分析合同条款，预计 3 分钟内完成' },
    { title: '办公楼租赁协议', status: '发现风险', dotColor: 'bg-red-500', time: '09:45', desc: '综合评分 58，发现 7 项问题（3 高 2 中 2 低），建议法务复核' },
  ]},
  { date: '本周', items: [
    { title: '软件开发外包服务合同', status: '待审查', dotColor: 'bg-gray-400', time: '05-12', desc: '等待 AI 审查队列处理' },
    { title: '年度审计服务协议', status: '已完成审查', dotColor: 'bg-green-500', time: '05-12', desc: '综合评分 92，发现 1 项问题（0 高 0 中 1 低）' },
    { title: '数据中心托管服务合同', status: '已完成审查', dotColor: 'bg-blue-500', time: '05-12', desc: '综合评分 71，发现 4 项问题（1 高 2 中 1 低）' },
    { title: '品牌授权使用协议', status: '已完成审查', dotColor: 'bg-green-500', time: '05-11', desc: '综合评分 84，发现 3 项问题（1 高 1 中 1 低）' },
    { title: '物流配送服务合同', status: '发现风险', dotColor: 'bg-red-500', time: '05-11', desc: '综合评分 65，发现 6 项问题（2 高 2 中 2 低）' },
  ]},
]

const pageSize = 8

function getScoreColor(s) {
  if (s == null) return 'text-gray-400'
  if (s >= 80) return 'text-green-500'
  if (s >= 60) return 'text-yellow-500'
  return 'text-red-500'
}

function Pagination({ page, totalPages, onChange }) {
  const pages = []
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i)
  } else {
    pages.push(1)
    if (page > 3) pages.push('...')
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i)
    if (page < totalPages - 2) pages.push('...')
    pages.push(totalPages)
  }

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="px-2.5 py-1.5 text-xs border border-gray-200 rounded bg-white text-gray-500 disabled:opacity-30 disabled:cursor-not-allowed hover:border-gray-300"
      >
        <ChevronLeft size={13} />
      </button>
      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`e${i}`} className="px-1 text-xs text-gray-400">...</span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={`px-3 py-1.5 text-xs border rounded font-medium transition-colors ${
              p === page
                ? 'border-[#1677ff] bg-blue-50 text-[#1677ff]'
                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
            }`}
          >
            {p}
          </button>
        )
      )}
      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className="px-2.5 py-1.5 text-xs border border-gray-200 rounded bg-white text-gray-500 disabled:opacity-30 disabled:cursor-not-allowed hover:border-gray-300"
      >
        <ChevronRight size={13} />
      </button>
    </div>
  )
}

export default function History() {
  const [page, setPage] = useState(1)
  const [keyword, setKeyword] = useState('')
  const [statusFilter, setStatusFilter] = useState('全部状态')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const filtered = useMemo(() => {
    let list = allRecords
    if (keyword.trim()) {
      const kw = keyword.toLowerCase()
      list = list.filter((r) => r.name.toLowerCase().includes(kw))
    }
    if (statusFilter !== '全部状态') {
      list = list.filter((r) => r.status === statusFilter)
    }
    if (startDate) {
      list = list.filter((r) => r.time >= startDate)
    }
    if (endDate) {
      list = list.filter((r) => r.time <= endDate + ' 23:59')
    }
    return list
  }, [keyword, statusFilter, startDate, endDate])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const safePage = Math.min(page, totalPages)
  const paged = filtered.slice((safePage - 1) * pageSize, safePage * pageSize)

  const stats = [
    { label: '今日审查', value: filtered.filter((r) => r.time.startsWith('2026-05-14')).length || '12', color: 'text-gray-800' },
    { label: '本周审查', value: filtered.filter((r) => r.time >= '2026-05-11').length || '67', color: 'text-gray-800' },
    { label: '本月审查', value: filtered.length, color: 'text-gray-800' },
    { label: '累计审查', value: '1,847', color: 'text-gray-800' },
    { label: '发现问题', value: filtered.reduce((s, r) => s + (r.issues !== '--' ? parseInt(r.issues) : 0), 0) || '328', color: 'text-red-500' },
  ]

  const statusOptions = ['全部状态', ...new Set(allRecords.map((r) => r.status))]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">审查历史记录</h1>
          <p className="text-base text-gray-500 mt-1">查看合同审查的历史记录与操作日志</p>
        </div>
        <button className="flex items-center gap-1.5 px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
          <Download size={15} /> 导出记录
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 mb-5">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="搜索合同名称、编号..."
              value={keyword}
              onChange={(e) => { setKeyword(e.target.value); setPage(1) }}
              className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#1677ff] focus:ring-1 focus:ring-[#1677ff]/20"
            />
          </div>
          <div>
            <label className="block text-[10px] text-gray-400 mb-1">开始日期</label>
            <input type="date" value={startDate} onChange={(e) => { setStartDate(e.target.value); setPage(1) }} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1677ff]" />
          </div>
          <div>
            <label className="block text-[10px] text-gray-400 mb-1">结束日期</label>
            <input type="date" value={endDate} onChange={(e) => { setEndDate(e.target.value); setPage(1) }} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1677ff]" />
          </div>
          <div className="pt-4">
            <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }} className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-500 focus:outline-none focus:border-[#1677ff]">
              {statusOptions.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <button className="pt-4 px-5 py-2 bg-[#1677ff] text-white rounded-lg text-sm font-medium hover:bg-[#0958d9] transition-colors">查询</button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-3 mb-5">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-4 text-center">
            <p className="text-xs text-gray-500">{s.label}</p>
            <p className={`text-xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden mb-5">
        <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
          <Clock size={16} className="text-[#1677ff]" />
          <span className="text-sm font-semibold text-gray-700">审查动态</span>
        </div>
        <div className="px-5 py-4">
          {timeline.map((group) => (
            <div key={group.date}>
              <p className="text-[10px] text-gray-400 font-medium mb-2 tracking-wider">{group.date}</p>
              {group.items.map((item, i) => {
                const isLast = i === group.items.length - 1
                return (
                  <div key={i} className="flex gap-4 pb-3 relative last:pb-3">
                    <div className="flex flex-col items-center">
                      <div className={`w-2.5 h-2.5 rounded-full ${item.dotColor} mt-1.5`} />
                      {!isLast && <div className="w-px flex-1 bg-gray-200 mt-1" />}
                    </div>
                    <div className="flex-1 min-w-0 pb-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-800 truncate">
                          {item.title}
                          <span className="text-xs text-gray-400 ml-2 font-normal">{item.status}</span>
                        </p>
                        <span className="text-xs text-gray-400 whitespace-nowrap ml-2">{item.time}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Detail Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
          <FileText size={15} className="text-[#1677ff]" />
          <span className="text-sm font-semibold text-gray-700">详细记录</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-xs text-gray-500 uppercase tracking-wider">
                <th className="px-4 py-3.5 font-medium">合同名称</th>
                <th className="px-4 py-3.5 font-medium">类型</th>
                <th className="px-4 py-3.5 font-medium">评分</th>
                <th className="px-4 py-3.5 font-medium">发现问题</th>
                <th className="px-4 py-3.5 font-medium">审查人</th>
                <th className="px-4 py-3.5 font-medium">审查时间</th>
                <th className="px-4 py-3.5 font-medium">状态</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-600">
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-sm text-gray-400">暂无匹配的记录</td>
                </tr>
              ) : (
                paged.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3.5 font-medium text-gray-800 text-sm">{row.name}</td>
                    <td className="px-4 py-3.5 text-sm">{row.type}</td>
                    <td className="px-4 py-3.5"><span className={`font-semibold text-sm ${getScoreColor(row.score)}`}>{row.score ?? '--'}</span></td>
                    <td className="px-4 py-3.5 text-sm">{row.issues}</td>
                    <td className="px-4 py-3.5 text-sm">{row.reviewer}</td>
                    <td className="px-4 py-3.5 text-xs text-gray-400">{row.time}</td>
                    <td className="px-4 py-3.5"><span className={row.statusClass}>{row.status}</span></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50">
          <span className="text-xs text-gray-400">共 {filtered.length} 条记录</span>
          <Pagination page={safePage} totalPages={totalPages} onChange={setPage} />
        </div>
      </div>
    </div>
  )
}
