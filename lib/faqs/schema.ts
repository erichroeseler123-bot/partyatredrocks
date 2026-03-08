export type FaqRow = {
  id: string;
  question: string;
  answer: string;
};

export function buildFaqPageJsonLd(rows: FaqRow[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: rows.map((row) => ({
      "@type": "Question",
      name: row.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: row.answer,
      },
    })),
  };
}
