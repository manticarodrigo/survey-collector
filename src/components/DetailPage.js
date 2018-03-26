import React, { Component, Fragment } from 'react'
import { Query, Mutation } from 'react-apollo'
import { withRouter } from 'react-router-dom'
import gql from 'graphql-tag'
import { DRAFTS_QUERY } from './DraftsPage'
import { FEED_QUERY } from './FeedPage'

class DetailPage extends Component {
  render() {
    return (
      <Query query={SURVEY_QUERY} variables={{ id: this.props.match.params.id }}>
        {({ data, loading, error }) => {
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

          const { survey } = data
          const action = this._renderAction(survey)
          return (
            <Fragment>
              <h1 className="f3 black-80 fw4 lh-solid">{data.survey.title}</h1>
              <p className="black-80 fw3">{data.survey.text}</p>
              {action}
            </Fragment>
          )
        }}
      </Query>
    )
  }

  _renderAction = ({ id, isPublished }) => {
    const publishMutation = (
      <Mutation
        mutation={PUBLISH_MUTATION}
        update={(cache, { data }) => {
          const { drafts } = cache.readQuery({ query: DRAFTS_QUERY })
          const { feed } = cache.readQuery({ query: FEED_QUERY })
          cache.writeQuery({
            query: FEED_QUERY,
            data: { feed: feed.concat([data.publish]) },
          })
          cache.writeQuery({
            query: DRAFTS_QUERY,
            data: {
              drafts: drafts.filter(draft => draft.id !== data.publish.id),
            },
          })
        }}
      >
        {(publish, { data, loading, error }) => {
          return (
            <a
              className="f6 dim br1 ba ph3 pv2 mb2 dib black pointer"
              onClick={async () => {
                await publish({
                  variables: { id },
                })
                this.props.history.replace('/')
              }}
            >
              Publish
            </a>
          )
        }}
      </Mutation>
    )
    const deleteMutation = (
      <Mutation
        mutation={DELETE_MUTATION}
        update={(cache, { data }) => {
          if (isPublished) {
            const { feed } = cache.readQuery({ query: FEED_QUERY })
            cache.writeQuery({
              query: FEED_QUERY,
              data: {
                feed: feed.filter(survey => survey.id !== data.deleteSurvey.id),
              },
            })
          } else {
            const { drafts } = cache.readQuery({ query: DRAFTS_QUERY })
            cache.writeQuery({
              query: DRAFTS_QUERY,
              data: {
                drafts: drafts.filter(draft => draft.id !== data.deleteSurvey.id),
              },
            })
          }
        }}
      >
        {(deleteSurvey, { data, loading, error }) => {
          return (
            <a
              className="f6 dim br1 ba ph3 pv2 mb2 dib black pointer"
              onClick={async () => {
                await deleteSurvey({
                  variables: { id },
                })
                this.props.history.replace('/')
              }}
            >
              Delete
            </a>
          )
        }}
      </Mutation>
    )
    if (!isPublished) {
      return (
        <Fragment>
          {publishMutation}
          {deleteMutation}
        </Fragment>
      )
    }
    return deleteMutation
  }

  deleteSurvey = async id => {
    await this.props.deleteSurvey({
      variables: { id },
    })
    this.props.history.replace('/')
  }

  publishDraft = async id => {
    await this.props.publishDraft({
      variables: { id },
    })
    this.props.history.replace('/')
  }
}

const SURVEY_QUERY = gql`
  query SurveyQuery($id: ID!) {
    survey(id: $id) {
      id
      title
      description
      isPublished
    }
  }
`

const PUBLISH_MUTATION = gql`
  mutation publish($id: ID!) {
    publish(id: $id) {
      id
      isPublished
    }
  }
`

const DELETE_MUTATION = gql`
  mutation deleteSurvey($id: ID!) {
    deleteSurvey(id: $id) {
      id
    }
  }
`

export default withRouter(DetailPage)
