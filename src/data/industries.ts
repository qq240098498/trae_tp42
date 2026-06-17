export interface IndustryTerm {
  term: string;
  explanation?: string;
}

export interface IndustryPainPoint {
  id: string;
  name: string;
  description: string;
  severity: 'critical' | 'high' | 'medium';
}

export interface IndustryCase {
  company: string;
  industry: string;
  result: string;
  metrics: string[];
  quote?: string;
}

export interface IndustryScript {
  greeting: string;
  painPointLeadIn: string;
  valueProposition: string;
  closing: string;
}

export interface Industry {
  id: string;
  name: string;
  code?: string;
  description?: string;
  icon?: string;
  color?: string;
  terms: IndustryTerm[];
  painPoints: IndustryPainPoint[];
  cases: IndustryCase[];
  scripts: IndustryScript;
  keywords: string[];
  scenarios: string[];
}

export const industries: Industry[] = [
  {
    id: 'finance',
    name: '金融',
    description: '银行、保险、证券、基金、消费金融等金融机构',
    icon: '🏦',
    color: 'from-blue-500 to-indigo-600',
    keywords: ['金融', '银行', '保险', '证券', '基金', '理财', '投资', '消金', '信贷', '风控'],
    scenarios: ['客户精细化运营', '风险管控', '合规管理', '营销获客', '数据决策'],
    terms: [
      { term: 'KYC（Know Your Customer）', explanation: '了解你的客户，监管要求的客户身份识别' },
      { term: 'AML（反洗钱）', explanation: '反洗钱合规监控和报告' },
      { term: '用户画像', explanation: '基于客户行为数据构建的多维度客户特征模型' },
      { term: '风控模型', explanation: '风险评估和授信决策的算法模型' },
      { term: '转化率漏斗', explanation: '从获客到成交的各阶段转化路径分析' },
      { term: 'MOT（关键时刻）', explanation: '客户体验管理中的关键接触点' },
    ],
    painPoints: [
      {
        id: 'finance-1',
        name: '获客成本攀升',
        description: '线上流量红利消退，单客获客成本从几百元飙升至上千元，ROI持续下降',
        severity: 'critical',
      },
      {
        id: 'finance-2',
        name: '合规监管压力大',
        description: '监管政策趋严，数据合规、反洗钱、消费者权益保护等要求不断提高',
        severity: 'critical',
      },
      {
        id: 'finance-3',
        name: '客户运营粗放',
        description: '客户分层能力不足，千人一面的营销方式导致转化率低、用户流失严重',
        severity: 'high',
      },
      {
        id: 'finance-4',
        name: '数据孤岛严重',
        description: '各业务条线数据分散，无法形成360度客户视图，决策缺乏数据支撑',
        severity: 'high',
      },
      {
        id: 'finance-5',
        name: '风控效率低',
        description: '传统人工审核效率低、易出错，欺诈识别能力不足，坏账率居高不下',
        severity: 'medium',
      },
    ],
    cases: [
      {
        company: '某城商行',
        industry: '城市商业银行',
        result: '零售信贷业务数字化转型',
        metrics: ['客户转化率提升 32%', '获客成本降低 45%', '审批时效从3天缩短至2小时'],
        quote: '通过智能客户分层和自动化审批，我们的零售业务效率提升了3倍以上。',
      },
      {
        company: '某头部消金公司',
        industry: '消费金融',
        result: '智能营销与风控一体化',
        metrics: ['营销ROI提升 58%', '坏账率下降 28%', '用户活跃度提升 40%'],
      },
      {
        company: '某中型保险公司',
        industry: '保险',
        result: '代理人赋能与客户经营',
        metrics: ['代理人产能提升 35%', '保单继续率提升 12个百分点', '新单保费增长 25%'],
      },
    ],
    scripts: {
      greeting: '{name}总好！现在金融行业监管越来越严，获客成本也在不断攀升，加上最近经济环境的变化，相信您在客户精细化运营和风险管控方面的压力也不小吧？',
      painPointLeadIn: '很多金融行业客户都提到，现在最大的挑战主要集中在这几个方面：一是获客成本越来越高但转化效果越来越差；二是监管合规要求不断提高，数据治理和风险管理压力大；三是客户数据分散在各个系统，没法做统一的精准运营。不知道您这边有没有类似的感受？',
      valueProposition: '我们服务了多家城商行、消金公司和保险机构，核心是帮您做好三件事：第一，在合规前提下实现精准获客和客户分层运营，把转化做上去、把成本降下来；第二，全渠道数据打通，构建统一的客户画像，让每个客户的经营决策都有数据支撑；第三，智能风控和合规内嵌，让业务增长和风险控制两不误。',
      closing: '像您同行业的{example}，用了我们的方案之后，在{metric}方面取得了非常显著的效果。您方便的话，我可以把完整的案例和方案发给您参考一下？',
    },
  },
  {
    id: 'manufacturing',
    name: '制造',
    description: '离散制造、流程制造、汽车、装备、电子等制造业企业',
    icon: '🏭',
    color: 'from-slate-500 to-zinc-600',
    keywords: ['制造', '汽车', '工业', '工厂', '生产', '航空', '航天', '装备', '机械', '电子', '半导体', '离散制造', '流程制造'],
    scenarios: ['数字化转型', '供应链管理', '生产效率提升', '质量管控', '设备管理'],
    terms: [
      { term: 'MES（制造执行系统）', explanation: '车间生产过程执行管理系统' },
      { term: 'WMS（仓储管理系统）', explanation: '仓库作业管理和库存控制系统' },
      { term: 'APS（高级计划排程）', explanation: '基于约束理论的智能生产排程系统' },
      { term: 'OEE（设备综合效率）', explanation: '设备时间开动率×性能开动率×合格品率' },
      { term: 'JIT（准时制生产）', explanation: '只在需要的时候按需要的量生产所需产品' },
      { term: '数字孪生', explanation: '物理实体的虚拟数字化镜像' },
    ],
    painPoints: [
      {
        id: 'mfg-1',
        name: '计划与实际脱节',
        description: '生产计划靠经验拍脑袋，插单改单频繁，交付延期严重，客户满意度低',
        severity: 'critical',
      },
      {
        id: 'mfg-2',
        name: '库存积压与缺料并存',
        description: '该有的物料没有、不该有的堆了一大堆，库存周转率低，资金占用严重',
        severity: 'critical',
      },
      {
        id: 'mfg-3',
        name: '数据黑箱',
        description: '车间生产数据靠人工填报，不实时、不准确，管理层看不清真实生产状况',
        severity: 'high',
      },
      {
        id: 'mfg-4',
        name: '质量追溯难',
        description: '出现质量问题无法快速定位原因和影响范围，召回成本高、品牌受损',
        severity: 'high',
      },
      {
        id: 'mfg-5',
        name: '设备利用率低',
        description: '设备故障、换型等待、物料短缺等导致OEE偏低，产能浪费严重',
        severity: 'medium',
      },
    ],
    cases: [
      {
        company: '某大型汽车零部件企业',
        industry: '汽车零部件',
        result: '从销售到生产全链路数字化',
        metrics: ['库存周转效率提升 42%', '订单交付准时率从78%提升至96%', 'OEE提升 18个百分点'],
        quote: '以前车间像黑箱，现在每个工位、每台设备、每批物料都清清楚楚。',
      },
      {
        company: '某精密机械制造商',
        industry: '精密机械',
        result: '智能工厂建设',
        metrics: ['生产效率提升 35%', '不良率下降 55%', '人均产值提升 28%'],
      },
      {
        company: '某电子制造企业',
        industry: '电子制造（EMS）',
        result: '全流程质量追溯体系',
        metrics: ['质量问题定位时间从48小时缩短至2小时', '客户投诉率下降 70%', '返工率下降 40%'],
      },
    ],
    scripts: {
      greeting: '{name}总好！这两年制造业数字化转型喊得很响，但真正落地出效果的其实不多，很多企业上了系统之后反而更复杂了。我们最近在离散制造和流程制造都有几个标杆客户，把从销售到生产到供应链的全流程打通了，效果非常显著。',
      painPointLeadIn: '很多制造企业老板跟我们诉苦，现在最头疼的事情：一是计划赶不上变化，插单改单频繁，订单交不了；二是库存像个无底洞，该有的没有、不该有的堆了一堆；三是车间像个黑箱，生产了什么、进度怎样、质量如何，全靠人报数，管理层心里没底。您这边有没有类似的痛点？',
      valueProposition: '我们的核心价值是帮制造业做好"三通"：第一，计划和执行通——销售订单一键生成生产计划，自动排程、实时调度，插单改单也不怕；第二，物料和生产通——从供应商到车间到客户，全程物料透明，缺料预警、库存优化；第三，数据和决策通——每台设备、每个工位、每道工序的数据自动采集，经营看板实时更新。',
      closing: '像您同行业的{example}，就是用了我们的方案，{metric}。您方便的话，我可以安排我们的制造行业顾问和您做一个深度交流，相信对您一定会有启发。',
    },
  },
  {
    id: 'retail',
    name: '零售',
    description: '连锁零售、品牌电商、商超、便利店、百货等零售企业',
    icon: '🛒',
    color: 'from-rose-500 to-pink-600',
    keywords: ['零售', '电商', '连锁', '商超', '便利店', '百货', '门店', '品牌', '快消', '消费', '生鲜', '美妆', '服饰'],
    scenarios: ['全渠道营销', '会员运营', '私域增长', '供应链协同', '门店管理'],
    terms: [
      { term: '私域流量', explanation: '品牌可以自主运营、反复触达的用户池' },
      { term: 'RFM模型', explanation: '基于最近消费时间、消费频次、消费金额的客户分层方法' },
      { term: 'GMV（商品交易总额）', explanation: '一定时间段内的成交总金额' },
      { term: '复购率', explanation: '一定时间段内重复购买用户占比' },
      { term: '坪效', explanation: '每平方米营业面积创造的销售额' },
      { term: '人效', explanation: '每个员工创造的销售额或利润' },
      { term: '全域营销', explanation: '线上线下全渠道统一营销触达' },
    ],
    painPoints: [
      {
        id: 'retail-1',
        name: '流量红利消退',
        description: '公域流量获客成本越来越高，平台抽成越来越重，利润被不断挤压',
        severity: 'critical',
      },
      {
        id: 'retail-2',
        name: '会员运营粗放',
        description: '会员就是留个手机号，没有分层、没有标签，发券全靠广撒网，转化率低',
        severity: 'critical',
      },
      {
        id: 'retail-3',
        name: '线上线下割裂',
        description: '线上电商、线下门店、小程序、APP各自为政，用户数据不通，体验不一致',
        severity: 'high',
      },
      {
        id: 'retail-4',
        name: '库存与销售不匹配',
        description: '爆款缺货、滞销款积压，供需错配严重，打折清仓侵蚀利润',
        severity: 'high',
      },
      {
        id: 'retail-5',
        name: '导购管理难',
        description: '门店导购能力参差不齐，客户离职带走客户，优质经验无法沉淀复制',
        severity: 'medium',
      },
    ],
    cases: [
      {
        company: '某全国连锁美妆品牌',
        industry: '美妆连锁',
        result: '全域会员数字化运营',
        metrics: ['会员复购率提升 38%', '私域GMV占比从10%提升至35%', '单客LTV提升 52%'],
        quote: '以前会员就是个手机号，现在我们能精准知道每个客户喜欢什么、什么时候该触达。',
      },
      {
        company: '某头部服饰品牌',
        industry: '品牌服饰',
        result: '全渠道一盘货',
        metrics: ['售罄率提升 25个百分点', '库存周转天数减少 35天', '新品上市周期缩短 50%'],
      },
      {
        company: '某区域连锁商超',
        industry: '连锁零售',
        result: '数字化门店升级',
        metrics: ['门店坪效提升 22%', '人工成本降低 18%', '顾客满意度提升 30%'],
      },
    ],
    scripts: {
      greeting: '{name}总好！现在零售业线上线下融合是大趋势，私域运营也越来越卷，相信您在会员运营和全渠道营销这块肯定花了不少心思。我们帮几家连锁零售品牌做了全渠道客户数据打通和私域精细化运营，复购率平均提升了35%以上，不知道您这边有没有兴趣了解一下？',
      painPointLeadIn: '现在零售行业大家都面临几个共同的挑战：一是流量越来越贵，平台抽成越来越高，生意越来越难做；二是会员运营没方法，客户留不住、复购上不来；三是线上线下数据不通，同一个客户在不同渠道看到的价格、优惠都不一样，体验很差。不知道您这边哪个痛点最突出？',
      valueProposition: '我们帮零售企业做好三件核心的事：第一，全域数据打通，不管是线上电商、小程序还是线下门店，所有用户数据归总到一个ID，做真正的360度客户画像；第二，智能会员分层和自动化营销，RFM+AI预测，每个客户在对的时间收到对的内容，转化率自然上去；第三，赋能一线导购，把总部的营销能力、客户洞察直达每个导购手机，让每个导购都成为金牌销售。',
      closing: '像您同行业的{example}，用了我们的方案之后，{metric}。我可以把完整的案例和行业白皮书发给您，您先了解一下？',
    },
  },
  {
    id: 'tech',
    name: '互联网/科技',
    description: '互联网公司、SaaS企业、软件公司、科技创业公司等',
    icon: '💻',
    color: 'from-violet-500 to-purple-600',
    keywords: ['互联网', '科技', '软件', 'saas', 'IT', '信息', '数字', 'AI', '人工智能', '创业', '创投', 'toB', 'toC'],
    scenarios: ['PLG增长', '客户成功', '产品迭代', '数据驱动', '商业化'],
    terms: [
      { term: 'PLG（产品驱动增长）', explanation: '以产品体验为核心驱动用户获取和转化的增长模式' },
      { term: 'NPS（净推荐值）', explanation: '衡量用户满意度和忠诚度的指标' },
      { term: 'MRR/ARR', explanation: '月度/年度经常性收入，SaaS公司核心指标' },
      { term: 'Churn Rate（流失率）', explanation: '一定时间段内流失的客户/收入占比' },
      { term: 'LTV/CAC', explanation: '客户终身价值与获客成本之比，衡量增长健康度' },
      { term: 'PMF（产品市场匹配）', explanation: '产品满足市场需求的程度' },
      { term: 'AARRR漏斗', explanation: '获客、激活、留存、收入、推荐的增长模型' },
    ],
    painPoints: [
      {
        id: 'tech-1',
        name: '增长乏力',
        description: '获客成本飙升，免费用户转付费转化率低，增长遇到天花板',
        severity: 'critical',
      },
      {
        id: 'tech-2',
        name: '客户流失严重',
        description: '新客户续费率低，老客户不断流失，收入增长靠新客填窟窿，越做越累',
        severity: 'critical',
      },
      {
        id: 'tech-3',
        name: '产品决策凭感觉',
        description: '用户行为数据分散，产品迭代靠拍脑袋，不知道用户真正在用什么、需要什么',
        severity: 'high',
      },
      {
        id: 'tech-4',
        name: '客户成功资源不足',
        description: '客户成功团队人少客户多，只能被动救火，无法主动健康度管理和增购',
        severity: 'high',
      },
      {
        id: 'tech-5',
        name: '部门协同差',
        description: '产品、运营、销售、市场各部门数据不互通，目标不一致，内耗严重',
        severity: 'medium',
      },
    ],
    cases: [
      {
        company: '某头部SaaS公司',
        industry: '企业服务SaaS',
        result: 'PLG增长引擎搭建',
        metrics: ['免费转付费转化率提升 45%', '客户流失率下降 32%', 'ARR增长 2.3倍'],
        quote: '以前我们增长靠销售猛推，现在靠产品自己说话，客户来了就能留得住、愿意付钱。',
      },
      {
        company: '某知名AI公司',
        industry: '人工智能',
        result: '客户全生命周期数字化',
        metrics: ['客户健康度预测准确率 88%', '客户成功人效提升 3倍', 'NPS从32提升至68'],
      },
      {
        company: '某新锐消费互联网公司',
        industry: '消费互联网',
        result: '数据驱动的用户增长',
        metrics: ['DAU增长 180%', '次日留存率提升 20个百分点', '广告变现效率提升 60%'],
      },
    ],
    scripts: {
      greeting: '{name}总好！现在科技行业不管是To B还是To C，增长都越来越难了，获客成本飙升、用户流失严重、产品体验要求越来越高。我们服务了多家SaaS和互联网公司，在PLG增长、客户成功和数据驱动决策方面积累了不少经验，想和您交流一下。',
      painPointLeadIn: '科技公司现在的普遍焦虑：一是增长瓶颈，流量越来越贵，转化越来越难；二是留存焦虑，钱花出去获客，但客户来了就走，LTV跑不赢CAC；三是产品和业务数据割裂，想做个分析要拉一堆数、对齐半天，决策效率极低。不知道您团队现在最头疼的是什么？',
      valueProposition: '我们帮科技公司打造数据驱动的增长闭环：第一，全链路用户行为分析，从获客到转化到留存，每个环节的数据都清清楚楚，找到增长杠杆；第二，AI驱动的客户成功，自动识别流失风险和增购机会，让有限的CS资源用在刀刃上；第三，产品埋点和指标体系搭建，让产品迭代有数据支撑，不再靠拍脑袋决策。',
      closing: '像{example}这样的公司，用了我们的方案后，{metric}。我可以发一份他们的完整案例给您，或者安排我们的科技行业解决方案专家和您聊聊？',
    },
  },
  {
    id: 'healthcare',
    name: '医疗健康',
    description: '医院、医药企业、医疗器械、医疗服务、健康管理等',
    icon: '🏥',
    color: 'from-emerald-500 to-teal-600',
    keywords: ['医疗', '医院', '医药', '健康', '生物', '器械', '医生', '患者', '制药', '诊所', '医美', '体检'],
    scenarios: ['患者运营', '医药营销', '医院管理', '医患沟通', '健康管理'],
    terms: [
      { term: 'HIPAA合规', explanation: '美国健康保险流通与责任法案，医疗数据隐私标准' },
      { term: 'DTP药房', explanation: '直接面向患者提供专业药品和服务的药房' },
      { term: '患者旅程', explanation: '患者从发现症状到治疗康复的全流程' },
      { term: 'KOC/KOL', explanation: '关键意见消费者/关键意见领袖，医药营销重要资源' },
      { term: 'RWS（真实世界研究）', explanation: '基于真实临床数据开展的研究' },
      { term: 'DRG/DIP', explanation: '疾病诊断相关分组/按病种分值付费，医保支付改革方式' },
    ],
    painPoints: [
      {
        id: 'hc-1',
        name: '合规要求严格',
        description: '医药营销合规红线多，传统营销方式风险高，数字化转型迫在眉睫',
        severity: 'critical',
      },
      {
        id: 'hc-2',
        name: '患者管理难',
        description: '患者流失率高，复诊随访不及时，患者旅程缺乏系统性管理',
        severity: 'critical',
      },
      {
        id: 'hc-3',
        name: '医生触达效率低',
        description: '传统线下拜访成本高、效率低，合规限制下数字化医生运营能力不足',
        severity: 'high',
      },
      {
        id: 'hc-4',
        name: '数据价值未释放',
        description: '临床数据、患者数据、运营数据分散，无法形成有价值的洞察',
        severity: 'high',
      },
      {
        id: 'hc-5',
        name: '医院运营效率低',
        description: '门诊排队久、住院流程繁、行政效率低，患者和医护体验都不好',
        severity: 'medium',
      },
    ],
    cases: [
      {
        company: '某三甲医院',
        industry: '公立医院',
        result: '智慧医院与患者服务升级',
        metrics: ['平均就诊时间缩短 60%', '患者满意度从72分提升至91分', '门诊人均效率提升 40%'],
        quote: '以前患者抱怨"排队3小时看病3分钟"，现在我们把非诊疗环节全部线上化，医生可以专注看病。',
      },
      {
        company: '某知名药企',
        industry: '制药企业',
        result: '数字化营销合规转型',
        metrics: ['医生触达效率提升 3倍', '会议参会率提升 50%', '营销合规风险降至近零'],
      },
      {
        company: '某连锁体检中心',
        industry: '健康管理',
        result: '用户全生命周期健康运营',
        metrics: ['体检复购率提升 45%', '增值服务转化率提升 38%', '用户NPS提升 25分'],
      },
    ],
    scripts: {
      greeting: '{name}总好！医疗健康行业现在正处在快速变革期，一方面合规要求越来越严，另一方面患者和医生的服务需求也在不断升级。我们服务了多家三甲医院、知名药企和连锁医疗机构，在合规前提下做数字化运营有不少成熟经验。',
      painPointLeadIn: '医疗健康行业现在面临几大挑战：一是合规红线，医药营销和患者数据管理稍有不慎就踩雷；二是患者流失，看病后就失联，复诊随访和慢病管理跟不上；三是医生运营成本高，传统拜访模式效率低、效果难衡量。不知道您这边现在最关注哪个方面？',
      valueProposition: '我们在医疗健康行业的核心能力：第一，全流程合规保障，从数据存储到营销行为全部符合行业监管要求，让您放心用；第二，患者全生命周期运营，从首诊、复诊、慢病管理到健康管理，每个节点都有精准触达；第三，数字化医生运营，学术会议、在线教育、KOL管理一体化，效率高、合规、效果可衡量。',
      closing: '像您同行业的{example}，用了我们的方案，{metric}。我可以把完整的医疗行业解决方案发给您参考，或者安排我们的医疗行业顾问和您详细交流？',
    },
  },
  {
    id: 'education',
    name: '教育培训',
    description: 'K12教育、职业教育、高等教育、素质教育、企业培训等',
    icon: '📚',
    color: 'from-amber-500 to-orange-600',
    keywords: ['教育', '培训', '学校', '在线教育', '职业教育', 'K12', '素质教育', '高教', '企业培训', '学习', '课程'],
    scenarios: ['学员增长', '学习体验', '续报转化', '教务管理', '教学效果'],
    terms: [
      { term: '完课率', explanation: '学员完成课程的比例' },
      { term: '续报率', explanation: '当期学员续报下一期课程的比例' },
      { term: '转介绍率', explanation: '老学员带来新学员的比例' },
      { term: 'LMS（学习管理系统）', explanation: '在线课程学习和管理平台' },
      { term: '学情分析', explanation: '基于学习数据对学员学习情况进行的分析' },
      { term: '双师课堂', explanation: '直播主讲老师+线下辅导老师结合的教学模式' },
    ],
    painPoints: [
      {
        id: 'edu-1',
        name: '获客成本高企',
        description: '在线投放成本飙升，单客获客成本动辄数千元，远超行业平均客单价',
        severity: 'critical',
      },
      {
        id: 'edu-2',
        name: '完课率和续报率低',
        description: '学员买了课不学、学了不续，营收靠不断拉新，越做越亏',
        severity: 'critical',
      },
      {
        id: 'edu-3',
        name: '教学效果难量化',
        description: '教学效果靠家长口碑和主观感受，缺乏数据支撑，难以优化和证明价值',
        severity: 'high',
      },
      {
        id: 'edu-4',
        name: '教务运营低效',
        description: '排课、考勤、作业、测评靠人工管理，老师和教务团队大量精力消耗在行政事务上',
        severity: 'high',
      },
      {
        id: 'edu-5',
        name: '转介绍增长乏力',
        description: '老学员满意度不高、激励机制不完善，口碑增长飞轮转不起来',
        severity: 'medium',
      },
    ],
    cases: [
      {
        company: '某头部职业教育公司',
        industry: '职业教育',
        result: '学员全生命周期运营',
        metrics: ['完课率提升 35个百分点', '续报率提升 48%', '转介绍率从12%提升至38%'],
        quote: '以前我们把90%的精力花在拉新上，现在把50%的精力放在老学员运营，反而增长更快了。',
      },
      {
        company: '某知名素质教育品牌',
        industry: '素质教育',
        result: '数据驱动的教学与运营',
        metrics: ['学员平均学习时长增加 60%', '家长满意度提升 30%', '教务人效提升 2.5倍'],
      },
      {
        company: '某大型企业大学',
        industry: '企业培训',
        result: '数字化培训体系建设',
        metrics: ['员工培训覆盖率从40%提升至95%', '人均年学习时长增加 3倍', '培训ROI提升 200%'],
      },
    ],
    scripts: {
      greeting: '{name}总好！教育培训行业现在面临很大的转型压力，传统的烧钱获客模式走不通了，越来越多机构开始转向精细化运营和口碑增长。我们服务了多家职教、素质教育和企业培训客户，在学员留存、续报和转介绍方面有成熟的方法论。',
      painPointLeadIn: '教育行业现在的核心痛点其实很集中：一是获客越来越贵，靠投放拉新亏得一塌糊涂；二是完课率低、续报率低，学员生命周期价值做不起来；三是转介绍没方法，老学员口碑没转化成增长动力。您这边现在最大的压力来自哪里？',
      valueProposition: '我们帮教育机构打造"留存驱动增长"的飞轮：第一，学员学习全链路数据化，完课率、互动率、掌握度实时监控，自动识别高流失风险学员，老师可以精准干预；第二，智能化教务运营，排课、考勤、作业、测评、证书全部自动化，让老师把精力回归教学；第三，数据驱动的续报和转介绍，基于学员学习数据做个性化沟通和激励，把满意学员变成您的销售。',
      closing: '像{example}这样的教育机构，用了我们的方案，{metric}。我可以把完整的教育行业解决方案和案例发给您看看？',
    },
  },
  {
    id: 'logistics',
    name: '物流供应链',
    description: '物流、快递、仓储、供应链、跨境电商物流等',
    icon: '🚚',
    color: 'from-cyan-500 to-sky-600',
    keywords: ['物流', '供应链', '仓储', '快递', '运输', '货运', '配送', '跨境', '电商物流', '冷链', '库存'],
    scenarios: ['仓储管理', '运输优化', '供应链协同', '库存优化', '物流成本控制'],
    terms: [
      { term: 'TMS（运输管理系统）', explanation: '运输计划、执行、监控和优化的系统' },
      { term: 'WMS（仓储管理系统）', explanation: '仓库作业和库存管理系统' },
      { term: '3PL/4PL', explanation: '第三方/第四方物流服务商' },
      {
        term: 'SKU（库存保有单位）',
        explanation: '区分不同商品属性的最小库存单位',
      },
      { term: '在途库存', explanation: '处于运输过程中的库存' },
      { term: '牛鞭效应', explanation: '供应链需求信息从下游到上游不断放大的现象' },
    ],
    painPoints: [
      {
        id: 'log-1',
        name: '物流成本高',
        description: '仓储、运输、人工成本持续上涨，物流费用占营收比例远超行业标杆',
        severity: 'critical',
      },
      {
        id: 'log-2',
        name: '库存管理混乱',
        description: '库存不准、缺货与积压并存，周转率低，资金占用严重',
        severity: 'critical',
      },
      {
        id: 'log-3',
        name: '运输效率低',
        description: '车辆装载率低、路线不合理、在途信息不透明，时效和成本都不达标',
        severity: 'high',
      },
      {
        id: 'log-4',
        name: '上下游协同差',
        description: '与供应商、客户、物流服务商信息不互通，计划跟不上变化，牛鞭效应明显',
        severity: 'high',
      },
      {
        id: 'log-5',
        name: '异常处理被动',
        description: '延误、破损、丢件等异常靠客户投诉才发现，处理不及时，客户体验差',
        severity: 'medium',
      },
    ],
    cases: [
      {
        company: '某全国性第三方物流企业',
        industry: '3PL',
        result: '数字化仓储与运输一体化',
        metrics: ['仓储作业效率提升 55%', '车辆装载率从65%提升至88%', '物流成本降低 28%'],
        quote: '以前靠人盯人管理，现在靠系统自动调度、智能预警，管理半径扩大了3倍。',
      },
      {
        company: '某快消品牌',
        industry: '快消供应链',
        result: '全渠道供应链协同',
        metrics: ['库存周转天数减少 40%', '订单满足率从82%提升至97%', '缺货率下降 75%'],
      },
      {
        company: '某跨境电商平台',
        industry: '跨境物流',
        result: '全球供应链可视化',
        metrics: ['全程时效缩短 30%', '异常处理时效从24h到2h', '客户投诉率下降 60%'],
      },
    ],
    scripts: {
      greeting: '{name}总好！现在物流供应链行业的压力越来越大，成本上涨、客户要求提高、竞争加剧，很多企业都在寻求通过数字化降本增效。我们服务了多家第三方物流、品牌企业供应链和跨境物流企业，积累了不少实战经验。',
      painPointLeadIn: '物流供应链行业普遍面临这几个痛点：一是成本高，仓储运输人工什么都在涨，利润被不断压缩；二是库存乱，该有的没有、不该有的堆着，周转不动；三是效率低，车没装满、路没走好、在途看不见，客户天天催单。不知道您这边哪个问题最严重？',
      valueProposition: '我们帮物流企业和企业供应链实现"降本增效看得见"：第一，仓储作业数字化，从入库到出库全流程条码/RFID管理，准确率99.9%+，人效翻倍；第二，智能运输调度，AI优化装载和路线，装载率和时效双提升；第三，供应链全链路可视化，从供应商到客户全程透明，异常自动预警，不再被动救火。',
      closing: '像您同行业的{example}，用了我们的方案后，{metric}。您方便的话，我可以安排供应链行业专家和您深入交流，帮您做个诊断？',
    },
  },
  {
    id: 'energy',
    name: '能源',
    description: '电力、石油、石化、煤炭、新能源等能源企业',
    icon: '⚡',
    color: 'from-yellow-500 to-amber-600',
    keywords: ['能源', '电力', '石油', '石化', '煤炭', '新能源', '光伏', '风电', '储能', '电网', '发电', '双碳'],
    scenarios: ['安全生产', '设备巡检', '能源管理', '碳资产管理', '智慧电厂'],
    terms: [
      { term: '双碳目标', explanation: '碳达峰与碳中和目标' },
      { term: 'ESG', explanation: '环境、社会和公司治理，非财务绩效评价体系' },
      { term: 'IoT（物联网）', explanation: '设备互联、数据自动采集的技术' },
      { term: '预测性维护', explanation: '基于设备运行数据预测故障并提前维护' },
      { term: '虚拟电厂', explanation: '聚合分布式能源参与电网调度的商业模式' },
      { term: '能耗管理', explanation: '对能源消耗进行监测、分析和优化的管理活动' },
    ],
    painPoints: [
      {
        id: 'eng-1',
        name: '安全生产压力大',
        description: '能源行业高危作业多，安全事故后果严重，人工巡检效率低、风险高',
        severity: 'critical',
      },
      {
        id: 'eng-2',
        name: '设备管理粗放',
        description: '设备故障停机损失大，定期维护过度检修、事后维修又措手不及',
        severity: 'critical',
      },
      {
        id: 'eng-3',
        name: '双碳合规压力',
        description: '碳减排目标明确，碳数据统计和碳资产管理能力不足，面临合规和转型压力',
        severity: 'high',
      },
      {
        id: 'eng-4',
        name: '能源利用效率低',
        description: '能耗数据不透明，浪费严重，节能降耗缺乏数据支撑和优化手段',
        severity: 'high',
      },
      {
        id: 'eng-5',
        name: '人员技能断层',
        description: '老员工经验难以传承，新员工上手慢，现场作业质量不稳定',
        severity: 'medium',
      },
    ],
    cases: [
      {
        company: '某大型发电集团',
        industry: '火力发电',
        result: '智慧电厂建设',
        metrics: ['设备非计划停机减少 60%', '巡检效率提升 4倍', '单位煤耗下降 3.2%'],
        quote: '以前靠老师傅经验判断设备状态，现在AI提前一周就能预警故障，生产安全有了实打实的保障。',
      },
      {
        company: '某头部新能源企业',
        industry: '光伏/风电',
        result: '新能源电站远程运维',
        metrics: ['运维人员现场出勤减少 70%', '发电量提升 8%', '电站寿命延长 2-3年'],
      },
      {
        company: '某高耗能制造企业',
        industry: '工业能源管理',
        result: '能源管理与碳资产数字化',
        metrics: ['综合能耗下降 15%', '碳数据统计效率提升 10倍', '碳资产收益增加 25%'],
      },
    ],
    scripts: {
      greeting: '{name}总好！能源行业现在正处在深刻变革期，一方面安全生产和双碳目标压力巨大，另一方面数字化转型也带来了前所未有的效率提升空间。我们服务了多家发电集团、新能源企业和高耗能企业，在安全生产、设备管理和能源优化方面有成熟方案。',
      painPointLeadIn: '能源企业现在的核心挑战：一是安全，高危作业和设备故障时刻威胁着人员和生产安全；二是效率，设备管理和能源利用都偏粗放，浪费严重；三是合规，双碳目标下碳管理能力跟不上。不知道您这边现在最关注的是哪块？',
      valueProposition: '我们为能源行业提供"安全+效率+合规"三位一体的数字化方案：第一，安全生产数字化，IoT+AI实现设备预测性维护和智能巡检，把事故消灭在萌芽状态；第二，能源管理可视化，从采集、分析到优化全链路闭环，节能降耗看得见、算得清；第三，双碳管理一体化，碳足迹自动核算、碳资产智能管理，满足合规要求、挖掘碳收益。',
      closing: '像您同行业的{example}，通过我们的方案实现了{metric}。我可以把完整的能源行业解决方案发给您参考？',
    },
  },
  {
    id: 'realestate',
    name: '房地产/建筑',
    description: '房地产开发、建筑施工、物业管理、建筑装饰等',
    icon: '🏗️',
    color: 'from-stone-500 to-neutral-600',
    keywords: ['房地产', '建筑', '地产', '物业', '工程', '施工', '装修', '建材', '开发商', '楼盘', '置业', '工程管理'],
    scenarios: ['项目管理', '客户营销', '物业服务', '成本管控', '工程协同'],
    terms: [
      { term: 'BIM（建筑信息模型）', explanation: '建筑的数字化三维模型和信息载体' },
      { term: '去化率', explanation: '一定时间段内已销售房源占总房源的比例' },
      { term: '客储/货值', explanation: '意向客户储备/可售房源的市场价值' },
      { term: 'PMBOK', explanation: '项目管理知识体系' },
      { term: 'EPC（工程总承包）', explanation: '设计、采购、施工一体化总承包模式' },
      { term: '智慧工地', explanation: '运用信息化手段实现施工现场智能化管理' },
    ],
    painPoints: [
      {
        id: 're-1',
        name: '项目管控不力',
        description: '进度、成本、质量三大目标失控，项目延期、超支、质量问题频发',
        severity: 'critical',
      },
      {
        id: 're-2',
        name: '营销转化低',
        description: '获客成本高、意向客户跟进混乱、去化速度慢，回款压力大',
        severity: 'critical',
      },
      {
        id: 're-3',
        name: '多方协同低效',
        description: '建设方、设计方、施工方、监理方信息不互通，扯皮推诿多，内耗严重',
        severity: 'high',
      },
      {
        id: 're-4',
        name: '物业管理粗放',
        description: '业主投诉处理慢、物业费收缴率低、增值服务做不起来，物业亏损',
        severity: 'high',
      },
      {
        id: 're-5',
        name: '成本管控难',
        description: '设计变更、现场签证频繁，成本超支严重，项目利润被不断侵蚀',
        severity: 'medium',
      },
    ],
    cases: [
      {
        company: '某头部房企',
        industry: '房地产开发',
        result: '项目全生命周期数字化管理',
        metrics: ['项目延期率下降 70%', '动态成本偏差率控制在2%以内', '楼盘平均去化周期缩短 40%'],
        quote: '以前项目信息靠开会汇报，现在手机就能看到每个项目的真实进度、成本和风险，管理简单多了。',
      },
      {
        company: '某大型建筑集团',
        industry: '建筑施工',
        result: '智慧工地与项目协同',
        metrics: ['安全事故率下降 80%', '人均工效提升 35%', '返工率下降 50%'],
      },
      {
        company: '某上市物业公司',
        industry: '物业管理',
        result: '智慧社区与增值服务',
        metrics: ['物业费收缴率从75%提升至92%', '业主满意度提升 35分', '增值服务收入占比达到18%'],
      },
    ],
    scripts: {
      greeting: '{name}总好！房地产和建筑行业现在从高速发展转向高质量发展，精细化管理能力越来越重要。我们服务了多家头部房企、建筑集团和物业公司，在项目管控、营销去化和物业服务方面帮助客户取得了实实在在的效果。',
      painPointLeadIn: '地产建筑行业现在的痛点：一是项目管不住，进度延期、成本超支、质量问题一堆；二是房子卖不动，获客越来越贵、客户跟进混乱、去化速度慢；三是物业做不好，业主不满意、收费率低、还亏钱。不知道您这边当前最大的压力来自哪里？',
      valueProposition: '我们为地产建筑行业提供全链路数字化解决方案：第一，项目精细化管控，进度、成本、质量、安全实时在线，风险自动预警，不再靠人盯人；第二，全渠道营销去化，从获客、跟进、转化到老业主转介绍，每个环节数据化驱动，去化速度提上去；第三，物业增值运营，智慧社区+业主服务+增值变现，让物业从成本中心变成利润中心。',
      closing: '像您同行业的{example}，通过我们的方案实现了{metric}。您方便的话，我可以安排我们的地产行业专家和您做个深度交流？',
    },
  },
  {
    id: 'automotive',
    name: '汽车',
    description: '整车制造、汽车零部件、汽车销售、新能源车、汽车后市场等',
    icon: '🚗',
    color: 'from-red-500 to-rose-600',
    keywords: ['汽车', '整车', '零部件', '新能源', '电动车', '智能驾驶', '4S店', '经销商', '车联网', '汽车后市场', '造车'],
    scenarios: ['智能制造', '经销商管理', '用户运营', '供应链协同', '智能网联'],
    terms: [
      { term: 'OEM（整车厂）', explanation: '原始设备制造商，即整车生产企业' },
      { term: 'Tier 1/2', explanation: '一级/二级汽车零部件供应商' },
      { term: 'OTA（空中下载）', explanation: '通过网络对车辆软件进行远程升级' },
      { term: 'ADAS（高级驾驶辅助）', explanation: '辅助驾驶员进行驾驶操作的汽车系统' },
      { term: 'DMS（经销商管理系统）', explanation: '管理汽车经销商销售、服务、配件等业务的系统' },
      { term: '用户运营', explanation: '车企直接面向车主进行的全生命周期运营活动' },
    ],
    painPoints: [
      {
        id: 'auto-1',
        name: '供应链波动大',
        description: '芯片短缺、原材料涨价、物流不稳定，生产计划频繁调整，交付受影响',
        severity: 'critical',
      },
      {
        id: 'auto-2',
        name: '经销商管理难',
        description: '经销商数据不透明、库存和价格管控难、客户被渠道截留，品牌方对终端掌控力弱',
        severity: 'critical',
      },
      {
        id: 'auto-3',
        name: '用户运营缺失',
        description: '卖完车就失联，用户数据分散在经销商和各个系统，无法直接触达和运营',
        severity: 'high',
      },
      {
        id: 'auto-4',
        name: '软件定义汽车挑战',
        description: '智能化软件成为汽车核心竞争力，但软件迭代、OTA、数据安全等能力不足',
        severity: 'high',
      },
      {
        id: 'auto-5',
        name: '质量追溯复杂',
        description: '供应链层级多，出现质量问题追溯慢、范围大，召回成本和品牌损失严重',
        severity: 'medium',
      },
    ],
    cases: [
      {
        company: '某新能源车企',
        industry: '新能源汽车',
        result: '用户直连与全生命周期运营',
        metrics: ['APP月活用户占比达到 75%', '用户转介绍率提升至 28%', '售后服务满意度提升 40%'],
        quote: '以前我们把车卖给4S店就不管了，现在每个车主都是我们的用户，数据驱动的直连运营让品牌真正有了温度。',
      },
      {
        company: '某头部整车厂',
        industry: '传统整车制造',
        result: '智能制造与供应链协同',
        metrics: ['订单交付周期缩短 30%', '库存周转天数减少 25%', '供应链异常响应时间从2天到2小时'],
      },
      {
        company: '某汽车经销商集团',
        industry: '汽车经销商',
        result: '经销商数字化升级',
        metrics: ['新车转化率提升 25%', '售后进厂台次增加 35%', '客户流失率下降 20%'],
      },
    ],
    scripts: {
      greeting: '{name}总好！汽车行业现在正经历百年未有之大变局，电动化、智能化、用户直连正在重塑整个行业格局。我们服务了多家新能源车企、传统整车厂和经销商集团，在智能制造、用户运营和渠道管理方面有丰富的实战经验。',
      painPointLeadIn: '汽车行业现在的核心挑战：一是供应链不稳定，芯片、原材料、物流什么都在波动，生产和交付计划被打乱；二是渠道掌控力弱，用户数据在经销商手里，品牌方跟用户失联；三是软件定义汽车带来的新挑战，软件迭代、OTA、用户运营能力跟不上。不知道您这边当前最关注的是什么？',
      valueProposition: '我们为汽车行业提供"制造+渠道+用户"全链路数字化方案：第一，智能制造与供应链协同，从客户订单到生产排程到零部件供应全链路打通，灵活应对波动；第二，经销商赋能与管控，DMS+数据中台，让渠道数据透明、运营可控；第三，用户直连运营，统一用户ID、全渠道触点、数据驱动的个性化运营，把卖车变成服务的开始。',
      closing: '像{example}这样的车企，用了我们的方案后，{metric}。我可以把完整的汽车行业解决方案发给您，或者安排行业专家和您深入交流？',
    },
  },
  {
    id: 'telecom',
    name: '通信',
    description: '电信运营商、通信设备、ICT服务、云计算等',
    icon: '📡',
    color: 'from-indigo-500 to-blue-600',
    keywords: ['通信', '电信', '运营商', '移动', '联通', '5G', 'ICT', '云网', 'IDC', '通信设备', '基站'],
    scenarios: ['客户经营', '网络运维', '政企业务', '数字化转型', '云网融合'],
    terms: [
      { term: 'ARPU（每用户平均收入）', explanation: '每个用户平均贡献的收入' },
      { term: '离网率', explanation: '一定时间段内流失用户占比' },
      { term: '政企业务（B2B）', explanation: '面向政府和企业客户的通信与信息化服务业务' },
      { term: '云网融合', explanation: '云计算与通信网络一体化的服务模式' },
      { term: '家宽/移网', explanation: '家庭宽带/移动网络业务' },
      { term: '运维（OAM）', explanation: '网络运行、管理和维护' },
    ],
    painPoints: [
      {
        id: 'tel-1',
        name: '传统业务增长见顶',
        description: '个人通信业务ARPU持续下滑，流量红利消失，离网率居高不下',
        severity: 'critical',
      },
      {
        id: 'tel-2',
        name: '政企业务增长瓶颈',
        description: '政企客户经理人效低、项目复制难、方案能力不足，增长依赖关系型销售',
        severity: 'critical',
      },
      {
        id: 'tel-3',
        name: '网络运维成本高',
        description: '网络规模越来越大，运维人员增长跟不上，故障定位慢、客户投诉多',
        severity: 'high',
      },
      {
        id: 'tel-4',
        name: '渠道协同差',
        description: '营业厅、APP、热线、客户经理各渠道体验不一致，数据不互通',
        severity: 'high',
      },
      {
        id: 'tel-5',
        name: '数字化转型落地难',
        description: '系统多、数据散、烟囱林立，新业务上线慢，IT跟不上业务需求',
        severity: 'medium',
      },
    ],
    cases: [
      {
        company: '某省级运营商',
        industry: '电信运营商',
        result: '全渠道客户经营数字化',
        metrics: ['个人用户ARPU提升 12%', '离网率下降 35%', '线上业务办理占比从40%提升至78%'],
        quote: '以前我们靠人海战术发展客户，现在靠数据驱动的精准运营，每个用户的需求我们都能提前感知。',
      },
      {
        company: '某运营商政企事业部',
        industry: '政企业务',
        result: '政企销售赋能与项目管理',
        metrics: ['政企客户经理人效提升 50%', '项目中标率提升 20个百分点', '项目交付周期缩短 30%'],
      },
      {
        company: '某通信设备商',
        industry: '通信设备',
        result: '智能运维与服务',
        metrics: ['故障定位时间从小时级缩短至分钟级', '运维人效提升 3倍', '客户满意度提升 28%'],
      },
    ],
    scripts: {
      greeting: '{name}总好！通信行业现在面临很大的转型压力，传统业务增长见顶，政企业务竞争激烈，云网融合和数字化转型成为新的增长引擎。我们服务了多家省级运营商和通信企业，在客户经营、政企业务和智能运维方面有成熟的方案。',
      painPointLeadIn: '通信行业现在的挑战：一是C端增长见顶，ARPU下滑、用户流失严重；二是B端增长吃力，政企销售靠关系、靠人堆，效率低、复制难；三是运维压力大，网络越来越复杂，故障处理跟不上。不知道您这边当前的重点是什么？',
      valueProposition: '我们帮通信企业做好三件事：第一，C端精细化运营，全渠道数据打通、AI用户画像、精准营销触达，ARPU提上去、离网率降下来；第二，政企销售赋能，从商机挖掘、方案匹配到项目交付全流程数字化，让每个客户经理都成为金牌销售；第三，智能运维升级，AI故障预测和根因分析，让运维从被动救火变主动预防。',
      closing: '像您同行业的{example}，用了我们的方案，{metric}。我可以把完整的通信行业解决方案发给您参考？',
    },
  },
  {
    id: 'media',
    name: '传媒/营销',
    description: '广告、传媒、营销服务、内容创作、MCN、公关等',
    icon: '📺',
    color: 'from-fuchsia-500 to-pink-600',
    keywords: ['传媒', '广告', '营销', '文化', '娱乐', 'MCN', '内容', '公关', '品牌', '新媒体', '短视频', '直播'],
    scenarios: ['内容生产', '客户服务', '数据归因', '项目管理', '商业化变现'],
    terms: [
      { term: 'ROI（投资回报率）', explanation: '营销投入与产出的比值' },
      { term: 'KPI（关键绩效指标）', explanation: '衡量工作成果的核心指标' },
      { term: 'CTR/CVR', explanation: '点击率/转化率，营销效果衡量指标' },
      { term: 'DAU/MAU', explanation: '日活跃用户数/月活跃用户数' },
      { term: '品效合一', explanation: '品牌建设和效果营销同时达成的营销理念' },
      { term: 'AIGC（AI生成内容）', explanation: '利用AI技术自动生成内容的生产方式' },
    ],
    painPoints: [
      {
        id: 'med-1',
        name: '客户要求越来越高',
        description: '客户既要品又要效，效果归因要求越来越精细， Agency利润不断被挤压',
        severity: 'critical',
      },
      {
        id: 'med-2',
        name: '内容生产效率低',
        description: '创意靠灵感、生产靠人工，内容产出速度跟不上平台和客户需求',
        severity: 'critical',
      },
      {
        id: 'med-3',
        name: '项目管理混乱',
        description: '多客户多项目并行，进度、成本、质量难管控，项目经常返工和延期',
        severity: 'high',
      },
      {
        id: 'med-4',
        name: '人才依赖严重',
        description: '核心创意和客户资源掌握在少数人手里，人员流失对业务影响大',
        severity: 'high',
      },
      {
        id: 'med-5',
        name: '商业化模式单一',
        description: '主要靠服务费/佣金赚钱，缺乏数据资产和技术产品带来的长期价值',
        severity: 'medium',
      },
    ],
    cases: [
      {
        company: '某知名广告公司',
        industry: '广告营销',
        result: 'AI赋能的全链路营销服务',
        metrics: ['内容产出效率提升 3倍', '客户平均营销ROI提升 45%', '客户续约率从60%提升至85%'],
        quote: '以前我们靠创意人和执行团队堆人做项目，现在AI帮我们处理80%的基础性工作，团队可以专注在高价值的策略和创意上。',
      },
      {
        company: '某头部MCN机构',
        industry: '内容MCN',
        result: '达人矩阵与内容工业化生产',
        metrics: ['达人签约数增长 200%', '爆款内容产出率提升 3倍', '广告营收增长 180%'],
      },
      {
        company: '某品牌内容中台',
        industry: '品牌营销',
        result: '品牌内容资产管理与数据归因',
        metrics: ['内容复用率从20%提升至60%', '营销效果归因准确率提升 2倍', '营销决策效率提升 4倍'],
      },
    ],
    scripts: {
      greeting: '{name}总好！传媒营销行业现在变化特别快，AI冲击、客户需求升级、平台规则调整，每个都在倒逼行业升级。我们服务了多家广告公司、MCN机构和品牌营销团队，在AI赋能内容生产、营销数据归因和项目管理方面积累了不少成功经验。',
      painPointLeadIn: '传媒营销行业现在的痛点：一是客户越来越难伺候，既要品又要效，还要把每一分钱的去向都说清楚；二是内容生产压力大，短视频、直播、图文，平台越来越多，需求越来越大，创意和产能跟不上；三是项目管理乱，多客户多项目并行，进度、成本、质量全靠项目经理个人能力。不知道您这边哪个最痛？',
      valueProposition: '我们帮传媒营销企业实现"降本增效+价值升级"：第一，AI内容生产助手，AIGC生成初稿、智能剪辑、批量投放，把团队从重复劳动中解放出来；第二，全链路营销数据归因，从曝光到转化全链路打通，让效果看得见、算得清，客户更满意；第三，项目管理数字化，从brief、创意、执行到复盘全流程在线，让每个项目都可控、可复制。',
      closing: '像您同行业的{example}，用了我们的方案，{metric}。我可以把完整的传媒营销行业方案发给您参考？',
    },
  },
];

export function getIndustryById(id: string): Industry | undefined {
  return industries.find((i) => i.id === id);
}

export function getIndustryByName(name: string): Industry | undefined {
  return industries.find(
    (i) =>
      name.includes(i.name) ||
      i.keywords.some((k) => name.includes(k))
  );
}

export function detectIndustryFromText(text: string): Industry | undefined {
  const lower = text.toLowerCase();
  for (const industry of industries) {
    if (
      lower.includes(industry.name.toLowerCase()) ||
      industry.keywords.some((k) => lower.includes(k.toLowerCase()))
    ) {
      return industry;
    }
  }
  return undefined;
}
