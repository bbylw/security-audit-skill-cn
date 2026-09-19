export type Phase = {
  id: string;
  no: string;
  title: string;
  en: string;
  summary: string;
  points: string[];
  artifact: string;
  artifactDesc: string;
};

export const phases: Phase[] = [
  {
    id: 'recon',
    no: '01',
    title: '侦察',
    en: 'Reconnaissance',
    summary: '梳理架构、信任边界、输入面与既往证据，建立确定性覆盖基线。',
    points: [
      '输出 architecture.md：组件、信任边界与数据流',
      '输出 coverage-ledger.json：覆盖单元与证据指针',
      '父智能体每次账本更新后运行 validate-coverage-ledger.cjs',
    ],
    artifact: 'architecture.md + coverage-ledger.json',
    artifactDesc: '后续所有搜寻都从账本单元派发，避免盲区。',
  },
  {
    id: 'hunt',
    no: '02',
    title: '覆盖驱动的漏洞搜寻',
    en: 'Coverage-led hunting',
    summary: '从账本派发相互隔离的搜寻智能体，用覆盖审查员发现遗漏。',
    points: [
      '搜寻智能体之间相互隔离，避免结论污染',
      '每个智能体记录检查项（checks）与覆盖单元映射',
      '覆盖审查员复核：遗漏的单元重新派发',
    ],
    artifact: 'checks + 候选漏洞池',
    artifactDesc: '单次运行约只能发现累计漏洞的一半，多次运行叠加覆盖。',
  },
  {
    id: 'validate',
    no: '03',
    title: '候选验证',
    en: 'Candidate validation',
    summary: '每个候选漏洞交给全新验证智能体，尝试证伪而非证实。',
    points: [
      '验证者与发现者必须是不同智能体（对抗式验证）',
      '只确认已确证的边界失效，受阻线索保留为待验证',
      '沙箱缺失时不执行目标代码，仅记录确切未解决事实',
    ],
    artifact: '已确证 / 待验证 / 已排除候选',
    artifactDesc: '严重度 = 可能性 × 影响，而非检查清单偏离度。',
  },
  {
    id: 'output',
    no: '04',
    title: '结构化输出',
    en: 'Structured output',
    summary: '将三类判定写入 findings.json，并依据 report-schema.json 校验。',
    points: [
      'confirmed：完整溯源轨迹 + 有界观测结果',
      'needs_validation：确切未解决事实，不带严重级别',
      'rejected：已被证伪的候选，保留排除理由',
      '运行 validate-findings.cjs 做零依赖校验',
    ],
    artifact: 'findings.json',
    artifactDesc: '三类判定语义严格区分，避免“疑似漏洞”混入已确认。',
  },
  {
    id: 'verify',
    no: '05',
    title: '独立记录核验',
    en: 'Independent verification',
    summary: '全新智能体核验最终记录对源码的各项主张，替换后重新验证。',
    points: [
      '逐条核对源码引用、行号与行为主张',
      '实质性替换触发新一轮独立验证 + 校验器重跑',
      '延续当前源码层面证据，不沿用过期成果',
    ],
    artifact: '已核验 findings',
    artifactDesc: '核验者与原验证者隔离，防止自我确认偏见。',
  },
  {
    id: 'report',
    no: '06',
    title: '目标中立的报告',
    en: 'Target-neutral reporting',
    summary: '基于已核验记录与覆盖账本，派生三份面向不同读者的报告。',
    points: [
      'REPORT.md：执行摘要与已确认发现',
      'FINDINGS-DETAIL.md：完整溯源与复现边界',
      'NEEDS-VALIDATION.md：待验证清单与缺失证据',
    ],
    artifact: 'REPORT.md / FINDINGS-DETAIL.md / NEEDS-VALIDATION.md',
    artifactDesc: '报告只陈述证据支撑的结论，不做目标特定的风险断言。',
  },
];

export type FileGroup = 'core' | 'hunt' | 'ops';

export type DocFile = {
  name: string;
  group: FileGroup;
  use: string;
  detail: string;
};

export const docFiles: DocFile[] = [
  { name: 'SKILL.md', group: 'core', use: '安装配置 · 核心原则 · 工作流概览', detail: '审计反模式与平台术语，智能体的入口契约。' },
  { name: 'RECONNAISSANCE.md', group: 'core', use: '第 1 阶段侦察提示词', detail: '如何产出 architecture.md 与 coverage-ledger.json。' },
  { name: 'HUNTING.md', group: 'core', use: '第 2 阶段编排与验证规则', detail: '搜寻方法论、隔离要求与覆盖审查。' },
  { name: 'VALIDATION-AND-REPORTING.md', group: 'core', use: '第 3-6 阶段验证与报告', detail: '候选验证、结构化输出、核验与三份报告派生。' },
  { name: 'ATTACK-CLASSES.md', group: 'hunt', use: '核心 / 通配 / 显而易见类', detail: '通用攻击提示词基座。' },
  { name: 'MEMORY-SAFETY-AND-BINARY.md', group: 'hunt', use: '原生目标', detail: '内存安全、二进制与内核搜寻类。' },
  { name: 'AI-AND-LLM.md', group: 'hunt', use: 'LLM 支撑目标', detail: '提示注入、智能体 / 工具、输出处理。' },
  { name: 'WEB-PROTOCOL-AND-AUTH.md', group: 'hunt', use: 'HTTP 与鉴权目标', detail: '请求封装、缓存、认证协议。' },
  { name: 'CLIENT-SIDE.md', group: 'hunt', use: '客户端 / 浏览器目标', detail: 'DOM 注入、消息信任、UI 欺骗、原型污染。' },
  { name: 'SUPPLY-CHAIN-AND-RELEASE.md', group: 'hunt', use: '供应链与发布', detail: '依赖、CI、签名、更新、插件与扩展。' },
  { name: 'CLOUD-AND-DEPLOYMENT.md', group: 'hunt', use: '云与部署', detail: 'IAM、IaC、容器、无服务器、入口与运行时。' },
  { name: 'PROTOCOLS-RPC-AND-MESSAGING.md', group: 'hunt', use: 'RPC 与消息', detail: '序列化、队列、代理、Webhook 与流式协议。' },
  { name: 'RESOURCE-EXHAUSTION-AND-AVAILABILITY.md', group: 'hunt', use: '资源与可用性', detail: '共享资源、配额、队列、worker 与运营开销。' },
  { name: 'DATA-ISOLATION-AND-LIFECYCLE.md', group: 'hunt', use: '数据隔离与生命周期', detail: '租户隔离、缓存、搜索、导出、备份、删除与恢复。' },
  { name: 'DESKTOP-MOBILE-AND-LOCAL-IPC.md', group: 'hunt', use: '端与本地 IPC', detail: '原生应用、深链接、WebView、导出组件与守护进程。' },
  { name: 'report-schema.json', group: 'ops', use: '三类别判定 Schema', detail: 'findings.json 的结构化约束。' },
  { name: 'validate-findings.cjs', group: 'ops', use: '第 4、5 阶段校验器', detail: '零依赖，校验 findings.json。' },
  { name: 'validate-findings.test.cjs', group: 'ops', use: '校验器测试', detail: '兼容生产端的夹具检查。' },
  { name: 'validate-coverage-ledger.cjs', group: 'ops', use: '第 1–5 阶段校验器', detail: '零依赖，校验 coverage-ledger.json。' },
  { name: 'validate-coverage-ledger.test.cjs', group: 'ops', use: '账本校验器测试', detail: '覆盖账本的结构与一致性测试。' },
];

export const tickerItems = [
  '提示注入',
  '原型污染',
  'SSRF',
  '缓存投毒',
  '鉴权绕过',
  '反序列化',
  '租户逃逸',
  'Webhook 伪造',
  '依赖投毒',
  'TOCTOU',
  '深链接劫持',
  '配额耗尽',
];
