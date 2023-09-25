import { extendTheme } from "@chakra-ui/react";

import { config } from "./config";
type GlobalStyleProps = { colorMode: "light" | "dark" };
export const theme = extendTheme({
  initialColorMode: "dark",
  useSystemColorMode: false,
  fonts: {
    heading: "Plus Jakarta Sans, sans-serif",
    body: "Plus Jakarta Sans, sans-serif",
  },
  styles: {
    global: (props: GlobalStyleProps) => ({
      body: {
        background: "linear-gradient(to bottom, black, white)", // Gradient background (gray to white)
        color:  "white" ,
      },
      // Style for Webkit scrollbars
      "::-webkit-scrollbar": {
        width: "3px",
      },
      "::-webkit-scrollbar-track": {
        backgroundColor: "black",
      },
      "::-webkit-scrollbar-thumb": {
        backgroundColor: "white",
        borderRadius: "0px",
      },
      // Style for Firefox scrollbars
      scrollbarWidth: "thin",
      scrollbarColor: "limegreen black",
    }),
  },
});