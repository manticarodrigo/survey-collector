import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export default class Survey extends Component {
  render() {
    let title = this.props.survey.title
    if (this.props.isDraft) {
      title = `${title} (Draft)`
    }

    return (
      <Link className="no-underline ma1" to={`/survey/${this.props.survey.id}`}>
        <h2 className="f3 black-80 fw4 lh-solid">{title}</h2>
        <p className="black-80 fw3">{this.props.survey.text}</p>
      </Link>
    )
  }
}