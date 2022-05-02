import { useRef, useMemo, memo, MouseEventHandler, MouseEvent, forwardRef, ReactNode } from 'react'
import classNames from 'classnames'
import { useDrag } from './useSliderDrag2'
import { composeRef } from '@/utils/composeRef'
import ownStyles from './slider.module.scss'
import { combineStyles } from '@/utils/combineStyles'

interface SliderProps {
  value: number
  min?: number
  max?: number
  step?: number
  className?: string
  showLabel?: boolean
  labelText?: string | number
  styles?: any
  addonAfter?: ReactNode

  onMouseDown?: MouseEventHandler<HTMLDivElement>
  onMouseUp?: MouseEventHandler<HTMLDivElement>
  onMouseMove?: MouseEventHandler<HTMLDivElement>
  onChange?: (value: number) => void
}

export const Slider2 = memo(forwardRef<HTMLDivElement, SliderProps>((props, ref) => {

  const { value, className, min = 0, max = 100, step = 1, showLabel = true, labelText, styles, addonAfter, onChange, onMouseDown, ...rest } = props

  const s = useMemo(() => combineStyles(ownStyles, styles), [ownStyles, styles])
  const sliderRef = useRef<HTMLDivElement>(null)

  
  const calcValueToOffest = (): number => {
    return Math.round(value / max * 100)
  }

  const onUpdateOffset = () => {
    const val = Math.round(max * (offset.current / 100))
    onChange?.(val)
  }

  const { offset, onStartMove } = useDrag(sliderRef, onUpdateOffset)

  const mouseDownHandler = (e: MouseEvent<HTMLDivElement>) => {
    onStartMove(e)
    onMouseDown?.(e)
  }

  return (
    <div 
      ref={composeRef(sliderRef, ref)}
      className={classNames(s.slider, className)} 
      onMouseDown={mouseDownHandler}
      {...rest}
    >
      <div className={s.rail} />

      <div 
        className={s.track} 
        style={{ width: `${calcValueToOffest()}%` }}
      />

      <div 
        className={s.handle} 
        style={{ left: `${calcValueToOffest()}%` }}
      >
        {showLabel && <span>{labelText ?? Math.round(value)}</span>}
      </div>

      {addonAfter}
    </div>
  )
}))