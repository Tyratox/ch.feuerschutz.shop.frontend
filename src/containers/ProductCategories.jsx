import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { Route } from "react-router-dom";
import { push } from "react-router-redux";
import Flex from "components/Flex";
import Link from "components/Link";
import Container from "components/Container";
import Pagination from "components/Pagination";
import CategoryItem from "containers/CategoryItem";
import ProductItem from "containers/ProductItem";
import { fetchProductCategories } from "actions/product/categories";
import { fetchProducts } from "actions/product";
import { fetchAttachments } from "actions/attachments";
import {
  getProducts,
  getProductCategoryChildrenIdsById,
  getProductCategoryById,
  getProductCategoryBySlug
} from "reducers";

const ITEMS_PER_PAGE = 30;

/**
 * Renders all product categories
 * @returns {Component} The component
 */
class ProductCategories extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = { active: window.location.pathname === props.match.url };
  }
  componentWillMount = () => {
    this.loadData();
  };

  /**
   * Lifecycle method
   * @param {Object} prevProps The previous props
   * @returns {void}
   */
  componentDidUpdate = prevProps => {
    const {
      match: {
        params: { categorySlug, page },
        url
      },
      category
    } = this.props;
    if (
      (categorySlug !== prevProps.categorySlug ||
        page !== prevProps.page ||
        (!prevProps.category && category)) &&
      categorySlug &&
      page
    ) {
      this.loadData();
    }

    this.setState({ active: window.location.pathname === url });
  };
  loadData = () => {
    const {
      dispatch,
      categoryIds,
      productIds,
      fetchAllProductCategories,
      fetchProducts
    } = this.props;

    if (!this.state.active) {
      return;
    }

    if (!window.loaded) {
      fetchAllProductCategories();
      window.loaded = true;
    }

    fetchProducts();
  };
  onPageChange = ({ selected }) => {
    const {
      match: {
        params: { categorySlug, page }
      }
    } = this.props;
    this.props.dispatch(
      push("/produkte/" + categorySlug + "/" + (selected + 1))
    );
  };
  render = () => {
    const {
      category,
      categoryIds,
      productIds,
      parents = [],
      match: {
        params: { categorySlug, page },
        url
      }
    } = this.props;
    const { active } = this.state;

    const pathSegments = url.split("/");
    pathSegments.pop();
    const urlWithoutPage = page ? pathSegments.join("/") : url;

    const newParents = categorySlug ? [...parents, categorySlug] : [];

    return (
      <div>
        {active && (
          <Container>
            <Flex flexWrap="wrap">
              {categoryIds.map(categoryId => (
                <CategoryItem
                  key={categoryId}
                  id={categoryId}
                  parents={newParents}
                />
              ))}
            </Flex>
            {categoryIds.length > 0 && productIds.length > 0 && <hr />}
            <Flex flexWrap="wrap">
              {productIds.map(productId => (
                <ProductItem
                  key={productId}
                  id={productId}
                  parents={newParents}
                />
              ))}

              {categoryIds.length === 0 &&
                productIds.length === 0 &&
                new Array(12)
                  .fill()
                  .map((el, index) => <CategoryItem key={index} id={-1} />)}
            </Flex>
            {productIds.length !== 0 && (
              <Pagination
                pageCount={Math.ceil(productIds.length / ITEMS_PER_PAGE)}
                pageRangeDisplayed={5}
                marginPagesDisplayed={1}
                previousLabel={"<"}
                nextLabel={">"}
                forcePage={parseInt(page) - 1}
                onPageChange={this.onPageChange}
              />
            )}
          </Container>
        )}
        <Route
          path={`${urlWithoutPage}/:categorySlug/:page`}
          component={RoutedCategories}
          parents={newParents}
        />
      </div>
    );
  };
}

const mapStateToProps = (
  state,
  {
    match: {
      params: { categorySlug, page }
    }
  }
) => {
  const category = getProductCategoryBySlug(state, categorySlug);

  return {
    categorySlug,
    category,
    categoryIds:
      getProductCategoryChildrenIdsById(
        state,
        categorySlug && category ? category.id : 0
      ) || [],
    productIds: category
      ? getProducts(state)
          .filter(product => product.categoryIds.includes(category.id))
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .map(product => product.id)
          .slice(ITEMS_PER_PAGE * (page - 1), ITEMS_PER_PAGE * page)
      : [],
    page
  };
};

const mapDispatchToProps = (
  dispatch,
  {
    match: {
      params: { categorySlug, page = 1 }
    }
  }
) => ({
  dispatch,
  /**
   * Fetches all product catrgories
   * @param {number} perPage The amount of items per page
   * @param {boolean} visualize Whether the progress should be visualized
   * @returns {Promise} The fetch promise
   */
  fetchAllProductCategories(perPage = ITEMS_PER_PAGE, visualize = true) {
    return dispatch(fetchProductCategories(perPage, visualize));
  },
  /**
   * Fetches the matching products
   * @param {number} [categoryId=null] The category id
   * @param {number} perPage The amount of products per page
   * @param {visualize} visualize Whether the progress should be visualized
   * @returns {Promise} The fetch promise
   */
  fetchProducts(categoryId = null, perPage = ITEMS_PER_PAGE, visualize = true) {
    const numPage = parseInt(page);
    return categoryId
      ? dispatch(
          fetchProducts(
            numPage,
            numPage,
            perPage,
            visualize,
            [],
            [parseInt(categoryId)]
          )
        )
      : Promise.resolve();
  }
});

const mergeProps = (mapStateToProps, mapDispatchToProps, ownProps) => ({
  ...ownProps,
  ...mapStateToProps,
  ...mapDispatchToProps,
  /**
   * Fetches the matching products
   * @param {number} perPage The amount of products per page
   * @param {visualize} visualize Whether the progress should be visualized
   * @returns {Promise} The fetch promise
   */
  fetchProducts(perPage = ITEMS_PER_PAGE, visualize = true) {
    const page = parseInt(ownProps.match.params.page);
    const categoryId = mapStateToProps.category
      ? mapStateToProps.category.id
      : null;
    return mapDispatchToProps.fetchProducts(categoryId, perPage, visualize);
  }
});

const ConnectedCategories = connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(ProductCategories);

const RoutedCategories = withRouter(ConnectedCategories);

export default RoutedCategories;
