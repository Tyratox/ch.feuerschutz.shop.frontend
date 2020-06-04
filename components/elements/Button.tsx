import React, { FunctionComponent, ReactNode } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Color from "color";
import ProgressButton from "react-progress-button";

import { colors, borders } from "../../utilities/style";
const DISABLED = Color(colors.secondary).lighten(0.75).rgb().string();

const Clearfix = styled.div`
  &:before,
  &:after {
    content: " ";
    display: table;
  }

  &:after {
    clear: both;
  }
`;

interface IProps {
  float?: "left" | "right";
  state?: string;
  height?: string;
  fullWidth?: boolean;
}

const ButtonWrapper = styled.div<IProps>`
  float: ${({ float }) => float || "none"};

  .pb-container {
    display: inline-block;
    width: ${({ fullWidth }) => (fullWidth ? "100%" : "auto")};
  }
  .pb-container.success .pb-button,
  .pb-container.error .pb-button,
  .pb-container.loading .pb-button {
    height: 2rem;
  }
  .pb-container .pb-button {
    position: relative;
    border: none;

    outline: none;

    width: 100%;
    height: ${({ height }) => height};
    padding: 0.375rem 1rem;
    border-radius: ${borders.radius};

    color: #fff;
    background-color: ${({ state }) =>
      state === "disabled" ? DISABLED : colors.secondary};

    cursor: ${({ state }) =>
      state === "disabled" ? "not-allowed" : "pointer"};

    transition: all 0.3s ease-in-out;
    transition: background-color 0.15s ease-in-out;

    &:hover {
      background-color: ${({ state }) =>
        state === "disabled"
          ? DISABLED
          : Color(colors.secondary).darken(0.25).rgb().string()};
    }
  }
  .pb-container .pb-button span {
    display: inherit;
    transition: opacity 0.3s 0.1s;
  }
  .pb-container .pb-button svg {
    height: 2rem;
    width: 2rem;
    position: absolute;
    transform: translate(-50%, -50%);
    pointer-events: none;
  }
  .pb-container .pb-button svg path {
    opacity: 0;
    fill: none;
  }
  .pb-container .pb-button svg.pb-progress-circle {
    animation: ${({ state }) =>
      state === "loading"
        ? "spin 0.9s infinite cubic-bezier(0.085, 0.26, 0.935, 0.71)"
        : "none"};
  }
  .pb-container .pb-button svg.pb-progress-circle path {
    stroke: ${colors.secondary};
    stroke-width: 5;
  }
  .pb-container .pb-button svg.pb-checkmark path,
  .pb-container .pb-button svg.pb-cross path {
    stroke: #fff;
    stroke-linecap: round;
    stroke-width: 4;
  }
  .pb-container.disabled .pb-button {
    cursor: not-allowed;
  }
  .pb-container.loading .pb-button {
    width: ${({ height }) => height};
    border-width: 6.5px;
    border-color: #ddd;
    cursor: wait;
    background-color: transparent;
    padding: 0;
  }
  .pb-container.loading .pb-button span {
    transition: all 0.15s;
    opacity: 0;
    display: none;
  }
  .pb-container.loading .pb-button .pb-progress-circle > path {
    transition: opacity 0.15s 0.3s;
    opacity: 1;
  }
  .pb-container.success .pb-button {
    background-color: ${colors.success};
  }
  .pb-container.success .pb-button span {
    transition: all 0.15s;
    opacity: 0;
    display: none;
  }
  .pb-container.success .pb-button .pb-checkmark > path {
    opacity: 1;
  }
  .pb-container.error .pb-button {
    background-color: ${colors.danger};
  }
  .pb-container.error .pb-button span {
    transition: all 0.15s;
    opacity: 0;
    display: none;
  }
  .pb-container.error .pb-button .pb-cross > path {
    opacity: 1;
  }
  @keyframes spin {
    from {
      transform: translate(-50%, -50%) rotate(0deg);
      transform-origin: center center;
    }
    to {
      transform: translate(-50%, -50%) rotate(360deg);
      transform-origin: center center;
    }
  }
`;

/**
 * A extended version of a progress button
 */

const Button: FunctionComponent<{
  state?: string;
  controlled?: boolean;
  classNamespace?: string;
  durationError?: number;
  durationSuccess?: number;
  onClick?: (e: any) => Promise<any> | any;
  onError?: () => void;
  onSuccess?: () => void;
  type?: string;
  form?: string;
  shouldAllowClickOnLoading?: boolean;
  height?: string;
  fullWidth?: boolean;
  float?: "left" | "right";
  children: ReactNode;
}> = ({
  state = "",
  controlled,
  classNamespace,
  durationError,
  durationSuccess,
  onClick,
  onError,
  onSuccess,
  type,
  form,
  shouldAllowClickOnLoading,
  height,
  fullWidth,
  float,
  children,
}) => {
  return (
    <div>
      <ButtonWrapper
        height={height || "auto"}
        fullWidth={fullWidth}
        float={float}
        state={state}
      >
        <ProgressButton
          controlled={controlled}
          classNamespace={classNamespace}
          durationError={durationError}
          durationSuccess={durationSuccess}
          onClick={onClick}
          onError={onError}
          onSuccess={onSuccess}
          state={state}
          type={type}
          form={form}
          shouldAllowClickOnLoading={shouldAllowClickOnLoading}
        >
          {children}
        </ProgressButton>
      </ButtonWrapper>
      {float && <Clearfix />}
    </div>
  );
};

export default Button;