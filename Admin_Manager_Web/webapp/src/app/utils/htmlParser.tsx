import parse, {
  DOMNode,
  domToReact,
  Element,
  HTMLReactParserOptions,
} from "html-react-parser";
import DOMPurify from "dompurify";

export default function htmlParse(
  html: string = "",
  opts?: HTMLReactParserOptions,
) {
  return parse(DOMPurify.sanitize(html), {
    ...{
      replace: (domNode) => replaceNode(domNode, opts),
    },
    ...opts,
  });
}

function replaceNode(domNode: DOMNode, options?: HTMLReactParserOptions) {
  if (domNode instanceof Element && domNode.attribs) {
    const { name, children } = domNode;

    if (name === "abc") {
      return (
        <ul className="ml-5 list-disc">
          {domToReact(children as DOMNode[], options)}
        </ul>
      );
    }

    // if (name === "ul") {
    //   return (
    //     <ul className="ml-5 list-disc">
    //       {domToReact(children as DOMNode[], options)}
    //     </ul>
    //   );
    // }

    // if (name === "ol") {
    //   return (
    //     <ol className="ml-5 list-decimal">
    //       {domToReact(children as DOMNode[], options)}
    //     </ol>
    //   );
    // }

    // if (name === "p") {
    //   return (
    //     <p className="mb-4">{domToReact(children as DOMNode[], options)}</p>
    //   );
    // }

    // Add more custom replacements as needed
  }
}
