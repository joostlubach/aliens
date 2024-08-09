import React from 'react'
import { ImageProps } from 'react-native'
import { useTimer } from 'react-timer'

export function useImageFlicker(image1: ImageSource, image2: ImageSource, pattern: string) {
  const timer = useTimer()
  
  const timestamps = React.useMemo(
    () => parsePattern(pattern),
    [pattern]
  )

  const [which, setWhich] = React.useState<0 | 1>(timestamps[0][1])

  React.useEffect(() => {
    let index = 0

    const next = () => {
      index = (index + 1) % timestamps.length
      const interval = timestamps[index][0]
      const which = timestamps[index][1]

      setWhich(which)
      timer.debounce(next, interval)
    }

    timer.debounce(next, 0)
  }, [pattern, timer, timestamps])

  return which === 0 ? image1 : image2
}

function parsePattern(pattern: string, step: number = 100): Array<[number, 0 | 1]> {
  let start = 0

  const timestamps: Array<[number, 0 | 1]> = []

  for (let cur = 0; cur < pattern.length; cur++) {
    const char = pattern[cur]
    const prevChar = pattern[cur - 1]
    if (char === prevChar) { continue }

    // Transition from ' ' to '.' or vice versa. Add a section until this point.
    timestamps.push([(cur - start) * step, pattern[start] === '.' ? 1 : 0])
    start = cur
  }

  // Add the final section.
  timestamps.push([(pattern.length - start) * step, pattern[start] === '.' ? 1 : 0])
  return timestamps
}

type ImageSource = ImageProps['source']