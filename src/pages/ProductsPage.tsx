import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  Swords,
  Settings,
  Image as ImageIcon,
  X,
  Check,
  ChevronDown,
  ChevronUp,
  Building2,
  Tag,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useProductStore } from '@/store/useProductStore';
import type { Product, Competitor } from '@/types';
import { industries } from '@/data/industries';

type TabType = 'products' | 'competitors';

export default function ProductsPage() {
  const { products, competitors, initMockData, addProduct, updateProduct, deleteProduct, addCompetitor, updateCompetitor, deleteCompetitor, searchProducts, searchCompetitors } = useProductStore();
  const [activeTab, setActiveTab] = useState<TabType>('products');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [showProductModal, setShowProductModal] = useState(false);
  const [showCompetitorModal, setShowCompetitorModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingCompetitor, setEditingCompetitor] = useState<Competitor | null>(null);
  const [selectedIndustry, setSelectedIndustry] = useState<string>('');

  useEffect(() => {
    initMockData();
  }, [initMockData]);

  const filteredProducts = searchProducts(searchKeyword, selectedIndustry || undefined);
  const filteredCompetitors = searchCompetitors(searchKeyword);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowProductModal(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowProductModal(true);
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm('确定要删除这个产品吗？')) {
      deleteProduct(productId);
    }
  };

  const handleAddCompetitor = () => {
    setEditingCompetitor(null);
    setShowCompetitorModal(true);
  };

  const handleEditCompetitor = (competitor: Competitor) => {
    setEditingCompetitor(competitor);
    setShowCompetitorModal(true);
  };

  const handleDeleteCompetitor = (competitorId: string) => {
    if (confirm('确定要删除这个竞品吗？')) {
      deleteCompetitor(competitorId);
    }
  };

  const stats = [
    { label: '产品总数', value: products.length, icon: Package, color: 'from-blue-500 to-indigo-600' },
    { label: '竞品数量', value: competitors.length, icon: Swords, color: 'from-orange-500 to-red-600' },
    { label: '覆盖行业', value: industries.length, icon: Building2, color: 'from-emerald-500 to-teal-600' },
    { label: '场景方案', value: 20, icon: Tag, color: 'from-purple-500 to-pink-600' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-5 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stat.value}</p>
                </div>
                <div className={cn('w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center text-white shadow-lg', stat.color)}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('products')}
              className={cn(
                'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2',
                activeTab === 'products'
                  ? 'bg-gradient-to-r from-blue-600 to-teal-500 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              )}
            >
              <Package className="w-4 h-4" />
              产品管理
            </button>
            <button
              onClick={() => setActiveTab('competitors')}
              className={cn(
                'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2',
                activeTab === 'competitors'
                  ? 'bg-gradient-to-r from-blue-600 to-teal-500 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              )}
            >
              <Swords className="w-4 h-4" />
              竞品管理
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="搜索..."
                className="w-64 pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
              />
            </div>
            <button
              onClick={activeTab === 'products' ? handleAddProduct : handleAddCompetitor}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 text-white text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4" />
              {activeTab === 'products' ? '添加产品' : '添加竞品'}
            </button>
          </div>
        </div>

        <div className="p-4">
          <AnimatePresence mode="wait">
            {activeTab === 'products' ? (
              <motion.div
                key="products"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                {selectedIndustry && (
                  <div className="mb-4 flex items-center gap-2">
                    <span className="text-sm text-slate-500">行业筛选：</span>
                    <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                      {industries.find(i => i.id === selectedIndustry)?.name || '全部'}
                      <button onClick={() => setSelectedIndustry('')} className="ml-2 hover:text-blue-900">
                        <X className="w-3 h-3 inline" />
                      </button>
                    </span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredProducts.map((product, idx) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      index={idx}
                      onEdit={handleEditProduct}
                      onDelete={handleDeleteProduct}
                    />
                  ))}
                </div>

                {filteredProducts.length === 0 && (
                  <div className="py-16 text-center">
                    <Package className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-500 dark:text-slate-400">暂无匹配的产品</p>
                    <button
                      onClick={handleAddProduct}
                      className="mt-4 text-blue-600 text-sm font-medium hover:underline"
                    >
                      + 添加第一个产品
                    </button>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="competitors"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-3"
              >
                {filteredCompetitors.map((competitor, idx) => (
                  <CompetitorItem
                    key={competitor.id}
                    competitor={competitor}
                    index={idx}
                    onEdit={handleEditCompetitor}
                    onDelete={handleDeleteCompetitor}
                  />
                ))}

                {filteredCompetitors.length === 0 && (
                  <div className="py-16 text-center">
                    <Swords className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-500 dark:text-slate-400">暂无匹配的竞品</p>
                    <button
                      onClick={handleAddCompetitor}
                      className="mt-4 text-blue-600 text-sm font-medium hover:underline"
                    >
                      + 添加第一个竞品
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {showProductModal && (
        <ProductModal
          product={editingProduct}
          onClose={() => setShowProductModal(false)}
          onSave={(data) => {
            if (editingProduct) {
              updateProduct(editingProduct.id, data);
            } else {
              addProduct(data as any);
            }
            setShowProductModal(false);
          }}
        />
      )}

      {showCompetitorModal && (
        <CompetitorModal
          competitor={editingCompetitor}
          onClose={() => setShowCompetitorModal(false)}
          onSave={(data) => {
            if (editingCompetitor) {
              updateCompetitor(editingCompetitor.id, data);
            } else {
              addCompetitor(data as any);
            }
            setShowCompetitorModal(false);
          }}
        />
      )}
    </div>
  );
}

function ProductCard({ product, index, onEdit, onDelete }: { product: Product; index: number; onEdit: (p: Product) => void; onDelete: (id: string) => void }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group relative rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
    >
      <div className="relative h-36 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-slate-400">
            <ImageIcon className="w-12 h-12" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1.5">
          <button
            onClick={() => onEdit(product)}
            className="p-2 rounded-lg bg-white/90 backdrop-blur-sm text-slate-600 hover:bg-white hover:text-blue-600 transition-colors shadow-md"
            title="编辑"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(product.id)}
            className="p-2 rounded-lg bg-white/90 backdrop-blur-sm text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors shadow-md"
            title="删除"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <div className="absolute bottom-3 left-3 right-3">
          <h4 className="text-base font-bold text-white drop-shadow-md">{product.name}</h4>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{product.description}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="text-xs text-slate-400">价格</span>
            <span className="text-sm font-bold text-amber-600 dark:text-amber-400">
              ¥{(product.priceFrom / 1000).toFixed(1)}k
            </span>
            <span className="text-xs text-slate-400">~ ¥{(product.priceTo / 1000).toFixed(1)}k</span>
          </div>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-xs text-blue-600 font-medium"
        >
          {expanded ? '收起详情' : '查看详情'}
          {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden space-y-3 pt-2 border-t border-slate-100 dark:border-slate-700"
            >
              <div>
                <p className="text-xs font-semibold text-slate-500 mb-1.5">适用行业</p>
                <div className="flex flex-wrap gap-1">
                  {product.targetIndustries.slice(0, 4).map((ind) => (
                    <span key={ind} className="px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-medium">
                      {industries.find(i => i.id === ind)?.name || ind}
                    </span>
                  ))}
                  {product.targetIndustries.length > 4 && (
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 text-[10px]">
                      +{product.targetIndustries.length - 4}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-500 mb-1.5">适用场景</p>
                <div className="flex flex-wrap gap-1">
                  {product.targetScenarios.slice(0, 3).map((sc) => (
                    <span key={sc} className="px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 text-[10px] font-medium">
                      {sc}
                    </span>
                  ))}
                  {product.targetScenarios.length > 3 && (
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 text-[10px]">
                      +{product.targetScenarios.length - 3}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function CompetitorItem({ competitor, index, onEdit, onDelete }: { competitor: Competitor; index: number; onEdit: (c: Competitor) => void; onDelete: (id: string) => void }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden hover:shadow-md transition-all duration-300"
    >
      <div
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-4 p-4 cursor-pointer"
      >
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 flex items-center justify-center flex-shrink-0 overflow-hidden">
          {competitor.logoUrl ? (
            <img src={competitor.logoUrl} alt={competitor.name} className="w-full h-full object-cover" />
          ) : (
            <Swords className="w-5 h-5 text-orange-600 dark:text-orange-400" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-slate-800 dark:text-slate-100">{competitor.name}</h4>
            <span className="px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-[10px] font-medium">
              {competitor.diffPoints?.length || 0} 个差异点
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">{competitor.positioning}</p>
        </div>

        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(competitor); }}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 hover:text-blue-600 transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(competitor.id); }}
            className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-500 hover:text-red-600 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          {expanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
        </div>
      </div>

      <AnimatePresence>
        {expanded && competitor.diffPoints && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-slate-100 dark:border-slate-700"
          >
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 space-y-3">
              {competitor.diffPoints.map((point, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-500 to-red-500 text-white text-xs font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="font-medium text-sm text-slate-700 dark:text-slate-200">{point.dimension}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <p className="text-emerald-600 dark:text-emerald-400 font-medium mb-1">✓ 我们的优势</p>
                      <p className="text-slate-600 dark:text-slate-400">{point.ourAdvantage}</p>
                    </div>
                    <div>
                      <p className="text-red-600 dark:text-red-400 font-medium mb-1">✗ 对方劣势</p>
                      <p className="text-slate-600 dark:text-slate-400">{point.competitorWeakness}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function ProductModal({ product, onClose, onSave }: { product: Product | null; onClose: () => void; onSave: (data: Partial<Product>) => void }) {
  const [formData, setFormData] = useState<Partial<Product>>({
    name: product?.name || '',
    description: product?.description || '',
    imageUrl: product?.imageUrl || '',
    priceFrom: product?.priceFrom || 3980,
    priceTo: product?.priceTo || 29800,
    targetIndustries: product?.targetIndustries || [],
    targetScenarios: product?.targetScenarios || [],
    coreFeatures: product?.coreFeatures || [],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-800 rounded-2xl shadow-2xl"
      >
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">
            {product ? '编辑产品' : '添加产品'}
          </h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">产品名称 *</label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input w-full"
              placeholder="请输入产品名称"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">产品描述</label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input w-full min-h-[80px] resize-none"
              placeholder="请输入产品描述"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">产品图片 URL</label>
            <input
              type="text"
              value={formData.imageUrl || ''}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="input w-full"
              placeholder="https://..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">起始价格（元）</label>
              <input
                type="number"
                value={formData.priceFrom || 0}
                onChange={(e) => setFormData({ ...formData, priceFrom: Number(e.target.value) })}
                className="input w-full"
                min={0}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">最高价格（元）</label>
              <input
                type="number"
                value={formData.priceTo || 0}
                onChange={(e) => setFormData({ ...formData, priceTo: Number(e.target.value) })}
                className="input w-full"
                min={0}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-teal-500 shadow-md hover:shadow-lg transition-all"
            >
              <Check className="w-4 h-4 inline mr-1" />
              保存
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

function CompetitorModal({ competitor, onClose, onSave }: { competitor: Competitor | null; onClose: () => void; onSave: (data: Partial<Competitor>) => void }) {
  const [formData, setFormData] = useState<Partial<Competitor>>({
    name: competitor?.name || '',
    positioning: competitor?.positioning || '',
    logoUrl: competitor?.logoUrl || '',
    keywords: competitor?.keywords || [],
    diffPoints: competitor?.diffPoints || [],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-800 rounded-2xl shadow-2xl"
      >
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">
            {competitor ? '编辑竞品' : '添加竞品'}
          </h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">竞品名称 *</label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input w-full"
              placeholder="请输入竞品名称"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">市场定位</label>
            <textarea
              value={formData.positioning || ''}
              onChange={(e) => setFormData({ ...formData, positioning: e.target.value })}
              className="input w-full min-h-[60px] resize-none"
              placeholder="简要描述竞品的市场定位和特点"
              rows={2}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Logo URL</label>
            <input
              type="text"
              value={formData.logoUrl || ''}
              onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
              className="input w-full"
              placeholder="https://..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-teal-500 shadow-md hover:shadow-lg transition-all"
            >
              <Check className="w-4 h-4 inline mr-1" />
              保存
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
