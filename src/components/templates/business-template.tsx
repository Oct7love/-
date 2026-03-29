import type { ResumeContent } from "@/types/resume";

interface TemplateProps {
  content: ResumeContent;
  primaryColor?: string;
}

export function BusinessTemplate({
  content,
  primaryColor = "#1e3a5f",
}: TemplateProps) {
  const { personalInfo, education, workExperience, projects, skills } = content;

  return (
    <div className="bg-white text-[11px] leading-relaxed text-gray-800 font-sans max-w-[210mm] mx-auto">
      {/* Header — dark professional banner */}
      <div className="px-8 py-5 text-white" style={{ backgroundColor: primaryColor }}>
        <h1 className="text-[22px] font-bold tracking-wide">
          {personalInfo.name || "你的姓名"}
        </h1>
        <div className="mt-1 flex items-center gap-3 text-white/70 text-[10px] flex-wrap">
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
        </div>
      </div>

      {personalInfo.summary && (
        <div className="px-8 py-3 bg-gray-50 border-b text-[11px] text-gray-600 italic">
          {personalInfo.summary}
        </div>
      )}

      <div className="px-8 py-5 space-y-4">
        {workExperience.length > 0 && (
          <section>
            <h2 className="text-[12px] font-bold uppercase tracking-widest pb-1 border-b-2 mb-2" style={{ borderColor: primaryColor, color: primaryColor }}>
              职业经历
            </h2>
            {workExperience.map((exp) => (
              <div key={exp.id} className="mb-3">
                <div className="flex justify-between">
                  <div>
                    <span className="font-bold">{exp.position}</span>
                    <span className="text-gray-400 mx-1">|</span>
                    <span className="font-semibold">{exp.company}</span>
                  </div>
                  <span className="text-[10px] text-gray-400">
                    {exp.startDate} — {exp.isCurrent ? "至今" : exp.endDate}
                  </span>
                </div>
                {exp.highlights.filter(Boolean).length > 0 && (
                  <ul className="mt-1 space-y-0.5 pl-3">
                    {exp.highlights.filter(Boolean).map((h, i) => (
                      <li key={i} className="flex gap-1">
                        <span className="text-gray-300">■</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        )}

        {education.length > 0 && (
          <section>
            <h2 className="text-[12px] font-bold uppercase tracking-widest pb-1 border-b-2 mb-2" style={{ borderColor: primaryColor, color: primaryColor }}>
              教育背景
            </h2>
            {education.map((edu) => (
              <div key={edu.id} className="flex justify-between mb-1">
                <div>
                  <span className="font-semibold">{edu.school}</span>
                  <span className="text-gray-500 ml-2">{edu.degree} · {edu.major}</span>
                </div>
                <span className="text-[10px] text-gray-400">{edu.startDate} — {edu.endDate}</span>
              </div>
            ))}
          </section>
        )}

        {projects.length > 0 && (
          <section>
            <h2 className="text-[12px] font-bold uppercase tracking-widest pb-1 border-b-2 mb-2" style={{ borderColor: primaryColor, color: primaryColor }}>
              项目经历
            </h2>
            {projects.map((proj) => (
              <div key={proj.id} className="mb-2">
                <span className="font-bold">{proj.name}</span>
                {proj.role && <span className="text-gray-500 ml-2">| {proj.role}</span>}
                {proj.description && <p className="text-gray-600 mt-0.5">{proj.description}</p>}
              </div>
            ))}
          </section>
        )}

        {skills.technical.length > 0 && (
          <section>
            <h2 className="text-[12px] font-bold uppercase tracking-widest pb-1 border-b-2 mb-2" style={{ borderColor: primaryColor, color: primaryColor }}>
              核心技能
            </h2>
            <div className="text-gray-700">{skills.technical.join(" · ")}</div>
          </section>
        )}
      </div>
    </div>
  );
}
