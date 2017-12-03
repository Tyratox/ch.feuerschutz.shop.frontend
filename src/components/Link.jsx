import React from "react";
import { connect } from "react-redux";
import { push } from "react-router-redux";

import styled from "styled-components";
import PropTypes from "prop-types";

import { colors } from "style-utilities";

import Flexbar from "components/Flexbar";

const UnstyledLink = styled.div`
	height: 100%;
	cursor: pointer;
`;

const StyledLink = styled(UnstyledLink)`
	color: ${({ negative }) =>
		negative ? colors.primaryContrast : colors.primary};
	text-decoration: underline;
`;

class Link extends React.PureComponent {
	render = () => {
		const {
			dispatch,
			to,
			onClick,
			styled,
			children,
			negative,
			flex
		} = this.props;

		const LinkComponent = styled === false ? UnstyledLink : StyledLink;

		let props = { negative };

		if (to) {
			props.onClick = () => {
				dispatch(push(to));
			};
		} else if (onClick) {
			props.onClick = onClick;
		}

		return (
			<LinkComponent {...props}>
				{flex ? <Flexbar>{children}</Flexbar> : children}
			</LinkComponent>
		);
	};
}

Link.propTypes = {
	children: PropTypes.node,
	to: PropTypes.string,
	onClick: PropTypes.func,
	styled: PropTypes.bool,
	negative: PropTypes.bool
};

export default connect()(Link);
