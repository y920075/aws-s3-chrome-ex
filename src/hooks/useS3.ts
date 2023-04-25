import { useContext } from "react";
import { Context } from "../contexts/S3Provider";

const useS3 = () => useContext(Context);

export default useS3;
