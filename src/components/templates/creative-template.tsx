import type { ResumeContent } from "@/types/resume";

interface TemplateProps {
  content: ResumeContent;
  primaryColor?: string;
  accentColor?: string;
}

export function CreativeTemplate({
  content,
  primaryColor = "#ec4899",
  accentColor = "#fce7f3",
}: TemplateProps) {
  const { personalInfo, education, workExperience, projects, skills } = content;

  return (
    <div className="bg-white text-[11px] leading-relaxed font-sans max-w-[210mm] mx-auto flex">
      {/* Left sidebar */}
      <div className="w-[35%] p-6 text-white" style={{ backgroundColor: primaryColor }}>
        {/* Avatar placeholder */}
        <div className="w-20 h-20 rounded-full bg-white/20 mx-auto mb-4 flex items-center justify-center text-2xl font-bold">
          {personalInfo.name?.[0] || "?"}
        </div>

        <h1 className="text-center text-lg font-bold">
          {personalInfo.name || "姓名"}
        </h1>

        {/* Contact */}
        <div className="mt-4 space-y-1.5 text-[10px] text-white/80">
          <h3 className="text-[11px] font-bold text-white uppercase tracking-wider">联系方式</h3>
          {personalInfo.phone && <div>{personalInfo.phone}</div>}
          {personalInfo.email && <div>{personalInfo.email}</div>}
          {personalInfo.location && <div>{personalInfo.location}</div>}
        </div>

        {/* Skills */}
        {skills.technical.length > 0 && (
          <div className="mt-5">
            <h3 className="text-[11px] font-bold text-white uppercase tracking-wider mb-2">专业技能</h3>
            <div className="space-y-1.5">
              {skills.technical.map((skill) => (
                <div key={skill} className="flex items-center gap-2">
                  <span className="text-[10px]">{skill}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {skills.certifications.length > 0 && (
          <div className="mt-5">
            <h3 className="text-[11px] font-bold text-white uppercase tracking-wider mb-2">证书</h3>
            {skills.certifications.map((cert) => (
              <div key={cert} className="text-[10px] text-white/80 mb-1">{cert}</div>
            ))}
          </div>
        )}
      </div>

      {/* Right content */}
      <div className="flex-1 p-6 space-y-4">
        {personalInfo.summary && (
          <section>
            <h2 className="text-[12px] font-bold uppercase tracking-wider mb-1" style={{ color: primaryColor }}>
              关于我
            </h2>
            <p className="text-gray-600">{personalInfo.summary}</p>
          </section>
        )}

        {workExperience.length > 0 && (
          <section>
            <h2 className="text-[12px] font-bold uppercase tracking-wider mb-2" style={{ color: primaryColor }}>
              工作经历
            </h2>
            {workExperience.map((exp) => (
              <div key={exp.id} className="mb-3 relative pl-3 border-l-2" style={{ borderColor: primaryColor }}>
                <div className="text-[10px] text-gray-400">
                  {exp.startDate} — {exp.isCurrent ? "至今" : exp.endDate}
                </div>
                <div className="font-bold">{exp.position}</div>
                <div className="text-gray-500 italic">{exp.company}</div>
                {exp.highlights.filter(Boolean).length > 0 && (
                  <ul className="mt-1 space-y-0.5">
                    {exp.highlights.filter(Boolean).map((h, i) => (
                      <li key={i} className="text-gray-600 flex gap-1">
                        <span style={{ color: primaryColor }}>•</span>
                        {h}
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
            <h2 className="text-[12px] font-bold uppercase tracking-wider mb-2" style={{ color: primaryColor }}>
              教育背景
            </h2>
            {education.map((edu) => (
              <div key={edu.id} className="mb-1 pl-3 border-l-2" style={{ borderColor: primaryColor }}>
                <div className="font-semibold">{edu.school}</div>
                <div className="text-gray-500">{edu.degree} · {edu.major}</div>
              </div>
            ))}
          </section>
        )}

        {projects.length > 0 && (
          <section>
            <h2 className="text-[12px] font-bold uppercase tracking-wider mb-2" style={{ color: primaryColor }}>
              项目作品
            </h2>
            {projects.map((proj) => (
              <div key={proj.id} className="mb-2">
                <div className="font-bold">{proj.name}</div>
                {proj.description && <p className="text-gray-600">{proj.description}</p>}
                {proj.techStack.length > 0 && (
                  <div className="mt-1 flex gap-1 flex-wrap">
                    {proj.techStack.map((t) => (
                      <span key={t} className="px-1.5 py-0.5 rounded text-[9px]" style={{ backgroundColor: accentColor, color: primaryColor }}>
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}
