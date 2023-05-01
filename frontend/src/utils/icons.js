import { CiPizza } from "react-icons/ci";
import { MdOutlineLuggage, MdOutlineTheaters } from "react-icons/md";
import { BsBuildings } from "react-icons/bs";
import { VscSymbolMisc } from "react-icons/vsc";
import { FaGraduationCap, FaShapes } from "react-icons/fa";
import { SiFreelancer } from "react-icons/si";
import { RiCoinsLine } from "react-icons/ri";

const size = 30;

export const mapIcons = {
  Food: <CiPizza size={size} />,
  Travel: <MdOutlineLuggage size={size} />,
  Entertainment: <MdOutlineTheaters size={size} />,
  Misc: <VscSymbolMisc size={size} />,
  Education: <FaGraduationCap size={size} />,
  Job: <BsBuildings size={size} />,
  Freelance: <SiFreelancer size={size} />,
  Dividend: <RiCoinsLine size={size} />,
  Others: <FaShapes size={size} />,
};
