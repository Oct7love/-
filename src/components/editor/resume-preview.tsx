"use client";

import type { ResumeContent } from "@/types/resume";

interface ResumePreviewProps {
  content: ResumeContent;
  templateId?: string;
}

export function ResumePreview({ content }: ResumePreviewProps) {
  const { personalInfo, education, workExperience, projects, skills } = content;
  const primaryColor = "#059669";

  return (
    <div className="bg-white shadow-sm border rounded-lg p-6 text-[9px] leading-[1.5] text-gray-800 min-h-[400px] scale-[0.85] origin-top">
      {/* Header */}
      <div className="text-center mb-4">
        <h1 className="text-lg font-bold" style={{ color: primaryColor }}>
          {personalInfo.name || "你的姓名"}
        </h1>
        <div className="mt-1 flex items-center justify-center gap-2 text-gray-400 flex-wrap text-[8px]">
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
        </div>
        {personalInfo.summary && (
          <p className="mt-2 text-gray-500 max-w-sm mx-auto text-[8px]">
            {personalInfo.summary}
          </p>
        )}
      </div>

      <div
        className="h-px w-full mb-3"
        style={{ backgroundColor: primaryColor, opacity: 0.15 }}
      />

      {/* Education */}
      {education.length > 0 && (
        <section className="mb-3">
          <h2
            className="text-[10px] font-bold uppercase tracking-wider mb-1"
            style={{ color: primaryColor }}
          >
            教育背景
          </h2>
          {education.map((edu) => (
            <div key={edu.id} className="mb-1">
              <div className="flex justify-between">
                <span className="font-semibold text-[8px]">{edu.school}</span>
                <span className="text-gray-400 text-[7px]">
                  {edu.startDate} — {edu.endDate}
                </span>
              </div>
              <div className="text-gray-500 text-[8px]">
                {edu.degree} · {edu.major}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Work */}
      {workExperience.length > 0 && (
        <section className="mb-3">
          <h2
            className="text-[10px] font-bold uppercase tracking-wider mb-1"
            style={{ color: primaryColor }}
          >
            工作经历
          </h2>
          {workExperience.map((exp) => (
            <div key={exp.id} className="mb-2">
              <div className="flex justify-between">
                <span className="font-semibold text-[8px]">{exp.company}</span>
                <span className="text-gray-400 text-[7px]">
                  {exp.startDate} — {exp.isCurrent ? "至今" : exp.endDate}
                </span>
              </div>
              <div className="text-gray-500 italic text-[8px]">
                {exp.position}
              </div>
              {exp.highlights.filter(Boolean).length > 0 && (
                <ul className="mt-0.5 space-y-0.5 text-[8px]">
                  {exp.highlights.filter(Boolean).map((h, i) => (
                    <li key={i} className="flex gap-1">
                      <span className="text-gray-300">•</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section className="mb-3">
          <h2
            className="text-[10px] font-bold uppercase tracking-wider mb-1"
            style={{ color: primaryColor }}
          >
            项目经历
          </h2>
          {projects.map((proj) => (
            <div key={proj.id} className="mb-2">
              <span className="font-semibold text-[8px]">{proj.name}</span>
              {proj.role && (
                <span className="text-gray-400 text-[8px] ml-1">
                  | {proj.role}
                </span>
              )}
              {proj.description && (
                <p className="text-gray-600 text-[8px] mt-0.5">
                  {proj.description}
                </p>
              )}
              {proj.techStack.length > 0 && (
                <div className="mt-0.5 flex gap-0.5 flex-wrap">
                  {proj.techStack.map((t) => (
                    <span
                      key={t}
                      className="px-1 py-0 rounded text-[7px]"
                      style={{
                        backgroundColor: primaryColor + "12",
                        color: primaryColor,
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Skills */}
      {skills.technical.length > 0 && (
        <section>
          <h2
            className="text-[10px] font-bold uppercase tracking-wider mb-1"
            style={{ color: primaryColor }}
          >
            技能
          </h2>
          <div className="flex gap-0.5 flex-wrap">
            {skills.technical.map((s) => (
              <span
                key={s}
                className="px-1.5 py-0.5 rounded text-[7px]"
                style={{
                  backgroundColor: primaryColor + "12",
                  color: primaryColor,
                }}
              >
                {s}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Empty state */}
      {!personalInfo.name &&
        education.length === 0 &&
        workExperience.length === 0 && (
          <div className="flex items-center justify-center h-48 text-gray-300 text-[10px]">
            开始填写简历内容，这里将实时预览
          </div>
        )}
    </div>
  );
}
