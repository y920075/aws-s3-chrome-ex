import ConfigForm from "./components/ConfigForm";
import UploadForm from "./components/UploadForm";

import useS3 from "./hooks/useS3";

function App() {
  const { client } = useS3();

  return (
    <div className="p-6 artboard phone-1">
      <h1 className="text-center text-2xl font-bold mb-6">AWS S3 Uploader</h1>
      {client !== null ? <UploadForm /> : <ConfigForm />}
    </div>
  );
}

export default App;
