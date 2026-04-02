import { describe, it, expect } from "vitest";
import { siteConfig } from "@/config/site";

describe("siteConfig", () => {
  it("should have required fields", () => {
    expect(siteConfig.name).toBe("ResumeBoost");
    expect(siteConfig.description).toBeTruthy();
    expect(siteConfig.url).toMatch(/^https?:\/\//);
    expect(siteConfig.supportEmail).toMatch(/@/);
  });

  it("should have free plan limits", () => {
    const { free } = siteConfig.limits;
    expect(free.aiDiagnosesPerMonth).toBe(3);
    expect(free.aiRewritesPerMonth).toBe(3);
    expect(free.maxResumes).toBe(3);
    expect(free.maxVersionsPerResume).toBe(5);
  });

  it("should have pro plan with unlimited (-1)", () => {
    const { pro } = siteConfig.limits;
    expect(pro.aiDiagnosesPerMonth).toBe(-1);
    expect(pro.aiRewritesPerMonth).toBe(-1);
    expect(pro.maxResumes).toBe(-1);
    expect(pro.maxVersionsPerResume).toBe(-1);
  });

  it("should have correct pricing", () => {
    expect(siteConfig.plans.free.priceMonthly).toBe(0);
    expect(siteConfig.plans.pro.priceMonthly).toBe(29);
    expect(siteConfig.plans.pro.priceYearly).toBe(249);
    expect(siteConfig.plans.premium.priceMonthly).toBe(59);
    expect(siteConfig.plans.premium.priceYearly).toBe(499);
  });

  it("yearly should be cheaper than 12 * monthly", () => {
    const { pro, premium } = siteConfig.plans;
    expect(pro.priceYearly).toBeLessThan(pro.priceMonthly * 12);
    expect(premium.priceYearly).toBeLessThan(premium.priceMonthly * 12);
  });
});
