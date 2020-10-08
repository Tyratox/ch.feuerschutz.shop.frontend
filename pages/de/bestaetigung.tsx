import OrderConfirmation from "../../components/OrderConfirmation";
import { FunctionComponent } from "react";
import Wrapper from "../../components/layout/Wrapper";
import Card from "../../components/layout/Card";
import { useIntl } from "react-intl";
import page from "../../i18n/page";
import { pathnamesByLanguage } from "../../utilities/urls";
import { GetStaticProps } from "next";

const Page: FunctionComponent<{}> = () => {
  const intl = useIntl();

  return (
    <Wrapper
      sidebar={null}
      breadcrumbs={[
        {
          name: intl.formatMessage(page.confirmation),
          url: `/${pathnamesByLanguage.confirmation.languages[intl.locale]}`,
        },
      ]}
    >
      <Card>
        <OrderConfirmation />
      </Card>
    </Wrapper>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  return {
    props: {},
  };
};

export default Page;
