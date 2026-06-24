import ToolPageClient from '@/components/tools/ToolPageClient';

const TOOL_IDS = [
  'json-formatter-pro',
  'regex-tester-ai',
  'base64-toolkit',
  'jwt-neural-debugger',
  'secure-pass-gen',
  'sql-formatter-pro',
  'ip-calculator-pro',
  'svg-path-optimizer',
  'cron-job-scheduler',
  'markdown-live-editor',
] as const;

export async function generateStaticParams() {
  return TOOL_IDS.map((id) => ({ id }));
}

export default async function ToolPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <ToolPageClient params={resolvedParams} />;
}
