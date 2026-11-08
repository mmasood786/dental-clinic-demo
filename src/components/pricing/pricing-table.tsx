import type { PricingItem } from "@/config/site.config";
import { formatCurrency } from "@/lib/format";

type PricingTableProps = {
  items: PricingItem[];
  caption: string;
};

function priceLabel(item: PricingItem): string {
  if (item.price === 0) {
    return "Complimentary";
  }
  if (item.note === "From") {
    return `From ${formatCurrency(item.price)}`;
  }
  return formatCurrency(item.price);
}

export function PricingTable({ items, caption }: PricingTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-ink/10 bg-white">
      <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-ink/10 bg-surface">
            <th
              scope="col"
              className="px-5 py-3 text-xs font-semibold tracking-wide text-muted uppercase"
            >
              Treatment
            </th>
            <th
              scope="col"
              className="px-5 py-3 text-right text-xs font-semibold tracking-wide text-muted uppercase"
            >
              Price
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr
              key={`${item.treatment}-${index}`}
              className="border-b border-ink/5 last:border-0"
            >
              <th scope="row" className="px-5 py-4 font-medium text-ink">
                {item.treatment}
                {item.note && item.note !== "From" ? (
                  <span className="block text-xs font-normal text-muted">
                    {item.note}
                  </span>
                ) : null}
              </th>
              <td className="px-5 py-4 text-right font-display text-lg font-semibold whitespace-nowrap text-brand-dark">
                {priceLabel(item)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
