import { GetStaticPaths, GetStaticProps } from "next";
import Wrapper from "../../../../components/layout/Wrapper";
import AccountWrapper from "../../../../components/account/AccountWrapper";
import Order from "../../../../components/elements/Order";
import { GET_ORDER_BY_CODE } from "../../../../gql/order";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import useSWR from "swr";
import { useContext } from "react";
import request from "../../../../utilities/request";
import { Order as OrderType, Query } from "../../../../schema";
import Placeholder from "../../../../components/elements/Placeholder";
import { pathnamesByLanguage } from "../../../../utilities/urls";
import page from "../../../../i18n/page";
import { AppContext, withApp } from "../../../../components/AppWrapper";
import { locale, messages } from "../../config";

const Page = () => {
  const intl = useIntl();
  const router = useRouter();
  const { token } = useContext(AppContext);

  const { code } = router.query;

  const { data, error } = useSWR(
    [GET_ORDER_BY_CODE, code, token],
    (query, code) =>
      request<{ orderByCode: Query["orderByCode"] }>(intl.locale, query, {
        code,
      })
  );

  return (
    <Wrapper
      sidebar={null}
      breadcrumbs={[
        {
          name: intl.formatMessage(page.myAccount),
          url: `/${intl.locale}/${
            pathnamesByLanguage.account.languages[intl.locale]
          }`,
        },
        {
          name: intl.formatMessage(page.accountOrders),
          url: `/${intl.locale}/${
            pathnamesByLanguage.account.languages[intl.locale]
          }/${
            pathnamesByLanguage.account.pathnames.orders.languages[intl.locale]
          }`,
        },
        {
          name: typeof code === "string" ? code : "",
          url: `/${intl.locale}/${
            pathnamesByLanguage.account.languages[intl.locale]
          }/${
            pathnamesByLanguage.account.pathnames.orders.languages[intl.locale]
          }/${code}`,
        },
      ]}
    >
      <AccountWrapper>
        <Order order={data?.orderByCode}></Order>
      </AccountWrapper>
    </Wrapper>
  );
};

export default withApp(locale, messages)(Page);

//do everything client side
export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: true,
  };
};