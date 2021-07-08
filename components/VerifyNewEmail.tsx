import { FunctionComponent, useMemo, useCallback, useState } from "react";
import { IntlShape, defineMessages, useIntl } from "react-intl";
import page from "../i18n/page";
import { UPDATE_CUSTOMER_EMAIL } from "../gql/user";
import Button from "./elements/Button";
import request from "../utilities/request";
import { useRouter } from "next/router";
import Card from "./layout/Card";
import Message from "./elements/Message";
import { pathnamesByLanguage } from "../utilities/urls";
import { Mutation } from "../schema";
import { errorCodeToMessage } from "../utilities/i18n";

const messages = defineMessages({
  verifyNewEmail: {
    id: "VerifyNewEmail.verifyNewEmail",
    defaultMessage: "Neue Email verifizieren und Benutzerkonto anlegen",
  },
});

const VerifyNewEmail: FunctionComponent<{}> = (props) => {
  const intl = useIntl();
  const router = useRouter();
  const token: string | null = useMemo(() => {
    return typeof router.query?.token === "string" ? router.query.token : null;
  }, [router.query]);

  const [error, setError] = useState<string | null>(null);

  const onVerify = useCallback(async () => {
    const data = await request<{
      updateCustomerEmailAddress: Mutation["updateCustomerEmailAddress"];
    }>(intl.locale, UPDATE_CUSTOMER_EMAIL, {
      token,
    });
    if ("errorCode" in data.updateCustomerEmailAddress) {
      setError(errorCodeToMessage(intl, data.updateCustomerEmailAddress));
      return;
    }

    router.push(
      `/${intl.locale}/${pathnamesByLanguage.account.languages[intl.locale]}`
    );
  }, [token, intl.locale, router]);

  return (
    <Card>
      <h2>{intl.formatMessage(page.verifyNewEmail)}</h2>
      <Button onClick={onVerify} controlled state={error ? "disabled" : ""}>
        {intl.formatMessage(messages.verifyNewEmail)}
      </Button>
      {error && (
        <>
          <br />
          <Message>{error}</Message>
        </>
      )}
    </Card>
  );
};

export default VerifyNewEmail;