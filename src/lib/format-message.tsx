import type React from "react"

export function formatMessageContent(content: string): React.ReactNode {
  // Split content by paragraphs
  const paragraphs = content.split("\n\n")

  return (
    <>
      {paragraphs.map((paragraph, index) => (
        <p key={index} className={index > 0 ? "mt-4" : ""}>
          {paragraph}
        </p>
      ))}
    </>
  )
}
