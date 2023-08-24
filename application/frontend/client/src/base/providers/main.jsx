import ThemeProvider from "./theme";
import RouterProvider from "./router";
import ContextProvider from "./context";

export default function MainContextProvider({ children }) {
  return <>
    <ThemeProvider>
      <ContextProvider>
        <RouterProvider>
          {children}
        </RouterProvider>
      </ContextProvider>
    </ThemeProvider>
  </>
}
