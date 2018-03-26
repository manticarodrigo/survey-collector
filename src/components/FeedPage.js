import React, { Component, Fragment } from 'react'
import Survey from '../components/Survey'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'

export default class FeedPage extends Component {
  render() {
    return (
      <Query query={FEED_QUERY}>
        {({ data, loading, error, refetch }) => {
          if (loading) {
            return (
              <div className="flex w-100 h-100 items-center justify-center pt7">
                <div>Loading ...</div>
              </div>
            )
          }

          if (error) {
            return (
              <div className="flex w-100 h-100 items-center justify-center pt7">
                <div>An unexpected error occured.</div>
              </div>
            )
          }

          return (
            <Fragment>
              <h1>Feed</h1>
              {data.feed &&
                data.feed.map(survey => (
                  <Survey
                    key={survey.id}
                    post={survey}
                    refresh={() => refetch()}
                    isDraft={!survey.isPublished}
                  />
                ))}
              {this.props.children}
            </Fragment>
          )
        }}
      </Query>
    )
  }
}

export const FEED_QUERY = gql`
  query FeedQuery {
    feed {
      id
      text
      title
      isPublished
    }
  }
`
