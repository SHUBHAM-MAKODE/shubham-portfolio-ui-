import React, { memo } from 'react'
import Prism from './Prism'

const PrismBackground = memo(() => {
    return (
        <Prism
            animationType="rotate"
            timeScale={0.5}
            height={3.5}
            baseWidth={5.5}
            scale={3.6}
            hueShift={0}
            colorFrequency={1}
            noise={0}
            glow={1}
        />
    )
})

export default PrismBackground
