import FullScreenSpinner from "src/components/Spinner/FullScreenSpinner";
import { ErrorAlert } from "src/components/Alert";
import HistoryCard from "./HistoryCard";

import useS3 from "src/hooks/useS3";

const HistoryList = () => {
  const { useGetHistory, removeAllHistory } = useS3();

  const { data, isLoading, isError, error } = useGetHistory();
  return (
    <>
      {isLoading && <FullScreenSpinner />}
      {isError ? (
        <ErrorAlert>載入失敗：{JSON.stringify(error)}</ErrorAlert>
      ) : (
        <div>
          <button className="btn py-2 btn-outline" onClick={removeAllHistory}>
            清除所有紀錄
          </button>
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
        </div>
      )}
    </>
  );
};

export default HistoryList;
