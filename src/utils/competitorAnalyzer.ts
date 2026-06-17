export interface Competitor {
  id: string;
  name: string;
  aliases: string[];
  category: string;
  strengths: string[];
  weaknesses: string[];
  differentiationScript: string;
  keyTalkingPoints: string[];
}

export interface CompetitorMatchResult {
  competitor: Competitor;
  matchedKeywords: string[];
  matchCount: number;
  response: CompetitorResponse;
}

export interface CompetitorResponse {
  acknowledge: string;
  differentiation: string;
  callToAction: string;
  fullScript: string;
}

export const COMPETITOR_DATABASE: Competitor[] = [
  {
    id: 'comp-001',
    name: '阿里云',
    aliases: ['阿里云', 'aliyun', '阿里', 'alibaba cloud', 'alicloud'],
    category: '云计算服务商',
    strengths: ['生态丰富', '电商场景成熟', '价格灵活'],
    weaknesses: [
      '企业级定制化能力较弱',
      '大客户服务响应慢',
      '混合云部署复杂',
      '数据主权与合规性不够透明',
    ],
    differentiationScript:
      '阿里云确实在公有云领域有广泛的生态。但我们的核心优势在于：第一，深耕企业级客户的深度定制，服务团队1:1专属对接，SLA响应时间缩短60%；第二，混合云与私有云架构是我们的强项，已有50+大型央企采用我们的方案实现平滑迁移；第三，数据完全驻留客户侧，满足金融/医疗等强监管行业的合规审计要求。',
    keyTalkingPoints: [
      '专属客户成功经理，15分钟响应SLA',
      '全栈私有化部署能力',
      '金融级等保三级认证',
      '定制开发交付周期缩短50%',
    ],
  },
  {
    id: 'comp-002',
    name: '腾讯云',
    aliases: ['腾讯云', 'tencent cloud', '腾讯', 'wecloud', 'qcloud'],
    category: '云计算服务商',
    strengths: ['社交生态强', '音视频技术领先', 'C端产品基因'],
    weaknesses: [
      'B端企业服务经验相对不足',
      '行业解决方案垂直深度不够',
      '企业级安全合规体系待完善',
      '技术支持偏重标准化产品',
    ],
    differentiationScript:
      '腾讯云在C端生态和音视频领域确实有优势。但我们更专注服务B端企业客户的深度需求：我们深耕金融、制造、能源等垂直行业超过8年，积累了200+行业标杆案例；我们的企业级安全体系通过了等保三级、ISO27001、SOC2等多项权威认证；特别在数据治理和业务流程定制上，我们提供端到端的咨询+交付+运维全流程服务，而不是只交付标准化产品。',
    keyTalkingPoints: [
      '200+行业标杆客户案例',
      '咨询+交付+运维全流程服务',
      '多体系安全合规认证',
      '垂直行业深度know-how',
    ],
  },
  {
    id: 'comp-003',
    name: '华为云',
    aliases: ['华为云', 'huawei cloud', '华为', 'hcloud'],
    category: '云计算服务商',
    strengths: ['硬件基因强', '政企关系好', '安全可信'],
    weaknesses: [
      '云原生生态和开源社区活跃度较低',
      'SaaS层应用生态相对薄弱',
      '价格体系不够灵活',
      '商务流程冗长',
    ],
    differentiationScript:
      '华为云在基础设施和硬件方面确实实力雄厚。我们的差异化在于：第一，我们更灵活，支持多云架构和混合部署，避免厂商锁定；第二，我们的云原生技术栈全面兼容Kubernetes生态，支持平滑迁移和弹性扩展，已有300+客户从其他云无缝切换；第三，我们的商务流程更高效，标准合同审批不超过3个工作日，项目平均交付周期比行业快30%。',
    keyTalkingPoints: [
      '多云/混合云架构，避免锁定',
      '开源生态全面兼容',
      '商务流程高效，3天合同审批',
      '交付周期比行业快30%',
    ],
  },
  {
    id: 'comp-004',
    name: 'Salesforce',
    aliases: ['salesforce', 'sales force', '赛富时', 'SFDC', 'sfdc'],
    category: 'CRM/SaaS平台',
    strengths: ['全球品牌知名度高', '功能全面', '生态系统成熟'],
    weaknesses: [
      '本地化部署困难，数据存在境外',
      '定制开发成本高，实施周期长',
      '用户体验不符合国内习惯',
      '国内服务支持响应慢',
      '价格昂贵，总拥有成本高',
    ],
    differentiationScript:
      'Salesforce确实是国际CRM领域的标杆。但对于中国企业，我们更懂本土化：第一，数据完全存放在国内，满足《数据安全法》《个人信息保护法》等法规要求；第二，我们的产品界面和操作流程完全贴合国内用户习惯，学习成本降低70%；第三，我们提供本地化实施团队，平均交付周期3-6周，而Salesforce通常需要3-6个月；第四，同等功能下，我们的总体拥有成本降低40-60%。',
    keyTalkingPoints: [
      '国内数据驻留，合规保障',
      '本土化操作，学习成本低',
      '交付周期3-6周',
      'TCO降低40-60%',
    ],
  },
  {
    id: 'comp-005',
    name: '用友',
    aliases: ['用友', 'yonyou', 'UFIDA', '用友网络'],
    category: 'ERP/企业管理软件',
    strengths: ['财务软件起家，财务模块成熟', '客户基数大', '品牌认知度高'],
    weaknesses: [
      '产品架构偏传统，云原生能力弱',
      '定制开发需要依赖服务商，成本高',
      '用户体验老旧，移动端体验差',
      '开放性和集成能力不足',
    ],
    differentiationScript:
      '用友在财务和传统ERP领域确实积累很深。但我们的产品基于新一代云原生架构：第一，微服务+容器化部署，支持按需扩容，系统弹性提升5倍；第二，低代码平台内置，业务人员可自行配置流程，定制效率提升3倍；第三，API开放平台预置200+常用集成接口，与主流系统打通成本降低80%；第四，移动端和PC端一体化设计，随时随地办公。',
    keyTalkingPoints: [
      '云原生架构，弹性扩容',
      '内置低代码平台，敏捷定制',
      '200+预置API，集成简单',
      '移动端体验优秀',
    ],
  },
  {
    id: 'comp-006',
    name: '金蝶',
    aliases: ['金蝶', 'kingdee', '金蝶软件'],
    category: 'ERP/企业管理软件',
    strengths: ['中小企业市场占有率高', '财务模块成熟', '性价比高'],
    weaknesses: [
      '大型企业复杂场景支撑能力有限',
      '高性能大数据量处理能力不足',
      '多组织多币种支持较弱',
      '企业级安全体系待加强',
    ],
    differentiationScript:
      '金蝶在中小企业市场确实有很高的性价比。但如果贵公司业务规模增长快或有复杂的集团化管理需求，我们的方案更适合：第一，支持万级用户并发，已服务超过50家千人以上规模企业；第二，支持多组织、多币种、多账簿的集团化管控，满足跨国业务需求；第三，企业级安全体系，通过等保三级+ISO27001双认证；第四，我们提供架构咨询服务，协助客户平滑迁移，已有20+客户从金蝶升级切换。',
    keyTalkingPoints: [
      '万级用户并发能力',
      '集团化多组织管控',
      '双认证安全体系',
      '平滑迁移咨询服务',
    ],
  },
  {
    id: 'comp-007',
    name: '钉钉',
    aliases: ['钉钉', 'dingtalk', 'ding talk', '阿里钉钉'],
    category: '协同办公平台',
    strengths: ['用户基数大', '免费基础功能', '阿里生态'],
    weaknesses: [
      '数据隐私问题受关注',
      '企业级定制能力有限',
      '复杂业务流程难以承载',
      '与企业核心系统集成深度不足',
    ],
    differentiationScript:
      '钉钉作为通用协同工具确实普及率很高。但我们的定位是企业级业务一体化平台：第一，数据完全私有化部署，保证企业核心数据安全；第二，支持深度定制，从组织架构到业务流程均可按企业需求灵活配置；第三，预置200+企业级应用模板，覆盖HR、财务、项目管理、供应链等核心场景；第四，提供标准化API与企业核心业务系统无缝集成，打造统一工作台。',
    keyTalkingPoints: [
      '私有化部署，数据安全可控',
      '深度定制，灵活适配',
      '200+企业级应用模板',
      '核心系统无缝集成',
    ],
  },
  {
    id: 'comp-008',
    name: '企业微信',
    aliases: ['企业微信', 'wecom', 'wechat work', '企微'],
    category: '协同办公平台',
    strengths: ['微信生态打通', '客户连接能力强', '用户使用习惯好'],
    weaknesses: [
      '内部管理功能相对简单',
      '复杂工作流支持不足',
      '数据报表和BI能力弱',
      '定制化开发能力有限',
    ],
    differentiationScript:
      '企业微信在连接客户和微信生态方面确实做得很好。我们的产品定位是深度业务管理平台：第一，我们支持复杂的审批流和业务流程配置，可承载企业核心业务场景；第二，内置强大的BI报表引擎，支持自定义多维度分析和实时看板；第三，低代码平台让企业可以快速搭建业务应用，无需排队等待开发资源；第四，支持双向集成企业微信，既保持客户连接能力，又获得专业的内部管理能力。',
    keyTalkingPoints: [
      '复杂业务流程引擎',
      '内置BI报表分析',
      '低代码快速搭建应用',
      '双向集成企业微信',
    ],
  },
  {
    id: 'comp-009',
    name: '飞书',
    aliases: ['飞书', 'feishu', 'lark', '字节飞书'],
    category: '协同办公平台',
    strengths: ['协作体验好', '文档功能强大', 'OKR理念先进'],
    weaknesses: [
      '企业级安全合规体系待完善',
      '行业垂直解决方案较少',
      '本地化部署选项有限',
      '传统企业学习成本较高',
    ],
    differentiationScript:
      '飞书的协作体验确实很出色，适合互联网公司。但对于传统行业的中大型企业，我们的方案更贴合：第一，我们提供完整的私有化部署选项，满足金融、医疗、政府等强监管行业的合规要求；第二，我们深耕垂直行业，提供金融、制造、能源、医疗等10+行业的专属解决方案；第三，我们的学习路径更平缓，支持渐进式功能上线，员工上手速度提升60%；第四，提供驻场实施服务，确保项目落地成功。',
    keyTalkingPoints: [
      '完整私有化部署',
      '10+垂直行业方案',
      '渐进式上线，平缓过渡',
      '驻场实施保障落地',
    ],
  },
  {
    id: 'comp-010',
    name: '帆软',
    aliases: ['帆软', 'fanruan', 'finebi', 'finereport'],
    category: 'BI/数据分析平台',
    strengths: ['报表功能强大', '国内市场份额高', '生态完善'],
    weaknesses: [
      '大数据量处理性能瓶颈',
      'AI智能分析能力弱',
      '非技术用户上手难度大',
      'License模式费用高',
    ],
    differentiationScript:
      '帆软在传统报表领域确实做得很扎实。但我们的BI平台主打智能化和易用性：第一，采用列式存储+分布式计算架构，亿级数据查询响应<3秒，性能是传统BI的5-10倍；第二，内置AI数据分析助手，自然语言提问即可生成报表和洞察，业务人员也能自助分析；第三，拖拽式操作+智能图表推荐，学习周期缩短80%；第四，订阅制灵活付费，总体拥有成本降低50%。',
    keyTalkingPoints: [
      '亿级数据3秒响应',
      'AI自然语言分析',
      '拖拽式操作，零门槛',
      '订阅制灵活付费',
    ],
  },
];

export function detectCompetitors(userMessage: string): CompetitorMatchResult[] {
  if (!userMessage || userMessage.trim() === '') {
    return [];
  }

  const messageLower = userMessage.toLowerCase();
  const results: CompetitorMatchResult[] = [];

  for (const competitor of COMPETITOR_DATABASE) {
    const matchedKeywords: string[] = [];

    for (const alias of competitor.aliases) {
      const aliasLower = alias.toLowerCase();
      if (messageLower.includes(aliasLower)) {
        matchedKeywords.push(alias);
      }
    }

    if (matchedKeywords.length > 0) {
      const uniqueMatches = [...new Set(matchedKeywords)];
      results.push({
        competitor,
        matchedKeywords: uniqueMatches,
        matchCount: uniqueMatches.length,
        response: buildCompetitorResponse(competitor),
      });
    }
  }

  results.sort((a, b) => b.matchCount - a.matchCount);

  return results;
}

function buildCompetitorResponse(competitor: Competitor): CompetitorResponse {
  const acknowledge = `您提到的${competitor.name}确实是${competitor.category}领域有影响力的厂商，我们理解您的对比考量。`;

  const differentiation = competitor.differentiationScript;

  const talkingPointsStr = competitor.keyTalkingPoints.slice(0, 3).join('；');
  const callToAction = `核心来说，我们的优势可以总结为：${talkingPointsStr}。我可以为您详细展示一下具体的对比案例和客户证言，您看方便吗？`;

  const fullScript = `${acknowledge}\n\n${differentiation}\n\n${callToAction}`;

  return {
    acknowledge,
    differentiation,
    callToAction,
    fullScript,
  };
}

export function getCompetitorById(id: string): Competitor | undefined {
  return COMPETITOR_DATABASE.find(c => c.id === id);
}

export function getCompetitorByName(name: string): Competitor | undefined {
  const nameLower = name.toLowerCase();
  return COMPETITOR_DATABASE.find(c =>
    c.name.toLowerCase() === nameLower ||
    c.aliases.some(a => a.toLowerCase() === nameLower)
  );
}

export function analyzeCompetitorSentiment(
  userMessage: string,
  competitorName: string
): 'positive' | 'negative' | 'neutral' {
  const messageLower = userMessage.toLowerCase();
  const compLower = competitorName.toLowerCase();

  if (!messageLower.includes(compLower)) return 'neutral';

  const positiveWords = [
    '好', '不错', '优秀', '满意', '喜欢', '推荐', '好用', '稳定',
    '出色', '赞赏', '认可', '信任', '强大', '专业', '优势',
  ];

  const negativeWords = [
    '差', '不好', '糟糕', '不满意', '坑', '慢', '卡', '崩溃',
    '问题', 'bug', '故障', '投诉', '后悔', '贵', '难用', '复杂',
    '服务差', '不响应', '推诿', '扯皮',
  ];

  const messageForAnalysis = messageLower;

  let positiveScore = 0;
  let negativeScore = 0;

  for (const word of positiveWords) {
    if (messageForAnalysis.includes(word)) positiveScore++;
  }

  for (const word of negativeWords) {
    if (messageForAnalysis.includes(word)) negativeScore++;
  }

  if (negativeScore > positiveScore) return 'negative';
  if (positiveScore > negativeScore) return 'positive';
  return 'neutral';
}
