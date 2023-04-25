import FullScreenSpinner from "./Spinner/FullScreenSpinner";
import { ErrorAlert, SuccessAlert } from "./Alert";

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
        await mutateAsync(file);
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
            <span className="label-text">Upload an Image</span>
          </label>
          <input
            type="file"
            className="file-input file-input-bordered w-full"
            name="file"
            accept="image/*"
          />
        </div>
        <button className="btn btn-primary" disabled={isLoading}>
          Upload
        </button>
      </form>
      <div className="mt-4">
        {isSuccess && (
          <>
            <SuccessAlert>上傳成功！</SuccessAlert>
            <div className="mockup-code">
              <pre data-prefix="$">
                <code>![]({data})</code>
              </pre>
            </div>
          </>
        )}
        {isError && <ErrorAlert>上傳失敗！</ErrorAlert>}
      </div>
    </>
  );
};

export default UploadForm;
