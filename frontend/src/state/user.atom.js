import { atom } from "recoil";

export const userAtom = atom({
  key: "user",
  default: {
    email: "",
    name: "",
    avatar: "",
    balance: "",
  },
});
