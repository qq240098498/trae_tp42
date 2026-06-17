export interface Product {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  priceFrom: number;
  priceTo: number;
  targetIndustries: string[];
  targetScenarios: string[];
  coreFeatures: string[];
}

export const products: Product[] = [
  {
    id: 'crm',
    name: '客户关系管理系统 CRM',
    description: '全渠道客户生命周期管理平台，助力企业高效获客、精细运营、智能转化，提升销售团队业绩30%以上。',
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20CRM%20dashboard%20interface%20with%20customer%20data%20charts%20and%20pipeline%20visualization&image_size=landscape_16_9',
    priceFrom: 3980,
    priceTo: 29800,
    targetIndustries: ['finance', 'retail', 'tech', 'manufacturing', 'realestate'],
    targetScenarios: ['销售漏斗管理', '客户画像分析', '商机跟进', '销售报表', '团队协同'],
    coreFeatures: [
      '360度客户画像',
      '智能销售漏斗',
      '自动化商机跟进',
      'AI客户评分',
      '多维度销售报表',
      '移动端随时办公',
    ],
  },
  {
    id: 'analytics',
    name: '数据分析平台',
    description: '一站式企业级BI与大数据分析平台，零代码拖拽建模，秒级响应亿级数据，让业务决策有据可依。',
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=business%20intelligence%20data%20analytics%20dashboard%20with%20colorful%20charts%20graphs%20and%20KPIs&image_size=landscape_16_9',
    priceFrom: 5980,
    priceTo: 59800,
    targetIndustries: ['finance', 'retail', 'tech', 'logistics', 'healthcare'],
    targetScenarios: ['经营看板', '用户行为分析', '财务分析', '供应链分析', '营销效果分析'],
    coreFeatures: [
      '多数据源接入',
      '拖拽式可视化建模',
      'AI智能归因分析',
      '实时数据大屏',
      '定时邮件推送报表',
      '权限分级管理',
    ],
  },
  {
    id: 'ai-agent',
    name: '智能客服机器人',
    description: '基于大语言模型的全渠道智能客服，7x24小时在线，准确率95%+，降低客服成本60%，提升客户满意度。',
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=AI%20chatbot%20customer%20service%20interface%20with%20conversation%20bubbles%20and%20robot%20avatar&image_size=landscape_16_9',
    priceFrom: 2980,
    priceTo: 39800,
    targetIndustries: ['retail', 'finance', 'education', 'telecom', 'healthcare'],
    targetScenarios: ['售前咨询', '售后服务', '订单查询', 'FAQ问答', '投诉处理'],
    coreFeatures: [
      '大模型知识库训练',
      '多轮对话理解',
      '人机无缝切换',
      '全渠道接入（官网/APP/微信/电话）',
      '智能质检评分',
      '会话数据分析',
    ],
  },
  {
    id: 'marketing',
    name: '营销自动化平台',
    description: '全渠道营销触达与自动化运营平台，从获客到转化全链路追踪，让每一分营销投入都可量化可优化。',
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=marketing%20automation%20software%20dashboard%20with%20email%20campaigns%20funnels%20and%20audience%20segments&image_size=landscape_16_9',
    priceFrom: 4980,
    priceTo: 49800,
    targetIndustries: ['retail', 'education', 'finance', 'tech', 'media'],
    targetScenarios: ['邮件营销', '社群运营', '活动推广', '线索孵化', 'A/B测试'],
    coreFeatures: [
      '可视化营销旅程编排',
      '人群标签精准分群',
      '全渠道内容分发',
      '营销ROI归因分析',
      'A/B测试优化',
      '线索自动打分分配',
    ],
  },
  {
    id: 'collaboration',
    name: '企业协同办公系统',
    description: '一体化企业协同与数字化办公平台，整合即时沟通、文档协作、审批流程、项目管理，让组织效率倍增。',
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=enterprise%20collaboration%20software%20workspace%20with%20team%20chat%20documents%20and%20task%20boards&image_size=landscape_16_9',
    priceFrom: 1980,
    priceTo: 19800,
    targetIndustries: ['tech', 'manufacturing', 'education', 'retail', 'finance'],
    targetScenarios: ['团队沟通', '文档协作', '审批流程', '项目管理', 'OKR追踪'],
    coreFeatures: [
      '组织架构通讯录',
      '音视频会议',
      '多人在线协作文档',
      '自定义审批流',
      '项目看板与甘特图',
      'OKR目标管理',
    ],
  },
  {
    id: 'supplychain',
    name: '供应链管理系统',
    description: '从采购到仓储到配送的全链路数字化供应链平台，智能预测需求，优化库存，降低供应链成本15%以上。',
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=supply%20chain%20management%20dashboard%20with%20logistics%20warehouse%20inventory%20and%20trucking%20visualization&image_size=landscape_16_9',
    priceFrom: 8980,
    priceTo: 89800,
    targetIndustries: ['manufacturing', 'retail', 'logistics', 'automotive', 'energy'],
    targetScenarios: ['采购管理', '库存优化', '物流追踪', '供应商管理', '需求预测'],
    coreFeatures: [
      'AI需求预测',
      '智能库存补货建议',
      '供应商全生命周期管理',
      '实时物流追踪',
      '采购电子招投标',
      '供应链金融对接',
    ],
  },
];
