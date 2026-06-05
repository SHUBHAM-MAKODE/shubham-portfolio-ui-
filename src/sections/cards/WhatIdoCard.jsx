import React from 'react'
import './WhatIdoCard.css'

const WhatIdoCard = ({ imageUrl, title, description }) => {
  return (
     <div className="whatIdo-card">
            <img src={imageUrl} alt={title} className="whatIdo-icon" />
            <div className="whatIdo-card-text">
              <h3 className="whatIdo-card-title">{title}</h3>
              <p className="whatIdo-card-description">{description}</p>
            </div>
          </div>
  )
}

export default WhatIdoCard
