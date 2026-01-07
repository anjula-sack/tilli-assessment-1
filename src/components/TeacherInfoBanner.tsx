"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { TeacherInfo } from "@/types";
import { MapPin, School, GraduationCap, LayoutGrid } from "lucide-react";

export default function TeacherInfoBanner() {
  const { t } = useTranslation();
  const [teacherInfo, setTeacherInfo] = useState<TeacherInfo | null>(null);

  useEffect(() => {
    const info = localStorage.getItem("teacherInfo");
    if (info) {
      setTeacherInfo(JSON.parse(info));
    }
  }, []);

  if (!teacherInfo) return null;

  return (
    <div className="bg-white/60 backdrop-blur-sm border border-white/40 shadow-sm rounded-xl p-3 mb-6 sm:mb-8 transition-all duration-300 hover:shadow-md">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-gray-700">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-2 bg-[#82A4DE]/10 rounded-lg shrink-0">
            <School size={18} className="text-[#4F86E2]" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
              {t("login.school")}
            </p>
            <h3 className="text-sm font-semibold truncate leading-tight">
              {t(`schools.${teacherInfo.school}`, {
                defaultValue: teacherInfo.school,
              })}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-4 sm:gap-8">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-green-50 rounded-lg shrink-0">
              <GraduationCap size={18} className="text-green-600" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                {t("login.grade")}
              </p>
              <p className="text-sm font-semibold leading-tight">
                {t(`grades.${teacherInfo.grade}`)}
              </p>
            </div>
          </div>

          <div className="w-px h-8 bg-gray-200 hidden sm:block"></div>

          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-orange-50 rounded-lg shrink-0">
              <LayoutGrid size={18} className="text-orange-600" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                {t("login.section")}
              </p>
              <p className="text-sm font-semibold leading-tight">
                {t(`sections.${teacherInfo.section}`)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
