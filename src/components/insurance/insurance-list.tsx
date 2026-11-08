import { CheckIcon } from "@/components/icons";
import type { InsurancePartner } from "@/config/site.config";

type InsuranceListProps = {
  partners: InsurancePartner[];
};

export function InsuranceList({ partners }: InsuranceListProps) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {partners.map((partner) => (
        <li
          key={partner.name}
          className="flex items-start gap-3 rounded-xl border border-ink/10 bg-white p-4"
        >
          <CheckIcon className="mt-0.5 size-4 shrink-0 text-brand" />
          <span>
            <span className="block text-sm font-semibold text-ink">
              {partner.name}
            </span>
            {partner.note ? (
              <span className="block text-xs text-muted">{partner.note}</span>
            ) : null}
          </span>
        </li>
      ))}
    </ul>
  );
}
