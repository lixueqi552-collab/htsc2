import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Upload, FileText, CheckCircle, Search, Download, ArrowLeft,
  ArrowRight, ArrowLeftRight, AlertTriangle, Loader, FileSearch,
  ChevronDown, ChevronUp, ExternalLink, X, File,
} from 'lucide-react'

const STEPS = [
  { key: 'upload', label: '上传文档' },
  { key: 'classify', label: '识别分类' },
  { key: 'requirements', label: '审查要求' },
  { key: 'reviewing', label: 'AI 审查中' },
  { key: 'report', label: '审查报告' },
]

const mockReport = {
  score: 82,
  title: '设备采购框架协议',
  type: '采购合同',
  summary: '该合同整体条款较为完整，但存在违约责任不对等、付款节点模糊等风险点，建议对相关条款进行调整。',
  basicInfo: {
    contractNo: 'CT-2026-001',
    signDate: '2026-05-01',
    partyA: 'XX科技有限公司',
    partyB: 'YY设备制造有限公司',
    contractType: '采购合同',
    signPlace: '深圳市',
  },
  transactionInfo: {
    totalAmount: '¥5,000,000.00',
    paymentMethod: '甲方应在收到乙方发票后支付相应款项',
    deliveryDate: '合同生效后 60 个自然日内',
    warrantyPeriod: '自验收合格之日起 12 个月',
    penaltyRate: '每日万分之五',
  },
  riskCategories: [
    { name: '高风险', count: 2, color: 'red' },
    { name: '一般风险', count: 2, color: 'yellow' },
    { name: '无风险', count: 3, color: 'green' },
  ],
  dimensions: [
    { name: '条款完整性', score: 85 },
    { name: '风险控制', score: 70 },
    { name: '合规性', score: 90 },
    { name: '权利义务', score: 75 },
    { name: '合同主体', score: 88 },
    { name: '知识产权', score: 82 },
  ],
  issues: [
    {
      severity: 'high', title: '违约责任不对等', clause: '第 7.3 条', clauseId: 'clause-7.3',
      desc: '甲方违约金上限为合同总价的5%，而乙方违约金上限高达15%',
      opinion: '该条款存在明显的权利义务不对等。甲方（采购方）违约责任上限仅为5%，而乙方（供应方）高达15%，差距达3倍，违反了合同公平原则。若发生违约争议，该条款可能被认定为显失公平。',
      suggestion: '建议将双方违约金上限统一调整为合同总价的10%，或采取差异化调整（甲方8%、乙方12%），以缩小差距至合理范围。',
      law: '《中华人民共和国民法典》第585条：约定的违约金过分高于造成的损失的，人民法院或者仲裁机构可以根据当事人的请求予以适当减少。\n\n《民法典》第497条：提供格式条款一方不合理地免除或者减轻其责任、加重对方责任、限制对方主要权利的，该格式条款无效。',
      lawFile: '《中华人民共和国民法典》.pdf',
    },
    {
      severity: 'high', title: '争议解决条款缺失', clause: '第 12.1 条', clauseId: 'clause-12.1',
      desc: '未明确约定争议解决方式和管辖法院，仅表述为"有管辖权的法院"',
      opinion: '"有管辖权的法院"表述过于模糊，未明确具体的仲裁机构或诉讼法院，可能导致争议发生时双方就管辖权产生新的争议，增加解决成本。',
      suggestion: '建议明确约定争议解决方式：1) 如选择诉讼，应指定具体法院（如"甲方所在地人民法院"）；2) 如选择仲裁，应明确仲裁机构（如"深圳国际仲裁院"）。',
      law: '《中华人民共和国民事诉讼法》第35条：合同或者其他财产权益纠纷的当事人可以书面协议选择被告住所地、合同履行地、合同签订地、原告住所地、标的物所在地等与争议有实际联系的地点的人民法院管辖。\n\n《中华人民共和国仲裁法》第16条：仲裁协议应当具有下列内容：（一）请求仲裁的意思表示；（二）仲裁事项；（三）选定的仲裁委员会。',
      lawFile: '《中华人民共和国民事诉讼法》.pdf',
    },
    {
      severity: 'medium', title: '付款节点模糊', clause: '第 3.5 条', clauseId: 'clause-3.5',
      desc: '付款条款缺少具体的时间节点和验收标准，仅约定"收到发票后付款"',
      opinion: '"收到发票后付款"未明确具体付款期限，可能导致甲方无限期延迟付款。同时，付款与验收节点未关联，缺乏对乙方交付质量的约束机制。',
      suggestion: '建议明确：1) 付款期限（如"收到发票后 30 个工作日内"）；2) 分阶段付款计划（如预付款30%、验收合格后付60%、质保期满付10%）；3) 将付款与验收标准挂钩。',
      law: '《中华人民共和国民法典》第626条：买受人应当按照约定的数额和支付方式支付价款。对支付方式没有约定或者约定不明确，依据本法第五百一十条的规定仍不能确定的，买受人应当在收到标的物或者提取标的物单证的同时支付。',
      lawFile: '《中华人民共和国民法典》.pdf',
    },
    {
      severity: 'low', title: '保密义务期限缺失', clause: '第 8.1 条', clauseId: 'clause-8.1',
      desc: '未约定保密义务的存续期限，仅规定"未经同意不得向第三方披露"',
      opinion: '未明确保密期限可能导致保密义务的存续时间存在争议。通常保密义务应在合同终止后继续存续一定年限，以保护双方的商业秘密。',
      suggestion: '建议增加保密期限条款：1) 合同期间及合同终止后 3 年内，双方均应对涉及的商业秘密承担保密义务；2) 对属于核心商业秘密的信息，可约定更长保密期限或永久保密。',
      law: '《中华人民共和国反不正当竞争法》第9条：经营者不得实施下列侵犯商业秘密的行为：（一）以盗窃、贿赂、欺诈、胁迫、电子侵入或者其他不正当手段获取权利人的商业秘密；\n\n《民法典》第501条：当事人在订立合同过程中知悉的商业秘密或者其他应当保密的信息，无论合同是否成立，不得泄露或者不正当地使用。',
      lawFile: '《中华人民共和国反不正当竞争法》.pdf',
    },
  ],
  safeItems: [
    {
      clause: '第 4 条', title: '交付与验收', clauseId: 'clause-4',
      opinion: '该条款约定了明确的交付期限（60个自然日）和验收流程（7个工作日内），符合行业惯例，对双方权利义务划分清晰。',
      suggestion: '建议在验收标准中增加量化指标，如设备开机成功率、故障率等具体参数，以减少验收环节的争议。',
      law: '《中华人民共和国民法典》第623条：买受人收到标的物时应当在约定的检验期限内检验。没有约定检验期限的，应当及时检验。',
      lawFile: '《中华人民共和国民法典》.pdf',
    },
    {
      clause: '第 5 条', title: '质量保证', clauseId: 'clause-5',
      opinion: '质保期限（12个月）和维修责任约定清晰，覆盖了产品的主要使用周期，对双方权利义务划分合理。',
      suggestion: '建议明确质保期内响应的具体时限，如"乙方应在接到维修通知后 48 小时内响应，72 小时内到达现场"。',
      law: '《中华人民共和国民法典》第621条：当事人约定检验期限的，买受人应当在检验期限内将标的物的数量或者质量不符合约定的情形通知出卖人。',
      lawFile: '《中华人民共和国民法典》.pdf',
    },
    {
      clause: '第 11 条', title: '不可抗力', clauseId: 'clause-11',
      opinion: '不可抗力条款内容完整，免责范围和法律后果约定清晰，符合法律要求。',
      suggestion: '条款已较为完整，无需修改。',
      law: '《中华人民共和国民法典》第590条：当事人一方因不可抗力不能履行合同的，根据不可抗力的影响，部分或者全部免除责任，但是法律另有规定的除外。',
      lawFile: '《中华人民共和国民法典》.pdf',
    },
  ],
}

const severityStyle = {
  high: { border: 'border-l-red-500', bg: 'bg-red-50', tag: 'tag-red', label: '高风险', dot: 'bg-red-500' },
  medium: { border: 'border-l-yellow-500', bg: 'bg-yellow-50', tag: 'tag-gold', label: '一般风险', dot: 'bg-yellow-500' },
  low: { border: 'border-l-yellow-500', bg: 'bg-yellow-50', tag: 'tag-gold', label: '一般风险', dot: 'bg-yellow-500' },
}

export default function Review() {
  const navigate = useNavigate()
  const [stepIdx, setStepIdx] = useState(() => {
    const params = new URLSearchParams(window.location.search)
    return params.get('report') ? 4 : 0
  })
  const [files, setFiles] = useState([])
  const [contractType, setContractType] = useState('')
  const [dragging, setDragging] = useState(false)
  const [expandedIssue, setExpandedIssue] = useState(null)
  const [reviewPoints, setReviewPoints] = useState([])
  const [lawModal, setLawModal] = useState(null)
  const [lawFile, setLawFile] = useState('')
  const [rightTab, setRightTab] = useState('summary')
  const [riskSubTab, setRiskSubTab] = useState('high')
  const leftPanelRef = useRef(null)

  const step = STEPS[stepIdx]

  const handleDragOver = (e) => { e.preventDefault(); setDragging(true) }
  const handleDragLeave = () => setDragging(false)
  const handleDrop = (e) => {
    e.preventDefault(); setDragging(false)
    setFiles((prev) => [...prev, ...Array.from(e.dataTransfer.files)])
  }
  const handleFileInput = (e) => {
    if (e.target.files) setFiles((prev) => [...prev, ...Array.from(e.target.files)])
  }
  const removeFile = (i) => setFiles((prev) => prev.filter((_, idx) => idx !== i))

  const formatSize = (bytes) =>
    bytes > 1024 * 1024
      ? `${(bytes / 1024 / 1024).toFixed(1)} MB`
      : `${(bytes / 1024).toFixed(0)} KB`

  const handleUpload = () => {
    if (files.length === 0) return
    setStepIdx(1)
    setContractType('采购合同')
  }

  const handleStartReview = () => {
    setStepIdx(3)
    let i = 0
    const timer = setInterval(() => {
      i++
      if (i >= 4) { clearInterval(timer); setStepIdx(4) }
    }, 1200)
  }

  const scrollToClause = (clauseId) => {
    setExpandedIssue(null)
    setTimeout(() => {
      const el = document.getElementById(clauseId)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 100)
  }

  const getScoreColor = (s) =>
    s >= 80 ? 'text-green-500' : s >= 60 ? 'text-yellow-500' : 'text-red-500'

  const highRisk = mockReport.issues.filter((i) => i.severity === 'high')
  const mediumRisk = mockReport.issues.filter((i) => i.severity === 'medium' || i.severity === 'low')

  const renderIssueCard = (issue, i) => {
    const s = severityStyle[issue.severity] || severityStyle.medium
    const isOpen = expandedIssue === `issue-${i}`
    return (
      <div key={`issue-${i}`} className="rounded-lg border border-gray-100 overflow-hidden">
        <button
          onClick={() => { scrollToClause(issue.clauseId); setExpandedIssue(isOpen ? null : `issue-${i}`) }}
          className="w-full flex items-center gap-2 p-2.5 text-left hover:bg-gray-50 transition-colors"
        >
          <div className={`w-2 h-2 rounded-full ${s.dot} flex-shrink-0`} />
          <span className={s.tag}>{s.label}</span>
          <span className="text-sm font-medium text-gray-800 flex-1">{issue.title}</span>
          <span className="text-[11px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded">{issue.clause}</span>
          {isOpen ? <ChevronUp size={13} className="text-gray-400" /> : <ChevronDown size={13} className="text-gray-400" />}
        </button>
        {isOpen && (
          <div className="px-3 pb-3 space-y-2 border-t border-gray-50 pt-2.5">
            <div>
              <p className="text-xs font-medium text-gray-500 mb-0.5">审查意见</p>
              <p className="text-sm text-gray-700 leading-relaxed">{issue.opinion}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 mb-0.5">完善建议</p>
              <p className="text-sm text-gray-700 leading-relaxed">{issue.suggestion}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 mb-0.5">依据</p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600 flex items-center gap-1"><File size={13} className="text-gray-400" />{issue.lawFile}</span>
                <button onClick={() => { setLawModal(issue.law); setLawFile(issue.lawFile) }} className="flex items-center gap-1 text-xs text-[#1677ff] hover:text-[#0958d9] transition-colors">
                  <ExternalLink size={13} /> 查看详情
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  const renderSafeCard = (item, i) => {
    const isOpen = expandedIssue === `safe-${i}`
    return (
      <div key={`safe-${i}`} className="rounded-lg border border-gray-100 overflow-hidden">
        <button
          onClick={() => { scrollToClause(item.clauseId); setExpandedIssue(isOpen ? null : `safe-${i}`) }}
          className="w-full flex items-center gap-2 p-2.5 text-left hover:bg-gray-50 transition-colors"
        >
          <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
          <span className="tag-green">无风险</span>
          <span className="text-sm font-medium text-gray-800 flex-1">{item.title}</span>
          <span className="text-[11px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded">{item.clause}</span>
          {isOpen ? <ChevronUp size={13} className="text-gray-400" /> : <ChevronDown size={13} className="text-gray-400" />}
        </button>
        {isOpen && (
          <div className="px-3 pb-3 space-y-2 border-t border-gray-50 pt-2.5">
            <div>
              <p className="text-xs font-medium text-gray-500 mb-0.5">审查意见</p>
              <p className="text-sm text-gray-700 leading-relaxed">{item.opinion}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 mb-0.5">完善建议</p>
              <p className="text-sm text-gray-700 leading-relaxed">{item.suggestion}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 mb-0.5">依据</p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600 flex items-center gap-1"><File size={13} className="text-gray-400" />{item.lawFile}</span>
                <button onClick={() => { setLawModal(item.law); setLawFile(item.lawFile) }} className="flex items-center gap-1 text-xs text-[#1677ff] hover:text-[#0958d9] transition-colors">
                  <ExternalLink size={13} /> 查看详情
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={step.key === 'report' ? 'h-[calc(100vh-80px)] flex flex-col' : ''}>
      {/* Law detail modal */}
      {lawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setLawModal(null)}>
          <div className="bg-white rounded-xl max-w-lg w-full mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
              <span className="text-sm font-semibold text-gray-800 flex items-center gap-1.5"><File size={14} className="text-[#1677ff]" />{lawFile}</span>
              <button onClick={() => setLawModal(null)} className="text-gray-400 hover:text-gray-600"><X size={16} /></button>
            </div>
            <div className="p-5 max-h-80 overflow-y-auto">
              <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line">{lawModal}</p>
            </div>
          </div>
        </div>
      )}

      {/* Back + Steps bar */}
      <div className="flex items-center gap-2 mb-2">
        {stepIdx > 0 && stepIdx < 4 && (
          <button onClick={() => setStepIdx((i) => Math.max(0, i - 1))} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
            <ArrowLeft size={14} /> 返回
          </button>
        )}
        {stepIdx === 4 && (
          <button onClick={() => navigate('/')} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
            <ArrowLeft size={14} /> 返回工作台
          </button>
        )}
      </div>

      <div className="flex items-center gap-0 mb-6 bg-white rounded-lg p-1 border border-gray-100">
        {STEPS.map((s, i) => (
          <div key={s.key} className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium rounded-md transition-colors ${
            i === stepIdx ? 'bg-[#1677ff] text-white' : i < stepIdx ? 'text-green-600' : 'text-gray-400'
          }`}>
            {i < stepIdx ? <CheckCircle size={13} /> : i === stepIdx ? <div className="w-1.5 h-1.5 rounded-full bg-current" /> : <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />}
            {s.label}
          </div>
        ))}
      </div>

      {/* Steps 1-4: Card layout */}
      {step.key !== 'report' && (
        <div className="card p-6 lg:p-8 min-h-[400px]">
          {step.key === 'upload' && (
            <div>
              <div onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${dragging ? 'border-[#1677ff] bg-blue-50' : 'border-gray-200 hover:border-[#1677ff] hover:bg-gray-50'}`}>
                <Upload size={40} className="mx-auto mb-3 text-gray-300" />
                <p className="text-sm font-medium text-gray-700 mb-1">拖拽文件到此处，或点击浏览</p>
                <p className="text-xs text-gray-400">支持 PDF、DOC、DOCX 格式 · 单个文件 ≤ 50MB</p>
                <input type="file" multiple accept=".pdf,.doc,.docx" onChange={handleFileInput} className="hidden" id="fileInput" />
                <label htmlFor="fileInput" className="inline-block mt-4 btn-outline text-sm cursor-pointer">选择文件</label>
              </div>
              {files.length > 0 && (
                <div className="mt-4 space-y-1.5">
                  {files.map((f, i) => (
                    <div key={i} className="flex items-center justify-between py-2 px-3 rounded-lg bg-gray-50">
                      <div className="flex items-center gap-2">
                        <FileText size={14} className="text-[#1677ff]" />
                        <span className="text-sm text-gray-700">{f.name}</span>
                        <span className="text-[10px] text-gray-400">{formatSize(f.size)}</span>
                      </div>
                      <button onClick={() => removeFile(i)} className="text-gray-400 hover:text-red-500 text-xs">删除</button>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                <span className="text-xs text-gray-400">已选择 {files.length} 个文件</span>
                <button onClick={handleUpload} disabled={files.length === 0} className="btn-primary flex items-center gap-2">
                  <Search size={16} /> 上传并识别
                </button>
              </div>
            </div>
          )}

          {step.key === 'classify' && (
            <div className="text-center py-8">
              <CheckCircle size={48} className="mx-auto mb-4 text-green-500" />
              <h3 className="text-base font-semibold text-gray-800 mb-1">文件识别完成</h3>
              <p className="text-sm text-gray-500 mb-6">AI 已自动识别以下文件类型，请确认</p>
              <div className="max-w-md mx-auto space-y-3">
                {files.map((f, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-gray-50 text-left">
                    <div className="flex items-center gap-2">
                      <FileText size={16} className="text-[#1677ff]" />
                      <div><p className="text-sm font-medium text-gray-700">{f.name}</p><span className="tag-blue mt-0.5 inline-block">{contractType}</span></div>
                    </div>
                    <span className="tag-green">识别完成</span>
                  </div>
                ))}
              </div>
              <button onClick={() => setStepIdx(2)} className="btn-primary mt-6 flex items-center gap-2 mx-auto">确认，下一步 <ArrowRight size={16} /></button>
            </div>
          )}

          {step.key === 'requirements' && (
            <div className="max-w-2xl mx-auto">
              <h3 className="text-base font-semibold text-gray-800 text-center mb-6">填写审查要求</h3>
              <div className="bg-gray-50 rounded-xl p-6 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium text-gray-700 mb-1.5">合同类型</label><select className="input-field" defaultValue={contractType}><option>采购合同</option><option>销售合同</option><option>服务合同</option><option>租赁合同</option><option>保密协议</option><option>其他</option></select></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1.5">审阅人</label><input type="text" className="input-field" placeholder="请输入审阅人姓名" /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium text-gray-700 mb-1.5">审查立场</label><select className="input-field" defaultValue="甲方"><option>甲方</option><option>乙方</option><option>丙方</option></select></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1.5">审查尺度</label><select className="input-field" defaultValue="中立"><option>强势</option><option>中立</option><option>弱势</option></select></div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">审查点清单 <span className="text-gray-400 font-normal text-xs">（点击选择，可多选）</span></label>
                  <div className="flex flex-wrap gap-2">
                    {['全面审查（所有审查点）','风险条款专项审查','合规性专项审查','权利义务对等性审查','知识产权条款审查','违约责任条款审查','保密条款审查','争议解决条款审查'].map((p) => {
                      const selected = reviewPoints.includes(p)
                      return (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setReviewPoints((prev) => selected ? prev.filter((x) => x !== p) : [...prev, p])}
                          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                            selected
                              ? 'bg-[#1677ff] text-white'
                              : 'bg-white border border-gray-200 text-gray-600 hover:border-[#1677ff] hover:text-[#1677ff]'
                          }`}
                        >
                          {p}
                          {selected && <X size={13} />}
                        </button>
                      )
                    })}
                  </div>
                </div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1.5">自设审查需求</label><textarea className="input-field min-h-[90px]" rows={3} placeholder="例如：重点关注知识产权归属、保密期限、违约金比例等具体条款..." /></div>
              </div>
              <div className="flex justify-center gap-3 mt-6">
                <button onClick={() => setStepIdx(1)} className="btn-outline flex items-center gap-1"><ArrowLeft size={14} /> 返回</button>
                <button onClick={handleStartReview} className="btn-primary flex items-center gap-2"><FileSearch size={16} /> 开始审查</button>
              </div>
            </div>
          )}

          {step.key === 'reviewing' && (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-5"><Loader size={32} className="text-[#1677ff] animate-spin" /></div>
              <h3 className="text-base font-semibold text-gray-800 mb-1">AI 正在审查合同</h3>
              <p className="text-sm text-gray-500 mb-8">正在逐条分析合同条款，请稍候...</p>
              <div className="flex items-center justify-center gap-1 max-w-xs mx-auto">
                {[0,1,2,3].map((i) => (<div key={i} className="flex-1 h-2 rounded-full bg-gray-200 overflow-hidden"><div className={`h-full rounded-full bg-[#1677ff] transition-all duration-700 ${i <= 1 ? 'w-full' : i === 2 ? 'w-2/3' : 'w-0'}`} /></div>))}
              </div>
              <div className="flex items-center justify-center gap-6 mt-8 text-xs text-gray-400">
                <span className="flex items-center gap-1"><FileText size={12} /> 文件解析 ✓</span>
                <span className="flex items-center gap-1"><Search size={12} /> 类型识别 ✓</span>
                <span className="flex items-center gap-1 text-[#1677ff]"><Loader size={12} className="animate-spin" /> AI 审查中</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 5: Report - Full page layout */}
      {step.key === 'report' && (
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <h3 className="text-base font-semibold text-gray-800">审查报告</h3>
              <span className="tag-green">审查完成</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative group">
                <button className="btn-primary text-xs px-4 py-2 flex items-center gap-1.5">
                  <Download size={14} /> 导出报告
                </button>
                <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-lg shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                  <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 rounded-t-lg"><FileText size={14} className="text-gray-400" /> 原始文档</button>
                  <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"><FileText size={14} className="text-[#1677ff]" /> 批注版</button>
                  <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 rounded-b-lg"><FileText size={14} className="text-green-500" /> 审查意见书</button>
                </div>
              </div>
              <button className="btn-outline text-xs px-3 py-2 flex items-center gap-1"><ArrowLeftRight size={13} /> 重新审查</button>
            </div>
          </div>

          <div className="flex-1 flex gap-4 min-h-0">
            {/* Left: Contract text */}
            <div className="w-1/2 bg-white rounded-xl border border-gray-100 flex flex-col overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100 bg-gray-50">
                <span className="text-xs font-medium text-gray-600 flex items-center gap-1.5"><FileText size={13} className="text-gray-400" /> {mockReport.title}</span>
                <span className="text-[10px] text-gray-400">设备采购框架协议.pdf</span>
              </div>
              <div ref={leftPanelRef} className="flex-1 overflow-y-auto p-5 text-sm text-gray-700 leading-relaxed space-y-3 font-mono">
                <p className="font-semibold text-base text-gray-900">设备采购框架协议</p>
                <p className="text-gray-500 text-xs">合同编号：{mockReport.basicInfo.contractNo} &nbsp;|&nbsp; 签署日期：{mockReport.basicInfo.signDate}</p>
                <p className="font-medium text-gray-800 mt-4">第一条 合同主体</p>
                <p>甲方（采购方）：{mockReport.basicInfo.partyA}</p>
                <p>乙方（供应方）：{mockReport.basicInfo.partyB}</p>
                <p>甲乙双方本着平等自愿的原则，经友好协商，就设备采购事宜达成如下协议：</p>
                <p className="font-medium text-gray-800 mt-4">第二条 采购内容</p>
                <p>2.1 采购设备清单详见附件一。</p>
                <p>2.2 设备技术参数及验收标准详见附件二。</p>
                <p className="font-medium text-gray-800 mt-4">第三条 合同价款及支付</p>
                <p>3.1 合同总价为人民币伍佰万元整（¥5,000,000.00）。</p>
                <p>3.2 上述价格为含税价格，税率为 13%。</p>
                <p id="clause-3.5" className="bg-red-50 border-l-2 border-red-400 pl-2 py-1.5 -mx-2 px-2 rounded-r my-2 cursor-pointer hover:bg-red-100 transition-colors" onClick={() => { setRightTab('risk'); setRiskSubTab('medium'); setExpandedIssue('issue-2') }}>3.5 甲方应在收到乙方发票后支付相应款项。</p>
                <p className="font-medium text-gray-800 mt-4">第四条 交付与验收</p>
                <p>4.1 乙方应在合同生效后 60 个自然日内完成交付。</p>
                <p>4.2 甲方应在收到货物后 7 个工作日内完成验收。</p>
                <p className="font-medium text-gray-800 mt-4">第五条 质量保证</p>
                <p>5.1 乙方对所供设备提供 12 个月的质量保证期。</p>
                <p className="font-medium text-gray-800 mt-4">第七条 违约责任</p>
                <p>7.2 如乙方逾期交付，每逾期一日，应向甲方支付合同总价万分之五的违约金。</p>
                <p id="clause-7.3" className="bg-red-50 border-l-2 border-red-400 pl-2 py-1.5 -mx-2 px-2 rounded-r my-2 cursor-pointer hover:bg-red-100 transition-colors" onClick={() => { setRightTab('risk'); setRiskSubTab('high'); setExpandedIssue('issue-0') }}>7.3 甲方违约的，违约金上限为合同总价的5%；乙方违约的，违约金上限为合同总价的15%。</p>
                <p className="font-medium text-gray-800 mt-4">第八条 保密义务</p>
                <p id="clause-8.1" className="bg-yellow-50 border-l-2 border-yellow-400 pl-2 py-1.5 -mx-2 px-2 rounded-r my-2 cursor-pointer hover:bg-yellow-100 transition-colors" onClick={() => { setRightTab('risk'); setRiskSubTab('medium'); setExpandedIssue('issue-3') }}>8.1 双方应对本协议内容承担保密义务，未经对方书面同意，不得向第三方披露。</p>
                <p className="font-medium text-gray-800 mt-4">第十一条 不可抗力</p>
                <p>11.1 因不可抗力导致合同无法履行的，受影响方不承担违约责任。</p>
                <p className="font-medium text-gray-800 mt-4">第十二条 争议解决</p>
                <p id="clause-12.1" className="bg-red-50 border-l-2 border-red-400 pl-2 py-1.5 -mx-2 px-2 rounded-r my-2 cursor-pointer hover:bg-red-100 transition-colors" onClick={() => { setRightTab('risk'); setRiskSubTab('high'); setExpandedIssue('issue-1') }}>12.1 因本协议引起的或与本协议有关的任何争议，双方应友好协商解决。协商不成的，任何一方可向有管辖权的法院提起诉讼。</p>
                <p className="font-medium text-gray-800 mt-4">第十三条 其他</p>
                <p>13.1 本协议一式两份，甲乙双方各执一份，具有同等法律效力。</p>
                <p className="text-center text-gray-300 text-[10px] pt-4 pb-2">— 合同正文结束 —</p>
              </div>
            </div>

            {/* Right: Tabbed results */}
            <div className="w-1/2 flex flex-col overflow-hidden">
              {/* Main tabs: 合同概要 | 风险审查 */}
              <div className="flex gap-0 mb-3 bg-gray-100 rounded-lg p-0.5">
                <button onClick={() => setRightTab('summary')} className={`flex-1 py-2 text-xs font-medium rounded-md transition-colors ${rightTab === 'summary' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>合同概要</button>
                <button onClick={() => setRightTab('risk')} className={`flex-1 py-2 text-xs font-medium rounded-md transition-colors ${rightTab === 'risk' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>风险审查</button>
              </div>

              <div className="flex-1 overflow-y-auto min-h-0 space-y-3">
                {/* Tab: 合同概要 */}
                {rightTab === 'summary' && (
                  <>
                    <div className="bg-white rounded-xl border border-gray-100 p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center"><span className="text-xl font-bold text-green-500">{mockReport.score}</span></div>
                        <div className="flex-1"><p className="text-sm font-semibold text-gray-800">综合评分</p><p className="text-[10px] text-gray-400">评分良好，存在部分风险条款</p></div>
                        <div className="flex gap-2">
                          {mockReport.riskCategories.map((c) => (<div key={c.name} className="flex items-center gap-1"><div className={`w-2 h-2 rounded-full ${c.color === 'red' ? 'bg-red-500' : c.color === 'yellow' ? 'bg-yellow-500' : 'bg-green-500'}`} /><span className="text-[10px] text-gray-500">{c.count}</span></div>))}
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        {mockReport.dimensions.map((d) => (<div key={d.name} className="flex items-center gap-1 bg-gray-50 rounded-lg px-2.5 py-1.5"><span className="text-[10px] text-gray-500">{d.name}</span><span className={`text-xs font-bold ${getScoreColor(d.score)}`}>{d.score}</span></div>))}
                      </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                      <div className="bg-gray-50 px-4 py-2.5 border-b border-gray-100"><span className="text-xs font-semibold text-gray-700">合同概要</span></div>
                      <div className="p-4 space-y-4">
                        <div>
                          <p className="text-[10px] text-gray-400 font-medium mb-1.5 uppercase tracking-wider">基础信息</p>
                              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                            <div><span className="text-gray-400">合同名称：</span><span className="text-gray-700">{mockReport.title}</span></div>
                            <div><span className="text-gray-400">合同编号：</span><span className="text-gray-700">{mockReport.basicInfo.contractNo}</span></div>
                            <div><span className="text-gray-400">签署日期：</span><span className="text-gray-700">{mockReport.basicInfo.signDate}</span></div>
                            <div><span className="text-gray-400">合同类型：</span><span className="text-gray-700">{mockReport.basicInfo.contractType}</span></div>
                            <div><span className="text-gray-400">甲方：</span><span className="text-gray-700">{mockReport.basicInfo.partyA}</span></div>
                            <div><span className="text-gray-400">乙方：</span><span className="text-gray-700">{mockReport.basicInfo.partyB}</span></div>
                          </div>
                        </div>
                        <div className="border-t border-gray-100 pt-3">
                          <p className="text-[10px] text-gray-400 font-medium mb-1.5 uppercase tracking-wider">交易信息</p>
                          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                            <div className="col-span-2"><span className="text-gray-400">合同总价：</span><span className="text-gray-700 font-medium">{mockReport.transactionInfo.totalAmount}</span></div>
                            <div className="col-span-2"><span className="text-gray-400">付款方式：</span><span className="text-gray-700">{mockReport.transactionInfo.paymentMethod}</span></div>
                            <div className="col-span-2"><span className="text-gray-400">交付期限：</span><span className="text-gray-700">{mockReport.transactionInfo.deliveryDate}</span></div>
                            <div><span className="text-gray-400">质保期：</span><span className="text-gray-700">{mockReport.transactionInfo.warrantyPeriod}</span></div>
                          </div>
                        </div>
                        <div className="border-t border-gray-100 pt-3">
                          <p className="text-[10px] text-gray-400 font-medium mb-1.5 uppercase tracking-wider">风险管理</p>
                          <div className="flex gap-2">
                            {mockReport.riskCategories.map((c) => (<div key={c.name} className={`flex-1 rounded-lg py-3 text-center ${c.color === 'red' ? 'bg-red-50' : c.color === 'yellow' ? 'bg-yellow-50' : 'bg-green-50'}`}><p className={`text-lg font-bold ${c.color === 'red' ? 'text-red-500' : c.color === 'yellow' ? 'text-yellow-500' : 'text-green-500'}`}>{c.count}</p><p className="text-xs text-gray-500">{c.name}</p></div>))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-100 p-4">
                      <p className="text-xs font-semibold text-gray-800 mb-2">审查信息</p>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[10px] text-gray-500">
                        <div><span className="text-gray-400">审阅人：</span>系统管理员</div>
                        <div><span className="text-gray-400">审查立场：</span>甲方</div>
                        <div><span className="text-gray-400">审查尺度：</span>中立</div>
                        <div><span className="text-gray-400">审查时间：</span>2026-05-14 10:30</div>
                      </div>
                    </div>
                  </>
                )}

                {/* Tab: 风险审查 */}
                {rightTab === 'risk' && (
                  <>
                    {/* Sub-tabs: 高风险点 | 一般风险点 | 无风险点 */}
                    <div className="flex gap-0 bg-gray-100 rounded-lg p-0.5">
                      <button onClick={() => setRiskSubTab('high')} className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${riskSubTab === 'high' ? 'bg-red-500 text-white shadow-sm' : 'text-red-600 hover:text-red-700'}`}>高风险点 ({highRisk.length})</button>
                      <button onClick={() => setRiskSubTab('medium')} className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${riskSubTab === 'medium' ? 'bg-yellow-500 text-white shadow-sm' : 'text-yellow-600 hover:text-yellow-700'}`}>一般风险点 ({mediumRisk.length})</button>
                      <button onClick={() => setRiskSubTab('safe')} className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${riskSubTab === 'safe' ? 'bg-green-500 text-white shadow-sm' : 'text-green-600 hover:text-green-700'}`}>无风险点 ({mockReport.safeItems.length})</button>
                    </div>

                    {/* Risk items */}
                    <div className="space-y-2">
                      {riskSubTab === 'high' && (highRisk.length > 0 ? highRisk.map((issue, i) => renderIssueCard(issue, mockReport.issues.indexOf(issue))) : <div className="text-center py-8 text-sm text-gray-400">暂无高风险点</div>)}
                      {riskSubTab === 'medium' && (mediumRisk.length > 0 ? mediumRisk.map((issue, i) => renderIssueCard(issue, mockReport.issues.indexOf(issue))) : <div className="text-center py-8 text-sm text-gray-400">暂无一般风险点</div>)}
                      {riskSubTab === 'safe' && (mockReport.safeItems.length > 0 ? mockReport.safeItems.map((item, i) => renderSafeCard(item, i)) : <div className="text-center py-8 text-sm text-gray-400">暂无无风险点</div>)}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
