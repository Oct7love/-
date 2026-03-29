import type { ResumeContent } from "@/types/resume";

interface TemplateProps {
  content: ResumeContent;
  primaryColor?: string;
}

export function TechTemplate({
  content,
  primaryColor = "#059669",
}: TemplateProps) {
  const { personalInfo, education, workExperience, projects, skills } = content;

  return (
    <div className="bg-white text-[11px] leading-relaxed text-gray-800 font-sans max-w-[210mm] mx-auto">
      {/* Header with accent bar */}
      <div className="px-8 py-6" style={{ backgroundColor: primaryColor }}>
        <h1 className="text-2xl font-bold text-white">
          {personalInfo.name || "你的姓名"}
        </h1>
        {personalInfo.summary && (
          <p className="mt-2 text-white/80 max-w-lg">{personalInfo.summary}</p>
        )}
        <div className="mt-3 flex items-center gap-4 text-white/70 flex-wrap text-[10px]">
          {personalInfo.phone && (
            <span className="flex items-center gap-1">
              📱 {personalInfo.phone}
            </span>
          )}
          {personalInfo.email && (
            <span className="flex items-center gap-1">
              📧 {personalInfo.email}
            </span>
          )}
          {personalInfo.location && (
            <span className="flex items-center gap-1">
              📍 {personalInfo.location}
            </span>
          )}
          {personalInfo.links?.map((link) => (
            <span key={link.url} className="flex items-center gap-1">
              🔗 {link.url}
            </span>
          ))}
        </div>
      </div>

      <div className="px-8 py-6 space-y-5">
        {/* Skills - prominent position for tech resumes */}
        {skills.technical.length > 0 && (
          <section>
            <h2
              className="text-xs font-bold uppercase tracking-widest mb-2 pb-1 border-b-2"
              style={{ borderColor: primaryColor, color: primaryColor }}
            >
              技术栈
            </h2>
            <div className="flex gap-1.5 flex-wrap">
              {skills.technical.map((skill) => (
                <span
                  key={skill}
                  className="inline-block px-2 py-1 rounded text-[10px] font-medium"
                  style={{
                    backgroundColor: primaryColor + "12",
                    color: primaryColor,
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Work Experience */}
        {workExperience.length > 0 && (
          <section>
            <h2
              className="text-xs font-bold uppercase tracking-widest mb-2 pb-1 border-b-2"
              style={{ borderColor: primaryColor, color: primaryColor }}
            >
              工作经历
            </h2>
            {workExperience.map((exp) => (
              <div key={exp.id} className="mb-3">
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="font-bold">{exp.position}</span>
                    <span className="text-gray-400 mx-1">@</span>
                    <span className="font-semibold" style={{ color: primaryColor }}>
                      {exp.company}
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-400 shrink-0">
                    {exp.startDate} — {exp.isCurrent ? "至今" : exp.endDate}
                  </span>
                </div>
                {exp.highlights.filter(Boolean).length > 0 && (
                  <ul className="mt-1 space-y-0.5">
                    {exp.highlights.filter(Boolean).map((h, i) => (
                      <li key={i} className="flex gap-1.5">
                        <span style={{ color: primaryColor }}>▸</span>
                        <span className="text-gray-700">{h}</span>
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
          <section>
            <h2
              className="text-xs font-bold uppercase tracking-widest mb-2 pb-1 border-b-2"
              style={{ borderColor: primaryColor, color: primaryColor }}
            >
              项目经历
            </h2>
            {projects.map((proj) => (
              <div key={proj.id} className="mb-3">
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="font-bold">{proj.name}</span>
                    {proj.role && (
                      <span className="text-gray-500 ml-2">| {proj.role}</span>
                    )}
                  </div>
                  {proj.startDate && (
                    <span className="text-[10px] text-gray-400">
                      {proj.startDate} — {proj.endDate || "至今"}
                    </span>
                  )}
                </div>
                {proj.description && (
                  <p className="text-gray-600 mt-0.5">{proj.description}</p>
                )}
                {proj.techStack.length > 0 && (
                  <div className="mt-1 text-[10px] text-gray-500">
                    Tech: {proj.techStack.join(", ")}
                  </div>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <section>
            <h2
              className="text-xs font-bold uppercase tracking-widest mb-2 pb-1 border-b-2"
              style={{ borderColor: primaryColor, color: primaryColor }}
            >
              教育背景
            </h2>
            {education.map((edu) => (
              <div key={edu.id} className="flex justify-between mb-1">
                <div>
                  <span className="font-semibold">{edu.school}</span>
                  <span className="text-gray-500 ml-2">
                    {edu.degree} · {edu.major}
                  </span>
                </div>
                <span className="text-[10px] text-gray-400">
                  {edu.startDate} — {edu.endDate}
                </span>
              </div>
            ))}
          </section>
        )}

        {/* Additional Skills */}
        {(skills.soft.length > 0 || skills.certifications.length > 0) && (
          <section>
            <h2
              className="text-xs font-bold uppercase tracking-widest mb-2 pb-1 border-b-2"
              style={{ borderColor: primaryColor, color: primaryColor }}
            >
              其他
            </h2>
            {skills.soft.length > 0 && (
              <div>软技能: {skills.soft.join(", ")}</div>
            )}
            {skills.certifications.length > 0 && (
              <div>证书: {skills.certifications.join(", ")}</div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
