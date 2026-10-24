/**
 * ADMIN PRODUCTS, RUG SIZES & MATERIAL QUALITY RATE MANAGER (`/admin/products`)
 * Phase 4 Locked File — Lets the shop owner add, edit, hide/show, or delete products
 * across all 16 categories, manage predefined sizes & fixed prices for Mode A
 * Machine-Made Rugs, and manage Material Quality Tiers & per-Sq.Ft. prices for
 * Mode B Custom-Measured Products.
 */
import React, { useEffect, useMemo, useState } from 'react';
import {
  Edit3,
  Eye,
  EyeOff,
  Layers,
  Plus,
  Ruler,
  Search,
  ShieldCheck,
  Trash2,
  X,
} from 'lucide-react';
import { CANONICAL_CATEGORIES } from '../../config/categoriesSeed';
import {
  Product,
  QualityTier,
  QualityVariant,
  RugSizeVariant,
} from '../../types/database.types';
import {
  deleteAdminProduct,
  fetchAdminProducts,
  saveAdminProduct,
  SaveProductPayload,
  toggleAdminProductStatus,
} from '../../services/adminProductService';
import { formatCurrencyINR } from '../../utils/pricingEngine';

export const AdminProductsManager: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);
  const [statusBanner, setStatusBanner] = useState<string | null>(null);

  // Form Editor State
  const [editingId, setEditingId] = useState<string | undefined>(undefined);
  const [categoryId, setCategoryId] = useState<string>(
    CANONICAL_CATEGORIES[0].id
  );
  const [title, setTitle] = useState<string>('');
  const [sku, setSku] = useState<string>('');
  const [shortDescription, setShortDescription] = useState<string>('');
  const [designStyle, setDesignStyle] = useState<string>('Modern Minimalist');
  const [roomType, setRoomType] = useState<string>('Living Room');
  const [primaryImageUrl, setPrimaryImageUrl] = useState<string>('');
  const [isFeatured, setIsFeatured] = useState<boolean>(false);
  const [isActive, setIsActive] = useState<boolean>(true);

  // Mode A Rug Sizes State
  const [rugSizes, setRugSizes] = useState<
    Omit<RugSizeVariant, 'id' | 'product_id'>[]
  >([]);

  // Mode B Quality Variants State
  const [qualityVariants, setQualityVariants] = useState<
    Omit<QualityVariant, 'id' | 'product_id'>[]
  >([]);

  useEffect(() => {
    void fetchAdminProducts().then(setProducts);
  }, []);

  const activeCategoryObj = useMemo(
    () =>
      CANONICAL_CATEGORIES.find((c) => c.id === categoryId) ||
      CANONICAL_CATEGORIES[0],
    [categoryId]
  );

  const isModeARug = activeCategoryObj.pricing_mode === 'FIXED_RUG';

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (
        selectedCategoryId !== 'ALL' &&
        p.category_id !== selectedCategoryId
      ) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const hay = `${p.title} ${p.sku || ''} ${p.design_style} ${
          p.category?.name || ''
        }`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [products, selectedCategoryId, searchQuery]);

  const openCreateModal = () => {
    setEditingId(undefined);
    const defaultCat =
      selectedCategoryId !== 'ALL'
        ? selectedCategoryId
        : CANONICAL_CATEGORIES[4].id; // Default to Wallpaper
    setCategoryId(defaultCat);
    setTitle('');
    setSku(`MOD-${Math.floor(100 + Math.random() * 900)}`);
    setShortDescription('');
    setDesignStyle('Modern Minimalist');
    setRoomType('Living Room');
    setPrimaryImageUrl(
      'https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=1000&q=80'
    );
    setIsFeatured(true);
    setIsActive(true);
    setRugSizes([
      { size_label: '4×6 ft', width_ft: 4, length_ft: 6, fixed_price: 4200, in_stock: true },
      { size_label: '5×8 ft', width_ft: 5, length_ft: 8, fixed_price: 6800, in_stock: true },
      { size_label: '6×9 ft', width_ft: 6, length_ft: 9, fixed_price: 9500, in_stock: true },
    ]);
    setQualityVariants([
      {
        quality_name: 'Standard Commercial Grade',
        quality_tier: 'Standard',
        specification_note: 'Durable residential finish',
        rate_per_sqft: 55,
        swatch_image_url: '',
        is_default: true,
      },
      {
        quality_name: 'Premium Washable Heavy Grade',
        quality_tier: 'Premium',
        specification_note: 'Moisture & stain resistant high-density grade',
        rate_per_sqft: 85,
        swatch_image_url: '',
        is_default: false,
      },
      {
        quality_name: 'Luxury Architectural Grade',
        quality_tier: 'Luxury',
        specification_note: 'Top-tier specification with extended warranty',
        rate_per_sqft: 125,
        swatch_image_url: '',
        is_default: false,
      },
    ]);
    setIsEditorOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingId(product.id);
    setCategoryId(product.category_id);
    setTitle(product.title);
    setSku(product.sku || '');
    setShortDescription(product.short_description);
    setDesignStyle(product.design_style);
    setRoomType(product.room_type);
    setPrimaryImageUrl(product.primary_image_url);
    setIsFeatured(product.is_featured);
    setIsActive(product.is_active);

    if (product.rug_sizes && product.rug_sizes.length > 0) {
      setRugSizes(
        product.rug_sizes.map((r) => ({
          size_label: r.size_label,
          width_ft: r.width_ft,
          length_ft: r.length_ft,
          fixed_price: r.fixed_price,
          in_stock: r.in_stock,
        }))
      );
    } else {
      setRugSizes([
        { size_label: '4×6 ft', width_ft: 4, length_ft: 6, fixed_price: 4200, in_stock: true },
        { size_label: '5×8 ft', width_ft: 5, length_ft: 8, fixed_price: 6800, in_stock: true },
      ]);
    }

    if (product.quality_variants && product.quality_variants.length > 0) {
      setQualityVariants(
        product.quality_variants.map((q) => ({
          quality_name: q.quality_name,
          quality_tier: q.quality_tier,
          specification_note: q.specification_note,
          rate_per_sqft: q.rate_per_sqft,
          swatch_image_url: q.swatch_image_url,
          is_default: q.is_default,
        }))
      );
    } else {
      setQualityVariants([
        {
          quality_name: 'Standard Grade',
          quality_tier: 'Standard',
          specification_note: 'Standard specification',
          rate_per_sqft: product.min_display_price || 55,
          swatch_image_url: '',
          is_default: true,
        },
      ]);
    }

    setIsEditorOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const payload: SaveProductPayload = {
      id: editingId,
      category_id: categoryId,
      title,
      sku,
      short_description: shortDescription,
      design_style: designStyle,
      room_type: roomType,
      primary_image_url: primaryImageUrl,
      gallery_image_urls: [primaryImageUrl],
      is_featured: isFeatured,
      is_active: isActive,
      rug_sizes: rugSizes,
      quality_variants: qualityVariants,
    };

    await saveAdminProduct(payload);
    const refreshed = await fetchAdminProducts();
    setProducts(refreshed);
    setIsEditorOpen(false);
    setStatusBanner(
      editingId
        ? `Updated "${title}" and recalculated live prices.`
        : `Added new product "${title}" to ${activeCategoryObj.name}.`
    );
    setTimeout(() => setStatusBanner(null), 4000);
  };

  const handleToggleActive = async (product: Product) => {
    const nextList = await toggleAdminProductStatus(
      product.id,
      !product.is_active
    );
    setProducts(nextList);
  };

  const handleDelete = async (product: Product) => {
    const nextList = await deleteAdminProduct(product.id);
    setProducts(nextList);
    setStatusBanner(`Removed "${product.title}" from catalogue.`);
    setTimeout(() => setStatusBanner(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Header & Add New Product CTA */}
      <div className="bg-white rounded-2xl border border-[#E5DFD3] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#1E1E1C]">
            Product Catalogue & Quality Rate Manager
          </h2>
          <p className="text-xs text-[#6E6A63] mt-0.5">
            Manage all 16 product categories, predefined Machine-Made Rug sizes, and per-Sq.Ft. material quality rates.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#1E1E1C] hover:bg-[#9C5A3C] text-white text-xs font-bold uppercase tracking-wider transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {statusBanner && (
        <div className="p-3.5 rounded-xl bg-[#1F7A4C] text-white text-xs font-semibold">
          ✓ {statusBanner}
        </div>
      )}

      {/* Filter by Category & Search Bar */}
      <div className="bg-white rounded-2xl border border-[#E5DFD3] p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#6E6A63] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by product title, SKU, or style..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#FAF8F5] border border-[#E5DFD3] text-xs text-[#1E1E1C] focus:outline-none focus:border-[#1E1E1C]"
          />
        </div>

        <select
          aria-label="Filter by category"
          value={selectedCategoryId}
          onChange={(e) => setSelectedCategoryId(e.target.value)}
          className="px-3.5 py-2 rounded-xl bg-[#FAF8F5] border border-[#E5DFD3] text-xs font-bold text-[#1E1E1C] focus:outline-none"
        >
          <option value="ALL">All 16 Categories ({products.length})</option>
          {CANONICAL_CATEGORIES.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name} (
              {cat.pricing_mode === 'FIXED_RUG' ? 'Ready Rug' : 'Custom Sq.Ft'})
            </option>
          ))}
        </select>
      </div>

      {/* Products Table / Cards */}
      <div className="space-y-3">
        {filteredProducts.map((product) => {
          const isRug = product.category?.pricing_mode === 'FIXED_RUG';
          return (
            <div
              key={product.id}
              className={`bg-white rounded-2xl border p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition ${
                product.is_active
                  ? 'border-[#E5DFD3]'
                  : 'border-dashed border-[#6E6A63]/50 opacity-65'
              }`}
            >
              <div className="flex items-start gap-4">
                <img
                  src={product.primary_image_url}
                  alt={product.title}
                  className="w-20 h-20 rounded-xl object-cover bg-[#F0ECE1] border border-[#E5DFD3] shrink-0"
                />
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-bold text-[#9C5A3C]">
                      {product.category?.name}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isRug
                          ? 'bg-[#1E1E1C] text-white'
                          : 'bg-[#F0ECE1] text-[#1E1E1C]'
                      }`}
                    >
                      {isRug
                        ? 'Mode A: Machine-Made Predefined Sizes'
                        : 'Mode B: Custom Sq.Ft. + Quality Tiers'}
                    </span>
                    {product.sku && (
                      <span className="text-[11px] text-[#6E6A63]">
                        SKU: {product.sku}
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-[#1E1E1C]">
                    {product.title}
                  </h3>

                  {/* Variants Quick Summary */}
                  {isRug ? (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {product.rug_sizes?.map((rs) => (
                        <span
                          key={rs.id}
                          className="text-[11px] px-2 py-0.5 rounded bg-[#FAF8F5] border border-[#E5DFD3] text-[#1E1E1C]"
                        >
                          {rs.size_label}:{' '}
                          <strong>{formatCurrencyINR(rs.fixed_price)}</strong>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {product.quality_variants?.map((qv) => (
                        <span
                          key={qv.id}
                          className="text-[11px] px-2 py-0.5 rounded bg-[#FAF8F5] border border-[#E5DFD3] text-[#1E1E1C]"
                        >
                          {qv.quality_tier} ({qv.quality_name}):{' '}
                          <strong>₹{qv.rate_per_sqft}/Sq.Ft.</strong>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Controls */}
              <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                <button
                  type="button"
                  onClick={() => handleToggleActive(product)}
                  title={
                    product.is_active ? 'Hide from Storefront' : 'Show on Storefront'
                  }
                  className="p-2.5 rounded-xl border border-[#E5DFD3] bg-[#FAF8F5] hover:bg-[#F0ECE1] text-[#1E1E1C] text-xs font-semibold flex items-center gap-1"
                >
                  {product.is_active ? (
                    <>
                      <Eye className="w-4 h-4 text-[#1F7A4C]" />
                      <span className="hidden sm:inline">Active</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-4 h-4 text-[#6E6A63]" />
                      <span className="hidden sm:inline">Hidden</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => openEditModal(product)}
                  className="px-3.5 py-2.5 rounded-xl bg-[#1E1E1C] hover:bg-[#9C5A3C] text-white text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Details & Prices</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(product)}
                  aria-label="Delete product"
                  className="p-2.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* PRODUCT & PRICING MATRIX MODAL */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-6">
          <div className="bg-white w-full max-w-3xl rounded-3xl border border-[#E5DFD3] shadow-2xl max-h-[92vh] overflow-y-auto">
            <div className="sticky top-0 z-10 bg-white px-6 py-4 border-b border-[#E5DFD3] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#9C5A3C]">
                  {editingId ? 'Edit Existing Product' : 'Create New Product'}
                </span>
                <h3 className="text-lg font-bold text-[#1E1E1C]">
                  {editingId ? title : 'Add Product & Configure Quality Rates'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEditorOpen(false)}
                className="p-2 rounded-full bg-[#FAF8F5] text-[#1E1E1C]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 space-y-6">
              {/* Core Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#1E1E1C] mb-1">
                    Product Category (16 Lines) *
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E5DFD3] text-xs font-bold text-[#1E1E1C]"
                  >
                    {CANONICAL_CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name} (
                        {cat.pricing_mode === 'FIXED_RUG'
                          ? 'Predefined Rug Sizes'
                          : 'Custom Sq.Ft.'}
                        )
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1E1E1C] mb-1">
                    Product SKU Code
                  </label>
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="e.g., WP-505"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E5DFD3] text-xs text-[#1E1E1C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1E1E1C] mb-1">
                  Product Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Italian Calacatta Gold High-Gloss UV Marble Wall Sheet"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E5DFD3] text-xs text-[#1E1E1C]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#1E1E1C] mb-1">
                    Design / Pattern Style
                  </label>
                  <input
                    type="text"
                    value={designStyle}
                    onChange={(e) => setDesignStyle(e.target.value)}
                    placeholder="Modern Minimalist / Oushak / Fluted"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E5DFD3] text-xs text-[#1E1E1C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1E1E1C] mb-1">
                    Recommended Room
                  </label>
                  <input
                    type="text"
                    value={roomType}
                    onChange={(e) => setRoomType(e.target.value)}
                    placeholder="Living Room / Bedroom / Balcony"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E5DFD3] text-xs text-[#1E1E1C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1E1E1C] mb-1">
                    Primary Image URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={primaryImageUrl}
                    onChange={(e) => setPrimaryImageUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E5DFD3] text-xs text-[#1E1E1C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1E1E1C] mb-1">
                  Product Description
                </label>
                <textarea
                  rows={2}
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#FAF8F5] border border-[#E5DFD3] text-xs text-[#1E1E1C]"
                />
              </div>

              {/* DYNAMIC PRICING ENGINE BUILDER: MODE A vs MODE B */}
              {isModeARug ? (
                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E5DFD3] space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#1E1E1C]" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#1E1E1C]">
                        Mode A: Machine-Made Rug Predefined Sizes & Fixed Prices
                      </h4>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setRugSizes([
                          ...rugSizes,
                          {
                            size_label: '8×10 ft',
                            width_ft: 8,
                            length_ft: 10,
                            fixed_price: 12500,
                            in_stock: true,
                          },
                        ])
                      }
                      className="text-xs font-bold text-[#9C5A3C] hover:underline"
                    >
                      + Add Size Row
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {rugSizes.map((rs, idx) => (
                      <div
                        key={idx}
                        className="grid grid-cols-12 gap-2 items-center bg-white p-2.5 rounded-xl border border-[#E5DFD3]"
                      >
                        <div className="col-span-4">
                          <label className="block text-[10px] text-[#6E6A63]">
                            Size Label
                          </label>
                          <input
                            type="text"
                            value={rs.size_label}
                            onChange={(e) => {
                              const copy = [...rugSizes];
                              copy[idx].size_label = e.target.value;
                              setRugSizes(copy);
                            }}
                            className="w-full text-xs font-bold text-[#1E1E1C] border-b border-[#E5DFD3] focus:outline-none"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-[10px] text-[#6E6A63]">
                            Width (ft)
                          </label>
                          <input
                            type="number"
                            value={rs.width_ft}
                            onChange={(e) => {
                              const copy = [...rugSizes];
                              copy[idx].width_ft = Number(e.target.value);
                              setRugSizes(copy);
                            }}
                            className="w-full text-xs text-[#1E1E1C] border-b border-[#E5DFD3] focus:outline-none"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-[10px] text-[#6E6A63]">
                            Length (ft)
                          </label>
                          <input
                            type="number"
                            value={rs.length_ft}
                            onChange={(e) => {
                              const copy = [...rugSizes];
                              copy[idx].length_ft = Number(e.target.value);
                              setRugSizes(copy);
                            }}
                            className="w-full text-xs text-[#1E1E1C] border-b border-[#E5DFD3] focus:outline-none"
                          />
                        </div>
                        <div className="col-span-3">
                          <label className="block text-[10px] text-[#6E6A63]">
                            Fixed Price (₹)
                          </label>
                          <input
                            type="number"
                            value={rs.fixed_price}
                            onChange={(e) => {
                              const copy = [...rugSizes];
                              copy[idx].fixed_price = Number(e.target.value);
                              setRugSizes(copy);
                            }}
                            className="w-full text-xs font-bold text-[#1F7A4C] border-b border-[#E5DFD3] focus:outline-none"
                          />
                        </div>
                        <div className="col-span-1 text-right">
                          {rugSizes.length > 1 && (
                            <button
                              type="button"
                              onClick={() =>
                                setRugSizes(rugSizes.filter((_, i) => i !== idx))
                              }
                              className="text-red-600 text-xs font-bold"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E5DFD3] space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-[#9C5A3C]" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#1E1E1C]">
                        Mode B: Material Quality Variations & Per-Sq.Ft. Rates
                      </h4>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setQualityVariants([
                          ...qualityVariants,
                          {
                            quality_name: 'New Material Quality Variation',
                            quality_tier: 'Premium',
                            specification_note: 'Washable & moisture resistant',
                            rate_per_sqft: 95,
                            swatch_image_url: '',
                            is_default: false,
                          },
                        ])
                      }
                      className="text-xs font-bold text-[#9C5A3C] hover:underline"
                    >
                      + Add Material Quality Tier
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {qualityVariants.map((qv, idx) => (
                      <div
                        key={idx}
                        className="grid grid-cols-12 gap-2 items-center bg-white p-3 rounded-xl border border-[#E5DFD3]"
                      >
                        <div className="col-span-12 sm:col-span-4">
                          <label className="block text-[10px] text-[#6E6A63]">
                            Material / Paper / PVC / Grass Quality Name
                          </label>
                          <input
                            type="text"
                            value={qv.quality_name}
                            onChange={(e) => {
                              const copy = [...qualityVariants];
                              copy[idx].quality_name = e.target.value;
                              setQualityVariants(copy);
                            }}
                            className="w-full text-xs font-bold text-[#1E1E1C] border-b border-[#E5DFD3] focus:outline-none"
                          />
                        </div>

                        <div className="col-span-5 sm:col-span-2">
                          <label className="block text-[10px] text-[#6E6A63]">
                            Tier
                          </label>
                          <select
                            value={qv.quality_tier}
                            onChange={(e) => {
                              const copy = [...qualityVariants];
                              copy[idx].quality_tier =
                                e.target.value as QualityTier;
                              setQualityVariants(copy);
                            }}
                            className="w-full text-xs font-semibold text-[#9C5A3C] bg-transparent border-b border-[#E5DFD3] focus:outline-none"
                          >
                            <option value="Standard">Standard</option>
                            <option value="Premium">Premium</option>
                            <option value="Luxury">Luxury</option>
                          </select>
                        </div>

                        <div className="col-span-5 sm:col-span-2">
                          <label className="block text-[10px] text-[#6E6A63]">
                            Rate / Sq.Ft. (₹)
                          </label>
                          <input
                            type="number"
                            value={qv.rate_per_sqft}
                            onChange={(e) => {
                              const copy = [...qualityVariants];
                              copy[idx].rate_per_sqft = Number(e.target.value);
                              setQualityVariants(copy);
                            }}
                            className="w-full text-xs font-bold text-[#1F7A4C] border-b border-[#E5DFD3] focus:outline-none"
                          />
                        </div>

                        <div className="col-span-10 sm:col-span-3">
                          <label className="block text-[10px] text-[#6E6A63]">
                            Specification Note
                          </label>
                          <input
                            type="text"
                            value={qv.specification_note}
                            onChange={(e) => {
                              const copy = [...qualityVariants];
                              copy[idx].specification_note = e.target.value;
                              setQualityVariants(copy);
                            }}
                            className="w-full text-xs text-[#6E6A63] border-b border-[#E5DFD3] focus:outline-none"
                          />
                        </div>

                        <div className="col-span-2 sm:col-span-1 text-right">
                          {qualityVariants.length > 1 && (
                            <button
                              type="button"
                              onClick={() =>
                                setQualityVariants(
                                  qualityVariants.filter((_, i) => i !== idx)
                                )
                              }
                              className="text-red-600 text-xs font-bold"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Featured & Visibility Toggles */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-[#E5DFD3]">
                <div className="flex items-center gap-5 text-xs font-semibold text-[#1E1E1C]">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="w-4 h-4 accent-[#1E1E1C]"
                    />
                    <span>Feature on Homepage</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="w-4 h-4 accent-[#1E1E1C]"
                    />
                    <span>Visible on Storefront</span>
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditorOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-[#E5DFD3] text-xs font-semibold text-[#1E1E1C]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#1E1E1C] hover:bg-[#9C5A3C] text-white text-xs font-bold uppercase tracking-wider transition"
                  >
                    Save Product & Prices
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
