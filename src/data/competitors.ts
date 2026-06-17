export interface ComparisonMetric {
  label: string;
  ourValue: string;
  competitorValue: string;
  ourScore: number;
  competitorScore: number;
  evidence?: string;
}

export interface DimensionComparison {
  dimension: '功能覆盖' | '性能指标' | '价格区间' | '服务保障';
  title: string;
  summary: string;
  metrics: ComparisonMetric[];
  advantageScript: string;
  neutralScript: string;
}

export interface DiffPoint {
  dimension: string;
  ourAdvantage: string;
  competitorWeakness: string;
  script: string;
}

export interface Competitor {
  id: string;
  name: string;
  logoUrl: string;
  keywords: string[];
  positioning: string;
  category: string;
  targetCustomer: string;
  diffPoints: DiffPoint[];
  comparisonMatrix: DimensionComparison[];
  customerReferences?: {
    industry: string;
    count: string;
    description: string;
  }[];
}

export const competitors: Competitor[] = [
  {
    id: 'salesforce',
    name: 'Salesforce',
    logoUrl: '',
    keywords: ['salesforce', 'SF', '赛富时', '海外CRM', 'SFDC'],
    positioning: '全球领先的CRM云服务巨头，国际化程度高，功能大而全',
    category: 'CRM/SaaS平台',
    targetCustomer: '大型跨国企业、外贸企业',
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
    comparisonMatrix: [
      {
        dimension: '功能覆盖',
        title: '功能覆盖对比',
        summary: 'Salesforce功能全面但偏重国际市场，我方在本土业务场景覆盖更全面',
        metrics: [
          { label: '销售流程管理', ourValue: '支持全流程自定义，含中国特色审批流', competitorValue: '标准销售流程，审批流需额外定制', ourScore: 95, competitorScore: 80, evidence: '500+客户验证的本土化流程模板' },
          { label: '国内社交生态集成', ourValue: '微信/企业微信/钉钉原生集成', competitorValue: '支持LinkedIn/Facebook，国内渠道需定制', ourScore: 98, competitorScore: 45, evidence: '开箱即用，无需额外开发费用' },
          { label: '营销自动化', ourValue: '支持短信/微信/邮件/抖音全渠道', competitorValue: '邮件为主，国内渠道支持有限', ourScore: 92, competitorScore: 65, evidence: '覆盖国内主流营销渠道95%以上' },
          { label: '数据分析能力', ourValue: '内置BI，支持中文自然语言查询', competitorValue: '强大的报表引擎，英文为主', ourScore: 88, competitorScore: 90, evidence: 'AI智能分析，业务人员零门槛使用' },
        ],
        advantageScript: '在功能覆盖方面，我们针对中国企业的实际使用场景做了深度优化，尤其是国内社交生态的原生集成，这是Salesforce无法比拟的优势。您的团队日常使用微信、钉钉沟通客户，我们的系统可以直接同步这些渠道的客户互动数据，销售不需要在多个系统之间切换，工作效率至少提升40%。',
        neutralScript: 'Salesforce作为国际品牌，功能确实非常全面，尤其是在国际化业务场景方面有深厚积累。我们的产品则更聚焦于国内企业的核心使用场景，在本土生态集成和业务流程适配方面做得更细致。',
      },
      {
        dimension: '性能指标',
        title: '性能指标对比',
        summary: '国内访问性能我方有明显优势，国际场景各有千秋',
        metrics: [
          { label: '国内访问延迟', ourValue: '< 50ms', competitorValue: '150-300ms', ourScore: 98, competitorScore: 55, evidence: '国内5大核心节点，BGP多线接入' },
          { label: '系统可用性', ourValue: '99.99% SLA保障', competitorValue: '99.9% SLA保障', ourScore: 95, competitorScore: 90, evidence: '全年宕机时间不超过52分钟' },
          { label: '并发用户支持', ourValue: '单租户支持10000+并发', competitorValue: '单租户支持5000+并发', ourScore: 92, competitorScore: 85, evidence: '已服务多家万人级企业客户' },
          { label: '数据处理速度', ourValue: '亿级数据查询<3秒', competitorValue: '亿级数据查询5-8秒', ourScore: 90, competitorScore: 75, evidence: '分布式计算架构，列式存储优化' },
        ],
        advantageScript: '在性能方面，由于我们的数据中心全部部署在国内，访问速度和稳定性有天然优势。根据第三方测试数据，国内用户访问我们系统的响应速度比Salesforce快3-6倍，这对于销售团队高频操作的场景体验差异非常明显。尤其是在月底季度末业务高峰期，我们的系统稳定性经过了上百家大型客户的实战检验。',
        neutralScript: '在国际访问场景下，Salesforce凭借全球节点布局确实有优势。但如果您的业务主要在国内，我们的本地化部署在访问速度、数据安全和合规性方面都更有保障。',
      },
      {
        dimension: '价格区间',
        title: '总拥有成本对比',
        summary: '我方总体拥有成本约为Salesforce的1/3-1/2',
        metrics: [
          { label: '基础版年费/账号', ourValue: '¥3,980起', competitorValue: '$1,200起 (约¥8,500)', ourScore: 95, competitorScore: 55, evidence: '同功能配置对比' },
          { label: '实施费用占比', ourValue: '软件费用的20-30%', competitorValue: '软件费用的100-200%', ourScore: 98, competitorScore: 40, evidence: '标准化实施，无需大量定制开发' },
          { label: '年维护费用', ourValue: '包含在订阅费中', competitorValue: '额外收取22%年费', ourScore: 100, competitorScore: 50, evidence: '无隐藏费用' },
          { label: '3年TCO（100用户）', ourValue: '约¥150-200万', competitorValue: '约¥450-600万', ourScore: 95, competitorScore: 45, evidence: '含软件、实施、培训、维护全成本' },
        ],
        advantageScript: '算一笔实在账，我们帮您把钱花在刀刃上。同样是100个用户的企业，使用Salesforce三年下来的总投入大约在450-600万，而选择我们只需要150-200万，节省下来的300多万您可以投入到业务增长中。更重要的是，我们的定价完全透明，没有隐藏费用，不会在项目中途以各种名义加价。',
        neutralScript: '如果您预算充足且有大量海外业务，Salesforce的全球能力确实值得投入。但对于以国内市场为主的企业，我们的方案在性价比方面有非常明显的优势，能把更多预算留给业务本身。',
      },
      {
        dimension: '服务保障',
        title: '服务保障对比',
        summary: '本土服务团队响应速度和问题解决效率有显著优势',
        metrics: [
          { label: '客户支持响应时间', ourValue: '工作日2小时内响应', competitorValue: '邮件支持，1-3个工作日', ourScore: 95, competitorScore: 50, evidence: '本地专属客户成功经理' },
          { label: '服务团队规模', ourValue: '国内500+专业服务人员', competitorValue: '国内团队有限，主要在海外', ourScore: 90, competitorScore: 55, evidence: '覆盖全国主要城市' },
          { label: '实施交付周期', ourValue: '2-4周标准上线', competitorValue: '3-6个月', ourScore: 95, competitorScore: 45, evidence: '最佳实践库+标准化方法论' },
          { label: '定制开发支持', ourValue: '低代码平台，业务可自助配置', competitorValue: '需Apex编码，学习成本高', ourScore: 88, competitorScore: 70, evidence: '平均定制效率提升3倍' },
        ],
        advantageScript: '服务是我们最有信心的部分。我们在国内有500多人的专业服务团队，每个客户都有专属的客户成功经理，工作日两小时内必须响应。很多客户从Salesforce转过来的第一感受就是"终于找到人解决问题了"。我们的实施周期也是行业最快的之一，标准产品2-4周就能上线，让您快速看到效果。',
        neutralScript: 'Salesforce在全球范围内有成熟的服务体系，但国内支持确实不是它的强项。如果您重视服务响应速度和本土化支持，我们会是更合适的选择。',
      },
    ],
    customerReferences: [
      { industry: '制造业', count: '200+', description: '离散制造、流程制造等细分行业' },
      { industry: '零售业', count: '150+', description: '连锁零售、品牌电商等场景' },
      { industry: '金融服务业', count: '80+', description: '银行、保险、证券等金融机构' },
    ],
  },
  {
    id: 'dingtalk',
    name: '钉钉',
    logoUrl: '',
    keywords: ['钉钉', '阿里钉钉', 'dingtalk'],
    positioning: '阿里旗下企业协同办公平台，强在IM沟通和考勤审批，用户基数大',
    category: '协同办公平台',
    targetCustomer: '中小企业、通用协同场景',
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
    comparisonMatrix: [
      {
        dimension: '功能覆盖',
        title: '业务功能深度对比',
        summary: '钉钉擅长通用协同，我方在业务场景专业度上领先',
        metrics: [
          { label: '销售管理深度', ourValue: '全流程CRM：线索→商机→合同→回款', competitorValue: '轻量客户跟进，缺少销售漏斗管理', ourScore: 95, competitorScore: 45, evidence: '支持复杂销售流程和多层级审批' },
          { label: '营销自动化能力', ourValue: '全渠道营销旅程编排，A/B测试', competitorValue: '基础群发功能，无自动化编排', ourScore: 90, competitorScore: 35, evidence: '可视化营销画布，拖拽式配置' },
          { label: '客户服务能力', ourValue: '智能客服+工单系统+知识库一体化', competitorValue: '基础群聊沟通，无专业客服模块', ourScore: 88, competitorScore: 30, evidence: 'AI机器人解决率95%+' },
          { label: '协同办公基础功能', ourValue: '即时沟通+审批+文档+会议', competitorValue: '行业领先的IM和考勤审批', ourScore: 85, competitorScore: 95, evidence: '钉钉在通用协同领域体验优秀' },
        ],
        advantageScript: '如果把企业管理比作盖房子，钉钉是打好了地基（沟通协同），而我们是帮您把上层的业务空间（销售、营销、客服）都精装修好。钉钉解决的是"人和人怎么沟通"的问题，我们解决的是"业务怎么高效增长"的问题。比如您想管销售漏斗、算销售提成、做客户分层运营，这些专业的业务场景，钉钉的轻量模块是撑不起来的。',
        neutralScript: '钉钉作为国民级的协同办公工具，在沟通、考勤、审批这些基础场景确实做得非常好，用户基数大，学习成本低。如果您的核心诉求是业务增长和客户运营，我们可以和钉钉互补使用——用钉钉做内部沟通，用我们做业务管理。',
      },
      {
        dimension: '性能指标',
        title: '系统性能对比',
        summary: '通用场景钉钉稳定，专业业务场景我方性能更优',
        metrics: [
          { label: 'IM消息送达率', ourValue: '99.9%', competitorValue: '99.99%', ourScore: 90, competitorScore: 98, evidence: '钉钉IM基础设施成熟' },
          { label: '复杂报表生成速度', ourValue: '万行数据<5秒', competitorValue: '万行数据30秒+', ourScore: 92, competitorScore: 45, evidence: '专业OLAP引擎优化' },
          { label: '业务流程自动化处理', ourValue: '支持1000+节点的复杂流程', competitorValue: '支持50个节点以内的简单流程', ourScore: 95, competitorScore: 50, evidence: '已验证的企业级复杂流程场景' },
          { label: '移动端响应速度', ourValue: '页面加载<1秒', competitorValue: '功能模块较多，加载1-2秒', ourScore: 90, competitorScore: 80, evidence: '针对业务场景专项优化' },
        ],
        advantageScript: '在处理专业业务数据时，性能差异就体现出来了。比如您的销售主管想看一张跨区域、跨产品线的业绩汇总报表，用我们的系统5秒内就能出结果，用钉钉可能要等半分钟甚至超时。这背后是架构设计的差异——我们的系统从第一天就是为处理复杂业务数据设计的。',
        neutralScript: '在基础沟通和简单审批场景，钉钉的性能和稳定性都是经过亿级用户验证的，非常可靠。但如果涉及复杂的业务数据处理和分析，我们的专业系统会更高效。',
      },
      {
        dimension: '价格区间',
        title: '成本投入对比',
        summary: '钉钉基础版免费，专业业务功能我方性价比更高',
        metrics: [
          { label: '基础版定价', ourValue: '¥1,980/账号/年起', competitorValue: '免费（基础功能）', ourScore: 60, competitorScore: 100, evidence: '钉钉基础版永久免费' },
          { label: '专业版（100用户）年费', ourValue: '约¥20-30万', competitorValue: '约¥10-15万', ourScore: 75, competitorScore: 85, evidence: '同量级用户对比' },
          { label: '业务模块额外费用', ourValue: '全部包含在订阅费中', competitorValue: 'CRM/审批专业版需额外付费', ourScore: 95, competitorScore: 60, evidence: '无增购模块，功能全开' },
          { label: '定制开发成本', ourValue: '低代码平台自助配置，免费', competitorValue: '需服务商开发，约¥500/人天', ourScore: 90, competitorScore: 50, evidence: '业务人员可自助搭建应用' },
        ],
        advantageScript: '看起来钉钉免费很诱人，但真正想用起来做业务管理，您会发现各种功能都要单独付费。更重要的是，很多深度业务功能钉钉根本没有，您还得额外采购第三方系统，算下来总投入反而更高。我们是一站式的业务管理平台，所有功能全开，没有隐藏消费，算总账肯定更划算。',
        neutralScript: '如果您只是需要基础的沟通、考勤、打卡功能，钉钉的免费版完全够用，性价比很高。但如果您希望通过系统提升业务效率、驱动增长，专业的业务系统投入产出比会更高。',
      },
      {
        dimension: '服务保障',
        title: '服务与支持对比',
        summary: '钉钉自助为主，我方提供1对1专属服务',
        metrics: [
          { label: '服务模式', ourValue: '专属客户成功经理1对1服务', competitorValue: '自助知识库+在线客服', ourScore: 95, competitorScore: 65, evidence: '每个客户配备专属CSM' },
          { label: '响应时效', ourValue: '工作日2小时内响应，紧急30分钟', competitorValue: '在线客服排队，通常1-4小时', ourScore: 92, competitorScore: 60, evidence: 'VIP通道保障' },
          { label: '实施服务', ourValue: '标配实施顾问，2周上线', competitorValue: '自助上线，或付费找第三方服务商', ourScore: 90, competitorScore: 45, evidence: '标准化实施方法论' },
          { label: '培训支持', ourValue: '免费线下+线上培训，持续赋能', competitorValue: '线上视频课程为主', ourScore: 88, competitorScore: 70, evidence: '定期客户最佳实践分享会' },
        ],
        advantageScript: '钉钉用户基数大，只能走标准化的自助服务路线，出了问题主要靠自己查文档、找客服排队。而我们服务的每家企业都是宝贵的客户，会配备专门的客户成功经理全程跟进，从系统上线、员工培训到持续优化，一条龙服务。很多客户说，就冲这份服务态度，选择我们就值了。',
        neutralScript: '钉钉由于用户量级大，不可能提供1对1的专属服务，但它的产品设计确实简单易用，大部分问题通过自助方式就能解决。如果您希望有专人服务、快速响应，我们的服务模式会更匹配。',
      },
    ],
    customerReferences: [
      { industry: '制造业', count: '300+', description: '生产管理、供应链协同场景' },
      { industry: '零售业', count: '250+', description: '门店管理、会员运营场景' },
      { industry: '专业服务业', count: '180+', description: '项目管理、客户服务场景' },
    ],
  },
  {
    id: 'feishu',
    name: '飞书',
    logoUrl: '',
    keywords: ['飞书', 'Lark', '字节飞书', '飞书文档'],
    positioning: '字节跳动出品，强在文档协作和OKR管理，互联网企业认可度高',
    category: '协同办公平台',
    targetCustomer: '互联网企业、知识密集型企业',
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
    comparisonMatrix: [
      {
        dimension: '功能覆盖',
        title: '功能覆盖对比',
        summary: '飞书强在协作体验，我方强在业务场景深度和行业适配',
        metrics: [
          { label: '文档协作能力', ourValue: '支持在线协作文档、表格', competitorValue: '行业领先的多维表格、文档协作', ourScore: 80, competitorScore: 98, evidence: '飞书文档体验有口皆碑' },
          { label: '销售管理能力', ourValue: '完整CRM+销售漏斗+提成计算', competitorValue: '基础客户管理，轻量OKR', ourScore: 95, competitorScore: 50, evidence: '支持B2B复杂销售流程管理' },
          { label: '垂直行业方案', ourValue: '10+行业深度解决方案', competitorValue: '通用型产品，行业方案较少', ourScore: 92, competitorScore: 45, evidence: '制造/零售/金融/医疗等行业模板' },
          { label: 'OKR与目标管理', ourValue: '支持OKR+KPI混合管理模式', competitorValue: 'OKR理念先进，功能完善', ourScore: 82, competitorScore: 95, evidence: '多种目标管理模式灵活选择' },
        ],
        advantageScript: '飞书的文档和协作体验确实做得非常出色，这一点我们也很敬佩。但回到业务管理的核心诉求，比如您需要管理销售团队、跟踪商机、分析业绩、做客户分层运营，这些才是直接影响营收的关键。我们在这些业务场景深耕了很多年，每个功能点都经过大量客户的实战打磨，能够真正帮您把业务管起来。',
        neutralScript: '如果您是互联网或科技公司，团队文化比较扁平开放，飞书的协作体验和OKR管理会非常契合。如果您的业务更偏向传统行业，有复杂的销售流程或行业合规要求，我们的方案会更适配。',
      },
      {
        dimension: '性能指标',
        title: '性能对比',
        summary: '两者性能都优秀，业务数据处理我方更专业',
        metrics: [
          { label: '文档协作实时性', ourValue: '多人协作延迟<500ms', competitorValue: '多人协作延迟<300ms', ourScore: 85, competitorScore: 95, evidence: '飞书在协作场景技术积累深厚' },
          { label: '大数据量报表查询', ourValue: '千万级数据<5秒', competitorValue: '百万级数据5-10秒', ourScore: 95, competitorScore: 65, evidence: '专业OLAP引擎，列式存储' },
          { label: '系统可用性', ourValue: '99.99% SLA', competitorValue: '99.95% SLA', ourScore: 95, competitorScore: 90, evidence: '金融级高可用架构' },
          { label: '移动端体验', ourValue: '针对业务操作深度优化', competitorValue: '流畅度优秀，协作体验好', ourScore: 90, competitorScore: 92, evidence: '各有所长' },
        ],
        advantageScript: '在处理业务数据这个场景，我们的性能优势很明显。比如您要做一个全公司的销售业绩分析，涉及上千万条交易数据，我们系统5秒内就能出结果，支持任意维度的钻取分析。这背后是我们在数据仓库、分布式计算领域的多年技术积累，不是简单做个协作工具就能比拟的。',
        neutralScript: '飞书在文档协作的流畅度方面确实做得非常棒，这也是字节技术实力的体现。在处理海量业务数据和复杂分析场景，我们有更深厚的技术积累。',
      },
      {
        dimension: '价格区间',
        title: '价格成本对比',
        summary: '我方定价更实在，团队规模越大优势越明显',
        metrics: [
          { label: '标准版/账号/年', ourValue: '¥1,980', competitorValue: '¥2,400', ourScore: 88, competitorScore: 75, evidence: '官方公开报价对比' },
          { label: '企业版/账号/年', ourValue: '¥3,980', competitorValue: '¥4,800', ourScore: 90, competitorScore: 70, evidence: '含全部业务功能' },
          { label: '人数阶梯定价', ourValue: '统一单价，无阶梯', competitorValue: '人数越多单价越高', ourScore: 95, competitorScore: 55, evidence: '500人团队年省约40万' },
          { label: '第三方应用成本', ourValue: '内置业务应用，无需额外采购', competitorValue: '需采购第三方业务应用', ourScore: 92, competitorScore: 60, evidence: '一站式平台降低总拥有成本' },
        ],
        advantageScript: '算一笔明白账：假设您有500人的团队，使用飞书企业版一年的账号费用就要240万，还不算额外采购业务系统的钱。用我们的企业版，一年不到200万，销售、营销、客服所有业务功能全开，还配备专属的客户成功团队服务。同样的预算，我们能帮您把业务真正管起来，而不只是做协作沟通。',
        neutralScript: '对于50人以下的小团队，飞书和我们的价格差距不大，主要看功能需求是否匹配。团队规模越大，我们的性价比优势越明显。',
      },
      {
        dimension: '服务保障',
        title: '服务对比',
        summary: '我方服务更贴身，传统行业客户体验更好',
        metrics: [
          { label: '服务响应', ourValue: '2小时响应，专属CSM', competitorValue: '在线工单+客服，响应4-8小时', ourScore: 95, competitorScore: 65, evidence: '传统行业客户特别看重' },
          { label: '行业实施经验', ourValue: '10+行业实施方法论', competitorValue: '互联网行业经验丰富', ourScore: 92, competitorScore: 70, evidence: '各行业最佳实践库' },
          { label: '驻场服务支持', ourValue: '可提供驻场实施和培训', competitorValue: '远程为主，大型项目可驻场', ourScore: 90, competitorScore: 60, evidence: '重大项目保障能力' },
          { label: '客户成功体系', ourValue: '全生命周期客户成功管理', competitorValue: '以产品自助为主', ourScore: 93, competitorScore: 68, evidence: '主动式服务，定期业务复盘' },
        ],
        advantageScript: '很多传统行业的客户选择我们，就是因为我们的服务够"贴身"。我们会派懂行业的顾问到现场，和您的团队一起梳理业务流程，手把手教大家用起来，确保系统真正落地产生价值。而不是简单给个账号，用不用得起来全靠自己摸索。',
        neutralScript: '飞书的产品设计确实很简洁优雅，互联网团队的小伙伴上手很快，很多时候不需要太多培训就能用起来。对于需要手把手服务、行业定制化需求多的传统企业，我们的服务体系会更合适。',
      },
    ],
    customerReferences: [
      { industry: '制造业', count: '280+', description: '数字化转型、智能工厂场景' },
      { industry: '医疗健康', count: '120+', description: '医院信息化、医药营销场景' },
      { industry: '金融业', count: '90+', description: '银行数字化、保险营销场景' },
    ],
  },
  {
    id: 'yonyou',
    name: '用友',
    logoUrl: '',
    keywords: ['用友', 'yonyou', '用友CRM', '用友云'],
    positioning: '国内老牌ERP和企业服务厂商，财务管理能力强，客户资源积累深厚',
    category: 'ERP/企业管理软件',
    targetCustomer: '中大型企业，财务驱动的管理需求',
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
    comparisonMatrix: [
      {
        dimension: '功能覆盖',
        title: '功能对比',
        summary: '用友财务强，我方业务增长和用户体验更优',
        metrics: [
          { label: '财务管理深度', ourValue: '标准财务核算+业务财务一体化', competitorValue: '国内领先的财务ERP能力', ourScore: 80, competitorScore: 98, evidence: '用友财务模块经过30年积累' },
          { label: '销售营销一体化', ourValue: '营销→线索→商机→回款全链路', competitorValue: '财务后端强，前端营销销售弱', ourScore: 95, competitorScore: 55, evidence: '驱动收入增长的完整闭环' },
          { label: '产品易用性', ourValue: '消费级体验，新员工半天上手', competitorValue: '功能复杂，培训需1-2周', ourScore: 95, competitorScore: 45, evidence: '界面学习成本显著降低' },
          { label: '供应链管理', ourValue: '供应链协同+智能预测', competitorValue: 'ERP生产制造模块成熟', ourScore: 82, competitorScore: 90, evidence: '各有所长' },
        ],
        advantageScript: '用友做财务ERP确实是老大哥，这点我们非常尊重。但时代变了，现在企业最缺的不是怎么把账记清楚，而是怎么把收入做上去。我们的产品就是聚焦"增长"——帮您获客、帮您转化、帮您提升复购。如果您的财务已经有用友管得很好了，完全可以用我们的系统来做前端的销售营销，两边打通数据，后端财务继续稳定运行，前端业务灵活增长。',
        neutralScript: '如果您的核心诉求是财务核算、生产制造这些传统ERP场景，用友确实是非常成熟的选择。但如果您更关注前端的销售增长、营销获客、客户运营，我们的产品会更对路。',
      },
      {
        dimension: '性能指标',
        title: '性能对比',
        summary: '云原生架构带来性能和体验的代际差异',
        metrics: [
          { label: '云端弹性扩展', ourValue: '秒级扩容，支持流量波峰', competitorValue: '扩容需采购硬件，周期长', ourScore: 98, competitorScore: 50, evidence: '云原生架构天然优势' },
          { label: '移动端响应速度', ourValue: '页面加载<1秒，操作流畅', competitorValue: '移动端体验较弱，加载慢', ourScore: 95, competitorScore: 45, evidence: '移动优先设计理念' },
          { label: '数据实时同步', ourValue: '全端数据毫秒级实时同步', competitorValue: '传统架构存在数据延迟', ourScore: 92, competitorScore: 60, evidence: '事件驱动架构' },
          { label: '系统升级', ourValue: '不停机热升级，无感体验', competitorValue: '需停机维护，通常选在深夜/周末', ourScore: 95, competitorScore: 50, evidence: 'SaaS模式标配' },
        ],
        advantageScript: '这是架构上的代际差异，就像功能机和智能手机的区别。用友的产品是从传统软件时代演进过来的，包袱很重；而我们的产品从第一天就是云原生、移动优先的设计。这体现在实际使用中就是——销售在外跑客户，手机打开APP立刻能用，数据实时同步，老板想看经营数据随时刷新，系统升级也不需要等到半夜停机维护。',
        neutralScript: '传统架构的优势是稳定，经过这么多年的打磨，用友的核心模块确实非常稳定可靠。但代价就是灵活性和现代化体验不足。要看您更看重哪方面。',
      },
      {
        dimension: '价格区间',
        title: '总拥有成本对比',
        summary: '我方SaaS模式初始投入低、TCO更优',
        metrics: [
          { label: '初始投入（100用户）', ourValue: '¥20-40万，按年订阅', competitorValue: '¥80-150万，License+实施', ourScore: 95, competitorScore: 50, evidence: '无需一次性大额投入' },
          { label: '服务器硬件成本', ourValue: '包含在订阅费中', competitorValue: '需采购服务器，约¥20-50万', ourScore: 100, competitorScore: 40, evidence: 'SaaS vs 传统部署模式' },
          { label: '年运维成本', ourValue: '0，我方负责运维', competitorValue: '需专职IT人员，约¥30-50万/年', ourScore: 98, competitorScore: 45, evidence: '省心省力' },
          { label: '5年TCO对比', ourValue: '约¥100-200万', competitorValue: '约¥300-500万', ourScore: 92, competitorScore: 48, evidence: '综合成本节省约60%' },
        ],
        advantageScript: '传统软件的玩法是先收一大笔License费，再收实施费，后面每年收维护费，您还要自己买服务器、雇IT团队运维，算下来是个无底洞。我们的SaaS模式就很简单透明——按年付费，什么都包含了，您不需要操心服务器、运维、升级这些事情，把精力全部放在业务上。5年算下来，总拥有成本能节省60%以上。',
        neutralScript: '用友那种模式虽然初始投入大，但如果您打算用10年以上，且集团有统一的IT基础设施，算下来也有它的道理。但如果您希望轻装上阵、灵活应变，SaaS模式显然是更好的选择。',
      },
      {
        dimension: '服务保障',
        title: '服务对比',
        summary: '我方服务更敏捷、更以客户成功为导向',
        metrics: [
          { label: '需求响应速度', ourValue: '2周一个版本，客户需求快速迭代', competitorValue: '半年到一年一个大版本', ourScore: 95, competitorScore: 40, evidence: 'SaaS敏捷开发模式' },
          { label: '实施交付周期', ourValue: '2-4周标准上线', competitorValue: '3-6个月项目周期', ourScore: 92, competitorScore: 45, evidence: '标准化+最佳实践' },
          { label: '客户成功理念', ourValue: '帮助客户实现业务价值', competitorValue: '以项目交付为导向', ourScore: 90, competitorScore: 60, evidence: '关注长期客户价值' },
          { label: '技术支持', ourValue: '产品+技术全栈支持', competitorValue: '主要靠渠道伙伴支持', ourScore: 88, competitorScore: 65, evidence: '原厂团队直接服务' },
        ],
        advantageScript: '传统软件公司的思路是"项目交付"——签合同、收钱、上线、走人。我们的思路是"客户成功"——系统上线只是服务的开始，我们会持续跟进您的使用情况，帮您挖掘更多业务价值。您有任何需求反馈，我们两周就能迭代上线，不需要等半年一年。这种服务理念的差异，您在用的过程中会有非常直观的感受。',
        neutralScript: '用友的服务体系覆盖全国，在很多三四线城市都有合作伙伴，这是它的优势。但如果您重视需求的快速响应和持续的产品迭代，我们会更匹配。',
      },
    ],
    customerReferences: [
      { industry: '制造业', count: '350+', description: '从ERP延伸到全链路数字化' },
      { industry: '零售业', count: '200+', description: '财务业务一体化、全渠道零售' },
      { industry: '建筑地产', count: '150+', description: '项目管理、成本管控' },
    ],
  },
  {
    id: 'hubspot',
    name: 'HubSpot',
    logoUrl: '',
    keywords: ['hubspot', 'HubSpot', '集客营销', 'inbound'],
    positioning: '集客营销理念鼻祖，营销自动化一体化平台，适合中小外贸企业',
    category: '营销自动化/CRM平台',
    targetCustomer: '外贸企业、中小企业、海外营销',
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
    comparisonMatrix: [
      {
        dimension: '功能覆盖',
        title: '营销功能对比',
        summary: 'HubSpot适合海外营销，我方深度覆盖国内营销生态',
        metrics: [
          { label: '国内社媒渠道覆盖', ourValue: '微信/视频号/小红书/抖音/快手全支持', competitorValue: '主要支持LinkedIn/Facebook/Google', ourScore: 98, competitorScore: 30, evidence: '覆盖国内95%以上主流营销渠道' },
          { label: '海外营销能力', ourValue: '支持邮件营销和基础海外投放', competitorValue: '全球领先的集客营销方法论和工具', ourScore: 60, competitorScore: 98, evidence: 'HubSpot是Inbound Marketing的开创者' },
          { label: '私域运营能力', ourValue: '企微SCRM+社群运营+朋友圈营销', competitorValue: '无国内私域运营功能', ourScore: 95, competitorScore: 20, evidence: '微信生态深度集成' },
          { label: '营销自动化', ourValue: '可视化旅程编排，支持复杂分支逻辑', competitorValue: '成熟的工作流引擎', ourScore: 88, competitorScore: 92, evidence: '两者功能都很强大' },
        ],
        advantageScript: '做国内市场，渠道就是生命线。您想想，您的潜在客户每天刷微信、刷抖音、看小红书，这些HubSpot一个都接不了，等于您的营销数据是断裂的。我们的平台就是为中国市场量身打造的，所有主流社媒渠道原生打通，营销内容一键分发，客户行为全链路追踪，真正帮您把营销ROI算清楚。',
        neutralScript: '如果您的客户主要在海外，做的是外贸或跨境业务，HubSpot的集客营销方法论和海外渠道支持确实非常专业，值得考虑。但国内市场，我们的适配度要高得多。',
      },
      {
        dimension: '性能指标',
        title: '性能对比',
        summary: '国内场景我方性能优势明显',
        metrics: [
          { label: '国内营销消息触达速度', ourValue: '微信模板消息<5秒到达', competitorValue: '海外通道，国内触达不稳定', ourScore: 98, competitorScore: 40, evidence: '直连国内各大平台API' },
          { label: '数据报表生成速度', ourValue: '百万级数据<3秒', competitorValue: '国内访问报表加载慢', ourScore: 92, competitorScore: 50, evidence: '国内数据节点部署' },
          { label: '营销邮件到达率', ourValue: '国内邮件95%+到达率', competitorValue: '海外邮件服务器，国内容易进垃圾箱', ourScore: 90, competitorScore: 55, evidence: '与国内主流邮件服务商有白名单合作' },
          { label: '系统可用性', ourValue: '99.99% SLA，国内多节点备份', competitorValue: '99.9% SLA，海外服务器为主', ourScore: 95, competitorScore: 85, evidence: '本地化部署保障' },
        ],
        advantageScript: '做营销最关键的是"触达"——您发的消息客户要能及时收到。用HubSpot发微信模板消息，走海外通道转一圈，可能半小时才到甚至发不出去；用我们的系统，直连微信官方API，5秒内必达。再比如邮件营销，HubSpot的海外服务器发国内邮箱，很容易被识别为垃圾邮件；我们和国内主流邮件服务商都有白名单合作，到达率95%以上。这些细节直接决定了您的营销效果。',
        neutralScript: '如果您的营销触达对象都是海外用户，HubSpot的全球邮件基础设施和海外渠道能力确实很强大。但面向国内用户的触达场景，我们有天然优势。',
      },
      {
        dimension: '价格区间',
        title: '价格对比',
        summary: 'HubSpot定价看似低，实际增购成本高，我方性价比更优',
        metrics: [
          { label: '入门版年费', ourValue: '¥29,800/年（全功能基础版）', competitorValue: '$450/月起（约¥3,900/月）营销套件', ourScore: 85, competitorScore: 75, evidence: 'HubSpot免费版功能极其有限' },
          { label: '专业版（营销+销售）', ourValue: '¥98,000/年，全部功能', competitorValue: '$3,200/月起（约¥28,000/月）分开购买', ourScore: 92, competitorScore: 55, evidence: '同等功能配置下对比' },
          { label: '联系人数量限制', ourValue: '无限制', competitorValue: '超出1,000联系人需额外付费', ourScore: 100, competitorScore: 40, evidence: 'HubSpot按联系人阶梯收费' },
          { label: '3年总拥有成本', ourValue: '约¥30-60万', competitorValue: '约¥80-150万', ourScore: 92, competitorScore: 48, evidence: '含所有功能和联系人' },
        ],
        advantageScript: 'HubSpot的定价套路很深。先用免费版吸引你，等你真正想用起来，发现营销套件要单独买、销售套件要单独买、Service套件还要单独买，联系人超过1000个还要加钱，功能都得靠增购，最后账单像滚雪球一样。我们的定价就很实在——一个价格，所有功能全开，联系人数量不设限，用多少人、管多少客户都是这个价，没有任何隐形消费。',
        neutralScript: '如果您只是很小的团队（5人以下）、联系人不多（1000以内），只用基础功能，HubSpot的Starter版确实还可以。但团队稍微大一点，它的增购成本会迅速超过我们。',
      },
      {
        dimension: '服务保障',
        title: '服务对比',
        summary: '本土服务团队 vs 海外邮件支持，体验差距巨大',
        metrics: [
          { label: '客户支持响应', ourValue: '工作日2小时内响应，支持电话/微信', competitorValue: '邮件/在线聊天，时差+语言障碍', ourScore: 95, competitorScore: 35, evidence: '国内专属客户成功经理' },
          { label: '语言支持', ourValue: '全中文服务，文档、培训中文', competitorValue: '英文为主，中文文档有限', ourScore: 100, competitorScore: 50, evidence: '无语言障碍' },
          { label: '实施服务', ourValue: '标配实施服务，2-4周上线', competitorValue: '需付费采购Onboarding服务', ourScore: 92, competitorScore: 45, evidence: '本土化实施方法论' },
          { label: '营销咨询', ourValue: '提供国内营销玩法咨询', competitorValue: '提供海外Inbound营销方法论', ourScore: 90, competitorScore: 75, evidence: '懂国内市场的营销专家' },
        ],
        advantageScript: '举个真实的例子：之前有个做电商的客户用HubSpot，618大促前一天自动化流程出了问题，发邮件给HubSpot支持，等了两天才收到英文回复，大促都结束了。换到我们之后，同样的问题，微信群里喊一声，30分钟内就有人跟进解决。做营销讲究的就是时效性，出了问题找不到人，损失的是真金白银的生意。',
        neutralScript: '如果您的团队英语好、时差能接受，HubSpot的知识库和社区资源确实很丰富。但要想有问题能快速找到人解决，我们的本土服务优势是碾压级的。',
      },
    ],
    customerReferences: [
      { industry: '电商零售', count: '220+', description: '私域运营、全渠道营销场景' },
      { industry: '教育培训', count: '150+', description: '线索孵化、学员转化场景' },
      { industry: 'B2B科技', count: '180+', description: '内容营销、线索培育场景' },
    ],
  },
];

export function findCompetitorByKeyword(keyword: string): Competitor | undefined {
  const keywordLower = keyword.toLowerCase();
  return competitors.find((c) =>
    c.name.toLowerCase() === keywordLower ||
    c.keywords.some((k) => k.toLowerCase() === keywordLower) ||
    c.keywords.some((k) => keywordLower.includes(k.toLowerCase()))
  );
}

export function detectCompetitorsFromText(text: string): Competitor[] {
  const lowerText = text.toLowerCase();
  const detected: Competitor[] = [];
  
  for (const competitor of competitors) {
    for (const keyword of competitor.keywords) {
      if (lowerText.includes(keyword.toLowerCase())) {
        if (!detected.find((c) => c.id === competitor.id)) {
          detected.push(competitor);
        }
        break;
      }
    }
  }
  
  return detected;
}
