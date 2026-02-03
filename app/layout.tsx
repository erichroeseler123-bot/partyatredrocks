// app/layout.tsx
import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Party at Red Rocks',
  description: 'Colorado\'s Premier Concert Transportation',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        {/* If there is a <nav> or <header> here, keep it */}
        
        {children} 

        {/* LOOK HERE: If there is a <footer> tag below {children}, 
            DELETE IT to remove the GOSNO LLC text from all pages. 
        */}
      </body>
    </html>
  )
}
