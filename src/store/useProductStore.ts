import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Product, ProductFeature, Competitor, DiffPoint } from '../types';

const STORAGE_KEY = 'product-store';

const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

const now = () => new Date().toISOString();

const createMockProducts = (): Product[] => {
  const featuresMap: Record<string, ProductFeature[]> = {
    crm: [
      { name: '360度客户画像', description: '整合客户全渠道信息，构建完整客户视图', icon: 'UserCircle2' },
      { name: '智能销售漏斗', description: '可视化商机阶段管理，自动提醒跟进', icon: 'GitBranch' },
      { name: '自动化商机跟进', description: 'AI驱动的跟进提醒，智能推荐最佳行动', icon: 'Bot' },
      { name: 'AI客户评分', description: '多维度模型自动打分，优先级智能排序', icon: 'Star' },
      { name: '多维度销售报表', description: '实时经营看板，支持自定义分析维度', icon: 'BarChart3' },
      { name: '移动端随时办公', description: 'APP/小程序同步，随时随地处理工作', icon: 'Smartphone' },
    ],
    analytics: [
      { name: '多数据源接入', description: '打通ERP/CRM/电商等200+数据源', icon: 'Database' },
      { name: '拖拽式可视化建模', description: '零代码建模，业务人员自助分析', icon: 'LayoutGrid' },
      { name: 'AI智能归因分析', description: '自动发现数据异常，定位增长机会', icon: 'Sparkles' },
      { name: '实时数据大屏', description: '秒级刷新的经营决策看板', icon: 'Monitor' },
      { name: '定时邮件推送报表', description: '自定义报表订阅，自动发送到邮箱', icon: 'Mail' },
      { name: '权限分级管理', description: '行列级数据权限，安全合规', icon: 'ShieldCheck' },
    ],
    'ai-agent': [
      { name: '大模型知识库训练', description: '基于业务文档一键训练专属AI', icon: 'BookOpen' },
      { name: '多轮对话理解', description: '上下文记忆，复杂场景流畅沟通', icon: 'MessageSquare' },
      { name: '人机无缝切换', description: 'AI无法解决自动转人工，体验连贯', icon: 'Users' },
      { name: '全渠道接入', description: '官网/APP/微信/电话统一接入', icon: 'Globe' },
      { name: '智能质检评分', description: '会话自动质检，服务质量可视化', icon: 'ClipboardCheck' },
      { name: '会话数据分析', description: '热门问题、转化漏斗全面洞察', icon: 'PieChart' },
    ],
    marketing: [
      { name: '可视化营销旅程编排', description: '拖拽式配置，自动化触达全流程', icon: 'Workflow' },
      { name: '人群标签精准分群', description: '300+标签体系，RFM模型分层运营', icon: 'Tags' },
      { name: '全渠道内容分发', description: '短信/微信/邮件/APP Push一键触达', icon: 'Send' },
      { name: '营销ROI归因分析', description: '多触点归因，每一分投入清晰可见', icon: 'TrendingUp' },
      { name: 'A/B测试优化', description: '内容/人群/时机全面测试，数据驱动', icon: 'FlaskConical' },
      { name: '线索自动打分分配', description: '智能评分路由，高效分配销售资源', icon: 'Target' },
    ],
    collaboration: [
      { name: '组织架构通讯录', description: '多层级组织架构，找人更高效', icon: 'Building2' },
      { name: '音视频会议', description: '高清稳定会议，支持万人同时在线', icon: 'Video' },
      { name: '多人在线协作文档', description: '实时多人编辑，版本自动保存', icon: 'FileText' },
      { name: '自定义审批流', description: '灵活配置审批流程，适配各类场景', icon: 'CheckSquare' },
      { name: '项目看板与甘特图', description: '项目进度可视化，任务高效协同', icon: 'Kanban' },
      { name: 'OKR目标管理', description: '目标对齐，进度透明，结果量化', icon: 'Bullseye' },
    ],
    supplychain: [
      { name: 'AI需求预测', description: '基于历史数据智能预测，减少缺货积压', icon: 'Brain' },
      { name: '智能库存补货建议', description: '安全库存自动计算，补货建议生成', icon: 'Package' },
      { name: '供应商全生命周期管理', description: '从准入到考核，供应商数字化管理', icon: 'Handshake' },
      { name: '实时物流追踪', description: '在途货物实时定位，异常自动预警', icon: 'Truck' },
      { name: '采购电子招投标', description: '线上招投标全流程，公开透明', icon: 'FileSpreadsheet' },
      { name: '供应链金融对接', description: '数据增信，对接金融机构融资服务', icon: 'Landmark' },
    ],
  };

  return [
    {
      id: 'crm',
      name: '客户关系管理系统 CRM',
      description: '全渠道客户生命周期管理平台，助力企业高效获客、精细运营、智能转化，提升销售团队业绩30%以上。',
      imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20CRM%20dashboard%20interface%20with%20customer%20data%20charts%20and%20pipeline%20visualization&image_size=landscape_16_9',
      priceFrom: 3980,
      priceTo: 29800,
      targetIndustries: ['finance', 'retail', 'tech', 'manufacturing', 'realestate'],
      targetScenarios: ['销售漏斗管理', '客户画像分析', '商机跟进', '销售报表', '团队协同'],
      coreFeatures: featuresMap.crm,
      createdAt: now(),
      updatedAt: now(),
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
      coreFeatures: featuresMap.analytics,
      createdAt: now(),
      updatedAt: now(),
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
      coreFeatures: featuresMap['ai-agent'],
      createdAt: now(),
      updatedAt: now(),
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
      coreFeatures: featuresMap.marketing,
      createdAt: now(),
      updatedAt: now(),
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
      coreFeatures: featuresMap.collaboration,
      createdAt: now(),
      updatedAt: now(),
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
      coreFeatures: featuresMap.supplychain,
      createdAt: now(),
      updatedAt: now(),
    },
  ];
};

const createMockCompetitors = (): Competitor[] => {
  return [
    {
      id: 'salesforce',
      name: 'Salesforce',
      logoUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Salesforce%20company%20logo%20blue%20cloud%20design%20on%20white%20background%20minimal&image_size=square',
      keywords: ['salesforce', 'SF', '赛富时', '海外CRM'],
      positioning: '全球领先的CRM云服务巨头，国际化程度高，功能大而全',
      diffPoints: [
        {
          dimension: '本地化体验',
          ourAdvantage: '深度适配国内企业使用习惯，全中文界面，微信/钉钉集成开箱即用',
          competitorWeakness: '界面和操作逻辑偏欧美风格，中文本地化不彻底，国内社交生态集成弱',
          script: 'Salesforce是国际大牌没错，但很多客户反馈它的操作习惯和界面不太符合国内团队，比如审批流、微信集成这些我们日常高频使用的功能，Salesforce都需要额外定制开发，成本很高。而我们的系统从第一天就是为中国企业设计的，微信、钉钉、企业微信全部直接打通，销售团队上手零门槛。',
        },
        {
          dimension: '实施成本',
          ourAdvantage: '标准化实施2-4周上线，实施费用仅为软件费用的30%以内',
          competitorWeakness: '实施周期长达3-6个月，实施咨询费通常等于甚至超过软件本身费用',
          script: '很多选型Salesforce的客户最后都栽在实施上，动辄半年的实施周期，还要花大价钱请第三方顾问，算下来总拥有成本是我们的3-5倍。我们有大量同行业客户的最佳实践，标准实施两周就能上线，边用边优化，ROI见效快得多。',
        },
        {
          dimension: '数据合规',
          ourAdvantage: '数据全量存储在国内节点，符合《数据安全法》《个人信息保护法》等国内法规',
          competitorWeakness: '数据默认存储海外服务器，数据跨境合规风险高，国内访问速度不稳定',
          script: '这点特别重要，现在国家对数据合规要求越来越严，尤其是金融、医疗这些行业。Salesforce服务器在海外，数据跨境传输本身就有合规风险，而且国内访问经常卡顿。我们的数据中心都在国内，完全满足等保三级和各种行业合规要求，访问速度也有保障。',
        },
      ],
      createdAt: now(),
      updatedAt: now(),
    },
    {
      id: 'hubspot',
      name: 'HubSpot',
      logoUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=HubSpot%20company%20logo%20orange%20sprocket%20design%20on%20white%20background%20minimal&image_size=square',
      keywords: ['hubspot', 'HubSpot', '集客营销', ' inbound'],
      positioning: '集客营销理念鼻祖，营销自动化一体化平台，适合中小外贸企业',
      diffPoints: [
        {
          dimension: '国内营销生态',
          ourAdvantage: '原生支持微信公众号、视频号、小红书、抖音等国内主流平台的全链路运营',
          competitorWeakness: '主要支持海外渠道（LinkedIn/Facebook/Google），国内社媒几乎无集成',
          script: 'HubSpot做海外营销确实很强，但如果您主要做国内市场就很尴尬了——微信公众号、视频号、小红书这些核心渠道它一个都接不了，等于您的主战场它完全覆盖不到。我们的平台是全渠道打通的，从抖音投流到小红书种草再到微信私域转化，全链路数据都能追踪。',
        },
        {
          dimension: '价格体系',
          ourAdvantage: '按功能模块订阅，无隐藏费用，中小企业可从基础版起步平滑升级',
          competitorWeakness: '免费版功能极度受限，营销和销售模块分开计费，增购成本高',
          script: 'HubSpot的定价看起来起步低，但是真正用起来您会发现各种功能都要单独加钱，营销套件和销售套件分开买，联系人数量还要收费，最后账单很容易就超预算。我们是全功能一体化打包，同价位我们的功能覆盖面至少是它的2倍，而且没有隐藏费用。',
        },
        {
          dimension: '客户支持',
          ourAdvantage: '本地专属客户成功经理，工作日2小时响应，支持电话/微信/远程多渠道服务',
          competitorWeakness: '国内无本土团队，客户支持主要靠邮件和英文知识库，响应慢',
          script: '这也是很多客户放弃HubSpot的原因——出了问题找不到人，只能发邮件等海外团队回复，时差加上语言障碍，一个小问题可能拖好几天。我们在国内有专业的客户成功团队，专属经理一对一服务，工作日两小时内必须响应，这点对于系统稳定运行太重要了。',
        },
      ],
      createdAt: now(),
      updatedAt: now(),
    },
    {
      id: 'dingtalk',
      name: '钉钉',
      logoUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=DingTalk%20company%20logo%20blue%20bird%20design%20on%20white%20background%20minimal&image_size=square',
      keywords: ['钉钉', '阿里钉钉', 'dingtalk'],
      positioning: '阿里旗下企业协同办公平台，强在IM沟通和考勤审批，用户基数大',
      diffPoints: [
        {
          dimension: '业务深度',
          ourAdvantage: '垂直深耕销售/营销/客服等业务场景，提供从获客到转化的全链路专业能力',
          competitorWeakness: '定位通用协同工具，业务模块功能浅，销售/营销等专业场景能力不足',
          script: '钉钉做沟通考勤确实方便，但如果您是想提升销售业绩、做精细化客户运营，钉钉就不够用了。它的CRM、营销模块都是轻量功能，没法满足复杂的销售漏斗管理、客户分层运营、营销ROI分析这些专业需求。我们是专注做业务增长的，每个场景的功能深度都不是通用工具能比的。',
        },
        {
          dimension: '系统开放性',
          ourAdvantage: '标准Open API支持与各类业务系统深度打通，支持定制化开发',
          competitorWeakness: '生态封闭，对外接口有限，深度集成阿里系产品以外的系统难度大',
          script: '很多客户用了钉钉之后发现想对接自己的ERP、电商系统特别麻烦，钉钉的接口开放度有限，而且很多功能和阿里云、淘宝系产品绑定。我们的系统是完全开放的，标准API有200多个，您现在和未来的业务系统都能无缝对接，不会被绑定在某一家生态里。',
        },
        {
          dimension: '数据分析',
          ourAdvantage: '内置专业BI分析引擎，支持自定义报表、多维度钻取、AI智能归因',
          competitorWeakness: '数据分析能力薄弱，报表模板固定，无法满足复杂业务分析需求',
          script: '这是钉钉用户吐槽最多的点之一——数据只能看个大概，想做个自定义报表特别难，更别说多维度交叉分析和归因了。我们的系统自带专业BI，您想怎么分析就怎么分析，销售、营销、客服数据全部打通，老板要的经营数据随时能出。',
        },
      ],
      createdAt: now(),
      updatedAt: now(),
    },
    {
      id: 'feishu',
      name: '飞书',
      logoUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Feishu%20Lark%20company%20logo%20colorful%20design%20on%20white%20background%20minimal&image_size=square',
      keywords: ['飞书', 'Lark', '字节飞书', '飞书文档'],
      positioning: '字节跳动出品，强在文档协作和OKR管理，互联网企业认可度高',
      diffPoints: [
        {
          dimension: '行业适配',
          ourAdvantage: '覆盖制造、零售、金融、医疗等10+行业深度解决方案，内置行业模板',
          competitorWeakness: '产品基因偏互联网，对传统行业适配不足，缺少垂直行业最佳实践',
          script: '飞书在互联网公司确实很火，但如果您是制造、零售、医疗这些传统行业，会发现很多功能水土不服。比如制造业需要的供应商管理、批次追溯，零售业的会员运营、门店管理，飞书都没有现成的方案。我们服务了上千家各行业的客户，每个行业都有成熟的模板和最佳实践，拿来就能用。',
        },
        {
          dimension: '销售管理',
          ourAdvantage: '完整的销售管理闭环，从线索分配、商机跟进、合同签约到回款全流程管控',
          competitorWeakness: '销售模块起步晚，功能薄弱，无法支撑复杂销售团队管理',
          script: '飞书的核心是文档和OKR，销售管理这块其实是后来才加上的，功能很浅。比如复杂的销售流程审批、按区域/行业的 territories 分配、销售提成自动计算这些核心需求，飞书都做不了。我们的销售管理模块是经过上千家销售团队验证过的，从CEO到销售代表的每一层需求都覆盖到了。',
        },
        {
          dimension: '性价比',
          ourAdvantage: '企业版价格亲民，按实际使用人数计费，无账号数量阶梯限制',
          competitorWeakness: '专业版和旗舰版定价高，人数阶梯计费导致中小企业成本压力大',
          script: '飞书这两年涨价挺厉害的，专业版按人数阶梯计费，团队越大单价越高，很多客户反馈一年下来成本涨了不少。我们的定价更实在，企业版一个账号每天不到一杯咖啡钱，而且没有阶梯限制，团队扩张也不用担心成本失控。',
        },
      ],
      createdAt: now(),
      updatedAt: now(),
    },
    {
      id: 'yonyou',
      name: '用友',
      logoUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Yonyou%20company%20logo%20blue%20green%20design%20on%20white%20background%20minimal&image_size=square',
      keywords: ['用友', 'yonyou', '用友CRM', '用友云'],
      positioning: '国内老牌ERP和企业服务厂商，财务管理能力强，客户资源积累深厚',
      diffPoints: [
        {
          dimension: '产品体验',
          ourAdvantage: '新一代SaaS产品，界面简洁现代，移动体验优秀，用户学习成本低',
          competitorWeakness: '产品基于传统架构改造，界面老旧，操作复杂，移动端体验差',
          script: '用友做财务ERP确实专业，但您如果用过它的CRM就知道，体验还是十年前的水平，界面复杂到新员工培训都要一周，移动端更是惨不忍睹。我们的产品是完全云原生的新一代SaaS，界面清爽，操作像用APP一样简单，销售自己就能上手，根本不用花大量时间培训。',
        },
        {
          dimension: '迭代速度',
          ourAdvantage: 'SaaS敏捷迭代，每两周一更新，客户需求快速响应上线',
          competitorWeakness: '传统软件迭代慢，半年甚至一年才发一个大版本，需求响应周期长',
          script: '传统软件公司的通病就是迭代慢，您提个需求可能等半年都不一定能排上。我们是纯SaaS模式，两周一个小版本，客户提的合理需求最快一个版本就能上线，产品是和客户一起成长的，不是一锤子买卖。',
        },
        {
          dimension: '部署灵活度',
          ourAdvantage: '支持公有云、混合云、私有云多种部署方式，按需灵活选择',
          competitorWeakness: '强推私有部署，公有云产品成熟度不足，升级维护成本高',
          script: '用友更多是卖私有部署的传统模式，一套下来光服务器和运维成本就不低，升级还要专门找团队。我们支持多种部署方式，大部分客户选择公有云省心省力，如果有合规需求也可以私有部署，选择权在您手里，不会被绑架。',
        },
      ],
      createdAt: now(),
      updatedAt: now(),
    },
  ];
};

export interface ProductStoreState {
  products: Product[];
  competitors: Competitor[];
  selectedProductId: string | null;
  selectedCompetitorId: string | null;
  isInitialized: boolean;
}

export interface ProductStoreActions {
  initMockData: () => void;
  setSelectedProduct: (productId: string | null) => void;
  setSelectedCompetitor: (competitorId: string | null) => void;
  getSelectedProduct: () => Product | null;
  getSelectedCompetitor: () => Competitor | null;
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Product;
  updateProduct: (productId: string, updates: Partial<Product>) => void;
  deleteProduct: (productId: string) => void;
  addProductFeature: (productId: string, feature: ProductFeature) => void;
  updateProductFeature: (productId: string, featureIndex: number, updates: Partial<ProductFeature>) => void;
  deleteProductFeature: (productId: string, featureIndex: number) => void;
  searchProducts: (keyword: string, industryId?: string, scenario?: string) => Product[];
  addCompetitor: (competitor: Omit<Competitor, 'id' | 'createdAt' | 'updatedAt'>) => Competitor;
  updateCompetitor: (competitorId: string, updates: Partial<Competitor>) => void;
  deleteCompetitor: (competitorId: string) => void;
  addDiffPoint: (competitorId: string, diffPoint: DiffPoint) => void;
  updateDiffPoint: (competitorId: string, pointIndex: number, updates: Partial<DiffPoint>) => void;
  deleteDiffPoint: (competitorId: string, pointIndex: number) => void;
  searchCompetitors: (keyword: string) => Competitor[];
  findCompetitorByKeyword: (text: string) => Competitor | null;
  clearAll: () => void;
}

export type ProductStore = ProductStoreState & ProductStoreActions;

export const useProductStore = create<ProductStore>()(
  persist(
    (set, get) => ({
      products: [],
      competitors: [],
      selectedProductId: null,
      selectedCompetitorId: null,
      isInitialized: false,

      initMockData: () => {
        if (get().isInitialized && get().products.length > 0) return;
        set({
          products: createMockProducts(),
          competitors: createMockCompetitors(),
          isInitialized: true,
        });
      },

      setSelectedProduct: (productId) => set({ selectedProductId: productId }),

      setSelectedCompetitor: (competitorId) => set({ selectedCompetitorId: competitorId }),

      getSelectedProduct: () => {
        const { products, selectedProductId } = get();
        return products.find((p) => p.id === selectedProductId) || null;
      },

      getSelectedCompetitor: () => {
        const { competitors, selectedCompetitorId } = get();
        return competitors.find((c) => c.id === selectedCompetitorId) || null;
      },

      addProduct: (productData) => {
        const newProduct: Product = {
          ...productData,
          id: generateId(),
          createdAt: now(),
          updatedAt: now(),
        };
        set((state) => ({
          products: [...state.products, newProduct],
        }));
        return newProduct;
      },

      updateProduct: (productId, updates) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === productId ? { ...p, ...updates, updatedAt: now() } : p
          ),
        }));
      },

      deleteProduct: (productId) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== productId),
          selectedProductId: state.selectedProductId === productId ? null : state.selectedProductId,
        }));
      },

      addProductFeature: (productId, feature) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === productId
              ? { ...p, coreFeatures: [...p.coreFeatures, feature], updatedAt: now() }
              : p
          ),
        }));
      },

      updateProductFeature: (productId, featureIndex, updates) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === productId
              ? {
                  ...p,
                  coreFeatures: p.coreFeatures.map((f, i) =>
                    i === featureIndex ? { ...f, ...updates } : f
                  ),
                  updatedAt: now(),
                }
              : p
          ),
        }));
      },

      deleteProductFeature: (productId, featureIndex) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === productId
              ? {
                  ...p,
                  coreFeatures: p.coreFeatures.filter((_, i) => i !== featureIndex),
                  updatedAt: now(),
                }
              : p
          ),
        }));
      },

      searchProducts: (keyword, industryId, scenario) => {
        const { products } = get();
        return products.filter((p) => {
          if (keyword) {
            const kw = keyword.toLowerCase();
            const matchText = [p.name, p.description, ...p.targetScenarios].join(' ').toLowerCase();
            if (!matchText.includes(kw)) return false;
          }
          if (industryId && !p.targetIndustries.includes(industryId)) return false;
          if (scenario && !p.targetScenarios.includes(scenario)) return false;
          return true;
        });
      },

      addCompetitor: (competitorData) => {
        const newCompetitor: Competitor = {
          ...competitorData,
          id: generateId(),
          createdAt: now(),
          updatedAt: now(),
        };
        set((state) => ({
          competitors: [...state.competitors, newCompetitor],
        }));
        return newCompetitor;
      },

      updateCompetitor: (competitorId, updates) => {
        set((state) => ({
          competitors: state.competitors.map((c) =>
            c.id === competitorId ? { ...c, ...updates, updatedAt: now() } : c
          ),
        }));
      },

      deleteCompetitor: (competitorId) => {
        set((state) => ({
          competitors: state.competitors.filter((c) => c.id !== competitorId),
          selectedCompetitorId: state.selectedCompetitorId === competitorId ? null : state.selectedCompetitorId,
        }));
      },

      addDiffPoint: (competitorId, diffPoint) => {
        set((state) => ({
          competitors: state.competitors.map((c) =>
            c.id === competitorId
              ? { ...c, diffPoints: [...c.diffPoints, diffPoint], updatedAt: now() }
              : c
          ),
        }));
      },

      updateDiffPoint: (competitorId, pointIndex, updates) => {
        set((state) => ({
          competitors: state.competitors.map((c) =>
            c.id === competitorId
              ? {
                  ...c,
                  diffPoints: c.diffPoints.map((d, i) =>
                    i === pointIndex ? { ...d, ...updates } : d
                  ),
                  updatedAt: now(),
                }
              : c
          ),
        }));
      },

      deleteDiffPoint: (competitorId, pointIndex) => {
        set((state) => ({
          competitors: state.competitors.map((c) =>
            c.id === competitorId
              ? {
                  ...c,
                  diffPoints: c.diffPoints.filter((_, i) => i !== pointIndex),
                  updatedAt: now(),
                }
              : c
          ),
        }));
      },

      searchCompetitors: (keyword) => {
        const { competitors } = get();
        if (!keyword) return competitors;
        const kw = keyword.toLowerCase();
        return competitors.filter((c) => {
          const allText = [c.name, c.positioning, ...c.keywords].join(' ').toLowerCase();
          return allText.includes(kw);
        });
      },

      findCompetitorByKeyword: (text) => {
        const { competitors } = get();
        const lowerText = text.toLowerCase();
        return (
          competitors.find((c) =>
            c.keywords.some((kw) => lowerText.includes(kw.toLowerCase()))
          ) || null
        );
      },

      clearAll: () => {
        set({
          products: [],
          competitors: [],
          selectedProductId: null,
          selectedCompetitorId: null,
          isInitialized: false,
        });
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        products: state.products,
        competitors: state.competitors,
        isInitialized: state.isInitialized,
      }),
    }
  )
);

export default useProductStore;
