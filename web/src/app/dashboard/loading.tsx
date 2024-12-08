"use client"

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardLoader() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 3000) // Simulate loading for 3 seconds

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="mx-auto max-w-7xl">
        <Header isLoading={isLoading} />
        <div className="mt-8 flex flex-col lg:flex-row">
          <Sidebar isLoading={isLoading} />
          <MainContent isLoading={isLoading} />
        </div>
      </div>
    </div>
  )
}

function Header({ isLoading }: { isLoading: boolean }) {
  return (
    <motion.div
      className="flex h-16 items-center justify-between rounded-xl bg-card px-4 shadow"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Skeleton className="h-8 w-32 rounded-full" />
      <Skeleton className="h-8 w-8 rounded-full" />
    </motion.div>
  )
}

function Sidebar({ isLoading }: { isLoading: boolean }) {
  return (
    <motion.div
      className="mb-8 w-full rounded-xl bg-card p-4 shadow lg:mb-0 lg:mr-8 lg:w-64"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="flex flex-row justify-between lg:flex-col">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="mb-4 h-8 w-8 rounded-full lg:w-full" />
        ))}
      </div>
    </motion.div>
  )
}

function MainContent({ isLoading }: { isLoading: boolean }) {
  return (
    <div className="flex-1">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <CardSkeleton key={i} isLoading={isLoading} delay={i * 0.1} />
        ))}
      </div>
      <ChartSkeleton isLoading={isLoading} />
    </div>
  )
}

function CardSkeleton({ isLoading, delay }: { isLoading: boolean; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 + delay }}
    >
      <Card>
        <CardContent className="p-4">
          <Skeleton className="mb-2 h-4 w-1/2 rounded-full" />
          <Skeleton className="h-8 w-full rounded-full" />
        </CardContent>
      </Card>
    </motion.div>
  )
}

function ChartSkeleton({ isLoading }: { isLoading: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      <Card className="mt-8">
        <CardContent className="p-4">
          <Skeleton className="mb-4 h-4 w-1/4 rounded-full" />
          <Skeleton className="h-40 w-full rounded-xl sm:h-64" />
        </CardContent>
      </Card>
    </motion.div>
  )
}

