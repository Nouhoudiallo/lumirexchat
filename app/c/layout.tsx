import Wrapper from '@/src/components/custom/wrapper'
import React from 'react'

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <Wrapper>
      {children}
    </Wrapper>
  )
}
