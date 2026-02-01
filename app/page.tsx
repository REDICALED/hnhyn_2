'use client'

import { useState } from 'react'

export default function Page() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <h1>Pages 테스트</h1>

      <button onClick={() => setCount(count + 1)}>
        카운트: {count}
      </button>
    </div>
  )
}