export const framework: { label: string; value: string; lang: string }[] = [
  {
    label: "FastAPI",
    value: "FastAPI",
    lang: "python",
  },
  {
    label: "Spring Boot",
    value: "Spring Boot",
    lang: "java",
  },
  {
    label: "Gin",
    value: "Gin",
    lang: "golang",
  },
  {
    label: "Django",
    value: "Django",
    lang: "python",
  },
  {
    label: "Flask",
    value: "Flask",
    lang: "python",
  },
  {
    label: "Express",
    value: "Express",
    lang: "javascript",
  },
  {
    label: "Nestjs",
    value: "Nestjs",
    lang: "typescript",
  },
  {
    label: "Asp.Net Core",
    value: "Asp.Net Core",
    lang: "csharp",
  },
];

export function getLangByFramework(frameworkName: string) {
  return framework.filter((f) => f.value === frameworkName)[0].lang;
}
