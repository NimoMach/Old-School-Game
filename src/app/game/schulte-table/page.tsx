'use client'
import { useEffect, useState } from 'react'
import styles from './page.module.css'

const generateShuffledNumbers = (): number[] => {
  const numbers = Array.from({ length: 25 }, (_, i) => i + 1)
  for (let i = numbers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[numbers[i], numbers[j]] = [numbers[j], numbers[i]]
  }
  return numbers
}

const SchulteTable = () => {
  const [numbers, setNumbers] = useState<number[]>([])
  const [nextNumber, setNextNumber] = useState(1)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [highlighted, setHighlighted] = useState<number | null>(null)
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    startNewGame()
  }, [])

  useEffect(() => {
    if (startTime !== null && nextNumber <= 25) {
      const id = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 100) / 10)
      }, 100)
      setIntervalId(id)
      return () => clearInterval(id)
    }
  }, [startTime])

  const startNewGame = () => {
    setNumbers(generateShuffledNumbers())
    setNextNumber(1)
    setStartTime(null)
    setElapsedTime(0)
    setHighlighted(null)
    if (intervalId) clearInterval(intervalId)
  }

  const handleClick = (num: number) => {
    if (num === nextNumber) {
      setHighlighted(num)

      if (num === 1) {
        setStartTime(Date.now())
      }

      if (num === 25 && intervalId) {
        clearInterval(intervalId)
      }

      setTimeout(() => setHighlighted(null), 200)
      setNextNumber(num + 1)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        {nextNumber <= 25 ? (
          <>
            <span className={styles.status}>Next: {nextNumber}</span>
            <span className={styles.status}>Time: {elapsedTime.toFixed(1)}s</span>
          </>
        ) : (
          <span className={styles.status}>🎉 Completed in {elapsedTime.toFixed(1)}s!</span>
        )}
        <button className={styles.restartBtn} onClick={startNewGame}>Restart</button>
      </div>

      <div className={styles.grid}>
        {numbers.map((num) => (
          <div
            key={num}
            className={`${styles.cell} ${highlighted === num ? styles.highlight : ''}`}
            onClick={() => handleClick(num)}
          >
            {num}
          </div>
        ))}
      </div>
    </div>
  )
}

export default SchulteTable
