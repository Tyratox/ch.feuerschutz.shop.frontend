import React from "react";
import { connect } from "react-redux";

import PropTypes from "prop-types";
import styled from "styled-components";

import { Flex, Box } from "grid-styled";

import Thumbnail from "containers/Thumbnail";
import Placeholder from "components/Placeholder";
import Link from "components/Link";

import { colors, shadows } from "utilities/style";

import { fetchProduct } from "actions/product";

import { getProductCategories, getProductById } from "reducers";

const StyledProduct = styled.div`
	background-color: #fff;
	box-shadow: ${shadows.y};

	display: flex;
	flex-direction: column;
	height: 100%;

	& > div:first-child {
		position: relative;
		border-bottom: ${colors.background} 1px solid;
		padding-top: 100%;

		& > * {
			position: absolute;
			top: 50%;
			left: 50%;

			width: 90%;
			height: 90%;

			transform: translate(-50%, -50%);

			&.b-height {
				height: 90%;
				width: auto;
			}

			&.b-width {
				width: 90%;
				height: auto;
			}
		}
	}

	& > div:last-child {
		flex: 1 0 auto;
	}

	& > div {
		padding: 0.5rem;
	}
`;

const Title = styled.div`
	font-weight: 500;
`;

const Subtitle = styled.div`
	color: ${colors.fontLight};
	font-size: 0.8rem;
`;

class Product extends React.PureComponent {
	componentWillMount = () => {
		const { id, product, fetchProduct } = this.props;

		if (id > 0 && !product) {
			fetchProduct();
		}
	};

	render = () => {
		const { id: productId, product, categories } = this.props;

		return (
			<Box width={[1 / 2, 1 / 3, 1 / 4, 1 / 6]} px={2} pb={3}>
				<Link to={"/product/" + productId}>
					<StyledProduct>
						<Thumbnail id={product ? product.thumbnailId : -1} />
						<div>
							{product ? <Title>{product.title}</Title> : <Placeholder text />}
							{product ? (
								categories ? (
									categories.map(category => (
										<Subtitle key={category.id}>{category.name}</Subtitle>
									))
								) : (
									""
								)
							) : (
								<Placeholder text />
							)}
						</div>
					</StyledProduct>
				</Link>
			</Box>
		);
	};
}

Product.propTypes = {
	id: PropTypes.number.isRequired
};

const mapStateToProps = (state, { id }) => {
	const product = getProductById(state, id);

	return product
		? {
				product,
				categories: getProductCategories(state).filter(category =>
					product.categoryIds.includes(category.id)
				)
			}
		: {};
};

const mapDispatchToProps = (dispatch, { id }) => ({
	fetchProduct() {
		return dispatch(fetchProduct(id));
	}
});

export default connect(mapStateToProps, mapDispatchToProps)(Product);
