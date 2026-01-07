"use client";

import { useState } from "react";
import { ArrowRight, Loader2, User } from "lucide-react";
import { TeacherInfo } from "@/types";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { login } from "@/lib/appwrite";
import { useRouter, useSearchParams } from "next/navigation";
import i18n from "@/lib/i18n";
import enData from "@/locales/en.json";
import arData from "@/locales/ar.json";

export default function LoginForm() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const testType = searchParams.get("testType") || "PRE";
  const queryString = testType
    ? `?testType=${encodeURIComponent(testType)}`
    : "";
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [teacherInfo, setTeacherInfo] = useState<TeacherInfo>({
    section: "",
    school: "",
    grade: t("grades.grade1"),
    isNewSchool: false,
    gender: "",
    age: undefined,
    teachingExperience: undefined,
    education: "",
    selTraining: "",
    multilingualClassroom: undefined,
    classSize: undefined,
    classroomResources: [],
    resourcesOther: "",
    resourcesSufficiency: "",
  });

  const data: any = i18n.language === "ar" ? arData : enData;

  const schoolOptions = Object.keys(data.schools);
  const gradeOptions = Object.keys(data.grades);
  const sectionOptions = Object.keys(data.sections);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(teacherInfo);

      router.push(`/dashboard${queryString}`);
    } catch (error) {
      console.error("Login error:", error);
      setError(t("login.loginFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-md sm:max-w-lg relative">
      <div className="flex justify-center mb-4">
        <Image
          src="/images/mascot/tilli.png"
          alt={t("app.mascotAlt")}
          width={80}
          height={80}
          className="rounded-full"
          priority
        />
      </div>
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          {t("login.title")}
        </h1>
      </div>

      <form onSubmit={handleLogin} className="space-y-4 sm:space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Teacher Information */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <User className="w-5 h-5 mr-2" />
            {t("login.teacherInfo")}
          </h2>

          {/* School */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("login.school")} *
            </label>

            <select
              value={
                schoolOptions.includes(teacherInfo.school)
                  ? teacherInfo.school
                  : teacherInfo.school
                  ? "__add_new__"
                  : ""
              }
              onChange={(e) => {
                const value = e.target.value;

                setTeacherInfo((prev) => ({
                  ...prev,
                  school: value,
                  isNewSchool: false,
                }));
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md 
                focus:outline-none focus:ring-2 focus:ring-[#82A4DE] 
                text-sm sm:text-base text-gray-900 bg-white"
              required={!teacherInfo.isNewSchool}
            >
              <option value="">{t("login.selectSchool")}</option>

              {schoolOptions.map((schoolId: string) => (
                <option key={schoolId} value={schoolId}>
                  {data.schools[schoolId]}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              className="mr-2"
              checked={teacherInfo.isNewSchool}
              onChange={(e) =>
                setTeacherInfo((prev) => ({
                  ...prev,
                  isNewSchool: e.target.checked,
                  school: "",
                }))
              }
            />
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("login.schoolNotInList")}
            </label>
          </div>

          <div>
            {/* New School Input Field */}
            {teacherInfo.isNewSchool && (
              <input
                type="text"
                placeholder={t("login.enterNewSchool")}
                className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md 
                  focus:outline-none focus:ring-2 text-black focus:ring-[#82A4DE]"
                value={teacherInfo.school}
                onChange={(e) =>
                  setTeacherInfo((prev) => ({
                    ...prev,
                    school: e.target.value,
                  }))
                }
                required
              />
            )}
          </div>

           <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("login.grade")} *
            </label>
            <select
              value={teacherInfo.grade}
              onChange={(e) =>
                setTeacherInfo((prev) => ({
                  ...prev,
                  grade: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#82A4DE] text-sm sm:text-base text-gray-900 bg-white"
              required
            >
              <option value="">{t("login.selectGrade")}</option>
              {gradeOptions.map((grade) => (
                <option key={grade} value={grade}>
                  {t(`grades.${grade}`)}
                </option>
              ))}
            </select>
          </div>

          {/* Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("login.section")} *
            </label>
            <select
              value={teacherInfo.section}
              onChange={(e) =>
                setTeacherInfo((prev) => ({
                  ...prev,
                  section: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#82A4DE] text-sm sm:text-base text-gray-900 bg-white"
              required
            >
              <option value="">{t("login.selectSection")}</option>
              {sectionOptions.map((section) => (
                <option key={section} value={section}>
                  {t(`sections.${section}`)}
                </option>
              ))}
            </select>
          </div>

          {/* Class Size */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("login.classSize")} *
            </label>
            <input
              type="number"
              min="1"
              value={teacherInfo.classSize || ""}
              onChange={(e) =>
                setTeacherInfo((prev) => ({
                  ...prev,
                  classSize: parseInt(e.target.value) || undefined,
                }))
              }
              placeholder={t("login.classSizePlaceholder")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#82A4DE] text-sm sm:text-base text-gray-900 bg-white"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center space-x-2 bg-[#82A4DE] text-white py-3 px-4 rounded-full hover:bg-[#3d6bc7] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium text-sm sm:text-base"
        >
          {loading ? (
            <Loader2 size={18} className="sm:w-5 sm:h-5" />
          ) : (
            <>
              <span>{t("common.getStarted")}</span>
              <ArrowRight size={18} className="sm:w-5 sm:h-5" />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-xs sm:text-sm text-gray-500">
          {t("login.description")}
        </p>
      </div>
    </div>
  );
}
