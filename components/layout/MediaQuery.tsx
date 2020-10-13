import styled from "@emotion/styled";
import { media } from "../../utilities/style";

const b = "display: block";

interface IProps {
  sm?: boolean;
  md?: boolean;
  lg?: boolean;
  xlg?: boolean;
  up?: boolean;
  down?: boolean;
}

export default styled.div<IProps>`
  height: 100%;
  display: none;
  ${({ sm, md, lg, xlg, up, down }) =>
    up
      ? sm
        ? media.minSmall + `{${b}}`
        : md
        ? media.minMedium + `{${b}}`
        : lg
        ? media.minLarge + `{${b}}`
        : xlg
        ? media.minXLarge + `{${b}}`
        : ""
      : down
      ? sm
        ? media.maxSmall + `{${b}}`
        : md
        ? media.maxMedium + `{${b}}`
        : lg
        ? media.maxLarge + `{${b}}`
        : xlg
        ? media.maxXLarge + `{${b}}`
        : ""
      : ""};
`;
