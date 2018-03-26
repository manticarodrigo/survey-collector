import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export default class Survey extends Component {
  render() {
    let title = this.props.survey.title
    if (this.props.isDraft) {
      title = `${title} (Draft)`
    }
    var totalRatings = 0
    var avgRating = null
    if (this.props.survey.ratings) {
      this.props.survey.ratings.forEach(rating => {
        totalRatings += rating.rating
      })
      avgRating = Math.round(totalRatings/this.props.survey.ratings.length)
    }
    let npsMap = {
      0:'Detractor',
      1:'Detractor',
      2:'Detractor',
      3:'Detractor',
      4:'Detractor',
      5:'Detractor',
      6:'Detractor',
      7:'Passive',
      8:'Passive',
      9:'Promoter',
      10:'Promoter', 
    }
    return (
      <Link
        className="no-underline ma1"
        to={`/survey/${this.props.survey.id}`}
      >
        <div style={{backgroundColor: '#fff', padding: '1em', borderRadius: '4px'}}>
          <div style={{display: 'inline-block'}}>
            <h2 className="f3 black-80 fw4 lh-solid">{title}</h2>
            <p className="black-80 fw3">{this.props.survey.text}</p>
          </div>
          <div style={{display: 'inline-block', float:'right'}} >
            <p style={{color: avgRating > 6 ? 'green' : 'orange'}}>Avg Rating: {avgRating}</p>
            <p style={{color: avgRating > 6 ? 'green' : 'orange'}}>NPS: {npsMap[avgRating]}</p>
          </div>
        </div>
      </Link>
    )
  }
}