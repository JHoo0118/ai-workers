import MarkdownRenderer from "@/components/Markdown/MarkdownRenderer";

export default function SecurityPage() {
  return (
    <div className="mx-auto w-full max-w-[60rem]">
      <section className="flex w-full flex-col items-center py-40">
        <h3 className="underline">보안</h3>
        <h1 className="mb-8 mt-4 text-6xl font-bold">
          데이터 프라이버시 및 보안
        </h1>
        <p className="text-center text-lg">
          AI Workers가 사용자의 개인 정보 보호를 최우선시하는 방법을 알아보세요.
          이 섹션은 AI Workers의 데이터 취급 접근 방식을 요약하여 설명합니다.
        </p>
        <div className="mt-10 w-full text-start text-lg">
          <MarkdownRenderer
            content={`
## 1. AI Workers의 개인정보 보호 정책
AI Workers는 사용자의 데이터를 취급하는 방식을 투명하게 알려 드리고자 합니다. 이 간략한 개요에서는 AI Workers의 접근 방식에 대한 주요 정보를 확인할 수 있습니다.

AI Workers는 다음 원칙을 준수하여 사용자의 개인 정보를 보호하기 위해 최선을 다합니다.
* **데이터 수집**: AI Workers는 서비스를 제공하는 데 꼭 필요한 정보만 수집합니다.
* **데이터 보안**: 사용자의 데이터는 안전하게 저장 및 보호됩니다.
* **데이터 공유**: AI Workers는 사용자의 데이터를 제3자에게 판매하지 않습니다.
* **사용자의 권리**: 사용자에게는 자신의 데이터와 그 사용을 통제할 권한이 있습니다.
* 
## 2. 데이터 보존 및 제거
사용자의 개인 정보를 존중하고 해당 규정을 준수하는 것은 AI Workers 데이터 보존 및 제거 정책의 핵심 원칙입니다. AI Workers의 플랫폼에서 처리되는 모든 파일은 처리 후 2시간 이내에 자동으로 영구 삭제됩니다. 또한 사용자가 다운로드 화면에서 파일을 직접 삭제할 수 있으므로 데이터 수명 주기를 더 주도적으로 통제할 수 있습니다.
`}
          />
        </div>
      </section>
      <section className=""></section>
    </div>
  );
}
