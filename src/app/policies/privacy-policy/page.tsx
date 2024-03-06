import MarkdownRenderer from "@/components/Markdown/MarkdownRenderer";

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto w-full max-w-[60rem]">
      <section className="flex w-full flex-col items-center py-40">
        <h3 className="underline">법률 & 개인 정보 보호</h3>
        <h1 className="mb-8 mt-4 text-6xl font-bold">개인정보처리방침</h1>
        <p className="text-center text-lg">
          AI Workers가 사용자의 데이터를 관리하는 방법을 명확히 이해하려면
          개인정보처리방침을 읽어 보세요. AI Workers는 투명성을 최우선시하여
          서비스를 제공하는 동안 사용자의 프라이버시와 보안을 보장합니다.
        </p>
        <div className="mt-10 w-full text-start text-lg">
          <MarkdownRenderer
            content={`
## 1. 수집하는 개인정보 항목 및 수집 방법
* 수집하는 개인정보의 항목: 저희 웹사이트는 서비스 제공을 위해 최소한의 개인정보만을 수집합니다. 주로 수집하는 정보는 다음과 같습니다:
  * 이메일 주소
  * 기타 서비스 이용 과정에서 사용자가 자발적으로 제공하는 개인정보
* 개인정보 수집 방법: AI Worker는 다음과 같은 방법으로 개인정보를 수집합니다.
  * 웹사이트를 통한 회원가입, 서비스 이용
  * 생성 정보 수집 툴을 통한 정보 수집

## 2. 개인정보의 수집 및 이용 목적
AI Workers는 수집한 개인정보를 다음의 목적을 위해 사용합니다.

* 회원 관리
* 서비스 개선 및 맞춤형 서비스 제공

## 3. 개인정보의 보유 및 이용 기간
귀하의 개인정보는 서비스 이용 계약 체결(회원 가입) 시점부터 서비스 이용 계약 해지(회원 탈퇴) 시까지 AI Workers에서 보유 및 이용합니다. 다만, 관련 법령 또는 AI Workers의 개인정보 보유 기간 정책에 따라 일부 정보는 서비스 이용 후 일정 기간 동안 보유할 수 있습니다.

## 4. 개인정보의 파기 절차 및 방법
AI Workers는 개인정보 보유 기간의 경과, 처리 목적 달성 등 개인정보가 불필요하게 되었을 경우에는 지체 없이 해당 개인정보를 파기합니다. 파기 절차 및 방법은 다음과 같습니다.

* 파기 절차: 사용자가 제공한 개인정보는 목적이 달성된 후 내부 방침 및 기타 관련 법령에 따라 일정 기간 저장된 후 파기됩니다.
* 파기 방법: 전자적 파일 형태의 정보는 기록을 재생할 수 없는 기술적 방법을 사용하여 삭제하니다.

## 5. 사용자의 권리와 그 행사 방법
* 정보주체는 AI Workers에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다.
  1. 개인정보 열람 요구
  2. 오류 등이 있을 경우 정정 요구
  3. 삭제 요구
  4. 처리 정지 요구
  5. 이러한 권리 행사는 AI Workers에 대한 서면, 전화, 이메일 등을 통하여 할 수 있으며, AI Workers은 이에 대해 지체 없이 조치하겠습니다.

## 6. 개인정보 처리에 관한 추가 정보
**AI Workers에 업로드된 모든 파일은 처리 후 2시간 후(사용자가 즉시 삭제 가능)에 서버에서 삭제됩니다.**
`}
          />
        </div>
      </section>
      <section className=""></section>
    </div>
  );
}
