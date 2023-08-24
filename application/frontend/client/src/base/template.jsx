import MainContextProvider from "./providers/main";
import BaseTemplateLayout from "../layout/base";

export default function BaseTemplate({ children }) {
  return <MainContextProvider>
    <BaseTemplateLayout>
      {children}
    </BaseTemplateLayout>
  </MainContextProvider>
}
