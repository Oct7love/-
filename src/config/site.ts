export const siteConfig = {
  name: "Oct7",
  description: "AI 驱动的简历优化平台",
  url: "https://oct7.com",
  supportEmail: "support@oct7.com",

  limits: {
    free: {
      aiDiagnosesPerMonth: 3,
      aiRewritesPerMonth: 3,
      maxResumes: 3,
      maxVersionsPerResume: 5,
    },
    pro: {
      aiDiagnosesPerMonth: -1,
      aiRewritesPerMonth: -1,
      maxResumes: -1,
      maxVersionsPerResume: -1,
    },
  },

  plans: {
    free: {
      name: "免费版",
      priceMonthly: 0,
      priceYearly: 0,
    },
    pro: {
      name: "专业版",
      priceMonthly: 29,
      priceYearly: 249,
    },
    premium: {
      name: "旗舰版",
      priceMonthly: 59,
      priceYearly: 499,
    },
  },
} as const;
