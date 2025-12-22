"use client";


import { Header } from '@/components/header'

export default function DashboardLayout({ children }) {
  return (
    <div className="dashboard">
      <Header />
      <main>{children}</main>
    </div>
  )
}
