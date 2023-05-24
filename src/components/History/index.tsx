import FullScreenSpinner from "src/components/Spinner/FullScreenSpinner";
import { ErrorAlert } from "src/components/Alert";

import useS3 from "src/hooks/useS3";

const HistoryList = () => {
  const { useGetHistory } = useS3();

  const { data, isLoading, isError, error } = useGetHistory();
  return (
    <>
      {isLoading && <FullScreenSpinner />}
      {isError ? (
        <ErrorAlert>載入失敗：{JSON.stringify(error)}</ErrorAlert>
      ) : (
        <div>
          {data?.map((item) => (
            <div key={item.key}>{JSON.stringify(item)}</div>
          ))}
        </div>
      )}
    </>
  );
};

export default HistoryList;
