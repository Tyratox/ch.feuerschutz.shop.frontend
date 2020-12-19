import { defineMessages, useIntl } from "react-intl";
import useSWR from "swr";
import ClipLoader from "react-spinners/ClipLoader";

import { requestAdmin } from "../utilities/request";
import { ADMIN_GET_AVAILABLE_LANGUAGES } from "../gql/admin";
import { colors } from "../utilities/style";
import Select from "./elements/Select";
import { FunctionComponent } from "react";
import styled from "@emotion/styled";
import { GlobalSettings, LanguageCode } from "../schema";

const messages = defineMessages({
  chooseTranslationLanguage: {
    id: "ProductCategories.chooseTranslationLanguage",
    defaultMessage: "Übersetzungssprache wählen",
  },
});

const LanguageChooserWrapper = styled.div`
  display: flex;
  align-items: center;

  span {
    margin-right: 1rem;
  }

  margin-bottom: 2rem;
`;

const LanguageChooser: FunctionComponent<{
  value: string;
  onChange: (language: LanguageCode) => void;
}> = ({ value, onChange }) => {
  const intl = useIntl();

  const { data, error } = useSWR(ADMIN_GET_AVAILABLE_LANGUAGES, (query) =>
    requestAdmin(intl.locale, query).then(
      (response: { globalSettings: GlobalSettings }) =>
        response.globalSettings.availableLanguages.map((l) => ({
          value: l,
        }))
    )
  );

  if (!data) {
    return <ClipLoader loading size={20} color={colors.primary} />;
  }

  return (
    <LanguageChooserWrapper>
      <span>{intl.formatMessage(messages.chooseTranslationLanguage)}</span>
      <Select
        options={data}
        onChange={(option) => onChange(option.value)}
        selected={data.find((l) => l.value === value)}
        mapOptionToLabel={(item) => item.value}
        width={8}
      />
    </LanguageChooserWrapper>
  );
};

export default LanguageChooser;