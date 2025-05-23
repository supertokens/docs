// This component exists only to mark blocks of content that
// should not be included in the llms.txt or plain markdown files
export function RemoveForLLMs({ children }) {
  return <>{children}</>;
}
