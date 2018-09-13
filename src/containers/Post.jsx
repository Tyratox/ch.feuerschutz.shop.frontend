import React from "react";
import { Helmet } from "react-helmet";
import { connect } from "react-redux";
import { Flex, Box } from "grid-styled";

import Card from "../components/Card";
import { getPostBySlug } from "../reducers";
import { fetchPostIfNeeded } from "../actions/posts";
import { stripTags } from "../utilities";
import Thumbnail from "./Thumbnail";

const ABSOLUTE_URL = process.env.ABSOLUTE_URL;

/**
 * The search page
 * @returns {Component} The component
 */
class Post extends React.PureComponent {
  componentDidMount = () => {
    const { post, fetchPostIfNeeded } = this.props;
    if (!post) {
      fetchPostIfNeeded();
    }
  };
  render = () => {
    const { post = {} } = this.props;
    return (
      <Card>
        <Helmet>
          <title>{stripTags(post.title)}</title>
          <meta name="description" content={stripTags(post.description)} />
          <link rel="canonical" href={ABSOLUTE_URL + "/" + post.slug} />
        </Helmet>
        <h1 dangerouslySetInnerHTML={{ __html: post.title }} />
        <Flex>
          <Box width={[1 / 2, 1 / 2, 1 / 4, 1 / 4]}>
            <Thumbnail id={post.thumbnailId} />
          </Box>
        </Flex>
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </Card>
    );
  };
}

const mapStateToProps = (
  state,
  {
    match: {
      params: { postSlug }
    }
  }
) => ({
  post: getPostBySlug(state, postSlug)
});
const mapDispatchToProps = (
  dispatch,
  {
    match: {
      params: { postSlug }
    }
  }
) => ({
  /**
   * Fetches the current post
   * @returns {Promise} The fetch promise
   */
  fetchPostIfNeeded() {
    return dispatch(fetchPostIfNeeded(postSlug));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Post);