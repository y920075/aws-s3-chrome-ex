import FullScreenSpinner from "src/components/Spinner/FullScreenSpinner";
import { ErrorAlert, SuccessAlert } from "src/components/Alert";

import useS3 from "../hooks/useS3";

const UploadForm = () => {
  const { useUploadFile } = useS3();
  const { isLoading, mutateAsync, data, isSuccess, isError } = useUploadFile();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const file = formData.get("file");

    if (file instanceof File) {
      try {
        const url = await mutateAsync(file);

        navigator.clipboard.writeText(url);
      } catch (error) {
        console.error(error);
      }
    }
  };
  return (
    <>
      {isLoading && <FullScreenSpinner />}
      <form
        onSubmit={onSubmit}
        className="flex flex-col items-center justify-center"
      >
        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text">選擇圖片</span>
          </label>
          <input
            type="file"
            className="file-input file-input-bordered w-full"
            name="file"
            accept="image/*"
          />
        </div>
        <button className="btn btn-primary" disabled={isLoading}>
          上傳
        </button>
      </form>
      <div className="mt-4">
        {isSuccess && (
          <>
            <SuccessAlert>上傳成功並保存至剪貼簿！</SuccessAlert>
            <p
              className="py-2"
              onClick={() => {
                navigator.clipboard.writeText(data);
              }}
            >
              {data}
            </p>
          </>
        )}
        {isError && <ErrorAlert>上傳失敗！</ErrorAlert>}
      </div>
    </>
  );
};

export default UploadForm;
