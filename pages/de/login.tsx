import Wrapper from "../../components/layout/Wrapper";
import Login from "../../components/Login";
import { useIntl } from "react-intl";
import page from "../../i18n/page";
import { pathnamesByLanguage } from "../../utilities/urls";

const Page = () => {
  const intl = useIntl();
  return (
    <Wrapper
      sidebar={null}
      breadcrumbs={[
        {
          name: intl.formatMessage(page.login),
          url: `/${intl.locale}/${
            pathnamesByLanguage.login.languages[intl.locale]
          }`,
        },
      ]}
    >
      <Login />
    </Wrapper>
  );
};

export default Page;