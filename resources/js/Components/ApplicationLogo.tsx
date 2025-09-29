import { SVGAttributes } from "react";
import logo from "/public/logo.svg";

export default function ApplicationLogo(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <img {...props} src={logo} alt="Application Logo" />
  );
}
