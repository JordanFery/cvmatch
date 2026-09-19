"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { JobOfferCard } from "@/components/jobs/job-offer-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export type JobOfferListItem = {
  id: string;
  title: string;
  company: string | null;
  location: string | null;
  salaryRange: string | null;
  status: string;
  isFavorite: boolean;
  keySkills: unknown;
  summary: string | null;
  responsibilities: unknown;
  requirements: unknown;
  niceToHave: unknown;
  updatedAt: Date;
};

function toStringArray(value: unknown): string[] {
  return Array.isArray(value) ? (value as string[]) : [];
}

function matchesFilter(value: string | null, filter: string) {
  const trimmed = filter.trim().toLowerCase();
  if (!trimmed) return true;
  return (value ?? "").toLowerCase().includes(trimmed);
}

export function JobsList({ offers }: { offers: JobOfferListItem[] }) {
  const [query, setQuery] = useState("");
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [salaryRange, setSalaryRange] = useState("");

  const hasActiveFilters = [query, title, company, location, salaryRange].some((value) => value.trim().length > 0);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return offers.filter((offer) => {
      if (!matchesFilter(offer.title, title)) return false;
      if (!matchesFilter(offer.company, company)) return false;
      if (!matchesFilter(offer.location, location)) return false;
      if (!matchesFilter(offer.salaryRange, salaryRange)) return false;

      if (q) {
        const haystack = [
          offer.title,
          offer.company,
          offer.location,
          offer.salaryRange,
          offer.summary,
          ...toStringArray(offer.responsibilities),
          ...toStringArray(offer.requirements),
          ...toStringArray(offer.niceToHave),
          ...toStringArray(offer.keySkills),
        ]
          .filter(Boolean)
          .join(" \n ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }

      return true;
    });
  }, [offers, query, title, company, location, salaryRange]);

  const resetFilters = () => {
    setQuery("");
    setTitle("");
    setCompany("");
    setLocation("");
    setSalaryRange("");
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Rechercher par mot-clé (titre, entreprise, localisation, salaire, description...)"
          className="pl-9"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Titre de poste" />
        <Input value={company} onChange={(event) => setCompany(event.target.value)} placeholder="Entreprise" />
        <Input value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Localisation" />
        <Input
          value={salaryRange}
          onChange={(event) => setSalaryRange(event.target.value)}
          placeholder="Fourchette salariale"
        />
      </div>

      {hasActiveFilters && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {filtered.length} offre{filtered.length !== 1 ? "s" : ""} trouvée{filtered.length !== 1 ? "s" : ""}
          </p>
          <Button variant="ghost" size="sm" onClick={resetFilters}>
            <X className="size-4" aria-hidden="true" />
            Réinitialiser
          </Button>
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border py-12 text-center text-sm text-muted-foreground">
          Aucune offre ne correspond à ces critères.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((offer) => (
            <JobOfferCard key={offer.id} offer={offer} />
          ))}
        </div>
      )}
    </div>
  );
}
