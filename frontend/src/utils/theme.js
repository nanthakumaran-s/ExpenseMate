import { extendTheme } from "@chakra-ui/react";
import { MultiSelectTheme } from "chakra-multiselect";

const overrides = {
  colors: {
    bg: "#eff3f8",
  },
  components: {
    MultiSelect: MultiSelectTheme,
  },
};
const theme = extendTheme(overrides);

export default theme;
