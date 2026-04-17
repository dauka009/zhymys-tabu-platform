"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useVacanciesStore } from "@/stores/vacancies.store";
import { Search, RotateCcw, Building2 } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { useEffect, useState } from "react";

export function FilterPanel() {
  const { filters, setFilter, resetFilters } = useVacanciesStore();
  const [localQuery, setLocalQuery] = useState(filters.query);
  const debouncedQuery = useDebounce(localQuery, 300);

  useEffect(() => {
    setFilter("query", debouncedQuery);
  }, [debouncedQuery, setFilter]);

  return (
    <div className="bg-card border rounded-2xl p-6 sticky top-24 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-heading text-lg font-bold">Сүзгілер</h3>
        <Button variant="ghost" size="sm" onClick={() => {
          setLocalQuery("");
          resetFilters();
        }} className="text-muted-foreground">
          <RotateCcw className="h-4 w-4 mr-2" />
          Тазарту
        </Button>
      </div>

      <div className="space-y-6">
        {/* Search */}
        <div className="space-y-2">
          <Label>Іздеу</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              placeholder="Менеджер, IT..." 
              className="pl-9"
            />
          </div>
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label>Санат</Label>
          <select 
            value={filters.category}
            onChange={(e) => setFilter("category", e.target.value)}
            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <option value="all">Барлық санаттар</option>
            <option value="it">IT & Технология</option>
            <option value="marketing">Маркетинг</option>
            <option value="finance">Қаржы</option>
            <option value="design">Дизайн</option>
          </select>
        </div>

        {/* Type */}
        <div className="space-y-2">
          <Label>Жұмыс орны / Форматы</Label>
          <select 
            value={filters.type}
            onChange={(e) => setFilter("type", e.target.value)}
            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <option value="all">Барлық форматтар</option>
            <option value="full">Толық күн</option>
            <option value="part">Жартылай күн</option>
            <option value="remote">Қашықтан (Remote)</option>
            <option value="hybrid">Гибридті</option>
          </select>
        </div>

        {/* Salary */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label>Табыс (минималды)</Label>
            <span className="text-sm font-semibold text-primary">{filters.salaryMin > 0 ? `${filters.salaryMin.toLocaleString()} ₸` : 'Кез келген'}</span>
          </div>
          <Slider 
            value={[filters.salaryMin]} 
            onValueChange={(val) => {
              const num = Array.isArray(val) ? val[0] : val;
              setFilter("salaryMin", num);
            }}
            max={1500000} 
            step={50000} 
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0</span>
            <span>1.5M+ ₸</span>
          </div>
        </div>

      </div>
    </div>
  );
}
