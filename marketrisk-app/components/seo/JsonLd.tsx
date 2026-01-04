// Component for rendering JSON-LD structured data
// Use this in Next.js pages to add Schema.org markup

interface JsonLdProps {
  data: object | object[]
}

/**
 * Renders JSON-LD structured data script tag
 * Can accept single schema or array of schemas
 */
export function JsonLd({ data }: JsonLdProps) {
  const schemas = Array.isArray(data) ? data : [data]

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema, null, 0), // Compact JSON for production
          }}
        />
      ))}
    </>
  )
}
