import ConfigForm from "src/components/ConfigForm";
import UploadForm from "src/components/UploadForm";

import useS3 from "src/hooks/useS3";

import settingSvg from "src/images/icons8-settings.svg";

function App() {
  const { clientIsSetup, clear } = useS3();

  return (
    <div className="p-6 artboard phone-1">
      <div className="grid grid-cols-[24px_1fr_24px] items-center mb-6">
        <div />
        <h1 className="text-center text-2xl font-bold ">AWS S3 Uploader</h1>

        {clientIsSetup ? (
          <button type="button" onClick={clear}>
            <img src={settingSvg} />
          </button>
        ) : (
          <div />
        )}
      </div>
      {clientIsSetup ? <UploadForm /> : <ConfigForm />}
    </div>
  );
}

export default App;
