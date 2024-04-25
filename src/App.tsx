import { useState } from "react";
import ConfigForm from "src/components/ConfigForm";
import UploadForm from "src/components/UploadForm";
import HistoryList from "src/components/History";

import useS3 from "src/hooks/useS3";

import settingSvg from "src/images/icons8-settings.svg";
import historySvg from "src/images/Outlinehistory.svg";
import uploadSvg from "src/images/OutlineUpload.svg";

function App() {
  const [showHistory, setShowHistory] = useState(false);
  const { clientIsSetup, clear } = useS3();

  return (
    <div className="p-6 artboard phone-1">
      <div className="grid grid-cols-[1fr_56px] items-center mb-6">
        <h1 className="text-center text-2xl font-bold ">AWS S3 Uploader</h1>
        {clientIsSetup ? (
          <div className="flex gap-x-2">
            <button
              className="w-6 h-6"
              type="button"
              onClick={() => {
                setShowHistory(!showHistory);
              }}
            >
              <img src={showHistory ? uploadSvg : historySvg} />
            </button>
            <button
              className="w-6 h-6"
              type="button"
              onClick={() => {
                clear();
                setShowHistory(false);
              }}
            >
              <img src={settingSvg} />
            </button>
          </div>
        ) : (
          <div />
        )}
      </div>
      {showHistory ? (
        <HistoryList />
      ) : clientIsSetup ? (
        <UploadForm />
      ) : (
        <ConfigForm />
      )}
    </div>
  );
}

export default App;
