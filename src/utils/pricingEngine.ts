/**
 * PURE PRICING ENGINE (MODE A & MODE B)
 * Strict Rule: All dimension conversions and price calculations live here.
 * UI components must NEVER perform inline price math.
 */
import {
  CustomDimensionInput,
  CustomPriceResult,
  InquiryTriggerEventDetail,
  MeasurementUnit,
  RugPriceResult,
  RugSizeVariant,
} from '../types/database.types';

const FEET_CONVERSION_FACTORS: Record<MeasurementUnit, number> = {
  ft: 1,
  inch: 1 / 12,
  meter: 3.28084,
};

/**
 * Converts a single linear dimension from ft/inch/meter into feet.
 */
export function convertToFeet(value: number, unit: MeasurementUnit): number {
  if (!Number.isFinite(value) || value <= 0) {
    return 0;
  }
  const factor = FEET_CONVERSION_FACTORS[unit] ?? 1;
  return Number((value * factor).toFixed(2));
}

/**
 * MODE A (FIXED_RUG): Looks up the exact predefined price for a machine-made rug size.
 * Machine-made rugs do not use custom width x height math.
 */
export function calculatePredefinedRugPrice(
  variant: RugSizeVariant | null | undefined
): RugPriceResult {
  if (!variant) {
    return {
      sizeLabel: 'Select Size',
      areaSqFt: 0,
      fixedPrice: 0,
      inStock: false,
      formattedSummary: 'Please select a predefined rug size',
    };
  }

  const areaSqFt = Number((variant.width_ft * variant.length_ft).toFixed(2));
  const fixedPrice = Math.max(0, Math.round(variant.fixed_price));

  return {
    sizeLabel: variant.size_label,
    areaSqFt,
    fixedPrice,
    inStock: variant.in_stock,
    formattedSummary: `Machine-Made Ready Rug — ${variant.size_label} (${areaSqFt} Sq.Ft.)`,
  };
}

/**
 * MODE B (CUSTOM_SQFT): Calculates net area, optional roll/sheet wastage, and total price
 * based on the selected material/quality rate per Sq.Ft.
 */
export function calculateCustomSqFtPrice(
  input: CustomDimensionInput
): CustomPriceResult {
  const widthInFeet = convertToFeet(input.width, input.unit);
  const heightInFeet = convertToFeet(input.height, input.unit);
  const ratePerSqFt = Math.max(0, Number(input.ratePerSqFt) || 0);

  const netAreaSqFt = Number((widthInFeet * heightInFeet).toFixed(2));
  const wastageMultiplier = (input.wastagePercent || 0) / 100;
  const wastageSqFt = Number((netAreaSqFt * wastageMultiplier).toFixed(2));
  const billableAreaSqFt = Number((netAreaSqFt + wastageSqFt).toFixed(2));
  const estimatedTotal = Math.round(billableAreaSqFt * ratePerSqFt);

  const wastageLabel =
    input.wastagePercent > 0 ? ` (+${input.wastagePercent}% cutting/roll allowance)` : '';

  return {
    widthInFeet,
    heightInFeet,
    netAreaSqFt,
    wastageSqFt,
    billableAreaSqFt,
    ratePerSqFt,
    estimatedTotal,
    formattedSummary: `${widthInFeet} ft × ${heightInFeet} ft = ${billableAreaSqFt} Sq.Ft.${wastageLabel}`,
  };
}

/**
 * Formats an numeric INR price cleanly (e.g., ₹14,500)
 */
export function formatCurrencyINR(amount: number): string {
  const safeAmount = Number.isFinite(amount) ? Math.round(amount) : 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(safeAmount);
}

/**
 * Global custom event dispatcher so Phase 1 layout components (Navbar, Footer, MobileStickyBar)
 * can trigger the Phase 3 LeadCaptureModal without circular imports or file edits.
 */
export const INQUIRY_MODAL_EVENT = 'moderno:open-inquiry-modal';

export function triggerGlobalInquiryModal(detail: InquiryTriggerEventDetail): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent<InquiryTriggerEventDetail>(INQUIRY_MODAL_EVENT, { detail })
    );
  }
}
