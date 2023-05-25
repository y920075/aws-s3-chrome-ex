import FullScreenSpinner from "src/components/Spinner/FullScreenSpinner";
import { ErrorAlert } from "src/components/Alert";
import HistoryCard from "./HistoryCard";

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
        <div className="pb-10 grid gap-y-2">
          {data?.map(({ s3Url, status, key, requestId }) => (
            <HistoryCard
              key={requestId}
              s3Url={s3Url}
              status={status}
              fileKey={key}
              requestId={requestId}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default HistoryList;
