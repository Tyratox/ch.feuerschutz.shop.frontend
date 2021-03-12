import Wrapper from "../../../../components/layout/Wrapper";
import AccountWrapper from "../../../../components/account/AccountWrapper";
import AccountOrders from "../../../../components/account/AccountOrders";
import { useIntl } from "react-intl";
import { GET_CURRENT_CUSTOMER_ALL_ORDERS } from "../../../../gql/user";
import { useContext } from "react";
import { pathnamesByLanguage } from "../../../../utilities/urls";
import page from "../../../../i18n/page";
import useSWR from "swr";
import request from "../../../../utilities/request";
import { Order, Query } from "../../../../schema";
import { GetStaticProps } from "next";
import { AppContext, withApp } from "../../../../components/AppWrapper";
import { locale, messages } from "../../config";

const Page = () => {
  const intl = useIntl();
  const { token } = useContext(AppContext);
  const { data, error } = useSWR(
    [GET_CURRENT_CUSTOMER_ALL_ORDERS, token],
    (query) =>
      request<{ activeCustomer: Query["activeCustomer"] }>(intl.locale, query)
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
      ]}
    >
      <AccountWrapper>
        <AccountOrders
          orders={data?.activeCustomer?.orders.items}
        ></AccountOrders>
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