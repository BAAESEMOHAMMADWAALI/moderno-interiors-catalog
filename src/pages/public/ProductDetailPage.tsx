/**
 * DYNAMIC PRODUCT DETAIL PAGE (`/product/:slug`)
 * Phase 2 Locked File — Automatically routes between:
 * - Mode A (`RugPredefinedSelector`) for Machine-Made Rugs (strictly predefined sizes)
 * - Mode B (`CustomDimensionCalc` + `CustomDesignPanel`) for the 15 custom-sized categories.
 */
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Layers, ShieldCheck } from 'lucide-react';
import { Product } from '../../types/database.types';
import { fetchProductBySlug } from '../../services/catalogService';
import { RugPredefinedSelector } from '../../components/product-detail/RugPredefinedSelector';
import { CustomDimensionCalc } from '../../components/product-detail/CustomDimensionCalc';
import { CustomDesignPanel } from '../../components/product-detail/CustomDesignPanel';
import { ProductCard } from '../../components/catalog/ProductCard';

export const ProductDetailPage: React.FC = () => {
  const { slug = '' } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [activeImage, setActiveImage] = useState<string>('');
  const [customDesignNotes, setCustomDesignNotes] = useState<string>('');
  const [referenceImageUrl, setReferenceImageUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);
    void fetchProductBySlug(slug).then(({ product: found, relatedProducts: rel }) => {
      setProduct(found);
      setRelatedProducts(rel);
      setActiveImage(found?.primary_image_url || '');
      setCustomDesignNotes('');
      setReferenceImageUrl('');
      setIsLoading(false);
    });
  }, [slug]);

  if (!isLoading && !product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="text-2xl font-bold text-[#1E1E1C]">Product Not Found</h1>
        <Link
          to="/"
          className="inline-block px-5 py-2.5 rounded-xl bg-[#1E1E1C] text-white text-xs font-bold"
        >
          Return to Catalogue
        </Link>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const isFixedRug = product.category?.pricing_mode === 'FIXED_RUG';
  const allImages = Array.from(
    new Set([product.primary_image_url, ...(product.gallery_image_urls || [])])
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumb Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#6E6A63]">
        <div className="flex items-center gap-2">
          <Link
            to={
              product.category
                ? `/category/${product.category.slug}`
                : '/'
            }
            className="inline-flex items-center gap-1 font-semibold text-[#1E1E1C] hover:text-[#9C5A3C]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to {product.category?.name || 'Catalogue'}</span>
          </Link>
        </div>
        {product.sku && <span>SKU: {product.sku}</span>}
      </div>

      {/* Main 2-Column Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
        {/* Left Column: Image Gallery & Spec Highlights (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="aspect-[4/3] w-full rounded-3xl overflow-hidden bg-[#F0ECE1] border border-[#E5DFD3]">
            <img
              src={activeImage || product.primary_image_url}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>

          {allImages.length > 1 && (
            <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar">
              {allImages.map((imgUrl) => (
                <button
                  key={imgUrl}
                  type="button"
                  onClick={() => setActiveImage(imgUrl)}
                  className={`w-20 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition ${
                    activeImage === imgUrl
                      ? 'border-[#1E1E1C]'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt="Thumbnail"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Product Highlights Card */}
          <div className="bg-white rounded-2xl border border-[#E5DFD3] p-4 space-y-2.5 text-xs">
            <h3 className="font-bold uppercase tracking-wider text-[#1E1E1C] flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#9C5A3C]" />
              <span>Product & Quality Assurance</span>
            </h3>
            <div className="grid grid-cols-2 gap-2 pt-1 text-[#6E6A63]">
              <div>
                <span className="block text-[10px] uppercase">Design Style</span>
                <strong className="text-[#1E1E1C]">{product.design_style}</strong>
              </div>
              <div>
                <span className="block text-[10px] uppercase">Recommended Room</span>
                <strong className="text-[#1E1E1C]">{product.room_type}</strong>
              </div>
            </div>
            <div className="pt-2 border-t border-[#FAF8F5] space-y-1 text-[#1E1E1C]">
              {isFixedRug ? (
                <p className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#1F7A4C] shrink-0" />
                  <span>100% Machine-Made Rug (Not Handmade/Kashmiri)</span>
                </p>
              ) : (
                <p className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#1F7A4C] shrink-0" />
                  <span>Custom-Measured to Your Exact House Dimensions</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Title + Dual Engine Configurator (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-2">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-[#9C5A3C]">
              {product.category?.name}
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1E1E1C] leading-snug">
              {product.title}
            </h1>
            <p className="text-xs sm:text-sm text-[#6E6A63] leading-relaxed">
              {product.short_description}
            </p>
          </div>

          {/* STRICT DUAL ENGINE SWITCH: Mode A vs Mode B */}
          {isFixedRug ? (
            <RugPredefinedSelector product={product} />
          ) : (
            <div className="space-y-6">
              <CustomDimensionCalc
                product={product}
                customDesignNotes={customDesignNotes}
                referenceImageUrl={referenceImageUrl}
              />
              <CustomDesignPanel
                categoryName={product.category?.name || 'Custom Product'}
                customDesignNotes={customDesignNotes}
                onChangeNotes={setCustomDesignNotes}
                referenceImageUrl={referenceImageUrl}
                onChangeReferenceUrl={setReferenceImageUrl}
              />
            </div>
          )}
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="pt-8 border-t border-[#E5DFD3] space-y-5">
          <h2 className="text-xl font-bold text-[#1E1E1C]">
            More in {product.category?.name}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
