// components/MarkdownRenderer.tsx
import {
  Fragment,
  ReactElement,
  createElement,
  useEffect,
  useState,
} from "react";
import * as prod from "react/jsx-runtime";
import rehypeParse from "rehype-parse";
import rehypeReact from "rehype-react";
import { unified } from "unified";

interface MarkdownRendererProps {
  markdown: string;
}

// @ts-expect-error: the react types are missing.
const production = { Fragment: prod.Fragment, jsx: prod.jsx, jsxs: prod.jsxs };

export default function MarkdownRenderer({
  markdown,
}: MarkdownRendererProps): ReactElement {
  const [Content, setContent] = useState(createElement(Fragment));

  useEffect(
    function () {
      (async function () {
        const file = await unified()
          .use(rehypeParse, { fragment: true })
          .use(rehypeReact, production)
          .process(markdown);

        setContent(file.result);
      })();
    },
    [markdown],
  );

  //   const Content = useMemo(() => {
  //     // unified 프로세서 설정
  //     const processor = unified()
  //       .use(rehypeParse, { fragment: true }) // 마크다운을 파싱
  //       .use(rehypeReact, production)

  //     // 처리된 컨텐츠를 React 요소로 변환
  //     const result = processor.processSync(markdown).result;

  //     return result;
  //   }, [markdown]);

  return <>{Content}</>;
}
