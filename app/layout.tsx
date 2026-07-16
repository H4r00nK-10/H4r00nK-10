import './globals.css';
import type React from 'react';
import type { Metadata } from 'next';
export const metadata: Metadata = { title:'CivicLens AI', description:'AI-powered intelligence for safer communities.' };
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
