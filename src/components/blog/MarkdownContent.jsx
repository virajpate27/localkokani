// src/components/blog/MarkdownContent.jsx
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function MarkdownContent({ content }) {
  return (
    <div className="prose prose-lg max-w-none prose-headings:font-display prose-headings:text-primary dark:text-white prose-a:text-secondary prose-a:no-underline hover:prose-a:underline prose-strong:text-primary dark:text-white prose-img:rounded-2xl">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}