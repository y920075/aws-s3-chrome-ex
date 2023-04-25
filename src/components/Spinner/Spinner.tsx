import React from "react";

import svg from "./Spinner-1s-200px.svg";

const Spinner = (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
  return <img src={svg} {...props} />;
};

export default Spinner;
