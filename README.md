# security-audit（安全审计）

一个面向编码智能体（coding-agent）的技能，能让你的智能体化身安全审计员。它通过侦察、覆盖驱动的漏洞搜寻、候选验证、结构化输出、独立记录核验，以及目标中立的报告生成，来编排多个相互隔离的智能体。

这个技能正是 Cloudflare 漏洞发现框架（vulnerability discovery harness）的雏形，其设计在 [构建你自己的漏洞发现框架](https://blog.cloudflare.com/build-your-own-vulnerability-harness) 一文中有所介绍。该框架后来演进为一个多阶段、全集群的系统；而这份技能，正是它最初演化出来的单仓库起点。

## 功能说明

该技能以六个阶段运行一次结构化审计：

1. **侦察（Reconnaissance）** -- 在 `architecture.md` 与 `coverage-ledger.json` 中梳理架构、信任边界、输入面、既往证据，以及确定性的覆盖情况。
2. **覆盖驱动的漏洞搜寻（Coverage-led hunting）** -- 从账本单元中派发相互隔离的搜寻智能体，记录它们的检查项，并用覆盖审查员发现遗漏。
3. **候选验证（Candidate validation）** -- 把每一个独特的候选漏洞交给一个全新的验证智能体，由它尝试证伪。
4. **结构化输出（Structured output）** -- 将 `confirmed`（已确认）、`needs_validation`（待验证）、`rejected`（已排除）三类记录写入 `findings.json`，并依据 `report-schema.json` 进行校验。
5. **独立记录核验（Independent record verification）** -- 由全新的智能体核验最终对源代码的各项主张。实质性替换会再经过一轮独立验证。
6. **目标中立的报告（Target-neutral reporting）** -- 基于已核验的记录与覆盖账本，派生出 `REPORT.md`、`FINDINGS-DETAIL.md` 与 `NEEDS-VALIDATION.md`。

父智能体（parent）在创建账本后、以及每次账本更新后都会运行 `validate-coverage-ledger.cjs`。它会在第 4 阶段运行 `validate-findings.cjs`，并在第 5 阶段的每次替换之后再运行一遍。

三种判定结果彼此不同：`confirmed` 拥有完整的溯源轨迹与有界的观测结果；`needs_validation` 含有一个确切但未解决的事实，且不带严重级别；`rejected` 记录的是已被证伪的候选漏洞。

对同一仓库的多次运行是叠加式的。该技能会利用先前的账本与发现结果来瞄准遗漏、对发生变更的源代码重新验证，并在不把过期或未完成的成果当作已覆盖的前提下，延续当前源码层面的证据。

## 文件清单

| 文件 | 用途 |
|------|---------|
| [`SKILL.md`](https://github.com/cloudflare/security-audit-skill/blob/main/skills/security-audit/SKILL.md) | 安装配置、核心原则、平台术语、工作流概览，以及审计反模式 |
| [`RECONNAISSANCE.md`](https://github.com/cloudflare/security-audit-skill/blob/main/skills/security-audit/RECONNAISSANCE.md) | 第 1 阶段侦察提示词与综合整理说明 |
| [`HUNTING.md`](https://github.com/cloudflare/security-audit-skill/blob/main/skills/security-audit/HUNTING.md) | 第 2 阶段编排、搜寻方法论与验证规则 |
| [`ATTACK-CLASSES.md`](https://github.com/cloudflare/security-audit-skill/blob/main/skills/security-audit/ATTACK-CLASSES.md) | 核心、通配与显而易见类攻击的提示词 |
| [`MEMORY-SAFETY-AND-BINARY.md`](https://github.com/cloudflare/security-audit-skill/blob/main/skills/security-audit/MEMORY-SAFETY-AND-BINARY.md) | 面向原生目标的 memory-safety、二进制与内核搜寻类 |
| [`AI-AND-LLM.md`](https://github.com/cloudflare/security-audit-skill/blob/main/skills/security-audit/AI-AND-LLM.md) | 面向 LLM 支撑目标的提示注入、智能体/工具、输出处理搜寻类 |
| [`WEB-PROTOCOL-AND-AUTH.md`](https://github.com/cloudflare/security-audit-skill/blob/main/skills/security-audit/WEB-PROTOCOL-AND-AUTH.md) | 面向 HTTP 协议与鉴权目标的请求封装、缓存、认证协议搜寻类 |
| [`CLIENT-SIDE.md`](https://github.com/cloudflare/security-audit-skill/blob/main/skills/security-audit/CLIENT-SIDE.md) | 面向客户端/浏览器目标的 DOM 注入、消息信任、UI 欺骗与原型污染搜寻类 |
| [`SUPPLY-CHAIN-AND-RELEASE.md`](https://github.com/cloudflare/security-audit-skill/blob/main/skills/security-audit/SUPPLY-CHAIN-AND-RELEASE.md) | 依赖、CI、发布、签名、更新、插件与扩展搜寻类 |
| [`CLOUD-AND-DEPLOYMENT.md`](https://github.com/cloudflare/security-audit-skill/blob/main/skills/security-audit/CLOUD-AND-DEPLOYMENT.md) | IAM、基础设施即代码、容器、无服务器、入口与运行时配置搜寻类 |
| [`PROTOCOLS-RPC-AND-MESSAGING.md`](https://github.com/cloudflare/security-audit-skill/blob/main/skills/security-audit/PROTOCOLS-RPC-AND-MESSAGING.md) | RPC、序列化、队列、消息代理、Webhook 与流式协议搜寻类 |
| [`RESOURCE-EXHAUSTION-AND-AVAILABILITY.md`](https://github.com/cloudflare/security-audit-skill/blob/main/skills/security-audit/RESOURCE-EXHAUSTION-AND-AVAILABILITY.md) | 共享资源、配额、队列、worker 与运营开销搜寻类 |
| [`DATA-ISOLATION-AND-LIFECYCLE.md`](https://github.com/cloudflare/security-audit-skill/blob/main/skills/security-audit/DATA-ISOLATION-AND-LIFECYCLE.md) | 租户隔离、缓存、搜索、导出、备份、迁移、删除与恢复搜寻类 |
| [`DESKTOP-MOBILE-AND-LOCAL-IPC.md`](https://github.com/cloudflare/security-audit-skill/blob/main/skills/security-audit/DESKTOP-MOBILE-AND-LOCAL-IPC.md) | 原生应用、深链接、WebView、导出组件、辅助程序、守护进程与本地 IPC 搜寻类 |
| [`VALIDATION-AND-REPORTING.md`](https://github.com/cloudflare/security-audit-skill/blob/main/skills/security-audit/VALIDATION-AND-REPORTING.md) | 第 3–6 阶段候选验证、结构化输出、记录核验与报告 |
| [`report-schema.json`](https://github.com/cloudflare/security-audit-skill/blob/main/skills/security-audit/report-schema.json) | 三类别 `findings.json` 判定的 JSON Schema |
| [`validate-findings.cjs`](https://github.com/cloudflare/security-audit-skill/blob/main/skills/security-audit/validate-findings.cjs) | 第 4、5 阶段对 `findings.json` 的零依赖校验器 |
| [`validate-findings.test.cjs`](https://github.com/cloudflare/security-audit-skill/blob/main/skills/security-audit/validate-findings.test.cjs) | 发现结果校验器的测试与兼容生产端的夹具检查 |
| [`validate-coverage-ledger.cjs`](https://github.com/cloudflare/security-audit-skill/blob/main/skills/security-audit/validate-coverage-ledger.cjs) | 第 1–5 阶段对 `coverage-ledger.json` 的零依赖校验器 |
| [`validate-coverage-ledger.test.cjs`](https://github.com/cloudflare/security-audit-skill/blob/main/skills/security-audit/validate-coverage-ledger.test.cjs) | 覆盖账本校验器的测试 |

## 安装

使用 [Skills CLI](https://skills.sh) 安装该技能：

```bash
npx skills add https://github.com/cloudflare/security-audit-skill \
  --skill security-audit
```

加 `--global` 可安装到用户级别：

```bash
npx skills add https://github.com/cloudflare/security-audit-skill \
  --skill security-audit \
  --global
```

运行 `npx skills --help` 可查看智能体选择与非交互式选项。

## 用法

在你的编码智能体所在（或指向）的代码库中启动它，然后让它做一次安全审计：

```
security audit this codebase
```

```
find security vulnerabilities in ./src
```

```
do a security review, output to ~/audits/my-project
```

当请求命中其触发条件时（如 security audit、find vulnerabilities、pen-test the code 等），该技能会自动激活。直接的代码库审计或渗透测试请求会进入完整审计模式。安全咨询与聚焦的漏洞排查会进入指导模式，除非你明确要求生成报告产物。在完整审计模式下，若未指定输出目录，则默认使用 `~/security-audit-skill/<repo-name>/run-<N>`。工作流只有在你显式选择一个被版本控制忽略的目录时，才会在目标仓库内部写入文件。

## 运行要求

- 一个支持工具调用与并行子智能体的编码智能体
- Node.js，用于运行零依赖的发现结果与覆盖账本校验器
- 一个由操作系统强制约束的沙箱，用于执行被审计目标所控制的构建、测试、进程、浏览器、模拟器、模糊测试器与测试夹具。它必须禁用外部网络、使用经过净化的白名单环境、强制资源限制，并且只允许写入指定的临时路径。若缺少这些控制，工作流只会把该线索保持为 `needs_validation`，而不会去执行目标代码。

## 设计原则

- **只确认已确证的边界失效。** 把有源码依据但受阻的线索作为 `needs_validation` 保留，并写明其确切的未解决事实。
- **对抗式验证。** 检查某条发现的智能体，绝不可以是发现它的那个智能体。
- **严重级别必须有影响力支撑。** 严重度 = 可能性 × 影响，而不是对检查清单的偏离程度。
- **纵深防御的缺口不等于漏洞。** 如果 A 层已阻止该攻击，那么缺少 B 层只是一条加固建议。
- **多次运行可提升覆盖率。** 在我们的测试运行中，单次运行大约只能找出重复运行累计所发现漏洞的一半。

## 联系方式

关于 AI 驱动安全工具的疑问、反馈或经验交流：security-ai-research@cloudflare.com

## 许可证

MIT -- 详见 [LICENSE](https://github.com/cloudflare/security-audit-skill/blob/main/LICENSE)。
