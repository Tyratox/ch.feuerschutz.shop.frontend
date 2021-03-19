import React, {
  useState,
  useEffect,
  ReactNode,
  useMemo,
  useCallback,
  useContext,
} from "react";
import { withFormik, Form, FormikProps, FormikErrors } from "formik";
import * as yup from "yup";
import { defineMessages, useIntl, IntlShape } from "react-intl";

import { pathnamesByLanguage } from "../utilities/urls";
import address from "../i18n/address";
import userMessages from "../i18n/user";
import validation from "../i18n/validation";
import { trackPageView } from "../utilities/analytics";
import InputField from "./form/InputField";
import Button from "./elements/Button";
import request from "../utilities/request";
import { GET_CURRENT_CUSTOMER } from "../gql/user";
import { REQUEST_PASSWORD_RESET, LOGIN, REGISTER } from "../gql/authentication";
import Head from "next/head";
import Card from "./layout/Card";
import { useRouter } from "next/router";
import { ABSOLUTE_URL } from "../utilities/api";
import Message from "./elements/Message";
import { mutate } from "swr";
import Flex from "./layout/Flex";
import Box from "./layout/Box";
import { AppContext } from "./AppWrapper";
import { Mutation, RegisterCustomerAccountResult } from "../schema";
import styled from "@emotion/styled";
import { errorCodeToMessage } from "../utilities/i18n";

const messages = defineMessages({
  siteTitle: {
    id: "Login.siteTitle",
    defaultMessage: "Anmelden bei der Hauser Feuerschutz AG",
  },
  siteDescription: {
    id: "Login.siteDescription",
    defaultMessage:
      "Melden Sie sich mit Ihrem Kundenkonto bei der Hauser Feuerschutz AG an um Ihre bisherigen Bestellungen zu sehen oder Ihre Benutzerdaten zu bearbeiten.",
  },
  reset: {
    id: "Login.reset",
    defaultMessage: "Zurücksetzen",
  },
  emailAlreadyExists: {
    id: "Login.emailAlreadyExists",
    defaultMessage: "Diese E-Mail wurde bereits registriert!",
  },
  wrongPassword: {
    id: "Login.wrongPassword",
    defaultMessage: "Das Passwort stimmt nicht!",
  },
  unknownError: {
    id: "Login.unknownError",
    defaultMessage: "Es ist ein unbekannter Fehler aufgetreten!",
  },
  passwordForgotten: {
    id: "Login.passwordForgotten",
    defaultMessage: "Passwort vergessen?",
  },
  confirmationEmail: {
    id: "Login.confirmationEmail",
    defaultMessage: "Sie sollten in Kürze eine E-Mail erhalten.",
  },
  newAccount: {
    id: "Login.newAccount",
    defaultMessage: "Neues Kundenkonto anlegen",
  },
  createAccount: {
    id: "Login.createAccount",
    defaultMessage: "Kundenkonto anlegen",
  },
});

interface IPropsLoginRegister {
  submitText: string;
  message: ReactNode;
  password?: boolean;
  intl: IntlShape;
  action: (email: string, password: string) => Promise<any>;
  callback?: () => void;
}

interface FormValuesLoginRegister {
  email?: string;
  password?: string;
}

const Section = styled.div`
  margin-bottom: 1rem;
`;

/**
 * The inner login form
 */
const InnerLoginRegisterForm = ({
  isValid,
  status = "",
  submitText,
  message = "",
  password = false,
}: IPropsLoginRegister & FormikProps<FormValuesLoginRegister>) => {
  const intl = useIntl();

  return (
    <Form>
      <InputField
        type="text"
        label={intl.formatMessage(address.email)}
        name="email"
        required={true}
      />
      {password && (
        <InputField
          type="password"
          label={intl.formatMessage(userMessages.password)}
          name="password"
          required={true}
        />
      )}
      <br />
      {message}
      <Button fullWidth controlled state={isValid ? status : "disabled"}>
        {submitText}
      </Button>
    </Form>
  );
};

interface IPropsPasswordReset {
  message: ReactNode;
  intl: IntlShape;
  callback: () => void;
}
interface FormValuesPasswordReset {
  email?: string;
}

/**
 * The inner login form
 */
const InnerPasswordResetForm = ({
  isValid,
  status = "",
  message = "",
  intl,
}: IPropsPasswordReset & FormikProps<FormValuesPasswordReset>) => (
  <Form>
    <InputField
      type="text"
      label={intl.formatMessage(address.email)}
      name="email"
      required={true}
    />
    <br />
    {message}
    <Button fullWidth controlled state={isValid ? status : "disabled"}>
      {intl.formatMessage(messages.reset)}
    </Button>
  </Form>
);

const LoginRegisterForm = withFormik<
  IPropsLoginRegister,
  FormValuesLoginRegister
>({
  enableReinitialize: true,
  mapPropsToValues: (props) => ({}),
  validationSchema: ({ password, intl }: IPropsLoginRegister) =>
    yup.object().shape({
      email: yup.string().email().required(),
      password: yup
        .string()
        .when([], (schema) =>
          password ? schema.required() : schema.notRequired()
        ),
    }),
  handleSubmit: (
    { email, password },
    {
      props: { action, intl, callback },
      setStatus,
      setErrors,
      /* setErrors, setValues, setStatus, and other goodies */
    }
  ) => {
    setStatus("loading");
    action(email, password)
      .then(() => {
        setStatus("success");
        if (callback) {
          callback();
        }
        setTimeout(() => {
          setStatus("");
        }, 300);
      })
      .catch((e) => {
        const msg = e && "message" in e ? e.message : JSON.stringify(e);

        setErrors({ password: msg });
        setStatus("error");
        setTimeout(() => setStatus(""), 300);
      });
  },
})(InnerLoginRegisterForm);

const PasswordResetForm = withFormik<
  IPropsPasswordReset,
  FormValuesPasswordReset
>({
  enableReinitialize: true,
  mapPropsToValues: (props) => ({}),
  validationSchema: yup.object().shape({
    email: yup.string().email().required(),
  }),
  handleSubmit: async (
    { email },
    {
      props: { intl, callback },
      setStatus,
      setErrors,
      /* setErrors, setValues, setStatus, and other goodies */
    }
  ) => {
    setStatus("loading");
    try {
      const data = await request<{
        requestPasswordReset: Mutation["requestPasswordReset"];
      }>(intl.locale, REQUEST_PASSWORD_RESET, {
        email,
      });

      if (!("success" in data.requestPasswordReset)) {
        throw new Error(errorCodeToMessage(intl, data.requestPasswordReset));
      }

      setStatus("success");
      setTimeout(() => {
        setStatus("");
        if (callback) {
          callback();
        }
      }, 300);
    } catch (e) {
      const msg = e && "message" in e ? e.message : JSON.stringify(e);

      setErrors({ email: msg });
      setStatus("error");
      setTimeout(() => setStatus(""), 300);
    }
  },
})(InnerPasswordResetForm);

const Login = React.memo(() => {
  const intl = useIntl();
  const router = useRouter();

  const { customer: user, token } = useContext(AppContext);
  const [didRegister, setDidRegister] = useState(false);
  const [didResetPassword, setDidResetPassword] = useState(false);
  const redirect: string | null = useMemo(() => {
    return typeof router.query.redirect === "string"
      ? router.query.redirect
      : null;
  }, [router.query]);

  const login = useCallback(async (email: string, password: string) => {
    const data = await request<{ authenticate: Mutation["authenticate"] }>(
      intl.locale,
      LOGIN,
      { email, password }
    );

    if ("errorCode" in data.authenticate) {
      throw new Error(errorCodeToMessage(intl, data.authenticate));
    }

    mutate([GET_CURRENT_CUSTOMER, token]);

    return true;
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    const data = await request<{
      registerCustomerAccount: RegisterCustomerAccountResult;
    }>(intl.locale, REGISTER, { email, password });

    if ("errorCode" in data.registerCustomerAccount) {
      throw new Error(errorCodeToMessage(intl, data.registerCustomerAccount));
    }

    return true;
  }, []);

  useEffect(() => {
    trackPageView();
  }, []);

  useEffect(() => {
    if (user) {
      router.push(
        `/${intl.locale}/${pathnamesByLanguage.account.languages[intl.locale]}`
      );
    }
  }, [user]);

  return (
    <Card>
      <Head>
        <title>
          {intl.formatMessage(messages.siteTitle)} - Hauser Feuerschutz AG
        </title>
        <meta
          name="description"
          content={intl.formatMessage(messages.siteDescription)}
        />
        <link
          rel="canonical"
          href={`${ABSOLUTE_URL}/${
            pathnamesByLanguage.login.languages[intl.locale]
          }`}
        />
      </Head>
      <Flex flexWrap="wrap">
        <Box width={[1, 1, 1 / 2, 1 / 2]} paddingRight={1} paddingBottom={1}>
          <Section>
            <h1>{intl.formatMessage(userMessages.login)}</h1>
            <LoginRegisterForm
              intl={intl}
              action={login}
              password
              callback={() => {
                if (redirect) {
                  router.push(redirect);
                } else {
                  router.push(
                    `/${intl.locale}/${
                      pathnamesByLanguage.account.languages[intl.locale]
                    }`
                  );
                }
              }}
              submitText={intl.formatMessage(userMessages.login)}
              message={null}
            />
          </Section>
          <Section>
            <h1>{intl.formatMessage(messages.passwordForgotten)}</h1>
            <PasswordResetForm
              intl={intl}
              message={
                didResetPassword && (
                  <Message>
                    {intl.formatMessage(messages.confirmationEmail)}
                  </Message>
                )
              }
              callback={() => setDidResetPassword(true)}
            />
          </Section>
        </Box>
        <Box width={[1, 1, 1 / 2, 1 / 2]} paddingRight={1} paddingBottom={1}>
          <h1>{intl.formatMessage(messages.newAccount)}</h1>
          <LoginRegisterForm
            intl={intl}
            action={register}
            message={
              didRegister && (
                <Message>
                  {intl.formatMessage(messages.confirmationEmail)}
                </Message>
              )
            }
            callback={() => setDidRegister(true)}
            submitText={intl.formatMessage(messages.createAccount)}
          />
        </Box>
      </Flex>
    </Card>
  );
});

export default Login;
