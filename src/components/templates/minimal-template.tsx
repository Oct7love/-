import type { ResumeContent } from "@/types/resume";

interface TemplateProps {
  content: ResumeContent;
  primaryColor?: string;
  secondaryColor?: string;
}

export function MinimalTemplate({
  content,
  primaryColor = "#059669",
  secondaryColor = "#64748B",
}: TemplateProps) {
  const { personalInfo, education, workExperience, projects, skills } = content;

  return (
    <div className="bg-white p-8 text-[11px] leading-relaxed text-gray-800 font-sans max-w-[210mm] mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold" style={{ color: primaryColor }}>
          {personalInfo.name || "你的姓名"}
        </h1>
        <div className="mt-2 flex items-center justify-center gap-3 text-gray-500 flex-wrap">
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
        </div>
        {personalInfo.summary && (
          <p className="mt-3 max-w-xl mx-auto text-gray-600">
            {personalInfo.summary}
          </p>
        )}
      </div>

      <div className="h-px w-full" style={{ backgroundColor: primaryColor, opacity: 0.2 }} />

      {/* Education */}
      {education.length > 0 && (
        <section className="mt-4">
          <h2
            className="text-sm font-bold uppercase tracking-wider mb-2"
            style={{ color: primaryColor }}
          >
            教育背景
          </h2>
          {education.map((edu) => (
            <div key={edu.id} className="mb-2">
              <div className="flex justify-between">
                <span className="font-semibold">{edu.school}</span>
                <span className="text-gray-400">
                  {edu.startDate} — {edu.endDate}
                </span>
              </div>
              <div className="text-gray-600">
                {edu.degree} · {edu.major}
                {edu.gpa && ` · GPA: ${edu.gpa}`}
              </div>
              {edu.description && (
                <p className="text-gray-500 mt-0.5">{edu.description}</p>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Work Experience */}
      {workExperience.length > 0 && (
        <section className="mt-4">
          <h2
            className="text-sm font-bold uppercase tracking-wider mb-2"
            style={{ color: primaryColor }}
          >
            工作经历
          </h2>
          {workExperience.map((exp) => (
            <div key={exp.id} className="mb-3">
              <div className="flex justify-between">
                <span className="font-semibold">{exp.company}</span>
                <span className="text-gray-400">
                  {exp.startDate} — {exp.isCurrent ? "至今" : exp.endDate}
                </span>
              </div>
              <div className="text-gray-600 italic">{exp.position}</div>
              {exp.description && (
                <p className="text-gray-600 mt-1">{exp.description}</p>
              )}
              {exp.highlights.filter(Boolean).length > 0 && (
                <ul className="mt-1 space-y-0.5 list-disc pl-4">
                  {exp.highlights.filter(Boolean).map((h, i) => (
                    <li key={i} className="text-gray-700">
                      {h}
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
        <section className="mt-4">
          <h2
            className="text-sm font-bold uppercase tracking-wider mb-2"
            style={{ color: primaryColor }}
          >
            项目经历
          </h2>
          {projects.map((proj) => (
            <div key={proj.id} className="mb-3">
              <div className="flex justify-between">
                <span className="font-semibold">{proj.name}</span>
                {proj.startDate && (
                  <span className="text-gray-400">
                    {proj.startDate} — {proj.endDate || "至今"}
                  </span>
                )}
              </div>
              {proj.role && (
                <div className="text-gray-600 italic">{proj.role}</div>
              )}
              {proj.description && (
                <p className="text-gray-600 mt-1">{proj.description}</p>
              )}
              {proj.techStack.length > 0 && (
                <div className="mt-1 flex gap-1 flex-wrap">
                  {proj.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="inline-block px-1.5 py-0.5 rounded text-[10px]"
                      style={{
                        backgroundColor: primaryColor + "15",
                        color: primaryColor,
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Skills */}
      {(skills.technical.length > 0 || skills.soft.length > 0) && (
        <section className="mt-4">
          <h2
            className="text-sm font-bold uppercase tracking-wider mb-2"
            style={{ color: primaryColor }}
          >
            技能特长
          </h2>
          {skills.technical.length > 0 && (
            <div className="mb-1">
              <span className="font-semibold">技术技能：</span>
              {skills.technical.join(" · ")}
            </div>
          )}
          {skills.soft.length > 0 && (
            <div className="mb-1">
              <span className="font-semibold">软技能：</span>
              {skills.soft.join(" · ")}
            </div>
          )}
          {skills.certifications.length > 0 && (
            <div>
              <span className="font-semibold">证书：</span>
              {skills.certifications.join(" · ")}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
