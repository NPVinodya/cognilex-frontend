"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProvinceSelector from "@/components/appointment/ProvinceSelector";
import LawyerCard from "@/components/appointment/LawyerCard";
import Header from "@/components/layout/header";
import { SPECIALIZATIONS } from "@/lib/constants";

import type { Lawyer, Province, Specialization } from "@/lib/types";

export default function LawyersPage() {
  const router = useRouter();

  const [province, setProvince] = useState<Province | "">("");
  const [specialization, setSpecialization] = useState<Specialization | "">("");

  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const stored = localStorage.getItem("user");
      const parsed = stored ? JSON.parse(stored) : null;
      const appearance = parsed?.preferences?.appearance || "Dark Mode";

      if (appearance === "Dark Mode" || appearance === "System Default") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } catch {
      document.documentElement.classList.add("dark");
    }
  }, []);

  useEffect(() => {
    const fetchLawyers = async () => {
      try {
        setLoading(true);
        setError("");

        // Build query params for Next route: /api/lawyer/all
        const params = new URLSearchParams();
        if (province) params.set("province", province);
        if (specialization) params.set("specialization", specialization);
        // status is optional since your route defaults to approved
        // params.set("status", "approved");

        const url = `/api/lawyer/all${params.toString() ? `?${params.toString()}` : ""}`;

        const res = await fetch(url, {
          method: "GET",
          cache: "no-store",
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
          throw new Error(`Request failed: ${res.status}`);
        }

        const json = await res.json();

        // Your route might return:
        // 1) raw array from backend, OR
        // 2) { success, lawyers, count }
        const list: Lawyer[] = Array.isArray(json) ? json : (json.lawyers ?? json.data ?? []);

        setLawyers(list);
      } catch (err) {
        console.error("Error fetching lawyers:", err);
        setError("Failed to load lawyers. Please try again.");
        setLawyers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLawyers();
  }, [province, specialization]);

  const handleBookAppointment = (lawyerId: string) => {
    router.push(`/lawyer/${lawyerId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Find a Lawyer</h1>
          <p className="text-gray-600 dark:text-slate-300">Connect with verified legal professionals across Sri Lanka</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <aside className="md:col-span-1">
            <div className="bg-white dark:bg-slate-900 p-4 md:p-6 rounded-xl shadow-md border border-gray-100 dark:border-slate-800 md:sticky md:top-4">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-slate-100">Filters</h3>

              <div className="mb-4">
                <ProvinceSelector selected={province} onChange={setProvince} />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Specialization</label>
                <select
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value as Specialization | "")}
                  className="w-full px-3 md:px-4 py-2 border-2 border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-gray-900 dark:text-slate-100 rounded-lg focus:outline-none focus:border-blue-500 dark:focus:border-amber-500"
                >
                  <option value="">All Specializations</option>
                  {SPECIALIZATIONS.map((spec) => (
                    <option key={spec} value={spec}>
                      {spec}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => {
                  setProvince("");
                  setSpecialization("");
                }}
                className="w-full py-2 text-sm text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition"
              >
                Clear Filters
              </button>
            </div>
          </aside>

          {/* Lawyers List */}
          <div className="md:col-span-3">
            {loading ? (
              <div className="bg-white dark:bg-slate-900 rounded-xl shadow-md p-12 text-center border border-transparent dark:border-slate-800">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-500 dark:text-slate-400 mt-4">Loading lawyers...</p>
              </div>
            ) : (
              <>
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-gray-600 dark:text-slate-300">
                    {lawyers.length} lawyer{lawyers.length !== 1 ? "s" : ""} found
                  </p>
                </div>

                {lawyers.length > 0 ? (
                  <div className="space-y-4">
                    {lawyers.map((lawyer, index) => (
                      <LawyerCard
                        key={(lawyer as any).id || (lawyer as any)._id || index}
                        lawyer={lawyer}
                        onBook={handleBookAppointment}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white dark:bg-slate-900 rounded-xl shadow-md p-12 text-center border border-transparent dark:border-slate-800">
                    <p className="text-gray-500 dark:text-slate-300 text-lg">No lawyers found matching your criteria.</p>
                    <p className="text-gray-400 dark:text-slate-500 text-sm mt-2">Try adjusting your filters.</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}


